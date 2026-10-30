"""TRACE v2.4: Mica text-first optional close-up clue, all 24 works and all languages.
A real source image must only enter the DOM after an explicit reveal action.
Tests a cropped scale of >=3x, no full image leak, and photo-first next step.
"""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL=os.getenv('TRACE_TEST_URL','http://127.0.0.1:8765/?v=24')
fixture=json.loads((Path(__file__).resolve().parents[1]/'display-status.json').read_text(encoding='utf-8'))
for row in fixture['works'].values():
 row['active']=True
 row['onViewVerified']=False
 row['startDate']=''
 row['endDate']=''
payload=json.dumps(fixture,ensure_ascii=False)
LANG={
'en':('STEP 1 · MICA’S WORD CLUE','STEP 2 · OPTIONAL VISUAL HINT','Mica reveals a clue!'),
'fr':('ÉTAPE 1 · L’INDICE ÉCRIT DE MICA','ÉTAPE 2 · INDICE VISUEL FACULTATIF','Mica révèle un indice !'),
'es':('PASO 1 · LA PISTA ESCRITA DE MICA','PASO 2 · PISTA VISUAL OPCIONAL','¡Mica revela una pista!')
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[]
 page.on('pageerror',lambda exc:errors.append(str(exc)))
 def route(r):
  if 'display-status.json' in r.request.url:r.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=payload)
  else:r.continue_()
 page.route('https://raw.githubusercontent.com/**',route)
 r=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 assert r and r.status==200
 page.wait_for_function('window.TRACE_V1 && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading',timeout=35000)
 assert page.evaluate('ALL.length')==24
 for museum in ['mmfa','pamm','moma']:
  if museum!=page.evaluate('state.venue'):
   page.locator('#venueSwitcher').click()
   page.locator('#venuePicker [data-venue="'+museum+'"]').click()
  assert page.evaluate('A.length')==8
  # Explicitly test every curated artwork, including sculpture/mixed media.
  for i in range(8):
   page.evaluate("(i)=>{state.current=i;state.tab='quest';state.stage='clue';render()}",i)
   artwork=page.evaluate('A[state.current].id')
   assert artwork.startswith(museum+'-')
   assert page.locator('.t1-word-clue').count()==1,artwork
   assert page.locator('.t1-word-clue p').inner_text(),artwork
   assert page.locator('.t1-detail-trigger').count()==1,artwork
   assert page.locator('.t1-detail-trigger').get_attribute('aria-expanded')=='false'
   assert page.locator('.t1-detail-frame img').count()==0,'Pre-reveal full image leak '+artwork
   assert page.locator('.v7-fragment img').count()==0,'Old cropped preview leaked '+artwork
   assert page.locator('.t1-detail-annotation').count()==0
   page.locator('[data-t1-detail-reveal]').click()
   assert page.locator('.t1-detail-expanded').count()==1,artwork
   assert page.locator('.t1-detail-mica').count()==1,artwork
   assert page.locator('.t1-detail-stars span').count()==4,artwork
   assert page.locator('.t1-detail-frame img').count()==1,artwork
   assert page.locator('.t1-detail-annotation p').inner_text()==page.locator('.t1-word-clue p').inner_text(),artwork
   vals=page.locator('.t1-detail-frame img').evaluate("""img=>{
    const f=img.closest('.t1-detail-frame'),styles=getComputedStyle(img),rect=img.getBoundingClientRect(),box=f.getBoundingClientRect();
    return {zoom:rect.width/box.width,overflow:getComputedStyle(f).overflow,fit:styles.objectFit,origin:styles.transformOrigin}
   }""")
   assert vals['zoom']>2.8,('Not a close-up crop',artwork,vals)
   assert vals['overflow']=='hidden',('Crop not clipped',artwork,vals)
   assert vals['fit']=='cover'
   # Visitor can hide the hint and return to the original word-only challenge.
   page.locator('[data-t1-detail-hide]').click()
   assert page.locator('.t1-detail-frame img').count()==0,artwork
   assert page.locator('[data-t1-detail-reveal]').count()==1
  print('EIGHT TEXT-FIRST CLUES AND CROPS PASS',museum,flush=True)
  # Switching languages on a revealed clue preserves the same artwork and state.
  for lang,(first,second,mica) in LANG.items():
   page.locator('[data-trace-lang="'+lang+'"]').click()
   page.evaluate("state.current=0;state.stage='clue';render()")
   assert first in page.locator('#view').inner_text(),(museum,lang,'word step')
   assert second in page.locator('#view').inner_text(),(museum,lang,'detail step')
   assert page.locator('.t1-detail-frame img').count()==0
   page.locator('[data-t1-detail-reveal]').click()
   assert mica in page.locator('.t1-detail-annotation').inner_text(),(museum,lang,'Mica translation')
   page.locator('[data-trace-lang="'+('fr' if lang=='en' else 'en')+'"]').click()
   assert page.locator('.t1-detail-frame img').count()==1,'Language switch lost revealed clue'
   page.locator('[data-t1-detail-hide]').click()
  print('TRILINGUAL DETAIL REVEAL PASS',museum,flush=True)
  page.locator('[data-trace-lang="en"]').click()
 # A photo-first screen still only displays the visitor's own photo, not the reference.
 page.evaluate("state.current=0;state.stage='clue';render()")
 page.locator('[data-action="photo-quest"]').click()
 assert page.locator('.t1-detail-frame img').count()==0
 assert page.locator('.tv-compare-pair img').count()==0
 assert page.locator('.tq-capture-zone img').count()==0
 assert not errors,errors
 print('ALL OPTIONAL MICA ZOOM DETAIL TESTS PASSED',flush=True)
 browser.close()
