"""TRACE 1.6 admin, official map and accessible route regression tests."""
import os
from playwright.sync_api import sync_playwright
URL=os.getenv('TRACE_TEST_URL','https://jamesbenja.github.io/trace-museum-demo/?v=16')
VENUES={
 'mmfa':{'arts':['mmfa-marrel','mmfa-witte','mmfa-fortin'],'locs':['mmfa-peace-3','mmfa-peace-2','mmfa-bourgie-s1'],'entry':'mmfa-entrance','pdf':'https://www.mbam.qc.ca/en/mmfa-museum-map/'},
 'pamm':{'arts':['pamm-masks','pamm-delano','pamm-grid'],'locs':['pamm-3','pamm-4','pamm-5'],'entry':'pamm-1','pdf':'https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf'}
}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for museum,config in VENUES.items():
  page=browser.new_page(viewport={'width':412,'height':896},accept_downloads=True)
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  r=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
  assert r.status==200 and 'v2.5' in page.title()
  page.wait_for_function("window.TRACE_ROUTING && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=60000)
  if museum=='pamm':
   page.locator('#venueSwitcher').click()
   page.locator('#venuePicker [data-venue="pamm"]').click()
  page.evaluate("tab('museum')")
  assert page.locator('[data-td-active]').count()==8
  assert page.locator('[data-td-room]').count()==8
  assert config['pdf'] in page.locator('#view').inner_html()
  # Curator confirms three artworks are on-view and assigns actual rooms.
  # This is local TEST data, never a museum-certified real placement.
  for art,room in zip(config['arts'],config['locs']):
   page.locator('[data-td-room="'+art+'"]').select_option(room)
   page.locator('[data-td-verified="'+art+'"]').check()
  assert all(page.evaluate("(id)=>TRACE_DISPLAY.isVerified(id)",art) for art in config['arts'])
  page.evaluate("tab('map')")
  assert config['pdf'] in page.locator('#view').inner_html()
  assert 'SUGGESTED GALLERY ORDER' in page.locator('#view').inner_text()
  assert page.locator('[data-tn-start]').count()==1
  assert page.locator('[data-tn-access]').count()==1
  # Staff enters explicitly approved passage types. No hallway inference.
  page.evaluate("tab('museum')")
  def add_link(a,b,kind):
   page.locator('#tn-link-from').select_option(a)
   page.locator('#tn-link-to').select_option(b)
   page.locator('#tn-link-type').select_option(kind)
   page.locator('[data-tn-connect]').click()
  a,b,c=config['locs']
  add_link(config['entry'],a,'corridor')
  add_link(a,b,'stairs')
  add_link(b,c,'elevator')
  page.evaluate("tab('map')")
  assert 'SUGGESTED GALLERY ORDER' in page.locator('#view').inner_text()
  page.locator('[data-tn-access]').select_option('all')
  assert 'ROOM ROUTE FROM CURATOR-CONFIGURED CONNECTIONS' in page.locator('#view').inner_text()
  assert 'Take the stairs' in page.locator('#view').inner_text()
  page.locator('[data-tn-access]').select_option('stepfree')
  assert 'SUGGESTED GALLERY ORDER' in page.locator('#view').inner_text()
  # Add elevator alternative. Step-free route should work.
  page.evaluate("tab('museum')")
  # Existing a-b stairs edge prevents parallel link; create step-free shortcut
  add_link(config['entry'],b,'elevator')
  page.evaluate("tab('map')")
  assert 'ROOM ROUTE FROM CURATOR-CONFIGURED CONNECTIONS' in page.locator('#view').inner_text()
  assert 'Take the stairs' not in page.locator('#view').inner_text()
  # Curator takes one artwork off view, which must immediately disappear.
  page.evaluate("tab('museum')")
  page.locator('[data-td-active="'+config['arts'][1]+'"]').uncheck()
  assert not page.evaluate("(id)=>TRACE_DISPLAY.isActive(id)",config['arts'][1])
  page.evaluate("tab('map')")
  assert config['arts'][1] not in page.evaluate("TRACE_ROUTING.routeWorks().map(x=>x.id)")
  manifest=page.evaluate("JSON.parse(TRACE_DISPLAY.exportJSON())")
  assert len(manifest['connections'][museum])==4
  assert manifest['works'][config['arts'][1]]['active']==False
  assert manifest['works'][config['arts'][0]]['onViewVerified']==True
  page.reload(wait_until='domcontentloaded')
  page.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=60000)
  assert page.evaluate("(id)=>TRACE_DISPLAY.isVerified(id)",config['arts'][0])
  assert not page.evaluate("(id)=>TRACE_DISPLAY.isActive(id)",config['arts'][1])
  assert not errors,errors
  print("ADMIN MAP PASS",museum,"official map, curator assignments, stair avoidance, route removal and local persistence",flush=True)
  page.close()
 browser.close()
print('ALL ADMIN MAP TESTS PASSED',flush=True)
