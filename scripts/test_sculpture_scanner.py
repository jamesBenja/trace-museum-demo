"""TRACE regression: real iPhone-derived sculptures, different photographic views,
correct/incorrect mystery rejection, and no raw visitor photo publication.
Onsite photos are transformed to tiny 4-bit artwork-only signatures; full images
never appear in the public repository or CI fixtures.
"""
from playwright.sync_api import sync_playwright
import os
URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=52")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844})
 page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 page.wait_for_function("window.__traceRefsFinished && window.TRACE_DISPLAY && !TRACE_DISPLAY.loading",timeout=65000)
 # Shared display catalogue and the image-reference builder initialize
 # asynchronously. Do not inspect an in-progress scanner index.
 page.wait_for_function("""()=>
  library.filter(r=>r.id==='mmfa-eye'&&r.view>=100).length===6 &&
  library.filter(r=>r.id==='mmfa-frink'&&r.view>=100).length===4 &&
  library.filter(r=>r.id==='mmfa-witte'&&r.view>=100).length===2
 """,timeout=65000)
 counts=page.evaluate("""()=>({
  eye:library.filter(r=>r.id==='mmfa-eye'&&r.view>=100).length,
  frink:library.filter(r=>r.id==='mmfa-frink'&&r.view>=100).length,
  witte:library.filter(r=>r.id==='mmfa-witte'&&r.view>=100).length,
  hearts:window.TRACE_GALLERY_SIGNATURES?.['mmfa-hearts']?.length,
  privatePhotosPublished:document.documentElement.outerHTML.includes('IMG_1373')
 })""")
 print('IPHONE SCULPTURE REFERENCES',counts,flush=True)
 assert counts['frink']==4 and counts['eye']==6 and counts['witte']==2 and counts['hearts']==2,counts
 assert not counts['privatePhotosPublished']
 results=page.evaluate("""async()=>{
  const saved=state.current;
  const output=[];
  const sourceFor=(id,view)=>{
   const p=window.TRACE_GALLERY_SIGNATURES[id][view];
   const bytes=atob(p.rgb),pixels=new Uint8ClampedArray(p.cols*p.rows*4);
   for(let i=0,j=0;i<bytes.length;i+=3,j+=8){
    const a=bytes.charCodeAt(i),b=bytes.charCodeAt(i+1),c=bytes.charCodeAt(i+2);
    pixels[j]=(a>>4)*17;pixels[j+1]=(a&15)*17;pixels[j+2]=(b>>4)*17;pixels[j+3]=255;
    pixels[j+4]=(b&15)*17;pixels[j+5]=(c>>4)*17;pixels[j+6]=(c&15)*17;pixels[j+7]=255;
   }
   const small=document.createElement('canvas');small.width=p.cols;small.height=p.rows;
   small.getContext('2d').putImageData(new ImageData(pixels,p.cols,p.rows),0,0);
   const target=document.createElement('canvas');const ratio=p.w/p.h;
   target.width=ratio>1?900:Math.round(900*ratio);
   target.height=ratio>1?Math.round(900/ratio):900;
   const ctx=target.getContext('2d');ctx.imageSmoothingEnabled=true;
   ctx.drawImage(small,0,0,target.width,target.height);
   return target;
  };
  for(const [id,other,views] of [
    ['mmfa-frink','mmfa-eye',[0,2]],
    ['mmfa-eye','mmfa-frink',[0,2,4]]
   ]){
   for(const view of views){
    const canvas=sourceFor(id,view);
    state.current=A.findIndex(a=>a.id===id);
    const yes=await recognize(canvas);
    state.current=A.findIndex(a=>a.id===other);
    const no=await recognize(canvas);
    output.push({id,view,yes:yes.recognized,method:yes.method,
      own:yes.color.find(c=>c.id===id)?.colorScore,
      competing:Math.max(...yes.color.filter(c=>c.id!==id).map(c=>c.colorScore)),
      wrong:no.recognized,wrongId:no.id});
   }
  }
  state.current=saved;
  return output;
 }""")
 for row in results:print('IPHONE SCULPTURE MATCH',row,flush=True)
 for row in results:
  assert row['yes'], 'Sculpture photo failed to match itself: '+str(row)
  assert not row['wrong'], 'Wrong sculpture accepted: '+str(row)
 browser.close()
 print('ON-SITE SCULPTURE REFERENCES, FALSE-MATCH REJECTION PASSED',flush=True)
