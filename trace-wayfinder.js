/* TRACE Wayfinder v5: destination-first pavilion guide.
   The illustrated campus is a simplified orientation diagram based on the MMFA map,
   never a floor-plan survey. Curator-approved and published map-research connections both guide suggested museum visits.
   Optional geolocation is one-shot, outdoors only, local, and never persisted. */
(function(){
'use strict';
const D=()=>window.TRACE_DISPLAY, R=()=>window.TRACE_ROUTING;
const MUSEUM={
 mmfa:{address:'1380 Sherbrooke Street West, Montréal, QC',center:[45.49870,-73.57939]},
 pamm:{address:'1103 Biscayne Boulevard, Miami, FL',center:[25.78603,-80.18632]},
 moma:{address:'11 West 53rd Street, New York, NY',center:[40.76161,-73.97755]}
};
const PAVILIONS=[
 {id:'bourgie',title:'Bourgie',x:18,y:8,w:29,h:22},
 {id:'stewart',title:'Stewart',x:4,y:39,w:24,h:23},
 {id:'hornstein',title:'Hornstein',x:29,y:43,w:18,h:20},
 {id:'desmarais',title:'Desmarais',x:51,y:31,w:37,h:31},
 {id:'peace',title:'Pavilion for Peace',x:73,y:69,w:25,h:22}
];
const WORDS={
 'Map':['Carte','Mapa'],'Official map':['Plan officiel','Mapa oficial'],
 'Where to?':['Où aller ?','¿Adónde?'],'Start':['Départ','Origen'],
 'Use location':['Me localiser','Usar ubicación'],'Entrance':['Entrée','Entrada'],
 'Outside':['Extérieur','Exterior'],'Pavilion for Peace':['Pavillon pour la paix','Pabellón de la Paz'],'Peace':['Paix','Paz'],
 'Floor':['Étage','Piso'],'Floor unknown':['Étage à confirmer','Piso por confirmar'],
 'Found':['Trouvée','Encontrada'],'Mystery Work':['Œuvre mystère','Obra misteriosa'],'Mystery':['Mystère','Misterio'],'Find':['Trouver','Encontrar'],
 'View clue':['Voir l’indice','Ver pista'],'No room assigned':['Salle non attribuée','Sala sin asignar'],
 'Display not confirmed':['Exposition non confirmée','Exhibición no confirmada'],
 'Pavilion':['Pavillon','Pabellón'],'Gallery':['Salle','Galería'],
 'Avoid stairs':['Éviter les escaliers','Evitar escaleras'],
 'No indoor route confirmed':['Parcours intérieur non confirmé','Ruta interior sin confirmar'],
 'Use signs and the official map.':['Suivez les panneaux et le plan officiel.','Sigue las señales y el mapa oficial.'],
 'Same gallery':['Même salle','Misma galería'],
 'Verified route':['Parcours vérifié','Ruta verificada'],
 'Take stairs':['Prenez les escaliers','Usa las escaleras'],
 'Take elevator':['Prenez l’ascenseur','Usa el ascensor'],
 'Continue to':['Continuez vers','Continúa hacia'],
 'Outdoor route':['Parcours extérieur','Ruta exterior'],
 'Entrance directions':['Itinéraire vers l’entrée','Cómo llegar a la entrada'],
 'At the museum? Select your gallery.':['Au musée ? Choisissez votre salle.','¿En el museo? Elige tu galería.'],
 'Nearby · choose your gallery':['À proximité · choisissez votre salle','Cerca · elige tu galería'],
 'Location unavailable':['Localisation indisponible','Ubicación no disponible'],
 'Location denied':['Localisation refusée','Ubicación denegada'],
 'Location is for outdoor orientation only.':['La localisation sert uniquement à l’orientation extérieure.','La ubicación solo sirve para orientarse en el exterior.'],
 'Explore more':['Explorer plus','Explorar más'],'Plan a visit':['Planifier une visite','Planificar visita'],
 'Three':['Trois','Tres'],'All':['Tout','Todas'],'Choose':['Choisir','Elegir'],
 'Works':['Œuvres','Obras'],'Main entrance':['Entrée principale','Entrada principal'],
 'Pavilion layout · not to scale':['Disposition simplifiée des pavillons','Distribución aproximada de pabellones'],
 'View floor':['Voir l’étage','Ver piso'],
 'Museum':['Musée','Museo'],'Select a destination':['Choisissez une œuvre','Selecciona una obra'],
 'No selected works':['Aucune œuvre sélectionnée','Ninguna obra seleccionada'],
 'Current gallery':['Salle actuelle','Galería actual'],
 'Go to':['Aller à','Ir a'],'Suggested route':['Itinéraire suggéré','Ruta sugerida'],
 'Follow the Level 1 passage to the Pavilion for Peace':['Suivez le passage du niveau 1 vers le pavillon pour la Paix','Sigue el pasaje del nivel 1 al Pabellón de la Paz'],
 'Enter the S2 underground passage':['Rejoignez le passage souterrain S2','Entra en el pasaje subterráneo S2'],
 'Follow the S2 passage to Bourgie':['Suivez le passage S2 vers Bourgie','Sigue el pasaje S2 hacia Bourgie'],
 'Walk along Avenue du Musée':['Marchez le long de l’avenue du Musée','Camina por la avenida du Musée'],
 'Head outside via the museum entrance':['Sortez par l’entrée du musée','Sal por la entrada del museo'],
 'Take the elevator to':['Prenez l’ascenseur vers','Toma el ascensor hasta'],
 'Take the stairs to':['Prenez les escaliers vers','Sube o baja las escaleras hasta'],
 'Continue to':['Continuez vers','Continúa hacia'],
 'Find the gallery':['Rejoignez la salle','Encuentra la galería'],
 'Ask museum staff for the floor':['Demandez l’étage au personnel du musée','Pregunta al personal por el piso'],
 'Arrived at the gallery':['Vous êtes à la salle','Has llegado a la galería'],
 'Map-derived walking guide':['Parcours d’après le plan','Ruta basada en el mapa'],
 'Gallery not confirmed':['Galerie non confirmée','Galería no confirmada'],'Gallery location pending':['Emplacement de la salle à confirmer','Ubicación de galería pendiente'],'Select a floor to see the galleries':['Choisissez un étage pour voir les salles','Elige un piso para ver las galerías']
};
const h=s=>String(s??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
function t(s){
 const lang=window.TRACE_I18N?.language||state.lang||'en';
 return lang==='en'?s:(WORDS[s]?.[lang==='fr'?0:1]||s);
}
let gps=null,gpsRequest=0;
function room(a,ctx){return a?ctx.rooms.find(r=>r.id===D().rec(a.id).room)||null:null}
function zone(r,museum){
 if(!r)return 'unknown';
 if(r.id==='mmfa-passage')return 'passage';
 if(r.floor==='Outdoor')return r.id==='mmfa-bourgie-front'?'bourgie':'outside';
 if(museum!=='mmfa')return 'museum';
 if(r.id.includes('peace'))return 'peace';
 if(r.id.includes('bourgie'))return 'bourgie';
 if(r.id.includes('stewart'))return 'stewart';
 if(r.id.includes('hornstein'))return 'hornstein';
 return 'desmarais';
}
function zoneName(id,m){
 if(id==='outside')return t('Outside');
 if(m==='mmfa')return t(PAVILIONS.find(p=>p.id===id)?.title||'Museum');
 return m==='pamm'?'PAMM':'MoMA';
}
function level(r){
 if(!r)return t('No room assigned');
 return r.floor==='Outdoor'?t('Outside'):r.floor==='Unconfirmed'?t('Floor unknown'):t('Floor')+' '+r.floor;
}
function workLabel(a,ctx){
 const n=ctx.works.indexOf(a)+1;
 return state.found.includes(a.id)?a.name:t('Mystery Work')+' '+n;
}
function context(){
 R().touch();
 const museum=state.venue,rooms=D()?.rooms(museum)||[],works=A.filter(a=>D()?.isActive(a.id)),s=R().state;
 const requested=works.find(a=>a.id===state.mapFocusId);
 if(requested&&requested.id!==s.focus){s.focus=requested.id;R().saveRoute()}
 const chosen=works.find(a=>a.id===s.focus)||works.find(a=>!state.found.includes(a.id))||works[0]||null;
 const dst=room(chosen,{rooms}),start=rooms.find(r=>r.id===s.start)||rooms.find(r=>r.id===R().MAPS[museum].startRoom)||null;
 const verifiedRoute=start&&dst?R().route(start.id,dst.id,false):null;
 const rec=chosen?D().rec(chosen.id):null;
 const verified=!!rec?.onViewVerified&&!/(not independently confirmed|requires museum confirmation|proposed assignment|reverify|not yet confirmed)/i.test(rec.note||'');
 return {museum,rooms,works,s,chosen,dst,start,verifiedRoute,verified};
}

/* A research edge is a usable map-derived suggestion. Keep its provenance
   and the stair filter intact, while giving visitors practical directions. */
function routePlan(ctx){
 if(!ctx.start||!ctx.dst)return null;
 const partial=ctx.museum==='mmfa'&&ctx.dst.floor==='Unconfirmed';
 const goal=partial&&(zone(ctx.start,ctx.museum)==='peace')?ctx.start.id:partial?'mmfa-peace-1':ctx.dst.id;
 const approved=R().route(ctx.start.id,goal,false);
 const suggested=approved||R().route(ctx.start.id,goal,true);
 if(!suggested)return null;
 return {path:suggested,partial,provisional:!approved||suggested.research===true,goal};
}
function pathZone(id,ctx){
 const r=ctx.rooms.find(x=>x.id===id);
 return r?zone(r,ctx.museum):'unknown';
}
function sitePoint(id,ctx){
 const r=ctx.rooms.find(x=>x.id===id);
 const z=pathZone(id,ctx);
 if(id==='mmfa-entrance')return [308,122];
 if(id==='mmfa-passage')return [230,158];
 if(id==='mmfa-garden'||id==='mmfa-avenue-du-musee')return [62,74];
 if(id==='mmfa-bourgie-front')return [164,82];
 if(z==='outside')return [67,79];
 const p=PAVILIONS.find(x=>x.id===z);
 return p?[(p.x+p.w/2)*4.4,(p.y+p.h/2)*3]:null;
}
function routeDrawing(ctx,plan){
 if(ctx.museum!=='mmfa'||!plan)return '';
 const points=[],zones=[];
 for(const id of plan.path.rooms){
  const z=pathZone(id,ctx),last=zones[zones.length-1];
  if(z!==last||id===plan.path.rooms[plan.path.rooms.length-1]){
   const p=sitePoint(id,ctx);
   if(p){points.push(p);zones.push(z)}
  }
 }
 if(points.length<2)return '';
 const coords=points.map(p=>p.map(v=>Math.round(v)).join(',')).join(' ');
 const first=points[0],last=points[points.length-1];
 return '<svg class="wf-route-overlay" viewBox="0 0 440 300" preserveAspectRatio="none" aria-label="'+h(t('Suggested route'))+'">'+
   '<polyline class="wf-route-halo" points="'+coords+'" />'+
   '<polyline class="wf-route-stroke" points="'+coords+'" />'+
   '<circle class="wf-route-from" cx="'+first[0]+'" cy="'+first[1]+'" r="7"/>'+
   '<circle class="wf-route-to" cx="'+last[0]+'" cy="'+last[1]+'" r="9"/>'+
   '<circle class="wf-route-to-center" cx="'+last[0]+'" cy="'+last[1]+'" r="3"/>'+
  '</svg>';
}
function suggestedSteps(ctx,plan){
 if(!plan)return [];
 const ids=plan.path.rooms,edges=plan.path.edges,byId=id=>ctx.rooms.find(r=>r.id===id);
 const steps=[];
 const push=(text,detail='')=>{if(text&&steps[steps.length-1]?.text!==text)steps.push({text,detail})};
 let i=0;
 while(i<edges.length){
  const edge=edges[i],src=byId(ids[i]),dst=byId(ids[i+1]);
  if(!src||!dst){i++;continue}
  const srcZone=pathZone(ids[i],ctx),dstZone=pathZone(ids[i+1],ctx);
  if(edge.type==='elevator'||edge.type==='stairs'){
   // Merge several connected floors into one instruction, never pretending
   // a particular elevator door or a measured walking distance is known.
   let j=i;
   while(j+1<edges.length&&edges[j+1].type===edge.type&&pathZone(ids[j+1],ctx)===pathZone(ids[j+2],ctx))j++;
   const end=byId(ids[j+1]);
   push(t(edge.type==='elevator'?'Take the elevator to':'Take the stairs to')+' '+level(end),
    zoneName(pathZone(end.id,ctx),ctx.museum));i=j+1;continue;
  }
  if(ctx.museum==='mmfa'&&srcZone==='desmarais'&&dstZone==='peace'){
   push(t('Follow the Level 1 passage to the Pavilion for Peace'));i++;continue;
  }
  if(ctx.museum==='mmfa'&&ids[i+1]==='mmfa-passage'){
   push(t('Enter the S2 underground passage'));i++;continue;
  }
  if(ctx.museum==='mmfa'&&ids[i]==='mmfa-passage'&&dstZone==='bourgie'){
   push(t('Follow the S2 passage to Bourgie'));i++;continue;
  }
  if(edge.type==='outdoor'){
   if(src.floor!=='Outdoor')push(t('Head outside via the museum entrance'));
   if(ctx.museum==='mmfa')push(t('Walk along Avenue du Musée'),
    ids[i+1]==='mmfa-bourgie-front'?t('Bourgie'):t('Outside'));
   else push(t('Outdoor route')+' · '+zoneName(dstZone,ctx.museum));
   i++;continue;
  }
  if(srcZone!==dstZone)push(t('Continue to')+' '+zoneName(dstZone,ctx.museum),level(dst));
  else if(dst.floor!==src.floor)push(t('Continue to')+' '+level(dst));
  else if(i===edges.length-1)push(t('Continue to')+' '+dst.label);
  i++;
 }
 if(plan.partial)push(t('Ask museum staff for the floor'),zoneName('peace',ctx.museum));
 else if(ctx.dst&&ctx.dst.floor!=='Outdoor')
  push(t('Find the gallery')+': '+ctx.dst.label,level(ctx.dst));
 else if(ctx.dst)push(t('Find the gallery')+': '+ctx.dst.label,t('Outside'));
 return steps;
}

function selectWork(id){
 if(!A.some(a=>a.id===id&&D()?.isActive(id)))return;
 mapFloor[state.venue]=null;
 R().state.focus=id;R().saveRoute();state.mapFocusId=null;renderApp();
}
function renderApp(){window.__traceAppRender?.()}
function worksIn(ctx,z){
 return ctx.works.filter(a=>zone(room(a,ctx),ctx.museum)===z);
}
function selectPavilion(ctx,z){
 const options=worksIn(ctx,z);
 if(options.length)selectWork(options.find(a=>!state.found.includes(a.id))?.id||options[0].id);
}
function campus(ctx,plan){
 const selected=zone(ctx.dst,ctx.museum);
 const sections=PAVILIONS.map(p=>{
  const list=worksIn(ctx,p.id),isSelected=p.id===selected,origin=ctx.start&&zone(ctx.start,ctx.museum)===p.id;
  return '<button type="button" data-wf-zone="'+p.id+'" class="wf-building wf-'+p.id+(isSelected?' selected':'')+'" '+
    'style="left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;height:'+p.h+'%" '+
    'aria-pressed="'+isSelected+'" aria-label="'+h(t(p.title))+'">'+
    '<strong>'+h(t(p.id==='peace'?'Peace':p.title))+'</strong>'+(list.length?'<span>'+list.length+'</span>':'')+
    (origin?'<i aria-label="'+h(t('Start'))+'"></i>':'')+'</button>';
 }).join('');
 const outside=worksIn(ctx,'outside');
 return '<div class="wf-site-map" aria-label="MMFA pavilion guide">'+
  '<svg class="wf-site-streets" viewBox="0 0 440 300" aria-hidden="true" preserveAspectRatio="none">'+
  '<path d="M0 93 L194 6 M0 222 L180 105 L440 269 M200 -5 L442 165" stroke="#e1e7e1" stroke-width="29" fill="none"/>'+
  '<path d="M0 93 L194 6 M0 222 L180 105 L440 269 M200 -5 L442 165" stroke="#fff" stroke-width="20" fill="none"/>'+
  '<text x="15" y="72" transform="rotate(-24 15 72)">DU MUSÉE AVE</text>'+
  '<text x="212" y="280">SHERBROOKE ST W</text>'+
  '</svg>'+routeDrawing(ctx,plan)+sections+
  '<button type="button" class="wf-sculptures'+(selected==='outside'?' selected':'')+'" data-wf-zone="outside" aria-label="'+h(t('Outside'))+'">'+
  '<strong>✦</strong><em>'+h(t('Outside'))+'</em>'+(outside.length?'<span>'+outside.length+'</span>':'')+'</button>'+
  '<span class="wf-entrance-label">'+h(t('Main entrance'))+' ↗</span>'+
  '</div>';
}
/* Exact numbered galleries, simplified spatial positions based on the museums' floor guides.
   All coordinates are presentation-only; the shared room graph owns directions. */
const INDOOR={
 moma:{
  '1':{'moma-entry':[210,180]},
  '4':{
    'moma-f4-landing':[403,148],'moma-400':[366,88],'moma-401':[318,72],
    'moma-402':[272,48],'moma-405':[175,75],'moma-407':[140,125],
    'moma-408':[145,195],'moma-410':[219,224],'moma-412':[295,214],
    'moma-413':[358,220],'moma-414':[389,245]
  },
  '5':{
    'moma-f5-landing':[408,152],'moma-500':[376,93],'moma-501':[298,76],
    'moma-502':[229,48],'moma-503':[180,48],'moma-506':[181,138],
    'moma-517':[187,231],'moma-515':[69,233],'moma-523':[336,235]
  },
  '6':{'moma-f6-landing':[394,152],'moma-six':[202,140]}
 },
 pamm:{
  '1':{
    'pamm-1':[232,246],'pamm-2':[214,183],'pamm-3':[105,185],
    'pamm-4':[125,116],'pamm-5':[317,165],'pamm-7':[205,115],
    'pamm-8':[115,50],'pamm-18':[376,48]
  },
  '2':{
    'pamm-f2-landing':[220,168],'pamm-f2-1':[96,30],'pamm-f2-2':[215,75],
    'pamm-f2-3':[107,92],'pamm-f2-4':[91,158],'pamm-f2-5':[90,226],
    'pamm-f2-6':[153,226],'pamm-f2-7':[157,102],'pamm-f2-8':[269,102],
    'pamm-f2-9':[322,59],'pamm-f2-10':[354,106],'pamm-f2-11':[360,160],
    'pamm-f2-12':[363,216],'pamm-f2-13':[291,226],'pamm-f2-14':[231,234],
    'pamm-f2-15':[290,49],'pamm-f2-16':[45,268],'pamm-f2-17':[410,262]
  },
  Outdoor:{'pamm-18':[218,145]}
 }
};
let mapFloor={};
function defaultMapFloor(ctx){
 const available=Object.keys(INDOOR[ctx.museum]||{});
 const requested=mapFloor[ctx.museum];
 if(requested&&available.includes(requested))return requested;
 if(ctx.dst&&available.includes(ctx.dst.floor))return ctx.dst.floor;
 return ctx.start&&available.includes(ctx.start.floor)?ctx.start.floor:'1';
}
function drawIndoorLine(ctx,plan,floor,positions){
 if(!plan)return '';
 const nodes=plan.path.rooms.map(id=>({id,room:ctx.rooms.find(r=>r.id===id)})).
  filter(x=>x.room?.floor===floor&&positions[x.id]);
 if(!nodes.length)return '';
 const pts=nodes.map(x=>positions[x.id]);
 const pieces=[];
 for(let i=1;i<pts.length;i++){
  const p=pts[i-1],q=pts[i];pieces.push('<path d="M'+p[0]+' '+p[1]+' L'+q[0]+' '+q[1]+'" class="wf-indoor-path"/>');
 }
 return '<svg class="wf-indoor-lines" viewBox="0 0 440 300" aria-hidden="true">'+pieces.join('')+'</svg>';
}
function indoorMap(ctx,plan){
 const museum=ctx.museum,layouts=INDOOR[museum],floor=defaultMapFloor(ctx),positions=layouts[floor]||{};
 const floors=Object.keys(layouts),visible=new Set(Object.keys(positions)),mapped=ctx.works.filter(a=>room(a,ctx)?.floor===floor);
 const tabs=floors.map(f=>{
  const count=mapped.length&&f===floor?mapped.length:ctx.works.filter(a=>room(a,ctx)?.floor===f).length;
  return '<button type="button" data-wf-floor="'+h(f)+'" class="'+(f===floor?'selected':'')+'" aria-pressed="'+(f===floor)+'">'+
   h(f==='Outdoor'?t('Outside'):t('Floor')+' '+f)+(count?' <span>'+count+'</span>':'')+'</button>';
 }).join('');
 const nodes=Object.entries(positions).map(([id,p])=>{
  const r=ctx.rooms.find(x=>x.id===id);if(!r)return '';
  const matches=ctx.works.filter(a=>D().rec(a.id).room===id),chosen=matches.some(a=>a.id===ctx.chosen?.id);
  const start=ctx.start?.id===id,land=/landing$/.test(id),entry=id==='moma-entry'||id==='pamm-1'||id==='pamm-2';
  const n=museum==='moma'?id==="moma-six"?"6":id.replace(/.*-/,''):id==="pamm-18"?'✦':id==="pamm-1"?'i':id==="pamm-2"?'⌂':id==="pamm-7"||id==="pamm-f2-2"?'↕':id.replace(/.*-/,'');
  const name=matches.length?matches.map(a=>workLabel(a,ctx)).join(', '):r.label;
  return '<button type="button" class="wf-gallery-room'+(chosen?' selected':'')+(start?' is-start':'')+(land||entry?' wf-hub':'')+'" '+
   'style="left:'+(p[0]/4.4)+'%;top:'+(p[1]/3)+'%" '+
   (matches.length?'data-wf-work="'+h(matches[0].id)+'"':'data-wf-map-start="'+h(id)+'"')+
   ' aria-label="'+h(name)+'" title="'+h(name)+'"><strong>'+h(land?'↕':n)+'</strong>'+
   (matches.length?'<span class="wf-gallery-mystery">'+h(state.found.includes(matches[0].id)?'✓':'?')+'</span>':'')+'</button>';
 }).join('');
 const startingOnFloor=ctx.start?.floor===floor,selectedOnFloor=ctx.dst?.floor===floor;
 const caption=selectedOnFloor&&ctx.dst?.floor!=='Unconfirmed'?
  t('Find')+': '+(museum==='moma'?(ctx.dst.id==='moma-six'?t('Floor')+' 6':t('Gallery')+' '+ctx.dst.id.replace('moma-','')):ctx.dst.label):
  ctx.dst?.floor==='Unconfirmed'?t('Gallery location pending'):t('Select a floor to see the galleries');
 return '<div class="wf-indoor-map">'+
  '<div class="wf-indoor-floors" role="group" aria-label="'+h(t('Floor'))+'">'+tabs+'</div>'+
  '<div class="wf-indoor-diagram" role="group" aria-label="'+h(t('Floor')+' '+floor)+'">'+
  '<div class="wf-indoor-corridor"></div>'+drawIndoorLine(ctx,plan,floor,positions)+nodes+'</div>'+
  '<div class="wf-indoor-caption">'+h(caption)+'</div></div>';
}
function floorView(ctx){
 if(!ctx.dst)return '';
 const z=zone(ctx.dst,ctx.museum),list=worksIn(ctx,z),byFloor=new Map();
 for(const a of list){const r=room(a,ctx),f=r?.floor||'Unconfirmed',items=byFloor.get(f)||[];items.push(a);byFloor.set(f,items)}
 const tabs=[...byFloor].map(([f,items])=>'<button type="button" class="'+(f===ctx.dst.floor?'selected':'')+'" data-wf-work="'+items[0].id+'" aria-pressed="'+(f===ctx.dst.floor)+'">'+
 h(f==='Outdoor'?t('Outside'):f==='Unconfirmed'?t('Floor unknown'):t('Floor')+' '+f)+'</button>').join('');
 const current=list.filter(a=>room(a,ctx)?.floor===ctx.dst.floor);
 return '<section class="wf-location"><div class="wf-location-head"><h3>'+h(zoneName(z,ctx.museum))+'</h3><span>'+h(level(ctx.dst))+'</span></div>'+
  '<div class="wf-floor-tabs">'+tabs+'</div>'+
  '<div class="wf-floor-works">'+current.map(a=>'<button type="button" data-wf-work="'+h(a.id)+'" class="'+(a.id===ctx.chosen.id?'selected':'')+'" aria-pressed="'+(a.id===ctx.chosen.id)+'">'+
   '<span>'+h(workLabel(a,ctx))+'</span><span aria-hidden="true">'+(state.found.includes(a.id)?'✓':'›')+'</span></button>').join('')+'</div></section>';
}
function status(ctx,plan){
 if(!ctx.chosen)return '<div class="wf-route-card wf-empty">'+h(t('No selected works'))+'</div>';
 const r=ctx.dst,title=workLabel(ctx.chosen,ctx),
  dest=r?zoneName(zone(r,ctx.museum),ctx.museum)+' · '+level(r):t('No room assigned');
 let directions='';
 if(ctx.dst?.floor==='Unconfirmed'){
  directions='<div class="wf-route-message">'+h(t('Gallery location pending'))+'</div>';
 }else if(plan){
  const steps=suggestedSteps(ctx,plan);
  directions=plan.path.rooms.length===1&&!plan.partial?
    '<div class="wf-route-message">'+h(t('Same gallery'))+'</div>':
    '<ol class="wf-directions">'+steps.map((step,i)=>
      '<li><span class="wf-step-mark">'+(i+1)+'</span><span><strong>'+h(step.text)+'</strong>'+
      (step.detail?'<small>'+h(step.detail)+'</small>':'')+'</span></li>').join('')+'</ol>';
 }else{
  directions='<div class="wf-route-message">'+h(t('Use signs and the official map.'))+
    ' <a href="'+h(R().MAPS[ctx.museum].url)+'" target="_blank" rel="noopener noreferrer">'+h(t('Official map'))+' ↗</a></div>';
 }
 return '<section class="wf-route-card"><div class="wf-route-top"><div><span class="wf-kicker">'+h(plan?t('Suggested route'):t('Find'))+'</span>'+
  '<h3>'+h(title)+'</h3><p>'+h(dest)+'</p></div><button class="wf-go" type="button" data-tn-open="'+h(ctx.chosen.id)+'">'+h(t('View clue'))+'</button></div>'+
  (!ctx.verified?'<div class="wf-qualification">'+h(t('Display not confirmed'))+'</div>':'')+directions+'</section>';
}
function selector(ctx){
 return '<label class="wf-field"><span>'+h(t('Where to?'))+'</span><select data-wf-to aria-label="'+h(t('Where to?'))+'">'+
  ctx.works.map(a=>{
   const r=room(a,ctx);return '<option value="'+h(a.id)+'" '+(ctx.chosen?.id===a.id?'selected':'')+'>'+h(workLabel(a,ctx)+' · '+(r?zoneName(zone(r,ctx.museum),ctx.museum):t('Gallery not confirmed')))+'</option>';
  }).join('')+'</select></label>';
}
function startOptions(ctx){
 const groups=new Map();
 for(const r of ctx.rooms){const z=zone(r,ctx.museum),k=zoneName(z,ctx.museum),l=groups.get(k)||[];l.push(r);groups.set(k,l)}
 return [...groups].map(([k,rs])=>'<optgroup label="'+h(k)+'">'+rs.map(r=>'<option value="'+h(r.id)+'" '+(ctx.start?.id===r.id?'selected':'')+'>'+h(r.label)+' · '+h(level(r))+'</option>').join('')+'</optgroup>').join('');
}
function controls(ctx){
 return '<div class="wf-fields">'+selector(ctx)+'<label class="wf-field"><span>'+h(t('Start'))+'</span><select data-wf-from aria-label="'+h(t('Start'))+'">'+startOptions(ctx)+'</select></label>'+
  '<button class="wf-locate" type="button" data-wf-locate aria-label="'+h(t('Use location'))+'" title="'+h(t('Use location'))+'">◎</button></div>';
}
function visitPlan(ctx){
 const s=ctx.s,choices=[['quick','Three'],['all','All'],['custom','Choose']];
 const buttons=choices.map(([k,v])=>'<button type="button" data-tn-mode="'+k+'" class="'+(s.mode===k?'is-active':'')+'" aria-pressed="'+(s.mode===k)+'">'+h(t(v))+'</button>').join('');
 const current=R().routeWorks();
 const list=current.map((a,i)=>{
  const r=room(a,ctx);return '<button type="button" data-wf-work="'+h(a.id)+'" class="wf-stop'+(a.id===ctx.chosen?.id?' is-active':'')+'">'+
    '<span class="wf-stop-index">'+(state.found.includes(a.id)?'✓':i+1)+'</span><span class="wf-stop-title"><strong>'+h(workLabel(a,ctx))+'</strong><small>'+
    h(r?zoneName(zone(r,ctx.museum),ctx.museum)+' · '+level(r):t('No room assigned'))+'</small></span><span class="wf-chevron">›</span></button>';
 }).join('');
 const checks=s.mode==='custom'?'<div class="wf-custom">'+ctx.works.map(a=>'<label><input type="checkbox" data-tn-select="'+h(a.id)+'" '+(s.selected.includes(a.id)?'checked':'')+'>'+h(workLabel(a,ctx))+'</label>').join('')+'</div>':'';
 return '<details class="wf-visit" '+(s.expanded?'open':'')+'><summary>'+h(t('Plan a visit'))+'</summary><div class="wf-modes">'+buttons+'</div>'+checks+
 '<div class="wf-stop-list">'+list+'</div></details>';
}
function geoLine(ctx){
 if(!gps||gps.museum!==ctx.museum)return '';
 return '<div class="wf-gps-result" role="status">'+h(gps.message)+
 (gps.showDirections?'<a href="'+entranceUrl(ctx.museum)+'" target="_blank" rel="noopener noreferrer">'+h(t('Entrance directions'))+' ↗</a>':'')+'</div>';
}
function entranceUrl(m){
 return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(MUSEUM[m].address)+'&travelmode=walking';
}
function distanceKm(a,b,c,d){
 const rad=Math.PI/180,dp=(c-a)*rad,dl=(d-b)*rad;
 const z=Math.sin(dp/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(dl/2)**2;
 return 12742*Math.asin(Math.min(1,Math.sqrt(z)));
}
function locate(){
 const museum=state.venue,req=++gpsRequest,m=MUSEUM[museum];
 if(!navigator.geolocation){gps={museum,message:t('Location unavailable'),showDirections:true};renderApp();return}
 navigator.geolocation.getCurrentPosition(position=>{
  if(req!==gpsRequest||state.venue!==museum)return;
  const km=distanceKm(position.coords.latitude,position.coords.longitude,...m.center);
  const dist=km<.35?t('Nearby · choose your gallery'):(km<1?Math.round(km*1000)+' m':km.toFixed(1)+' km')+' · '+t('Location is for outdoor orientation only.');
  gps={museum,message:dist,showDirections:km>=.35};renderApp();
 },err=>{
  if(req!==gpsRequest||state.venue!==museum)return;
  gps={museum,message:t(err.code===1?'Location denied':'Location unavailable'),showDirections:true};renderApp();
 },{enableHighAccuracy:false,maximumAge:60000,timeout:10000});
}
function render(){
 const ctx=context(),plan=routePlan(ctx);
 const heading='<div class="wf-header"><h2>'+h(t('Map'))+'</h2><a href="'+h(R().MAPS[ctx.museum].url)+'" target="_blank" rel="noopener noreferrer">'+h(t('Official map'))+' ↗</a></div>';
 const mapMarkup=ctx.museum==='mmfa'?campus(ctx,plan):indoorMap(ctx,plan);
 const a=ctx.chosen?.id;
 return '<main class="wf-page">'+heading+controls(ctx)+geoLine(ctx)+
  '<div class="wf-map-shell"><div class="wf-map-scroll">'+mapMarkup+'</div>'+
  (ctx.museum==='mmfa'?'<div class="wf-map-caption">'+h(t('Pavilion layout · not to scale'))+'</div>':'')+'</div>'+
  (ctx.museum==='mmfa'?floorView(ctx):'')+status(ctx,plan)+
  '<div class="wf-bottom-actions"><button type="button" data-wf-access aria-pressed="'+ctx.s.stepFree+'">'+(ctx.s.stepFree?'✓ ':'')+h(t('Avoid stairs'))+'</button>'+
  '<a href="'+entranceUrl(ctx.museum)+'" target="_blank" rel="noopener noreferrer">'+h(t('Entrance directions'))+' ↗</a></div>'+
  visitPlan(ctx)+'</main>';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-wf-zone],[data-wf-work],[data-wf-locate],[data-wf-access],[data-wf-floor],[data-wf-map-start]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(b.hasAttribute('data-wf-floor')){mapFloor[state.venue]=b.dataset.wfFloor;renderApp();return}
 if(b.hasAttribute('data-wf-map-start')){const chosen=b.dataset.wfMapStart;if(D()?.rooms(state.venue).some(x=>x.id===chosen)){R().state.start=chosen;R().saveRoute();renderApp()}return}
 if(b.hasAttribute('data-wf-zone')){selectPavilion(context(),b.dataset.wfZone);return}
 if(b.hasAttribute('data-wf-work')){selectWork(b.dataset.wfWork);return}
 if(b.hasAttribute('data-wf-locate')){locate();return}
 if(b.hasAttribute('data-wf-access')){R().state.stepFree=!R().state.stepFree;R().saveRoute();renderApp()}
},true);
document.addEventListener('toggle',e=>{if(e.target.matches?.('.wf-visit')){R().state.expanded=e.target.open;R().saveRoute();}},true);
document.addEventListener('change',e=>{
 const b=e.target.closest('[data-wf-from],[data-wf-to]');if(!b)return;
 e.stopImmediatePropagation();
 if(b.hasAttribute('data-wf-to')){selectWork(b.value);return}
 if(b.hasAttribute('data-wf-from')&&D()?.rooms(state.venue).some(r=>r.id===b.value)){
  R().state.start=b.value;R().saveRoute();renderApp();
 }
},true);
window.TRACE_WAYFINDER={render,distanceKm,zone,context,routePlan,suggestedSteps,routeDrawing,indoorMap,defaultMapFloor};
})();
