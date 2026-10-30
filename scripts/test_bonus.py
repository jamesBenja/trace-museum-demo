"""End-to-end tests for TRACE interactive bonus: compare two solved artworks, make connections."""
from playwright.sync_api import sync_playwright
import os
URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=14")
SETS={"mmfa":["mmfa-marrel","mmfa-witte","mmfa-fortin"],"pamm":["pamm-masks","pamm-delano","pamm-grid"]}
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
  for museum,arts in SETS.items():
    context=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
    page=context.new_page()
    errors=[]
    page.on("pageerror",lambda exc:errors.append(str(exc)))
    resp=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
    assert resp and resp.status==200 and "v1.7" in page.title(),page.title()
    page.wait_for_function("window.TRACE_BONUS && window.TRACE_V1 && document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=65000)
    if museum=="pamm":
      page.locator("#venueSwitcher").click()
      page.locator("#venuePicker [data-venue='pamm']").click()
    page.evaluate("""(ids)=>{
      state.found=ids.slice();
      state.stage='hub';state.tab='quest';state.current=0;
      save();render();
    }""",arts)
    assert page.locator("[data-bonus-open]").count()==1
    page.locator("[data-bonus-open]").click()
    assert page.evaluate("state.stage")=="bonus"
    assert "Connect the artworks." in page.locator("#view").inner_text()
    for n,(one,two,lens) in enumerate([(0,1,"light"),(0,2,"shapes"),(1,2,"stories")]):
      page.locator("[data-bonus-pick='"+arts[one]+"']").click()
      page.locator("[data-bonus-pick='"+arts[two]+"']").click()
      assert "Swipe between two worlds" in page.locator("#view").inner_text()
      assert page.locator("#tb-slider").count()==1
      # Swipe the real overlaid visual to change what portion of each work is visible.
      wipe=page.locator("#tb-wipe").bounding_box()
      page.mouse.move(wipe["x"]+wipe["width"]*.27,wipe["y"]+wipe["height"]*.52)
      page.mouse.down()
      page.mouse.move(wipe["x"]+wipe["width"]*.78,wipe["y"]+wipe["height"]*.52,steps=9)
      page.mouse.up()
      assert page.evaluate("window.TRACE_BONUS.state.position")>70
      page.locator("[data-bonus-lens='"+lens+"']").click()
      assert page.locator("[data-bonus-finish]").is_disabled()
      page.locator('[data-bonus-observe="left:0"]').click()
      assert page.locator("[data-bonus-finish]").is_disabled()
      page.locator('[data-bonus-observe="right:1"]').click()
      assert page.locator("[data-bonus-finish]").is_enabled()
      assert "A CONNECTION IS FORMING" in page.locator("#view").inner_text()
      page.locator("[data-bonus-finish]").click()
      assert "ART BRIDGE CREATED" in page.locator("#view").inner_text()
      assert "Art Connector badge earned" in page.locator("#view").inner_text()
      assert len(page.evaluate("window.TRACE_BONUS.links()"))==n+1
      if n<2:
        page.locator("[data-bonus-another]").click()
      print("CONNECTED",museum,arts[one],arts[two],lens,flush=True)
    page.locator("[data-action='album']").first.click()
    assert "Art Connector · 3 connections" in page.locator("#view").inner_text()
    page.reload(wait_until="domcontentloaded")
    page.wait_for_function("window.TRACE_BONUS && document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=65000)
    page.locator("[data-tab='album']").click()
    assert "Art Connector · 3 connections" in page.locator("#view").inner_text()
    # Enter bonus from passport and open a previously collected pair.
    page.locator("[data-bonus-open]").click()
    assert page.locator("[data-bonus-pair]").count()==3
    page.locator("[data-bonus-pair='0-1']").click()
    assert page.locator("[data-bonus-lens]").count()==3
    page.locator("[data-bonus-exit]").click()
    assert page.evaluate("state.stage")=="hub"
    # Museum switching never removes badges of the other collection.
    page.locator("#venueSwitcher").click()
    alternate="mmfa" if museum=="pamm" else "pamm"
    page.locator("#venuePicker [data-venue='"+alternate+"']").click()
    assert len(page.evaluate("window.TRACE_BONUS.links()"))==0
    page.locator("#venueSwitcher").click()
    page.locator("#venuePicker [data-venue='"+museum+"']").click()
    assert len(page.evaluate("window.TRACE_BONUS.links()"))==3
    assert not errors,errors
    print("BONUS PASS",museum,"three paired links, 3 lenses, touch drag, album, reload and museum switching",flush=True)
    context.close()
  browser.close()
print("ALL BONUS TESTS PASSED",flush=True)
