"""TRACE iPhone gallery-reference regression.

The full-resolution visitor photos stay private. This fixture reconstructs
artwork-only RGB444 grids published in TRACE and checks correct matching,
competing works, framed/wall presentation and known reference counts.

A self-derived fixture is not proof of real-world recognition accuracy.
The original iPhone photos are also evaluated offline before publishing.
"""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=60")

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":390,"height":844})
 page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 page.wait_for_function("""()=>
  window.__traceRefsFinished &&
  library.filter(r=>r.id==='mmfa-marrel'&&r.view>=100).length===4 &&
  library.filter(r=>r.id==='mmfa-fortin'&&r.view>=100).length===3 &&
  library.filter(r=>r.id==='mmfa-witte'&&r.view>=100).length===3
 """,timeout=65000)

 results=page.evaluate("""async()=>{
  const saved=state.current,results=[];
  const sourceFor=(id,view,withWall)=>{
   const r=window.TRACE_GALLERY_SIGNATURES[id][view];
   if(!r||r.format!=='rgb444')throw Error('Reference view missing');
   const raw=atob(r.rgb),rgba=new Uint8ClampedArray(r.cols*r.rows*4);
   for(let i=0,k=0;i<raw.length;i+=3,k+=8){
    const a=raw.charCodeAt(i),b=raw.charCodeAt(i+1),c=raw.charCodeAt(i+2);
    rgba[k]=(a>>4)*17;rgba[k+1]=(a&15)*17;rgba[k+2]=(b>>4)*17;rgba[k+3]=255;
    rgba[k+4]=(b&15)*17;rgba[k+5]=(c>>4)*17;rgba[k+6]=(c&15)*17;rgba[k+7]=255;
   }
   const pix=document.createElement('canvas');pix.width=r.cols;pix.height=r.rows;
   pix.getContext('2d').putImageData(new ImageData(rgba,r.cols,r.rows),0,0);
   const ratio=r.w/r.h,img=document.createElement('canvas');
   img.width=ratio>1?900:Math.round(900*ratio);
   img.height=ratio>1?Math.round(900/ratio):900;
   img.getContext('2d').drawImage(pix,0,0,img.width,img.height);
   if(!withWall)return img;
   // Wall/framing around the artwork at a plausible gallery distance.
   const c=document.createElement('canvas');c.width=1152;c.height=1536;
   const g=c.getContext('2d');g.fillStyle='#3d4349';g.fillRect(0,0,1152,1536);
   g.fillStyle='#5d5a57';g.fillRect(575,0,5,1536);
   const h=ratio>1?620:740,w=h*ratio,x=(1152-w)/2,y=360;
   g.fillStyle='#29201a';g.fillRect(x-18,y-18,w+36,h+36);
   g.drawImage(img,x,y,w,h);
   return c;
  };
  const scenarios=[
    ['mmfa-fortin',0,'mmfa-witte',false],
    ['mmfa-fortin',2,'mmfa-marrel',false],
    ['mmfa-marrel',1,'mmfa-witte',false],
    ['mmfa-marrel',3,'mmfa-fortin',false],
    ['mmfa-witte',2,'mmfa-marrel',false]
  ];
  for(const [id,wrong,view,framed] of scenarios.map(([a,b,c,d])=>[a,c,b,d])){
   const source=sourceFor(id,view,framed);
   state.current=A.findIndex(a=>a.id===id);
   const yes=await recognize(source);
   state.current=A.findIndex(a=>a.id===wrong);
   const no=await recognize(source);
   const own=yes.color.find(c=>c.id===id);
   results.push({id,view,framed,correct:yes.recognized,matchedId:yes.id,
      matchMethod:yes.method,score:own?.colorScore,wrong,wrongAccepted:no.recognized});
  }
  state.current=saved;return results;
 }""")
 for row in results:print("IPHONE GALLERY REFERENCE",row,flush=True)
 for row in results:
  assert row["correct"] and row["matchedId"]==row["id"],"Expected gallery scan rejected: "+str(row)
  assert not row["wrongAccepted"],"Wrong artwork accepted: "+str(row)
 print("GALLERY PHOTO REFERENCES: 3 FORTIN, 4 MARREL, 3 WITTE; WRONG-WORK REJECTION PASSED",flush=True)
 browser.close()
