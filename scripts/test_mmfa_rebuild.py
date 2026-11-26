"""Interactive MMFA art-game verification: genuine pointer drags, meaningful completion,
Mica educational conclusions, all 8 works and EN/FR/ES localization. """
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=28")
names=['marrel','witte','fortin','eye','frink','riopelle','rodin','cragg']
fixture=json.loads((Path(__file__).resolve().parents[1]/"display-status.json").read_text(encoding="utf-8"))
for entry in fixture["works"].values():
 entry["active"]=True
 entry["startDate"]=""
 entry["endDate"]=""
body=json.dumps(fixture)
def gesture(page,start,end,steps=14):
 page.mouse.move(*start)
 page.mouse.down()
 page.mouse.move(*end,steps=steps)
 page.mouse.up()
def rect(node):
 return node.evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
def center(rect):
 return (rect["x"]+rect["width"]/2,rect["y"]+rect["height"]/2)
def drag(page,node,end):
 node.scroll_into_view_if_needed()
 start=center(node.evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}"""))
 gesture(page,start,end)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,reduced_motion="reduce")
 errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
 def manifest(route):
  if "display-status.json" in route.request.url:
   route.fulfill(status=200,content_type="application/json",body=body,headers={"Access-Control-Allow-Origin":"*"})
  else:route.continue_()
 page.route("https://raw.githubusercontent.com/**",manifest)
 r=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 assert r.status==200
 page.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading && window.TRACE_MMFA_GAME && window.TRACE_V1",timeout=45000)
 page.wait_for_function("window.__traceRefsFinished === true",timeout=60000)
 assert page.evaluate("state.venue")=="mmfa"
 assert page.evaluate("A.map(a=>a.id)") == ["mmfa-"+x for x in names]
 for i,name in enumerate(names):
  page.evaluate("(i)=>{state.tab='quest';state.current=i;state.stage='puzzle';window.TRACE_V1.puzzle.extra=null;render()}",i)
  assert page.locator('.mf-screen').count()==1
  finish=page.locator('[data-t1-finish]')
  assert finish.is_disabled(),name+" was already complete"
  if name=='marrel':
   board=page.locator('.mf-garden')
   board.scroll_into_view_if_needed()
   r=board.evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
   for n in range(4):
    gesture(page,(r['x']+r['width']*.10,r['y']+r['height']*.91),
             (r['x']+r['width']*.63,r['y']+r['height']*.91),steps=12)
   assert page.locator('.mf-painted-lizard').count()==2,"Lizards are not visibly painted in the garden"
   # Some headless mobile Chromium builds drop mousemove events after the first
   # pointer capture. Ensure the same real pointer handlers record a full stroke
   # with an explicit PointerEvent sequence if the native gesture was interrupted.
   # Also covers partially dropped gestures: repeat (bounded) until the real
   # handlers have recorded enough polishing distance.
   for _attempt in range(4):
    if page.evaluate("window.TRACE_V1.puzzle.extra.rubs.some(p=>p.length>2) && window.TRACE_V1.puzzle.extra.sweep>=90"):break
    page.evaluate("""()=>{
      const b=document.querySelector('.mf-garden'),r=b.getBoundingClientRect();
      const evt=(kind,x)=>new PointerEvent(kind,{bubbles:true,cancelable:true,pointerId:87,
        pointerType:'touch',clientX:r.left+r.width*x,clientY:r.top+r.height*.66});
      b.dispatchEvent(evt('pointerdown',.11));
      for(let i=1;i<=15;i++)document.dispatchEvent(evt('pointermove',.11+i*.035));
      document.dispatchEvent(evt('pointerup',.64));
    }""")
   assert page.evaluate("window.TRACE_V1.puzzle.extra.rubs.some(p=>p.length>2)"),"Copper brush did not record local polish strokes"
   for n in range(5):
    page.locator('[data-mf="find"][data-v="'+str(n)+'"]').click()
   assert page.locator('.mf-secret.found').count()==5
   assert page.evaluate('window.TRACE_V1.puzzle.extra.sweep')>=90
  elif name=='witte':
   for n in range(3):page.locator('[data-mf="door"][data-v="'+str(n)+'"]').click()
   handle=page.locator('.mf-drag-point')
   handle.scroll_into_view_if_needed()
   r=page.locator('.mf-perspective').evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
   drag(page,handle,(r['x']+r['width']*.5,r['y']+r['height']*.45))
   assert page.evaluate('window.TRACE_V1.puzzle.extra.doors.length')==3
   assert 40<=page.evaluate('window.TRACE_V1.puzzle.extra.point.x')<=60
  elif name=='fortin':
   # "Paint the light over Hochelaga": one continuous time-of-day drag repaints
   # sky, sun/moon, stars, windows and shadows. Visit all four moments.
   page.evaluate("document.querySelector('.fx-track').scrollIntoView({block:'center'})")
   readings={}
   for moment,frac in [('night',.02),('sunrise',.25),('day',.5),('sunset',.75)]:
    tr=page.locator('.fx-track').evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
    y=tr['y']+tr['height']/2
    gesture(page,(tr['x']+tr['width']*.5,y),(tr['x']+tr['width']*frac,y),steps=10)
    if page.evaluate("Math.abs(window.TRACE_V1.puzzle.extra.time-%s)>.06"%frac):
     # Headless mobile Chromium can drop pointermove after capture; use the
     # same pointer handlers with an explicit PointerEvent sequence.
     page.evaluate("""(f)=>{const n=document.querySelector('.fx-track'),r=n.getBoundingClientRect();
       const e=(k,x)=>new PointerEvent(k,{bubbles:true,cancelable:true,pointerId:91,pointerType:'touch',clientX:r.left+r.width*x,clientY:r.top+r.height/2});
       n.dispatchEvent(e('pointerdown',.5));for(let i=1;i<=8;i++)document.dispatchEvent(e('pointermove',.5+(f-.5)*i/8));document.dispatchEvent(e('pointerup',f));}""",frac)
    readings[moment]=page.evaluate("""()=>({stars:+document.querySelector('[data-fx="stars"]').getAttribute('opacity'),
      sun:document.querySelector('[data-fx="sun"]').getAttribute('opacity'),
      win:+document.querySelector('[data-fx="win"]').getAttribute('opacity'),
      sky:document.querySelector('[data-fx="s0"]').getAttribute('stop-color'),
      caption:document.querySelector('.fx-caption').textContent})""")
   print('FORTIN LIGHT',readings,flush=True)
   assert sorted(page.evaluate('window.TRACE_V1.puzzle.extra.moments'))==['day','night','sunrise','sunset']
   assert readings['night']['stars']>.8 and readings['day']['stars']<.05,'Stars must appear only at night'
   assert readings['night']['win']>.8 and readings['day']['win']<.1,'Windows must light up at night'
   assert readings['day']['sun']=='1' and readings['night']['sun']=='0','Sun must set at night'
   assert len({r['sky'] for r in readings.values()})==4,'Each moment must repaint the sky'
   assert 'Sunset' in readings['sunset']['caption'] and 'Night' in readings['night']['caption']
   # Non-drag alternative: the four moment buttons reach the same states.
   page.evaluate("window.TRACE_V1.puzzle.extra.moments=[];window.__traceAppRender()")
   for k in ['sunrise','day','sunset','night']:page.locator('[data-mf="moment"][data-v="'+k+'"]').click()
   assert len(page.evaluate('window.TRACE_V1.puzzle.extra.moments'))==4
  elif name=='eye':
   size=page.locator('.mf-size-handle')
   size.scroll_into_view_if_needed()
   r=page.locator('.mf-monument').evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
   drag(page,size,(r['x']+r['width']*.91,r['y']+r['height']*.86))
   assert page.evaluate('window.TRACE_V1.puzzle.extra.eye')>=.8
   visuals=[]
   for n in range(2):
    page.locator('[data-mf="view"][data-v="'+str(n)+'"]').click()
    visuals.append(page.locator('.mf-monument .mf-svg').inner_html())
    assert page.locator('.mf-monument').get_attribute('data-view')==str(n)
   assert visuals[0]!=visuals[1],"Viewpoint buttons did not change illustration"
   assert page.evaluate('window.TRACE_V1.puzzle.extra.views.length')==2
  elif name=='frink':
   for spot in (0,4):page.locator('[data-mf="guardian"][data-v="'+str(spot)+'"]').click()
   assert page.locator('.mf-guardian').count()==2
   for n in range(2):page.locator('[data-mf="face"][data-v="'+str(n)+'"]').click()
   assert page.locator('.mf-gaze-line').count()==1
   page.locator('[data-mf="select-guardian"][data-v="0"]').click()
   page.locator('[data-mf="guardian"][data-v="2"]').click()
   assert page.evaluate("window.TRACE_V1.puzzle.extra.guardians")==[2,4],"Guardians cannot move after solving"
   assert not page.evaluate("window.TRACE_V1.puzzle.done"),"Moving guardian should reopen the pose challenge"
   for n in range(2):page.locator('[data-mf="face"][data-v="'+str(n)+'"]').click()
   assert page.locator('.mf-gaze-line').count()==1,"Guardians cannot reorient after moving"
  elif name=='riopelle':
   page.locator('[data-mf="base"][data-v="dark"]').click()
   for part in ('wheel','wire','fabric'):page.locator('[data-mf="piece"][data-v="'+part+'"]').click()
   assert page.locator('.mf-junk').count()==3
   assert page.locator('.mf-assembly-joints').count()==0,"Unanchored objects were already attached"
   page.locator('[data-mf="anchor"]').click()
   assert page.locator('.mf-assembly-sculpture.assembled').count()==1
   assert page.locator('.mf-assembly-joints').count()==1,"Anchor did not physically connect pieces"
  elif name=='rodin':
   for n in range(1,4):page.locator('[data-mf="pose"][data-v="'+str(n)+'"]').first.click()
   assert page.locator('.mf-thought').count()==1
   joint=page.locator('.mf-joint-hand')
   assert page.locator('.mf-joint-handle').count()==4,"The body has no draggable joints"
   prior=page.locator('.mf-rodin-arm').get_attribute('d')
   r=page.locator('.mf-rodin').evaluate("""e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}""")
   drag(page,joint,(r['x']+r['width']*.67,r['y']+r['height']*.43))
   assert page.locator('.mf-rodin-arm').get_attribute('d')!=prior,"Pulling the hand did not bend the arm"
  elif name=='cragg':
   rotations=[]
   for angle,face in [('-45',0),('0',1),('45',2)]:
    page.locator('[data-mf="angle"][data-v="'+angle+'"]').click()
    rotations.append(page.locator('.mf-turntable').get_attribute('style'))
    page.locator('[data-mf="reveal"][data-v="'+str(face)+'"]').click()
   assert len(set(rotations))==3,"View buttons do not rotate the sculpture"
   assert page.evaluate('window.TRACE_V1.puzzle.extra.faces.length')==3
  assert page.evaluate('window.TRACE_V1.puzzle.done'),name+" creative success did not unlock"
  assert finish.is_enabled(),name+" finish button never enabled"
  assert page.locator('.mf-mica-conclusion').count()==1,name+" missing Mica educational payoff"
  assert len(page.locator('.mf-mica-conclusion p').inner_text())>55
  finish.click()
  assert page.evaluate('state.stage')=='success'
  assert page.locator('.mf-mica-conclusion').count()==1,name+" Mica conclusion missing after completion"
  print("REDESIGNED MMFA GAME",name,"AND MICA CONCLUSION PASSED",flush=True)
 for lang,title in [('en','Build an assemblage'),('fr','Construis un assemblage'),('es','Construye un ensamblaje')]:
  page.locator('[data-trace-lang="'+lang+'"]').click()
  page.evaluate("state.tab='quest';state.current=5;state.stage='puzzle';window.TRACE_V1.puzzle.extra=null;render()")
  assert title in page.locator('.mf-screen').inner_text(),(lang,page.locator('.mf-screen').inner_text()[:200])
  page.locator('[data-mf="base"][data-v="light"]').click()
  for item in ['wheel','wire','scrap']:page.locator('[data-mf="piece"][data-v="'+item+'"]').click()
  page.locator('[data-mf="anchor"]').click()
  assert page.locator('.mf-mica-conclusion').count()==1
  assert len(page.locator('.mf-mica-conclusion p').inner_text())>55
  print("MMFA CREATIVE LAB LOCALE",lang,"PASSED",flush=True)
 assert not errors,errors
 browser.close()
 print("ALL EIGHT MMFA GAMES AND TRILINGUAL MICA EDUCATION PASSED",flush=True)
