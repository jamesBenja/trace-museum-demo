"""TRACE Wayfinder v7: verified MoMA art, actual PAMM room catalogue, numbered floor maps and routes."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=62")
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    ctx=browser.new_context(viewport={"width":390,"height":844},
      permissions=["geolocation"],geolocation={"latitude":45.49870,"longitude":-73.57939})
    page=ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
    assert response and response.status==200
    page.wait_for_function("window.TRACE_WAYFINDER && window.TRACE_ROUTING && window.TRACE_DISPLAY && !TRACE_DISPLAY.loading",timeout=45000)
    assert page.evaluate("TRACE_DISPLAY.count('mmfa')")==7
    assert not page.evaluate("TRACE_DISPLAY.isActive('mmfa-cragg')")
    page.locator('[data-tab="map"]').click()
    assert page.locator(".wf-site-map").count()==1
    assert page.locator(".wf-building").count()==5
    assert page.locator('[data-wf-to] option').count()==7
    assert "Mystery Work 1" in page.locator('[data-wf-to] option').first.inner_text()
    assert page.locator('.wf-route-card').count()==1
    assert "Suggested route" in page.locator('.wf-kicker').inner_text()

    # Pavilion for Peace, level-1 passage plus vertical route to level 3.
    page.locator('[data-wf-to]').select_option('mmfa-marrel')
    path=page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert path==["mmfa-entrance","mmfa-peace-1","mmfa-peace-2","mmfa-peace-3"],path
    assert "Level 1 passage" in page.locator('.wf-directions').inner_text()
    assert "elevator to Floor 3" in page.locator('.wf-directions').inner_text()
    assert "Golden Age" in page.locator('.wf-directions').inner_text()
    assert "Mystery Work 1" in page.locator('.wf-route-card').inner_text()
    assert page.locator('.wf-route-overlay').count()==1
    assert page.locator('.wf-route-overlay .wf-route-stroke').count()==1

    # S2 underground passage and Bourgie elevator; avoid false garden-gallery doors.
    page.locator('[data-wf-to]').select_option('mmfa-fortin')
    path=page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert "mmfa-passage" in path and "mmfa-bourgie-s2" in path,path
    assert "mmfa-garden" not in path,path
    assert "S2 underground passage" in page.locator('.wf-directions').inner_text()
    assert "S2 passage to Bourgie" in page.locator('.wf-directions').inner_text()
    assert "elevator to Floor 1" in page.locator('.wf-directions').inner_text()
    assert page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.edges.every(e=>e.type!=='stairs')")
    assert page.locator('.wf-bourgie.selected').count()==1
    assert page.locator('.wf-route-overlay').count()==1

    # Step-free toggle affects the route rather than merely decorating the UI.
    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is False
    assert page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.edges.some(e=>e.type==='stairs')")
    assert "stairs" in page.locator('.wf-directions').inner_text()
    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is True

    # Outdoor works on the map have outdoor walking connections.
    page.locator('[data-wf-to]').select_option('mmfa-eye')
    assert "mmfa-bourgie-front" in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert "Avenue du Musée" in page.locator('.wf-directions').inner_text()
    page.locator('[data-wf-to]').select_option('mmfa-frink')
    assert "mmfa-avenue-du-musee" in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert page.locator('.wf-sculptures.selected').count()==1

    # The Thinker's pavilion is known but floor isn't. Do not assert a specific floor.
    page.locator('[data-wf-to]').select_option('mmfa-rodin')
    assert page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).partial")
    assert "Level 1 passage" in page.locator('.wf-directions').inner_text()
    assert "Ask museum staff for the floor" in page.locator('.wf-directions').inner_text()
    assert "Floor unknown" in page.locator('.wf-route-card').inner_text()

    # Same-room destination and preservation of discovered titles.
    page.locator('[data-wf-from]').select_option('mmfa-peace-3')
    page.locator('[data-wf-to]').select_option('mmfa-witte')
    assert "Same gallery" in page.locator('.wf-route-card').inner_text()
    page.evaluate("""()=>{if(!state.found.includes('mmfa-witte')){state.found.push('mmfa-witte');save();}render()}""")
    assert not "Mystery Work 2" in page.locator('.wf-route-card').inner_text()
    assert page.evaluate("TRACE_DISPLAY.isActive('mmfa-witte')")
    assert page.locator('[data-wf-to] option').count()==7

    # Optional one-shot GPS remains local and never determines an indoor room.
    page.locator('[data-wf-locate]').click()
    page.wait_for_function("document.querySelector('.wf-gps-result')?.textContent.includes('Nearby')",timeout=15000)
    assert "45.4987" not in (page.evaluate("localStorage.getItem('trace-route-plan-v1')") or "")

    # Visit planning remains optional and functional.
    page.locator('.wf-visit summary').click()
    page.locator('[data-tn-mode="all"]').click()
    assert page.evaluate("TRACE_ROUTING.routeWorks().length")==7
    page.locator('[data-tn-mode="custom"]').click()
    assert page.locator('.wf-custom input').count()==7

    # Across other museums, use mapped directions without inventing approvals.
    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="moma"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator(".wf-indoor-map").count()==1
    assert page.locator(".wf-indoor-diagram").count()==1
    assert page.locator('[data-wf-to] option').count()==7
    assert page.evaluate("TRACE_DISPLAY.isActive('moma-lilies')") is False
    assert page.evaluate("TRACE_DISPLAY.isVerified('moma-starry')") is True
    page.locator('[data-wf-to]').select_option('moma-starry')
    assert page.locator('[data-wf-floor="5"].selected').count()==1
    assert page.locator('.wf-gallery-room.selected').count()==1
    assert 'moma-f5-landing' in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert 'moma-501' in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert 'elevator to Floor 5' in page.locator('.wf-directions').inner_text()
    assert page.locator('.wf-indoor-lines .wf-indoor-path').count()>0
    page.locator('[data-wf-floor="4"]').click()
    assert page.locator('[data-wf-floor="4"].selected').count()==1
    page.locator('[data-wf-to]').select_option('moma-brancusi')
    assert page.locator('[data-wf-floor="6"].selected').count()==1
    assert 'moma-six' in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412')===null")
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412',true)!==null")
    page.locator('[data-wf-from]').select_option("moma-405")
    page.locator('[data-wf-to]').select_option("moma-warhol")
    assert page.locator('.wf-directions li').count()>0
    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="pamm"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator(".wf-indoor-map").count()==1
    assert page.locator('[data-wf-to] option').count()==8
    assert page.evaluate("TRACE_DISPLAY.rec('pamm-masks').room")=='pamm-gallery-unconfirmed'
    assert page.evaluate("TRACE_DISPLAY.isVerified('pamm-masks')") is False
    assert 'Gallery location pending' in page.locator('.wf-route-card').inner_text()
    page.locator('[data-wf-to]').select_option('pamm-chaos')
    assert page.evaluate("TRACE_DISPLAY.rec('pamm-chaos').room")=='pamm-18'
    assert 'pamm-18' in page.evaluate("TRACE_WAYFINDER.routePlan(TRACE_WAYFINDER.context()).path.rooms")
    assert page.locator('[data-wf-floor="Outdoor"].selected').count()==1
    page.locator('[data-wf-floor="2"]').click()
    assert page.locator('[data-wf-floor="2"].selected').count()==1
    assert page.locator('.wf-gallery-room').count()>=12
    page.locator('[data-wf-map-start="pamm-f2-3"]').click()
    assert page.evaluate("TRACE_ROUTING.state.start")=='pamm-f2-3'
    page.locator('[data-wf-to]').select_option('pamm-masks')
    assert 'Gallery location pending' in page.locator('.wf-route-card').inner_text()

    for lang,label in [('fr','Carte'),('es','Mapa'),('en','Map')]:
        page.evaluate('(language)=>TRACE_I18N.setLanguage(language)',lang)
        assert page.locator('.wf-header h2').inner_text()==label

    page.evaluate("()=>{TRACE_AUTH.isAdmin=()=>true;tab('museum')}")
    assert page.locator('[data-tn-add-room]').count()==1
    assert page.locator('[data-tn-connect]').count()==1
    assert page.locator('[data-td-active]').count()==8
    assert not errors,errors
    print("WAYFINDER V7 PASS: MMFA/PAMM/MoMA floor maps, actual MoMA locations, unavailable Monet, PAMM pending rooms, accessible routes and admin",flush=True)
    browser.close()
