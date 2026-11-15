/* NaTIS admin preview — unconnected and without fabricated records. */
(() => {
  'use strict';
  // Only interface preferences are stored; records must come from an authorised backend.
  const icons = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    car:'<path d="m5 17-1 3H2v-7l3-7h14l3 7v7h-2l-1-3H5Z"/><path d="M2 13h20M6 16h2m8 0h2"/>',
    building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-5h6v5M8 6h1M15 6h1M8 11h1M15 11h1"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    wallet:'<rect x="2" y="5" width="20" height="16" rx="2"/><path d="M2 9h20M16 15h2"/>',
    alert:'<path d="M12 3 2 21h20L12 3Z M12 9v5m0 4h.01"/>',
    chart:'<path d="M3 3v18h18M7 16l4-4 3 2 5-7"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    settings:'<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m19.4 15 .1.1 1.6 1.3-2 3.4-1.9-.8a8 8 0 0 1-1.8 1l-.3 2h-4l-.3-2a8 8 0 0 1-1.8-1l-1.9.8-2-3.4 1.6-1.3a8 8 0 0 1 0-2l-1.6-1.3 2-3.4 1.9.8a8 8 0 0 1 1.8-1l.3-2h4l.3 2a8 8 0 0 1 1.8 1l1.9-.8 2 3.4-1.6 1.3a8 8 0 0 1 0 2Z"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 20h16"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    filter:'<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
    arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 2M4 15l2 2a7 7 0 0 0 12-2"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
    logout:'<path d="M10 17l5-5-5-5M15 12H3M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>'
  };
  function icon(name, size=18){ return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.file}</svg>`; }
  const nav = [
    {group:'WORKSPACE',items:[['overview','Overview','grid'],['applications','Applications','file'],['appointments','Appointments','calendar'],['renewals','Vehicle renewals','car'],['centres','DLTC & slots','building']]},
    {group:'OPERATIONS',items:[['citizens','Citizen profiles','users'],['payments','Payments','wallet'],['accidents','Accident reports','alert']]},
    {group:'ADMINISTRATION',items:[['reports','Reports & analytics','chart'],['resources','Forms & manuals','file'],['campaigns','Campaigns & notices','info'],['brandkit','Brand assets','shield'],['team','Team & access','shield'],['audit','Activity log','clock'],['settings','Settings','settings']]}
  ];
  const state={applications:[],appointments:[],renewals:[],centres:[],citizens:[],payments:[],accidents:[],team:[],audit:[],settings:{alerts:true,compact:false}};
  const PREFERENCES_KEY='natis-admin-ui-preferences';
  try{localStorage.removeItem('road-services-admin-demo-v2');localStorage.removeItem('road-services-admin-demo-v1');const p=JSON.parse(localStorage.getItem(PREFERENCES_KEY)||'null');if(p&&typeof p==='object'){for(const k of ['alerts','compact'])if(typeof p[k]==='boolean')state.settings[k]=p[k];}}catch(_){};

    let page='overview', query='', filter='all', period='7d', pageIndex=0, modal=null;
  const $=sel=>document.querySelector(sel);
  const h=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  const prettyDate=s=>{const d=new Date(`${s}T12:00:00`);return Number.isNaN(d.getTime())?s:d.toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'});};
  const status=s=>`<span class="status ${h(s.toLowerCase().replace(/[^a-z]/g,''))}">${h(s)}</span>`;
  const routeLabel=id=>nav.flatMap(group=>group.items).find(i=>i[0]===id)?.[1]||'Overview';
  const save=()=>{try{localStorage.setItem(PREFERENCES_KEY,JSON.stringify(state.settings));}catch(_){}};
  // Audit entries require authenticated server-side logging; none are fabricated.
  function toast(message){const item=document.createElement('div');item.className='toast';item.textContent=message;$('#toastStack').append(item);setTimeout(()=>item.remove(),3400);}
  function navigate(target){if(!nav.flatMap(g=>g.items).some(i=>i[0]===target))target='overview';page=target;query='';filter='all';pageIndex=0;$('#globalSearch').value='';location.hash=`/${target}`;draw();$('#appShell').classList.remove('nav-open');window.scrollTo(0,0);}
  function navHtml(){return nav.map(g=>'<section class="nav-group"><p class="nav-group-label">'+g.group+'</p>'+g.items.map(([id,label,ic])=>'<button class="nav-link '+(page===id?'active':'')+'" data-nav="'+id+'" aria-current="'+(page===id?'page':'false')+'">'+icon(ic)+'<span>'+label+'</span></button>').join('')+'</section>').join('');}
  const head=(eyebrow,title,desc='',actions='')=>`<div class="page-header"><div><div class="page-eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</div>`;
  const note=()=>'<div class="proto-note">'+icon('info',16)+'<span><strong>UI PREVIEW · NO DATA SOURCE</strong> — No records, active account, authentication or government service connection has been configured. Operational screens remain empty until approved integration.</span></div>';
  const btn=(label,action,kind='')=>`<button class="btn ${kind}" data-action="${action}">${label}</button>`;
  const kpi=(label,value,delta,ic,kind='')=>`<article class="kpi"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-icon ${kind}">${icon(ic,18)}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot"><span class="trend">${delta}</span></div></article>`;
  const panel=(title,subtitle,inner,extra='')=>`<section class="panel"><div class="panel-header"><div><h2 class="panel-title">${title}</h2>${subtitle?`<p class="panel-subtitle">${subtitle}</p>`:''}</div>${extra}</div><div class="panel-content">${inner}</div></section>`;
  const stat=(label,value,foot)=>`<div class="small-stat"><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;
  const table=(cols,rows,key,empty='Connect an authorised data source to display records.')=>`<div class="table-outer"><table><thead><tr>${cols.map(x=>`<th>${x[0]}</th>`).join('')}<th>Action</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${cols.map(([label,field,fmt])=>`<td>${fmt?fmt(r[field],r):h(r[field])}</td>`).join('')}<td><button class="row-action" data-open="${key}:${h(r.id)}" aria-label="View ${h(r.id)}">View details ${icon('chevron',12)}</button></td></tr>`).join(''):`<tr><td colspan="${cols.length+1}"><div class="empty-state"><strong>${query||filter!=='all'?'No matching records':'No records available'}</strong><p>${empty}</p><button class="btn" data-nav="settings">View integration status</button></div></td></tr>`}</tbody></table></div>`;
  const field=(label,name,value='',type='text',opts='')=>`<div class="form-field"><label for="f_${name}">${label}</label>${type==='select'?`<select id="f_${name}" name="${name}">${opts.split('|').map(x=>`<option ${x===value?'selected':''}>${h(x)}</option>`).join('')}</select>`:`<input id="f_${name}" name="${name}" type="${type}" value="${h(value)}" required />`}</div>`;
  const filterTool=(placeholder,statuses)=>`<div class="table-tools"><label class="search-field"><span>${icon('search',14)}</span><input class="input" id="localQuery" value="${h(query)}" aria-label="Search records" placeholder="${placeholder}" autocomplete="off"/></label><select class="select" id="statusFilter" aria-label="Filter by status"><option value="all">All statuses</option>${statuses.map(x=>`<option value="${h(x)}" ${filter===x?'selected':''}>${h(x)}</option>`).join('')}</select></div>`;
  const match=r=>Object.values(r).some(v=>String(v).toLowerCase().includes(query.toLowerCase())) && (filter==='all'||r.status===filter);
  const exportButton=key=>'<button class="btn" disabled title="Export is unavailable without an approved data connection">'+icon('download',15)+' Export CSV</button>';
  // Only publicly oriented documents supplied for this demo are listed here. No scanned applicant data.
  const resources = [
    {id:'LL1',title:'Learner\u2019s licence application',type:'Application form',category:'forms',description:'LL1 application and duplicate request; applicant particulars, vehicle class and declarations.',file:'learner-licence-LL1.pdf',icon:'learner'},
    {id:'DL1',title:'Driving licence application',type:'Application form',category:'forms',description:'DL1 application, card replacement, vehicle class and licence-related declarations.',file:'driving-licence-DL1.pdf',icon:'driving-licence'},
    {id:'PD1',title:'Professional driving permit',type:'Application form',category:'forms',description:'PrDP application and permit categories P, D and G, subject to official assessment.',file:'professional-driving-permit-PD1.pdf',icon:'prdp'},
    {id:'MC',title:'Medical certificate',type:'Supporting document',category:'forms',description:'Medical practitioner and applicant details and practitioner declaration.',file:'medical-certificate-MC.pdf',icon:'faq'},
    {id:'MAN-1',title:'Rules of the Road',type:'Learner driver manual',category:'manuals',description:'South African Learner Driver Manual, section 1, supplied edition.',file:'rules-of-the-road.pdf',icon:'learner'},
    {id:'MAN-2',title:'Road Traffic Signs',type:'Learner driver manual',category:'manuals',description:'South African Learner Driver Manual, section 2, October 2026 edition.',file:'road-traffic-signs.pdf',icon:'driving-licence'},
    {id:'MAN-3',title:'Vehicle Controls',type:'Learner driver manual',category:'manuals',description:'South African Learner Driver Manual, section 3, vehicle components and controls.',file:'vehicle-controls.pdf',icon:'licence-card'},
    {id:'POPI',title:'RTMC POPI disclaimer',type:'Privacy reference',category:'governance',description:'Supplied RTMC personal-information disclaimer for governance and privacy review.',file:'rtmc-popi-disclaimer.pdf',icon:'faq'}
  ];
  const campaigns=[
    {id:'cashless',title:'Cashless DLTCs',tag:'Payments',image:'cashless-centres.jpg',caption:'Payment-method guidance for designated testing centres'},
    {id:'senior',title:'Senior citizen assistance',tag:'Accessibility',image:'senior-citizens.jpg',caption:'In-person assistance guidance for older applicants'},
    {id:'waterfall',title:'Eco Park & Waterfall DLTCs',tag:'Centre notice',image:'waterfall-ecopark.jpg',caption:'Centres and cashless payment information'},
    {id:'hours',title:'DLTC trading hours',tag:'Service notice',image:'dltc-hours.jpg',caption:'Uploaded centre-hours notice; verify any trading hours before publication'},
    {id:'safety',title:'Road safety awareness',tag:'Safety',image:'road-safety.jpg',caption:'Road-safety awareness and remembrance campaign'}
  ];
  function resourceGrid(){
    const items=resources.filter(r=>((filter==='all'||r.category===filter)&&(r.id+' '+r.title+' '+r.type+' '+r.description).toLowerCase().includes(query.toLowerCase())));
    return head('KNOWLEDGE & DOCUMENTS','Forms & manuals','Supplied reference material for use while reviewing applications. All downloads are reference copies; do not complete with real personal data in this demo.')+note()+
      `<div class="table-tools resource-tools"><label class="search-field">${icon('search',15)}<input id="localQuery" class="input" aria-label="Search forms and manuals" value="${h(query)}" placeholder="Find a form, code, or manual..."></label><select class="select" id="statusFilter" aria-label="Filter document type"><option value="all">All documents</option>${[['forms','Forms'],['manuals','Manuals'],['governance','Governance']].map(([v,t])=>`<option value="${v}" ${filter===v?'selected':''}>${t}</option>`).join('')}</select></div>`+
      `<div class="resource-grid">${items.map(r=>`<article class="resource-card"><div class="resource-illustration"><img src="assets/icons/${r.icon}.svg" alt="" loading="lazy" /></div><div class="resource-copy"><div class="resource-type">${h(r.id)} · ${h(r.type)}</div><h2>${h(r.title)}</h2><p>${h(r.description)}</p><a class="btn resource-open" href="assets/documents/${encodeURIComponent(r.file)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${h(r.title)} document">${icon('file',15)} View document</a></div></article>`).join('')||'<div class="empty-resource">No reference documents match this filter.</div>'}</div>`+
      `<div class="reference-notice">${icon('info',20)}<div><strong>Document-control note</strong><p>These supplied editions are for UI evaluation. Check publication, currency, redistribution rights and approval with the commissioning team before production or public deployment. The app does not create, sign, validate or lodge official applications.</p></div></div>`;
  }
  function campaignPage(){
  return head('CONTENT LIBRARY','Campaigns & notices','Uploaded RTMC / NaTIS campaign artwork for internal reference. These are not live or scheduled website notices.')+note()+
    `<div class="campaign-grid">${campaigns.map(c=>`<article class="campaign-card"><div class="campaign-cover"><img src="assets/campaigns/${c.image}" alt="${h(c.title)} artwork" loading="lazy" /></div><div class="campaign-body"><div class="resource-type">${h(c.tag)} · Uploaded reference</div><h3>${h(c.title)}</h3><p>${h(c.caption)}</p><div class="campaign-actions"><a class="btn" href="assets/campaigns/${c.image}" target="_blank" rel="noopener noreferrer">View artwork</a></div></div></article>`).join('')}</div>`+
    `<div class="reference-notice">${icon('info',20)}<div><strong>Publishing not configured</strong><p>Artwork is for internal review only. Nothing displayed here represents a currently published notice. Approval, expiry dates, publishing permissions and official service content must be verified with the commissioning team.</p></div></div>`;
}
    function brandKit(){
    const colors=[['NaTIS purple','#7B2E87'],['RTMC blue','#2379BD'],['Road-safety green','#66A73B'],['Interface navy','#172D49'],['White','#FFFFFF']];
    const items=[['learner','Learner licence'],['driving-licence','Driving test'],['licence-card','Licence card'],['vehicle-disc','Vehicle licence disc'],['prdp','PrDP'],['appointment','Slot request'],['crash','Accident report'],['faq','Help & FAQ']];
    return head('DESIGN SYSTEM','Brand assets','Original logos and portal graphics supplied for visual review, with a practical dashboard colour reference.')+note()+
      `<div class="brand-assets-grid"><section class="brand-tile"><h2>NaTIS logo</h2><div class="brand-display brand-light"><img src="assets/brand/natis-wordmark.png" alt="NaTIS National Traffic Information System logo" /></div><p>Supplied NaTIS wordmark. Maintain original proportions; no retyping.</p></section><section class="brand-tile"><h2>RTMC logo</h2><div class="brand-display brand-dark"><img src="assets/brand/rtmc-logo.png" alt="Road Traffic Management Corporation logo" /></div><p>Supplied RTMC graphic. Use only as approved by the commissioning team.</p></section></div>`+
      `<section class="panel"><div class="panel-header"><div><h2 class="panel-title">Interface palette</h2><p class="panel-subtitle">Design approximation based on the supplied brand artwork; not an official colour specification.</p></div></div><div class="swatch-grid">${colors.map(([n,c])=>`<div class="swatch"><span style="background:${c};${c==='#FFFFFF'?'border:1px solid #cbd5e1;':''}"></span><strong>${n}</strong><small>${c}</small></div>`).join('')}</div></section>`+
      `<section class="panel" style="margin-top:18px"><div class="panel-header"><div><h2 class="panel-title">Portal service icons</h2><p class="panel-subtitle">Supplied SVG files mapped to admin services.</p></div></div><div class="icon-gallery">${items.map(([f,label])=>`<div class="brand-icon-card"><img src="assets/icons/${f}.svg" alt="" loading="lazy" /><strong>${h(label)}</strong></div>`).join('')}</div></section>`+
      `<div class="reference-notice">${icon('info',20)}<div><strong>Fonts and asset rights</strong><p>This build uses accessible system and web fallback fonts, not a claimed official NaTIS typeface. Brand use, asset distribution and exact font choice require written confirmation before a production release.</p></div></div>`;
  }
  function awaitingConnection(label='No records to display',detail='Connect an authorised data source to load this information.'){
  return `<div class="blank-dashboard">${icon('info',28)}<strong>${h(label)}</strong><p>${h(detail)}</p><button class="btn" data-nav="settings">Integration status ${icon('chevron',14)}</button></div>`;
}
  function overview(){
  return head('OPERATIONS OVERVIEW','Administration overview','Your operational workspace is ready. No data source has been configured yet.')+note()+
  `<div class="kpi-grid">${kpi('Total applications','—','Not connected','file','blue')}${kpi('Appointments','—','Not connected','calendar','green')}${kpi('Vehicle renewals','—','Not connected','car','purple')}${kpi('Pending reviews','—','Not connected','clock','amber')}</div>`+
  `<div class="panel-grid">${panel('Service activity','Appears when a verified data feed is connected',awaitingConnection('Activity data unavailable','No activity chart or totals are shown without a connected source.'))}${panel('Service performance','No estimated rates or generated results',awaitingConnection('Performance data unavailable','Service measures will be calculated from approved transactions.'))}</div>`+
  `<div class="two-column">${panel('Latest applications','No imported application records',awaitingConnection('Application queue empty','Applications will appear after integration.'))}${panel('Activity feed','Requires a verified audit source',awaitingConnection('No activity recorded','Live staff actions will require authenticated, server-side audit logging.'))}</div>`;
}
    function recordsPage(key,eyebrow,title,description,cols,statuses){
  const rows=state[key].filter(match);
  return head(eyebrow,title,description,exportButton(key))+note()+
    `<section class="panel table-panel"><div class="table-head"><div><h2>${title} register</h2><p>Waiting for an authorised data source</p></div><span class="badge-demo">NOT CONNECTED</span></div>${filterTool('Search records when connected...',statuses)}${table(cols,rows,key)}<div class="table-footer"><span>Data source: not connected</span><span>0 imported records</span></div></section>`;
}
    function appointments(){
  return `<div class="small-cards">${stat('Confirmed','—','Data unavailable')}${stat('Awaiting confirmation','—','Data unavailable')}${stat('Cancelled','—','Data unavailable')}</div>`+recordsPage('appointments','BOOKING OPERATIONS','Appointments','Browse test bookings and licence-card renewal appointments when connected.',[['Booking ID','id'],['Applicant','name'],['Service','service'],['Centre','centre'],['Date','date',prettyDate],['Time','time'],['Status','status',status]],['Confirmed','Pending','Cancelled']);
}
    function centres(){
  return head('SERVICE NETWORK','DLTC & available slots','Centre details and appointment capacity will appear after your integration is configured.')+note()+
    `<div class="small-cards">${stat('Listed centres','—','Data unavailable')}${stat('Total daily slots','—','Data unavailable')}${stat('Available slots','—','Data unavailable')}</div>`+
    `<section class="panel">${awaitingConnection('No centre data imported','Testing-centre lists, schedules and capacity must come from a verified source. This preview does not claim any centre is open or available.')}</section>`;
}
    function reports(){
  return head('ANALYTICS','Reports & analytics','Reports will populate after an authorised data connection; figures are not estimated.')+note()+
    `<div class="kpi-grid">${kpi('Cases on record','—','Not connected','file')}${kpi('Completed applications','—','Not connected','check')}${kpi('Paid transactions','—','Not connected','wallet')}${kpi('Active centres','—','Not connected','building')}</div>`+
    `<div class="two-column">${panel('Volume by service','Requires connected operational records',awaitingConnection('No volume data','Charts will be populated with verified application and booking data.'))}${panel('Downloadable reports','Export requires data access',awaitingConnection('No exports available','CSV downloads will be enabled after the source has been connected and permissions enforced.'))}</div>`;
}
    function team(){
  return head('ACCESS MANAGEMENT','Team & permissions','Staff accounts are not connected. The role matrix below is a proposal, not enforced access control.')+note()+
    `<div class="two-column">${panel('Staff directory','Awaiting identity-provider connection',awaitingConnection('No staff accounts loaded','Staff, role assignments and invitations require authenticated management.'))}${panel('Proposed permission matrix','For team review only · not yet enforced',`<div class="table-outer"><table class="permission-table"><thead><tr><th>Permission</th><th>Admin</th><th>Reviewer</th><th>Auditor</th></tr></thead><tbody>${[['View records',1,1,1],['Update applications',1,1,0],['Edit centre capacity',1,0,0],['Manage accounts',1,0,0],['Export audit logs',1,0,1]].map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(x=>`<td class="${x?'permission-ok':'permission-no'}">${x?'✓':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)}</div>`;
}
    function audit(){return recordsPage('audit','GOVERNANCE','Activity log','Audit entries require a connected authentication and logging system.',[['Event','action'],['Record','entity'],['Actor','actor'],['Timestamp','date']],[]);}
    function settings(){
  return head('WORKSPACE CONFIGURATION','Settings','Local display preferences and integration-readiness information.')+note()+
  `<div class="settings-grid"><section class="setting-card"><h3>Interface preferences</h3><p>Only display preferences are saved in your browser.</p>${[['alerts','Show interface notifications'],['compact','Compact data tables']].map(([key,label])=>`<label class="toggle-row"><span>${label}</span><input class="switch" type="checkbox" data-setting="${key}" ${state.settings[key]?'checked':''}/></label>`).join('')}</section><section class="setting-card"><h3>Data connections</h3><p>Nothing is connected. This screen does not collect passwords or government credentials.</p><div class="info-box"><strong>Google Apps Script</strong><p>Not connected · planned test login</p><strong>Google Sheets</strong><p>Not connected · test data only, once approved</p><strong>Official NaTIS systems</strong><p>Not connected · requires an authorised secure integration</p><strong>Authentication & permissions</strong><p>Not implemented · staff access must be enforced server-side</p></div></section><section class="setting-card"><h3>Data status</h3><p>This build contains no fictional citizen, appointment, licence, payment or employee records. Previously saved demo datasets are ignored and cleared when this version loads.</p><div class="info-box"><strong>No live records</strong><p>The em dash (—) on metric cards means unavailable, not zero.</p></div></section><section class="setting-card"><h3>About this preview</h3><p>Independent UI prototype using user-supplied NaTIS/RTMC branding references. Not a public-facing government service.</p><div class="info-box"><strong>Version 1.2 · Empty-state build</strong><p>HTML · CSS · JavaScript · no API keys · no authentication · no fabricated datasets</p></div></section></div>`;
}
    const pages={overview,resources:resourceGrid,campaigns:campaignPage,brandkit:brandKit,
applications:()=>recordsPage('applications','CASE MANAGEMENT','Applications','Application queues will appear here once connected.',[['Reference','id'],['Applicant','name'],['Service','service'],['Centre','centre'],['Submitted','date',prettyDate],['Status','status',status]],['Pending','In review','Processing','Completed','Rejected']),
appointments,renewals:()=>recordsPage('renewals','VEHICLE LICENSING','Vehicle renewals','Vehicle licence renewals and fulfilment statuses require a connected source.',[['Reference','id'],['Vehicle','name'],['Registration','registration'],['Province','province'],['Amount','amount'],['Status','status',status]],['Pending','Paid','Processing','Dispatched','Completed']),
centres,citizens:()=>recordsPage('citizens','CITIZEN SERVICES','Citizen profiles','Personal information is not bundled with this interface.',[['Profile','name'],['Identity reference','identity'],['Province','province'],['Registered','joined',prettyDate],['Status','status',status]],['Active','Suspended']),
payments:()=>recordsPage('payments','TRANSACTION MONITORING','Payments','No payment transactions or revenue figures are available without a verified provider.',[['Transaction','id'],['Reference','reference'],['Service','service'],['Amount','amount'],['Date','date',prettyDate],['Status','status',status]],['Paid','Pending','Failed']),
accidents:()=>recordsPage('accidents','INCIDENT MANAGEMENT','Accident reports','Only securely provided reports can be reviewed here.',[['Report','id'],['Submitter','name'],['Location','location'],['Type','type'],['Submitted','date',prettyDate],['Status','status',status]],['Pending review','In review','Resolved']),
reports,team,audit,settings};
    function draw(){
    $('#sideNav').innerHTML=navHtml();$('#breadcrumbCurrent').textContent=routeLabel(page);
    $('#pageContent').innerHTML=(pages[page]||overview)();
    if(state.settings.compact)document.body.classList.add('compact');else document.body.classList.remove('compact');
    $('#headerDate').textContent=new Date().toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'});
  }
  document.addEventListener('click',e=>{const n=e.target.closest('[data-nav]');if(n)navigate(n.dataset.nav);});
document.addEventListener('input',e=>{if(e.target.id==='localQuery'||e.target.id==='globalSearch'){query=e.target.value;pageIndex=0;const focused=e.target.id;const caret=e.target.selectionStart;draw();const n=document.getElementById(focused);if(n){n.focus();try{n.setSelectionRange(caret,caret)}catch(_){}}if(focused==='globalSearch')document.getElementById('globalSearch').value=query;}});
document.addEventListener('change',e=>{if(e.target.id==='statusFilter'){filter=e.target.value;draw();}if(e.target.dataset.setting){state.settings[e.target.dataset.setting]=e.target.checked;save();draw();if(state.settings.alerts)toast('Preference saved on this device.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('appShell').classList.remove('nav-open');if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('globalSearch').focus();}});
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('appShell').classList.add('nav-open'));
document.getElementById('closeSidebar').addEventListener('click',()=>document.getElementById('appShell').classList.remove('nav-open'));
document.getElementById('shade').addEventListener('click',()=>document.getElementById('appShell').classList.remove('nav-open'));
document.getElementById('notificationsButton').addEventListener('click',()=>toast('Notifications are unavailable until an authenticated service is connected.'));
window.addEventListener('hashchange',()=>{const id=location.hash.replace(/^#\//,'');if(id!==page)navigate(id);});
window.__NATIS_UI__={getRoute:()=>page,getDataStatus:()=> 'not-connected',getCounts:()=>({applications:0,appointments:0,renewals:0,centres:0,citizens:0,payments:0,accidents:0,team:0,audit:0}),getResourceCount:()=>resources.length,getCampaignCount:()=>campaigns.length};
    const initial=location.hash.replace(/^#\//,'');page=nav.flatMap(g=>g.items).some(x=>x[0]===initial)?initial:'overview';draw();
})();