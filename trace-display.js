/* TRACE artwork availability controller, public manifest + museum administrator LOCAL DRAFT.
   A GitHub Pages static app cannot authenticate editors or publish to all browsers.
   Published display-status.json is the shared source of truth. Draft toggles override
   it on the CURRENT BROWSER only; curators export and deploy JSON to publish. */
(function(){
'use strict';
const URL='https://raw.githubusercontent.com/jamesBenja/trace-museum-demo/main/display-status.json',STORE='trace-display-admin-draft-v1';
const ORIGINAL=['mmfa-marrel','mmfa-witte','mmfa-fortin','pamm-masks','pamm-delano','pamm-grid'];
let published={schemaVersion:1,mode:'independent-pitch-demo',updatedAt:'',works:{}};
let draft=null,loading=true,error='',syncError='',publishStatus='',publishing=false,lastSync=0;
const admin=()=>window.TRACE_AUTH?.isAdmin()===true;
const h=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sourceWorks=()=>[...mmfa,...pamm];
const validWork=id=>sourceWorks().some(a=>a.id===id);
const defaultRec=id=>({active:ORIGINAL.includes(id),onViewVerified:false,room:'',startDate:'',endDate:'',note:''});
function clean(input){
 const rows={};
 for(const a of sourceWorks()){
  const r=input&&typeof input==='object'&&input.works?.[a.id]||{};
  rows[a.id]={
   active:typeof r.active==='boolean'?r.active:defaultRec(a.id).active,
   onViewVerified:r.onViewVerified===true,
   room:String(r.room||'').slice(0,100),
   startDate:/^\d{4}-\d{2}-\d{2}$/.test(r.startDate||'')?r.startDate:'',
   endDate:/^\d{4}-\d{2}-\d{2}$/.test(r.endDate||'')?r.endDate:'',
   note:String(r.note||'').slice(0,500)
  };
 }
 const rooms={mmfa:[],pamm:[]},connections={mmfa:[],pamm:[]};
 for(const museum of ['mmfa','pamm']){
  const incoming=Array.isArray(input?.rooms?.[museum])?input.rooms[museum]:[];
  const ids=new Set();
  for(const item of incoming.slice(0,120)){
   const id=String(item?.id||'').trim().slice(0,64);
   const label=String(item?.label||'').trim().slice(0,100);
   if(!/^[a-zA-Z0-9_-]+$/.test(id)||!label||ids.has(id))continue;
   ids.add(id);
   rooms[museum].push({id,label,wing:String(item.wing||'').slice(0,100),floor:String(item.floor||'').slice(0,50)});
  }
  const known=new Set(rooms[museum].map(x=>x.id));
  const unique=new Set();
  for(const x of (Array.isArray(input?.connections?.[museum])?input.connections[museum]:[]).slice(0,250)){
   const from=String(x?.from||''),to=String(x?.to||'');
   if(!known.has(from)||!known.has(to)||from===to)continue;
   const key=[from,to].sort().join('~');
   if(unique.has(key))continue;
   unique.add(key);connections[museum].push({from,to,type:['corridor','elevator','stairs','outdoor'].includes(x.type)?x.type:'corridor'});
  }
 }
 return {schemaVersion:1,rooms,connections,mode:'independent-pitch-demo',updatedAt:String(input?.updatedAt||'')||new Date().toISOString(),description:'Active means included in the demo route; onViewVerified must be confirmed by museum staff. Each activation requires rights, safety and installation checks.',works:rows};
}
published=clean(published);
try{const x=JSON.parse(localStorage.getItem(STORE)||'null');if(x&&x.schemaVersion===1)draft=clean(x)}catch(e){}
function manifest(){return admin()&&draft?draft:published}
function rec(id){return manifest().works[id]||defaultRec(id)}
function today(venue){
 const tz=venue==='pamm'?'America/New_York':'America/Toronto';
 try{const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=x=>parts.find(p=>p.type===x)?.value||'';
  return [get('year'),get('month'),get('day')].join('-');
 }catch(e){return new Date().toISOString().slice(0,10)}
}
function isActive(id){
 if(!validWork(id)||loading||syncError)return false;
 const r=rec(id),venue=id.startsWith('pamm-')?'pamm':'mmfa',date=today(venue);
 return !!(r.active&&(!r.startDate||date>=r.startDate)&&(!r.endDate||date<=r.endDate));
}
function activeWorks(venue){return (venue==='pamm'?pamm:mmfa).filter(a=>isActive(a.id))}
function isVerified(id){return rec(id).onViewVerified===true}
function room(id){return rec(id).room||''}
function isDraft(){return draft!==null}
function renderApp(){if(typeof window.__traceAppRender==='function')window.__traceAppRender()}
function afterUpdate(){
 const a=A[state.current];
 if(state.tab==='quest'&&a&&!isActive(a.id)&&!['intro','hub','bonus'].includes(state.stage)){
  state.stage='hub';save();
 }
 if(state.tab==='quest'&&state.stage==='bonus'&&activeWorks(state.venue).filter(a=>state.found.includes(a.id)).length<2){
  state.stage='hub';save();
 }
 renderApp();
 if(typeof window.TRACE_LOAD_ACTIVE==='function')Promise.resolve().then(()=>window.TRACE_LOAD_ACTIVE()).catch(e=>console.error('Matcher refresh failed:',e));
}
function setDraft(){if(!admin())throw Error('Administrator sign-in required');if(!draft)draft=clean(published);return draft}
function setField(id,field,value){
 if(!admin()||!validWork(id)||!['active','onViewVerified','room','startDate','endDate'].includes(field))return;
 const x=setDraft(),r=x.works[id];
 if(field==='active'||field==='onViewVerified')r[field]=!!value;
 else if(field==='room')r.room=String(value).slice(0,100);
 else r[field]=/^\d{4}-\d{2}-\d{2}$/.test(value)?value:'';
 // Do not permit an inverted window. A publishable file cannot have impossible dates.
 if(r.startDate&&r.endDate&&r.startDate>r.endDate)r.endDate='';
 x.updatedAt=new Date().toISOString();
 try{localStorage.setItem(STORE,JSON.stringify(x))}catch(e){error='Browser storage unavailable. Export the configuration before closing.'}
 afterUpdate();
}
function rooms(venue){return (manifest().rooms?.[venue]||[]).map(x=>({...x}))}
function connections(venue){return (manifest().connections?.[venue]||[]).map(x=>({...x}))}
function alterRooms(venue,operation,data){
 if(!admin()||!['mmfa','pamm'].includes(venue))return false;
 const x=setDraft();
 if(operation==='add'){
  const label=String(data?.label||'').trim().slice(0,100),floor=String(data?.floor||'').trim().slice(0,50),wing=String(data?.wing||'').trim().slice(0,100);
  if(!label)return false;
  const id='r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  x.rooms[venue].push({id,label,wing,floor});
 }
 if(operation==='remove'){
  const id=String(data?.id||'');
  x.rooms[venue]=x.rooms[venue].filter(v=>v.id!==id);
  x.connections[venue]=x.connections[venue].filter(v=>v.from!==id&&v.to!==id);
  for(const a of sourceWorks())if(a.id.startsWith(venue+'-')&&x.works[a.id].room===id)x.works[a.id].room='';
 }
 if(operation==='connect'){
  const from=String(data?.from||''),to=String(data?.to||'');
  if(from===to||!x.rooms[venue].some(v=>v.id===from)||!x.rooms[venue].some(v=>v.id===to))return false;
  if(!x.connections[venue].some(v=>v.from===from&&v.to===to||v.from===to&&v.to===from))x.connections[venue].push({from,to,type:['corridor','elevator','stairs','outdoor'].includes(data?.type)?data.type:'corridor'});
 }
 if(operation==='disconnect'){
  const from=String(data?.from||''),to=String(data?.to||'');
  x.connections[venue]=x.connections[venue].filter(v=>!(v.from===from&&v.to===to||v.from===to&&v.to===from));
 }
 x.updatedAt=new Date().toISOString();
 try{localStorage.setItem(STORE,JSON.stringify(x))}catch(e){}
 afterUpdate();return true;
}
function count(venue){return activeWorks(venue).length}
function statusLabel(id){
 const r=rec(id);
 if(!r.active)return 'Off the route';
 if(!isActive(id))return 'Scheduled / outside date window';
 return r.onViewVerified?'In route · on-display staff confirmation entered':'In demo route · display unverified';
}
function adminUI(){
 if(!admin())return '<div class="td-screen"><h2>Administrator sign-in required</h2></div>';
 const venue=state.venue,arts=venue==='pamm'?pamm:mmfa;
 const rows=arts.map(a=>{
  const r=rec(a.id),enabled=isActive(a.id),verified=r.onViewVerified;
  return '<article class="td-art '+(enabled?'td-active':'td-inactive')+'" data-td-row="'+a.id+'">'+
  '<div class="td-art-head"><div><h3>'+h(a.artist)+'</h3><p>'+h(a.name)+'</p><small>'+h(a.medium)+' · '+h(a.kind||'painting / image')+'</small></div>'+
  '<label class="td-switch-wrap"><input type="checkbox" role="switch" aria-label="Include '+h(a.name)+' in the visitor route" data-td-active="'+a.id+'" '+(r.active?'checked':'')+'><span>'+ (r.active?'IN ROUTE':'OFF ROUTE') +'</span></label></div>'+
  '<div class="td-current-status">'+(enabled?'●':'○')+' '+h(statusLabel(a.id))+'</div>'+
  '<label class="td-confirm"><input type="checkbox" data-td-verified="'+a.id+'" '+(verified?'checked':'')+'> Museum has confirmed this artwork is physically on display</label>'+
  '<div class="td-fields"><label>Gallery / room <select data-td-room="'+a.id+'"><option value="">Not assigned</option>'+rooms(venue).map(x=>'<option value="'+h(x.id)+'" '+(x.id===r.room?'selected':'')+'>'+h(x.label)+(x.floor?' · '+h(x.floor):'')+'</option>').join('')+'</select></label>'+
  '<label>Show from<input type="date" data-td-start="'+a.id+'" value="'+h(r.startDate)+'"></label>'+
  '<label>Show through<input type="date" data-td-end="'+a.id+'" value="'+h(r.endDate)+'"></label></div>'+
  '<p class="td-origin">Collection record: <a href="'+h(a.url)+'" target="_blank" rel="noopener noreferrer">View source ↗</a> · '+(a.previewOnly?'New candidate':'Original demo work')+'</p></article>';
 }).join('');
 return '<div class="td-screen"><div class="t1-overline">TRACE · MUSEUM ADMINISTRATOR PREVIEW</div><h2>Manage works on display</h2>'+
 '<p class="td-intro">Your live game can include up to eight collection works per museum. Turn individual works on or off, enter confirmed rooms, and schedule display windows. A work that is off the route disappears from playable quests and scan recognition, but earlier discoveries remain in the visitor passport.</p>'+
 (window.TRACE_AUTH?.adminControls()||'')+
 '<div class="td-kpis"><div><b>'+count(venue)+' / '+arts.length+'</b><span>Playable in this preview</span></div><div><b>'+arts.filter(a=>isActive(a.id)&&isVerified(a.id)).length+'</b><span>Marked display-confirmed</span></div></div>'+
 '<div class="td-mode '+(draft?'td-draft':'')+'">'+(draft?'<strong>UNPUBLISHED ADMIN DRAFT</strong><p>Your edits are visible only in this administrator preview until you select Publish changes for all visitors.</p>':
 '<strong>SHARED PUBLISHED CATALOGUE</strong><p>Visitors are reading this same public catalogue. Last publication: '+h(published.updatedAt)+'</p>')+'</div>'+
 '<div class="td-caution">Museum staff must confirm current artwork installations and gallery room locations before marking them verified. TRACE is an independent prototype, not an official museum display listing.</div>'+
 (window.TRACE_ROUTING?.adminUI(venue)||'')+
 '<div class="td-work-head"><h3>'+h(venue==='mmfa'?'MMFA · Montréal':'PAMM · Miami')+' artworks</h3><p>Toggle immediately to preview what visitors would see on this device.</p></div>'+
 '<div class="td-work-list">'+rows+'</div>'+
 '<div class="td-publish"><h3>Publish changes to every visitor</h3><p>Publish commits all artwork, on-display, room and route settings to the shared GitHub repository. Every visitor uses the same public catalogue and refreshes automatically while the app is open.</p>'+
 '<div class="td-publish-actions"><button class="button" type="button" data-td-publish '+(!draft||publishing?'disabled':'')+'>'+(publishing?'Publishing to GitHub…':draft?'✓ Publish changes for all visitors':'Everything published')+'</button>'+
 '<button class="button outline" type="button" data-td-export>Download JSON backup</button>'+
 '<button class="button ghost" type="button" data-td-reset>Discard unpublished draft</button></div>'+
 '<p class="td-small" role="status" aria-live="polite">'+h(publishStatus||error||(draft?'Unpublished changes on this device. Visitors cannot see them yet.':'Last shared publication: '+published.updatedAt))+'</p></div>'+
 '<button class="button ghost" data-action="quest">← Back to visitor adventure</button></div>';
}
function visitorNotice(id){
 const r=rec(id);
 if(isActive(id)&&!r.onViewVerified)return '<div class="td-visitor-notice">DEMO WORK: Museum staff have not yet confirmed that this artwork is on public display. Use collection images to test recognition; do not rely on this as an onsite route.</div>';
 if(isActive(id))return '<div class="td-visitor-confirmed">Museum-curated route: '+h(r.room?'Assigned room: '+(rooms(id.startsWith('pamm-')?'pamm':'mmfa').find(x=>x.id===r.room)?.label||'Unlabelled room'):'Room confirmation pending')+'.</div>';
 return '<div class="td-visitor-notice">This artwork is not currently available in the visitor adventure.</div>';
}
async function load(){
 if(!lastSync)loading=true;
 try{
  const r=await fetch(URL+'?t='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw Error('GitHub shared catalogue HTTP '+r.status);
  const incoming=clean(await r.json());
  if(!draft||!admin())published=incoming;
  syncError='';lastSync=Date.now();error='';
 }catch(e){
  try{
   const r=await fetch('display-status.json?t='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw Error('HTTP '+r.status);
   const incoming=clean(await r.json());
   if(!draft||!admin())published=incoming;
   syncError='';lastSync=Date.now();
   error='Shared GitHub refresh unavailable. Showing a published Pages copy that may lag updates.';
  }catch(err){
   syncError='Cannot load the shared museum catalogue; no artwork availability can be confirmed.';
   error=syncError;console.warn(syncError,e,err);
  }
 }finally{loading=false;afterUpdate()}
}
async function publish(){
 if(!admin()){publishStatus='Administrator sign-in required';renderApp();return false}
 if(!draft||publishing)return false;
 publishing=true;publishStatus='Checking the latest shared catalogue…';renderApp();
 try{
  const latest=await window.TRACE_AUTH.getFile();
  const remote=clean(JSON.parse(latest.content));
  for(const key of ['works','rooms','connections']){
   if(JSON.stringify(remote[key])!==JSON.stringify(published[key])){
    throw Error('Another curator updated the catalogue. Back up this draft, discard it, and refresh before trying again.');
   }
  }
  const toSave=clean(draft);
  toSave.updatedAt=new Date().toISOString();
  publishStatus='Publishing to GitHub…';renderApp();
  await window.TRACE_AUTH.publishFile(JSON.stringify(toSave,null,2)+'\n',latest.sha);
  published=toSave;draft=null;syncError='';error='';
  try{localStorage.removeItem(STORE)}catch(err){}
  lastSync=Date.now();
  publishStatus='✓ Published to the shared GitHub catalogue. Visitor tabs refresh automatically, though global CDN propagation can take a short time.';
  return true;
 }catch(err){
  publishStatus='Publication FAILED: '+String(err.message||err)+'. Your draft is preserved; visitor data was not changed.';
  return false;
 }finally{publishing=false;afterUpdate()}
}

function exportJSON(){
 const out={...clean(manifest()),updatedAt:new Date().toISOString()};
 return JSON.stringify(out,null,2)+'\n';
}
function download(){
 const blob=new Blob([exportJSON()],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.download='display-status.json';a.href=url;
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
document.addEventListener('change',ev=>{
 const el=ev.target,ids=['td-active','td-verified','td-room','td-start','td-end'];
 for(const f of ids)if(el.hasAttribute('data-'+f)){
  const field={'td-active':'active','td-verified':'onViewVerified','td-room':'room','td-start':'startDate','td-end':'endDate'}[f];
  const view=document.getElementById('view'),previous=view?.scrollTop||0;
  setField(el.getAttribute('data-'+f),field,f==='td-active'||f==='td-verified'?el.checked:el.value);
  if(view)view.scrollTop=previous;
  return;
 }
});
document.addEventListener('click',ev=>{
 const button=ev.target.closest('[data-td-publish],[data-td-export],[data-td-copy],[data-td-reset]');
 if(!button)return;
 if(button.tagName==='A'&&button.dataset.tdExport!==undefined)return;
 ev.stopImmediatePropagation();ev.preventDefault();
 if(button.dataset.tdPublish!==undefined){publish();return}
 if(button.dataset.tdExport!==undefined){download();return}
 if(button.dataset.tdCopy!==undefined){
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(exportJSON()).then(()=>{button.textContent='✓ Copied JSON'}).catch(()=>{button.textContent='Use Download JSON instead'});
  else button.textContent='Use Download JSON instead';
  return;
 }
 if(button.dataset.tdReset!==undefined){
  if(draft&&!confirm('Discard these unpublished changes? The shared visitor catalogue will not be changed.'))return;
  draft=null;error='';
  try{localStorage.removeItem(STORE)}catch(e){}
  afterUpdate();
 }
},true);
window.TRACE_DISPLAY={isActive,activeWorks,count,isVerified,room,rooms,connections,alterRooms,rec,adminUI,visitorNotice,setField,statusLabel,load,publish,exportJSON,get draft(){return draft},get published(){return published},get loading(){return loading},get error(){return error},get syncError(){return syncError},get publishing(){return publishing}};
load();
setInterval(()=>{if(!draft&&!document.hidden&&Date.now()-lastSync>45000)load()},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!draft&&Date.now()-lastSync>30000)load()});
})();