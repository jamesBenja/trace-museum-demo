/* TRACE navigator v3.1, source-graded connected visit planner.
   Exact turns and walking times are never inferred: connections must be entered by staff.
   Routes and preferences are saved on this device only. */
(function(){
'use strict';
const STORE='trace-route-plan-v1',S={museum:null,mode:'quick',selected:[],focus:null,start:'entrance',expanded:false,stepFree:true};
const MAPS={
 mmfa:{url:'https://www.mbam.qc.ca/en/mmfa-museum-map/',title:'MMFA official museum map (2026)',entrance:'Main entrance, Jean-Noël Desmarais Pavilion, level 1',startRoom:'mmfa-entrance',description:'Five connected pavilions and an outdoor sculpture garden'},
 pamm:{url:'https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf',title:'PAMM visitor floor plan (2025)',entrance:'Visitor Services Center 1, Floor 1',startRoom:'pamm-1',description:'Numbered first-floor galleries and second-floor galleries'},
 moma:{url:'https://www.moma.org/visit/guide/map',title:'MoMA official visitor map',entrance:'53rd Street main entrance, Rockefeller Building',startRoom:'moma-entry',description:'Midtown Manhattan museum with galleries across several floors and a sculpture garden'}
};
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let stored={};
try{stored=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(e){}
function display(){return window.TRACE_DISPLAY}
function catalog(){return A.filter(a=>display()?.isActive(a.id)??true)}
function room(id){return display()?.rooms(state.venue).find(x=>x.id===id)||null}
function artworkRoom(a){return room(display()?.rec(a.id)?.room)}
function found(a){return state.found.includes(a.id)}
function touch(){
 const m=state.venue;
 if(S.museum===m)return;
 S.museum=m;const prev=stored[m]||{};
 S.mode=['quick','all','custom'].includes(prev.mode)?prev.mode:'quick';
 S.selected=Array.isArray(prev.selected)?prev.selected.filter(id=>catalog().some(a=>a.id===id)):[];
 S.focus=prev.focus||null;
 S.expanded=!!prev.expanded;
 S.stepFree=prev.stepFree!==false;
 S.start=typeof prev.start==='string'&&room(prev.start)?prev.start:MAPS[m].startRoom;
}
function saveRoute(){stored[state.venue]={mode:S.mode,selected:S.selected.slice(),focus:S.focus,expanded:S.expanded,stepFree:S.stepFree,start:S.start};
 try{localStorage.setItem(STORE,JSON.stringify(stored))}catch(e){}
}
function routeWorks(){
 touch();
 const active=catalog();
 if(S.mode==='all')return active;
 if(S.mode==='quick')return active.filter(a=>!found(a)).concat(active.filter(found)).slice(0,3);
 return active.filter(a=>S.selected.includes(a.id));
}
function edges(){return display()?.connections(state.venue)||[]}
// Approved links produce visitor directions. Research links can only appear as a labelled preview.
function route(from,to,preview=false){
 if(!from||!to)return null;
 const rooms=display()?.rooms(state.venue)||[],known=new Set(rooms.map(r=>r.id));
 if(!known.has(from)||!known.has(to))return null;
 if(from===to)return {rooms:[from],edges:[],cost:0,research:false};
 const graph=new Map([...known].map(id=>[id,[]]));
 for(const edge of edges()){
  if(edge.closed||(!preview&&edge.status==='research')||(S.stepFree&&edge.type==='stairs'))continue;
  if(!known.has(edge.from)||!known.has(edge.to))continue;
  const raw=Math.max(.25,Number(edge.cost)||1);
  const cost=raw+(edge.type==='elevator'?2:0)+(edge.type==='stairs'?1:0);
  graph.get(edge.from).push({to:edge.to,edge,cost});
  graph.get(edge.to).push({to:edge.from,edge,cost});
 }
 const dist=new Map([[from,0]]),parent=new Map(),visited=new Set();
 while(true){
  let current=null,best=Infinity;
  for(const [id,value] of dist)if(!visited.has(id)&&value<best){current=id;best=value}
  if(current===null)break;
  if(current===to)break;
  visited.add(current);
  for(const option of graph.get(current)||[]){
   const alt=best+option.cost;
   if(alt<(dist.get(option.to)??Infinity)){dist.set(option.to,alt);parent.set(option.to,{id:current,edge:option.edge})}
  }
 }
 if(!dist.has(to))return null;
 const order=[to],segments=[];
 while(order[0]!==from){
  const step=parent.get(order[0]);if(!step)return null;
  order.unshift(step.id);segments.unshift(step.edge);
 }
 return {rooms:order,edges:segments,cost:dist.get(to),research:segments.some(e=>e.status==='research')};
}
function path(from,to,preview=false){return route(from,to,preview)?.rooms||null}
function floorValue(s){
 const m=/^(?:S(\d+)|(-?\d+)|Outdoor)$/i.exec(s||'');
 if(!m)return 200;
 if(m[1])return -Number(m[1]);
 if(m[2])return Number(m[2]);
 return 100;
}
function plannedOrder(){
 const items=routeWorks(),mapped=items.filter(a=>artworkRoom(a)),unmapped=items.filter(a=>!artworkRoom(a));
 if(!mapped.length)return {ordered:unmapped,optimised:false,provisional:false};
 const start=S.start||MAPS[state.venue].startRoom;
 const allApproved=mapped.every(a=>!!route(start,artworkRoom(a).id));
 const allPreview=!allApproved&&mapped.every(a=>!!route(start,artworkRoom(a).id,true));
 if(allApproved||allPreview){
  const remaining=mapped.slice(),ordered=[];let current=start;
  while(remaining.length){
   remaining.sort((a,b)=>{
    const ra=route(current,artworkRoom(a).id,allPreview),rb=route(current,artworkRoom(b).id,allPreview);
    return (ra?.cost??Infinity)-(rb?.cost??Infinity)||a.id.localeCompare(b.id);
   });
   const next=remaining.shift();ordered.push(next);current=artworkRoom(next).id;
  }
  return {ordered:[...ordered,...unmapped],optimised:allApproved,provisional:allPreview};
 }
 mapped.sort((a,b)=>{
  const ra=artworkRoom(a),rb=artworkRoom(b),fa=floorValue(ra.floor),fb=floorValue(rb.floor);
  return fa-fb||ra.wing.localeCompare(rb.wing)||ra.label.localeCompare(rb.label);
 });
 return {ordered:[...mapped,...unmapped],optimised:false,provisional:false};
}
/* Visitor map is owned by TRACE_WAYFINDER. Keep the route graph and curator tools here. */
function map(){
 touch();
 return window.TRACE_WAYFINDER?window.TRACE_WAYFINDER.render():
  '<div class="wf-page"><h2>Map</h2><a href="'+MAPS[state.venue].url+'">Museum floor plan</a></div>';
}
function adminUI(venue){
 const rooms=display()?.rooms(venue)||[],links=display()?.connections(venue)||[],current=display()?.count(venue)||0;
 const option=rooms.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.label)+' · '+esc(r.wing)+' '+esc(r.floor)+'</option>').join('');
 return '<section class="tn-admin"><div class="t1-overline">MUSEUM FLOOR PLAN & ROUTE NETWORK</div><h3>Assign rooms and connect the route</h3>'+
 '<p>TRACE uses official museum room and gallery labels, but not an imported, metrically accurate indoor navigation system. Administrators choose artworks and review map-researched connections. Only approved, open links can produce directions. Research links show labelled previews, never authoritative navigation.</p>'+
 '<div class="tn-admin-official"><a href="'+MAPS[venue].url+'" target="_blank" rel="noopener noreferrer">Open official '+(venue==='mmfa'?'MMFA':venue==='pamm'?'PAMM':'MoMA')+' museum floor plan ↗</a><small>'+rooms.length+' room labels loaded · '+links.length+' walkable connections configured</small></div>'+
 '<div class="tn-admin-section"><h4>Add a room or gallery</h4><div class="tn-admin-grid"><label>Room name<input id="tn-new-room-label" placeholder="Gallery A / Exhibit 12"></label><label>Floor<input id="tn-new-room-floor" placeholder="1, 2, S1…"></label><label>Wing or pavilion<input id="tn-new-room-wing" placeholder="Pavilion / area"></label></div><button class="button outline" data-tn-add-room type="button">＋ Add room</button></div>'+
 '<div class="tn-admin-section"><h4>Connect walkable rooms</h4><p>Only connect two rooms when you know visitors can directly travel between them. Connections are bidirectional.</p><div class="tn-admin-grid"><label>From<select id="tn-link-from"><option value="">Choose room</option>'+option+'</select></label><label>To<select id="tn-link-to"><option value="">Choose room</option>'+option+'</select></label><label>Connection type<select id="tn-link-type"><option value="corridor">Corridor / passage</option><option value="elevator">Elevator / step-free access</option><option value="stairs">Stairs</option><option value="outdoor">Outdoor route</option></select></label></div><button class="button outline" data-tn-connect type="button">↔ Connect rooms</button></div>'+
 (links.length?'<details class="tn-admin-section tn-review-list" '+(venue==='mmfa'?'':'open')+'><summary><strong>Connection review & closures</strong> · '+links.length+' links</summary><p>These map-based links are provisional until checked in person. Only approve confirmed entrances, elevators and stairs. Closing an approved link excludes it from visitor directions when published.</p>'+
 links.map(l=>{
  const key=esc(l.from+':'+l.to+':'+l.type),research=l.status==='research',closed=l.closed===true;
  return '<div class="tn-review-link"><div><strong>'+esc(rooms.find(x=>x.id===l.from)?.label||l.from)+' ↔ '+esc(rooms.find(x=>x.id===l.to)?.label||l.to)+'</strong><small>'+esc(l.type)+' · '+(research?'Map research · NOT approved':'Curator approved')+(closed?' · CLOSED':'')+'</small>'+(l.source?'<a href="'+esc(l.source)+'" target="_blank" rel="noopener noreferrer">Map evidence ↗</a>':'')+
  (l.note?'<details class="tn-review-reason"><summary>Review source and limitations</summary><p>'+esc(l.note)+'</p></details>':'')+'</div><div class="tn-review-actions">'+
  (research?'<button type="button" data-tn-approve="'+key+'">Approve link</button>':'<button type="button" data-tn-propose="'+key+'">Mark for review</button>')+
  '<button type="button" data-tn-closure="'+key+'">'+(closed?'Reopen':'Close')+'</button><button type="button" data-tn-unlink="'+key+'">Remove</button></div></div>';
 }).join('')+'</details>':'<p class="tn-not-yet">No mapped links. Add a verified connection to enable room directions.</p>')+
 '<details class="tn-manage-rooms"><summary>Manage room catalogue ('+rooms.length+')</summary>'+rooms.map(r=>'<div class="tn-room-row"><span>'+esc(r.label)+' <small>('+esc(r.wing)+' · '+esc(r.floor)+')</small></span><button type="button" data-tn-remove-room="'+esc(r.id)+'">Remove</button></div>').join('')+'</details>'+
 '<p class="tn-fine">Any edits are local drafts until the curator publishes the exported JSON. This demo is not a secured institutional CMS. '+current+' works are currently included in the playable visitor route.</p></section>';
}
function reRender(){if(window.__traceAppRender)window.__traceAppRender()}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-tn-mode],[data-tn-focus],[data-tn-open],[data-tn-add-room],[data-tn-connect],[data-tn-remove-room],[data-tn-unlink],[data-tn-approve],[data-tn-propose],[data-tn-closure]');
 if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();const d=b.dataset;
 if(d.tnMode!==undefined){S.mode=d.tnMode;S.expanded=true;touch();saveRoute();reRender();return}
 if(d.tnFocus!==undefined){S.focus=d.tnFocus;saveRoute();reRender();return}
 if(d.tnOpen!==undefined){
  const a=A.find(x=>x.id===d.tnOpen);
  if(!a||!display()?.isActive(a.id))return;
  if(window.TRACE_V1?.openWork)window.TRACE_V1.openWork(A.indexOf(a));
  return;
 }
 if(d.tnAddRoom!==undefined){
  const label=document.getElementById('tn-new-room-label')?.value.trim(),floor=document.getElementById('tn-new-room-floor')?.value.trim(),wing=document.getElementById('tn-new-room-wing')?.value.trim();
  if(label)display()?.alterRooms(state.venue,'add',{label,floor,wing});return;
 }
 if(d.tnConnect!==undefined){
  const from=document.getElementById('tn-link-from')?.value,to=document.getElementById('tn-link-to')?.value;
  if(from&&to)display()?.alterRooms(state.venue,'connect',{from,to,type:document.getElementById('tn-link-type')?.value||'corridor'});return;
 }
 if(d.tnRemoveRoom!==undefined){if(confirm('Remove this room and all its route connections?'))display()?.alterRooms(state.venue,'remove',{id:d.tnRemoveRoom});return}
 if(d.tnApprove!==undefined||d.tnPropose!==undefined||d.tnClosure!==undefined){
  const key=d.tnApprove||d.tnPropose||d.tnClosure,[from,to,type]=key.split(':');
  const current=edges().find(v=>v.from===from&&v.to===to&&v.type===type);
  if(current)display()?.alterRooms(state.venue,'setConnection',{from,to,type,
   ...(d.tnClosure!==undefined?{closed:!current.closed}:{status:d.tnApprove!==undefined?'approved':'research'})});
  return;
 }
 if(d.tnUnlink!==undefined){const [from,to,type]=d.tnUnlink.split(':');display()?.alterRooms(state.venue,'disconnect',{from,to,type});return}
},true);
document.addEventListener('change',ev=>{
 const b=ev.target.closest('[data-tn-select],[data-tn-access],[data-tn-start]');if(!b)return;
 touch();if(b.dataset.tnAccess!==undefined){S.stepFree=b.value==='stepfree';saveRoute();reRender();return}if(b.dataset.tnStart!==undefined){if(room(b.value))S.start=b.value;saveRoute();reRender();return}S.mode='custom';S.selected=b.checked?[...new Set([...S.selected,b.dataset.tnSelect])]:S.selected.filter(id=>id!==b.dataset.tnSelect);saveRoute();reRender();
});
window.TRACE_ROUTING={map,adminUI,routeWorks,plannedOrder,path,route,MAPS,saveRoute,get state(){return S},touch};
})();