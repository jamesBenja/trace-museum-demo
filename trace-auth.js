/* TRACE v1.7 portal access using GitHub's own repository authentication.
   Never store, log or transmit the fine-grained token outside api.github.com. */
(function(){
'use strict';
const API='https://api.github.com';
const FILE=API+'/repos/jamesBenja/trace-museum-demo/contents/display-status.json';
const portal=new URLSearchParams(location.search).get('portal')==='admin'?'admin':'visitor';
let token='',account='',busy=false;
const h=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function isAdmin(){return portal==='admin'&&!!token}
function headers(){
 const result={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
 if(token)result.Authorization='Bearer '+token;
 return result;
}
async function api(url,options={}){
 if(!isAdmin())throw Error('Administrator authentication required');
 const response=await fetch(url,{...options,headers:{...headers(),...(options.headers||{})},cache:'no-store'});
 const data=await response.json().catch(()=>({}));
 if(!response.ok){const err=new Error(data.message||'GitHub API returned '+response.status);err.status=response.status;throw err}
 return data;
}
function decodeBase64(content){
 const binary=atob(String(content||'').replace(/\s+/g,''));
 const bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 return new TextDecoder().decode(bytes);
}
function encodeBase64(str){
 const bytes=new TextEncoder().encode(str);
 let result='';
 for(let i=0;i<bytes.length;i+=4096)result+=String.fromCharCode(...bytes.subarray(i,i+4096));
 return btoa(result);
}
async function getFile(){
 const data=await api(FILE+'?ref=main&t='+Date.now());
 return {sha:data.sha,content:decodeBase64(data.content)};
}
async function publishFile(contents,sha){
 if(!isAdmin())throw Error('Administrator authentication required');
 if(typeof contents!=='string'||contents.length>180000)throw Error('Invalid configuration size');
 if(!sha)throw Error('Missing current source revision');
 return api(FILE,{method:'PUT',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({message:'TRACE admin: publish museum display and room assignments',
   content:encodeBase64(contents),branch:'main',sha})});
}
function gate(){
 return '<div class="ta-mask" role="dialog" aria-modal="true" aria-labelledby="traceAdminTitle"><div class="ta-gate">'+
 '<div class="ta-brand">TRACE<span>.</span> / MUSEUM ADMIN</div><h1 id="traceAdminTitle">Manage what visitors see.</h1>'+
 '<p>Sign in using a <strong>GitHub fine-grained access token</strong> for the TRACE museum repository. Only collaborators with Contents: Read and write can publish changes.</p>'+
 '<div class="ta-language-picker" role="group" aria-label="App language"><span>LANGUAGE</span><button type="button" data-trace-lang="en">EN</button><button type="button" data-trace-lang="fr">FR</button><button type="button" data-trace-lang="es">ES</button></div>'+
 '<form id="traceAdminLogin" autocomplete="off"><label for="traceAdminToken">GitHub access token</label>'+
 '<input id="traceAdminToken" type="password" autocomplete="off" spellcheck="false" required placeholder="github_pat_…" />'+
 '<button id="traceAdminSubmit" type="submit">Sign in to museum administration</button></form>'+
 '<p id="traceAdminFeedback" role="status" aria-live="polite"></p>'+
 '<div class="ta-guide"><strong>First-time setup</strong><p>On GitHub, create a fine-grained personal access token limited to <code>jamesBenja/trace-museum-demo</code> with <strong>Contents: Read and write</strong>, then set an expiration date. Your GitHub account also needs repository write access.</p>'+
 '<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">Create a repository-limited token on GitHub ↗</a></div>'+
 '<p class="ta-note">The token stays in this browser tab’s memory and is sent only to GitHub. Refreshing or closing the page signs you out. TRACE does not save your token.</p>'+
 '<a class="ta-visitor-link" href="./visit.html">Explore as a visitor ↗</a></div></div>';
}
function showLogin(){
 const old=document.getElementById('traceAuthMount');if(old)old.remove();
 const wrapper=document.createElement('div');wrapper.id='traceAuthMount';wrapper.innerHTML=gate();
 document.body.appendChild(wrapper);
 document.body.classList.add('admin-locked');
 wrapper.querySelector('#traceAdminLogin').addEventListener('submit',onLogin);
}
async function onLogin(ev){
 ev.preventDefault();if(busy)return;
 const input=document.getElementById('traceAdminToken'),candidate=input?.value.trim()||'';
 const msg=document.getElementById('traceAdminFeedback');
 if(!candidate){msg.textContent='Please enter a GitHub token.';return}
 busy=true;document.getElementById('traceAdminSubmit').disabled=true;
 msg.textContent='Checking access with GitHub…';
 try{
  const h={'Accept':'application/vnd.github+json','Authorization':'Bearer '+candidate,'X-GitHub-Api-Version':'2022-11-28'};
  const r=await fetch(API+'/user',{headers:h,cache:'no-store'});
  if(!r.ok)throw Error('GitHub rejected this token. Check its expiration and access.');
  const who=await r.json();
  const file=await fetch(FILE+'?ref=main',{headers:h,cache:'no-store'});
  if(!file.ok)throw Error('Token cannot read the TRACE repository. Select this repository when creating it.');
  token=candidate;account=String(who.login||'GitHub administrator');input.value='';
  document.getElementById('traceAuthMount')?.remove();
  document.body.classList.remove('admin-locked');document.body.classList.add('admin-mode');
  document.querySelector('[data-tab="museum"]')?.removeAttribute('hidden');
  await window.TRACE_DISPLAY?.load();
  if(typeof window.tab==='function')window.tab('museum');
  else {state.tab='museum';window.__traceAppRender?.()}
 }catch(err){token='';msg.textContent='Sign-in failed: '+String(err.message||err)}
 finally{busy=false;const button=document.getElementById('traceAdminSubmit');if(button)button.disabled=false}
}
function logout(){
 token='';account='';
 document.body.classList.remove('admin-mode');
 document.querySelector('[data-tab="museum"]')?.setAttribute('hidden','');
 if(typeof window.tab==='function')window.tab('quest');
 showLogin();
}
function adminControls(){
 if(!isAdmin())return '';
 return '<div class="ta-signed"><div><b>✓ Signed in as '+h(account)+'</b><small>Authorized via GitHub · edit locally, then publish</small></div>'+
 '<button type="button" data-trace-logout>Sign out</button><a href="./visit.html" target="_blank" rel="noopener noreferrer">Visitor preview ↗</a></div>';
}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-trace-logout]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();logout()},true);
window.TRACE_AUTH={portal,isAdmin,adminControls,getFile,publishFile};
document.body.dataset.tracePortal=portal;
if(portal==='admin')showLogin();
else document.querySelector('[data-tab="museum"]')?.setAttribute('hidden','');
})();