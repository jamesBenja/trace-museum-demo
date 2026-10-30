"""TRACE v1.9.1: verify ten real art labs and one-photo-or-no-photo comparison."""
from playwright.sync_api import sync_playwright
import os,json
from pathlib import Path

URL=os.getenv('TRACE_TEST_URL','https://jamesbenja.github.io/trace-museum-demo/?v=18')
ADDED={
 'mmfa':['mmfa-eye','mmfa-frink','mmfa-riopelle','mmfa-rodin','mmfa-cragg'],
 'pamm':['pamm-chaos','pamm-fonseca','pamm-yanko','pamm-christo','pamm-chromati']
}

def slide(page,ident,value):
 page.locator('[data-te-slider="'+ident+'"]').evaluate("""(el, value)=>{
   el.value=String(value);
   el.dispatchEvent(new Event('input',{bubbles:true}));
   el.dispatchEvent(new Event('change',{bubbles:true}));
 }""",value)

def play(page,ident):
 finish=page.locator('[data-t1-finish]')
 assert finish.is_disabled(),ident+' unlocked before visitor interaction'
 before=page.locator('.te-workspace').evaluate('(el)=>el.outerHTML')
 if ident=='mmfa-eye':
  slide(page,'eye',95)
  assert page.locator('.te-city').get_attribute('style').find('2.44')>=0, 'Eye did not grow'
 elif ident=='mmfa-frink':
  page.locator('[data-te-spot="0"]').click()
  page.locator('[data-te-spot="4"]').click()
  assert page.locator('.te-guardian-spot.occupied').count()==2
  assert finish.is_disabled(), 'Guardians unlocked before visitors changed their orientation'
  page.locator('[data-te-face-guardians]').click()
 elif ident=='mmfa-riopelle':
  page.locator('[data-te-base="dark"]').click()
  page.locator('[data-te-object="wheel"]').click()
  assert page.locator('.te-found-piece').count()==1
  assert finish.is_disabled()
  page.locator('[data-te-object="wire"]').click()
  assert page.locator('.te-found-piece').count()==2
 elif ident=='mmfa-rodin':
  page.locator('[data-te-pose="1"]').click()
  page.locator('[data-te-pose="2"]').click()
  assert finish.is_disabled()
  page.locator('[data-te-pose="3"]').click()
  assert '?' in page.locator('.te-pose-svg text').text_content()
 elif ident=='mmfa-cragg':
  for i in range(3):
   page.locator('[data-te-find="'+str(i)+'"]').click()
  assert page.locator('.te-face-spot.found').count()==3
 elif ident=='pamm-chaos':
  assert page.locator('.te-cube').count()==3, 'Three steel frames visible without extra taps'
  assert finish.is_disabled(), 'Cube tower should require real manipulation'
  page.locator('[data-te-cube-select="1"]').first.click()
  page.locator('[data-te-nudge="12"]').click()
  assert finish.is_disabled(), 'Changing only one cube must not finish the game'
  page.locator('[data-te-cube-select="2"]').first.click()
  page.locator('[data-te-nudge="12"]').click()
  assert finish.is_disabled(), 'Shifting two cubes without rotation is insufficient'
  slide(page,'cubeAngle',20)
  assert '20°' in page.locator('#te-readout').inner_text()
  assert page.evaluate('window.TRACE_V1.puzzle.extra.changed.filter(Boolean).length')==2
  assert page.locator('.te-balance-label b').inner_text()!='0 / 100'
  assert page.locator('.te-tower-warning').inner_text()==''
  assert page.locator('[data-te-tilt]').count()==0, 'Old tilt buttons removed'
 elif ident=='pamm-fonseca':
  page.locator('[data-te-niche="0"]').click()
  page.locator('[data-te-shape="sphere"]').click()
  page.locator('[data-te-niche="0"]').click()
  assert finish.is_disabled()
  page.locator('[data-te-niche="1"]').click()
  page.locator('[data-te-shape="arch"]').click()
  page.locator('[data-te-niche="1"]').click()
  assert page.locator('.te-niche.carved').count()==2
 elif ident=='pamm-yanko':
  page.locator('[data-te-place="0"]').click()
  page.locator('[data-te-material="hose"]').click()
  page.locator('[data-te-place="1"]').click()
  assert finish.is_disabled()
  page.locator('[data-te-material="skin"]').click()
  page.locator('[data-te-place="2"]').click()
  assert page.locator('.te-material-slot svg').count()==3
 elif ident=='pamm-christo':
  slide(page,'fabric',95)
  assert '418 500' in page.locator('.te-bay').inner_html(), 'Fabric did not surround the islands'
 elif ident=='pamm-chromati':
  page.locator('[data-te-paint="0"]').click()
  page.locator('[data-te-tool="gouache"]').click()
  page.locator('[data-te-paint="1"]').click()
  assert finish.is_disabled()
  page.locator('[data-te-tool="glitter"]').click()
  page.locator('[data-te-paint="2"]').click()
  assert page.locator('.te-paint-cell.has-glitter').count()==1
 assert page.locator('.te-workspace').evaluate('(el)=>el.outerHTML')!=before,ident+' display never changed'
 assert finish.is_enabled(),ident+' did not unlock after performing the interaction'
 assert page.evaluate('window.TRACE_V1.puzzle.done') is True
 print('REAL LAB PASSED',ident,flush=True)

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
  assert 'v2.0' in page.title(),page.title()
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
   assert 'Automatic recognition is not yet validated' in page.locator('#view').inner_text()
   assert page.locator('[data-action="multi-view"]').count()==0, "Old three-view flow must be removed"
   page.locator('[data-action="manual-review"]').click()
   assert page.locator('[data-compare-photo]').count()==1
   assert page.locator('.tv-compare-pair figure').count()==2
   assert page.locator('.tv-no-photo').count()==1, "Visitors may confirm without taking a photo"
   if ident in ('mmfa-eye','pamm-chaos','pamm-chromati'):
    # Optional single photo for sculpture and mixed-media, with visible comparison.
    import base64
    png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ/q7UcAAAAASUVORK5CYII=')
    page.locator('[data-compare-photo]').set_input_files({'name':'artwork.png','mimeType':'image/png','buffer':png})
    page.wait_for_function("state.scanImage?.startsWith('data:image/jpeg;')")
    assert page.locator('.tv-compare-pair img').count()==2, "Only one visitor photo alongside reference"
    assert page.locator('.tv-no-photo').count()==0
   else:
    assert page.locator('.tv-compare-pair img').count()==1, "Museum reference still visible without a photo"
   assert 'NOT AUTOMATICALLY VERIFIED' in page.locator('#view').inner_text()
   page.locator('[data-action="manual-accept"]').click()
   page.locator('[data-action="v7-story"]').click()
   assert page.evaluate('state.found.length')==idx
   page.locator('[data-action="v7-puzzle"]').click()
   assert page.locator('.te-workspace').count()==1
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
print('ALL TEN INTERACTIVE LABS PASSED',flush=True)
