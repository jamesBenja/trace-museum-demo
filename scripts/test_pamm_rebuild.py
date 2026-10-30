"""All eight PAMM games: creative multi-step interactions, responsive Mica conclusions, trilingual UX."""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=27")
NAMES=['masks','delano','grid','chaos','fonseca','yanko','christo','chromati']
fixture=json.loads((Path(__file__).resolve().parents[1]/"display-status.json").read_text(encoding="utf-8"))
for id,row in fixture["works"].items():
 row["active"]=True
 row["startDate"]=""
 row["endDate"]=""
body=json.dumps(fixture)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
 def intercept(route):
  if 'display-status.json' in route.request.url:
   route.fulfill(status=200,content_type='application/json',body=body,headers={'Access-Control-Allow-Origin':'*'})
  else:route.continue_()
 page.route('https://raw.githubusercontent.com/**',intercept)
 page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 page.wait_for_function('window.TRACE_PAMM_GAME && window.TRACE_V1 && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading',timeout=45000)
 page.locator('#venueSwitcher').click()
 page.locator('#venuePicker [data-venue="pamm"]').click()
 assert page.evaluate("A.length")==8
 for i,name in enumerate(NAMES):
  page.evaluate("(i)=>{state.current=i;state.tab='quest';state.stage='puzzle';render()}",i)
  assert page.evaluate("A[state.current].id")=="pamm-"+name
  assert page.locator('.pg-screen').count()==1
  finish=page.locator('[data-t1-finish]')
  assert finish.is_disabled(),name
  if name=='masks':
   for slot in range(4):
    page.locator('[data-pg="symbol"][data-v="'+str(slot)+'"]').click()
    page.locator('[data-pg="seal"][data-v="'+str(slot)+'"]').click()
   assert page.locator('.pg-symbol-slot.filled').count()==4
   assert page.locator('.pg-symbol-slot').last.inner_text().strip()!='＋'
  if name=='delano':
   for n in range(3):page.locator('[data-pg="view"][data-v="'+str(n)+'"]').click()
   page.locator('[data-pg="mood"][data-v="gold"]').click()
   assert page.locator('.pg-photo-spot.seen').count()==3
  if name=='grid':
   for idx in range(5):
    page.locator('[data-pg="choose-glyph"]').nth(idx%3).click()
    page.locator('[data-pg="glyph"][data-v="'+str(idx)+'"]').click()
   assert page.locator('.pg-graphite-cell.marked').count()==5
  if name=='chaos':
   page.locator('[data-pg="cube"][data-v="1"]').click()
   page.locator('[data-pg="tower-action"][data-v="1"]').click()
   page.locator('[data-pg="tower-action"][data-v="2"]').click()
   page.locator('[data-pg="cube"][data-v="2"]').click()
   page.locator('[data-pg="tower-action"][data-v="0"]').click()
   assert page.locator('.pg-floating').count()==3
  if name=='fonseca':
   for idx in range(4):
    key=str(idx)
    page.locator('[data-pg="niche"][data-v="'+key+'"]').click()
    assert page.locator('.pg-niche.opened').count()==idx+1
    page.locator('[data-pg="mini"]').nth(idx).click()
    page.locator('[data-pg="niche"][data-v="'+key+'"]').click()
   assert page.locator('.pg-niche.opened').count()==4
  if name=='yanko':
   for idx in range(5):
    page.locator('[data-pg="piece"]').nth(idx).click()
    page.locator('[data-pg="assemble"][data-v="'+str(idx)+'"]').click()
    assert page.locator('.pg-material-socket.joined').count()==idx+1
   assert page.locator('.pg-paint-skin').count()==1
  if name=='christo':
   for idx in range(2):
    for j in range(2):page.locator('[data-pg="wrap"][data-v="'+str(idx)+'"]').click()
   assert page.locator('.pg-pink-ring').count()==2
   assert page.locator('.pg-board').locator('.pg-illustration').count()==1
  if name=='chromati':
   for idx in range(5):
    page.locator('[data-pg="tool"]').nth(idx%3).click()
    page.locator('[data-pg="paint"][data-v="'+str(idx)+'"]').click()
   assert page.locator('.pg-paint-patch.pg-layer-glitter').count()>=1
  assert page.evaluate('window.TRACE_V1.puzzle.done'),name+' completion failed'
  assert finish.is_enabled(),name
  assert page.locator('.pg-mica-conclusion').count()==1,name
  assert len(page.locator('.pg-mica-conclusion p').inner_text())>45,name
  finish.click()
  assert page.evaluate('state.stage')=='success'
  if name=='grid':
   assert page.evaluate("(window.TRACE_V1.prefs.symbols['pamm-grid']||[]).filter(Boolean).length")>=5, 'New graphite alphabet must be saved in journal'
  assert page.locator('.pg-mica-conclusion').count()==1,"Mica conclusion must be present on completed screen"
  print('REDESIGNED PAMM GAME',name,'MICA CONCLUSION PASSED',flush=True)
 for lang in ['en','fr','es']:
  page.locator('[data-trace-lang="'+lang+'"]').click()
  page.evaluate("state.stage='puzzle';state.current=5;window.TRACE_V1.puzzle.extra=null;render()")
  expected={'en':'Build with industrial materials','fr':'Construis avec des matériaux industriels','es':'Construye con materiales industriales'}[lang]
  assert expected in page.locator('.pg-screen').inner_text()
  for idx in range(5):
   page.locator('[data-pg="piece"]').nth(idx).click()
   page.locator('[data-pg="assemble"]').nth(idx).click()
  conclusion=page.locator('.pg-mica-conclusion p').inner_text()
  assert len(conclusion)>45
  print('PAMM INDUSTRIAL MICA',lang,'PASSED',flush=True)
 assert not errors,errors
 browser.close()
 print('ALL EIGHT PAMM GAMES AND REAL MICA CONCLUSIONS PASSED',flush=True)
