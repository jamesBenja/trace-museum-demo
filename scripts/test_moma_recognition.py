"""Require real browser-loadable image references before offering automatic MoMA scan.
Measure each own-image match and wrong-art rejection without presenting a fabricated match.
"""
import os
from playwright.sync_api import sync_playwright
URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=27")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":390,"height":844})
 page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 page.wait_for_function("typeof moma !== 'undefined' && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=45000)
 page.wait_for_function("moma.every(a=>a.reference || window.__traceRefsFinished)",timeout=70000)
 report=page.evaluate("""async()=>{
  const result=[];
  for(let i=0;i<moma.length;i++){
   const a=moma[i];
   result.push({id:a.id,ready:!!a.reference,src:a.reference?.currentSrc||a.asset,origin:a.referenceOrigin});
  }
  return result;
 }""")
 for row in report:print("MOMA REFERENCE",row,flush=True)
 assert sum(x["ready"] for x in report)==8,"All eight MoMA artworks need actual loadable pixels for scanner activation"
 page.locator("#venueSwitcher").click()
 page.locator('#venuePicker [data-venue="moma"]').click()
 assert page.evaluate("state.venue")=="moma"
 for i in range(8):
  out=page.evaluate("""async i=>{
    state.current=i;state.tab='quest';state.stage='clue';
    const own=await recognize(moma[i].reference);
    const wrong=await recognize(moma[(i+1)%moma.length].reference);
    return {own:own.recognized,ownId:own.id,ownMethod:own.method,wrong:wrong.recognized,wrongId:wrong.id,
       ownGeo:own.results.find(x=>x.id===moma[i].id),wrongGeo:wrong.results.find(x=>x.id===moma[i].id)};
  }""",i)
  print("MOMA SCAN MATCH",i,report[i]["id"],out,flush=True)
  assert out["own"] and out["ownId"]==report[i]["id"],"Reference should match itself for "+report[i]["id"]
  assert not out["wrong"],"Incorrect artwork falsely recognized for "+report[i]["id"]
 browser.close()
 print("ALL EIGHT MOMA PHOTO REFERENCES AND MATCH/WRONG REJECTION PASSED",flush=True)
