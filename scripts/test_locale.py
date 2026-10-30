"""TRACE v2.1 localization: all sections, artwork stories, activities, map, visitor and admin.
No external translation service is used. Published exhibit data is mocked, never modified.
"""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL=os.getenv('TRACE_TEST_URL','http://127.0.0.1:8765/?v=21')
BASE=URL.split('?')[0]
fixture=json.loads((Path(__file__).resolve().parents[1]/'display-status.json').read_text(encoding='utf-8'))
for row in fixture['works'].values():
 row['active']=True
 row['onViewVerified']=True
payload=json.dumps(fixture,ensure_ascii=False)

def intercept(route):
 if 'display-status.json' in route.request.url:
  route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=payload)
 else:route.continue_()

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for museum in ['mmfa','pamm']:
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  page=context.new_page()
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('https://raw.githubusercontent.com/**',intercept)
  page.goto(URL,wait_until='domcontentloaded',timeout=45000)
  page.wait_for_function('window.TRACE_I18N && window.TRACE_I18N.size > 250 && window.TRACE_V1 && window.TRACE_ROUTING && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading',timeout=40000)
  if museum=='pamm':
   page.locator('#venueSwitcher').click()
   page.locator('#venuePicker [data-venue="pamm"]').click()
  for lang,nav,route,work in [('fr','QUÊTE','Trouvez votre prochaine découverte.','L’œil géant' if museum=='mmfa' else 'La tour impossible'),('es','MISIÓN','Encuentra tu próximo descubrimiento.','El ojo gigante' if museum=='mmfa' else 'La torre imposible'),('en','QUEST','Find your next discovery.','The Giant Eye' if museum=='mmfa' else 'The Impossible Tower')]:
   page.locator('[data-trace-lang="'+lang+'"]').click()
   assert page.evaluate('document.documentElement.lang')==lang
   assert page.locator('[data-trace-lang="'+lang+'"]').get_attribute('aria-pressed')=='true'
   assert nav in page.locator('.tabs [data-tab="quest"]').inner_text(),(museum,lang,page.locator('.tabs [data-tab="quest"]').inner_text())
   page.evaluate("state.tab='quest';state.stage='hub';render()")
   page.locator('[data-tab="map"]').click()
   page.wait_for_function('(title)=>document.querySelector("#view")?.textContent.includes(title)',arg=route)
   assert page.locator('.tn-page').count()==1
   page.locator('[data-tab="quest"]').click()
   assert page.evaluate("state.stage")=='hub'
   page.evaluate("state.found=A.slice(0,3).map(a=>a.id);save();render()")
   page.locator('[data-t1-open="3"]').click()
   page.wait_for_function('(needle)=>document.querySelector("#view")?.textContent.includes(needle)',arg=work)
   assert page.locator('.t1-screen').count()>0
   # This new sculpture has a visually-confirmed flow.
   assert page.locator('.v7-fragment img').count()==0
   page.locator('[data-action="photo-quest"]').first.click()
   assert page.locator('.tv-compare-pair img').count()==0
   page.locator('[data-action="manual-review"]').first.click()
   confirmation={'fr':'Est-ce la même œuvre ?','es':'¿Es la misma obra?','en':'Is this the same artwork?'}[lang]
   page.wait_for_function('(needle)=>document.querySelector("#view")?.textContent.includes(needle)',arg=confirmation)
   page.locator('[data-action="manual-accept"]').click()
   page.locator('[data-action="v7-story"]').click()
   expected={'fr':'L’Œil' if museum=='mmfa' else 'Chaos SAS','es':'El ojo' if museum=='mmfa' else 'Chaos SAS','en':'The Eye' if museum=='mmfa' else 'Chaos SAS'}[lang]
   assert expected in page.locator('#view').inner_text()
   page.locator('[data-action="v7-puzzle"]').click()
   page.wait_for_function('(needle)=>document.querySelector("#view")?.textContent.includes(needle)',arg={'fr':'ATELIER CRÉATIF TRACE','es':'TALLER CREATIVO TRACE','en':'TRACE ART-MAKING LAB'}[lang])
   # Recover hub without marking discovery, leaving the test independent of puzzle changes.
   page.evaluate("state.stage='hub';render()")
   print('LOCALIZED WORKFLOW PASS',museum,lang,flush=True)
  # Language selection remains set across reload and switching museums.
  page.locator('[data-trace-lang="fr"]').click()
  page.reload(wait_until='domcontentloaded')
  page.wait_for_function('window.TRACE_I18N && document.documentElement.lang==="fr"',timeout=30000)
  assert page.locator('[data-trace-lang="fr"]').get_attribute('aria-pressed')=='true'
  assert not errors,errors
  context.close()
 # Admin sign-in screen can be localized before credentials are given.
 admin=browser.new_page(viewport={'width':390,'height':844})
 admin.goto(URL+('&portal=admin' if '?' in URL else '?portal=admin'),wait_until='domcontentloaded')
 admin.wait_for_function('window.TRACE_I18N && document.querySelector("#traceAdminTitle")',timeout=30000)
 for lang,label in [('fr','Gérez ce que voient les visiteurs.'),('es','Administra lo que ven los visitantes.'),('en','Manage what visitors see.')]:
  admin.locator('.ta-language-picker [data-trace-lang="'+lang+'"]').click()
  admin.wait_for_function('(label)=>document.querySelector("#traceAdminTitle")?.textContent===label',arg=label)
  print('LOCALIZED ADMIN GATE PASS',lang,flush=True)
 browser.close()
print('ALL TRACE GLOBAL LOCALE TESTS PASSED',flush=True)
