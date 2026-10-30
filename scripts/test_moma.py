"""End-to-end three-institution MoMA pilot validation, including all eight unique games."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv('TRACE_TEST_URL','http://127.0.0.1:8765/?v=22')
GAMES=['starry','dance','lilies','warhol','oppenheim','tinguely','brancusi','lamelas']
def slide(p,name,value):
 p.locator('[data-tm-range="'+name+'"]').evaluate('(el,v)=>{el.value=String(v);el.dispatchEvent(new Event("input",{bubbles:true}))}',value)

def play(p,name):
 if name=='starry':
  for i in range(3):p.locator('[data-tm="star"][data-val="'+str(i)+'"]').click()
 elif name=='dance':
  for i in range(5):p.locator('[data-tm="dancer"][data-val="'+str(i)+'"]').click()
 elif name=='lilies':
  for i in range(4):p.locator('[data-tm="lily"][data-val="'+str(i)+'"]').click()
  slide(p,'reflection',80)
 elif name=='warhol':
  for x in ('Tomato','Mushroom','Pea'):p.locator('[data-tm="soup"][data-val="'+x+'"]').click()
 elif name=='oppenheim':
  p.locator('[data-tm="texture"][data-val="fur"]').click()
  for x in ('surprise','strange'):p.locator('[data-tm="feeling"][data-val="'+x+'"]').click()
 elif name=='tinguely':
  for i in range(3):p.locator('[data-tm="part"][data-val="'+str(i)+'"]').click()
  slide(p,'turn',80)
 elif name=='brancusi':
  slide(p,'crest',90)
 elif name=='lamelas':
  for i in range(3):p.locator('[data-tm="source"][data-val="'+str(i)+'"]').click()
 assert p.evaluate('window.TRACE_V1.puzzle.done') is True, 'Game did not unlock: '+name
 assert p.locator('[data-t1-finish]').is_enabled()
 print('MOMA GAME PASSED',name,flush=True)

with sync_playwright() as q:
 browser=q.chromium.launch(headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 response=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 assert response and response.status==200
 page.wait_for_function('window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading && window.TRACE_MOMA_GAME && window.TRACE_V1',timeout=45000)
 assert page.evaluate('moma.length')==8
 assert page.evaluate('ALL.length')==24
 assert page.locator('#venuePicker').count()==1
 page.locator('#venueSwitcher').click()
 assert page.locator('#venuePicker [data-venue]').count()==3
 page.locator('#venuePicker [data-venue="moma"]').click()
 assert page.evaluate('state.venue')=='moma'
 assert page.evaluate('A.map(a=>a.id)')==['moma-'+x for x in GAMES]
 assert page.evaluate("window.TRACE_DISPLAY.count('moma')")==8
 assert page.evaluate("window.TRACE_DISPLAY.isVerified('moma-starry')")==False
 assert page.evaluate("window.TRACE_ROUTING.MAPS.moma.url")=="https://www.moma.org/visit/guide/map"
 page.locator('[data-tab="map"]').click()
 assert 'MoMA official visitor map' in page.locator('#view').inner_text()
 assert 'Gallery 501' in page.locator('#view').inner_text()
 assert 'SUGGESTED GALLERY ORDER' in page.locator('#view').inner_text(), 'No invented walking turns'
 page.locator('[data-tab="quest"]').click()
 page.evaluate("state.tab='quest';state.stage='intro';render()")
 for lang in ['en','fr','es']:
  page.locator('[data-trace-lang="'+lang+'"]').click()
  page.locator('[data-t1-start]').click()
  assert page.locator('.tw-screen').get_attribute('lang')==lang
  page.locator('[data-tw-next]').click()
  assert '1929' in page.locator('#view').inner_text()
  page.locator('[data-tw-next]').click()
  assert '2019' in page.locator('#view').inner_text()
  page.locator('[data-tw-skip]').click()
  assert page.evaluate('state.stage')=='hub'
  page.evaluate("state.stage='intro';render()")
  print('MOMA MICA PASS',lang,flush=True)
 page.locator('[data-trace-lang="en"]').click()
 page.evaluate("state.stage='hub';state.found=[];save();render()")
 for i,name in enumerate(GAMES):
  page.locator('[data-t1-open="'+str(i)+'"]').click()
  assert page.evaluate('A[state.current].id')=='moma-'+name
  assert page.locator('[data-action="manual-review"]').count()==1
  page.locator('[data-action="manual-review"]').click()
  assert page.locator('[data-compare-photo]').count()==1
  assert page.locator('[data-action="manual-accept"]').count()==1
  page.locator('[data-action="manual-accept"]').click()
  page.locator('[data-action="v7-story"]').click()
  page.locator('[data-action="v7-puzzle"]').click()
  assert page.locator('.tm-screen').count()==1
  assert not page.locator('[data-t1-finish]').is_enabled()
  play(page,name)
  page.locator('[data-t1-finish]').click()
  assert page.evaluate('state.found.length')==i+1
  page.locator('[data-t1-hub]').click()
 assert page.evaluate('state.found.length')==8
 page.locator('#venueSwitcher').click()
 page.locator('#venuePicker [data-venue="mmfa"]').click()
 assert page.evaluate('state.venue')=='mmfa'
 assert page.evaluate('state.found.length')==0, 'MoMA progress must not leak into MMFA'
 page.locator('#venueSwitcher').click()
 page.locator('#venuePicker [data-venue="moma"]').click()
 assert page.evaluate('state.found.length')==8, 'MoMA progress lost'
 for lang,expected in [('fr','Le ciel tourbillonnant'),('es','El cielo en remolinos')]:
  page.locator('[data-trace-lang="'+lang+'"]').click()
  page.locator('[data-t1-open="0"]').click()
  assert expected in page.locator('#view').inner_text()
  page.evaluate("state.stage='hub';render()")
 assert not errors,errors
 print('ALL MOMA THIRD MUSEUM END-TO-END TESTS PASSED',flush=True)
 browser.close()
