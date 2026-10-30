"""Mica accessories appear only for the one artwork being found or explored."""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=29")
fixture=json.loads((Path(__file__).resolve().parents[1]/"display-status.json").read_text(encoding="utf-8"))
for entry in fixture["works"].values():
 entry["active"]=True
 entry["startDate"]=""
 entry["endDate"]=""
payload=json.dumps(fixture)
EXPECTED={
 "mmfa":["hat","lens","umbrella","lens","chisel","brush","chisel","chisel"],
 "pamm":["hat","lens","brush","chisel","chisel","chisel","umbrella","brush"],
 "moma":["brush","brush","brush","brush","lens","chisel","chisel","lens"]
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,reduced_motion="reduce")
 errors=[]
 page.on("pageerror",lambda e:errors.append(str(e)))
 def manifest(route):
  if "display-status.json" in route.request.url:
   route.fulfill(status=200,content_type="application/json",body=payload,headers={"Access-Control-Allow-Origin":"*"})
  else:route.continue_()
 page.route("https://raw.githubusercontent.com/**",manifest)
 response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 assert response and response.status==200
 page.wait_for_function("window.TRACE_V1 && window.TRACE_MICA && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=35000)
 assert len(page.evaluate("Object.keys(window.TRACE_MICA.props)"))==24
 page.evaluate("state.stage='intro';state.tab='quest';render()")
 assert page.locator(".tm-prop-svg").count()==0,"Intro must have no props"
 page.locator("[data-t1-start]").click()
 assert page.locator(".tw-mica").count()==1
 assert page.locator(".tm-prop-svg").count()==0,"Museum welcome must have no props"
 assert page.evaluate("""()=>{const m=document.querySelector('.tw-mica').getBoundingClientRect(),
 s=document.querySelector('.tw-speech').getBoundingClientRect();return m.bottom < s.top}"""),"Welcome Mica overlaps speech"
 page.locator("[data-tw-skip]").click()
 assert page.locator(".tm-prop-svg").count()==0,"Hub must have no props"
 for museum,expected in EXPECTED.items():
  if page.evaluate("state.venue")!=museum:
   page.locator("#venueSwitcher").click()
   page.locator('#venuePicker [data-venue="'+museum+'"]').click()
  assert page.evaluate("A.length")==8,museum
  page.evaluate("state.tab='quest';state.stage='hub';render()")
  assert page.locator(".tm-prop-svg").count()==0,"Hub prop leak "+museum
  for i,kind in enumerate(expected):
   page.evaluate("(i)=>{state.current=i;state.tab='quest';state.stage='clue';render()}",i)
   artwork=page.evaluate("A[state.current].id")
   assert page.locator(".tm-mica-context .tm-prop-"+kind).count()==1,(artwork,kind,"clue")
   assert page.locator(".t1-screen").get_attribute("data-mica-art")==artwork
   page.evaluate("state.stage='puzzle';render()")
   assert page.locator(".tm-puzzle-companion[data-mica-art='"+artwork+"']").count()==1,artwork
   assert page.locator(".tm-puzzle-companion .tm-prop-"+kind).count()==1,artwork
   page.evaluate("state.stage='hub';render()")
   assert page.locator(".tm-prop-svg").count()==0,"Leaked prop on hub: "+artwork
  print("MICA PROPS PASSED",museum,flush=True)
 for lang,translation in [("fr","Crée avec Mica"),("es","Crea con Mica"),("en","Create with Mica")]:
  page.evaluate("(lang)=>{state.lang=lang;state.current=0;state.stage='puzzle';render()}",lang)
  assert translation in page.locator(".tm-puzzle-companion").inner_text(),lang
 assert not errors,errors
 page.close()
 browser.close()
print("ALL ARTWORK-ONLY MICA COSTUMES PASSED",flush=True)
