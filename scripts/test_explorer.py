"""TRACE Explorer (child-first MMFA) regression.

Covers the benchmark journey of a six-year-old leading a family:
start screen and age tiers, treasure trail and room grouping, next-treasure
routing (same room first), clue dock and I-spy, discovery feedback with
Mica's cross-artwork memory, progress persistence over reload, quest reset,
museum switching (other museums untouched), narration, EN/FR/ES content,
touch-target sizes and overflow on phone and iPad, and honest navigation.
"""
import os, json
from playwright.sync_api import sync_playwright

URL = os.getenv("TRACE_TEST_URL", "http://127.0.0.1:8765/?v=explorer")
ROUTE = ['mmfa-rodin', 'mmfa-marrel', 'mmfa-witte', 'mmfa-fortin', 'mmfa-eye', 'mmfa-frink']
SPEECH_STUB = """
window.__spoken=[];
Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak:u=>window.__spoken.push({text:u.text,lang:u.lang}),cancel(){},getVoices:()=>[]}});
window.SpeechSynthesisUtterance=function(t){this.text=t};
"""

def ready(page):
    page.wait_for_function("window.TRACE_EXPLORER && window.TRACE_DISPLAY && !TRACE_DISPLAY.loading && window.__traceRefsFinished===true", timeout=65000)

def boot(browser, **kw):
    ctx = browser.new_context(viewport={"width": kw.get("w", 390), "height": kw.get("h", 844)}, is_mobile=kw.get("mobile", True),
                              has_touch=True, reduced_motion="reduce")
    page = ctx.new_page()
    page.add_init_script(SPEECH_STUB)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded", timeout=45000)
    ready(page)
    return ctx, page, errors

