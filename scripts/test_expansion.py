"""Ensure TRACE 1.5 added sculpture/mixed-media chapters are accessible, explicit
about photo verification, and can be completed in both museum adventures."""
from playwright.sync_api import sync_playwright
import os
URL=os.getenv('TRACE_TEST_URL','https://jamesbenja.github.io/trace-museum-demo/?v=15')
ADDED={
 'mmfa':['mmfa-eye','mmfa-frink','mmfa-riopelle','mmfa-rodin','mmfa-cragg'],
 'pamm':['pamm-chaos','pamm-fonseca','pamm-yanko','pamm-christo','pamm-chromati']
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for museum,ids in ADDED.items():
  page=browser.new_page(viewport={'width':390,'height':844})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  res=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
  assert res and res.status==200, 'HTTP error'
  assert 'v1.6' in page.title(),page.title()
  page.wait_for_function("window.TRACE_EXTRA && window.TRACE_V1 && document.querySelector('#status')?.textContent.includes('IMAGE REFERENCES')",timeout=50000)
  if museum=='pamm':
   page.locator('#venueSwitcher').click()
   page.locator('#venuePicker [data-venue="pamm"]').click()
  assert page.evaluate('A.length')==8
  assert page.evaluate("ALL.length")==16
  assert page.evaluate("A.filter(x=>x.kind==='sculpture'||x.kind==='mixed-media sculpture').length")>=3
  print('EXPANDED CATALOG',museum,'8 artworks',flush=True)
  # The first three reference-tested artworks are carried forward and unlocked.
  page.evaluate("""() => {
    state.found=A.slice(0,3).map(a=>a.id);state.current=2;
    state.stage='hub';state.tab='quest';save();render();
  }""")
  assert page.locator('[data-t1-open]').count()==8
  for idx,ident in enumerate(ids,start=3):
   page.locator('[data-t1-open="'+str(idx)+'"]').click()
   assert page.evaluate('A[state.current].id')==ident
   assert '3D image recognition is not validated' in page.locator('#view').inner_text()
   image=page.locator('.v7-fragment img').evaluate("""(el)=>({loaded:el.complete&&el.naturalWidth>0,url:el.currentSrc})""")
   print('ARTWORK DISPLAY',ident,image,flush=True)
   # An external museum image is helpful for visitors, but never counts as verified scan.
   page.locator('[data-action="manual-review"]').click()
   assert 'NOT AUTOMATICALLY VERIFIED' in page.locator('#view').inner_text()
   assert page.locator('a[href*="/artwork/"],a[href*="/works/"]').count()>0
   page.locator('[data-action="manual-accept"]').click()
   assert 'VISITOR-CONFIRMED DISCOVERY' in page.locator('#view').inner_text()
   page.locator('[data-action="v7-story"]').click()
   assert page.evaluate('state.found.length')==idx
   page.locator('[data-action="v7-puzzle"]').click()
   assert page.locator('[data-extra-step]').count()==3
   for n in range(3):
    page.locator('[data-extra-step="'+str(n)+'"]').click()
   assert page.locator('[data-t1-finish]').is_enabled()
   page.locator('[data-t1-finish]').click()
   assert page.evaluate('state.found.length')==idx+1
   page.locator('[data-t1-hub]').click()
  assert page.evaluate('state.found.length')==8
  assert page.locator('[data-t1-open]').count()==8
  assert page.locator('[data-bonus-open]').count()==1
  page.locator('[data-bonus-open]').click()
  page.locator('[data-bonus-pick="'+ids[0]+'"]').click()
  page.locator('[data-bonus-pick="'+ids[1]+'"]').click()
  assert page.locator('[data-bonus-lens]').count()==3
  page.locator('[data-bonus-observe="left:0"]').click()
  page.locator('[data-bonus-observe="right:1"]').click()
  page.locator('[data-bonus-finish]').click()
  assert 'ART BRIDGE CREATED' in page.locator('#view').inner_text()
  print('EXPANSION COMPLETE',museum,'8 works and mixed-media connection, errors',errors,flush=True)
  assert not errors,errors
  page.close()
 browser.close()
print('ALL EXPANSION TESTS PASSED',flush=True)
