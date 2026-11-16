"""Browser checks for the empty-data NaTIS-inspired UI preview.

Requires: pip install playwright; playwright install chromium
Run: python3 test_ui.py
"""
from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
import shutil, json, re

root=Path(__file__).resolve().parent
results=[]

def check(name,fn):
    try:
        fn();results.append({'test':name,'status':'PASS'});print('PASS',name)
    except Exception as exc:
        results.append({'test':name,'status':'FAIL','error':str(exc)});print('FAIL',name,str(exc))

def mount(page):
    html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css" />','').replace('<link rel="stylesheet" href="portal.css" />','').replace('<script src="app.js"></script>','')
    for image_name in ['natis-wordmark.png','rtmc-logo.png']:
        asset=root/'assets'/'brand'/image_name
        data='data:image/png;base64,'+base64.b64encode(asset.read_bytes()).decode('ascii')
        html=html.replace('src="assets/brand/'+image_name+'"','src="'+data+'"')
    svg_asset=root/'assets'/'brand'/'natis-navbar-reference.svg'
    html=html.replace('src="assets/brand/natis-navbar-reference.svg"','src="data:image/svg+xml;base64,'+base64.b64encode(svg_asset.read_bytes()).decode('ascii')+'"')
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=(root/'styles.css').read_text().split('\n',1)[1]);page.add_style_tag(content=(root/'portal.css').read_text().split('\n',1)[1].replace("@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap');",''))
    page.add_script_tag(content=(root/'app.js').read_text())

def click_nav(page, slug):
    if 'nav-open' not in (page.locator('#appShell').get_attribute('class') or ''):
        page.locator('#menuToggle').click()
    page.locator(f'#sideNav [data-nav="{slug}"]').click()

