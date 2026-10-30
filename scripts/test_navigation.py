"""TRACE museum administrator status + official floor-plan routing integration tests."""
from playwright.sync_api import sync_playwright
import os,json
URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=16")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 context=browser.new_context(viewport={"width":390,"height":844},accept_downloads=True)
 page=context.new_page()
 page.set_default_timeout(17000)
 errors=[]
 page.on("pageerror",lambda error:errors.append(str(error)))
 response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 assert response.status==200 and "v2.6" in page.title()
 page.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading && window.TRACE_ROUTING && window.TRACE_V1",timeout=60000)
 assert page.evaluate("ALL.length")==16
 assert page.evaluate("window.TRACE_DISPLAY.activeWorks('mmfa').length")==3
 assert page.evaluate("window.TRACE_DISPLAY.activeWorks('pamm').length")==3
 assert page.evaluate("window.TRACE_DISPLAY.rooms('mmfa').length")>=15
 assert page.evaluate("window.TRACE_DISPLAY.rooms('pamm').length")>=20
 assert "mmfa-museum-map" in page.evaluate("window.TRACE_ROUTING.MAPS.mmfa.url")
 assert "web_map_2025.pdf" in page.evaluate("window.TRACE_ROUTING.MAPS.pamm.url")
 page.locator("[data-tab='quest']").click()
 page.locator("[data-t1-start]").click()
 assert page.locator('.tw-screen').is_visible()
 page.locator('[data-tw-skip]').click()
 assert page.locator("[data-t1-open]").count()==3
 assert page.locator("[data-t1-open='3']").count()==0
 page.locator("[data-tab='map']").click()
 assert "Official museum floor plan" in page.locator("#view").inner_text()
 assert "SUGGESTED GALLERY ORDER" in page.locator("#view").inner_text()
 assert "No room assigned yet" in page.locator("#view").inner_text()
 assert page.locator("a[href*='mmfa-museum-map']").count()>=1
 page.locator("[data-tn-mode='custom']").click()
 assert page.locator("[data-tn-select]").count()==3
 page.locator("[data-tn-select='mmfa-marrel']").check()
 assert page.evaluate("window.TRACE_ROUTING.routeWorks().map(a=>a.id)")==["mmfa-marrel"]
 print("PUBLIC MAP PASS: official plan, route modes, only active works",flush=True)
 # Enter admin workspace and change artwork status. This is a device-only draft.
 page.locator("[data-tab='museum']").click()
 assert page.locator("[data-td-row]").count()==8
 assert page.locator("[data-td-active='mmfa-eye']").is_visible()
 assert page.locator("[data-td-active='mmfa-eye']").is_checked()==False
 assert page.locator("[data-td-room='mmfa-eye'] option").count()>=16
 page.locator("[data-td-active='mmfa-eye']").check()
 assert page.evaluate("window.TRACE_DISPLAY.isActive('mmfa-eye')")
 assert page.evaluate("window.TRACE_DISPLAY.draft!==null")
 assert page.evaluate("window.TRACE_DISPLAY.published.works['mmfa-eye'].active")==False
 # Assign two works to a floor-plan room. Curator confirms on-display for test only.
 page.locator("[data-td-room='mmfa-marrel']").select_option("mmfa-peace-3")
 page.locator("[data-td-verified='mmfa-marrel']").check()
 page.locator("[data-td-room='mmfa-witte']").select_option("mmfa-peace-3")
 page.locator("[data-td-verified='mmfa-witte']").check()
 assert page.evaluate("window.TRACE_DISPLAY.rec('mmfa-marrel').room")=="mmfa-peace-3"
 # Two connected nodes configured by the administrator, never treated as sourced from PDF.
 page.locator("#tn-link-from").select_option("mmfa-entrance")
 page.locator("#tn-link-to").select_option("mmfa-peace-3")
 page.locator("[data-tn-connect]").click()
 assert page.evaluate("window.TRACE_ROUTING.path('mmfa-entrance','mmfa-peace-3')")==["mmfa-entrance","mmfa-peace-3"]
 page.locator("[data-tab='map']").click()
 assert page.locator("[data-tn-mode='custom']").is_visible()
 assert "Golden Age in Holland and Flanders" in page.locator("#view").inner_text()
 assert "ROOM ROUTE FROM CURATOR-CONFIGURED CONNECTIONS" in page.locator("#view").inner_text()
 assert "Staff-entered route" in page.locator("#view").inner_text()
 page.locator("[data-tn-mode='all']").click()
 assert page.evaluate("window.TRACE_ROUTING.routeWorks().length")==4
 assert page.locator("[data-tn-select]").count()==0
 # Museum can take an active work off display; it disappears from routes/quests.
 page.locator("[data-tab='museum']").click()
 page.locator("[data-td-active='mmfa-witte']").uncheck()
 assert page.evaluate("window.TRACE_DISPLAY.isActive('mmfa-witte')")==False
 page.locator("[data-tab='quest']").click()
 assert page.locator("[data-t1-open='1']").count()==0
 assert page.locator("[data-t1-open]").count()==3
 page.locator("[data-tab='map']").click()
 assert page.evaluate("window.TRACE_ROUTING.routeWorks().length")==3
 # Previous discovery remains in the passport even when artwork turns off.
 page.evaluate("""()=>{
   state.found.push('mmfa-witte');state.stage='hub';save();render();
 }""")
 page.locator("[data-tab='album']").click()
 assert "Emanuel de Witte" in page.locator("#view").inner_text()
 assert "Not currently in the visitor route" in page.locator("#view").inner_text()
 print("ADMIN STATUS PASS: active, offline, prior passport, room assignment and connected directions",flush=True)
 # Export includes both museum floor plans' room registries and graph connections.
 page.locator("[data-tab='museum']").click()
 exported=json.loads(page.evaluate("window.TRACE_DISPLAY.exportJSON()"))
 assert exported["works"]["mmfa-eye"]["active"]==True
 assert exported["works"]["mmfa-witte"]["active"]==False
 assert exported["works"]["mmfa-marrel"]["room"]=="mmfa-peace-3"
 assert len(exported["rooms"]["mmfa"])>=15
 assert len(exported["rooms"]["pamm"])>=20
 assert exported["connections"]["mmfa"][0]=={"from":"mmfa-entrance","to":"mmfa-peace-3","type":"corridor"}
 with page.expect_download() as download_info:
  page.locator('[download="display-status.json"]').click()
 assert download_info.value.suggested_filename=="display-status.json"
 # Museum settings are independent.
 page.locator("#venueSwitcher").click()
 page.locator("#venuePicker [data-venue='pamm']").click()
 assert page.evaluate("window.TRACE_DISPLAY.count('pamm')")==3
 page.locator("[data-tab='map']").click()
 assert "PAMM visitor floor plan" in page.locator("#view").inner_text()
 assert page.locator("a[href*='web_map_2025.pdf']").count()>=1
 page.locator("[data-tab='museum']").click()
 assert page.locator("[data-td-row]").count()==8
 assert page.locator("[data-td-room='pamm-chaos'] option").count()>=20
 page.locator("[data-td-active='pamm-chaos']").check()
 page.locator("[data-td-room='pamm-chaos']").select_option("pamm-18")
 page.locator("[data-td-verified='pamm-chaos']").check()
 assert page.evaluate("window.TRACE_DISPLAY.rec('pamm-chaos').room")=="pamm-18"
 page.locator("[data-tab='map']").click()
 page.locator("[data-tn-mode='all']").click()
 assert "Sculpture Garden" in page.locator("#view").inner_text()
 print("PAMM ROUTE PASS: official numbered floor plans, sculpture location, activation",flush=True)
 # Restart remains local. The published defaults aren't silently changed.
 page.reload(wait_until="domcontentloaded")
 page.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=40000)
 assert page.evaluate("window.TRACE_DISPLAY.isActive('pamm-chaos')")
 assert page.evaluate("window.TRACE_DISPLAY.rec('pamm-chaos').room")=="pamm-18"
 page.locator("[data-tab='museum']").click()
 page.once("dialog",lambda dialog:dialog.accept())
 page.locator("[data-td-reset]").click()
 assert page.evaluate("window.TRACE_DISPLAY.draft===null")
 assert page.evaluate("window.TRACE_DISPLAY.isActive('pamm-chaos')")==False
 assert page.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 assert not errors,errors
 print("ALL NAVIGATION/ADMIN TESTS PASSED",flush=True)
 browser.close()
