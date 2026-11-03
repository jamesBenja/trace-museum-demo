/* TRACE Wayfinder: a single visitor map on top of the existing verified/research route graph.
   Locations are schematic gallery zones, not surveyed floor-plan coordinates.
   Geolocation is optional, one-shot, never sent to TRACE or persisted. */
(function(){
'use strict';
const MUSEUM={
 mmfa:{address:'1380 Sherbrooke Street West, Montreal, QC',center:[45.49870,-73.57939],zones:[['main','Desmarais'],['peace','Pavilion for Peace'],['bourgie','Bourgie'],['other','Other pavilions'],['outside','Outside']]},
 pamm:{address:'1103 Biscayne Boulevard, Miami, FL',center:[25.78603,-80.18632],zones:[['entry','Entrance'],['gallery','Galleries'],['outside','Outside']]},
 moma:{address:'11 West 53rd Street, New York, NY',center:[40.76161,-73.97755],zones:[['entry','Entrance'],['barr','Barr Galleries'],['geffen','Geffen Wing'],['gallery','Other galleries']]}
};
const WORDS={
 'Map':['Carte','Mapa'],'From':['Départ','Origen'],'Find':['Destination','Destino'],
 'Use location':['Me localiser','Usar ubicación'],'Museum plan':['Plan du musée','Plano del museo'],
 'Avoid stairs':['Éviter les escaliers','Evitar escaleras'],
 'Allow stairs':['Escaliers possibles','Permitir escaleras'],
 'Entrance':['Entrée','Entrada'],'Outside':['Extérieur','Exterior'],
 'Other pavilions':['Autres pavillons','Otros pabellones'],
 'Galleries':['Galeries','Galerías'],'Barr Galleries':['Galeries Barr','Galerías Barr'],
 'Other galleries':['Autres galeries','Otras galerías'],
 'Your route':['Votre parcours','Tu recorrido'],
 'Three':['Trois','Tres'],'All':['Tout','Todas'],'Choose':['Choisir','Elegir'],
 'Route available':['Parcours disponible','Ruta disponible'],
 'Route preview':['Parcours provisoire','Ruta provisional'],
 'Location only':['Emplacement seulement','Solo ubicación'],
 'Location unconfirmed':['Emplacement non confirmé','Ubicación sin confirmar'],
 'Here already':['Déjà sur place','Ya estás aquí'],
 'Floor not confirmed':['Étage non confirmé','Planta sin confirmar'],
 'No room assigned':['Salle non attribuée','Sala sin asignar'],
 'Schematic · not to scale':['Schéma · non à l’échelle','Esquema · sin escala'],
 'Connections unverified':['Passages non vérifiés','Conexiones sin verificar'],
 'Route not mapped':['Parcours non cartographié','Ruta sin cartografiar'],
 'Use the museum plan to reach this area.':['Consultez le plan du musée pour rejoindre cet endroit.','Consulta el plano del museo para llegar a esta zona.'],
 'On this floor':['À cet étage','En esta planta'],
 'Start here':['Départ ici','Empieza aquí'],
 'View clue':['Voir l’indice','Ver pista'],
 'Found':['Trouvée','Encontrada'],
 'Walk to entrance':['Itinéraire vers l’entrée','Cómo llegar a la entrada'],
 'Select your room':['Choisissez votre salle','Elige tu sala'],
 'GPS works outdoors; select your room indoors.':['Le GPS fonctionne dehors. Choisissez votre salle à l’intérieur.','El GPS funciona afuera. Elige tu sala dentro.'],
 'Location unavailable':['Localisation indisponible','Ubicación no disponible'],
 'Location permission denied':['Accès à la localisation refusé','Permiso de ubicación denegado'],
 'Near the museum · choose your room':['Près du musée · choisissez votre salle','Cerca del museo · elige tu sala'],
 'From your position':['Depuis votre position','Desde tu ubicación'],
 'Not available':['Indisponible','No disponible'],
 'Floor':['Étage','Planta'],
 'level':['niveau','nivel'],
 'See plan':['Voir le plan','Ver plano'],
 'Start':['Départ','Inicio'],
 'Destination':['Destination','Destino'],
 'Room confirmed':['Salle confirmée','Sala confirmada'],
 'Museum display not confirmed':['Exposition non confirmée','Exhibición sin confirmar'],
 'No route verified':['Aucun parcours validé','Ninguna ruta verificada'],
 'Continue':['Continuer','Continuar'],
 'Stairs':['Escaliers','Escaleras'],
 'Elevator':['Ascenseur','Ascensor'],
 'Passage':['Passage','Pasillo'],
 'Outdoor path':['Passage extérieur','Paso exterior'],
 'Unverified link':['Passage à confirmer','Conexión sin verificar']
};
const h=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const R=()=>window.TRACE_ROUTING,D=()=>window.TRACE_DISPLAY;
let locationInfo=null,centeredKey='';
function tr(key){
 const lang=window.TRACE_I18N?.language||state.lang||'en';
 return lang==='en'?key:(WORDS[key]?.[lang==='fr'?0:1]||key);
}
function area(room,museum){
 if(!room)return 'entry';
 const id=room.id||'',wing=(room.wing||'').toLowerCase();
 if(museum==='mmfa'){
  if(id==='mmfa-bourgie-front'||id==='mmfa-avenue-du-musee'||room.floor==='Outdoor')return 'outside';
  if(id.includes('peace'))return 'peace';
  if(id.includes('bourgie'))return 'bourgie';
  if(id.includes('stewart')||id.includes('hornstein'))return 'other';
  return 'main';
 }
 if(museum==='pamm'){
  if(room.floor==='Outdoor')return 'outside';
  return /^pamm-(1|2|7|14|35|37)$/.test(id)?'entry':'gallery';
 }
 if(id==='moma-entry')return 'entry';
 if(wing.includes('barr'))return 'barr';
 if(wing.includes('geffen'))return 'geffen';
 return 'gallery';
}
function floorLabel(f){
 return f==='Outdoor'?tr('Outside'):f==='Unconfirmed'?tr('Floor not confirmed'):(f?.startsWith('S')?'S'+f.slice(1):f);
}
function level(f){return f==='Outdoor'?tr('Outside'):f==='Unconfirmed'?tr('Floor not confirmed'):tr('Floor')+' '+f;}
function current(){
 const r=R();r.touch();
 const museum=state.venue,rooms=D()?.rooms(museum)||[],works=A.filter(a=>D()?.isActive(a.id)),s=r.state;
 const requested=works.find(a=>a.id===state.mapFocusId);
 if(requested&&s.focus!==requested.id){s.focus=requested.id;r.saveRoute()}
 const selected=works.find(a=>a.id===s.focus)||works.find(a=>!state.found.includes(a.id))||works[0]||null;
 const from=rooms.find(x=>x.id===s.start)||rooms.find(x=>x.id===r.MAPS[museum].startRoom)||null;
 const destination=selected?rooms.find(x=>x.id===D().rec(selected.id).room):null;
 const approved=from&&destination?r.route(from.id,destination.id):null;
 const preview=!approved&&from&&destination?r.route(from.id,destination.id,true):null;
 const verified=selected&&D()?.isVerified(selected.id)===true;
 return {museum,rooms,works,selected,from,destination,approved,preview,verified,s};
}
function groupName(room,ctx){
 return MUSEUM[ctx.museum].zones.find(z=>z[0]===area(room,ctx.museum))?.[1]||room?.wing||'';
}
function coordinates(ctx){
 const zones=MUSEUM[ctx.museum].zones;
 const route=ctx.approved||ctx.preview;
 const floors=[...new Set([
  ...ctx.works.map(a=>ctx.rooms.find(x=>x.id===D().rec(a.id).room)?.floor).filter(Boolean),
  ctx.from?.floor,
  ...(route?.rooms||[]).map(id=>ctx.rooms.find(x=>x.id===id)?.floor).filter(Boolean)
 ])];
 const weight=x=>x==='Unconfirmed'?-500:x==='Outdoor'?-400:x?.startsWith('S')?-Number(x.slice(1)):Number(x)||-300;
 floors.sort((a,b)=>weight(b)-weight(a));
 if(!floors.length)floors.push('1');
 const colW=154,rowH=92,left=58,top=60;
 const width=left+zones.length*colW+12,height=top+floors.length*rowH+12;
 const base=(room)=>({x:left+zones.findIndex(z=>z[0]===area(room,ctx.museum))*colW+colW/2,
  y:top+floors.indexOf(room.floor)*rowH+rowH/2});
 const relevant=new Map();
 for(const a of ctx.works){
  const room=ctx.rooms.find(x=>x.id===D().rec(a.id).room);
  if(!room)continue;
  if(!relevant.has(room.id))relevant.set(room.id,{room,works:[]});
  relevant.get(room.id).works.push(a);
 }
 const buckets=new Map(),pins=[];
 for(const entry of relevant.values()){
  const key=area(entry.room,ctx.museum)+'|'+entry.room.floor;
  if(!buckets.has(key))buckets.set(key,[]);
  buckets.get(key).push(entry);
 }
 for(const entries of buckets.values()){
  entries.forEach((entry,i)=>{
   const n=entries.length,p=base(entry.room);
   p.x+=(i-(n-1)/2)*Math.min(52,120/Math.max(1,n-1));
   p.y+=(i%2===1?10:0);
   pins.push({...entry,...p});
  });
 }
 const pos=id=>{
  const pin=pins.find(p=>p.room.id===id);
  return pin||base(ctx.rooms.find(x=>x.id===id));
 };
 return {zones,floors,colW,rowH,left,top,width,height,pins,pos};
}
function diagram(ctx){
 const map=coordinates(ctx),route=ctx.approved||ctx.preview,selectedId=ctx.selected?.id;
 let grid='';
 for(let i=0;i<map.floors.length;i++){
  const y=map.top+i*map.rowH;
  grid+='<div class="wf-floor-label" style="top:'+(y+34)+'px">'+h(floorLabel(map.floors[i]))+'</div>';
  grid+='<div class="wf-floor-line" style="top:'+(y+map.rowH-3)+'px"></div>';
 }
 const zoneHeaders=map.zones.map((z,i)=>'<div class="wf-zone" style="left:'+(map.left+i*map.colW)+'px;width:'+map.colW+'px">'+h(tr(z[1]))+'</div>').join('');
 const sectors=map.zones.map((z,i)=>'<div class="wf-sector" style="left:'+(map.left+i*map.colW+3)+'px;top:'+map.top+'px;width:'+(map.colW-6)+'px;height:'+(map.floors.length*map.rowH)+'px"></div>').join('');
 let line='';
 if(route&&route.rooms.length>1){
  const points=route.rooms.map(id=>{const p=map.pos(id);return Math.round(p.x)+','+Math.round(p.y)}).join(' ');
  line='<svg class="wf-lines" viewBox="0 0 '+map.width+' '+map.height+'" aria-hidden="true">'+
   '<polyline points="'+points+'" class="'+(ctx.approved?'wf-verified-path':'wf-preview-path')+'" />'+
   route.rooms.slice(1,-1).map(id=>{const p=map.pos(id);return '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" class="wf-waypoint"/>'}).join('')+
   '</svg>';
 }
 const from=ctx.from?map.pos(ctx.from.id):null;
 const origin=from?'<div class="wf-origin" style="left:'+from.x+'px;top:'+from.y+'px" title="'+h(tr('Start here'))+'"><span aria-hidden="true"></span><span class="wf-sr">'+h(tr('Start here'))+'</span></div>':'';
 const pins=map.pins.map(p=>{
  const isSelected=p.works.some(a=>a.id===selectedId),a=isSelected?p.works.find(a=>a.id===selectedId):p.works[0];
  const label=p.works.length>1?p.works.map(x=>x.artist.split(' ').slice(-1)[0]).join(' / '):a.artist.split(' ').slice(-1)[0];
  return '<button type="button" class="wf-pin '+(isSelected?'wf-selected':'')+'" data-wf-dest="'+h(a.id)+'" style="left:'+p.x+'px;top:'+p.y+'px" aria-pressed="'+isSelected+'" aria-label="'+h(p.works.map(x=>x.artist+' '+x.name).join(', '))+'">'+
   '<span class="wf-dot">'+(p.works.length>1?p.works.length:'')+'</span><span class="wf-pin-name">'+h(label)+'</span></button>';
 }).join('');
 return '<div class="wf-map-scroll" aria-label="'+h(tr('Map'))+'" tabindex="0"><div class="wf-diagram" style="width:'+map.width+'px;height:'+map.height+'px">'+
  sectors+grid+zoneHeaders+line+origin+pins+'</div></div>';
}
function roomsOptions(ctx){
 const grouped=new Map();
 for(const r of ctx.rooms){
  const key=groupName(r,ctx);
  if(!grouped.has(key))grouped.set(key,[]);
  grouped.get(key).push(r);
 }
 return [...grouped].map(([key,items])=>'<optgroup label="'+h(tr(key))+'">'+
  items.slice().sort((a,b)=>String(a.floor).localeCompare(String(b.floor),undefined,{numeric:true})).map(r=>
   '<option value="'+h(r.id)+'" '+(r.id===ctx.from?.id?'selected':'')+'>'+h(r.label)+' · '+h(floorLabel(r.floor))+'</option>').join('')+'</optgroup>').join('');
}
function workOptions(ctx){
 return ctx.works.map(a=>{
  const r=ctx.rooms.find(x=>x.id===D().rec(a.id).room);
  return '<option value="'+h(a.id)+'" '+(ctx.selected?.id===a.id?'selected':'')+'>'+h(a.artist+' · '+(r?level(r.floor):tr('No room assigned')))+'</option>';
 }).join('');
}
function uniqueSteps(ctx){
 const route=ctx.approved||ctx.preview;
 if(!route)return [];
 const out=[];
 route.rooms.forEach((id,i)=>{
  const r=ctx.rooms.find(x=>x.id===id);if(!r)return;
  const last=out[out.length-1];
  if(i===0||!last||last.zone!==area(r,ctx.museum)||last.floor!==r.floor||i===route.rooms.length-1){
   out.push({name:groupName(r,ctx),zone:area(r,ctx.museum),floor:r.floor,type:i?route.edges[i-1]?.type:null});
  }
 });
 return out;
}
function directions(ctx){
 if(!ctx.selected)return '<div class="wf-empty">'+h(tr('Not available'))+'</div>';
 const dest=ctx.destination,approved=ctx.approved,preview=ctx.preview;
 let type=!dest?tr('No room assigned'):!ctx.verified?tr('Location unconfirmed'):
  approved?.rooms.length===1?tr('Here already'):approved?tr('Route available'):preview?tr('Route preview'):tr('Location only');
 const status=approved?'ready':preview?'preview':'missing';
 const loc=dest?tr(groupName(dest,ctx))+' · '+level(dest.floor):tr('No room assigned');
 const steps=uniqueSteps(ctx);
 const sequence=steps.length>1?'<ol class="wf-directions">'+steps.map((step,i)=>
  '<li><span class="wf-step-mark">'+(i+1)+'</span><span><strong>'+h(tr(step.name))+'</strong><small>'+h(level(step.floor))+(step.type?' · '+h(tr(({stairs:'Stairs',elevator:'Elevator',outdoor:'Outdoor path',corridor:'Passage'})[step.type]||'Passage')):'')+'</small></span></li>').join('')+'</ol>':'';
 const notice=preview?'<div class="wf-qualification">'+h(tr('Connections unverified'))+'</div>':
  !approved&&dest?'<div class="wf-qualification">'+h(tr('Use the museum plan to reach this area.'))+'</div>':'';
 return '<div class="wf-route-card"><div class="wf-route-top"><div><span class="wf-kicker">'+h(type)+'</span>'+
  '<h3>'+h(ctx.selected.artist)+'</h3><p>'+h(loc)+'</p></div><button type="button" data-tn-open="'+h(ctx.selected.id)+'" class="wf-go">'+h(tr('View clue'))+'</button></div>'+
  (ctx.verified?'':('<div class="wf-qualification">'+h(tr('Museum display not confirmed'))+'</div>'))+
  (status==='ready'||status==='preview'?sequence:'')+notice+'</div>';
}
function stops(ctx){
 const plan=R().plannedOrder(),list=plan.ordered.filter(a=>ctx.works.includes(a)),s=ctx.s;
 const filters=[['quick','Three'],['all','All'],['custom','Choose']];
 const controls=filters.map(([mode,label])=>'<button type="button" data-tn-mode="'+mode+'" class="'+(s.mode===mode?'is-active':'')+'" aria-pressed="'+(s.mode===mode)+'">'+h(tr(label))+'</button>').join('');
 const pick=s.mode==='custom'?'<div class="wf-custom">'+ctx.works.map(a=>'<label><input type="checkbox" data-tn-select="'+h(a.id)+'" '+(s.selected.includes(a.id)?'checked':'')+'>'+h(a.artist)+'</label>').join('')+'</div>':'';
 return '<section class="wf-stops"><header><h3>'+h(tr('Your route'))+'</h3><div class="wf-modes">'+controls+'</div></header>'+pick+
  '<div class="wf-stop-list">'+list.map((a,i)=>{
   const r=ctx.rooms.find(x=>x.id===D().rec(a.id).room),active=ctx.selected?.id===a.id,done=state.found.includes(a.id);
   return '<button type="button" data-wf-dest="'+h(a.id)+'" class="wf-stop'+(active?' is-active':'')+'" aria-pressed="'+active+'">'+
    '<span class="wf-stop-index">'+(done?'✓':i+1)+'</span><span class="wf-stop-title"><strong>'+h(a.artist)+'</strong><small>'+h(r?tr(groupName(r,ctx))+' · '+level(r.floor):tr('No room assigned'))+'</small></span>'+
    '<span class="wf-chevron" aria-hidden="true">›</span></button>';
  }).join('')+'</div></section>';
}
function walkingLink(museum){
 const q=encodeURIComponent(MUSEUM[museum].address);
 return 'https://www.google.com/maps/dir/?api=1&destination='+q+'&travelmode=walking';
}
function geoMessage(ctx){
 const info=locationInfo?.museum===ctx.museum?locationInfo:null;
 if(!info)return '';
 return '<div class="wf-gps-result" role="status">'+h(info.text)+
  (info.walk?'<a href="'+h(walkingLink(ctx.museum))+'" target="_blank" rel="noopener noreferrer">'+h(tr('Walk to entrance'))+' ↗</a>':'')+'</div>';
}
function render(){
 const ctx=current(),m=R().MAPS[ctx.museum];
 if(ctx.selected){
  const key=ctx.museum+':'+ctx.selected.id;
  if(key!==centeredKey){
   centeredKey=key;
   requestAnimationFrame(()=>{
    const box=document.querySelector('.wf-map-scroll'),pin=document.querySelector('.wf-pin.wf-selected');
    if(box&&pin)box.scrollLeft=Math.max(0,pin.offsetLeft-box.clientWidth/2);
   });
  }
 }
 return '<div class="wf-page"><header class="wf-header"><h2>'+h(tr('Map'))+'</h2>'+
  '<a href="'+h(m.url)+'" target="_blank" rel="noopener noreferrer">'+h(tr('Museum plan'))+' ↗</a></header>'+
  '<div class="wf-fields"><label class="wf-field"><span>'+h(tr('From'))+'</span><select data-wf-from>'+roomsOptions(ctx)+'</select></label>'+
  '<button type="button" class="wf-locate" data-wf-locate aria-label="'+h(tr('Use location'))+'" title="'+h(tr('Use location'))+'">◎</button>'+
  '<label class="wf-field"><span>'+h(tr('Find'))+'</span><select data-wf-to>'+workOptions(ctx)+'</select></label></div>'+
  geoMessage(ctx)+
  '<div class="wf-tools"><span>'+h(tr('Schematic · not to scale'))+'</span><button type="button" data-wf-access aria-pressed="'+ctx.s.stepFree+'">'+
  (ctx.s.stepFree?'✓ ':'')+h(tr('Avoid stairs'))+'</button></div>'+
  diagram(ctx)+directions(ctx)+stops(ctx)+
  '<div class="wf-footer"><a href="'+h(walkingLink(ctx.museum))+'" target="_blank" rel="noopener noreferrer">'+h(tr('Walk to entrance'))+' ↗</a></div></div>';
}
function rerender(){if(window.__traceAppRender)window.__traceAppRender()}
function updateFocus(id){
 const work=A.find(a=>a.id===id);
 if(!work||!D()?.isActive(id))return;
 R().state.focus=id;state.mapFocusId=null;R().saveRoute();rerender();
}
function distanceKm(lat1,lon1,lat2,lon2){
 const r=Math.PI/180,dl=(lat2-lat1)*r,dp=(lon2-lon1)*r;
 const a=Math.sin(dl/2)**2+Math.cos(lat1*r)*Math.cos(lat2*r)*Math.sin(dp/2)**2;
 return 12742*Math.asin(Math.min(1,Math.sqrt(a)));
}
function locate(){
 const museum=state.venue,ref=MUSEUM[museum];
 if(!navigator.geolocation){
  locationInfo={museum,text:tr('Location unavailable'),walk:true};rerender();return;
 }
 locationInfo={museum,text:tr('From your position')+'…',walk:false};rerender();
 navigator.geolocation.getCurrentPosition(pos=>{
  if(state.venue!==museum)return;
  const km=distanceKm(pos.coords.latitude,pos.coords.longitude,...ref.center);
  locationInfo={museum,text:km<.35?tr('Near the museum · choose your room'):
   (km<1?Math.round(km*1000)+' m':km.toFixed(1)+' km')+' · '+tr('From your position'),walk:km>=.35};
  rerender();
 },err=>{
  if(state.venue!==museum)return;
  locationInfo={museum,text:tr(err.code===1?'Location permission denied':'Location unavailable'),walk:true};
  rerender();
 },{enableHighAccuracy:false,maximumAge:60000,timeout:10000});
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-wf-dest],[data-wf-locate],[data-wf-access]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(b.dataset.wfDest!==undefined){updateFocus(b.dataset.wfDest);return}
 if(b.dataset.wfLocate!==undefined){locate();return}
 if(b.dataset.wfAccess!==undefined){const s=R().state;s.stepFree=!s.stepFree;R().saveRoute();rerender()}
},true);
document.addEventListener('change',e=>{
 const b=e.target.closest('[data-wf-from],[data-wf-to]');if(!b)return;
 e.stopImmediatePropagation();
 if(b.dataset.wfTo!==undefined){updateFocus(b.value);return}
 if(b.dataset.wfFrom!==undefined&&D()?.rooms(state.venue).some(r=>r.id===b.value)){
  R().state.start=b.value;R().saveRoute();rerender();
 }
},true);
window.TRACE_WAYFINDER={render,area,distanceKm,coordinates};
})();
