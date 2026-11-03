"""TRACE Wayfinder v4: visitor routing, localization, privacy and admin invariants."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=40")
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    context=browser.new_context(viewport={"width":390,"height":844},permissions=["geolocation"],geolocation={"latitude":45.4987,"longitude":-73.57939})
    page=context.new_page()
    errors=[]
    page.on("pageerror",lambda error:errors.append(str(error)))
    response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
    assert response and response.status==200
    page.wait_for_function("window.TRACE_DISPLAY && !TRACE_DISPLAY.loading && window.TRACE_WAYFINDER && window.TRACE_ROUTING",timeout=45000)
    assert page.evaluate("TRACE_DISPLAY.count('mmfa')")==7
    assert not page.evaluate("TRACE_DISPLAY.isActive('mmfa-cragg')")
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-page').count()==1
    assert page.locator('.wf-map-scroll').count()==1
    assert page.locator('.tn-connectivity').count()==0
    assert page.locator('[data-wf-to] option').count()==7
    assert page.locator('.wf-diagram .wf-pin').count()>=6
    assert page.locator('[data-wf-from] option').count()>=21
    assert page.locator('.wf-header a[target="_blank"]').count()==1
    assert page.locator('.wf-modes button').count()==3
    assert page.evaluate("TRACE_ROUTING.routeWorks().length")==3
    assert page.evaluate("TRACE_DISPLAY.connections('mmfa').every(x=>x.status==='research')")
    assert "Schematic" in page.locator('.wf-tools').inner_text()

    page.locator('[data-wf-to]').select_option('mmfa-fortin')
    assert page.evaluate("TRACE_ROUTING.state.focus")=='mmfa-fortin'
    assert page.evaluate("TRACE_DISPLAY.rec('mmfa-fortin').room")=='mmfa-bourgie-1'
    assert "Floor 1" in page.locator('.wf-route-card').inner_text()
    assert page.locator('.wf-preview-path').count()==1
    assert "Connections unverified" in page.locator('.wf-route-card').inner_text()
    assert page.locator('.wf-verified-path').count()==0

    page.locator('[data-wf-to]').select_option('mmfa-rodin')
    assert "Floor not confirmed" in page.locator('.wf-route-card').inner_text()
    assert page.locator('.wf-preview-path').count()==0
    assert "Use the museum plan" in page.locator('.wf-route-card').inner_text()
    page.locator('[data-wf-to]').select_option('mmfa-eye')
    assert "Outside" in page.locator('.wf-route-card').inner_text()
    assert page.locator('.wf-preview-path').count()==0

    page.locator('[data-wf-from]').select_option('mmfa-peace-3')
    page.locator('[data-wf-to]').select_option('mmfa-witte')
    assert "Here already" in page.locator('.wf-route-card').inner_text()
    assert page.evaluate("TRACE_ROUTING.state.start")=='mmfa-peace-3'
    assert page.locator('.wf-lines .wf-verified-path').count()==0

    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is False
    assert page.locator('[data-wf-access]').get_attribute('aria-pressed')=='false'
    page.locator('[data-wf-access]').click()
    assert page.evaluate("TRACE_ROUTING.state.stepFree") is True

    page.locator('[data-tn-mode="all"]').click()
    assert page.evaluate("TRACE_ROUTING.routeWorks().length")==7
    assert page.locator('.wf-stop').count()==7
    page.locator('[data-tn-mode="custom"]').click()
    assert page.locator('.wf-custom input').count()==7
    page.locator('.wf-custom [data-tn-select="mmfa-marrel"]').check()
    assert page.evaluate("TRACE_ROUTING.routeWorks().map(x=>x.id)")==["mmfa-marrel"]

    page.locator('[data-wf-locate]').click()
    page.wait_for_function("document.querySelector('.wf-gps-result') && document.querySelector('.wf-gps-result').textContent.includes('Near the museum')",timeout=15000)
    assert "45.4987" not in (page.evaluate("localStorage.getItem('trace-route-plan-v1')") or "")
    assert "45.4987" not in page.locator("#view").inner_text()

    page.evaluate("TRACE_I18N.setLanguage('fr')")
    assert page.locator('.wf-header h2').inner_text()=="Carte"
    assert "Éviter les escaliers" in page.locator('.wf-tools').inner_text()
    page.evaluate("TRACE_I18N.setLanguage('es')")
    assert page.locator('.wf-header h2').inner_text()=="Mapa"
    page.evaluate("TRACE_I18N.setLanguage('en')")
    assert page.locator('.wf-header h2').inner_text()=="Map"

    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="moma"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-page').count()==1
    assert page.locator('[data-wf-to] option').count()==8
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412')===null")
    assert page.evaluate("TRACE_ROUTING.route('moma-405','moma-412',true)!==null")
    page.locator("#venueSwitcher").click()
    page.locator('#venuePicker [data-venue="pamm"]').click()
    page.locator('[data-tab="map"]').click()
    assert page.locator('.wf-page').count()==1
    assert page.locator('[data-wf-to] option').count()==8

    page.evaluate("()=>{TRACE_AUTH.isAdmin=()=>true;tab('museum')}")
    assert page.locator('[data-tn-add-room]').count()==1
    assert page.locator('[data-tn-connect]').count()==1
    assert page.locator('[data-td-active]').count()==8
    assert not errors,errors
    print("WAYFINDER V4 PASS: graphical map, destinations, no false turns, accessibility, local GPS, three languages, three museums, admin preserved",flush=True)
    browser.close()
