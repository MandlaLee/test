from pathlib import Path
import json, shutil, re
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent
results=[]
def check(name,fn):
    try: fn();results.append({'test':name,'status':'PASS'});print('PASS',name)
    except Exception as e: results.append({'test':name,'status':'FAIL','error':str(e)});print('FAIL',name,e)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    def mount(pg):
        html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />','').replace('<script src="./app.js"></script>','')
        html=re.sub(r'<img src="https://www\.rtmc\.co\.za[^>]+>', '', html)
        pg.set_content(html,wait_until='domcontentloaded')
        pg.add_style_tag(content=(root/'styles.css').read_text().split('\n',1)[1])
        pg.add_script_tag(content=(root/'app.js').read_text())
    page.add_script_tag(content="Object.defineProperty(window,'localStorage',{value:(()=>{const d={};return{getItem:k=>d[k]||null,setItem:(k,v)=>d[k]=v};})()});")
    mount(page)
    check('Overview renders with demo warning',lambda: (page.get_by_role('heading',name='Good afternoon, Admin').wait_for(),page.get_by_text('PROTOTYPE ENVIRONMENT').first.wait_for()))
    page.screenshot(path=str(root/'overview.png'),full_page=True)
    def nav():
        for slug,title in [('applications','Applications'),('appointments','Appointments'),('renewals','Vehicle renewals'),('centres','DLTC & available slots'),('citizens','Citizen profiles'),('payments','Payments'),('accidents','Accident reports'),('reports','Reports & analytics'),('team','Team & permissions'),('audit','Activity log'),('settings','Settings')]:
            page.locator(f'[data-nav="{slug}"]').first.click()
            assert page.evaluate('window.__NATIS_DEMO__.getRoute()')==slug
            assert page.locator('h1').first.inner_text()==title
    check('All 12 navigation destinations render',nav)
    page.locator('[data-nav="applications"]').first.click()
    def filtering():
        page.locator('#localQuery').fill('APP-260402')
        assert page.locator('tbody tr').count()==1
        page.locator('#localQuery').fill('')
        page.locator('#statusFilter').select_option('Pending')
        assert page.locator('tbody tr').count()>=1
        page.locator('#statusFilter').select_option('all')
    check('Application search and status filtering',filtering)
    def update():
        page.locator('[data-open="applications:APP-260402"]').click()
        page.locator('#newStatus').select_option('Completed')
        page.locator('[data-save-detail]').click()
        assert page.locator('#modalLayer').inner_text()==''
        mount(page)
        row=page.locator('tr').filter(has_text='APP-260402')
        assert 'Completed' in row.inner_text()
    check('Update modal and local persistence after reload',update)
    page.locator('[data-nav="appointments"]').first.click()
    def booking():
        page.locator('[data-action="new:appointments"]').click()
        page.locator('#f_name').fill('Demo Applicant 999')
        page.locator('#f_date').fill('2026-11-26')
        page.locator('#createForm button[type="submit"]').click()
        assert 'Demo Applicant 999' in page.locator('tbody').inner_text()
        assert page.evaluate('window.__NATIS_DEMO__.getCounts().appointments')==7
    check('Create a demo appointment',booking)
    page.locator('[data-nav="centres"]').first.click()
    def centres():
        page.locator('[data-open="centres:CTR-001"]').click()
        page.locator('#f_booked').fill('50')
        page.locator('[data-save-detail]').click()
        assert '10 slots available' in page.locator('.centre-card').first.inner_text()
    check('Edit centre capacity',centres)
    def export():
        page.locator('[data-nav="payments"]').first.click()
        with page.expect_download() as info:
            page.locator('[data-export="payments"]').click()
        dl=info.value
        assert dl.suggested_filename.endswith('payments.csv')
    check('CSV export initiates download',export)
    def audit():
        page.locator('[data-nav="audit"]').first.click()
        assert 'Created demo record' in page.locator('tbody').inner_text()
    check('Audit trail records changes',audit)
    def new_sections():
        for slug,title in [('resources','Forms & manuals'),('campaigns','Campaigns & notices'),('brandkit','Brand assets')]:
            page.locator(f'[data-nav="{slug}"]').first.click()
            assert page.locator('h1').first.inner_text()==title
            assert page.evaluate('window.__NATIS_DEMO__.getRoute()')==slug
    check('New forms, campaigns and branding routes',new_sections)
    def resource_links():
        page.locator('[data-nav="resources"]').first.click()
        assert page.locator('.resource-card').count()==8
        page.locator('#localQuery').fill('PrDP')
        assert page.locator('.resource-card').count()==1
        page.locator('#localQuery').fill('')
        for a in page.locator('.resource-open').all():
            href=a.get_attribute('href')
            from urllib.parse import unquote
            assert (root/unquote(href)).is_file(),href
    check('Supplied document links resolve inside package',resource_links)
    def campaign_select():
        page.locator('[data-nav="campaigns"]').first.click()
        assert page.locator('.campaign-card').count()==5
        page.locator('[data-feature="senior"]').click()
        assert page.evaluate('window.__NATIS_DEMO__.getFeatured()')=='senior'
        assert 'Senior citizen assistance' in page.locator('.feature-preview').inner_text()
    check('Change featured demo banner and persist selection',campaign_select)
    def brand_assets():
        page.locator('[data-nav="brandkit"]').first.click()
        assert page.locator('.brand-icon-card').count()==8
        for path in ['assets/brand/rtmc-logo.png','assets/brand/natis-wordmark.png','assets/icons/learner.svg','assets/campaigns/cashless-centres.jpg']:
            assert (root/path).is_file()
    check('Brand files and eight service icons exist',brand_assets)
    check('No browser JavaScript errors',lambda:(_ for _ in ()).throw(AssertionError(errors)) if errors else None)
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile.add_script_tag(content="Object.defineProperty(window,'localStorage',{value:(()=>{const d={};return{getItem:k=>d[k]||null,setItem:(k,v)=>d[k]=v};})()});")
    mount(mobile)
    def responsive():
        mobile.locator('#menuToggle').click()
        assert 'nav-open' in mobile.locator('#appShell').get_attribute('class')
        mobile.locator('[data-nav="reports"]').first.click()
        assert 'nav-open' not in mobile.locator('#appShell').get_attribute('class')
        assert mobile.locator('h1').inner_text()=='Reports & analytics'
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
    check('Mobile menu navigation without horizontal overflow',responsive)
    def mobile_resources():
        mobile.locator('#menuToggle').click()
        mobile.locator('[data-nav="resources"]').first.click()
        assert mobile.locator('h1').first.inner_text()=='Forms & manuals'
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
    check('Mobile reference library navigation',mobile_resources)
    mobile.screenshot(path=str(root/'mobile.png'),full_page=True)
    browser.close()
(root/'test-results.json').write_text(json.dumps(results,indent=2))
failed=[x for x in results if x['status']=='FAIL']
print(f'\n{len(results)-len(failed)}/{len(results)} tests passed')
if failed: raise SystemExit(1)