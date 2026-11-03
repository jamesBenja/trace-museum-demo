"""TRACE Wayfinder v5: pavilion-based location, no invented indoor routes, privacy and regressions."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=51")
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    ctx=browser.new_context(viewport={"width":390,"height":844},
        permissions=["geolocation"],geolocation={"latitude":45.4987,"longitude":-73.57939})
    page=ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
    assert response is not None and response.status==200
    page.wait_for_function("window.TRACE_DISPLAY && !TRACE_DISPLAY.loading && window.TRACE_WAYFINDER && window.TRACE_ROUTING",timeout=45000)
    assert page.evaluate("TRACE_DISPLAY.count('mmfa')")==7
    assert not page.evaluate("TRACE_DISPLAY.isActive('mmfa-cragg')")
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-page').count()==1
    assert page.locator('.wf-map-scroll').count()==1
    assert page.locator('.wf-site-map').count()==1
    assert page.locator('.wf-building').count()==5
    assert page.locator('.wf-route-card').count()==1
    assert page.locator('.wf-header a[href*="mbam.qc.ca"]').count()==1
    assert page.locator('[data-wf-to] option').count()==7
    assert page.locator('[data-wf-to] option').first.inner_text().startswith('Mystery')
    assert page.locator('.wf-site-map').evaluate('(n)=>n.scrollWidth<=n.clientWidth+2')
    assert page.locator('.wf-site-map').evaluate('(n)=>n.clientHeight>160')
    assert "Pavilion layout" in page.locator('.wf-map-caption').inner_text()

    page.locator('[data-wf-to]').select_option('mmfa-fortin')
    assert page.locator('.wf-bourgie.selected').count()==1
    assert "Bourgie" in page.locator('.wf-location-head').inner_text()
    assert "Floor 1" in page.locator('.wf-route-card').inner_text()
    assert "No indoor route confirmed" in page.locator('.wf-route-card').inner_text()
    assert not page.locator('.wf-directions li').count()
    assert page.evaluate("TRACE_DISPLAY.rec('mmfa-fortin').room")=='mmfa-bourgie-1'

    page.locator('[data-wf-to]').select_option('mmfa-riopelle')
    assert "Floor S2" in page.locator('.wf-location-head').inner_text()
    page.locator('[data-wf-to]').select_option('mmfa-fortin')
    page.locator('.wf-floor-tabs [data-wf-work="mmfa-riopelle"]').click()
    assert page.evaluate("TRACE_ROUTING.state.focus")=='mmfa-riopelle'

    page.locator('[data-wf-to]').select_option('mmfa-rodin')
    assert page.locator('.wf-peace.selected').count()==1
    assert "Floor unknown" in page.locator('.wf-route-card').inner_text()
    assert "No indoor route confirmed" in page.locator('.wf-route-card').inner_text()
    page.locator('[data-wf-to]').select_option('mmfa-eye')
    assert page.locator('.wf-bourgie.selected').count()==1
    assert "Outside" in page.locator('.wf-route-card').inner_text()
    page.locator('[data-wf-to]').select_option('mmfa-frink')
    assert page.locator('.wf-sculptures.selected').count()==1

    page.locator('[data-wf-from]').select_option('mmfa-peace-3')
    page.locator('[data-wf-to]').select_option('mmfa-witte')
    assert "Same gallery" in page.locator('.wf-route-card').inner_text()
    assert page.evaluate("TRACE_ROUTING.state.start")=='mmfa-peace-3'
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is True
    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is False
    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is True

    page.locator('.wf-visit summary').click()
    page.locator('[data-tn-mode="all"]').click()
    assert page.evaluate("TRACE_ROUTING.routeWorks().length")==7
    assert page.locator('.wf-stop').count()==7
    page.locator('[data-tn-mode="custom"]').click()
    assert page.locator('.wf-custom input').count()==7
    page.locator('.wf-custom [data-tn-select="mmfa-marrel"]').check()
    assert page.evaluate("TRACE_ROUTING.routeWorks().map(a=>a.id)")==["mmfa-marrel"]

    page.locator('[data-wf-locate]').click()
    page.wait_for_function("document.querySelector('.wf-gps-result')?.textContent.includes('Nearby')",timeout=15000)
    assert "45.4987" not in (page.evaluate("localStorage.getItem('trace-route-plan-v1')") or "")
    assert "45.4987" not in page.locator("#view").inner_text()

    for lang,label in [("fr","Carte"),("es","Mapa"),("en","Map")]:
        page.evaluate("(x)=>TRACE_I18N.setLanguage(x)",lang)
        assert page.locator('.wf-header h2').inner_text()==label

    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="moma"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-site-map').count()==0
    assert page.locator('.wf-floor-overview').count()==1
    assert page.locator('[data-wf-to] option').count()==8
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412')===null")
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412',true)!==null")

    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="pamm"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-floor-overview').count()==1
    assert page.locator('[data-wf-to] option').count()==8

    page.evaluate("()=>{TRACE_AUTH.isAdmin=()=>true;tab('museum')}")
    assert page.locator('[data-tn-add-room]').count()==1
    assert page.locator('[data-tn-connect]').count()==1
    assert page.locator('[data-td-active]').count()==8
    assert not errors,errors
    print("WAYFINDER V5 PASS: recognizable MMFA campus, floor selection, destination privacy, confidence, location and all museums",flush=True)
    browser.close()
