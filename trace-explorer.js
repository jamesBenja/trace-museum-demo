/* TRACE Explorer shell v1: a child-first adventure layer for the MMFA.
 *
 * Design contract
 * - The benchmark is a six-year-old leading their family through the museum.
 * - Mica speaks first; every screen has ONE obvious next action.
 * - Reading is optional: every Mica line has a 🔊 button and an auto-read mode
 *   (device speech synthesis, nothing leaves the device).
 * - Recognition, scanning fallbacks, games, wayfinding data, admin and the
 *   other museums are untouched. This layer only restructures what is shown.
 * - Navigation is honest: the treasure trail shows routes from the museum's
 *   own graph, and never claims to know where the visitor is standing.
 *
 * Integration: wraps the global render() after all other modules load, then
 * either replaces (start screen, adventure hub) or restructures (clue, reveal,
 * story, success, collection, map) the MMFA screens. All data attributes the
 * existing handlers rely on (data-action, data-t1-*, data-review-work…) are
 * preserved, so behaviour and tests stay attached to the same controls.
 */
(function(){
'use strict';
const X=window.TRACE_EXPLORER_CONTENT;
if(!X||typeof window.render!=='function')return;
const V1=()=>window.TRACE_V1,D=()=>window.TRACE_DISPLAY,R=()=>window.TRACE_ROUTING;
const KEY='trace-explorer-v1';
let mine={autoRead:null,spied:{}};
try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');if(s&&typeof s==='object')mine={...mine,...s}}catch(e){}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(mine))}catch(e){}}

// First visit: default to Little Explorers, the audience this cycle is built for.
(function defaultTier(){
 try{
  const stored=JSON.parse(localStorage.getItem('trace-v1-play')||'{}');
  if(!stored.age&&V1()?.prefs){V1().prefs.age='5-7';localStorage.setItem('trace-v1-play',JSON.stringify({...stored,...V1().prefs,age:'5-7'}))}
 }catch(e){}
})();

const LANGS=['en','fr','es'];
const lang=()=>LANGS.includes(state.lang)?state.lang:'en';
const u=k=>(X.UI[lang()]||X.UI.en)[k]??X.UI.en[k]??k;
const pick=o=>o?(o[lang()]??o.en):undefined;
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const enabled=()=>state.venue==='mmfa';
const tier=()=>{const a=V1()?.prefs?.age;return a==='5-7'?'little':a==='teen'?'curious':'detective'};
const autoRead=()=>mine.autoRead===null?tier()==='little':!!mine.autoRead;
const arts=()=>D()?D().activeWorks(state.venue):A;
const isFound=id=>state.found.includes(id);
const roomId=id=>D()?.rec(id)?.room||'';
const roomRec=id=>(D()?.rooms(state.venue)||[]).find(r=>r.id===id)||null;
const work=id=>X.WORKS[id]||null;
const tierCopy=(id,t=tier())=>pick(work(id)?.[t]);
const OUTDOOR_WALK={en:'Outdoor sculpture walk',fr:'Promenade des sculptures',es:'Paseo de esculturas'};

/* ------------------------------------------------------------ speech ---- */
const VOICE_LANG={en:'en-CA',fr:'fr-CA',es:'es-ES'};
function say(text){
 if(!text||!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance!=='function')return false;
 try{
  speechSynthesis.cancel();
  const ut=new SpeechSynthesisUtterance(String(text).replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu,''));
  const code=VOICE_LANG[lang()];ut.lang=code;
  const voices=speechSynthesis.getVoices();
  ut.voice=voices.find(v=>v.lang===code)||voices.find(v=>v.lang?.startsWith(lang()))||null;
  ut.rate=.9;ut.pitch=1.12;
  speechSynthesis.speak(ut);window.__traceLastSpoken=ut.text;return true;
 }catch(e){return false}
}
const sayBtn=text=>'<button type="button" class="ex-say" data-ex-say="'+esc(text)+'" aria-label="'+esc(u('listen'))+'"><span aria-hidden="true">🔊</span></button>';

/* ------------------------------------------------------------- pieces --- */
function mica(id,size){
 const themed=id&&window.TRACE_MICA?.has(id);
 return themed?'<div class="t1-mica tm-mica-context ex-mica '+(size||'')+'" aria-hidden="true">'+window.TRACE_MICA.svg(id)+'</div>':
  '<div class="ex-mica ex-mica-plain '+(size||'')+'" aria-hidden="true"></div>';
}
function bubble(text,opts={}){
 return '<div class="ex-bubble'+(opts.big?' ex-bubble-big':'')+'"'+(opts.auto?' data-ex-autosay="'+esc(text)+'"':'')+'>'+mica(opts.id,opts.big?'ex-mica-big':'')+
  '<div class="ex-speech"><span class="ex-speaker">MICA</span><p>'+esc(text)+'</p>'+sayBtn(text)+'</div></div>';
}
function gems(){
 const list=arts();
 return '<div class="ex-gems" role="img" aria-label="'+state.found.filter(id=>list.some(a=>a.id===id)).length+' '+esc(u('of'))+' '+list.length+'">'+
  list.map(a=>'<span class="ex-gem'+(isFound(a.id)?' on':'')+'">'+(isFound(a.id)?esc(work(a.id)?.icon||'✦'):'')+'</span>').join('')+'</div>';
}
function floorText(r){
 if(!r)return '';
 if(r.floor==='Outdoor')return u('outside');
 if(r.floor==='Unconfirmed')return '';
 return u('floor')+' '+r.floor;
}
function kidRoom(id){const k=X.ROOM_KID[id];return k?{icon:k.icon,name:pick(k)}:{icon:'🏛️',name:roomRec(id)?.label||''}}

/* Group the visit into STOPS. A stop is a room, except consecutive outdoor
   locations, which form one sculpture walk (they are a few steps apart). */
function stops(){
 const out=[];
 for(const a of arts()){
  const rid=roomId(a.id),r=roomRec(rid),last=out[out.length-1];
  const outdoor=r?.floor==='Outdoor';
  if(last&&(last.rooms.includes(rid)||(outdoor&&last.outdoor))){last.works.push(a);if(!last.rooms.includes(rid))last.rooms.push(rid);continue}
  out.push({rooms:[rid],works:[a],outdoor});
 }
 return out.map((s,i)=>({...s,index:i,done:s.works.every(a=>isFound(a.id)),count:s.works.filter(a=>isFound(a.id)).length,
  name:s.outdoor&&s.rooms.length>1?pick(OUTDOOR_WALK):kidRoom(s.rooms[0]).name,icon:kidRoom(s.rooms[0]).icon,floor:floorText(roomRec(s.rooms[0]))}));
}

/* Next treasure: stay in the same room while it still hides one; otherwise
   follow the curated gallery order (display order) so nobody backtracks. */
function chooseNext(fromId){
 const list=arts().filter(a=>!isFound(a.id)&&a.id!==fromId);
 if(!list.length)return null;
 const here=fromId?roomId(fromId):'';
 const same=list.find(a=>here&&roomId(a.id)===here);
 if(same)return same;
 if(fromId){
  const s=stops(),cur=s.find(x=>x.works.some(a=>a.id===fromId));
  const sameStop=cur&&list.find(a=>cur.works.some(w=>w.id===a.id));
  if(sameStop)return sameStop;
 }
 return list[0];
}

/* Kid-sized directions from the museum's own room graph: only the moments a
   child must act on (change floor, enter the underground passage, go outside,
   walk into another pavilion). Gallery-by-gallery detail stays on the map. */
const WING_KID={
 'Jean-Noël Desmarais':{en:'Desmarais Pavilion',fr:'Pavillon Desmarais',es:'Pabellón Desmarais'},
 'Hornstein Pavilion for Peace':{en:'Pavilion for Peace',fr:'Pavillon pour la Paix',es:'Pabellón por la Paz'},
 'Claire and Marc Bourgie':{en:'Bourgie Pavilion',fr:'Pavillon Bourgie',es:'Pabellón Bourgie'},
 'Liliane and David M. Stewart':{en:'Stewart Pavilion',fr:'Pavillon Stewart',es:'Pabellón Stewart'},
 'Michal and Renata Hornstein':{en:'Hornstein Pavilion',fr:'Pavillon Hornstein',es:'Pabellón Hornstein'}
};
const PASSAGE={en:'Underground passage',fr:'Passage souterrain',es:'Pasaje subterráneo'};
function legSteps(fromRoom,toRoom){
 const RT=R();if(!RT||!fromRoom||!toRoom||fromRoom===toRoom)return null;
 const approved=RT.route(fromRoom,toRoom,false),path=approved||RT.route(fromRoom,toRoom,true);
 if(!path)return null;
 const steps=[];
 const add=s=>{const last=steps[steps.length-1];
  if(last&&last.kind==='floor'&&s.kind==='floor')steps[steps.length-1]=s; // merge consecutive floor changes
  else if(!last||last.text!==s.text)steps.push(s)};
 for(let i=0;i<path.edges.length;i++){
  const e=path.edges[i],src=roomRec(path.rooms[i]),dst=roomRec(path.rooms[i+1]);if(!dst||!src)continue;
  if(e.type==='elevator'||e.type==='stairs'){add({kind:'floor',icon:e.type==='elevator'?'🛗':'🪜',text:floorText(dst)});continue}
  if(dst.floor==='Outdoor'&&src.floor!=='Outdoor'){add({kind:'out',icon:'🌳',text:u('outside')});continue}
  if(dst.floor==='Outdoor')continue;
  if(dst.id==='mmfa-passage'){add({kind:'passage',icon:'🚇',text:pick(PASSAGE)});continue}
  if(src.id==='mmfa-passage')continue; // arriving from the passage: the goal chip names the pavilion
  if(src.wing!==dst.wing){const w=WING_KID[dst.wing];add({kind:'walk',icon:'🚶',text:w?pick(w):kidRoom(dst.id).name})}
 }
 return {steps,suggested:!approved||path.research===true};
}
function legChips(leg){
 if(!leg||!leg.steps.length)return '';
 return '<div class="ex-leg-chips">'+leg.steps.map(s=>'<span class="ex-chip"><b aria-hidden="true">'+s.icon+'</b>'+esc(s.text)+'</span>').join('<span class="ex-chip-arrow" aria-hidden="true">›</span>')+'</div>';
}
function startRoom(){return R()?.MAPS?.[state.venue]?.startRoom||'mmfa-entrance'}
function lastFoundId(){const list=arts();for(let i=state.found.length-1;i>=0;i--)if(list.some(a=>a.id===state.found[i]))return state.found[i];return null}

function spot(a,i,nextId,n){
 const idx=A.findIndex(x=>x.id===a.id),done=isFound(a.id),open=done||i<=n+1,isNext=a.id===nextId;
 const label=done?pick(work(a.id)?.short)||a.name:u('mystery')+' '+(i+1);
 return '<button type="button" class="ex-spot'+(done?' found':isNext?' next':open?' open':' locked')+'" data-t1-open="'+idx+'"'+(open?'':' disabled')+' aria-label="'+esc(open?label:u('locked'))+'">'+
  '<span class="ex-spot-disc">'+(done?'<img src="'+esc(img(a))+'" alt="" loading="lazy">':isNext?'<b>?</b>':open?'<b>?</b>':'<b>🔒</b>')+'</span>'+
  '<span class="ex-spot-label">'+esc(label)+'</span></button>';
}
function trail(opts={}){
 const list=arts(),n=list.filter(a=>isFound(a.id)).length,s=stops(),last=lastFoundId();
 const nextArt=chooseNext(last&&!list.every(a=>isFound(a.id))?last:null),nextId=nextArt?.id;
 let prevRoom=startRoom(),html='<ol class="ex-trail'+(opts.map?' ex-trail-map':'')+'">';
 html+='<li class="ex-trail-start"><span aria-hidden="true">🚪</span>'+esc(u('youAreHere'))+' · '+esc(kidRoom(startRoom()).name)+'</li>';
 s.forEach((stop,k)=>{
  const leg=legSteps(prevRoom,stop.rooms[0]);
  html+='<li class="ex-leg">'+legChips(leg)+(opts.map&&leg?.suggested?'<small>'+esc(u('suggested'))+'</small>':'')+'</li>';
  const holdsLast=last&&stop.works.some(a=>a.id===last);
  html+='<li class="ex-stop'+(stop.done?' done':'')+(stop.works.some(a=>a.id===nextId)?' current':'')+'">'+
   '<div class="ex-stop-head"><span class="ex-stop-icon" aria-hidden="true">'+stop.icon+'</span><div><b>'+esc(stop.name)+'</b>'+(stop.floor?'<small>'+esc(stop.floor)+'</small>':'')+'</div>'+
   '<span class="ex-stop-badge'+(stop.done?' done':'')+'">'+(stop.done?'★ '+esc(u('roomDone')):stop.count+'/'+stop.works.length)+'</span></div>'+
   '<div class="ex-spots">'+stop.works.map(a=>spot(a,list.indexOf(a),nextId,n)).join('')+'</div>'+
   (holdsLast?'<div class="ex-here">📍 '+esc(u('here'))+'</div>':'')+'</li>';
  prevRoom=stop.rooms[stop.rooms.length-1];
 });
 return html+'</ol>';
}

/* --------------------------------------------------------- the screens -- */
function startScreen(){
 const opening=typeof V7_OPENINGS!=='undefined'?V7_OPENINGS[lang()]?.mmfa:null;
 const age=V1()?.prefs?.age;
 return '<div class="t1-screen ex-screen ex-start">'+
  '<div class="ex-start-stage" aria-hidden="true"><span class="ex-star s1">✦</span><span class="ex-star s2">✧</span><span class="ex-star s3">✦</span>'+mica(null,'ex-mica-hero')+'</div>'+
  '<h2 class="ex-title">'+esc(opening?.title||'The Lost Colours')+'</h2>'+
  bubble(u('hello'),{auto:true})+
  '<h3 class="ex-label">'+esc(u('who'))+'</h3>'+
  '<div class="ex-tiers" role="group" aria-label="'+esc(u('who'))+'">'+X.TIERS.map(t=>'<button type="button" class="ex-tier'+(age===t.age?' selected':'')+'" data-t1-age="'+t.age+'" aria-pressed="'+(age===t.age)+'"><span class="ex-tier-icon" aria-hidden="true">'+t.icon+'</span><b>'+esc(pick(t.label))+'</b><small>'+esc(pick(t.range))+'</small></button>').join('')+'</div>'+
  '<div class="ex-modes" role="group">'+[['family','👨‍👩‍👧',{en:'With my family',fr:'En famille',es:'En familia'}],['solo','🔎',{en:'On my own',fr:'Tout seul',es:'Yo solo'}]].map(([m,i,l])=>'<button type="button" class="ex-mode'+(V1()?.prefs?.mode===m?' selected':'')+'" data-t1-mode="'+m+'" aria-pressed="'+(V1()?.prefs?.mode===m)+'"><span aria-hidden="true">'+i+'</span>'+esc(pick(l))+'</button>').join('')+'</div>'+
  '<button type="button" class="ex-go" data-t1-start><span aria-hidden="true">▶</span> '+esc(u('go'))+'</button>'+
  '<div class="ex-row"><div class="v7-language ex-langs">'+LANGS.map(c=>'<button type="button" data-lang="'+c+'" class="'+(lang()===c?'active':'')+'" aria-pressed="'+(lang()===c)+'">'+c.toUpperCase()+'</button>').join('')+'</div>'+
  '<button type="button" class="ex-toggle'+(autoRead()?' on':'')+'" data-ex-autoread aria-pressed="'+autoRead()+'"><span aria-hidden="true">🔊</span> '+esc(u('autoRead'))+'</button></div>'+
  '<details class="ex-grownups"><summary>'+esc(u('grownups'))+'</summary>'+
  '<div class="venueSelect ex-venues">'+[['mmfa','MONTRÉAL · MMFA'],['pamm','MIAMI · PAMM'],['moma','NEW YORK · MoMA']].map(([v,l])=>'<button type="button" data-venue="'+v+'" class="'+(state.venue===v?'chosen':'')+'">'+l+'</button>').join('')+'</div>'+

  '<p class="tiny">'+esc({en:'Independent prototype, not endorsed by the museum. Ask staff before photographing art. Photos and progress stay on this device.',fr:'Prototype indépendant, non approuvé par le musée. Demandez au personnel avant de photographier. Photos et progrès restent sur cet appareil.',es:'Prototipo independiente, no avalado por el museo. Pregunta al personal antes de fotografiar. Las fotos y el progreso quedan en este dispositivo.'}[lang()])+'</p></details></div>';
}

function hubLine(){
 const list=arts(),n=list.filter(a=>isFound(a.id)).length;
 if(!list.length)return {en:'The museum is updating this adventure. Come back soon!',fr:'Le musée met à jour cette aventure. Reviens bientôt !',es:'El museo está actualizando esta aventura. ¡Vuelve pronto!'}[lang()];
 if(n===list.length)return u('allDone');
 const next=chooseNext(lastFoundId());
 const last=lastFoundId();
 if(next&&last&&roomId(next.id)===roomId(last))return u('sameRoom');
 if(n===0)return {en:'Our first treasure is waiting. Tap the big button and I will give you a clue!',fr:'Notre premier trésor nous attend. Touche le gros bouton et je te donne un indice !',es:'Nuestro primer tesoro nos espera. ¡Toca el botón grande y te daré una pista!'}[lang()];
 return (list.length-n)+' '+u('stopsLeft')+'! '+u('nextRoom');
}
function hubScreen(){
 const list=arts(),n=list.filter(a=>isFound(a.id)).length,done=list.length&&n===list.length;
 const maxPairs=Math.min(10,list.length*(list.length-1)/2);
 return '<div class="t1-screen ex-screen ex-hub">'+
  bubble(hubLine(),{auto:true,big:true})+gems()+
  (done?'<button type="button" class="ex-go" data-action="album"><span aria-hidden="true">🏆</span> '+esc(u('treasures'))+'</button>':
   list.length?'<button type="button" class="ex-go" data-ex-next><span aria-hidden="true">▶</span> '+esc(u('next'))+'</button>':'')+
  '<section class="ex-map-sheet" aria-label="'+esc(u('trail'))+'"><div class="t1-overline ex-sheet-tag">A MAGICAL QUEST MAP</div><h3 class="ex-sheet-title">'+esc(u('trail'))+'</h3>'+trail()+'</section>'+
  '<div class="ex-quick">'+
   '<button type="button" class="ex-quick-btn" data-action="map"><span aria-hidden="true">🗺️</span>'+esc(u('mapHeading'))+'</button>'+
   '<button type="button" class="ex-quick-btn" data-action="album"><span aria-hidden="true">🏆</span>'+esc(u('treasures'))+'</button>'+
   (n>=2?'<button type="button" class="ex-quick-btn" data-bonus-open><span aria-hidden="true">🔗</span>'+esc(u('connect'))+'</button>':'')+
  '</div>'+
  '<details class="ex-grownups"><summary>'+esc(u('grownups'))+'</summary>'+
  '<p class="t1-small">'+esc({en:'Up to '+maxPairs+' artwork connections can be unlocked. New works appear when museum staff confirm they are on view.',fr:'Jusqu’à '+maxPairs+' liens entre œuvres à débloquer. De nouvelles œuvres apparaissent quand le personnel confirme qu’elles sont exposées.',es:'Hasta '+maxPairs+' conexiones entre obras. Aparecen nuevas obras cuando el personal confirma que están expuestas.'}[lang()])+'</p>'+
  '<div class="t1-choose" role="group">'+X.TIERS.map(t=>'<button type="button" class="'+(V1()?.prefs?.age===t.age?'active':'')+'" data-t1-age="'+t.age+'">'+t.icon+' '+esc(pick(t.label))+'</button>').join('')+'</div>'+
  '<button type="button" class="ex-toggle'+(autoRead()?' on':'')+'" data-ex-autoread aria-pressed="'+autoRead()+'"><span aria-hidden="true">🔊</span> '+esc(u('autoRead'))+'</button>'+
  '<button class="button outline" type="button" data-action="map">⌖ '+esc({en:'Full museum map and route planner',fr:'Plan complet du musée et itinéraire',es:'Plano completo del museo y rutas'}[lang()])+'</button>'+
  '<button class="button ghost" type="button" data-t1-replay>'+esc(window.TRACE_WELCOME?.translations?.[lang()]?.replay||'Watch Mica’s welcome again')+'</button>'+
  '<button class="button ghost" type="button" data-action="reset">'+esc({en:'↻ Restart this museum quest',fr:'↻ Recommencer la quête de ce musée',es:'↻ Reiniciar la aventura de este museo'}[lang()])+'</button></details></div>';
}

/* Restructure the existing clue screen in place, keeping its controls. */
function enhanceClue(v){
 const a=A[state.current],screen=v.querySelector('.t1-screen');if(!a||!screen||screen.classList.contains('ex-screen'))return;
 screen.classList.add('ex-screen','ex-clue');
 const list=arts(),pos=list.findIndex(x=>x.id===a.id),t=tier(),copy=tierCopy(a.id),little=pick(work(a.id)?.little);
 const r=roomRec(roomId(a.id)),kr=kidRoom(roomId(a.id));
 // Header: treasure number + where it lives.
 // Keep the original heading for screen readers (and as the stable "MYSTERY n OF N" label).
 screen.querySelectorAll(':scope > .t1-overline:first-child, :scope > .t1-h1').forEach(n=>n.classList.add('ex-sr'));
 screen.querySelectorAll(':scope > .t1-progress').forEach(n=>n.remove());
 const head=document.createElement('div');head.className='ex-clue-head';
 head.innerHTML='<button type="button" class="ex-back" data-t1-hub aria-label="'+esc(u('trail'))+'">‹ <span>'+esc(u('trail'))+'</span></button>'+
  '<div class="ex-clue-count"><b>'+esc(u('treasure'))+' '+(pos+1)+'</b> '+esc(u('of'))+' '+list.length+'</div>'+gems()+
  '<div class="ex-roomchip"><span aria-hidden="true">'+kr.icon+'</span>'+esc(kr.name)+(floorText(r)?' · '+esc(floorText(r)):'')+'</div>';
 screen.prepend(head);
 // Mica speaks the tier clue.
 const line=t==='detective'?null:copy?.clue;
 const companion=screen.querySelector('.t1-companion');
 if(companion){
  const p=companion.querySelector('.t1-mica-line');
  const text=line||p?.textContent||'';
  if(p&&line)p.textContent=line;
  const label=companion.querySelector('.t1-mica-label');if(label)label.textContent='MICA';
  companion.classList.add('ex-bubble','ex-bubble-big');companion.dataset.exAutosay=text;
  const say=document.createElement('div');say.innerHTML=sayBtn(text);companion.querySelector('.t1-mica-line')?.after(say.firstChild);
 }
 // I-spy checklist and a body challenge.
 const kit=document.createElement('div');kit.className='ex-kit';
 const spyList=(t==='curious'?null:(copy?.look||little?.look))||[];
 const spied=mine.spied[a.id]||[];
 let kitHTML='';
 if(spyList.length)kitHTML+='<section class="ex-card ex-spy"><h3>'+esc(u('spy'))+'</h3><p class="ex-card-help">'+esc(u('spyHelp'))+'</p><div class="ex-spy-row">'+
  spyList.map(([icon,txt],i)=>'<button type="button" class="ex-spy-item'+(spied.includes(i)?' on':'')+'" data-ex-spy="'+i+'" aria-pressed="'+spied.includes(i)+'"><span aria-hidden="true">'+icon+'</span>'+esc(txt)+'</button>').join('')+'</div></section>';
 if(t==='little'&&little?.move)kitHTML+='<section class="ex-card ex-move"><h3>🤸 '+esc(u('doIt'))+'</h3><p>'+esc(little.move)+'</p>'+sayBtn(little.move)+'</section>';
 if(t==='curious'&&copy?.look)kitHTML+='<section class="ex-card ex-look"><h3>'+esc(u('deeper'))+'</h3><p>'+esc(copy.look)+'</p></section>';
 kit.innerHTML=kitHTML;(companion||head).after(kit);
 // One dock with three giant actions; the original buttons are MOVED, not copied.
 const scanBtn=screen.querySelector('[data-action="scan"],[data-action="photo-quest"]');
 const mapBtn=screen.querySelector('[data-action="map"]');
 const hintBtn=screen.querySelector('[data-action="hint"]');
 const dock=document.createElement('div');dock.className='ex-dock';
 const tile=(btn,icon,label,klass)=>{if(!btn)return;btn.className='ex-tile '+klass;btn.innerHTML='<span aria-hidden="true">'+icon+'</span><b>'+esc(label)+'</b>';dock.appendChild(btn)};
 tile(scanBtn,'📷',u('found'),'ex-tile-main');
 tile(mapBtn,'🧭',u('where'),'');
 if(hintBtn)tile(hintBtn,'💡',u('help'),'');
 else{const peek=document.createElement('button');peek.type='button';peek.dataset.exPeek='';tile(peek,'💡',u('peek'),'')}
 kit.after(dock);
 // How to get there, from the last treasure (or the entrance), in pictures.
 const from=lastFoundId()?roomId(lastFoundId()):startRoom(),leg=legSteps(from,roomId(a.id));
 const where=document.createElement('div');where.className='ex-card ex-where';
 where.innerHTML='<h3>'+esc(u('directions'))+'</h3>'+(leg?legChips(leg):'<p class="ex-card-help">'+esc(from===roomId(a.id)?u('sameRoom'):kr.name)+'</p>')+
  '<div class="ex-chip ex-chip-goal"><b aria-hidden="true">🎯</b>'+esc(kr.name)+(floorText(r)?' · '+esc(floorText(r)):'')+'</div>'+
  (r?.floor==='Outdoor'?'<p class="ex-card-help">⚠️ '+esc(u('outsideWarn'))+'</p>':'');
 dock.after(where);
 // The back link now lives in the header.
 screen.querySelectorAll(':scope > [data-t1-hub]').forEach(n=>n.remove());
}

function connectionLine(id){
 const before=state.found.filter(x=>x!==id&&arts().some(a=>a.id===x));
 for(let i=before.length-1;i>=0;i--){
  const prev=before[i],link=X.LINKS.find(l=>l.pair.includes(prev)&&l.pair.includes(id));
  if(link)return pick(link);
 }
 const mine_=work(id);if(!mine_)return null;
 for(let i=before.length-1;i>=0;i--){
  const other=work(before[i]);if(!other)continue;
  const shared=mine_.themes.find(th=>other.themes.includes(th));
  if(shared)return (X.THEME_LINE[lang()]||X.THEME_LINE.en).replace('{theme}',pick(X.THEMES[shared])).replace('{prev}',pick(other.short));
 }
 return null;
}

function enhanceReveal(v){
 const a=A[state.current],box=v.querySelector('.v7-reveal');if(!a||!box||box.classList.contains('ex-reveal'))return;
 box.classList.add('ex-reveal');
 const copy=pick(work(a.id)?.little),line=connectionLine(a.id);
 const extra=document.createElement('div');extra.className='ex-reveal-extra';
 extra.innerHTML='<div class="ex-confetti" aria-hidden="true">'+Array.from({length:18},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div>'+
  bubble(u('youFound')+' '+(tier()==='little'&&copy?.wow?copy.wow:''),{id:a.id,auto:true})+
  (line?'<div class="ex-card ex-link"><h3>🔗 '+esc(u('remember'))+'</h3><p>'+esc(line)+'</p>'+sayBtn(line)+'</div>':'');
 const cont=box.querySelector('[data-action="v7-story"]');
 if(cont){cont.classList.add('ex-go');cont.before(extra)}else box.appendChild(extra);
}

function enhanceFound(v){
 const a=A[state.current],panel=v.querySelector('.v7-panel');if(!a||!panel||panel.classList.contains('ex-found'))return;
 panel.classList.add('ex-found');
 const tag=panel.querySelector('.v7-tag');if(tag)tag.textContent=tag.textContent.replace(/\s*·\s*\d+\s*\/\s*\d+\s*$/,'');
 const t=tier(),little=pick(work(a.id)?.little),curious=pick(work(a.id)?.curious);
 const card=document.createElement('div');card.className='ex-found-kit';
 let html='';
 if(t==='little'&&little){
  html+=bubble(little.wow,{id:a.id,auto:true});
  html+='<section class="ex-card ex-ask"><h3>💬 '+esc(u('question'))+'</h3><p>'+esc(little.ask)+'</p>'+sayBtn(little.ask)+'</section>';
 }else if(t==='curious'&&curious){
  html+='<section class="ex-card ex-deep"><h3>'+esc(u('deeper'))+'</h3><p>'+esc(curious.deep)+'</p>'+sayBtn(curious.deep)+'</section>';
 }else if(little){
  html+='<section class="ex-card ex-ask"><h3>✨ '+esc(u('wow'))+'</h3><p>'+esc(little.wow)+'</p></section>';
 }
 card.innerHTML=html;
 const story=panel.querySelector('.v7-story');
 (panel.querySelector('img.photoTile')||story)?.after(card);
 const play=panel.querySelector('[data-action="v7-puzzle"]');
 if(play){play.classList.add('ex-go');play.innerHTML='<span aria-hidden="true">▶</span> '+esc(u('play'));panel.insertBefore(play,card.nextSibling)}
 if(t==='little'&&story){
  const more=document.createElement('details');more.className='ex-grownups ex-story-more';
  more.innerHTML='<summary>'+esc(u('grownups'))+'</summary>';story.before(more);more.appendChild(story);
  const lesson=panel.querySelector('.v7-lesson');if(lesson)more.appendChild(lesson);
 }
}

function enhanceSuccess(v){
 const a=A[state.current],screen=v.querySelector('.t1-screen,.v7-panel');if(!a||!screen||screen.classList.contains('ex-success'))return;
 screen.classList.add('ex-success');
 const next=chooseNext(a.id),nextBtn=screen.querySelector('[data-action="next"]')||screen.querySelector('[data-t1-hub]');
 const s=stops(),stop=s.find(x=>x.works.some(w=>w.id===a.id));
 const card=document.createElement('div');card.className='ex-card ex-next-card';
 if(!next){card.innerHTML='<h3>🏆 '+esc(u('allDone'))+'</h3>'+sayBtn(u('allDone'));card.dataset.exAutosay=u('allDone')}
 else{
  const same=roomId(next.id)===roomId(a.id)||(stop&&stop.works.some(w=>w.id===next.id));
  const leg=same?null:legSteps(roomId(a.id),roomId(next.id)),kr=kidRoom(roomId(next.id));
  const text=same?u('sameRoom'):u('nextRoom');
  card.dataset.exAutosay=text;
  card.innerHTML=(stop?.done?'<div class="ex-room-done">★ '+esc(u('roomDone'))+'</div>':'')+
   '<h3>'+(same?'👀 ':'🧭 ')+esc(text)+'</h3>'+sayBtn(text)+(leg?legChips(leg):'')+
   (same?'':'<div class="ex-chip ex-chip-goal"><b aria-hidden="true">🎯</b>'+esc(kr.name)+(floorText(roomRec(roomId(next.id)))?' · '+esc(floorText(roomRec(roomId(next.id)))):'')+'</div>');
 }
 const anchor=screen.querySelector('.mf-mica-conclusion,.pg-mica-conclusion')||screen.firstElementChild;
 anchor?.after(card);
 const go=document.createElement('button');go.type='button';go.className='ex-go';
 if(next){go.dataset.exAdvance='';go.innerHTML='<span aria-hidden="true">▶</span> '+esc(u('next'))}
 else{go.dataset.action='album';go.innerHTML='<span aria-hidden="true">🏆</span> '+esc(u('treasures'))}
 card.after(go);
 if(nextBtn){nextBtn.classList.add('ex-secondary');nextBtn.textContent='🗺️ '+u('trail');go.after(nextBtn)}
}

function enhanceAlbum(v){
 const panel=v.querySelector('.v7-panel');if(!panel||panel.querySelector('.ex-shelf'))return;
 const list=arts(),n=list.filter(a=>isFound(a.id)).length;
 const shelf=document.createElement('section');shelf.className='ex-shelf';
 shelf.innerHTML='<h2 class="ex-title ex-title-sm">'+esc(u('treasures'))+'</h2>'+gems()+
  (n?'':'<p class="ex-card-help">'+esc(u('collectionEmpty'))+'</p>')+
  '<div class="ex-frames">'+list.map((a,i)=>isFound(a.id)?
   '<button type="button" class="ex-frame found" data-review-work="'+a.id+'"><span class="ex-frame-art"><img src="'+esc(img(a))+'" alt="'+esc(a.name)+'" loading="lazy"></span><b>'+esc(pick(work(a.id)?.short)||a.name)+'</b><small>'+esc(a.artist)+'</small></button>':
   '<div class="ex-frame mystery"><span class="ex-frame-art"><b aria-hidden="true">?</b></span><b>'+esc(u('mystery'))+' '+(i+1)+'</b><small>'+esc(kidRoom(roomId(a.id)).icon+' '+kidRoom(roomId(a.id)).name)+'</small></div>').join('')+'</div>';
 panel.prepend(shelf);
 // The full passport stays available below for families.
 const tag=panel.querySelector(':scope > .v7-tag');if(tag)tag.classList.add('ex-passport-tag');
}

function enhanceMap(v){
 if(v.querySelector('.ex-mapcard'))return;
 const host=v.firstElementChild;if(!host)return;
 const card=document.createElement('section');card.className='ex-mapcard';
 card.innerHTML='<div class="ex-mapcard-head"><h2 class="ex-title ex-title-sm">🗺️ '+esc(u('mapHeading'))+'</h2>'+gems()+'</div>'+
  trail({map:true})+'<p class="ex-honest">ⓘ '+esc(u('noLive'))+'</p>';
 v.prepend(card);
}

/* ---------------------------------------------------------- the wrap ---- */
const base=window.render;
let lastSpokenKey='';
function explorerRender(){
 base.apply(this,arguments);
 const on=enabled();
 document.body.classList.toggle('ex-on',on);
 ['little','detective','curious'].forEach(t=>document.body.classList.toggle('ex-tier-'+t,on&&tier()===t));
 if(!on)return;
 const v=document.getElementById('view');if(!v)return;
 try{
  if(state.tab==='quest'){
   if(state.stage==='intro')v.innerHTML=startScreen();
   else if(state.stage==='hub'||state.stage==='complete'||(state.current>=A.length&&!['welcome','bonus'].includes(state.stage)))v.innerHTML=hubScreen();
   else if(state.stage==='clue')enhanceClue(v);
   else if(state.stage==='reveal')enhanceReveal(v);
   else if(state.stage==='found')enhanceFound(v);
   else if(state.stage==='success')enhanceSuccess(v);
  }else if(state.tab==='album'&&!state.reviewId)enhanceAlbum(v);
  else if(state.tab==='map')enhanceMap(v);
 }catch(e){console.error('TRACE explorer layer',e)}
 const key=state.tab+':'+state.stage+':'+state.current+':'+lang();
 if(key!==lastSpokenKey){
  lastSpokenKey=key;
  if(autoRead()&&state.tab==='quest'){const node=v.querySelector('[data-ex-autosay]');if(node)say(node.dataset.exAutosay)}
 }
}
window.render=explorerRender;
window.__traceAppRender=explorerRender;

const baseNext=window.next;
window.next=function(){
 if(!enabled())return baseNext.apply(this,arguments);
 const nextArt=chooseNext(A[state.current]?.id);
 if(nextArt){state.current=A.indexOf(nextArt);state.mapFocusId=nextArt.id}
 state.scanImage=null;state.result=null;
 stage(nextArt?'clue':'complete');
};

document.addEventListener('click',ev=>{
 const t=ev.target.closest('[data-ex-say],[data-ex-next],[data-ex-spy],[data-ex-autoread],[data-ex-peek],[data-ex-advance]');
 if(!t)return;
 ev.preventDefault();ev.stopPropagation();
 if(t.dataset.exSay!==undefined){say(t.dataset.exSay);return}
 if(t.dataset.exAdvance!==undefined){window.next();return}
 if(t.dataset.exAutoread!==undefined){mine.autoRead=!autoRead();persist();if(!mine.autoRead&&'speechSynthesis' in window)speechSynthesis.cancel();render();return}
 if(t.dataset.exNext!==undefined){
  const n=chooseNext(lastFoundId());if(!n)return;
  const i=A.indexOf(n);V1()?.openWork(i);
  if(state.stage!=='clue'||state.current!==i){state.current=i;state.mapFocusId=n.id;stage('clue')}
  return;
 }
 if(t.dataset.exSpy!==undefined){
  const id=A[state.current]?.id,i=Number(t.dataset.exSpy);if(!id)return;
  const list=mine.spied[id]||(mine.spied[id]=[]);
  const at=list.indexOf(i);if(at>=0)list.splice(at,1);else list.push(i);persist();
  t.classList.toggle('on',at<0);t.setAttribute('aria-pressed',String(at<0));
  const row=t.closest('.ex-spy');
  if(row&&row.querySelectorAll('.ex-spy-item.on').length===row.querySelectorAll('.ex-spy-item').length){
   row.classList.add('complete');const msg={en:'Sharp eyes! Now tap “I found it!”',fr:'Quels yeux de lynx ! Touche « Je l’ai trouvée ! »',es:'¡Qué buena vista! Toca «¡La encontré!»'}[lang()];
   let note=row.querySelector('.ex-spy-done');if(!note){note=document.createElement('p');note.className='ex-spy-done';row.appendChild(note)}
   note.textContent='✨ '+msg;if(autoRead())say(msg);
  }else row?.classList.remove('complete');
  return;
 }
 if(t.dataset.exPeek!==undefined){
  const trigger=document.querySelector('[data-t1-detail-reveal]');
  if(trigger)trigger.click();
  else document.querySelector('.t1-detail-section')?.scrollIntoView({behavior:'smooth',block:'center'});
 }
},true);

window.TRACE_EXPLORER={tier,stops,chooseNext,legSteps,connectionLine,say,get autoRead(){return autoRead()},content:X};
render();
})();
