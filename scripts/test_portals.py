"""TRACE v1.8 end-to-end test: admin sign-in, GitHub-backed publication and two visitors.
The GitHub REST transport is mocked so no real museum exhibition records are changed.
Every UI, credential gate, draft, PUT payload, shared visitor refresh and role restriction is executed in Chromium.
"""
import os,json,base64
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

BASE=os.getenv("TRACE_TEST_URL","http://127.0.0.1:8765/?v=18")
parts=urlsplit(BASE)
ROOT=parts.scheme+"://"+parts.netloc+parts.path.rsplit("/",1)[0]+"/"
def url(page):return ROOT+page+"?v=18"
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
 seed_ctx=browser.new_context()
 seed=seed_ctx.request.get(ROOT+"display-status.json")
 assert seed.ok, "Published source file must exist"
 baseline=seed.json()
 seed_ctx.close()
 # This simulation must not assume or change the live curator's artwork settings.
 original={"mmfa-marrel","mmfa-witte","mmfa-fortin","pamm-masks","pamm-delano","pamm-grid"}
 for ident,row in baseline["works"].items():
  row["active"]=ident in original
  row["onViewVerified"]=False
  row["room"]=""
  row["startDate"]=""
  row["endDate"]=""
 baseline["connections"]={"mmfa":[],"pamm":[]}
 shared={"content":baseline,"sha":"mock-sha-0","version":0,"writes":0}
 failures=[]
 def network(route):
  target=route.request.url
  method=route.request.method
  if "raw.githubusercontent.com/" in target and "display-status.json" in target:
   route.fulfill(status=200,content_type="application/json",headers={"Access-Control-Allow-Origin":"*","Cache-Control":"no-store"},
    body=json.dumps(shared["content"]))
   return
  if "api.github.com/user" in target:
   auth=route.request.headers.get("authorization","")
   if auth not in ["Bearer mock-write-token","Bearer mock-read-token"]:
    route.fulfill(status=401,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},body='{"message":"Bad credentials"}')
   else:
    route.fulfill(status=200,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},
     body='{"login":"trace-test-curator"}')
   return
  if "api.github.com/repos/jamesBenja/trace-museum-demo/contents/display-status.json" in target:
   if method=="GET":
    content=base64.b64encode((json.dumps(shared["content"],ensure_ascii=False)+"\n").encode("utf-8")).decode()
    route.fulfill(status=200,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},
     body=json.dumps({"sha":shared["sha"],"content":content,"encoding":"base64","size":len(content)}))
   elif method=="PUT":
    auth=route.request.headers.get("authorization","")
    if auth!="Bearer mock-write-token":
     route.fulfill(status=403,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},
      body='{"message":"Contents write permission required"}')
     return
    req=route.request.post_data_json
    if req.get("sha")!=shared["sha"]:
     route.fulfill(status=409,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},
      body='{"message":"Conflict; please refresh"}')
     return
    data=json.loads(base64.b64decode(req["content"]).decode("utf-8"))
    assert len(data["works"])==16
    assert data["rooms"]["mmfa"] and data["rooms"]["pamm"]
    shared["content"]=data
    shared["version"]+=1
    shared["writes"]+=1
    shared["sha"]="mock-sha-"+str(shared["version"])
    route.fulfill(status=200,content_type="application/json",headers={"Access-Control-Allow-Origin":"*"},
     body=json.dumps({"content":{"sha":shared["sha"]},"commit":{"sha":"fake-commit"}}))
   else:
    route.fulfill(status=405,body="Method not supported")
   return
  route.continue_()
 def new_page(target):
  ctx=browser.new_context(viewport={"width":390,"height":844},accept_downloads=True)
  ctx.route("**/raw.githubusercontent.com/**",network)
  ctx.route("https://api.github.com/**",network)
  pg=ctx.new_page()
  pg.on("pageerror",lambda error:failures.append(str(error)))
  response=pg.goto(url(target),wait_until="domcontentloaded",timeout=45000)
  assert response and response.status==200
  pg.wait_for_function("window.TRACE_DISPLAY && !window.TRACE_DISPLAY.loading && window.TRACE_AUTH",timeout=35000)
  return ctx,pg
 c1,v1=new_page("visit.html")
 c2,v2=new_page("visit.html")
 assert v1.evaluate("window.TRACE_AUTH.portal")=="visitor"
 assert not v1.locator("[data-tab='museum']").is_visible()
 assert v1.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 assert v2.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 v1.evaluate("window.TRACE_DISPLAY.setField('mmfa-eye','active',true)")
 assert v1.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 assert v1.evaluate("window.TRACE_DISPLAY.draft===null")
 v1.locator("[data-tab='quest']").click()
 v1.locator("[data-t1-start]").click()
 assert v1.locator("[data-t1-open]").count()==3
 print("VISITOR ROLE PASS: no museum controls, no edits, only published artworks",flush=True)
 ca,admin=new_page("admin.html")
 assert admin.evaluate("window.TRACE_AUTH.portal")=="admin"
 assert admin.locator("#traceAdminLogin").is_visible()
 assert not admin.locator("[data-tab='museum']").is_visible()
 admin.locator("#traceAdminToken").fill("wrong-test-token")
 admin.locator("#traceAdminSubmit").click()
 admin.wait_for_function("document.querySelector('#traceAdminFeedback')?.textContent.includes('Sign-in failed')",timeout=12000)
 assert admin.locator("#traceAdminLogin").is_visible()
 admin.locator("#traceAdminToken").fill("mock-write-token")
 admin.locator("#traceAdminSubmit").click()
 admin.locator("#traceAdminLogin").wait_for(state="detached",timeout=18000)
 assert admin.evaluate("window.TRACE_AUTH.isAdmin()")
 assert admin.locator("[data-tab='museum']").is_visible()
 assert admin.locator("[data-td-active='mmfa-eye']").count()==1
 assert admin.locator("[data-td-active='mmfa-eye']").is_checked()==False
 assert admin.locator("[data-td-room='mmfa-eye'] option").count()>=15
 admin.locator("[data-td-active='mmfa-eye']").check()
 admin.locator("[data-td-room='mmfa-eye']").select_option("mmfa-garden")
 admin.locator("[data-td-verified='mmfa-eye']").check()
 # The administrator can manage either museum without leaving the protected editor.
 assert admin.locator(".td-venue-option").count()==2
 assert admin.locator('.td-venue-option[data-venue="mmfa"]').get_attribute("aria-pressed")=="true"
 admin.locator('.td-venue-option[data-venue="pamm"]').click()
 assert admin.evaluate("state.venue")=="pamm"
 assert admin.evaluate("state.tab")=="museum", "Museum switch must preserve admin workspace"
 assert admin.locator('[data-td-active="pamm-chaos"]').count()==1
 assert admin.locator('[data-td-active="mmfa-eye"]').count()==0, "Never mix museum artwork controls"
 assert admin.locator('.td-venue-option[data-venue="pamm"]').get_attribute("aria-pressed")=="true"
 assert admin.locator('#tn-link-from option[value="pamm-1"]').count()==1, "PAMM floor plan must load"
 admin.locator('[data-td-active="pamm-chaos"]').check()
 admin.locator('[data-td-room="pamm-chaos"]').select_option("pamm-3")
 admin.locator('[data-td-verified="pamm-chaos"]').check()
 assert admin.evaluate("window.TRACE_DISPLAY.rec('pamm-chaos').room")=="pamm-3"
 # The original header switcher must also preserve the editor.
 admin.locator("#venueSwitcher").click()
 assert admin.locator("#venuePicker").is_visible()
 admin.locator('#venuePicker [data-venue="mmfa"]').click()
 assert admin.evaluate("state.venue")=="mmfa"
 assert admin.evaluate("state.tab")=="museum"
 assert admin.locator('[data-td-active="mmfa-eye"]').is_checked()
 assert admin.locator('[data-td-active="pamm-chaos"]').count()==0
 admin.locator('.td-venue-option[data-venue="pamm"]').click()
 assert admin.locator('[data-td-active="pamm-chaos"]').is_checked(), "PAMM draft lost while switching"
 assert admin.locator('[data-td-room="pamm-chaos"]').input_value()=="pamm-3"
 admin.locator('.td-venue-option[data-venue="mmfa"]').click()
 assert admin.evaluate("state.tab")=="museum"
 print("ADMIN SWITCH PASS: both museums, distinct catalogues and rooms, draft preserved in both directions",flush=True)
 # Draft is visible to admin but not to either visitor before publishing.
 assert admin.evaluate("window.TRACE_DISPLAY.isActive('mmfa-eye')")
 assert admin.evaluate("window.TRACE_DISPLAY.rec('mmfa-eye').room")=="mmfa-garden"
 assert admin.locator("[data-td-publish]").is_enabled()
 v1.evaluate("window.TRACE_DISPLAY.load()")
 v2.evaluate("window.TRACE_DISPLAY.load()")
 assert v1.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 assert v2.evaluate("window.TRACE_DISPLAY.count('mmfa')")==3
 assert shared["writes"]==0
 # Create an approved walking link, saved in the same publication as the artwork.
 admin.locator("#tn-link-from").select_option("mmfa-entrance")
 admin.locator("#tn-link-to").select_option("mmfa-garden")
 admin.locator("[data-tn-connect]").click()
 assert admin.evaluate("window.TRACE_ROUTING.path('mmfa-entrance','mmfa-garden')")==["mmfa-entrance","mmfa-garden"]
 admin.locator("[data-td-publish]").click()
 admin.wait_for_function("window.TRACE_DISPLAY.draft===null && !window.TRACE_DISPLAY.publishing",timeout=20000)
 assert shared["writes"]==1
 assert shared["content"]["works"]["mmfa-eye"]["active"]==True
 assert shared["content"]["works"]["mmfa-eye"]["room"]=="mmfa-garden"
 assert shared["content"]["works"]["pamm-chaos"]["active"]==True
 assert shared["content"]["works"]["pamm-chaos"]["room"]=="pamm-3"
 assert shared["content"]["works"]["pamm-chaos"]["onViewVerified"]==True
 assert "Published" in admin.locator("#view").inner_text()
 for visitor in [v1,v2]:
  visitor.evaluate("window.TRACE_DISPLAY.load()")
  visitor.wait_for_function("window.TRACE_DISPLAY.count('mmfa')===4")
  assert visitor.evaluate("window.TRACE_DISPLAY.rec('mmfa-eye').room")=="mmfa-garden"
  visitor.locator("[data-tab='map']").click()
  visitor.locator("[data-tn-mode='all']").click()
  assert "Sculpture Garden" in visitor.locator("#view").inner_text()
  assert visitor.evaluate("window.TRACE_ROUTING.routeWorks().length")==4
 # The combined publish must update PAMM for both visitors without changing their MMFA settings.
 for visitor in [v1,v2]:
  visitor.locator("#venueSwitcher").click()
  visitor.locator('#venuePicker [data-venue="pamm"]').click()
  assert visitor.evaluate("state.venue")=="pamm"
  assert visitor.evaluate("state.tab")=="quest"
  assert visitor.evaluate("window.TRACE_DISPLAY.count('pamm')")==4
  assert visitor.evaluate("window.TRACE_DISPLAY.rec('pamm-chaos').room")=="pamm-3"
  visitor.locator("#venueSwitcher").click()
  visitor.locator('#venuePicker [data-venue="mmfa"]').click()
  assert visitor.evaluate("state.venue")=="mmfa"
 print("SHARED PUBLISH PASS: both museums' artwork states and rooms on two visitor sessions",flush=True)
 # Going off display removes the work without deleting the visitor's earlier completed artwork.
 v1.evaluate("""()=>{state.found.push('mmfa-eye');save()}""")
 admin.locator("[data-td-active='mmfa-eye']").uncheck()
 admin.locator("[data-td-publish]").click()
 admin.wait_for_function("window.TRACE_DISPLAY.draft===null && !window.TRACE_DISPLAY.publishing",timeout=20000)
 assert shared["writes"]==2
 for visitor in [v1,v2]:
  visitor.evaluate("window.TRACE_DISPLAY.load()")
  visitor.wait_for_function("window.TRACE_DISPLAY.count('mmfa')===3")
  visitor.locator("[data-tab='map']").click()
  assert visitor.evaluate("window.TRACE_ROUTING.routeWorks().every(a=>a.id!=='mmfa-eye')")
 v1.locator("[data-tab='album']").click()
 assert "David Altmejd" in v1.locator("#view").inner_text()
 assert "Not currently in the visitor route" in v1.locator("#view").inner_text()
 print("OFF-DISPLAY PASS: both visitor routes update while earned discoveries remain",flush=True)
 # Read-only token may sign in for viewing, but GitHub rejects any attempted write.
 cr,readonly=new_page("admin.html")
 readonly.locator("#traceAdminToken").fill("mock-read-token")
 readonly.locator("#traceAdminSubmit").click()
 readonly.locator("#traceAdminLogin").wait_for(state="detached",timeout=18000)
 readonly.locator("[data-td-active='mmfa-eye']").check()
 readonly.locator("[data-td-publish]").click()
 readonly.wait_for_function("!window.TRACE_DISPLAY.publishing",timeout=20000)
 assert "Publication FAILED" in readonly.locator("#view").inner_text()
 assert readonly.evaluate("window.TRACE_DISPLAY.draft!==null")
 assert shared["writes"]==2
 readonly.locator("[data-trace-logout]").click()
 assert readonly.locator("#traceAdminLogin").is_visible()
 assert not readonly.locator("[data-tab='museum']").is_visible()
 print("SECURITY PASS: invalid credential rejected, read-only publish rejected, logout locks editor",flush=True)
 assert not failures,failures
 for ctx in [c1,c2,ca,cr]:ctx.close()
 browser.close()
print("ALL SHARED PORTAL TESTS PASSED",flush=True)
