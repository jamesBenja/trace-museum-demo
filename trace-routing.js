/* TRACE navigator v1.6, sourced rooms from MMFA/PAMM public museum maps.
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
function adjacency(){
 const graph=new Map();
 for(const x of display()?.rooms(state.venue)||[])graph.set(x.id,[]);
 for(const c of edges()){
  if(S.stepFree&&c.type==='stairs')continue;
  if(graph.has(c.from)&&graph.has(c.to)){graph.get(c.from).push(c.to);graph.get(c.to).push(c.from)}
 }
 return graph;
}
function path(from,to){
 if(!from||!to)return null;
 if(from===to)return [from];
 const graph=adjacency(),q=[from],seen=new Set([from]),parent=new Map();
 if(!graph.has(from)||!graph.has(to))return null;
 while(q.length){
  const u=q.shift();
  for(const v of graph.get(u)||[]){
   if(seen.has(v))continue;
   seen.add(v);parent.set(v,u);
   if(v===to){const out=[to];while(out[0]!==from)out.unshift(parent.get(out[0]));return out}
   q.push(v);
  }
 }
 return null;
}
function floorValue(s){
 const m=/^(?:S(\d+)|(-?\d+)|Outdoor)$/i.exec(s||'');
 if(!m)return 200;
 if(m[1])return -Number(m[1]);
 if(m[2])return Number(m[2]);
 return 100;
}
function plannedOrder(){
 const items=routeWorks();
 // Only optimize walking order if a connected curator-approved room graph exists.
 const mapped=items.filter(a=>artworkRoom(a)),unmapped=items.filter(a=>!artworkRoom(a));
 if(!mapped.length)return {ordered:unmapped,optimised:false};
 const start=S.start||MAPS[state.venue].startRoom;
 const fullyConnected=mapped.every(a=>path(start,artworkRoom(a).id));
 if(fullyConnected&&edges().length){
  const remaining=mapped.slice(),ordered=[];let curr=start;
  while(remaining.length){
   remaining.sort((a,b)=>path(curr,artworkRoom(a).id).length-path(curr,artworkRoom(b).id).length);
   const next=remaining.shift();ordered.push(next);curr=artworkRoom(next).id;
  }
  return {ordered:[...ordered,...unmapped],optimised:true};
 }
 mapped.sort((a,b)=>{
  const ra=artworkRoom(a),rb=artworkRoom(b),fa=floorValue(ra.floor),fb=floorValue(rb.floor);
  return fa-fb||ra.wing.localeCompare(rb.wing)||ra.label.localeCompare(rb.label)
 });
 return {ordered:[...mapped,...unmapped],optimised:false};
}
function stopCard(a,i,prevId){
 const r=artworkRoom(a),verified=display()?.isVerified(a.id);
 const previous=prevId||S.start||MAPS[state.venue].startRoom;
 const corridor=r?path(previous,r.id):null;
 const instructions= !r?'No room assigned yet. Ask museum staff or view the official plan.':
  !verified?'Room is a local/demo assignment; not confirmed as current exhibition placement.':
  corridor?(corridor.length===1?'You are already at this room.':'Staff-entered route: '+corridor.slice(1).map((id,i)=>{const edge=edges().find(x=>x.from===corridor[i]&&x.to===id||x.to===corridor[i]&&x.from===id);const mode=edge?.type==='stairs'?'Take the stairs':edge?.type==='elevator'?'Use the elevator':edge?.type==='outdoor'?'Take the outdoor passage':'Continue';return mode+' to '+(room(id)?.label||id)}).join(' → ')):
  'Room known, but no approved corridor connection is configured. See the official floor plan.';
 return '<article class="tn-stop '+(found(a)?'tn-solved':'')+'"><div class="tn-stop-num">'+(i+1)+'</div><div class="tn-stop-detail"><div class="tn-title-line"><strong>'+esc(a.artist)+'</strong><small>'+(found(a)?'✓ Solved':'◉ To discover')+'</small></div><p>'+esc(a.name)+'</p>'+
 '<div class="tn-room-line">'+(r?'<b>'+esc(r.label)+'</b> · '+esc(r.wing)+' · '+esc(r.floor==='Outdoor'?'Outdoors':'Floor '+r.floor):'<b>Room not assigned</b>')+'</div>'+
 '<p class="tn-instructions">'+esc(instructions)+'</p>'+
 '<div class="tn-actions"><button type="button" data-tn-focus="'+a.id+'">⌖ Show on museum map</button><button type="button" data-tn-open="'+a.id+'" '+(found(a)?'':'')+'>'+(found(a)?'Review artwork':'View this quest')+'</button></div></div></article>';
}
function miniMap(){
 const rooms=display()?.rooms(state.venue)||[];
 const selection=routeWorks();
 const assigned=selection.map(a=>({a,r:artworkRoom(a)})).filter(x=>x.r);
 const byFloor=new Map();
 for(const {a,r} of assigned){
  const k=r.wing+' | '+r.floor;
  if(!byFloor.has(k))byFloor.set(k,[]);
  byFloor.get(k).push({a,r});
 }
 let contents='';
 for(const [section,rows] of byFloor.entries()){
  contents+='<section class="tn-mini-section"><div class="tn-mini-heading">'+esc(section.replace(' | ',' · '))+'</div><div class="tn-mini-rooms">'+rows.map(({a,r})=>'<button type="button" data-tn-focus="'+a.id+'" class="'+(S.focus===a.id?'selected':'')+'"><span>⌖</span><strong>'+esc(r.label)+'</strong><small>'+esc(a.artist)+'</small></button>').join('')+'</div></section>';
 }
 if(!contents)contents='<div class="tn-map-empty">No artworks have been assigned to rooms yet. A curator can select rooms in the MUSEUM tab. You can still open the official museum floor plan below.</div>';
 return '<div class="tn-mini-map"><div class="tn-mini-overline">INTERACTIVE ROOM OVERVIEW · SCHEMATIC, NOT TO SCALE</div>'+contents+'</div>';
}
function selector(){
 const chosen=routeWorks(),all=catalog();
 return '<div class="tn-route-builder"><div class="tn-head-row"><h3>Build your museum adventure</h3><span>'+chosen.length+' / '+all.length+' stops</span></div>'+
 '<div class="tn-route-modes"><button type="button" data-tn-mode="quick" class="'+(S.mode==='quick'?'selected':'')+'">Quick 3</button>'+
 '<button type="button" data-tn-mode="all" class="'+(S.mode==='all'?'selected':'')+'">Full visit</button>'+
 '<button type="button" data-tn-mode="custom" class="'+(S.mode==='custom'?'selected':'')+'">Choose stops</button></div>'+
 (S.mode==='custom'?'<div class="tn-choose-stops">'+all.map(a=>'<label><input type="checkbox" data-tn-select="'+a.id+'" '+(S.selected.includes(a.id)?'checked':'')+'><span>'+esc(a.artist)+'<small>'+esc(a.name)+'</small></span></label>').join('')+'</div>':'')+
 '<div class="tn-admin-grid tn-visitor-preferences"><label>Starting point<select data-tn-start="1">'+(display()?.rooms(state.venue)||[]).map(r=>'<option value="'+esc(r.id)+'" '+(S.start===r.id?'selected':'')+'>'+esc(r.label+' · '+r.floor)+'</option>').join('')+'</select></label><label>Access preference<select data-tn-access="1"><option value="stepfree" '+(S.stepFree?'selected':'')+'>Step-free (avoid stairs)</option><option value="all" '+(!S.stepFree?'selected':'')+'>Allow stairs</option></select></label></div><p class="tn-fine">Choose a starting point and accessibility setting. Corridor data is entered by museum administrators; no distances or travel times are invented.</p></div>';
}
function map(){
 touch();const m=MAPS[state.venue],plan=plannedOrder(),arr=plan.ordered;
 let prev=S.start||m.startRoom;
 const steps=arr.map((a,i)=>{const output=stopCard(a,i,prev);const r=artworkRoom(a);if(r)prev=r.id;return output}).join('');
 const configured=arr.filter(a=>artworkRoom(a)&&display()?.isVerified(a.id)).length;
 const reachable=plan.optimised;
 const focus=S.focus?arr.find(a=>a.id===S.focus):null;
 return '<div class="tn-page"><div class="t1-overline">TRACE · MUSEUM NAVIGATOR</div><h2 class="tn-headline">Find your next discovery.</h2>'+
 '<p class="tn-intro">'+esc(m.description)+'. Follow a visitor-selected adventure or choose a curated route through available artworks.</p>'+
 '<div class="tn-official"><div><strong>Official museum floor plan</strong><small>'+esc(m.title)+'</small></div><a href="'+m.url+'" target="_blank" rel="noopener noreferrer">Open map ↗</a></div>'+
 '<details class="tn-plan-preview" '+(S.expanded?'open':'')+'><summary>View the museum floor plan inside TRACE</summary><div class="tn-pdf-fallback"><iframe title="Official museum visitor floor plan" loading="lazy" src="'+m.url+'#view=FitH" referrerpolicy="no-referrer"></iframe><a href="'+m.url+'" target="_blank" rel="noopener noreferrer">Open full-size official plan ↗</a></div></details>'+
 selector()+
 '<div class="tn-route-status"><b>'+(reachable?'ROOM ROUTE FROM CURATOR-CONFIGURED CONNECTIONS':'SUGGESTED GALLERY ORDER · NOT STEP-BY-STEP DIRECTIONS')+'</b><p>'+(reachable?'The room route uses a connection network supplied in the administrator workspace. Verify it with onsite signage and staff.':'Museum floor plans confirm room labels, but not each artwork’s current placement or all room-to-room passages. We will not invent turns or travel times.')+'</p></div>'+
 miniMap()+
 (focus?'<div class="tn-focused"><b>⌖ Selected room</b><p>'+esc(focus.artist)+' · '+esc(focus.name)+'</p><strong>'+(artworkRoom(focus)?esc(artworkRoom(focus).label):'Room needs curator assignment')+'</strong></div>':'')+
 '<div class="tn-route-head"><h3>Your discovery route</h3><small>'+arr.length+' stops · '+configured+' with museum-marked display confirmation</small></div>'+
 (arr.length?'<div class="tn-route-stops">'+steps+'</div>':'<div class="tn-empty">No playable works selected. Turn on artworks in the museum workspace or choose a different route.</div>')+
 '<p class="tn-disclaimer">Gallery labels are based on published museum floor plans. Actual artwork placement and walking connections require museum staff confirmation. We do not provide turn-by-turn directions for unverified routes.</p>'+
 '<button type="button" data-action="quest" class="button ghost">← Back to adventure</button></div>';
}
function adminUI(venue){
 const rooms=display()?.rooms(venue)||[],links=display()?.connections(venue)||[],current=display()?.count(venue)||0;
 const option=rooms.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.label)+' · '+esc(r.wing)+' '+esc(r.floor)+'</option>').join('');
 return '<section class="tn-admin"><div class="t1-overline">MUSEUM FLOOR PLAN & ROUTE NETWORK</div><h3>Assign rooms and connect the route</h3>'+
 '<p>TRACE uses official museum room and gallery labels, but not an imported, metrically accurate indoor navigation system. Administrators choose where artworks are displayed, then specify which rooms visitors can walk between. Only configured connections are used for room-to-room directions.</p>'+
 '<div class="tn-admin-official"><a href="'+MAPS[venue].url+'" target="_blank" rel="noopener noreferrer">Open official '+(venue==='mmfa'?'MMFA':'PAMM')+' museum floor plan ↗</a><small>'+rooms.length+' room labels loaded · '+links.length+' walkable connections configured</small></div>'+
 '<div class="tn-admin-section"><h4>Add a room or gallery</h4><div class="tn-admin-grid"><label>Room name<input id="tn-new-room-label" placeholder="Gallery A / Exhibit 12"></label><label>Floor<input id="tn-new-room-floor" placeholder="1, 2, S1…"></label><label>Wing or pavilion<input id="tn-new-room-wing" placeholder="Pavilion / area"></label></div><button class="button outline" data-tn-add-room type="button">＋ Add room</button></div>'+
 '<div class="tn-admin-section"><h4>Connect walkable rooms</h4><p>Only connect two rooms when you know visitors can directly travel between them. Connections are bidirectional.</p><div class="tn-admin-grid"><label>From<select id="tn-link-from"><option value="">Choose room</option>'+option+'</select></label><label>To<select id="tn-link-to"><option value="">Choose room</option>'+option+'</select></label><label>Connection type<select id="tn-link-type"><option value="corridor">Corridor / passage</option><option value="elevator">Elevator / step-free access</option><option value="stairs">Stairs</option><option value="outdoor">Outdoor route</option></select></label></div><button class="button outline" data-tn-connect type="button">↔ Connect rooms</button></div>'+
 (links.length?'<div class="tn-admin-section"><h4>Configured connections</h4>'+links.map(l=>'<div class="tn-connection"><span>'+esc(rooms.find(x=>x.id===l.from)?.label||l.from)+' ↔ '+esc(rooms.find(x=>x.id===l.to)?.label||l.to)+' · '+esc(l.type||'corridor')+'</span><button type="button" data-tn-unlink="'+esc(l.from)+':'+esc(l.to)+'">Remove</button></div>').join('')+'</div>':'<p class="tn-not-yet">No room links have been approved yet. Until then, visitors see room sequences and the official PDF instead of invented walking instructions.</p>')+
 '<details class="tn-manage-rooms"><summary>Manage room catalogue ('+rooms.length+')</summary>'+rooms.map(r=>'<div class="tn-room-row"><span>'+esc(r.label)+' <small>('+esc(r.wing)+' · '+esc(r.floor)+')</small></span><button type="button" data-tn-remove-room="'+esc(r.id)+'">Remove</button></div>').join('')+'</details>'+
 '<p class="tn-fine">Any edits are local drafts until the curator publishes the exported JSON. This demo is not a secured institutional CMS. '+current+' works are currently included in the playable visitor route.</p></section>';
}
function reRender(){if(window.__traceAppRender)window.__traceAppRender()}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-tn-mode],[data-tn-focus],[data-tn-open],[data-tn-add-room],[data-tn-connect],[data-tn-remove-room],[data-tn-unlink]');
 if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();const d=b.dataset;
 if(d.tnMode!==undefined){S.mode=d.tnMode;touch();saveRoute();reRender();return}
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
 if(d.tnUnlink!==undefined){const [from,to]=d.tnUnlink.split(':');display()?.alterRooms(state.venue,'disconnect',{from,to});return}
},true);
document.addEventListener('change',ev=>{
 const b=ev.target.closest('[data-tn-select],[data-tn-access],[data-tn-start]');if(!b)return;
 touch();if(b.dataset.tnAccess!==undefined){S.stepFree=b.value==='stepfree';saveRoute();reRender();return}if(b.dataset.tnStart!==undefined){if(room(b.value))S.start=b.value;saveRoute();reRender();return}S.mode='custom';S.selected=b.checked?[...new Set([...S.selected,b.dataset.tnSelect])]:S.selected.filter(id=>id!==b.dataset.tnSelect);saveRoute();reRender();
});
window.TRACE_ROUTING={map,adminUI,routeWorks,plannedOrder,path,MAPS,get state(){return S},touch};
})();