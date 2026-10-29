"""Check deployed TRACE reference loading and real matcher in a headless browser."""
from playwright.sync_api import sync_playwright
URL='https://jamesbenja.github.io/trace-museum-demo/'
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    for museum,art in [('mmfa','mmfa-marrel'),('pamm','pamm-masks')]:
        page=browser.new_page(viewport={'width':1330,'height':920})
        errors=[]
        page.on('pageerror',lambda err: errors.append(str(err)))
        resp=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
        assert resp and resp.status==200, 'Site did not return HTTP 200'
        if museum=='pamm':page.locator('[data-venue="pamm"]').first.click()
        page.wait_for_function("document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=65000)
        status=page.locator('#status').inner_text()
        print('REFERENCE STATUS',museum,status,flush=True)
        assert 'SCAN READY' in status and int(status.split('·')[1].split('/')[0].strip()) >= 5, status
        page.locator('[data-sample="'+art+'"]').first.click()
        page.wait_for_selector('.scanResult',timeout=120000)
        result=page.locator('.resultStamp').inner_text()
        print('MATCH RESULT',museum,art,result,flush=True)
        assert 'ARTWORK VERIFIED' in result, result
        assert not errors, errors
        page.close()
    browser.close()
print('PASSED: real same-origin artwork scans work for MMFA and PAMM.',flush=True)
