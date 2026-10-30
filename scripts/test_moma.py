"""End-to-end three-institution MoMA pilot validation, including all eight unique games."""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv('TRACE_TEST_URL','http://127.0.0.1:8765/?v=22')
GAMES=['starry','dance','lilies','warhol','oppenheim','tinguely','brancusi','lamelas']
def move(p,element,destination,steps=12):
 a=element.bounding_box()
 assert a,a
 x=a['x']+a['width']/2;y=a['y']+a['height']/2
 p.mouse.move(x,y)
 p.mouse.down()
 p.mouse.move(destination[0],destination[1],steps=steps)
 p.mouse.up()

def play(p,name):
 finish=p.locator('[data-t1-finish]')
 assert finish.is_disabled(),name+' unlocked without creative action'
 before=p.locator('.mg-screen').inner_html()
 if name=='starry':
  area=p.locator('.mg-night').bounding_box()
  for i in range(3):
   x=area['x']+area['width']*(.15+i*.18)
   y=area['y']+area['height']*(.22+i*.12)
   p.mouse.move(x,y);p.mouse.down()
   p.mouse.move(x+85,y+38,steps=14);p.mouse.up()
   assert p.locator('.mg-swirl').count()==i+1
 elif name=='dance':
  for i in range(5):
   source=p.locator('.mg-hand-handle[data-i="'+str(i)+'"]')
   dest=p.locator('.mg-hand-target[data-mg-target="'+str(i)+'"]').bounding_box()
   move(p,source,(dest['x']+dest['width']/2,dest['y']+dest['height']/2))
   assert p.evaluate('window.TRACE_V1.puzzle.extra.links.length')==i+1
  assert p.locator('.mg-dance-complete').count()==1
 elif name=='lilies':
  for i in range(4):p.locator('[data-mg="pad"][data-value="'+str(i)+'"]').click()
  area=p.locator('.mg-pond-scene').bounding_box()
  sun=p.locator('.mg-sun')
  move(p,sun,(area['x']+area['width']*.9,area['y']+28))
  assert p.evaluate('window.TRACE_V1.puzzle.extra.sun')>=.70
  assert float(p.locator('#mg-reflect').get_attribute('opacity'))>.7
 elif name=='warhol':
  p.locator('[data-mg="spin"]').click()
  assert p.evaluate('window.TRACE_V1.puzzle.extra.spins')==1
  target=p.evaluate('window.TRACE_V1.puzzle.extra.reels[0]')
  for i in [1,2]:
   for attempt in range(5):
    if p.evaluate('(i)=>window.TRACE_V1.puzzle.extra.reels[i]',i)==target:break
    p.locator('[data-mg="nudge"][data-value="'+str(i)+'"]').click()
  assert p.locator('.mg-jackpot').count()==1
  assert p.locator('.mg-pop-grid .mg-can').count()==9
 elif name=='oppenheim':
  for material,part in [('fur','cup'),('velvet','saucer'),('ice','spoon')]:
   swatch=p.locator('[data-mg="texture"][data-value="'+material+'"]')
   destination=p.locator('[data-mg-drop="'+part+'"]')
   # The game also supports tapping a swatch then a part.
   swatch.click()
   destination.click()
  assert p.locator('.mg-tea-part.mg-material-fur').count()==1
  assert p.locator('.mg-tea-part.mg-material-velvet').count()==1
  assert p.locator('.mg-tea-part.mg-material-ice').count()==1
  p.locator('[data-mg="reaction"][data-value="1"]').click()
 elif name=='tinguely':
  for i,k in enumerate(['gear','belt','rod','hook','paint']):
   piece=p.locator('[data-mg="part"][data-value="'+k+'"]')
   dest=p.locator('[data-mg="socket"][data-value="'+str(i)+'"]').bounding_box()
   move(p,piece,(dest['x']+dest['width']/2,dest['y']+dest['height']/2))
   assert p.evaluate('window.TRACE_V1.puzzle.extra.installed.length')==i+1
  assert p.locator('.mg-wheel.can-spin').count()==1
  wheel=p.locator('.mg-wheel').bounding_box()
  cx=wheel['x']+wheel['width']/2;cy=wheel['y']+wheel['height']/2
  from math import sin,cos,pi
  radius=min(wheel['width'],wheel['height'])*.31
  p.mouse.move(cx+radius,cy);p.mouse.down()
  for step in range(1,26):
   angle=step*2*pi/25
   p.mouse.move(cx+radius*cos(angle),cy+radius*sin(angle))
  p.mouse.up()
  assert p.locator('.mg-machine.is-fired').count()==1
  assert p.locator('.mg-paint-bucket').count()==1
 elif name=='brancusi':
  for key,dx,dy in [('tip',0,-38),('width',24,0)]:
   point=p.locator('[data-mg-drag="sculpt"][data-point="'+key+'"]')
   rect=point.bounding_box()
   move(p,point,(rect['x']+rect['width']/2+dx,rect['y']+rect['height']/2+dy))
  assert p.evaluate('window.TRACE_V1.puzzle.extra.sculptMoves.length')>=2
  p.locator('[data-mg="listen"]').click()
  assert p.evaluate('window.TRACE_V1.puzzle.extra.previewed') is True
 elif name=='lamelas':
  for medium in ['news','radio','tv']:
   p.locator('[data-mg="media"][data-value="'+medium+'"]').click()
   assert p.locator('.mg-media-'+medium).count()==1
  p.locator('[data-mg="takeaway"][data-value="different"]').click()
  assert p.evaluate('window.TRACE_V1.puzzle.extra.mediaSeen.length')==3
 assert p.evaluate('window.TRACE_V1.puzzle.done') is True,'Game did not unlock: '+name
 assert finish.is_enabled()
 assert p.locator('.mg-feedback.is-complete').count()==1
 assert before !=p.locator('.mg-screen').inner_html(),name+' visual did not change'
 print('REDESIGNED MOMA GAME PASSED',name,flush=True)

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
 page.locator('[data-tab="album"]').click()
 assert page.locator('.v7-passport-item img').count()==0, 'Undiscovered art must remain hidden in passport'
 assert page.locator('.tq-locked-passport').count()==8, 'All eight mysteries should have hidden covers'
 page.locator('[data-tab="quest"]').click()
 for i,name in enumerate(GAMES):
  page.locator('[data-t1-open="'+str(i)+'"]').click()
  assert page.evaluate('A[state.current].id')=='moma-'+name
  assert page.locator('.v7-fragment img').count()==0, 'Art image revealed before visitor photo'
  assert page.locator('[data-action="photo-quest"]').count()==1
  page.locator('[data-action="photo-quest"]').click()
  assert page.evaluate("state.stage")=='photoquest'
  assert page.locator('.tv-compare-pair img').count()==0
  assert page.locator('.tq-capture-zone img').count()==0
  assert page.locator('[data-action="photo-compare"]').count()==0
  assert page.locator('[data-guess-photo]').count()==1
  import base64
  png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ/q7UcAAAAASUVORK5CYII=')
  page.locator('[data-guess-photo]').set_input_files({'name':'guess.png','mimeType':'image/png','buffer':png})
  page.wait_for_function("state.scanImage?.startsWith('data:image/jpeg;')")
  assert page.locator('.tq-capture-zone img').count()==1, 'Only visitor photo should be shown'
  assert page.locator('.tv-compare-pair img').count()==0, 'Museum reference appeared before choice'
  page.locator('[data-action="photo-compare"]').click()
  assert page.evaluate("state.stage")=='manualreview'
  assert page.locator('.tv-compare-pair img').count()==2
  assert page.locator('[data-action="manual-accept"]').count()==1
  page.locator('[data-action="manual-accept"]').click()
  page.locator('[data-action="v7-story"]').click()
  page.locator('[data-action="v7-puzzle"]').click()
  assert page.locator('.mg-screen').count()==1
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
  # Game controls and curator room labels must be localized, not only artwork stories.
  page.evaluate("state.current=3;state.stage='puzzle';render()")
  assert ({'fr':'TIRER LE LEVIER','es':'TIRA DE LA PALANCA'}[lang]) in page.locator('.mg-slot').inner_text()
  page.evaluate("state.stage='hub';render()")
  page.locator('[data-tab="map"]').click()
  assert {'fr':'Plan officiel du MoMA','es':'Plano oficial del MoMA'}[lang] in page.locator('#view').inner_text()
  page.locator('[data-tab="quest"]').click()
 assert not errors,errors
 print('ALL MOMA THIRD MUSEUM END-TO-END TESTS PASSED',flush=True)
 browser.close()
