"""End-to-end smoke and game-loop checks against published TRACE GitHub Pages."""
from playwright.sync_api import sync_playwright
URL='https://jamesbenja.github.io/trace-museum-demo/?v=7'
WORKS={'mmfa':['mmfa-marrel','mmfa-witte','mmfa-fortin'],
       'pamm':['pamm-masks','pamm-delano','pamm-grid']}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    for museum,ids in WORKS.items():
        page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda err: errors.append(str(err)))
        response=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
        assert response and response.status==200, 'GitHub Pages HTTP error'
        assert 'v0.7' in page.title(), 'Wrong live version: '+page.title()
        if museum=='pamm':page.locator('[data-venue="pamm"]').first.click()
        page.wait_for_function("document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=65000)
        print('REFERENCES',museum,page.locator('#status').inner_text(),flush=True)
        # Language-selection preview before starting.
        page.locator('[data-lang="fr"]').click()
        assert 'Commencer' in page.locator('[data-action="start"]').inner_text()
        page.locator('[data-lang="es"]').click()
        assert 'Comenzar' in page.locator('[data-action="start"]').inner_text()
        page.locator('[data-lang="en"]').click()
        page.locator('[data-action="museum"]').first.click()
        assert 'CURATOR WORKSPACE' in page.locator('#view').inner_text()
        first=ids[0]
        page.locator('[data-museum-toggle="'+first+'"]').click()
        assert page.locator('[data-museum-toggle="'+first+'"]').inner_text()=='Excluded'
        page.locator('[data-museum-toggle="'+first+'"]').click()
        page.locator('[data-action="quest"]').first.click()
        page.locator('[data-action="start"]').first.click()
        for i,art in enumerate(ids):
            assert 'THE HIDDEN CLUE' in page.locator('#view').inner_text()
            # Real-photo reference in studio mode is visibly marked as testing.
            page.locator('details summary').first.click()
            page.locator('[data-action="sample:'+art+'"]').first.click()
            page.locator('.scanResult').wait_for(timeout=120000)
            stamp=page.locator('.resultStamp').inner_text()
            print('SCAN',museum,art,stamp,flush=True)
            assert 'ARTWORK VERIFIED' in stamp,stamp
            # First target: test picture-of-a-picture with margin, blur and JPEG.
            if i==0:
                sim=page.evaluate("""async (art) => {
                  const ref=ALL.find(x=>x.id===art).reference;
                  const c=document.createElement('canvas'),w=960,h=720;
                  c.width=w;c.height=h;const g=c.getContext('2d');
                  g.fillStyle='#b7b8ad';g.fillRect(0,0,w,h);
                  g.fillStyle='#383b3b';g.fillRect(70,8,w-140,h-16);
                  g.fillStyle='#e4e0d7';g.fillRect(100,18,w-200,h-36);
                  const rh=615,rw=rh*ref.naturalWidth/ref.naturalHeight;
                  g.save();g.translate(w/2,h/2);g.rotate(0.025);
                  g.filter='brightness(0.86) contrast(0.91) saturate(0.88) blur(0.6px)';
                  g.drawImage(ref,-rw/2,-rh/2,rw,rh);g.restore();
                  const im=new Image();im.src=c.toDataURL('image/jpeg',0.68);await im.decode();
                  const r=await recognize(im);
                  return {recognized:r.recognized,id:r.id,method:r.method};
                }""",art)
                print('CAMERA-LIKE',museum,sim,flush=True)
                assert sim['recognized'] and sim['id']==art,sim
            page.locator('[data-action="accept"]').click()
            assert 'AUTOMATIC IMAGE MATCH' in page.locator('#view').inner_text()
            page.locator('[data-action="v7-story"]').click()
            assert 'THE STORY YOU UNLOCKED' in page.locator('#view').inner_text()
            page.locator('[data-action="v7-puzzle"]').click()
            assert page.locator('[data-v7puzzle]').count()==3
            correct=page.evaluate("(id)=>V7_ART[id].right",art)
            wrong=(correct+1)%3
            page.locator('[data-v7puzzle="'+str(wrong)+'"]').click()
            assert 'Not quite' in page.locator('#view').inner_text()
            page.locator('[data-v7puzzle="'+str(correct)+'"]').click()
            assert 'POWER RECOVERED' in page.locator('#view').inner_text()
            page.locator('[data-action="next"]').click()
        assert 'The mystery is solved!' in page.locator('#view').inner_text()
        page.locator('[data-action="album"]').first.click()
        assert '3 / 3 discoveries' in page.locator('#view').inner_text()
        with page.expect_download() as download:
            page.locator('[data-action="v7-save"]').click()
        assert download.value.suggested_filename.endswith('.png')
        print('PASSPORT',museum,download.value.suggested_filename,flush=True)
        if errors:print('PAGE ERRORS',errors,flush=True)
        assert not errors,errors
        page.screenshot(path='trace-'+museum+'-passport.png',full_page=True)
        page.close()
    browser.close()
print('PASSED: both museums, full 3-chapter quests, puzzles, passports, localization previews, sample scanner and curator mockup.',flush=True)
