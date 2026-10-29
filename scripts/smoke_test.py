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
        # Not an identity test: photograph-sized raster containing the work with
        # screen/wall margins, gentle rotation, colour shift, blur and JPEG compression.
        simulated = page.evaluate("""async (art) => {
          const ref=ALL.find(x=>x.id===art).reference;
          const w=960,h=720,c=document.createElement('canvas');
          c.width=w;c.height=h;const g=c.getContext('2d');
          g.fillStyle='#b7b8ad';g.fillRect(0,0,w,h);
          g.fillStyle='#383b3b';g.fillRect(70,8,w-140,h-16);
          g.fillStyle='#e4e0d7';g.fillRect(100,18,w-200,h-36);
          const rh=615,rw=rh*ref.naturalWidth/ref.naturalHeight;
          g.save();g.translate(w/2,h/2);g.rotate(0.025);
          g.filter='brightness(0.86) contrast(0.91) saturate(0.88) blur(0.6px)';
          g.drawImage(ref,-rw/2,-rh/2,rw,rh);
          g.restore();
          const jpeg=new Image();jpeg.src=c.toDataURL('image/jpeg',0.68);
          await jpeg.decode();
          const r=await recognize(jpeg);
          return {recognized:r.recognized,id:r.id,method:r.method, topColor:r.color.slice(0,3).map(z=>({id:z.id,score:Math.round(z.colorScore*1000)/1000})),topFeatures:r.results.slice(0,3).map(z=>({id:z.id,inliers:z.inliers}))};
        }""",art)
        print('CAMERA-LIKE PHOTO RESULT',museum,simulated,flush=True)
        assert simulated['recognized'] and simulated['id']==art, simulated
        assert not errors, errors
        page.close()
    browser.close()
print('PASSED: MMFA and PAMM exact-reference AND simulated phone-photo recognition.',flush=True)