def find(page, art_id):
    """Mark the current artwork as discovered through the real reveal -> story -> game path."""
    assert page.evaluate("A[state.current].id") == art_id, (page.evaluate("A[state.current].id"), art_id)
    page.evaluate("state.result={recognized:true,id:A[state.current].id,method:'test'};state.stage='reveal';render()")
    page.locator('[data-action="v7-story"]').click()
    page.locator('[data-action="v7-puzzle"]').click()
    page.evaluate("window.TRACE_V1.finishPuzzle(true)")
    assert page.evaluate("state.stage") == "success"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])

    # ---------------------------------------------------------------- start
    ctx, page, errors = boot(browser)
    assert page.evaluate("state.venue") == "mmfa"
    assert page.evaluate("document.body.classList.contains('ex-on')")
    assert page.evaluate("TRACE_EXPLORER.tier()") == "little", "First visit must default to Little Explorers"
    assert page.locator(".ex-start .ex-tier").count() == 3
    assert page.locator('.ex-tier.selected[data-t1-age="5-7"]').count() == 1
    # Mica greets aloud on arrival only when auto-read is on (default for 5-7).
    assert any("Mica" in s["text"] for s in page.evaluate("window.__spoken")), "Little Explorers should hear Mica's greeting"
    page.locator('.ex-tier[data-t1-age="teen"]').click()
    assert page.evaluate("TRACE_EXPLORER.tier()") == "curious"
    page.locator('.ex-tier[data-t1-age="5-7"]').click()
    page.locator('[data-t1-mode="family"]').click()
    page.locator("[data-t1-start]").click()
    for sel in ["[data-welcome-skip]", "[data-tw-skip]", "text=Skip intro"]:
        if page.locator(sel).count():
            page.locator(sel).first.click(); break
    assert page.evaluate("state.stage") == "hub"

    # ----------------------------------------------------------------- hub
    assert "A MAGICAL QUEST MAP" in page.locator("#view").inner_text()
    ids = page.locator(".ex-hub [data-t1-open]").evaluate_all("n=>n.map(x=>A[Number(x.dataset.t1Open)].id)")
    assert ids == ROUTE, ids
    stops = page.evaluate("TRACE_EXPLORER.stops().map(s=>({rooms:s.rooms,n:s.works.length}))")
    print("TRAIL STOPS", stops, flush=True)
    assert [s["n"] for s in stops] == [1, 2, 1, 2], stops
    assert stops[3]["rooms"] == ["mmfa-bourgie-front", "mmfa-avenue-du-musee"], "Outdoor works form one sculpture walk"
    assert page.locator(".ex-spot.next").count() == 1
    assert page.locator(".ex-spot.locked[disabled]").count() == 4, "Only two mysteries are open at the start"
    # Legs come from the museum graph, never invented.
    assert page.locator(".ex-leg .ex-chip").count() >= 4
    page.locator("[data-ex-next]").click()
    assert page.evaluate("state.stage") == "clue" and page.evaluate("A[state.current].id") == "mmfa-rodin"

    # ---------------------------------------------------------------- clue
    view = page.locator("#view").inner_text()
    assert "MYSTERY 1 OF 6" in page.locator("#view").text_content()
    assert "Someone is sitting very, very still" in view, "Little Explorer clue must be spoken by Mica"
    assert page.locator(".ex-dock .ex-tile").count() == 3
    assert page.locator('.ex-dock [data-action="scan"], .ex-dock [data-action="photo-quest"]').count() == 1
    assert page.locator('.ex-dock [data-action="map"]').count() == 1
    assert page.locator('[data-action="scan"], [data-action="photo-quest"]').count() == 1, "Dock must move, not duplicate, controls"
    assert page.locator(".ex-where .ex-chip-goal").count() == 1
    assert page.locator(".ex-move").count() == 1, "Little Explorers get a physical observation task"
    # I-spy persists per artwork.
    for i in range(3):
        page.locator('[data-ex-spy="%d"]' % i).click()
    assert page.locator(".ex-spy.complete").count() == 1
    # Help reveals the hint through the original control.
    page.locator('.ex-dock [data-action="hint"]').click()
    assert page.evaluate("state.hints.includes('mmfa-rodin')")
    assert page.locator('[data-action="manual-review"]').count() == 1, "Honest visual-comparison fallback must remain"
    # Recognition entry point is the real scanner, not a bypass.
    page.locator('.ex-dock [data-action="scan"]').click()
    assert page.evaluate("state.stage") == "scan"
    page.locator('[data-action="close"]').click()
    # Narration button speaks the exact clue.
    page.evaluate("window.__spoken=[]")
    page.locator(".t1-companion .ex-say").click()
    assert page.evaluate("window.__spoken[0].text").startswith("Someone is sitting")
    assert page.evaluate("window.__spoken[0].lang") == "en-CA"

    # ------------------------------------------------- discovery & progress
    find(page, "mmfa-rodin")
    assert page.locator(".ex-next-card .ex-room-done").count() == 1, "Rodin completes his room"
    page.locator("[data-ex-advance]").click()
    assert page.evaluate("A[state.current].id") == "mmfa-marrel"
    find(page, "mmfa-marrel")
    card = page.locator(".ex-next-card").inner_text()
    assert "same room" in card, "Next work in the same room must be announced: " + card
    page.locator("[data-ex-advance]").click()
    assert page.evaluate("A[state.current].id") == "mmfa-witte", "Same-room progression"
    # Reveal: Mica refers back to the previous discovery.
    page.evaluate("state.result={recognized:true,id:'mmfa-witte'};state.stage='reveal';render()")
    link = page.locator(".ex-link").inner_text()
    assert "flower painting" in link, link
    page.locator('[data-action="v7-story"]').click()
    assert page.locator(".ex-found .ex-ask").count() == 1
    page.locator('[data-action="v7-puzzle"]').click()
    page.evaluate("window.TRACE_V1.finishPuzzle(true)")
    assert "★" in page.locator(".ex-next-card").inner_text(), "Room complete after both works on Floor 3"
    assert page.locator(".ex-next-card .ex-chip").count() >= 2, "Directions to the next room"

    # Collection
    page.locator('[data-tab="album"]').click()
    assert page.locator(".ex-frame.found").count() == 3
    assert page.locator(".ex-frame.mystery").count() == 3
    # Map: treasure trail + honest location statement, existing wayfinder intact.
    page.locator('[data-tab="map"]').click()
    assert page.locator(".ex-mapcard .ex-stop").count() == 4
    assert page.locator(".ex-stop.done").count() == 2
    assert "does not know where you are" in page.locator(".ex-honest").inner_text()
    assert page.locator(".wf-site-map").count() == 1

    # ----------------------------------------------------------- persistence
    spied_before = page.evaluate("JSON.parse(localStorage.getItem('trace-explorer-v1')).spied['mmfa-rodin']")
    page.reload(wait_until="domcontentloaded"); ready(page)
    assert page.evaluate("state.found.slice().sort()") == sorted(["mmfa-rodin", "mmfa-marrel", "mmfa-witte"])
    assert page.evaluate("TRACE_EXPLORER.tier()") == "little"
    assert page.evaluate("JSON.parse(localStorage.getItem('trace-explorer-v1')).spied['mmfa-rodin']") == spied_before
    page.evaluate("state.tab='quest';state.stage='hub';render()")
    assert page.locator(".ex-spot.found").count() == 3
    assert page.locator(".ex-stop.done").count() == 2

    # --------------------------------------------------------- tiers content
    page.evaluate("state.current=A.findIndex(a=>a.id==='mmfa-fortin');state.stage='clue';render()")
    page.locator('[data-trace-lang="fr"]').click()
    page.evaluate("state.stage='clue';render()")
    assert "Trouve une ville sombre" in page.locator("#view").inner_text()
    page.locator('[data-trace-lang="es"]').click()
    page.evaluate("state.stage='clue';render()")
    assert "Busca un pueblo oscuro" in page.locator("#view").inner_text()
    page.locator('[data-trace-lang="en"]').click()
    page.evaluate("TRACE_V1.prefs.age='teen';state.stage='found';render()")
    assert page.locator(".ex-deep").count() == 1 and "dark ground" in page.locator(".ex-deep").inner_text()
    page.evaluate("TRACE_V1.prefs.age='8-12';state.stage='clue';render()")
    assert page.locator(".t1-word-clue").is_visible(), "Art Detectives keep the written clue"
    page.evaluate("TRACE_V1.prefs.age='5-7';render()")
    assert not page.locator(".t1-word-clue").is_visible(), "Little Explorers see Mica's spoken clue, not a text block"

    # -------------------------------------------------------------- reset
    page.on("dialog", lambda d: d.accept())
    page.evaluate("state.tab='quest';state.stage='hub';render()")
    page.locator(".ex-grownups > summary").click()
    page.locator('.ex-hub [data-action="reset"]').click()
    assert page.evaluate("state.found.length") == 0
    for sel in ["[data-welcome-skip]", "[data-tw-skip]", "text=Skip intro"]:
        if page.locator(sel).count():
            page.locator(sel).first.click(); break
    page.evaluate("state.tab='quest';state.stage='hub';render()")
    assert page.locator(".ex-spot.found").count() == 0

    # ---------------------------------------------------- museum switching
    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="pamm"]').click()
    page.evaluate("state.tab='quest';state.stage='hub';render()")
    assert not page.evaluate("document.body.classList.contains('ex-on')"), "PAMM keeps its existing experience"
    assert page.locator(".ex-hub").count() == 0 and page.locator("[data-t1-open]").count() > 0
    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="mmfa"]').click()
    page.evaluate("state.tab='quest';state.stage='hub';render()")
    assert page.locator(".ex-hub").count() == 1
    assert not errors, errors
    ctx.close()

    # --------------------------------------- layout & touch targets by device
    for name, w, h, mobile in [("phone-320", 320, 640, True), ("phone-390", 390, 844, True), ("iPad-portrait", 768, 1024, True), ("iPad-landscape", 1024, 768, True)]:
        ctx, page, errors = boot(browser, w=w, h=h, mobile=mobile)
        for stage in ["intro", "hub", "clue"]:
            page.evaluate("(s)=>{state.tab='quest';state.current=0;state.stage=s;render()}", stage)
            metrics = page.evaluate("""()=>{
              const sel='.ex-screen button:not(.ex-say):not([disabled]), .ex-screen summary';
              const small=[...document.querySelectorAll(sel)].filter(b=>b.offsetParent&&b.checkVisibility()).map(b=>({t:(b.innerText||b.getAttribute('aria-label')||'').trim().slice(0,24),h:b.getBoundingClientRect().height,w:b.getBoundingClientRect().width})).filter(r=>r.h<44||r.w<44);
              return {overflow:document.documentElement.scrollWidth>innerWidth+2, small}
            }""")
            assert not metrics["overflow"], (name, stage, "horizontal overflow")
            assert not metrics["small"], (name, stage, "touch targets under 44px", metrics["small"])
        say_sizes = page.evaluate("[...document.querySelectorAll('.ex-say')].filter(b=>b.offsetParent).map(b=>Math.round(b.getBoundingClientRect().height*10)/10)")
        assert say_sizes and min(say_sizes) >= 43.5, (name, "narration buttons", say_sizes)
        assert not errors, (name, errors)
        print("EXPLORER LAYOUT PASS", name, flush=True)
        ctx.close()
    browser.close()
print("ALL TRACE EXPLORER (CHILD-FIRST MMFA) TESTS PASSED", flush=True)
