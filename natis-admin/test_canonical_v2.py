"""Run 14-route offline acceptance smoke test against canonical standalone.html."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
src = Path(__file__).with_name('standalone.html').read_text(encoding='utf-8')
routes = ['overview','applications','appointments','renewals','centres','citizens','payments','accidents','resources','campaigns','reports','team','audit','settings']
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=shutil.which('chromium') or shutil.which('google-chrome') or None, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1366,'height':900})
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.set_content(src, wait_until='domcontentloaded')
    for target in routes:
        page.locator(f'[data-nav="{target}"]').first.click()
        assert page.evaluate('window.__NATIS_DEMO__.getRoute()')==target, target
        assert page.locator('h1').count()==1, target
    page.locator('[data-nav="resources"]').first.click()
    assert page.locator('.resource-card').count()==8
    page.locator('[data-resource="LL1"]').click()
    assert page.locator('#dialogTitle').inner_text().startswith('Learner')
    page.locator('[data-close]').first.click()
    page.locator('[data-nav="campaigns"]').first.click()
    assert page.locator('.campaign-card').count()==6
    assert page.locator('img').evaluate_all('(xs)=>xs.every(x=>x.complete && x.naturalWidth>0)')
    assert not errors, errors
    browser.close()
print('PASS: 14 routes, 8 reference guides, 6 campaign images and zero JavaScript errors')
