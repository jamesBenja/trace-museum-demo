"""TRACE v1.9.1: verify ten real art labs and one-photo-or-no-photo comparison."""
from playwright.sync_api import sync_playwright
import os,json
from pathlib import Path

URL=os.getenv('TRACE_TEST_URL','https://jamesbenja.github.io/trace-museum-demo/?v=18')
ADDED={
 'mmfa':['mmfa-eye','mmfa-frink','mmfa-riopelle','mmfa-rodin','mmfa-cragg']

}

def slide(page,ident,value):
 page.locator('[data-te-slider="'+ident+'"]').evaluate("""(el, value)=>{
   el.value=String(value);
   el.dispatchEvent(new Event('input',{bubbles:true}));
   el.dispatchEvent(new Event('change',{bubbles:true}));
 }""",value)

def play(page,ident):
 finish=page.locator('[data-t1-finish]')
 assert finish.is_disabled(),ident+' unlocked before creative action'
 before=page.locator('.mf-board').inner_html()
 if ident=='mmfa-eye':
  size=page.locator('.mf-size-handle')
  size.scroll_into_view_if_needed()
  stage=page.locator('.mf-monument').bounding_box()
  r=size.bounding_box()
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down()
  page.mouse.move(stage['x']+stage['width']*.92,stage['y']+stage['height']*.86,steps=13);page.mouse.up()
  for i in range(2):page.locator('[data-mf="view"][data-v="'+str(i)+'"]').click()
  assert page.evaluate('window.TRACE_V1.puzzle.extra.eye')>=.8
 elif ident=='mmfa-frink':
  page.locator('[data-mf="guardian"][data-v="0"]').click()
  page.locator('[data-mf="guardian"][data-v="4"]').click()
  assert page.locator('.mf-guardian').count()==2
  assert finish.is_disabled(), 'Guardians completed before orientation'
  for i in range(2):page.locator('[data-mf="face"][data-v="'+str(i)+'"]').click()
  assert page.locator('.mf-gaze-line').count()==1
 elif ident=='mmfa-riopelle':
  page.locator('[data-mf="base"][data-v="dark"]').click()
  for piece in ['wheel','wire','fabric']:page.locator('[data-mf="piece"][data-v="'+piece+'"]').click()
  assert page.locator('.mf-junk').count()==3
  assert finish.is_disabled()
  page.locator('[data-mf="anchor"]').click()
 elif ident=='mmfa-rodin':
  for i in range(1,4):page.locator('[data-mf="pose"][data-v="'+str(i)+'"]').first.click()
  assert page.locator('.mf-thought').count()==1
 elif ident=='mmfa-cragg':
  for angle,i in [('-45',0),('0',1),('45',2)]:
   page.locator('[data-mf="angle"][data-v="'+angle+'"]').click()
   page.locator('[data-mf="reveal"][data-v="'+str(i)+'"]').click()
  assert page.evaluate('window.TRACE_V1.puzzle.extra.faces.length')==3
 assert page.locator('.mf-board').inner_html()!=before,ident+' display never changed'
 assert finish.is_enabled(),ident+' did not unlock'
 assert page.locator('.mf-mica-conclusion').count()==1,ident+' missing educational Mica'
 assert page.evaluate('window.TRACE_V1.puzzle.done') is True
 print('REDESIGNED MMFA EXPANSION LAB PASSED',ident,flush=True)

