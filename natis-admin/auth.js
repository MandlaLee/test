/* NaTIS independent admin prototype — Supabase master-only login. */
(() => {
 'use strict';
 const projectUrl = 'https://cinpqzwltwmuzqjpazju.supabase.co';
 const publishableKey = 'sb_publishable_2QJbiuQOSsrayG7LdpFsPg_hQbhN9A3';
 const $ = (s) => document.querySelector(s);
 const lock = () => document.body.classList.add('auth-locked');
 const unlock = () => document.body.classList.remove('auth-locked');
 let client, checking = false, authorized = false;
 let form = $('#masterLoginForm'), status = $('#masterLoginStatus'), submit = $('#masterSignIn');
 function message(s, error=false){ status.textContent=s; status.style.color=error?'#a62626':'#375577'; }
 function showLogin(){ lock(); $('#masterLoginPanel').hidden=false; $('#masterSignIn').disabled=false; }
 function showAdmin(){ authorized=true; $('#masterLoginPanel').hidden=true; unlock(); const b=$('#loginPreviewButton'); if(b)b.textContent='SIGN OUT'; window.NaTISData?.start(client); }
 async function checkAccess(){
   if(checking)return;
   checking=true;
   try{
     const {data:{user},error} = await client.auth.getUser();
     if(error || !user){ authorized=false; showLogin(); message('Sign in with your authorised administrator account.'); return; }
     const {data:master,error:accessError} = await client.rpc('natis_is_master');
     if(accessError || master!==true){
       authorized=false; await client.auth.signOut(); showLogin();
       message('This account is not approved as the master administrator.',true);
       return;
     }
     showAdmin();
   }catch(e){ authorized=false; showLogin(); message('Could not verify administrator access. Check your connection.',true); }
   finally{checking=false;}
 }
 async function start(){
   lock();
   if(!window.supabase || !window.supabase.createClient){
     showLogin(); message('Authentication library did not load. Check your internet connection.',true); return;
   }
   client=window.supabase.createClient(projectUrl,publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   window.NaTISAuth={client,isMaster:()=>authorized,signOut:async()=>{await client.auth.signOut();authorized=false;window.NaTISData?.clear();showLogin();message('Signed out.');}};
   form.addEventListener('submit',async(e)=>{
     e.preventDefault(); submit.disabled=true; message('Verifying credentials…');
     try{
       const email=$('#masterEmail').value.trim(); const password=$('#masterPassword').value;
       const {error}=await client.auth.signInWithPassword({email,password});
       $('#masterPassword').value='';
       if(error){message('Incorrect credentials or account not available.',true);return;}
       await checkAccess();
     }catch(e){message('Unable to sign in. Please retry.',true);}
     finally{submit.disabled=false;}
   });

   const linkButton=$('#masterSendLink');
   if(linkButton){
     linkButton.addEventListener('click',async()=>{
       const email=$('#masterEmail').value.trim();
       if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
         message('Enter the administrator email address first.',true); return;
       }
       if(location.protocol!=='https:'){
         message('Email sign-in links require an approved HTTPS deployment. Use password sign-in or deploy the site first.',true);return;
       }
       linkButton.disabled=true;
       message('Requesting a secure email link…');
       try {
         const {error}=await client.auth.signInWithOtp({
           email,
           options:{
             shouldCreateUser:false,
             emailRedirectTo:location.origin+location.pathname
           }
         });
         if(error)throw error;
         message('If this address already has an account, a one-time sign-in link has been sent. Check your inbox.');
       }catch(e){
         message('Unable to send the link. Check the account, allowed redirect URL and email configuration.',true);
       }finally{linkButton.disabled=false;}
     });
   }
   const button=$('#loginPreviewButton');
   if(button){button.addEventListener('click',async(e)=>{
     e.stopImmediatePropagation();
     if(authorized)await window.NaTISAuth.signOut();
     else{$('#masterEmail').focus();window.scrollTo({top:0,behavior:'smooth'});}
   },true);}
   client.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){authorized=false;window.NaTISData?.clear();showLogin();} if(event==='SIGNED_IN'&&!authorized){setTimeout(()=>{if(!checking)checkAccess();},0);}});
   await checkAccess();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();