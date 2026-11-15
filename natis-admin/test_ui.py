"""Browser smoke checks for the empty-data NaTIS-inspired administration UI."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64, shutil, json

root=Path(__file__).resolve().parent
results=[]
def check(name,fn):
    try:
        fn();results.append({'test':name,'status':'PASS'});print('PASS',name)
    except Exception as exc:
        results.append({'test':name,'status':'FAIL','error':str(exc)});print('FAIL',name,exc)

def mount(page):
    html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />','').replace('<script src="./app.js"></script>','')
    for name in ['natis-wordmark.png','rtmc-logo.png']:
        file=root/'assets'/'brand'/name
        value='data:image/png;base64,'+base64.b64encode(file.read_bytes()).decode('ascii')
        html=html.replace('src="assets/brand/'+name+'"','src="'+value+'"')
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=(root/'styles.css').read_text().split('\n',1)[1])
    page.add_script_tag(content=(root/'app.js').read_text())

storage_script="""Object.defineProperty(window,'localStorage',{configurable:true,value:(()=>{const d={};return{getItem:k=>d[k]??null,setItem:(k,v)=>d[k]=v,removeItem:k=>delete d[k]};})()});"""
routes=[
 ('overview','Administration overview'),('applications','Applications'),
 ('appointments','Appointments'),('renewals','Vehicle renewals'),
 ('centres','DLTC & available slots'),('citizens','Citizen profiles'),
 ('payments','Payments'),('accidents','Accident reports'),
 ('reports','Reports & analytics'),('resources','Forms & manuals'),
 ('campaigns','Campaigns & notices'),('brandkit','Brand assets'),
 ('team','Team & permissions'),('audit','Activity log'),('settings','Settings')
]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda exc:errors.append(str(exc)))
    page.add_script_tag(content=storage_script)
    mount(page)
    def overview():
        assert page.locator('h1').inner_text()=='Administration overview'
        assert page.locator('.kpi-value').all_inner_texts()==['—']*4
        assert page.get_by_text('Activity data unavailable').count()==1
        assert page.get_by_text('UI PREVIEW · NO DATA SOURCE').count()==1
    check('Unconnected overview contains no invented metrics',overview)
    def nav():
        for slug,title in routes:
            page.locator('[data-nav="'+slug+'"]').first.click()
            assert page.locator('h1').inner_text()==title,slug
            assert page.evaluate('window.__NATIS_UI__.getRoute()')==slug
    check('All 15 routes navigate',nav)
    def registers():
        for slug in ['applications','appointments','renewals','citizens','payments','accidents','audit']:
            page.locator('[data-nav="'+slug+'"]').first.click()
            assert page.get_by_text('No records available').count()==1,slug
            assert page.locator('tbody [data-open]').count()==0
    check('All registers are empty',registers)
    def search():
        page.locator('[data-nav="applications"]').first.click()
        page.locator('#localQuery').fill('anything')
        assert page.get_by_text('No matching records').count()==1
        page.locator('#localQuery').fill('')
        page.locator('#statusFilter').select_option('Pending')
        assert page.get_by_text('No matching records').count()==1
    check('Search and filters still work',search)
    check('Exports unavailable until backend',lambda: (
        page.locator('button:has-text("Export CSV")').first.is_disabled() or (_ for _ in ()).throw(AssertionError('export enabled'))
    ))
    def old_data():
        page.evaluate("localStorage.setItem('road-services-admin-demo-v2','{}')")
        mount(page)
        assert page.evaluate("localStorage.getItem('road-services-admin-demo-v2')") is None
        assert all(v==0 for v in page.evaluate('window.__NATIS_UI__.getCounts()').values())
    check('Old browser sample storage purged',old_data)
    def resources():
        page.locator('[data-nav="resources"]').first.click()
        assert page.locator('.resource-card').count()==8
        for link in page.locator('.resource-open').all():
            assert (root/link.get_attribute('href')).is_file()
    check('Forms and manuals links exist',resources)
    def campaigns():
        page.locator('[data-nav="campaigns"]').first.click()
        assert page.locator('.campaign-card').count()==5
        assert page.locator('[data-feature]').count()==0
    check('Reference campaigns have no fictional publishing state',campaigns)
    def branding():
        page.locator('[data-nav="brandkit"]').first.click()
        assert page.locator('.brand-icon-card').count()==8
    check('Brand illustrations retained',branding)
    def settings():
        page.locator('[data-nav="settings"]').first.click()
        assert page.get_by_text('Google Apps Script').count()==1
        page.locator('[data-setting="compact"]').check()
        assert page.locator('body').evaluate('(el)=>el.classList.contains("compact")')
    check('Settings preferences work',settings)
    def reports():
        page.locator('[data-nav="reports"]').first.click()
        assert page.locator('.kpi-value').all_inner_texts()==['—']*4
        assert page.get_by_text('No volume data').count()==1
    check('Reports show unavailable source',reports)
    check('JavaScript error-free',lambda:(_ for _ in ()).throw(AssertionError(errors)) if errors else None)
    mobile=browser.new_page(viewport={'width':390,'height':844})
    mobile.add_script_tag(content=storage_script)
    mount(mobile)
    def responsive():
        mobile.locator('#menuToggle').click()
        mobile.locator('[data-nav="applications"]').first.click()
        assert mobile.locator('h1').inner_text()=='Applications'
        assert 'nav-open' not in mobile.locator('#appShell').get_attribute('class')
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
    check('Mobile navigation without overflow',responsive)
    browser.close()
(root/'test-results.json').write_text(json.dumps(results,indent=2))
failed=[x for x in results if x['status']=='FAIL']
print(str(len(results)-len(failed))+'/'+str(len(results))+' checks passed')
if failed: raise SystemExit(1)
