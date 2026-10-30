"""TRACE v1.0 live end-to-end tests, real artwork matching plus six tactile activities."""
from playwright.sync_api import sync_playwright
import os
URL=os.getenv('TRACE_TEST_URL','https://jamesbenja.github.io/trace-museum-demo/?v=10')
SETS={
 'mmfa':['mmfa-marrel','mmfa-witte','mmfa-fortin'],
 'pamm':['pamm-masks','pamm-delano','pamm-grid']
}
def solve_puzzle(page,art):
    page.locator('[data-action="v7-puzzle"]').click()
    assert page.locator('#t1-finish').is_disabled(), 'Puzzle should not be pre-solved '+art
    if art=='mmfa-marrel':
        b=page.locator('#t1-copper').bounding_box()
        assert b, 'Copper canvas unavailable'
        page.mouse.move(b['x']+15,b['y']+25)
        page.mouse.down()
        for i in range(19):
            page.mouse.move(b['x']+15+((i+1)%8)*(b['width']-30)/8,b['y']+30+(i%2)*(b['height']-60),steps=2)
        page.mouse.up()
    elif art=='mmfa-witte':
        page.locator('.t1-marker').focus()
        for key in ['ArrowLeft']*5+['ArrowUp']*7:
            page.keyboard.press(key)
    elif art=='mmfa-fortin':
        page.locator('#t1-light').evaluate("(el)=>{el.value='85';el.dispatchEvent(new Event('input',{bubbles:true}))}")
    elif art=='pamm-masks':
        for x in ['🎭','🐟','▦']:
            page.locator('[data-t1-symbol="'+x+'"]').click()
    elif art=='pamm-delano':
        for key in ['left','up','right','down']:
            page.locator('[data-t1-move="'+key+'"]').click()
        page.locator('[data-t1-photo-choice="0"]').click()
    elif art=='pamm-grid':
        for x in ['⌂','☼','◎']:
            page.locator('[data-t1-place="'+x+'"]').click()
    assert page.locator('#t1-finish').is_enabled(), 'Puzzle not completed '+art
    page.locator('#t1-finish').click()
    assert 'POWER UNLOCKED' in page.locator('#view').inner_text()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    for museum,arts in SETS.items():
        page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
        errs=[]
        page.on('pageerror',lambda e: errs.append(str(e)))
        page.set_default_timeout(12000)
        r=page.goto(URL,wait_until='domcontentloaded',timeout=45000)
        assert r.status==200 and 'v1.6' in page.title(),page.title()
        page.wait_for_timeout(1800)
        print('BROWSER DIAG',page.evaluate("({title:document.title,status:document.querySelector('#status')?.textContent,script:typeof window.TRACE_V1,scripts:Array.from(document.scripts).map(x=>x.src)})"),'JS ERRORS',errs,flush=True)
        page.wait_for_function("window.TRACE_V1 && document.querySelector('#status')?.textContent.includes('SCAN READY')",timeout=12000)
        if museum=='pamm':
            page.locator('#view [data-venue="pamm"]').first.click()
        # Top museum switcher is always accessible and allows round-trip changes.
        assert page.locator('#venueSwitcher').is_visible()
        page.locator('#venueSwitcher').click()
        assert page.locator('#venuePicker').is_visible()
        assert page.locator('#mmfaSavedCount').is_visible()
        assert page.locator('#pammSavedCount').is_visible()
        alternate='pamm' if museum=='mmfa' else 'mmfa'
        page.locator('#venuePicker [data-venue="'+alternate+'"]').click()
        assert page.evaluate("state.venue")==alternate
        assert page.locator('#venuePicker').is_hidden()
        page.locator('#venueSwitcher').click()
        page.locator('#venuePicker [data-venue="'+museum+'"]').click()
        assert page.evaluate("state.venue")==museum
        assert 'Mica' in page.locator('#view').inner_text()
        page.locator('[data-t1-mode="family"]').first.click()
        page.locator('[data-t1-start]').click()
        assert 'A MAGICAL QUEST MAP' in page.locator('#view').inner_text()
        assert page.locator('[data-t1-open="2"]').is_disabled(), 'Final path must unlock by finding art'
        # Deliberately take chapter 2 first, then chapter 1, then chapter 3.
        for n,index in enumerate([1,0,2]):
            art=arts[index]
            page.locator('[data-t1-open="'+str(index)+'"]').click()
            assert 'FIND THIS DETAIL' in page.locator('#view').inner_text()
            assert 'MICA’S FAMILY DISCOVERY' in page.locator('#view').inner_text()
            page.locator('[data-c2-start]').click()
            assert 'STEP 1' in page.locator('#view').inner_text()
            if art=='mmfa-marrel':
                b=page.locator('#c2-polish').bounding_box()
                assert b
                page.mouse.move(b['x']+18,b['y']+25)
                page.mouse.down()
                for k in range(16):
                    page.mouse.move(b['x']+18+(k%7)*(b['width']-36)/7,
                                    b['y']+25+(k%2)*(b['height']-50),steps=3)
                page.mouse.up()
            elif art=='mmfa-witte':
                for k in ['left']*4+['up']*3:
                    page.locator('[data-c2-arrow="'+k+'"]').click()
            elif art=='mmfa-fortin':
                page.locator('#c2-light').evaluate("(el)=>{el.value='80';el.dispatchEvent(new Event('input',{bubbles:true}))}")
            elif art=='pamm-masks':
                for symbol in ['🎭','🐟','▦']:
                    page.locator('[data-c2-code="'+symbol+'"]').click()
            elif art=='pamm-delano':
                for k in range(3):
                    page.locator('[data-c2-stop="'+str(k)+'"]').click()
            elif art=='pamm-grid':
                for symbol in ['⌂','☼','◎']:
                    page.locator('[data-c2-glyph="'+symbol+'"]').click()
            assert page.locator('[data-c2-next]').count()==1, 'Family game did not finish '+art
            page.locator('[data-c2-next]').click()
            assert 'STEP 2' in page.locator('#view').inner_text()
            page.locator('[data-c2-choice="0"]').click()
            assert 'Team Discovery earned!' in page.locator('#view').inner_text()
            assert page.evaluate("(id)=>window.TRACE_COOP.savedChoice(id)",art)==0
            # Replay remains optional and must not remove the already earned seal.
            page.locator('[data-c2-again]').click()
            assert page.locator('[data-c2-start]').count()==1
            page.locator('[data-c2-start]').click()
            page.locator('[data-c2-help]').click()
            assert page.locator('[data-c2-next]').count()==1
            page.locator('[data-c2-next]').click()
            page.locator('[data-c2-choice="1"]').click()
            assert page.evaluate("(id)=>window.TRACE_COOP.savedChoice(id)",art)==0
            page.locator('details summary').click()
            page.locator('[data-action="sample:'+art+'"]').click()
            page.locator('.scanResult').wait_for(timeout=120000)
            stamp=page.locator('.resultStamp').inner_text()
            print('ART SCAN',museum,art,stamp,flush=True)
            assert stamp=='ARTWORK VERIFIED',stamp
            page.locator('[data-action="accept"]').click()
            assert 'AUTOMATIC IMAGE MATCH' in page.locator('#view').inner_text()
            page.locator('[data-action="v7-story"]').click()
            assert 'THE STORY YOU UNLOCKED' in page.locator('#view').inner_text()
            solve_puzzle(page,art)
            page.locator('[data-t1-hub]').click()
            assert 'A MAGICAL QUEST MAP' in page.locator('#view').inner_text()
            assert page.evaluate('state.found.length')==n+1
            if n==0: assert page.locator('[data-t1-open="2"]').is_enabled()
            if n==0:
                # Leaving the museum and returning preserves previous discoveries,
                # current adventure stage and map progress.
                current_stage=page.evaluate("state.stage")
                previous_ids=page.evaluate("state.found.slice()")
                page.locator('#venueSwitcher').click()
                page.locator('#venuePicker [data-venue="'+alternate+'"]').click()
                assert page.evaluate("state.venue")==alternate
                assert page.evaluate("state.found.length")==0
                page.locator('#venueSwitcher').click()
                assert ('1 of 8 discoveries' in page.locator('#'+museum+'SavedCount').inner_text())
                page.locator('#venuePicker [data-venue="'+museum+'"]').click()
                assert page.evaluate("state.found.slice()")==previous_ids
                assert page.evaluate("state.stage")==current_stage
                assert page.locator('[data-t1-open="2"]').is_enabled()

        # Eight curated entries exist, but only three previously verified demo targets
        # are activated by the published administrator configuration.
        assert page.evaluate('A.length')==8
        assert page.locator('[data-t1-open]').count()==3
        assert 'A MAGICAL QUEST MAP' in page.locator('#view').inner_text()
        page.locator('[data-action="album"]').first.click()
        assert page.evaluate('state.found.length')==3
        page.locator('[data-review-work="'+arts[1]+'"]').first.click()
        assert 'A discovery worth revisiting' in page.locator('#view').inner_text()
        page.locator('[data-action="review-resume"]').click()
        assert page.evaluate('state.found.length')==3
        assert 'A MAGICAL QUEST MAP' in page.locator('#view').inner_text()
        page.locator('[data-action="album"]').first.click()
        with page.expect_download() as dl:
            page.locator('[data-action="v7-save"]').click()
        assert dl.value.suggested_filename.endswith('.png')
        assert not errs, errs
        print('PASSED',museum,'all artworks, six different family mini-games, replay/seals, and original art activities',flush=True)
        page.close()
    browser.close()
print('ALL V1.0 TESTS PASSED',flush=True)
