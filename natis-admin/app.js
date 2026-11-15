/* NaTIS-inspired admin workspace demo — all records synthetic; no network/auth. */
(() => {
  'use strict';
  const KEY = 'road-services-admin-demo-v1';
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
    {group:'ADMINISTRATION',items:[['reports','Reports & analytics','chart'],['team','Team & access','shield'],['audit','Activity log','clock'],['settings','Settings','settings']]}
  ];
  const demo = {
    applications:[
      ['APP-260401','Demo Applicant 001','Driving licence card','Johannesburg','In review','2026-11-14'],
      ['APP-260402','Demo Applicant 002','PrDP application','Pretoria','Pending','2026-11-14'],
      ['APP-260403','Demo Applicant 003','Learner’s licence','Polokwane','Completed','2026-11-13'],
      ['APP-260404','Demo Applicant 004','Driving licence card','Midrand','Processing','2026-11-13'],
      ['APP-260405','Demo Applicant 005','PrDP application','Centurion','In review','2026-11-12'],
      ['APP-260406','Demo Applicant 006','Driving licence test','Tzaneen','Pending','2026-11-12'],
      ['APP-260407','Demo Applicant 007','Learner’s licence','Sandton','Completed','2026-11-11'],
      ['APP-260408','Demo Applicant 008','Driving licence card','Phalaborwa','Rejected','2026-11-10'],
      ['APP-260409','Demo Applicant 009','PrDP application','Pretoria','Processing','2026-11-10']
    ].map(([id,name,service,centre,status,date])=>({id,name,service,centre,status,date})),
    appointments:[
      ['BKG-260101','Demo Applicant 011','Learner’s licence test','Pretoria DLTC','2026-11-18','09:00','Confirmed'],
      ['BKG-260102','Demo Applicant 012','Driving licence test','Centurion DLTC','2026-11-19','10:30','Confirmed'],
      ['BKG-260103','Demo Applicant 013','Card renewal','Polokwane DLTC','2026-11-20','11:00','Pending'],
      ['BKG-260104','Demo Applicant 014','Learner’s licence test','Midrand DLTC','2026-11-21','08:00','Confirmed'],
      ['BKG-260105','Demo Applicant 015','Driving licence test','Pretoria DLTC','2026-11-22','12:30','Cancelled'],
      ['BKG-260106','Demo Applicant 016','Card renewal','Phalaborwa DLTC','2026-11-23','09:30','Pending']
    ].map(([id,name,service,centre,date,time,status])=>({id,name,service,centre,date,time,status})),
    renewals:[
      ['VEH-260201','Demo Vehicle 001','GP ••• 084','Gauteng','Paid','R 1,052.00','2026-11-14'],
      ['VEH-260202','Demo Vehicle 002','L ••• 315','Limpopo','Processing','R 735.00','2026-11-14'],
      ['VEH-260203','Demo Vehicle 003','CA ••• 090','Western Cape','Dispatched','R 924.00','2026-11-13'],
      ['VEH-260204','Demo Vehicle 004','GP ••• 716','Gauteng','Pending','R 1,266.00','2026-11-13'],
      ['VEH-260205','Demo Vehicle 005','FS ••• 052','Free State','Completed','R 812.00','2026-11-12'],
      ['VEH-260206','Demo Vehicle 006','L ••• 611','Limpopo','Processing','R 680.00','2026-11-11']
    ].map(([id,name,registration,province,status,amount,date])=>({id,name,registration,province,status,amount,date})),
    centres:[
      ['CTR-001','Pretoria DLTC','Gauteng','Pretoria',42,60,'Active'],
      ['CTR-002','Centurion DLTC','Gauteng','Centurion',33,50,'Active'],
      ['CTR-003','Polokwane DLTC','Limpopo','Polokwane',25,40,'Active'],
      ['CTR-004','Midrand DLTC','Gauteng','Midrand',39,50,'Active'],
      ['CTR-005','Phalaborwa DLTC','Limpopo','Phalaborwa',17,30,'Reduced hours'],
      ['CTR-006','Sandton DLTC','Gauteng','Sandton',36,45,'Active']
    ].map(([id,name,province,city,booked,total,status])=>({id,name,province,city,booked,total,status})),
    citizens:Array.from({length:10},(_,i)=>({id:`USR-${String(2401+i)}`,name:`Demo Profile ${String(i+1).padStart(3,'0')}`,identity:`TEST •••• ${String(3000+i*421).slice(-4)}`,province:['Gauteng','Limpopo','Mpumalanga','Free State'][i%4],joined:`2026-10-${String(i+10).padStart(2,'0')}`,status:i===8?'Suspended':'Active'})),
    payments:[
      ['PAY-261001','VEH-260201','Vehicle renewal','R 1,052.00','Paid','2026-11-14'],
      ['PAY-261002','VEH-260202','Vehicle renewal','R 735.00','Paid','2026-11-14'],
      ['PAY-261003','APP-260402','PrDP booking','R 250.00','Pending','2026-11-14'],
      ['PAY-261004','VEH-260204','Vehicle renewal','R 1,266.00','Failed','2026-11-13'],
      ['PAY-261005','APP-260403','Learner’s test','R 108.00','Paid','2026-11-13'],
      ['PAY-261006','VEH-260205','Vehicle renewal','R 812.00','Paid','2026-11-12']
    ].map(([id,reference,service,amount,status,date])=>({id,reference,service,amount,status,date})),
    accidents:[
      ['INC-260101','Demo Report 001','Johannesburg','Minor damage','Pending review','2026-11-14'],
      ['INC-260102','Demo Report 002','Tshwane','Vehicle damage','In review','2026-11-13'],
      ['INC-260103','Demo Report 003','Polokwane','Minor damage','Resolved','2026-11-12'],
      ['INC-260104','Demo Report 004','Mbombela','Property damage','Pending review','2026-11-11']
    ].map(([id,name,location,type,status,date])=>({id,name,location,type,status,date})),
    team:[
      ['STAFF-001','Admin Demo','System administrator','Gauteng','Active'],
      ['STAFF-002','Reviewer Demo','Application reviewer','Limpopo','Active'],
      ['STAFF-003','Centre Demo','Centre operator','Gauteng','Active'],
      ['STAFF-004','Auditor Demo','Read-only auditor','National','Active']
    ].map(([id,name,role,scope,status])=>({id,name,role,scope,status})),
    audit:[{id:'LOG-001',action:'Demo dataset initialised',entity:'System',actor:'System',date:'2026-11-15 09:00'}],
    settings:{alerts:true,compact:false,weeklyDigest:false}
  };
  let state;
  try { const saved=JSON.parse(localStorage.getItem(KEY)); state=saved&&saved.applications&&saved.centres?{...structuredClone(demo),...saved}:structuredClone(demo); } catch {state=structuredClone(demo);}
  let page='overview', query='', filter='all', period='7d', pageIndex=0, modal=null;
  const $=sel=>document.querySelector(sel);
  const h=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  const prettyDate=s=>{const d=new Date(`${s}T12:00:00`);return Number.isNaN(d.getTime())?s:d.toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'});};
  const status=s=>`<span class="status ${h(s.toLowerCase().replace(/[^a-z]/g,''))}">${h(s)}</span>`;
  const routeLabel=id=>nav.flatMap(group=>group.items).find(i=>i[0]===id)?.[1]||'Overview';
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('Local storage is unavailable in this browser.');}};
  function log(action,entity){state.audit.unshift({id:`LOG-${Date.now()}`,action,entity,actor:'Admin Demo',date:new Date().toLocaleString('en-ZA',{hour12:false})});save();}
  function toast(message){const item=document.createElement('div');item.className='toast';item.textContent=message;$('#toastStack').append(item);setTimeout(()=>item.remove(),3400);}
  function navigate(target){if(!nav.flatMap(g=>g.items).some(i=>i[0]===target))target='overview';page=target;query='';filter='all';pageIndex=0;$('#globalSearch').value='';location.hash=`/${target}`;draw();$('#appShell').classList.remove('nav-open');window.scrollTo(0,0);}
  function navHtml(){return nav.map(g=>`<section class="nav-group"><p class="nav-group-label">${g.group}</p>${g.items.map(([id,label,ic])=>`<button class="nav-link ${page===id?'active':''}" data-nav="${id}" aria-current="${page===id?'page':'false'}">${icon(ic)}<span>${label}</span>${id==='applications'?`<span class="count">${state.applications.filter(a=>a.status==='Pending'||a.status==='In review').length}</span>`:''}</button>`).join('')}</section>`).join('');}
  const head=(eyebrow,title,desc='',actions='')=>`<div class="page-header"><div><div class="page-eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</div>`;
  const note=()=>`<div class="proto-note">${icon('info',16)}<span><strong>PROTOTYPE ENVIRONMENT</strong> — Fictional records only. This workspace is not connected to NaTIS, the RTMC, payment services or government databases. No real identity details are used.</span></div>`;
  const btn=(label,action,kind='')=>`<button class="btn ${kind}" data-action="${action}">${label}</button>`;
  const kpi=(label,value,delta,ic,kind='')=>`<article class="kpi"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-icon ${kind}">${icon(ic,18)}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot"><span class="trend">${delta}</span></div></article>`;
  const panel=(title,subtitle,inner,extra='')=>`<section class="panel"><div class="panel-header"><div><h2 class="panel-title">${title}</h2>${subtitle?`<p class="panel-subtitle">${subtitle}</p>`:''}</div>${extra}</div><div class="panel-content">${inner}</div></section>`;
  const stat=(label,value,foot)=>`<div class="small-stat"><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;
  const table=(cols,rows,key,empty='No matching demo records.')=>`<div class="table-outer"><table><thead><tr>${cols.map(x=>`<th>${x[0]}</th>`).join('')}<th>Action</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${cols.map(([label,field,fmt])=>`<td>${fmt?fmt(r[field],r):h(r[field])}</td>`).join('')}<td><button class="row-action" data-open="${key}:${h(r.id)}" aria-label="View ${h(r.id)}">View details ${icon('chevron',12)}</button></td></tr>`).join(''):`<tr><td colspan="${cols.length+1}"><div class="empty-state"><strong>Nothing matches your search</strong>${empty}</div></td></tr>`}</tbody></table></div>`;
  const field=(label,name,value='',type='text',opts='')=>`<div class="form-field"><label for="f_${name}">${label}</label>${type==='select'?`<select id="f_${name}" name="${name}">${opts.split('|').map(x=>`<option ${x===value?'selected':''}>${h(x)}</option>`).join('')}</select>`:`<input id="f_${name}" name="${name}" type="${type}" value="${h(value)}" required />`}</div>`;
  const filterTool=(placeholder,statuses)=>`<div class="table-tools"><label class="search-field"><span>${icon('search',14)}</span><input class="input" id="localQuery" value="${h(query)}" aria-label="Search records" placeholder="${placeholder}" autocomplete="off"/></label><select class="select" id="statusFilter" aria-label="Filter by status"><option value="all">All statuses</option>${statuses.map(x=>`<option value="${h(x)}" ${filter===x?'selected':''}>${h(x)}</option>`).join('')}</select></div>`;
  const match=r=>Object.values(r).some(v=>String(v).toLowerCase().includes(query.toLowerCase())) && (filter==='all'||r.status===filter);
  const exportButton=key=>`<button class="btn" data-export="${key}">${icon('download',15)} Export CSV</button>`;
  function overview(){
    const apps=state.applications, upcoming=state.appointments.filter(x=>x.status!=='Cancelled');
    const bars=(period==='7d'?[35,47,42,67,56,82,64]:[45,60,51,68,75,48,82,61,56,79,65,88,68,77]).map((n,i)=>`<div class="bar-column"><div class="bar" style="height:${n}%" title="Demo volume ${n}"></div><span>${period==='7d'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]:String(i*2+1)}</span></div>`).join('');
    const services=[['Driving licence cards',74,'car'],['Learner’s bookings',62,'calendar'],['Vehicle renewals',88,'car'],['PrDP applications',46,'file']];
    const recent=[...apps].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
    return head('OPERATIONS OVERVIEW','Good afternoon, Admin','Here is what is happening across the demo service workspace.',`${btn(`${icon('refresh',14)} Reset demo`,'reset','')}${exportButton('applications')}`)+note()+
      `<div class="kpi-grid">${kpi('Total applications',apps.length,'Across all services','file','blue')}${kpi('Upcoming appointments',upcoming.length,'Including pending bookings','calendar','green')}${kpi('Vehicle renewals',state.renewals.length,'Demo renewal requests','car','purple')}${kpi('Pending reviews',apps.filter(a=>['In review','Pending'].includes(a.status)).length+state.accidents.filter(a=>a.status==='Pending review').length,'Needs operator attention','clock','amber')}</div>`+
      `<div class="panel-grid">${panel('Service activity','Synthetic case volume · visual placeholder',`<div class="chart-label-row"><strong>Requests handled</strong><span>${period==='7d'?'Last 7 days':'Last 30 days'}</span></div><div class="chart-wrapper"><div class="chart-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="bar-chart" role="img" aria-label="Sample request activity bar chart">${bars}</div></div>`,`<div class="segment"><button data-period="7d" class="${period==='7d'?'active':''}">7 days</button><button data-period="30d" class="${period==='30d'?'active':''}">30 days</button></div>`)}${panel('Service performance','Illustrative processing rates',services.map(([name,n,ic])=>`<div class="service-row"><div class="service-symbol">${icon(ic,17)}</div><div class="service-info"><strong>${name}</strong><div class="service-progress"><span style="width:${n}%"></span></div></div><span class="service-count">${n}%</span></div>`).join(''))}</div>`+
      `<div class="two-column">${panel('Latest applications','Recently submitted demo applications',table([['Reference','id'],['Applicant','name'],['Service','service'],['Status','status',status]],recent,'applications'),`<button class="row-action" data-nav="applications">View all ${icon('arrow',14)}</button>`)}${panel('Activity feed','Actions taken in this browser',state.audit.slice(0,5).map(x=>`<div class="activity-item"><span class="activity-dot">${icon('check',14)}</span><div class="activity-text"><strong>${h(x.action)}</strong><div>${h(x.entity)}</div><span>${h(x.date)}</span></div></div>`).join(''))}</div>`;
  }
  function recordsPage(key,eyebrow,title,description,cols,statuses,create=false){let rows=state[key].filter(match);return head(eyebrow,title,description,`${exportButton(key)} ${create?btn(`${icon('plus',14)} New ${key==='appointments'?'booking':'record'}`,`new:${key}`,'primary'):''}`)+note()+`<section class="panel table-panel"><div class="table-head"><div><h2>${title} register</h2><p>${state[key].length} demo records • ${rows.length} displayed</p></div><span class="badge-demo">SANDBOX DATA</span></div>${filterTool('Search by reference, name or service...',statuses)}${table(cols,rows,key)}<div class="table-footer"><span>Showing <b>${rows.length}</b> of ${state[key].length} records</span><span>Demo data can be modified locally</span></div></section>`;}
  function appointments(){return `<div class="small-cards">${stat('Confirmed',state.appointments.filter(a=>a.status==='Confirmed').length,'Demo appointments')}${stat('Awaiting confirmation',state.appointments.filter(a=>a.status==='Pending').length,'Pending operator review')}${stat('Cancelled',state.appointments.filter(a=>a.status==='Cancelled').length,'Sample cancellations')}</div>`+recordsPage('appointments','BOOKING OPERATIONS','Appointments','Manage test bookings and card-renewal appointments in the demo workspace.',[['Booking ID','id'],['Applicant','name'],['Service','service'],['Centre','centre'],['Date','date',prettyDate],['Time','time'],['Status','status',status]],['Confirmed','Pending','Cancelled'],true);}
  function centres(){const rows=state.centres.filter(match);return head('SERVICE NETWORK','DLTC & available slots','Review demonstration licensing centre capacity and operator availability.',btn(`${icon('plus',14)} Add centre`,'new:centres','primary'))+note()+`<div class="small-cards">${stat('Listed centres',state.centres.length,'All demonstration centres')}${stat('Total daily slots',state.centres.reduce((n,c)=>n+c.total,0),'Illustrative daily capacity')}${stat('Available slots',state.centres.reduce((n,c)=>n+c.total-c.booked,0),'Sample unbooked capacity')}</div><div class="table-tools" style="padding:0 0 17px"><label class="search-field"><span>${icon('search',14)}</span><input class="input" id="localQuery" value="${h(query)}" placeholder="Find a demo centre..." aria-label="Search centres"/></label></div><div class="centre-grid">${rows.map(c=>`<article class="centre-card"><div class="centre-card-top"><span class="service-symbol">${icon('building',20)}</span>${status(c.status)}</div><h3>${h(c.name)}</h3><p>${h(c.city)} · ${h(c.province)}</p><div class="centre-capacity"><strong>${c.total-c.booked} slots available</strong><span>${c.booked}/${c.total} booked</span></div><div class="service-progress"><span style="width:${Math.min(100,c.booked/c.total*100)}%"></span></div><button class="btn" data-open="centres:${h(c.id)}">Manage centre ${icon('chevron',13)}</button></article>`).join('')}</div>`;}
  function reports(){let values=[['Applications',state.applications.length],['Appointments',state.appointments.length],['Renewals',state.renewals.length],['Accident reports',state.accidents.length]];let total=values.reduce((n,a)=>n+a[1],0);return head('ANALYTICS','Reports & analytics','Operational snapshots derived exclusively from fictional local data.',`${exportButton('applications')} ${exportButton('audit')}`)+note()+`<div class="kpi-grid">${kpi('Cases on record',total,'All service categories','file')}${kpi('Completed applications',state.applications.filter(x=>x.status==='Completed').length,'From current local dataset','check')}${kpi('Paid transactions',state.payments.filter(x=>x.status==='Paid').length,'No real financial activity','wallet')}${kpi('Active centres',state.centres.filter(x=>x.status==='Active').length,'Fictional centres','building')}</div><div class="two-column">${panel('Volume by service','Current local records',values.map(([label,n])=>`<div class="report-bar-row"><div><strong>${label}</strong><span>${n} records</span></div><div class="service-progress"><span style="width:${total?Math.round(n/total*100):0}%"></span></div></div>`).join(''))}${panel('Downloadable data','Export synthetic tables in CSV format',`<div class="export-list">${['applications','appointments','renewals','centres','citizens','payments','accidents','audit'].map(x=>`<button data-export="${x}">${icon('file',16)}<span>${cap(x)}.csv</span>${icon('download',15)}</button>`).join('')}</div>`)}</div>`;}
  function team(){return head('ACCESS MANAGEMENT','Team & permissions','Illustrative role-based access matrix, without real authentication.',btn(`${icon('plus',14)} Add demo operator`,'new:team','primary'))+note()+`<div class="two-column">${panel('Demo operators','Local presentation only',table([['Operator','name'],['Role','role'],['Scope','scope'],['Status','status',status]],state.team.filter(match),'team'))}${panel('Role permission matrix','A suggested starting point',`<div class="table-outer"><table class="permission-table"><thead><tr><th>Permission</th><th>Admin</th><th>Reviewer</th><th>Auditor</th></tr></thead><tbody>${[['View records',1,1,1],['Update applications',1,1,0],['Edit centre capacity',1,0,0],['Manage accounts',1,0,0],['Export audit logs',1,0,1]].map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(x=>`<td class="${x?'permission-ok':'permission-no'}">${x?'✓':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)}</div>`;}
  function audit(){return recordsPage('audit','GOVERNANCE','Activity log','Local audit trail of changes made inside this browser.',[['Event','action'],['Record','entity'],['Actor','actor'],['Timestamp','date']],[],false);}
  function settings(){return head('WORKSPACE CONFIGURATION','Settings','Interface preferences for the local demonstration environment.')+note()+`<div class="settings-grid"><section class="setting-card"><h3>Interface preferences</h3><p>Stored in your browser only; changes do not affect any live service.</p>${[['alerts','Enable action notifications'],['compact','Compact data tables'],['weeklyDigest','Weekly digest (UI option only)']].map(([key,label])=>`<label class="toggle-row"><span>${label}</span><input class="switch" type="checkbox" data-setting="${key}" ${state.settings[key]?'checked':''}/></label>`).join('')}</section><section class="setting-card"><h3>Integration readiness</h3><p>External services are intentionally disabled for the UI acceptance phase.</p><div class="info-box"><strong>Google Apps Script</strong><p>Not connected · planned phase 2</p><strong>Google Sheets</strong><p>Not connected · planned phase 2</p><strong>Government/NaTIS databases</strong><p>Not connected · requires authorisation, security review and a documented integration contract</p></div></section><section class="setting-card"><h3>Data reset</h3><p>Clear local edits and restore all fictional demonstration records.</p>${btn(`${icon('refresh',14)} Restore sample dataset`,'reset','danger')}</section><section class="setting-card"><h3>About this concept</h3><p>Unendorsed admin interface concept inspired by the public NaTIS colour palette. For demonstration, evaluation, and implementation planning only.</p><div class="info-box"><strong>Version 1.0.0</strong><p>HTML · CSS · JavaScript · No API keys · No authentication · Offline-friendly after initial load</p></div></section></div>`;}
  const pages={overview,applications:()=>recordsPage('applications','CASE MANAGEMENT','Applications','Review licensing and PrDP application queues.',[['Reference','id'],['Applicant','name'],['Service','service'],['Centre','centre'],['Submitted','date',prettyDate],['Status','status',status]],['Pending','In review','Processing','Completed','Rejected']),appointments,renewals:()=>recordsPage('renewals','VEHICLE LICENSING','Vehicle renewals','Track demo licence renewal requests, processing and fulfilment.',[['Reference','id'],['Vehicle','name'],['Registration','registration'],['Province','province'],['Amount','amount'],['Status','status',status]],['Pending','Paid','Processing','Dispatched','Completed']),centres,citizens:()=>recordsPage('citizens','CITIZEN SERVICES','Citizen profiles','Search fictional accounts. Government IDs are never stored or displayed.',[['Profile','name'],['Synthetic ID','identity'],['Province','province'],['Registered','joined',prettyDate],['Status','status',status]],['Active','Suspended']),payments:()=>recordsPage('payments','TRANSACTION MONITORING','Payments','Illustrative financial records only. No live payment processing.',[['Transaction','id'],['Reference','reference'],['Service','service'],['Amount','amount'],['Date','date',prettyDate],['Status','status',status]],['Paid','Pending','Failed']),accidents:()=>recordsPage('accidents','INCIDENT MANAGEMENT','Accident reports','Triage fictional damage-only incident reports.',[['Report','id'],['Submitter','name'],['Location','location'],['Type','type'],['Submitted','date',prettyDate],['Status','status',status]],['Pending review','In review','Resolved']),reports,team,audit,settings};
  function draw(){
    $('#sideNav').innerHTML=navHtml();$('#breadcrumbCurrent').textContent=routeLabel(page);
    $('#pageContent').innerHTML=(pages[page]||overview)();
    if(state.settings.compact)document.body.classList.add('compact');else document.body.classList.remove('compact');
    $('#headerDate').textContent=new Date().toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'});
  }
  function openDetail(collection,id){const row=state[collection]?.find(x=>x.id===id);if(!row)return toast('Demo record not found.');modal={collection,id};const fields=Object.entries(row).map(([k,v])=>`<div class="detail-row"><span>${h(k.replace(/([A-Z])/g,' $1').replace(/^./,m=>m.toUpperCase()))}</span><strong>${k==='status'?status(v):h(v)}</strong></div>`).join('');
    let statuses={applications:['Pending','In review','Processing','Completed','Rejected'],appointments:['Pending','Confirmed','Cancelled'],renewals:['Pending','Paid','Processing','Dispatched','Completed'],centres:['Active','Reduced hours','Closed'],citizens:['Active','Suspended'],payments:[],accidents:['Pending review','In review','Resolved'],team:['Active','Suspended'],audit:[]}[collection]||[];
    const edit=collection==='appointments'?`<div class="modal-form" style="margin-top:17px">${field('Appointment date','date',row.date,'date')}${field('Time','time',row.time,'time')}</div>`:collection==='centres'?`<div class="modal-form" style="margin-top:17px">${field('Booked slots','booked',row.booked,'number')}${field('Total slots','total',row.total,'number')}</div>`:'';
    const selector=statuses.length?`<div class="form-field" style="margin-top:16px"><label for="newStatus">Update demo status</label><select id="newStatus">${statuses.map(x=>`<option ${x===row.status?'selected':''}>${h(x)}</option>`).join('')}</select></div>`:'';
    $('#modalLayer').innerHTML=`<div class="modal-overlay" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><div class="modal-header"><div><strong id="dialogTitle">${h(id)}</strong><span>${h(cap(collection))} · Fictional record</span></div><button data-close aria-label="Close dialog">×</button></div><div class="modal-body">${fields}${edit}${selector}</div><div class="modal-actions"><button class="btn" data-close>Close</button>${selector||edit?`<button class="btn primary" data-save-detail>Save demo changes</button>`:''}</div></div></div>`;
    $('#modalLayer').querySelector('[data-close]').focus();
  }
  function openCreate(collection){modal={collection,create:true};let inner='';
    if(collection==='appointments')inner=`${field('Applicant name','name','Demo Applicant','text')}${field('Service','service','Learner’s licence test','select','Learner’s licence test|Driving licence test|Card renewal')}${field('Centre','centre','Pretoria DLTC','select',state.centres.map(x=>x.name).join('|'))}${field('Date','date','2026-11-25','date')}${field('Time','time','09:00','time')}<p class="form-help">Creates a fictional appointment in this browser only.</p>`;
    if(collection==='centres')inner=`${field('Centre name','name','Demo DLTC','text')}${field('City','city','Pretoria')}${field('Province','province','Gauteng','select','Gauteng|Limpopo|Mpumalanga|Free State|KwaZulu-Natal|North West|Eastern Cape|Western Cape|Northern Cape')}${field('Daily capacity','total',30,'number')}<p class="form-help">This will not create an official testing centre.</p>`;
    if(collection==='team')inner=`${field('Operator display name','name','Demo Operator')}${field('Role','role','Application reviewer','select','System administrator|Application reviewer|Centre operator|Read-only auditor')}${field('Scope','scope','Gauteng','select','National|Gauteng|Limpopo|Western Cape|Eastern Cape|KwaZulu-Natal')}<p class="form-help">No invitation is emailed. This is a UI-only record.</p>`;
    $('#modalLayer').innerHTML=`<div class="modal-overlay"><form id="createForm" class="modal" role="dialog" aria-modal="true" aria-labelledby="dialogTitle"><div class="modal-header"><div><strong id="dialogTitle">New ${h(collection.slice(0,-1))}</strong><span>Create a synthetic record</span></div><button type="button" data-close aria-label="Close dialog">×</button></div><div class="modal-body"><div class="modal-form">${inner}</div></div><div class="modal-actions"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn primary">Create demo record</button></div></form></div>`;
    $('#createForm input').focus();
  }
  function closeModal(){modal=null;$('#modalLayer').innerHTML='';}
  function saveDetail(){if(!modal||modal.create)return;const row=state[modal.collection].find(x=>x.id===modal.id);if(!row)return;const s=$('#newStatus');if(s)row.status=s.value;
    if(modal.collection==='appointments'){const date=$('#f_date').value,time=$('#f_time').value;if(!date||!time)return toast('Date and time are required.');row.date=date;row.time=time;}
    if(modal.collection==='centres'){let booked=Number($('#f_booked').value),total=Number($('#f_total').value);if(!Number.isInteger(total)||!Number.isInteger(booked)||total<=0||booked<0||booked>total)return toast('Capacity must be positive and booked slots cannot exceed total.');row.total=total;row.booked=booked;}
    log('Updated demo record',row.id);closeModal();draw();toast(`Saved local changes to ${row.id}.`);
  }
  function createRecord(form){const data=Object.fromEntries(new FormData(form));const collection=modal?.collection;if(!['appointments','centres','team'].includes(collection))return;
    const prefix={appointments:'BKG',centres:'CTR',team:'STAFF'}[collection];const id=`${prefix}-DEMO-${String(Date.now()).slice(-6)}`;let row={id,...data,status:collection==='appointments'?'Pending':'Active'};
    if(collection==='centres'){row.booked=0;row.total=Number(data.total);if(!Number.isInteger(row.total)||row.total<1)return toast('Enter a valid daily capacity.');}
    state[collection].unshift(row);log('Created demo record',id);closeModal();draw();toast(`${id} created locally.`);
  }
  function exportCsv(collection){const rows=state[collection];if(!Array.isArray(rows)||!rows.length)return toast('No records to export.');const keys=Object.keys(rows[0]);const cell=v=>{let x=String(v??'');if(/^[\s]*[=+@-]/.test(x))x="'"+x;return `"${x.replace(/"/g,'""')}"`;};const csv=[keys.map(cell).join(','),...rows.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\r\n');const blob=new Blob(['\ufeff',csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`natis-admin-demo-${collection}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`Exported ${rows.length} fictional ${collection} records.`);}
  document.addEventListener('click',e=>{
    const n=e.target.closest('[data-nav]');if(n){navigate(n.dataset.nav);return;}
    const b=e.target.closest('[data-open]');if(b){const [collection,...id]=b.dataset.open.split(':');openDetail(collection,id.join(':'));return;}
    if(e.target.closest('[data-close]')||(e.target.classList.contains('modal-overlay'))){closeModal();return;}
    if(e.target.closest('[data-save-detail]')){saveDetail();return;}
    const exp=e.target.closest('[data-export]');if(exp){exportCsv(exp.dataset.export);return;}
    const p=e.target.closest('[data-period]');if(p){period=p.dataset.period;draw();return;}
    const a=e.target.closest('[data-action]');if(a){const name=a.dataset.action;if(name.startsWith('new:'))openCreate(name.slice(4));if(name==='reset'){if(confirm('Restore all synthetic data and discard your local demo edits?')){state=structuredClone(demo);save();log('Reset demo dataset','System');draw();toast('Demo data restored.');}}return;}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='createForm'){e.preventDefault();createRecord(e.target);}});
  document.addEventListener('input',e=>{if(e.target.id==='localQuery'||e.target.id==='globalSearch'){query=e.target.value;pageIndex=0;const focused=e.target.id;const caret=e.target.selectionStart;draw();const n=$('#'+focused);if(n){n.focus();try{n.setSelectionRange(caret,caret);}catch{}}if(focused==='globalSearch')$('#globalSearch').value=query;}});
  document.addEventListener('change',e=>{if(e.target.id==='statusFilter'){filter=e.target.value;draw();}if(e.target.dataset.setting){state.settings[e.target.dataset.setting]=e.target.checked;save();draw();toast('Preference saved locally.');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(modal)closeModal();else $('#appShell').classList.remove('nav-open');}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus();}});
  $('#menuToggle').addEventListener('click',()=>$('#appShell').classList.add('nav-open'));
  $('#closeSidebar').addEventListener('click',()=>$('#appShell').classList.remove('nav-open'));
  $('#shade').addEventListener('click',()=>$('#appShell').classList.remove('nav-open'));
  $('#notificationsButton').addEventListener('click',()=>toast('No live notifications. This is a demonstration workspace.'));
  window.addEventListener('hashchange',()=>{const id=location.hash.replace(/^#\//,'');if(id!==page)navigate(id);});
  // Expose a tiny deterministic read-only diagnostic for automated UI tests.
  window.__NATIS_DEMO__={getRoute:()=>page,getCounts:()=>({applications:state.applications.length,appointments:state.appointments.length,centres:state.centres.length}),getDemoOnly:()=>true};
  const initial=location.hash.replace(/^#\//,'');page=nav.flatMap(g=>g.items).some(x=>x[0]===initial)?initial:'overview';draw();
})();