def isolate_manifest(page):
 fixture=json.loads((Path(__file__).resolve().parents[1]/"display-status.json").read_text(encoding="utf-8"))
 initial={"mmfa-marrel","mmfa-witte","mmfa-fortin","pamm-masks","pamm-delano","pamm-grid"}
 for ident,row in fixture["works"].items():
  row["active"]=ident in initial
 body=json.dumps(fixture)
 def intercept(route):
  if "display-status.json" in route.request.url:
   route.fulfill(status=200,content_type="application/json",
                 headers={"Access-Control-Allow-Origin":"*"},body=body)
  else:
   route.continue_()
 page.route("https://raw.githubusercontent.com/**",intercept)

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for museum,ids in ADDED.items():
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
  isolate_manifest(page)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  def fake_github(route):
   path=route.request.url
   if path.endswith('/user'):
    route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body='{"login":"trace-test-editor"}')
   elif '/contents/display-status.json' in path:
    route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body='{"sha":"mock-read-sha","content":"e30="}')
   else:
    route.continue_()
  page.route('https://api.github.com/**',fake_github)
  admin_url=URL+('&portal=admin' if '?' in URL else '?portal=admin')
  res=page.goto(admin_url,wait_until='domcontentloaded',timeout=45000)
  assert res and res.status==200
  assert 'v2.8' in page.title(),page.title()
  page.locator('#traceAdminToken').fill('mock-write-token')
  page.locator('#traceAdminSubmit').click()
  page.locator('#traceAdminLogin').wait_for(state='detached',timeout=18000)
  page.wait_for_function("window.TRACE_EXTRA && window.TRACE_V1 && document.querySelector('#status')?.textContent.includes('IMAGE REFERENCES')",timeout=50000)
  if museum=='pamm':
   page.locator('#venueSwitcher').click()
   page.locator('#venuePicker [data-venue="pamm"]').click()
  page.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=12000)
  assert len(ids)==5
  page.evaluate("""(items)=>{for(const id of items)window.TRACE_DISPLAY.setField(id,'active',true)}""",ids)
  assert page.evaluate('window.TRACE_DISPLAY.activeWorks(state.venue).length')==8
  page.evaluate("""() => {
    state.found=A.slice(0,3).map(a=>a.id);state.current=2;
    state.stage='hub';state.tab='quest';save();render();
  }""")
  assert page.locator('[data-t1-open]').count()==8
  for idx,ident in enumerate(ids,start=3):
   page.locator('[data-t1-open="'+str(idx)+'"]').click()
   assert page.evaluate('A[state.current].id')==ident
   assert 'Automatic recognition is not yet calibrated' in page.locator('#view').inner_text()
   assert page.locator('.v7-fragment img').count()==0, "Clue revealed full or cropped museum artwork"
   assert page.locator('[data-action="multi-view"]').count()==0, "Old three-view flow must be removed"
   page.locator('[data-action="photo-quest"]').click()
   assert page.evaluate("state.stage")=="photoquest"
   assert page.locator('.tv-compare-pair img').count()==0, "Reference revealed before photo or fallback"
   assert page.locator('[data-action="photo-compare"]').count()==0, "Comparison must be locked until a photo exists"
   if ident in ('mmfa-eye','pamm-chaos','pamm-chromati'):
    # Photograph first. Only the visitor photo appears until they choose to reveal the museum reference.
    import base64
    png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ/q7UcAAAAASUVORK5CYII=')
    page.locator('[data-guess-photo]').set_input_files({'name':'artwork.png','mimeType':'image/png','buffer':png})
    page.wait_for_function("state.scanImage?.startsWith('data:image/jpeg;')")
    assert page.locator('.tq-capture-zone img').count()==1, "Only visitor photo may appear before comparison"
    assert page.locator('.tv-compare-pair img').count()==0
    page.locator('[data-action="photo-compare"]').click()
    assert page.locator('.tv-compare-pair img').count()==2, "One visitor photo alongside the revealed reference"
   else:
    # Camera-unavailable fallback deliberately opens the reference, even with no photo.
    page.locator('[data-action="manual-review"]').click()
    assert page.locator('.tv-compare-pair img').count()==1, "Reference visible only after explicit fallback"
    assert page.locator('.tv-no-photo').count()==1
   assert page.locator('[data-compare-photo]').count()==1
   assert page.locator('.tv-compare-pair figure').count()==2
   assert 'NOT AUTOMATICALLY VERIFIED' in page.locator('#view').inner_text()
   page.locator('[data-action="manual-accept"]').click()
   page.locator('[data-action="v7-story"]').click()
   assert page.evaluate('state.found.length')==idx
   page.locator('[data-action="v7-puzzle"]').click()
   assert page.locator('.mf-board').count()==1
   play(page,ident)
   page.locator('[data-t1-finish]').click()
   assert page.evaluate('state.found.length')==idx+1
   page.locator('[data-t1-hub]').click()
  assert page.evaluate('state.found.length')==8
  assert page.locator('[data-t1-open]').count()==8
  print('MUSEUM COMPLETE',museum,'no browser errors:',errors,flush=True)
  assert not errors,errors
  page.close()
 browser.close()
print('ALL FIVE MMFA EXPANSION LABS PASSED',flush=True)