with sync_playwright() as p:
        chrome=shutil.which('chromium') or shutil.which('google-chrome')
        browser=p.chromium.launch(headless=True,executable_path=chrome,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1440,'height':900},accept_downloads=True)
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.add_script_tag(content="Object.defineProperty(window,'localStorage',{configurable:true,value:(()=>{const data={};return{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=v,removeItem:k=>delete data[k]};})()});")
        mount(page)
        page.locator('#pageContent h1').wait_for()
        check('Dashboard renders as UI preview',lambda: (
            page.get_by_role('heading',name='Administration overview').wait_for(),
            page.get_by_text('UI PREVIEW · NO DATA SOURCE').wait_for()
        ))
        def kpis():
            assert page.locator('.kpi').count()==4
            assert page.locator('.kpi-value').all_inner_texts()==['—']*4
            assert page.get_by_text('No activity recorded').count()==1
            assert page.get_by_text('Activity data unavailable').count()==1
        check('Dashboard shows no fabricated metrics, charts or activity',kpis)
        def portal_structure():
            reference=browser.new_page(viewport={'width':838,'height':650})
            mount(reference)
            header=reference.locator('.portal-header').bounding_box()
            navbar=reference.locator('.portal-navbox').bounding_box()
            intro=reference.locator('.portal-intro').bounding_box()
            assert header['height']==304,header
            assert navbar['y']==72 and navbar['height']==80,navbar
            assert intro['y']==304,intro
            assert reference.locator('.portal-rtmc').count()==1
            assert reference.locator('.portal-natis').count()==1
            assert reference.locator('.portal-utility .portal-contact').count()==1
            assert reference.locator('#portalHeroTitle').inner_text()=='WELCOME TO THE NaTIS ONLINE SERVICES'
            assert reference.evaluate('document.documentElement.scrollWidth == innerWidth')
            reference.screenshot(path=str(root/'portal-exact-reference-838.png'))
            reference.close()
        check('Reference portal hierarchy matches supplied 838px screenshot',portal_structure)
        def menu_focus():
            page.locator('#menuToggle').click()
            assert page.locator('#menuToggle').get_attribute('aria-expanded')=='true'
            assert page.locator('#sideNav .nav-link').count()==15
            page.keyboard.press('Escape')
            assert 'nav-open' not in page.locator('#appShell').get_attribute('class')
            assert page.locator('#menuToggle').get_attribute('aria-expanded')=='false'
        check('Hamburger menu, all 15 destinations, and Escape close work',menu_focus)
        def login_unconnected():
            page.locator('#loginPreviewButton').click()
            assert 'Login is not connected in this prototype.' in page.locator('#toastStack').inner_text()
        check('Login element does not harvest credentials or simulate auth',login_unconnected)

        check('Connection status explicitly unavailable',lambda: (
            page.evaluate('window.__NATIS_UI__.getDataStatus()')=='not-connected' or (_ for _ in ()).throw(AssertionError('data state'))
        ))
        check('All nine operational arrays start empty',lambda: (
            all(v==0 for v in page.evaluate('window.__NATIS_UI__.getCounts()').values()) or (_ for _ in ()).throw(AssertionError('nonempty data'))
        ))
        page.screenshot(path=str(root/'empty-data-desktop.png'),full_page=True)
        destinations=[('overview','Administration overview'),('applications','Applications'),('appointments','Appointments'),('renewals','Vehicle renewals'),('centres','DLTC & available slots'),('citizens','Citizen profiles'),('payments','Payments'),('accidents','Accident reports'),('reports','Reports & analytics'),('resources','Forms & manuals'),('campaigns','Campaigns & notices'),('brandkit','Brand assets'),('team','Team & permissions'),('audit','Activity log'),('settings','Settings')]
        def navigation():
            for slug,heading in destinations:
                click_nav(page,slug)
                assert page.evaluate('window.__NATIS_UI__.getRoute()')==slug,slug
                assert page.locator('#pageContent h1').inner_text()==heading,slug
                assert page.url.endswith('#/'+slug)
        check('All 15 navigation routes resolve and deep link',navigation)
        record_routes=['applications','appointments','renewals','citizens','payments','accidents','audit']
        def empty_tables():
            for slug in record_routes:
                click_nav(page,slug)
                assert page.get_by_text('No records available').count()==1,slug
                assert page.get_by_text('Connect an authorised data source to display records.').count()==1,slug
                assert page.locator('tbody [data-open]').count()==0,slug
        check('All operational registers contain no fabricated rows',empty_tables)
        def empty_centres():
            click_nav(page,'centres')
            assert page.locator('.centre-card').count()==0
            assert page.get_by_text('No centre data imported').count()==1
            assert page.locator('.small-stat strong').all_inner_texts()==['—']*3
        check('DLTC capacity and availability show no invented numbers',empty_centres)
        def empty_reports():
            click_nav(page,'reports')
            assert page.locator('.kpi-value').all_inner_texts()==['—']*4
            assert page.get_by_text('No volume data').count()==1
            assert page.get_by_text('No exports available').count()==1
            assert page.locator('[data-export]').count()==0
        check('Reports have no synthetic trends or downloadable datasets',empty_reports)
        def filtered():
            click_nav(page,'applications')
            page.locator('#localQuery').fill('arbitrary search')
            assert page.get_by_text('No matching records').count()==1
            page.locator('#localQuery').fill('')
            page.locator('#statusFilter').select_option('Pending')
            assert page.get_by_text('No matching records').count()==1
        check('Search and filter controls remain usable with empty data',filtered)
        def export_off():
            assert page.locator('button:has-text("Export CSV")').first.is_disabled()
            assert page.locator('[data-action^="new:"]').count()==0
        check('CSV export and unconnected record creation disabled',export_off)
        def old_storage():
            page.evaluate("localStorage.setItem('road-services-admin-demo-v2', JSON.stringify({applications:[{id:'STALE_LOCAL_RECORD'}]}))")
            mount(page)
            assert page.evaluate("localStorage.getItem('road-services-admin-demo-v2')") is None
            assert page.evaluate('window.__NATIS_UI__.getCounts().applications')==0
            assert 'STALE_LOCAL_RECORD' not in page.locator('body').inner_text()
        check('Previous version browser dataset is purged and not rendered',old_storage)
        def resources():
            click_nav(page,'resources')
            assert page.locator('.resource-card').count()==8
            page.locator('#localQuery').fill('PrDP')
            assert page.locator('.resource-card').count()==1
            page.locator('#localQuery').fill('')
            from urllib.parse import unquote
            for anchor in page.locator('.resource-open').all():
                assert (root/unquote(anchor.get_attribute('href'))).is_file()
        check('Eight uploaded forms and manuals still resolve',resources)
        def campaigns():
            click_nav(page,'campaigns')
            assert page.locator('.campaign-card').count()==5
            assert page.locator('[data-feature]').count()==0
            assert page.locator('.campaign-card img').count()==5
            assert 'CURRENT DEMO FEATURE' not in page.locator('body').inner_text()
        check('Uploaded campaign gallery preserved without simulated publication',campaigns)
        def branding():
            click_nav(page,'brandkit')
            assert page.locator('.brand-icon-card').count()==8
            for path in ['assets/brand/natis-wordmark.png','assets/brand/rtmc-logo.png','assets/icons/learner.svg','assets/campaigns/cashless-centres.jpg']:
                assert (root/path).is_file(),path
        check('NaTIS/RTMC brand assets and service icons intact',branding)
        def team():
            click_nav(page,'team')
            assert page.get_by_text('No staff accounts loaded').count()==1
            assert page.locator('.permission-table').count()==1
            assert page.locator('[data-action^="new:"]').count()==0
        check('No fake staff; proposed permission matrix retained',team)
        def settings():
            click_nav(page,'settings')
            assert page.get_by_text('No live records').count()==1
            assert page.get_by_text('Google Apps Script').count()==1
            page.locator('input[data-setting="compact"]').check()
            assert page.locator('body').evaluate('(el)=>el.classList.contains("compact")')
            mount(page)
            assert page.locator('input[data-setting="compact"]').is_checked()
        check('Only safe interface preferences persist across reload',settings)
        def global_search():
            page.keyboard.press('Control+k')
            assert page.locator('#globalSearch').evaluate('(el)=>document.activeElement===el')
        check('Global search keyboard shortcut retained',global_search)
        check('No browser JavaScript errors',lambda: (_ for _ in ()).throw(AssertionError(errors)) if errors else None)
        mobile=browser.new_page(viewport={'width':390,'height':844})
        mobile.add_script_tag(content="Object.defineProperty(window,'localStorage',{configurable:true,value:(()=>{const data={};return{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=v,removeItem:k=>delete data[k]};})()});")
        mount(mobile)
        def mobile_nav():
            mobile.locator('#menuToggle').click()
            assert 'nav-open' in mobile.locator('#appShell').get_attribute('class')
            mobile.locator('[data-nav="applications"]').first.click()
            assert 'nav-open' not in mobile.locator('#appShell').get_attribute('class')
            assert mobile.locator('#pageContent h1').inner_text()=='Applications'
            assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
        check('Mobile menu opens, navigates and closes without overflow',mobile_nav)
        def mobile_resources():
            mobile.locator('#menuToggle').click()
            mobile.locator('[data-nav="resources"]').first.click()
            assert mobile.locator('#pageContent h1').inner_text()=='Forms & manuals'
            assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
        check('Mobile document library renders without overflow',mobile_resources)
        mobile.locator('#menuToggle').click()
        mobile.locator('[data-nav="overview"]').first.click()
        mobile.screenshot(path=str(root/'empty-data-mobile.png'),full_page=True)
        browser.close()
(root/'test-results.json').write_text(json.dumps(results,indent=2))
failures=[r for r in results if r['status']=='FAIL']
print(f'\n{len(results)-len(failures)}/{len(results)} browser checks passed')
if failures: raise SystemExit(1)