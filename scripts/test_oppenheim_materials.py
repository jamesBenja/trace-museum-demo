"""Visual integration checks for Oppenheim's cup, saucer, and spoon.
No placeholder glyphs or background-only texture replacement is accepted.
The browser screenshots measure the SVG OBJECTS themselves, not the labels/cards.
"""
import os
from playwright.sync_api import sync_playwright

URL=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=25")
MATERIALS=["ceramic","fur","velvet","ice","spikes","grass","metal","feathers"]
PARTS=["cup","saucer","spoon"]

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
 for width in (390,320):
  page=browser.new_page(viewport={"width":width,"height":844},is_mobile=True,has_touch=True,reduced_motion="reduce")
  errs=[]
  page.on("pageerror",lambda e:errs.append(str(e)))
  resp=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
  assert resp and resp.status==200
  page.wait_for_function("window.TRACE_MOMA_GAME && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=45000)
  page.locator("#venueSwitcher").click()
  page.locator('#venuePicker [data-venue="moma"]').click()
  page.evaluate("""()=>{state.tab='quest';state.current=4;state.stage='puzzle';render()}""")
  assert page.evaluate("A[state.current].id")=="moma-oppenheim"
  assert page.locator(".mg-tea-part").count()==3
  assert page.locator(".mg-tea-illustration").count()==3
  for part,shape in (("cup",".mg-tea-cup-body"),("saucer",".mg-tea-saucer-body"),("spoon",".mg-tea-spoon-bowl")):
   item=page.locator('.mg-tea-part[data-object="'+part+'"]')
   assert item.locator(shape).count()==1,part+" lacks a real recognizable filled shape"
   assert item.locator(".mg-tea-coating").count()>=2,part+" lacks 3D material-bearing surfaces"
   assert item.locator(".mg-tea-illustration").get_attribute("viewBox")=="0 0 140 160"
   assert item.locator("svg text").count()==0,"Do not use glyphs as the artwork"
  assert page.locator(".mg-tea-spoon-handle").count()==1
  assert page.locator(".mg-tea-saucer-rim").count()==1
  # Establish a uniform porcelain reference and capture the rendered vectors.
  page.locator('[data-mg="texture"][data-value="ceramic"]').click()
  for part in PARTS:
   page.locator('.mg-tea-part[data-object="'+part+'"]').click()
  porcelain={part:page.locator('.mg-tea-part[data-object="'+part+'"] svg').screenshot() for part in PARTS}
  assert len(set(porcelain.values()))==3,"The three shapes should be individually recognisable"
  # All 8 materials must visibly coat all 3 distinct shapes.
  for material in MATERIALS:
   page.locator('[data-mg="texture"][data-value="'+material+'"]').click()
   for part in PARTS:
    before_others={other:page.locator('.mg-tea-part[data-object="'+other+'"] svg').screenshot() for other in PARTS if other!=part}
    page.locator('.mg-tea-part[data-object="'+part+'"]').click()
    item=page.locator('.mg-tea-part[data-object="'+part+'"]')
    assert item.get_attribute("data-material")==material,(part,material)
    surface=item.locator('[data-object-surface="'+part+'"]')
    assert surface.get_attribute("data-material")==material,(part,material,"SVG not updated")
    assert item.locator(".mg-tea-coating").first.get_attribute("fill") == "none" if part=="cup" else True
    coatings=item.locator(".mg-tea-coating")
    assert any("url(#mg-tea-"+part+"-coat)" in (coatings.nth(i).get_attribute("fill") or "") for i in range(coatings.count())),(part,material,"fill not in actual object")
    if material!="ceramic":
     new_image=item.locator("svg").screenshot()
     assert new_image!=porcelain[part],(part,material,"SVG rendered exactly like unchanged porcelain")
    if material=="fur":
     assert item.locator(".mg-tea-fringe-fur path").count()>15,(part,"furry outline missing")
    for other,old_img in before_others.items():
     after=page.locator('.mg-tea-part[data-object="'+other+'"] svg').screenshot()
     assert old_img==after,(part,material,"Changing one object affected "+other)
   print("REAL TEA OBJECT TEXTURE",width,material,"CUP SAUCER SPOON PASSED",flush=True)
  # Verify creative completion remains functional after real geometry rendering.
  for material,part in [("fur","cup"),("velvet","saucer"),("ice","spoon")]:
   page.locator('[data-mg="texture"][data-value="'+material+'"]').click()
   page.locator('.mg-tea-part[data-object="'+part+'"]').click()
  assert page.locator(".mg-tea-fringe-fur path").count()>15
  page.locator('[data-mg="reaction"][data-value="1"]').click()
  assert page.evaluate("window.TRACE_V1.puzzle.done") is True
  assert page.locator("[data-t1-finish]").is_enabled()
  assert not errs,errs
  page.close()
 browser.close()
 print("ALL OPPENHEIM SVG MATERIAL AND INDIVIDUAL OBJECT TESTS PASSED",flush=True)
