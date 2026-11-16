/* Private NaTIS prototype data adapter. No official government API. */
(() => {
  'use strict';
  let client=null, connected=false, loading=false;
  const $ = s=>document.querySelector(s);
  const escape = x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
  const displayDate = x=>x?new Date(x).toLocaleDateString('en-ZA'):'—';
  function visible(){return connected && window.NaTISAuth?.isMaster()===true;}
  function notice(msg,error=false){
    let el=$('#natisDataStatus');
    if(el){el.textContent=msg;el.style.color=error?'#b02d2d':'#325c71';}
  }
  const sourceTables=['natis_clients','natis_applications','natis_appointments','natis_test_results','natis_documents','natis_print_requests'];
  let fetched={};
  async function refresh(){
    if(!visible()||loading)return;
    loading=true;
    try {
      const res=await Promise.all(sourceTables.map(t=>client.from(t).select('*').order('created_at',{ascending:false}).limit(100)));
      for(let i=0;i<res.length;i++){if(res[i].error)throw res[i].error;fetched[sourceTables[i]]=res[i].data??[];}
      const clients=Object.fromEntries((fetched.natis_clients||[]).map(c=>[c.id,c]));
      const appRow=x=>({
        id:x.reference||x.id,name:clients[x.client_id]?.display_name||'—',
        service:(x.service_type||'').replaceAll('_',' '),centre:'—',date:x.created_at?.slice(0,10)||'',
        status:x.status||'—'
      });
      const bookRow=x=>({
        id:x.id,name:clients[x.client_id]?.display_name||'—',service:x.service_type||'—',centre:x.centre_name||'—',
        date:x.starts_at?.slice(0,10)||'',time:x.starts_at?new Date(x.starts_at).toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'}):'—',status:x.status||'—'
      });
      window.__NATIS_UI__?.setData({
        applications:(fetched.natis_applications||[]).map(appRow),
        appointments:(fetched.natis_appointments||[]).map(bookRow),
        citizens:(fetched.natis_clients||[]).map(x=>({id:x.id,name:x.display_name||'—',identity:x.reference||'—',province:'—',joined:x.created_at?.slice(0,10)||'',status:'—'})),
        renewals:[],centres:[],payments:[],accidents:[],team:[],audit:[]
      });
      notice('Private Supabase records refreshed.');
    }catch(e){
      console.error('NaTIS data refresh failed',e);
      notice('Unable to load records. Check approved access and connection.',true);
    }finally{loading=false;}
  }
  function formPanel(title,body){
    return '<section class="panel" style="margin-top:18px"><div class="panel-header"><div><h2 class="panel-title">'+escape(title)+'</h2><p class="panel-subtitle">Private Supabase project · Master-only access</p></div></div><div class="panel-content">'+body+'</div></section>';
  }
  const input=(label,name,type='text',required=true,options='')=>{
    let control=type==='select'
      ?'<select name="'+name+'" class="input" '+(required?'required':'')+'>'+options+'</select>'
      :'<input name="'+name+'" type="'+type+'" class="input" '+(required?'required':'')+' autocomplete="off" />';
    return '<label style="display:flex;flex-direction:column;gap:5px;font-weight:600">'+escape(label)+control+'</label>';
  };
  const options=(xs)=>xs.map(x=>'<option value="'+escape(x[0])+'">'+escape(x[1])+'</option>').join('');
  function clientSelect(){
    const cs=fetched.natis_clients||[];
    if(!cs.length)return '<p>No client records exist yet. Add a client profile before recording a test result or uploading a photo.</p>';
    return input('Client','client_id','select',true,options(cs.map(x=>[x.id,(x.display_name||'Unnamed client')+' · '+(x.reference||x.id.slice(0,8))])));
  }
  function fieldsForm(formId,body,label){
    return '<form id="'+formId+'" class="natis-remote-form" style="display:grid;gap:12px;max-width:520px;padding:18px">'+body+
      '<button class="btn primary" type="submit" style="justify-self:start">'+escape(label)+'</button>'+
      '<p style="font-size:12px;color:#64748b">Changes are written to your private Supabase project, not to official NaTIS systems.</p></form>';
  }
  function listRecords(title,items,render){
    return formPanel(title,items.length?'<div class="table-outer"><table><tbody>'+items.map(render).join('')+'</tbody></table></div>':
      '<p class="empty-state">No records available in the connected project.</p>');
  }
  function decorate(page){
    if(!visible())return;
    const target=$('#pageContent');if(!target)return;
    const cards=[];
    if(page==='citizens'){
      cards.push(formPanel('Register a client profile',fieldsForm('natisCreateClient',
        input('Reference (optional)','reference','text',false)+input('Display name','display_name')+input('Contact email (optional)','contact_email','email',false),'Save client profile')));
      if((fetched.natis_clients||[]).length){
        cards.push(formPanel('Upload client photograph',fieldsForm('natisUploadPhoto',
          clientSelect()+input('Photograph (JPG, PNG, WebP — up to 5 MB)','photo','file'), 'Upload to private storage')));
      }
    }
    if(page==='applications'){
      cards.push(formPanel('New application record',fieldsForm('natisCreateApplication',
        clientSelect()+input('Service type','service_type','select',true,options([
          ['learner_licence',"Learner's licence"],['driving_licence','Driving licence'],
          ['licence_card_renewal','Licence card renewal'],['vehicle_renewal','Vehicle renewal'],
          ['prdp','PrDP'],['other','Other']])),'Create draft application')));
    }
    if(page==='appointments'){
      cards.push(formPanel('New appointment record',fieldsForm('natisCreateAppointment',
        clientSelect()+input('Testing centre','centre_name')+
        input('Service type','service_type','text')+input('Appointment date and time','starts_at','datetime-local'),
        'Create pending appointment')));
    }
    if(page==='reports'){
      cards.push(formPanel('Record test outcome',fieldsForm('natisCreateTest',
        clientSelect()+input('Test type','test_type','select',true,options([
          ['learner_licence',"Learner's licence"],['driving_licence','Driving test'],['other','Other']]))+
        input('Outcome','outcome','select',true,options([['pending','Pending'],['pass','Pass'],['fail','Fail'],['void','Void']])),
        'Save internal test result')));
      cards.push(listRecords('Recorded test results',(fetched.natis_test_results||[]),
        x=>'<tr><td>'+escape((fetched.natis_clients||[]).find(c=>c.id===x.client_id)?.display_name||'—')+'</td><td>'+escape(x.test_type)+'</td><td>'+escape(x.outcome)+'</td><td>'+escape(displayDate(x.created_at))+'</td></tr>'));
      cards.push(formPanel('Printing workflow — demonstration only',fieldsForm('natisPrintRequest',
        clientSelect(), 'Queue watermarked demo request')));
      cards.push(listRecords('Print request queue',(fetched.natis_print_requests||[]),
        x=>'<tr><td>'+escape(x.id.slice(0,8))+'</td><td>'+escape(x.print_type)+'</td><td>'+escape(x.status)+'</td><td>'+escape(displayDate(x.created_at))+'</td></tr>'));
    }
    if(page==='settings'){
      cards.push(formPanel('Master administrator password', fieldsForm('natisChangePassword',
        '<label style="display:flex;flex-direction:column;gap:5px;font-weight:600">New password (12+ characters)<input name="new_password" type="password" autocomplete="new-password" minlength="12" required class="input"></label>'+
        '<label style="display:flex;flex-direction:column;gap:5px;font-weight:600">Confirm new password<input name="confirm_password" type="password" autocomplete="new-password" minlength="12" required class="input"></label>',
        'Set or update password')));
      cards.push(formPanel('Supabase connection', '<p><strong>Connected project:</strong> CHOVHA (repurposed for NaTIS)</p><p><strong>Access:</strong> Verified master-only role using row-level security.</p><p><strong>Storage:</strong> Two private buckets. <strong>Official NaTIS:</strong> Not connected.</p><button class="btn" id="natisRefresh" type="button">Refresh database</button><p id="natisDataStatus" role="status" style="padding-top:12px"></p>'));
    }
    if(cards.length)target.insertAdjacentHTML('beforeend',cards.join(''));
  }
  async function action(table,data){
    if(!visible())return;
    const {error}=await client.from(table).insert(data);
    if(error)throw error;
  }
  document.addEventListener('submit',async e=>{
    const id=e.target.id;
    if(!id.startsWith('natis')||!visible())return;
    e.preventDefault();
    const f=e.target,button=f.querySelector('button[type="submit"]'),d=Object.fromEntries(new FormData(f));
    button.disabled=true;
    try{
      if(id==='natisChangePassword'){
        if(typeof d.new_password!=='string'||d.new_password.length<12 || d.new_password!==d.confirm_password)throw new Error('Passwords must match and contain at least 12 characters.');
        const {error}=await client.auth.updateUser({password:d.new_password});
        if(error)throw error;
        f.reset(); alert('Password updated successfully.'); return;
      }
      if(id==='natisCreateClient')await action('natis_clients',{reference:d.reference||null,display_name:d.display_name,contact_email:d.contact_email||null});
      if(id==='natisCreateApplication')await action('natis_applications',{client_id:d.client_id,service_type:d.service_type,status:'draft'});
      if(id==='natisCreateAppointment')await action('natis_appointments',{client_id:d.client_id,centre_name:d.centre_name,service_type:d.service_type,starts_at:new Date(d.starts_at).toISOString(),status:'pending'});
      if(id==='natisCreateTest')await action('natis_test_results',{client_id:d.client_id,test_type:d.test_type,outcome:d.outcome});
      if(id==='natisPrintRequest')await action('natis_print_requests',{client_id:d.client_id,print_type:'watermarked_demo',status:'draft'});
      if(id==='natisUploadPhoto'){
        const file=d.photo;
        if(!(file instanceof File)||!file.size)throw new Error('Select a photograph.');
        if(file.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP under 5 MB.');
        const path=d.client_id+'/'+crypto.randomUUID()+'.'+(file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg');
        const up=await client.storage.from('natis-client-photos').upload(path,file,{contentType:file.type,upsert:false});
        if(up.error)throw up.error;
        try{await action('natis_documents',{client_id:d.client_id,document_type:'client_photo',bucket_id:'natis-client-photos',object_path:path});}
        catch(error){await client.storage.from('natis-client-photos').remove([path]);throw error;}
      }
      await refresh();
    }catch(e){alert('Operation unsuccessful: '+(e.message||'Please check your data and permissions.'));}
    finally{button.disabled=false;}
  });
  document.addEventListener('click',e=>{if(e.target.closest('#natisRefresh'))refresh();});
  window.NaTISData={
    isConnected:()=>visible(),
    decorate,
    start:async supabase=>{
      client=supabase;connected=true;await refresh();
    },
    clear:()=>{
      connected=false;fetched={};
      window.__NATIS_UI__?.setData(Object.fromEntries(['applications','appointments','renewals','centres','citizens','payments','accidents','team','audit'].map(x=>[x,[]])));
    },
    refresh
  };
})();