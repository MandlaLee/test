from pathlib import Path
import base64, json
root=Path(__file__).resolve().parent
index=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
js=(root/'app.js').read_text()
images={}
for p in (root/'assets').rglob('*'):
    if p.suffix.lower() in ('.jpg','.png','.svg'):
        mime={'.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'}[p.suffix.lower()]
        images[p.relative_to(root).as_posix()]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
for name,data in images.items():
    index=index.replace('src="'+name+'"','src="'+data+'"')
needle="  const PREFERENCES_KEY='natis-admin-ui-preferences';"
if needle not in js:
    raise RuntimeError('Could not locate source insertion point')
js=js.replace(needle,needle+"\n  const imageAssetMap="+json.dumps(images,separators=(',',':'))+";\n  const assetPath=path=>imageAssetMap[path]||path;")
for expression in (
    'assets/icons/${r.icon}.svg','assets/icons/${f}.svg',
    'assets/campaigns/${c.image}',
    'assets/brand/natis-wordmark.png','assets/brand/rtmc-logo.png'
):
    if expression.startswith('assets/icons/'):
        key=expression[len('assets/icons/'):].removesuffix('.svg')
        js=js.replace('src="'+expression+'"','src="${assetPath(\'assets/icons/\'+'+key[2:-1]+'+\'.svg\')}"')
    elif expression=='assets/campaigns/${c.image}':
        js=js.replace('src="'+expression+'"','src="${assetPath(\'assets/campaigns/\'+c.image)}"')
    else:
        js=js.replace('src="'+expression+'"','src="${assetPath(\''+expression+'\')}"')
index=index.replace('<link rel="stylesheet" href="./styles.css" />','<style>'+css+'</style>')
index=index.replace('<script src="./app.js"></script>','<script>'+js+'</script>')
index=index.replace('href="assets/brand/rtmc-logo.png"','href="'+images['assets/brand/rtmc-logo.png']+'"')
(root/'standalone.html').write_text(index)
print('Wrote standalone.html with embedded images; PDF references remain adjacent.')
