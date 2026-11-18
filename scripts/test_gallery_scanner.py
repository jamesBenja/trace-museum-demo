"""Regression coverage for gallery lighting, wide framing and true live camera detection.
These are generated gallery scenes from bundled collection images. Visitor photos
are intentionally NOT committed to this public repository.
"""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=40")

PHOTO="""async ({art,height})=>{
 const original=ALL.find(a=>a.id===art).reference;
 if(!original)throw Error('Missing gallery image reference '+art);
 const c=document.createElement('canvas'),w=1152,h=1536;
 c.width=w;c.height=h;const g=c.getContext('2d');
 g.fillStyle='#282a2c';g.fillRect(0,0,w,h);
 // Subtle wall seams and a dark picture frame as seen in museum galleries.
 g.fillStyle='#3d3f40';g.fillRect(520,0,3,h);
 g.fillStyle='#222426';g.fillRect(0,1190,w,6);
 const rh=height,rw=rh*original.naturalWidth/original.naturalHeight;
 const x=(w-rw)/2,y=height<600?355:285;
 g.fillStyle='#080808';g.fillRect(x-32,y-37,rw+64,rh+72);
 g.fillStyle='#6a6660';g.fillRect(x-12,y-11,rw+24,rh+22);
 g.save();g.filter='brightness(.79) contrast(.90) saturate(.87) blur(.35px)';
 g.drawImage(original,x,y,rw,rh);g.restore();
 g.fillStyle='rgba(255,245,230,.07)';
 g.fillRect(x+rw*.24,y+14,rw*.43,8);
 const img=new Image();img.src=c.toDataURL('image/jpeg',.74);
 await img.decode();return img;
}"""

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
 context=browser.new_context(viewport={'width':390,'height':844},permissions=['camera'])
 page=context.new_page()
 errors=[]
 page.on('pageerror',lambda e: errors.append(str(e)))
 response=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 assert response and response.status==200
 page.wait_for_function("window.__traceRefsFinished && document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=65000)
 outcomes=page.evaluate("""async makeSource=>{
  const makePhoto=eval('('+makeSource+')');
  const saved=state.current;
  const results=[];
  for(const height of [530,760]){
   state.current=1;
   const photo=await makePhoto({art:'mmfa-witte',height});
   const correct=await recognize(photo);
   state.current=0;
   const wrong=await recognize(photo);
   results.push({art:'mmfa-witte',height,
      positive:correct.recognized,id:correct.id,method:correct.method,
      cropInliers:correct.cropInliers,color:correct.color.find(x=>x.id==='mmfa-witte')?.colorScore,
      colorBox:correct.color.find(x=>x.id==='mmfa-witte')?.box,
      runner:correct.color.filter(x=>x.id!=='mmfa-witte').slice(0,2).map(x=>({id:x.id,score:x.colorScore})),
      exact:colorScore(library.find(x=>x.id==='mmfa-witte').color,colorDescriptor(featureData(photo),
       (1152-(height*ALL.find(x=>x.id==='mmfa-witte').reference.naturalWidth/ALL.find(x=>x.id==='mmfa-witte').reference.naturalHeight))/2304,
       (height<600?355:285)/1536,
       (height*ALL.find(x=>x.id==='mmfa-witte').reference.naturalWidth/ALL.find(x=>x.id==='mmfa-witte').reference.naturalHeight)/1152,
       height/1536)),
      wrong:wrong.recognized,wrongId:wrong.id});
  }
  state.current=1;
  const another=await makePhoto({art:'mmfa-marrel',height:760});
  const mismatch=await recognize(another);
  results.push({art:'mmfa-marrel',height:760,wrong:mismatch.recognized,wrongId:mismatch.id});
  state.current=saved;return results;
 }""",PHOTO)
 for row in outcomes:print("GALLERY SCAN",row,flush=True)
 for row in outcomes[:2]:
  assert row['positive'] and row['id']=='mmfa-witte',"Missed gallery photo: "+str(row)
  assert not row['wrong'],"False match to Marrel: "+str(row)
 assert not outcomes[2]['wrong'],"Wrong painting was accepted: "+str(outcomes[2])
 # Verify the live preview recognizes two distinct camera frames without a
 # shutter press. Stub ONLY the recognition decision for this UI integration
 # test; the actual matcher is tested above against real reference pixels.
 page.evaluate("""()=>{
  state.current=1;state.stage='clue';state.tab='quest';render();
  window.__originalGalleryRecognize=recognize;
  recognize=async()=>({recognized:true,id:'mmfa-witte',method:'controlled live test'});
 }""")
 page.evaluate("startCamera()")
 page.wait_for_function("state.stage==='scan' && document.querySelector('#cameraVideo')?.videoWidth>0",timeout=15000)
 assert 'automatically' in page.locator('#cameraAlert').inner_text().lower()
 try:
  page.wait_for_function("state.stage==='scanresult' && state.result?.id==='mmfa-witte' && state.scanImage",timeout=24000)
 except Exception:
  print('LIVE CAMERA DIAGNOSTIC',page.evaluate("""()=>({
   stage:state.stage,hits:liveScanHits,busy:liveScanBusy,
   stream:!!stream,token:liveScanToken,timer:!!liveScanTimer,
   videoReady:document.querySelector('#cameraVideo')?.readyState,
   videoWidth:document.querySelector('#cameraVideo')?.videoWidth,
   attached:document.querySelector('#cameraVideo')?.srcObject===stream,
   alert:document.querySelector('#cameraAlert')?.textContent
  })"""),flush=True)
  raise
 assert page.locator('.resultStamp').inner_text()=='ARTWORK VERIFIED'
 assert not errors,"Browser JS errors: "+str(errors)
 context.close();browser.close()
 print("GALLERY FRAMING, WRONG ART REJECTION, AND LIVE TWO-FRAME SCAN PASSED",flush=True)
