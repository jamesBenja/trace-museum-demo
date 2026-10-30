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
function stopCard(a,i,prevId){
 const r=artworkRoom(a),verified=display()?.isVerified(a.id),previous=prevId||S.start||MAPS[state.venue].startRoom;
 const approved=r?route(previous,r.id):null;
 const preview=!approved&&r?route(previous,r.id,true):null;
 const instructions=!r?'No room assigned yet. Ask museum staff or view the official plan.':
  !verified?'Room is a local/demo assignment; its actual placement has not been confirmed by museum staff.':
  approved?(approved.rooms.length===1?'This stop is in the same mapped room as the previous artwork.':'Museum-approved route: '+approved.rooms.slice(1).map((id,i)=>{
   const type=approved.edges[i]?.type,action=type==='stairs'?'Take stairs':type==='elevator'?'Use elevator':type==='outdoor'?'Follow outdoor passage':'Continue';
   return action+' to '+(room(id)?.label||id);
  }).join(' → ')):
  preview?(preview.rooms.length===1?'Same mapped room as the previous artwork.':
   'Provisional map sequence available ('+preview.edges.length+' links). Museum staff have not verified this walking route.'):
  'No complete mapped connection yet. Use the official plan and ask museum staff.';
 const stages=preview&&verified&&preview.rooms.length>1?'<details class="tn-stop-preview"><summary>View provisional gallery sequence · '+preview.edges.length+' connections</summary><ol>'+
 preview.rooms.map((id,j)=>'<li>'+esc(room(id)?.wing||'Museum')+' · '+esc(room(id)?.label||id)+' · '+esc(room(id)?.floor==='Outdoor'?'Outdoors':'Level '+(room(id)?.floor||'?'))+
 (j>0?'<small> · '+esc(preview.edges[j-1]?.type||'passage')+'</small>':'')+'</li>').join('')+
 '</ol><p>Map-based sequence only. Verify the actual passage, elevator and outdoor access onsite.</p></details>':'';
 return '<article class="tn-stop '+(found(a)?'tn-solved':'')+'"><div class="tn-stop-num">'+(i+1)+'</div><div class="tn-stop-detail"><div class="tn-title-line"><strong>'+esc(a.artist)+'</strong><small>'+(found(a)?'✓ Solved':'◉ To discover')+'</small></div><p>'+esc(a.name)+'</p>'+
 '<div class="tn-room-line">'+(r?'<b>'+esc(r.label)+'</b> · '+esc(r.wing)+' · '+esc(r.floor==='Outdoor'?'Outdoors':'Floor '+r.floor):'<b>Room not assigned</b>')+'</div>'+
 '<p class="tn-instructions">'+esc(instructions)+'</p>'+stages+
 '<div class="tn-actions"><button type="button" data-tn-focus="'+a.id+'">⌖ Show on museum map</button><button type="button" data-tn-open="'+a.id+'">'+(found(a)?'Review artwork':'View this quest')+'</button></div></div></article>';
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
function connectivity(){
 const venue=state.venue,all=edges().filter(e=>!e.closed),known=display()?.rooms(venue)||[];
 const chosen=routeWorks(),focus=chosen.find(a=>a.id===S.focus)||chosen[0];
 const target=focus?artworkRoom(focus):null,from=room(S.start)||room(MAPS[venue].startRoom);
 const approved=target&&from?route(from.id,target.id):null;
 const preview=!approved&&target&&from?route(from.id,target.id,true):null;
 const linkLabel=id=>esc(room(id)?.label||id);
 const routeMarkup=(approved||preview)?'<div class="tn-path-line">'+(approved||preview).rooms.map((id,i)=>'<span class="tn-path-node">'+linkLabel(id)+'</span>'+(i<(approved||preview).edges.length?'<span aria-hidden="true" class="tn-path-arrow">'+((approved||preview).edges[i].type==='stairs'?'↥':(approved||preview).edges[i].type==='elevator'?'⇅':'→')+'</span>':'')).join('')+'</div>':'';
 const heading=target?'Mica’s room finder: '+esc(target.label):'Mica’s room finder';
 const reason= !target?'Choose an artwork with an assigned gallery to preview its location.':
  !from?'Choose a starting gallery to plan the visit.':
  approved?'A curator-approved connection is available for this route. Follow the directions below and check museum signage.':
  preview?'These gallery links come from published maps, but staff have not approved them as directions. Use the official floor plan to verify the route.':
  'There is not yet a complete verified connection between these rooms. '+esc(target.label)+' is listed on '+esc(target.wing)+' · '+esc(target.floor==='Outdoor'?'outside':'Level '+target.floor)+'. Check the official floor map or ask museum staff.';
 const candidates=all.filter(e=>e.status==='research').length;
 const groups=new Map();
 for(const link of all){
  const a=room(link.from),b=room(link.to),key=a?.floor===b?.floor?(a?.floor==='Outdoor'?'Outside':'Floor '+a?.floor):'Between floors / areas';
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(link);
 }
 return '<section class="tn-connectivity" aria-label="Museum room connections">'+
 '<div class="tn-connectivity-title"><span class="tn-connectivity-mica" aria-hidden="true">✦</span><div><small>TRACE · GALLERY WAYFINDER</small><h3>'+heading+'</h3></div></div>'+
 '<p>'+reason+'</p>'+routeMarkup+
 (venue==='pamm'&&target?.id==='pamm-18'&&S.stepFree?'<p class="tn-access-note">Accessible sculpture-garden transport may require contacting PAMM Visitor Services in advance.</p>':'')+
 '<details class="tn-source-links"><summary>Explore '+all.length+' mapped links ('+candidates+' awaiting museum approval)</summary>'+
 (groups.size?[...groups].map(([label,links])=>'<div class="tn-link-group"><b>'+esc(label)+'</b>'+links.map(l=>'<div class="tn-link-line '+(l.status==='research'?'tn-unverified':'')+'"><span>'+linkLabel(l.from)+' ↔ '+linkLabel(l.to)+'</span><small>'+(l.status==='research'?'Map research · verify onsite':'Curator approved')+' · '+esc(l.type)+'</small></div>').join('')+'</div>').join(''):'<p>No room connections have been mapped yet.</p>')+
 '</details><p class="tn-map-caution">Schematic network only; not to scale. Artwork installations and gallery access may change. Exact paths require museum verification.</p></section>';
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
 '<div class="tn-route-status"><b>'+(reachable?'ROOM ROUTE FROM CURATOR-CONFIGURED CONNECTIONS':plan.provisional?'PROVISIONAL CONNECTED VISIT · NOT VERIFIED DIRECTIONS':'SUGGESTED GALLERY ORDER · NOT STEP-BY-STEP DIRECTIONS')+'</b><p>'+(reachable?'The room route uses a connection network supplied in the administrator workspace. Verify it with onsite signage and staff.':plan.provisional?'TRACE has found a connected gallery sequence using published museum maps and provisional vertical links. The visiting order is planned, but exact doors, stairs, elevators and outdoor exits need museum confirmation.':'Museum floor plans confirm room labels, but not each artwork’s current placement or all room-to-room passages. We will not invent turns or travel times.')+'</p></div>'+
 miniMap()+
 connectivity()+
 (focus?'<div class="tn-focused"><b>⌖ Selected room</b><p>'+esc(focus.artist)+' · '+esc(focus.name)+'</p><strong>'+(artworkRoom(focus)?esc(artworkRoom(focus).label):'Room needs curator assignment')+'</strong></div>':'')+
 '<div class="tn-route-head"><h3>Your discovery route</h3><small>'+arr.length+' stops · '+(plan.provisional?'provisional connected visit':reachable?'curator-approved route':configured+' with museum-marked display confirmation')+'</small></div>'+
 (arr.length?'<div class="tn-route-stops">'+steps+'</div>':'<div class="tn-empty">No playable works selected. Turn on artworks in the museum workspace or choose a different route.</div>')+
 '<p class="tn-disclaimer">Gallery labels are based on published museum floor plans. Actual artwork placement and walking connections require museum staff confirmation. We do not provide turn-by-turn directions for unverified routes.</p>'+
 '<button type="button" data-action="quest" class="button ghost">← Back to adventure</button></div>';
}
function adminUI(venue){
 const rooms=display()?.rooms(venue)||[],links=display()?.connections(venue)||[],current=display()?.count(venue)||0;
 const option=rooms.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.label)+' · '+esc(r.wing)+' '+esc(r.floor)+'</option>').join('');
 return '<section class="tn-admin"><div class="t1-overline">MUSEUM FLOOR PLAN & ROUTE NETWORK</div><h3>Assign rooms and connect the route</h3>'+
 '<p>TRACE uses official museum room and gallery labels, but not an imported, metrically accurate indoor navigation system. Administrators choose artworks and review map-researched connections. Only approved, open links can produce directions. Research links show labelled previews, never authoritative navigation.</p>'+
 '<div class="tn-admin-official"><a href="'+MAPS[venue].url+'" target="_blank" rel="noopener noreferrer">Open official '+(venue==='mmfa'?'MMFA':venue==='pamm'?'PAMM':'MoMA')+' museum floor plan ↗</a><small>'+rooms.length+' room labels loaded · '+links.length+' walkable connections configured</small></div>'+
 '<div class="tn-admin-section"><h4>Add a room or gallery</h4><div class="tn-admin-grid"><label>Room name<input id="tn-new-room-label" placeholder="Gallery A / Exhibit 12"></label><label>Floor<input id="tn-new-room-floor" placeholder="1, 2, S1…"></label><label>Wing or pavilion<input id="tn-new-room-wing" placeholder="Pavilion / area"></label></div><button class="button outline" data-tn-add-room type="button">＋ Add room</button></div>'+
 '<div class="tn-admin-section"><h4>Connect walkable rooms</h4><p>Only connect two rooms when you know visitors can directly travel between them. Connections are bidirectional.</p><div class="tn-admin-grid"><label>From<select id="tn-link-from"><option value="">Choose room</option>'+option+'</select></label><label>To<select id="tn-link-to"><option value="">Choose room</option>'+option+'</select></label><label>Connection type<select id="tn-link-type"><option value="corridor">Corridor / passage</option><option value="elevator">Elevator / step-free access</option><option value="stairs">Stairs</option><option value="outdoor">Outdoor route</option></select></label></div><button class="button outline" data-tn-connect type="button">↔ Connect rooms</button></div>'+
 (links.length?'<div class="tn-admin-section"><h4>Connection review & closures</h4><p>Published map evidence is a starting point, not an onsite safety check. Only approve links physically confirmed as passable. Closing a link immediately excludes it from visitor routing after publication.</p>'+
 links.map(l=>{
  const key=esc(l.from+':'+l.to+':'+l.type),research=l.status==='research',closed=l.closed===true;
  return '<div class="tn-review-link"><div><strong>'+esc(rooms.find(x=>x.id===l.from)?.label||l.from)+' ↔ '+esc(rooms.find(x=>x.id===l.to)?.label||l.to)+'</strong><small>'+esc(l.type)+' · '+(research?'Map research · NOT approved':'Curator approved')+(closed?' · CLOSED':'')+'</small>'+(l.source?'<a href="'+esc(l.source)+'" target="_blank" rel="noopener noreferrer">Map evidence ↗</a>':'')+'</div><div class="tn-review-actions">'+
  (research?'<button type="button" data-tn-approve="'+key+'">Approve link</button>':'<button type="button" data-tn-propose="'+key+'">Mark for review</button>')+
  '<button type="button" data-tn-closure="'+key+'">'+(closed?'Reopen':'Close')+'</button><button type="button" data-tn-unlink="'+key+'">Remove</button></div></div>';
 }).join('')+'</div>':'<p class="tn-not-yet">No mapped links. Add a verified connection to enable room directions.</p>')+
 '<details class="tn-manage-rooms"><summary>Manage room catalogue ('+rooms.length+')</summary>'+rooms.map(r=>'<div class="tn-room-row"><span>'+esc(r.label)+' <small>('+esc(r.wing)+' · '+esc(r.floor)+')</small></span><button type="button" data-tn-remove-room="'+esc(r.id)+'">Remove</button></div>').join('')+'</details>'+
 '<p class="tn-fine">Any edits are local drafts until the curator publishes the exported JSON. This demo is not a secured institutional CMS. '+current+' works are currently included in the playable visitor route.</p></section>';
}
function reRender(){if(window.__traceAppRender)window.__traceAppRender()}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-tn-mode],[data-tn-focus],[data-tn-open],[data-tn-add-room],[data-tn-connect],[data-tn-remove-room],[data-tn-unlink],[data-tn-approve],[data-tn-propose],[data-tn-closure]');
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
window.TRACE_ROUTING={map,adminUI,routeWorks,plannedOrder,path,route,MAPS,get state(){return S},touch};
})();