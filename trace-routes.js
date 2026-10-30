/* TRACE v1.6 | Museum exhibition editor and visitor itinerary engine.
   Prototype-only: data is kept in this browser. No remote CMS, permissions,
   verified artwork placements, or museum-authorized routes are claimed.
   Official PDF floorplans remain linked to their museums.
*/
(function(){
'use strict';
const KEY='trace-museum-operations-v1';
const MAPS={
mmfa:{
 url:'https://www.mbam.qc.ca/en/mmfa-museum-map/',
 label:'Official MMFA museum plan',
 description:'The published map names pavilions, levels and collection sections, but does not specify individual artwork gallery rooms.',
 spaces:[
 ['entry','Main entrance','Jean-Noël Desmarais · Level 1','entrance'],
 ['garden','Sculpture Garden','Outdoor · Du Musée Avenue','outdoor'],
 ['peace-4','The Medieval Nave / Renaissance','Hornstein Pavilion for Peace · Level 4','section'],
 ['peace-3','Golden Age in Holland and Flanders','Hornstein Pavilion for Peace · Level 3','section'],
 ['peace-2','Baroque to Enlightenment','Hornstein Pavilion for Peace · Level 2','section'],
 ['peace-1','Modern Avant-garde / Contemporary','Hornstein Pavilion for Peace · Level 1','section'],
 ['bourgie-4','Indigenous Art · Rising Suns area','Claire and Marc Bourgie · Level 4','section'],
 ['bourgie-3','Founding Identities','Claire and Marc Bourgie · Level 3','section'],
 ['bourgie-2','Annual Exhibitions 1880–1920','Claire and Marc Bourgie · Level 2','section'],
 ['bourgie-1','Towards Modernism 1920–1930','Claire and Marc Bourgie · Level 1','section'],
 ['bourgie-s1','The Age of the Manifesto 1940–1960','Claire and Marc Bourgie · S1','section'],
 ['bourgie-s2','Expanding Fields 1960–1970','Claire and Marc Bourgie · S2','section'],
 ['desmarais-4','Arts of One World','Jean-Noël Desmarais · Level 4','section'],
 ['desmarais-s2','International Contemporary Art','Jean-Noël Desmarais · S2','section'],
 ['stewart-2','Decorative Arts and Design','Stewart Pavilion · Level 2','section'],
 ['stewart-1','Decorative Arts and Design','Stewart Pavilion · Level 1','section'],
 ['hornstein-1','Inuit Art','Michal and Renata Hornstein · Level 1','section']
 ]},
pamm:{
 url:'https://www.pamm.org/wp-content/uploads/2025/12/web_map_2025.pdf',
 label:'Official PAMM numbered galleries plan',
 description:'PAMM’s published map identifies galleries, two floors, stairways and elevators. Artwork placements and walkable connections still need staff confirmation.',
 spaces:[
 ['entry','Main entrance','Floor 1','entrance'],
 ['lobby','Museum Lobby · 2','Floor 1','lobby'],
 ['g3','Gallery 3','Floor 1','gallery'],
 ['g4','Gallery 4','Floor 1','gallery'],
 ['g5','Gallery 5','Floor 1','gallery'],
 ['g8','Gallery 8','Floor 1','gallery'],
 ['garden','Sculpture Garden · 18','Outdoor','outdoor'],
 ['g20','Gallery I · 20','Floor 2','gallery'],
 ['g21','Gallery 21','Floor 2','gallery'],
 ['g22','Gallery II · 22','Floor 2','gallery'],
 ['g23','Gallery 23','Floor 2','gallery'],
 ['g24','Gallery 24','Floor 2','gallery'],
 ['g25','Gallery 25','Floor 2','gallery'],
 ['g26','Gallery 26','Floor 2','gallery'],
 ['g27','Gallery 27','Floor 2','gallery'],
 ['g28','Gallery 28','Floor 2','gallery'],
 ['g29','Gallery 29','Floor 2','gallery'],
 ['g30','Gallery 30','Floor 2','gallery'],
 ['g31','Gallery 31','Floor 2','gallery'],
 ['g32','Gallery 32','Floor 2','gallery'],
 ['hall33','Hall 33','Floor 2','hall'],
 ['passage34','Gallery Passage · 34','Floor 2','hall'],
 ['lift19','Parking Staircase and Elevator · 19','Floor 1','elevator'],
 ['lift35','Central Staircase / Elevator · 35','Floor 2','elevator'],
 ['stairs37','Central Staircase · 37','Floor 2','stairs']
 ]}
};
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let db={mmfa:null,pamm:null};
try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object')db={...db,...v}}catch(e){}
function seed(id){
 const existing=db[id]&&typeof db[id]==='object'?db[id]:{};
 db[id]={
  artworks:existing.artworks&&typeof existing.artworks==='object'?existing.artworks:{},
  rooms:existing.rooms&&typeof existing.rooms==='object'?existing.rooms:{},
  links:Array.isArray(existing.links)?existing.links:[],
  plan:Array.isArray(existing.plan)?existing.plan:[],
  start:typeof existing.start==='string'?existing.start:'entry',
  accessible:existing.accessible!==false,
  mapView:existing.mapView==='plan'?'plan':'find',
  lastEdited:existing.lastEdited||null
 };
 for(const [room,label,floor,kind] of MAPS[id].spaces){
  if(!db[id].rooms[room])db[id].rooms[room]={name:label,floor,kind,official:true};
 }
}
seed('mmfa');seed('pamm');
function data(){return db[state.venue]}
function persist(){try{db[state.venue].lastEdited=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(db))}catch(e){console.warn('Local map editor could not be saved',e)}}
function artStatus(a){return data().artworks[a.id]||{status:'unknown',room:''}}
function artAvailable(a){const x=artStatus(a);return x.status==='on'&&x.room&&data().rooms[x.room]}
function roomLabel(id){const n=data().rooms[id];return n?n.name+' · '+n.floor:'Room not assigned'}
function viewable(){return A.filter(artAvailable)}
function roomsOptions(selected,blank='Choose location'){
 return '<option value="">'+esc(blank)+'</option>'+
 Object.entries(data().rooms).map(([id,r])=>'<option value="'+esc(id)+'" '+(id===selected?'selected':'')+'>'+esc(r.name+' · '+r.floor)+'</option>').join('');
}
function mapDocument(){
 const m=MAPS[state.venue];
 return '<div class="rt-map-document"><div class="rt-map-actions"><strong class="rt-kicker">'+esc(m.label)+'</strong><a href="'+m.url+'" target="_blank" rel="noopener noreferrer">Open full map ↗</a></div>'+
 '<iframe title="'+esc(m.label)+'" loading="lazy" src="'+m.url+'#view=FitH"></iframe>'+
 '<p>Official, externally hosted museum plan. Room labels are from this source; artwork locations must be supplied by museum staff. If the PDF does not display on your phone, use “Open full map.”</p></div>';
}
function banner(admin){
 return '<div class="rt-head"><div class="rt-kicker">'+(admin?'TRACE · INSTITUTION OPERATOR':'TRACE · MUSEUM WAYFINDING')+'</div><h2>'+(admin?'Manage your museum.':'Plan your discovery route.')+'</h2><p>'+(admin?'Set what is on view, where it is displayed, and how visitors can move between verified spaces.':'Build an itinerary of artworks currently marked on view, with staff-assigned galleries and directions where verified connections have been entered.')+'</p></div>';
}
function stats(){
 const on=A.filter(a=>artStatus(a).status==='on'),available=viewable(),unconfirmed=A.filter(a=>artStatus(a).status==='unknown');
 return '<div class="rt-stats"><div class="rt-stat"><strong>'+on.length+'</strong><small>Marked on view</small></div><div class="rt-stat"><strong>'+available.length+'</strong><small>On view + located</small></div><div class="rt-stat"><strong>'+unconfirmed.length+'</strong><small>Not confirmed</small></div></div>';
}
function editorArtworks(){
 return '<div class="rt-panel"><div class="rt-kicker">1 · EXHIBITION STATUS & ROOM</div><h3>Assign the collection</h3><p>Nothing is marked on view by default. In a production museum account, these edits would be staff-authenticated and centrally published. In this demo, edits change the visitor route immediately <strong>in this browser only</strong>.</p>'+stats()+
 A.map(a=>{const x=artStatus(a);return '<div class="rt-art"><div class="rt-art-head"><img src="'+img(a)+'" alt="" loading="lazy"><div><strong>'+esc(a.artist)+'</strong><small>'+esc(a.name)+'</small></div><span class="rt-pill '+(x.status==='on'?'on':x.status==='off'?'off':'unknown')+'">'+(x.status==='on'?'ON VIEW':x.status==='off'?'OFF VIEW':'UNVERIFIED')+'</span></div>'+
 '<div class="rt-art-ctl"><label>Display status<select data-route-status="'+a.id+'"><option value="unknown" '+(x.status==='unknown'?'selected':'')+'>Unverified</option><option value="on" '+(x.status==='on'?'selected':'')+'>On display</option><option value="off" '+(x.status==='off'?'selected':'')+'>Off display</option></select></label>'+
 '<label>Room / section<select data-route-assign="'+a.id+'">'+roomsOptions(x.room)+'</select></label></div>'+
 (x.status==='on'&&!x.room?'<div class="rt-note">On view, but no room assigned. Visitors will not receive directions until a location is selected.</div>':'')+'</div>'}).join('')+'</div>';
}
function editorRooms(){
 const rooms=Object.entries(data().rooms);
 return '<div class="rt-panel"><div class="rt-kicker">2 · EDITABLE LOCATION DIRECTORY</div><h3>Rooms from official maps</h3><p>These room names and levels are seeded from the museums’ published maps. Add a custom gallery when needed, or give an artwork a more precise location. A room’s existence does not confirm a specific artwork is displayed there.</p>'+
 '<details><summary style="font-size:12px;font-weight:800;cursor:pointer">View '+rooms.length+' map locations</summary>'+
 rooms.map(([id,r])=>'<div class="rt-roomline"><div><strong>'+esc(r.name)+'</strong><small>'+esc(r.floor)+(r.official?' · Official map label':' · Locally added')+'</small></div>'+(r.official?'':'<button type="button" data-route-delete-room="'+esc(id)+'">Remove</button>')+'</div>').join('')+'</details>'+
 '<div class="rt-join"><label>New gallery / room name<input type="text" maxlength="85" id="rt-new-name" placeholder="Gallery 8A"></label><label>Floor or pavilion<input type="text" maxlength="80" id="rt-new-floor" placeholder="Floor 2"></label></div>'+
 '<button type="button" data-route-add-room class="rt-btn alt">+ Add a museum room</button></div>';
}
function editorLinks(){
 const links=data().links,options=roomsOptions('');
 return '<div class="rt-panel"><div class="rt-kicker">3 · ROUTE CONNECTIONS</div><h3>Connect walkable spaces</h3><p>To provide genuine turn-by-turn directions, administrators must specify the actual entrances, corridors, elevators, and stairs that connect rooms. TRACE does <strong>not</strong> infer a walkable route from a PDF drawing.</p>'+
 '<div class="rt-join"><label>From<select id="rt-link-a">'+options+'</select></label><label>To<select id="rt-link-b">'+options+'</select></label>'+
 '<label>Connection<select id="rt-link-type"><option value="corridor">Corridor / passage</option><option value="elevator">Elevator / step-free access</option><option value="stairs">Stairs</option><option value="outdoor">Outdoor route</option></select></label><label>Navigation note<input id="rt-link-note" type="text" maxlength="90" placeholder="Through doorway on left"></label></div>'+
 '<button type="button" data-route-link class="rt-btn">+ Add a two-way connection</button>'+
 (links.length?'<div style="margin-top:12px">'+links.map((link,i)=>'<div class="rt-roomline"><div><strong>'+esc(data().rooms[link.a]?.name||link.a)+' ↔ '+esc(data().rooms[link.b]?.name||link.b)+'</strong><small>'+esc(link.type)+(link.note?' · '+esc(link.note):'')+'</small></div><button data-route-remove-link="'+i+'" type="button">Remove</button></div>').join('')+'</div>':'<div class="rt-empty">No staff-entered corridor connections yet. The app can still organize an itinerary by floor, but it will not invent walking directions.</div>')+
 '<p class="rt-note">Staff-entered connections in this prototype are test data, not museum-approved safety or accessibility directions. A real pilot requires on-site validation and authenticated publishing.</p></div>';
}
function editor(){
 return '<div class="rt-screen">'+banner(true)+
 '<div class="rt-note"><strong>LOCAL ADMIN PREVIEW</strong> · No password protection, remote synchronization or visitor-facing publication across devices exists yet. The visitor preview on this device updates immediately.</div>'+
 editorArtworks()+editorRooms()+editorLinks()+
 '<div class="rt-panel"><h3>Preview the visitor experience</h3><p>Test whether removing an artwork updates the route, whether switching galleries changes the destination, and whether accessible routing avoids stairs.</p>'+
 '<button type="button" class="rt-btn" data-route-open-map>⌖ Open live route preview</button>'+
 '<div class="rt-actions"><button type="button" class="rt-btn alt" data-route-export>Export this museum configuration</button><button type="button" class="rt-btn warn" data-route-clear>Clear local exhibition edits</button></div>'+
 '<p>Configuration export is a JSON backup for this pilot, not an API or a server-side publication.</p></div>'+mapDocument()+'</div>';
}
function graphPath(start,finish,accessible){
 if(!data().rooms[start]||!data().rooms[finish])return null;
 if(start===finish)return [start];
 const edges=data().links.filter(e=>data().rooms[e.a]&&data().rooms[e.b]&&(!accessible||e.type!=='stairs'));
 const queue=[start],from=new Map([[start,null]]);
 while(queue.length){
  const node=queue.shift();
  for(const e of edges){
   const next=e.a===node?e.b:e.b===node?e.a:null;
   if(!next||from.has(next))continue;
   from.set(next,node);
   if(next===finish){
    const chain=[finish];let n=finish;
    while((n=from.get(n))!==null)chain.push(n);
    return chain.reverse();
   }
   queue.push(next);
  }
 }
 return null;
}
function edgeFor(a,b){return data().links.find(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a))}
function computed(){
 const all=viewable(),wanted=data().plan.filter(id=>all.some(a=>a.id===id)),remaining=wanted.slice();
 const stops=[],start=data().rooms[data().start]?data().start:'entry',accessible=data().accessible;
 let at=start;
 while(remaining.length){
  const candidates=remaining.map(id=>{
   const work=A.find(a=>a.id===id),room=artStatus(work).room,path=graphPath(at,room,accessible);
   return {id,work,room,path,floor:data().rooms[room]?.floor||'',reachable:!!path};
  });
  candidates.sort((x,y)=>{
   if(x.reachable!==y.reachable)return x.reachable?-1:1;
   if(x.reachable&&y.reachable)return x.path.length-y.path.length;
   const atFloor=data().rooms[at]?.floor;
   if((x.floor===atFloor)!==(y.floor===atFloor))return x.floor===atFloor?-1:1;
   return x.floor.localeCompare(y.floor)||x.work.name.localeCompare(y.work.name);
  });
  const next=candidates[0];remaining.splice(remaining.indexOf(next.id),1);
  stops.push(next);at=next.room;
 }
 return stops;
}
function availableRows(){
 const shown=viewable(),selected=data().plan;
 if(!shown.length)return '<div class="rt-empty">No routable works yet. An administrator needs to mark works <strong>On display</strong> and assign a gallery from the official map. Works with unconfirmed display status are excluded.</div>';
 return '<div class="rt-available">'+shown.map(a=>{
  const loc=artStatus(a),isSelected=selected.includes(a.id);
  return '<label><input type="checkbox" data-route-select="'+a.id+'" '+(isSelected?'checked':'')+'><div><strong>'+esc(a.artist)+' · '+esc(a.name)+'</strong><small>'+esc(roomLabel(loc.room))+(state.found.includes(a.id)?' · Already discovered':'')+'</small></div></label>';
 }).join('')+'</div>';
}
function stepText(path){
 if(!path||path.length===0)return '<div class="rt-route-warning">No accessible, staff-defined path connects these rooms yet. Use the museum’s official map; do not treat the suggested visit order as walking directions.</div>';
 if(path.length===1)return '<p>You are already at this destination.</p>';
 return path.slice(1).map((node,i)=>{
  const before=path[i],r=data().rooms[node],edge=edgeFor(before,node);
  const mode=edge?.type==='stairs'?'Take stairs to':edge?.type==='elevator'?'Use the elevator to':edge?.type==='outdoor'?'Use the outdoor passage to':'Continue to';
  return '<p>↳ '+esc(mode+' '+r.name+' · '+r.floor)+(edge?.note?' · '+esc(edge.note):'')+'</p>';
 }).join('');
}
function routeResults(){
 const chosen=computed();
 if(!chosen.length)return '';
 const reachable=chosen.filter(x=>x.reachable).length;
 const warning=chosen.some(x=>!x.reachable);
 return '<div class="rt-panel"><div class="rt-kicker">YOUR SELECTED EXPERIENCE</div><h3>'+chosen.length+' artwork'+(chosen.length===1?'':'s')+' on your route</h3>'+
 '<p>'+(warning?'Some spaces are not yet connected in the museum editor. This is a room/floor itinerary, not a complete walking route.':'The order below uses shortest available connections entered by the administrator, not verified travel-time estimates.')+'</p>'+
 chosen.map((s,i)=>'<div class="rt-route-stop"><span>'+(i+1)+'</span><div><strong>'+esc(s.work.artist)+'</strong><p>'+esc(s.work.name)+'</p><small>⌖ '+esc(roomLabel(s.room))+'</small></div></div>'+
 (s.reachable?'<div class="rt-path">'+stepText(s.path)+'</div>':'<div class="rt-route-warning">Connection from previous stop unavailable. See the official museum map for how to reach this room.</div>')).join('')+
 (warning?'<div class="rt-note">For safe and accurate routing, staff must connect rooms on the actual floor plan and verify elevator access. TRACE has not invented missing corridors.</div>':'')+
 '<div class="rt-stats"><div class="rt-stat"><strong>'+chosen.length+'</strong><small>Stops planned</small></div><div class="rt-stat"><strong>'+reachable+'</strong><small>Connected</small></div><div class="rt-stat"><strong>'+chosen.filter(x=>state.found.includes(x.work.id)).length+'</strong><small>Already solved</small></div></div>'+
 '<button class="rt-btn alt" type="button" data-route-clear-plan>Clear my itinerary</button></div>';
}
function findCurrent(){
 const target=A.find(a=>a.id===state.mapFocusId)||A[Math.min(state.current,A.length-1)];
 if(!target)return '';
 const info=artStatus(target),loc=data().rooms[info.room];
 return '<div class="rt-panel"><div class="rt-kicker">FIND A SPECIFIC ARTWORK</div><h3>'+esc(target.artist)+'</h3><p>'+esc(target.name)+'</p>'+
 (artAvailable(target)?'<p><span class="rt-pill on">MARKED ON VIEW</span> · '+esc(roomLabel(info.room))+'</p><button class="rt-btn" type="button" data-route-add-current="'+target.id+'">+ Add this artwork to my route</button>':
 '<div class="rt-note">'+(info.status==='off'?'The administrator marked this work off display.':'The work’s current display location is unconfirmed or incomplete.')+' TRACE cannot direct you to it until it is confirmed on view and a room has been assigned.</div>')+
 '</div>';
}
function visitor(){
 const m=MAPS[state.venue],active=data().mapView,shown=viewable();
 const roomsWithWorks=shown.length;
 return '<div class="rt-screen">'+banner(false)+
 '<div class="rt-note">The published floor plan is authentic, but this demo does not know which artworks are on view until they are assigned by an administrator. All changes are local to this browser.</div>'+
 '<div class="rt-tabs"><button type="button" data-route-view="find" class="'+(active==='find'?'active':'')+'">⌖ Find & plan</button><button type="button" data-route-view="plan" class="'+(active==='plan'?'active':'')+'">▦ Floor plan</button></div>'+
 (active==='plan'?mapDocument()+'<div class="rt-actions"><a class="rt-btn alt" href="'+m.url+'" target="_blank" rel="noopener noreferrer">Open full official map ↗</a></div><div class="rt-panel"><h3>Rooms on view</h3>'+shown.map(a=>'<div class="rt-activity"><div><strong>'+esc(a.artist)+'</strong><small>'+esc(roomLabel(artStatus(a).room))+'</small></div></div>').join('')+(shown.length?'':'<p>None confirmed yet.</p>')+'</div>':
 findCurrent()+
 '<div class="rt-panel"><div class="rt-kicker">DESIGN YOUR VISIT</div><h3>Choose the artworks</h3><p>Only works marked on display with a valid room appear here. Unavailable works are removed from route calculations automatically.</p>'+
 '<div class="rt-stats"><div class="rt-stat"><strong>'+roomsWithWorks+'</strong><small>Available now</small></div><div class="rt-stat"><strong>'+data().links.length+'</strong><small>Entered room links</small></div><div class="rt-stat"><strong>'+data().plan.filter(id=>shown.some(a=>a.id===id)).length+'</strong><small>Chosen stops</small></div></div>'+
 availableRows()+
 '<div class="rt-join"><label>Starting location<select data-route-start>'+roomsOptions(data().start,'Start at museum entrance')+'</select></label>'+
 '<label>Route preference<select data-route-access><option value="stepfree" '+(data().accessible?'selected':'')+'>Step-free (avoid stairs)</option><option value="any" '+(!data().accessible?'selected':'')+'>All staff-entered links</option></select></label></div>'+
 '<div class="rt-actions"><button class="rt-btn alt" type="button" data-route-select-all>Select every on-view work</button><button class="rt-btn alt" type="button" data-route-view="plan">View official floor plan</button></div></div>'+
 routeResults()+
 '<div class="rt-panel"><h3>Official map</h3><p>'+esc(m.description)+'</p><a href="'+m.url+'" target="_blank" rel="noopener noreferrer" class="rt-btn alt">Open museum floor plan ↗</a></div>')+
 '</div>';
}
function render(v){
 if(state.tab==='museum'){v.innerHTML=editor();return true}
 if(state.tab==='map'){v.innerHTML=visitor();return true}
 return false;
}
function update(){
 persist();const view=document.getElementById('view');if(view&&typeof window.__traceAppRender==='function')window.__traceAppRender();
}
function safeId(id){return !!id&&Object.prototype.hasOwnProperty.call(data().rooms,id)}
function addLink(){
 const a=document.getElementById('rt-link-a')?.value,b=document.getElementById('rt-link-b')?.value;
 const type=document.getElementById('rt-link-type')?.value,note=document.getElementById('rt-link-note')?.value.trim().slice(0,90)||'';
 if(!safeId(a)||!safeId(b)||a===b){alert('Select two different existing locations.');return}
 if(data().links.some(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a))){alert('Those locations are already connected.');return}
 if(!['corridor','stairs','elevator','outdoor'].includes(type))return;
 data().links.push({a,b,type,note});update();
}
function addRoom(){
 const name=document.getElementById('rt-new-name')?.value.trim().slice(0,85);
 const floor=document.getElementById('rt-new-floor')?.value.trim().slice(0,80);
 if(!name||!floor){alert('Enter the room name and its floor / pavilion.');return}
 const id='custom-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*1000);
 data().rooms[id]={name,floor,kind:'gallery',official:false};update();
}
function exportConfig(){
 const blob=new Blob([JSON.stringify({venue:state.venue,config:data(),source:MAPS[state.venue].url,note:'Local prototype, not a museum-approved published map'},null,2)],{type:'application/json'});
 const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='TRACE-'+state.venue+'-museum-config.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
document.addEventListener('change',event=>{
 const e=event.target;
 if(e.dataset.routeStatus){const id=e.dataset.routeStatus;if(!A.some(a=>a.id===id))return;data().artworks[id]={...artStatus({id}),status:e.value};update();return}
 if(e.dataset.routeAssign){const id=e.dataset.routeAssign;if(!A.some(a=>a.id===id)||e.value&&!safeId(e.value))return;data().artworks[id]={...artStatus({id}),room:e.value};update();return}
 if(e.dataset.routeSelect){const id=e.dataset.routeSelect;if(!A.some(a=>a.id===id&&artAvailable(a)))return;const plan=data().plan;data().plan=e.checked?[...new Set([...plan,id])]:plan.filter(x=>x!==id);update();return}
 if(e.dataset.routeStart){if(safeId(e.value))data().start=e.value;update();return}
 if(e.dataset.routeAccess){data().accessible=e.value==='stepfree';update();return}
});
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-route-add-room],[data-route-delete-room],[data-route-link],[data-route-remove-link],[data-route-view],[data-route-open-map],[data-route-select-all],[data-route-clear-plan],[data-route-add-current],[data-route-export],[data-route-clear]');
 if(!b)return;
 event.preventDefault();event.stopImmediatePropagation();
 const d=b.dataset;
 if(d.routeAddRoom!==undefined){addRoom();return}
 if(d.routeDeleteRoom!==undefined){const id=d.routeDeleteRoom,r=data().rooms[id];if(!r||r.official)return;if(A.some(a=>artStatus(a).room===id)){alert('Move the assigned artworks before deleting this room.');return}delete data().rooms[id];data().links=data().links.filter(x=>x.a!==id&&x.b!==id);update();return}
 if(d.routeLink!==undefined){addLink();return}
 if(d.routeRemoveLink!==undefined){const n=Number(d.routeRemoveLink);if(Number.isInteger(n)&&n>=0&&n<data().links.length){data().links.splice(n,1);update()}return}
 if(d.routeView){data().mapView=d.routeView;update();return}
 if(d.routeOpenMap!==undefined){state.tab='map';data().mapView='find';document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('selected',b.dataset.tab==='map'));update();return}
 if(d.routeAddCurrent){const id=d.routeAddCurrent;if(A.some(a=>a.id===id&&artAvailable(a)))data().plan=[...new Set([...data().plan,id])];update();return}
 if(d.routeSelectAll!==undefined){data().plan=viewable().map(a=>a.id);update();return}
 if(d.routeClearPlan!==undefined){data().plan=[];update();return}
 if(d.routeExport!==undefined){exportConfig();return}
 if(d.routeClear!==undefined){
  if(!confirm('Clear ALL local exhibition statuses, room edits and corridor links for this museum? Your discovery history is unaffected.'))return;
  db[state.venue]=null;seed(state.venue);update();return
 }
},true);
window.TRACE_ROUTER={render,graphPath,computed,artAvailable,viewable,MAPS,get data(){return data()},get db(){return db}};
})();