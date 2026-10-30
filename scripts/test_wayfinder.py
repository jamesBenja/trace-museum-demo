"""TRACE v3 wayfinder research, accessible routes, closures and curator controls."""
import os
from playwright.sync_api import sync_playwright
URL=os.getenv("TRACE_TEST_URL","https://jamesbenja.github.io/trace-museum-demo/?v=30")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 page=browser.new_page(viewport={"width":390,"height":844})
 errors=[]
 page.on("pageerror",lambda err:errors.append(str(err)))
 response=page.goto(URL,wait_until="domcontentloaded",timeout=45000)
 assert response and response.status==200
 page.wait_for_function("window.TRACE_ROUTING && window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading",timeout=45000)
 page.locator('[data-tab="map"]').click()
 assert page.locator(".tn-connectivity").count()==1
 assert "Map research" in page.locator(".tn-connectivity").inner_text()
 assert "SUGGESTED GALLERY ORDER" in page.locator("#view").inner_text()
 assert page.evaluate("TRACE_DISPLAY.connections('mmfa').every(e=>e.status==='research')")
 # Move to MoMA via the standard museum switcher.
 page.locator("#venueSwitcher").click()
 page.locator('#venuePicker [data-venue="moma"]').click()
 page.locator('[data-tab="map"]').click()
 assert page.evaluate("TRACE_DISPLAY.rooms('moma').some(x=>x.id==='moma-407')")
 assert page.evaluate("TRACE_ROUTING.path('moma-405','moma-412')===null")
 assert page.evaluate("TRACE_ROUTING.path('moma-405','moma-412',true).join(',')")==  "moma-405,moma-407,moma-408,moma-410,moma-412"
 page.locator("[data-tn-start]").select_option("moma-405")
 page.locator('[data-tn-focus="moma-warhol"]').first.click()
 assert "published maps" in page.locator(".tn-connectivity").inner_text()
 assert page.locator(".tn-path-node").count()>=5
 # Staff approval and immediate temporary closures are independent of artwork assignment.
 page.evaluate("()=>{TRACE_AUTH.isAdmin=()=>true;tab('museum')}")
 button=page.locator('[data-tn-approve="moma-405:moma-407:corridor"]')
 assert button.count()==1
 button.click()
 assert page.evaluate("TRACE_DISPLAY.connections('moma').find(e=>e.from==='moma-405'&&e.to==='moma-407').status")== "approved"
 assert page.evaluate("TRACE_ROUTING.path('moma-405','moma-407').length")==2
 page.locator('[data-tn-closure="moma-405:moma-407:corridor"]').click()
 assert page.evaluate("TRACE_ROUTING.path('moma-405','moma-407')===null")
 page.locator('[data-tn-closure="moma-405:moma-407:corridor"]').click()
 assert page.evaluate("TRACE_ROUTING.path('moma-405','moma-407').length")==2
 # Research stays unapproved in the shared visitor catalogue until actually published.
 assert page.evaluate("TRACE_DISPLAY.published.connections.moma.find(e=>e.from==='moma-405'&&e.to==='moma-407').status")== "research"
 assert not errors,errors
 print("TRACE WAYFINDER PASS: map research, partial path, approval, closure and reopening",flush=True)
 browser.close()
