"""Mica onboarding: both museums, EN/FR/ES, five scenes, replay, skip and no JS errors."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=20")
EXPECTED={
 "mmfa":{"en":["1860","five pavilions"],"fr":["1860","cinq pavillons"],"es":["1860","cinco pabellones"]},
 "pamm":{"en":["1984","Herzog & de Meuron"],"fr":["1984","Herzog & de Meuron"],"es":["1984","Herzog & de Meuron"]}
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 for museum in ("mmfa","pamm"):
  page=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
  errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  r=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
  assert r and r.status==200
  page.wait_for_function("window.TRACE_V1 && window.TRACE_WELCOME && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=35000)
  if museum=="pamm":
   page.locator("#venueSwitcher").click()
   page.locator('#venuePicker [data-venue="pamm"]').click()
  assert page.evaluate("state.stage")=="intro"
  for lang in ("en","fr","es"):
   page.locator('[data-lang="'+lang+'"]').click()
   assert page.evaluate('state.lang')==lang
   page.locator("[data-t1-start]").click()
   assert page.evaluate("state.stage")=="welcome"
   assert page.locator('.tw-mica').is_visible()
   assert page.locator('.tw-building').is_visible()
   assert page.locator('.tw-screen').get_attribute("lang")==lang
   assert page.locator('[data-tw-next]').count()==1
   assert page.locator('[data-tw-skip]').count()==1
   page.locator('[data-tw-next]').click()
   assert EXPECTED[museum][lang][0] in page.locator('#view').inner_text()
   page.locator('[data-tw-next]').click()
   assert EXPECTED[museum][lang][1] in page.locator('#view').inner_text()
   page.locator('[data-tw-next]').click()
   assert page.evaluate("window.TRACE_WELCOME.scene")==3
   page.locator('[data-tw-next]').click()
   assert page.evaluate("window.TRACE_WELCOME.scene")==4
   assert page.locator('.tw-step-progress .on').count()==5
   page.locator('[data-tw-next]').click()
   assert page.evaluate("state.stage")=="hub"
   assert page.locator('[data-t1-replay]').count()==1
   # Replay preserves the same visitor language and museum.
   page.locator('[data-t1-replay]').click()
   assert page.evaluate("window.TRACE_WELCOME.scene")==0
   assert page.locator('.tw-screen').get_attribute("lang")==lang
   page.locator('[data-tw-auto]').click()
   assert page.evaluate("window.TRACE_WELCOME.playing") is True
   page.locator('[data-tw-auto]').click()
   assert page.evaluate("window.TRACE_WELCOME.playing") is False
   page.locator('[data-tw-skip]').click()
   assert page.evaluate("state.stage")=="hub"
   # Return to entry to check all three languages on the same device.
   page.evaluate("state.stage='intro';save();render()")
   print("MICA WELCOME PASSED",museum,lang,flush=True)
  assert not errors,errors
  page.close()
 browser.close()
print("ALL TRILINGUAL MUSEUM WELCOMES PASSED",flush=True)
