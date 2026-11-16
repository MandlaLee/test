from pathlib import Path
import base64, json, re
root=Path(__file__).resolve().parent
index=(root/'index.html').read_text()
css=(root/'styles.css').read_text()+'\n'+(root/'portal.css').read_text()
js=(root/'app.js').read_text()
mp={}
for p in (root/'assets').rglob('*'):
 if p.suffix.lower() in ['.jpg','.png','.svg']:
  typ={'.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'}[p.suffix.lower()]
  mp[p.relative_to(root).as_posix()]='data:'+typ+';base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
for path,data in mp.items():
 index=index.replace('src="'+path+'"','src="'+data+'"')
# dynamic image references: map inline media to original content without changing normal module source.
js=js.replace("  const PREFERENCES_KEY = 'natis-admin-ui-preferences';", "  const PREFERENCES_KEY = 'natis-admin-ui-preferences';\n  const imageAssetMap="+json.dumps(mp, separators=(',',':'))+";\n  const assetPath=(path)=>imageAssetMap[path]||path;")
js=js.replace('src="assets/icons/${r.icon}.svg"',"src=\"${assetPath('assets/icons/'+r.icon+'.svg')}\"")
js=js.replace('src="assets/icons/${f}.svg"',"src=\"${assetPath('assets/icons/'+f+'.svg')}\"")
js=js.replace('src="assets/campaigns/${selected.image}"',"src=\"${assetPath('assets/campaigns/'+selected.image)}\"")
js=js.replace('src="assets/campaigns/${c.image}"',"src=\"${assetPath('assets/campaigns/'+c.image)}\"")
js=js.replace('src="assets/brand/natis-navbar-reference.svg"',"src=\"${assetPath('assets/brand/natis-navbar-reference.svg')}\"")
js=js.replace('src="assets/brand/rtmc-logo.png"',"src=\"${assetPath('assets/brand/rtmc-logo.png')}\"")
index=index.replace('<link rel="stylesheet" href="styles.css" />','<style>'+css+'</style>')
index=index.replace('<link rel="stylesheet" href="portal.css" />','')
index=index.replace('<script src="app.js"></script>','<script>'+js+'</script>')
index=index.replace('href="assets/brand/rtmc-logo.png"', 'href="'+mp['assets/brand/rtmc-logo.png']+'"')
(root/'standalone.html').write_text(index)
print('Standalone',len(index),'chars','asset-count',len(mp))
assert 'assetPath' in js
assert 'src="assets/icons/${' not in index
assert '<script src="./app.js"' not in index