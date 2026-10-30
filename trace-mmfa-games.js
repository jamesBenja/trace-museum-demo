/* TRACE MMFA v2.8: eight original interactive art interpretations, no external data or visitors' camera access.
   Each experiment is distinct, trilingual, touch-driven, and has artwork-specific Mica feedback. */
(function(){
'use strict';
const E={
en:{
marrel:{title:'The secret copper garden',intro:'A flower painting is a tiny world. Brush away the copper shimmer, then uncover five creatures and details hiding among the petals.',hint:'Sweep your finger across the garden and tap the sparkling hidden details.',lesson:'Marrel painted flowers and tiny visitors on a smooth copper panel. The insects and lizard reward close looking: botanical beauty becomes a whole living world.',count:'Secrets discovered',sweep:'Copper revealed'},
witte:{title:'A room beyond the room',intro:'Pull the vanishing point into the far doorway, then open all three receding doors. Watch the floor and walls pull your eye into depth.',hint:'Drag the golden point into the small green doorway. Tap every numbered door.',lesson:'De Witte used doors, floor tiles and a vanishing point to turn a flat canvas into a deep interior. Your eyes follow the geometry as if you could walk inside.',count:'Doors discovered',point:'Vanishing point'},
fortin:{title:'Paint the arriving storm',intro:'Drag across the sky to add three luminous strokes, then move the sun toward the horizon. Let the buildings stay dark and the clouds glow.',hint:'Paint three gestures through the clouds, then drag the glowing sun rightward.',lesson:'Fortin heightened the contrast between dark Montréal buildings and a brilliant storm sky. By painting light against dark, he made the landscape feel dramatic.',count:'Sky brushstrokes',light:'Sky light'},
eye:{title:'Make an eye monumental',intro:'Pull the glowing size handle to enlarge a familiar eye above Montréal. Then compare its scale from two different viewpoints.',hint:'Drag the size handle outward and explore both viewpoints.',lesson:'When an ordinary eye becomes larger than a building, its meaning changes. Monumental scale makes us aware of how public sculpture addresses the people around it.',count:'Viewpoints explored',scale:'Sculpture scale',viewsText:['Street level','Across the square']},
frink:{title:'A conversation in the courtyard',intro:'Place two guardians in separate spots, then turn each to face the other. See how their shadows and the space between them begin to speak.',hint:'Choose two courtyard positions, then turn both guardians inward.',lesson:'Elisabeth Frink gave her figures presence through pose, placement and distance. Two statues can seem to communicate even when nothing physically connects them.',count:'Guardians facing',turn:'Turn guardian',move:'Move guardian'},
riopelle:{title:'Build an assemblage',intro:'Choose a wood platform and join three different found objects: wire, fabric, wheel, metal or bark. Decide which piece gives your sculpture its balance.',hint:'Choose a base, attach three different pieces, then choose your anchor.',lesson:'Assemblage gives discarded materials a second life. Riopelle combined textures and objects so their relationships, not a single perfect material, give the sculpture character.',count:'Found materials',anchor:'Anchor the sculpture'},
rodin:{title:'Sculpt the language of a pose',intro:'Move the figure from standing to sitting. Rest its arm on a knee and bring the hand toward the chin. Notice when a pose begins to suggest thinking.',hint:'Transform the body through three successive gestures.',lesson:'Rodin communicated thought through weight, tension and the arrangement of a body. A lowered head, bent back and hand at the chin can make an inner state visible.',count:'Pose gestures'},
cragg:{title:'Find the faces inside',intro:'Rotate an imagined abstract sculpture. See how three profiles emerge from different viewpoints, then reveal each face.',hint:'Turn toward each angle and tap the glowing profile clue.',lesson:'Tony Cragg’s sculptural surfaces can suggest unexpected faces. As your viewpoint changes, curves turn into profiles, showing that looking is an active creative process.',count:'Profiles found',rotate:'Rotate sculpture'},
common:{mica:'MICA’S DISCOVERY',complete:'Collect your discovery ✦',locked:'Complete the experiment first',assist:'Use a guided alternative',story:'Read this artwork’s story',care:'Original educational illustration, not an exact reproduction. Never touch the real artwork.',reset:'Start again',point:'Touch or drag the glowing handles. Keyboard and tap alternatives are available.',done:'Your discovery is ready!'}
},
fr:{
marrel:{title:'Le jardin secret sur cuivre',intro:'Un tableau de fleurs cache un petit monde. Brosse les reflets du cuivre, puis découvre cinq créatures et détails parmi les pétales.',hint:'Balaye le jardin du doigt et touche les détails scintillants.',lesson:'Marrel peignait des fleurs et de minuscules visiteurs sur du cuivre lisse. Les insectes et le lézard récompensent une observation attentive.',count:'Secrets découverts',sweep:'Cuivre révélé'},
witte:{title:'Une pièce derrière la pièce',intro:'Déplace le point de fuite vers la porte du fond, puis ouvre trois portes successives. Observe la profondeur créée par les lignes.',hint:'Glisse le point doré vers la porte verte et touche les trois portes numérotées.',lesson:'De Witte utilisait les portes, les carreaux et un point de fuite pour donner de la profondeur à une toile plate. Notre regard suit cette géométrie.',count:'Portes découvertes',point:'Point de fuite'},
fortin:{title:'Peins l’orage qui approche',intro:'Dessine trois grands coups de pinceau lumineux dans le ciel, puis fais glisser le soleil vers l’horizon. Laisse les bâtiments dans l’ombre.',hint:'Trace trois gestes dans le ciel, puis déplace le soleil vers la droite.',lesson:'Fortin accentuait le contraste entre les bâtiments sombres de Montréal et un ciel d’orage éclatant. La lumière rend le paysage dramatique.',count:'Coups de pinceau',light:'Lumière du ciel'},
eye:{title:'Un œil monumental',intro:'Étire la poignée pour agrandir un œil familier au-dessus de Montréal. Compare son échelle depuis deux points de vue.',hint:'Tire la poignée de taille vers l’extérieur et explore les deux points de vue.',lesson:'Un œil plus grand qu’un bâtiment change de signification. L’échelle monumentale transforme notre rapport à la sculpture publique.',count:'Points de vue',scale:'Taille de la sculpture',viewsText:['Depuis la rue','Depuis la place']},
frink:{title:'Une conversation dans la cour',intro:'Place deux gardiens dans des emplacements différents, puis tourne-les face à face. Observe leurs ombres et l’espace entre eux.',hint:'Choisis deux places et tourne les deux gardiens l’un vers l’autre.',lesson:'Elisabeth Frink donne de la présence aux figures grâce à leur pose, leur position et leur distance. Deux statues peuvent sembler communiquer sans se toucher.',count:'Gardiens orientés',turn:'Tourner le gardien',move:'Déplacer le gardien'},
riopelle:{title:'Construis un assemblage',intro:'Choisis une base de bois et assemble trois objets trouvés différents. Décide quel élément stabilise ta sculpture.',hint:'Choisis une base, ajoute trois matières différentes, puis fixe la structure.',lesson:'L’assemblage offre une seconde vie aux matériaux abandonnés. Riopelle associait textures et objets pour créer une composition expressive.',count:'Matériaux trouvés',anchor:'Stabiliser la sculpture'},
rodin:{title:'Sculpte le langage d’une pose',intro:'Fais passer la figure de debout à assise. Pose le bras sur le genou, puis amène la main au menton. À quel moment semble-t-elle penser ?',hint:'Transforme le corps par trois gestes successifs.',lesson:'Rodin exprimait la pensée par le poids, la tension et la pose du corps. Une tête inclinée et une main au menton peuvent évoquer un état intérieur.',count:'Gestes de la pose'},
cragg:{title:'Trouve les visages cachés',intro:'Fais tourner une sculpture abstraite imaginée. Découvre trois profils à des angles différents, puis révèle chaque visage.',hint:'Tourne la sculpture jusqu’à chaque angle et touche le repère lumineux.',lesson:'Les surfaces sculptées de Tony Cragg peuvent évoquer des visages inattendus. En changeant de point de vue, les courbes deviennent des profils.',count:'Profils trouvés',rotate:'Tourner la sculpture'},
common:{mica:'LA DÉCOUVERTE DE MICA',complete:'Enregistrer ma découverte ✦',locked:'Termine d’abord l’expérience',assist:'Utiliser une autre méthode guidée',story:'Lire l’histoire de l’œuvre',care:'Illustration éducative originale, pas une reproduction fidèle. Ne touche jamais l’œuvre réelle.',reset:'Recommencer',point:'Touche ou déplace les poignées lumineuses. Des alternatives au clavier sont disponibles.',done:'Ta découverte est prête !'}
},
es:{
marrel:{title:'El jardín secreto de cobre',intro:'Una pintura floral esconde un pequeño mundo. Frota el brillo del cobre y descubre cinco criaturas y detalles entre los pétalos.',hint:'Desliza el dedo por el jardín y toca los detalles brillantes.',lesson:'Marrel pintó flores y pequeños visitantes sobre una lámina lisa de cobre. Los insectos y el lagarto recompensan una mirada atenta.',count:'Secretos descubiertos',sweep:'Cobre revelado'},
witte:{title:'Una habitación detrás de otra',intro:'Arrastra el punto de fuga hacia la puerta del fondo y abre tres puertas sucesivas. Observa cómo el suelo y las paredes crean profundidad.',hint:'Arrastra el punto dorado hasta la puerta verde y toca las tres puertas numeradas.',lesson:'De Witte usó puertas, baldosas y un punto de fuga para crear profundidad en un lienzo plano. La mirada sigue la geometría.',count:'Puertas descubiertas',point:'Punto de fuga'},
fortin:{title:'Pinta la tormenta que llega',intro:'Traza tres grandes pinceladas luminosas en el cielo y mueve el sol hacia el horizonte. Mantén los edificios oscuros.',hint:'Pinta tres trazos en las nubes y arrastra el sol hacia la derecha.',lesson:'Fortin acentuó el contraste entre los edificios oscuros de Montreal y un cielo tormentoso brillante. La luz vuelve dramático el paisaje.',count:'Pinceladas del cielo',light:'Luz del cielo'},
eye:{title:'Haz monumental un ojo',intro:'Arrastra el control para agrandar un ojo por encima de los edificios de Montreal. Compara su escala desde dos puntos de vista.',hint:'Mueve el control de tamaño hacia fuera y explora ambas vistas.',lesson:'Un ojo más grande que un edificio cambia de significado. La escala monumental transforma nuestra relación con la escultura pública.',count:'Puntos de vista',scale:'Escala de la escultura',viewsText:['Desde la calle','Desde la plaza']},
frink:{title:'Una conversación en el patio',intro:'Coloca dos guardianes en lugares diferentes y gira ambos para que se miren. Observa sus sombras y el espacio entre ellos.',hint:'Elige dos sitios y gira los dos guardianes para que se miren.',lesson:'Elisabeth Frink dio presencia a sus figuras mediante la postura, la posición y la distancia. Dos estatuas pueden parecer comunicarse sin tocarse.',count:'Guardianes orientados',turn:'Girar guardián',move:'Mover guardián'},
riopelle:{title:'Construye un ensamblaje',intro:'Elige una base de madera y une tres objetos encontrados distintos. Decide qué pieza estabiliza la escultura.',hint:'Elige una base, añade tres materiales diferentes y fija la estructura.',lesson:'El ensamblaje da nueva vida a materiales descartados. Riopelle unía texturas y objetos para crear una composición expresiva.',count:'Materiales encontrados',anchor:'Anclar la escultura'},
rodin:{title:'Esculpe el lenguaje de una postura',intro:'Haz que la figura pase de estar de pie a sentarse. Apoya el brazo en la rodilla y acerca la mano al mentón. ¿Cuándo parece pensar?',hint:'Transforma el cuerpo en tres gestos consecutivos.',lesson:'Rodin transmitía el pensamiento con el peso, la tensión y la postura corporal. La cabeza inclinada y la mano en el mentón revelan un estado interior.',count:'Gestos de postura'},
cragg:{title:'Encuentra los rostros ocultos',intro:'Gira una escultura abstracta imaginaria. Descubre tres perfiles en ángulos distintos y revela cada rostro.',hint:'Gira hacia cada ángulo y toca el indicador brillante.',lesson:'Las superficies de Tony Cragg pueden sugerir rostros inesperados. Al cambiar el punto de vista, las curvas se convierten en perfiles.',count:'Perfiles descubiertos',rotate:'Girar escultura'},
common:{mica:'DESCUBRIMIENTO DE MICA',complete:'Guardar mi descubrimiento ✦',locked:'Completa primero el experimento',assist:'Usar una alternativa guiada',story:'Leer la historia de la obra',care:'Ilustración educativa original, no una reproducción exacta. No toques la obra real.',reset:'Empezar de nuevo',point:'Toca o arrastra los controles brillantes. Hay alternativas con teclado.',done:'¡Tu descubrimiento está listo!'}
}
};
const tr=()=>E[state.lang]||E.en;
const safe=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const button=(name,cmd,value='',klass='')=>'<button class="mf-btn '+klass+'" type="button" data-mf="'+cmd+'" data-v="'+safe(value)+'">'+safe(name)+'</button>';
const P=['wheel','wire','scrap','fabric','bark'],PI=['◉','〰','◆','▧','⌁'];
function data(C,id){
 if(!C.extra||C.extra.id!==id)C.extra={id,sweep:0,rubs:[],found:[],point:{x:79,y:74},doors:[],strokes:[],sun:.1,eye:.15,view:-1,views:[],guardians:[-1,-1],facing:[false,false],selectedGuardian:0,base:'',pieces:[],selectedPiece:'wheel',anchor:false,pose:0,joints:null,moves:[],angle:-40,faces:[]};
 return C.extra;
}
function complete(id,s){
 switch(id){
 case 'marrel':return s.sweep>=90&&s.found.length>=5;
 case 'witte':return s.doors.length===3&&Math.abs(s.point.x-50)<11&&Math.abs(s.point.y-45)<15;
 case 'fortin':return s.strokes.length>=3&&s.sun>=.7;
 case 'eye':return s.eye>=.8&&s.views.length===2;
 case 'frink':return s.guardians.every(v=>v>=0)&&s.guardians[0]!==s.guardians[1]&&s.facing.every(Boolean);
 case 'riopelle':return !!s.base&&new Set(s.pieces).size>=3&&s.anchor;
 case 'rodin':return s.pose>=3||(s.moves||[]).length>=3;
 case 'cragg':return s.faces.length===3;
 }return false;
}
function marrel(s,t){
  const details=[['🦋',57,52],['🐞',242,94],['🦎',256,202],['🐝',96,187],['🪲',185,43]],colors=['#c87d6e','#ebd0b0','#efabbb','#bdcf9e','#e4ab8e'];
  let svg='<svg class="mf-svg" viewBox="0 0 320 245" role="img" aria-label="'+safe(t.title)+'"><rect width="320" height="245" fill="#3c5040"/><path d="M159 227Q143 169 150 100M160 216Q192 169 234 108M155 210Q108 154 65 102M151 180Q195 116 182 46" stroke="#89a57b" fill="none" stroke-width="5"/>';
  for(let i=0;i<11;i++){const x=60+(i*41)%220,y=37+(i*53)%134;svg+='<g transform="translate('+x+' '+y+') rotate('+(i*32)+')">'+Array.from({length:6},(_,j)=>'<ellipse transform="rotate('+(j*60)+')" cy="-15" rx="8" ry="17" fill="'+colors[i%5]+'" stroke="#fcdbb8" stroke-width="1.2"/>').join('')+'<circle r="10" fill="#d5ab66"/><circle r="4" fill="#775645"/></g>'}
  svg+='<path d="M124 165h74l-11 70h-51Z" fill="#7a95a6" stroke="#e3d8ad" stroke-width="4"/>';
  // Clearly drawn lizards remain visible even before the copper has been polished.
  const lizard=(x,y,k)=>'<g class="mf-painted-lizard" transform="translate('+x+' '+y+') scale('+k+' 1)"><path d="M-17 7Q-37 19 -46 8Q-54 -2 -48 -11" stroke="#8fc585" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="5" rx="24" ry="11" fill="#9eca84" stroke="#375a47" stroke-width="2"/><path d="M-18 10L-31 24M0 13L-5 29M8 0L17 -15M-14 0L-19 -17" stroke="#9ec58c" stroke-width="5" stroke-linecap="round"/><circle cx="23" cy="3" r="11" fill="#b5d596" stroke="#375a47" stroke-width="2"/><circle cx="26" cy="0" r="2.5" fill="#213c36"/><path d="M30 8l8 3" stroke="#6c8970" stroke-width="2"/></g>';
  svg+=lizard(266,201,1)+lizard(72,214,-.7);
  svg+=details.map(([symbol,x,y],i)=>s.found.includes(i)?'<g class="mf-creature-found" transform="translate('+x+' '+y+')"><circle r="20" fill="#fcf3c566" stroke="#ffdb91" stroke-width="2"/><text y="9" text-anchor="middle" font-size="24">'+symbol+'</text></g>':'<circle class="mf-search-glint" cx="'+x+'" cy="'+y+'" r="9" fill="#fff4c433" stroke="#fff4c4" stroke-dasharray="3 4"/>').join('')+'</svg>';
  const strokes=(s.rubs||[]).map((path,i)=>'<path id="mf-rub-'+i+'" d="'+path.map((p,j)=>(j?'L':'M')+p[0]+' '+p[1]).join(' ')+'" fill="none" stroke="#000" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>').join('');
  const patina='<svg class="mf-copper-overlay" viewBox="0 0 320 245" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="mf-brush-mask"><rect width="320" height="245" fill="#fff"/>'+strokes+'</mask></defs><rect width="320" height="245" fill="#b87858" opacity=".61" mask="url(#mf-brush-mask)"/></svg>';
  return '<div class="mf-board mf-garden" data-mf-drag="sweep">'+svg+patina+details.map((d,i)=>'<button class="mf-secret '+(s.found.includes(i)?'found':'')+'" type="button" style="left:'+(d[1]/320*100)+'%;top:'+(d[2]/245*100)+'%" data-mf="find" data-v="'+i+'" aria-label="'+safe(t.count)+' '+(i+1)+'">'+(s.found.includes(i)?'✓':'✧')+'</button>').join('')+'</div><div class="mf-meter">'+safe(t.sweep)+' <b>'+Math.min(100,Math.round(s.sweep))+'%</b> · '+safe(t.count)+' <b>'+s.found.length+'/5</b></div>';
}
function witte(s,t){
 const x=s.point.x,y=s.point.y;
 let svg='<svg class="mf-svg" viewBox="0 0 320 245" role="img" aria-label="'+safe(t.title)+'"><defs><linearGradient id="mf-room" x2="0" y2="1"><stop stop-color="#e9d4af"/><stop offset="1" stop-color="#9c8c72"/></linearGradient></defs><rect width="320" height="245" fill="url(#mf-room)"/><path d="M0 0L'+(x*3.2)+' '+(y*2.45)+'L320 0M0 245L'+(x*3.2)+' '+(y*2.45)+'L320 245" fill="none" stroke="#907e65" stroke-width="5"/><path d="M0 245L'+(x*3.2)+' '+(y*2.45)+'L320 245" fill="#c5aa86"/>';
 for(let i=0;i<7;i++){const k=i/7;svg+='<path d="M'+(i*47)+' 245L'+(x*3.2)+' '+(y*2.45)+'" stroke="#7f7467" stroke-width="'+(1+i*.3)+'" opacity=".65"/>'}
 for(let i=0;i<5;i++){const yy=127+Math.pow(i/5,1.5)*115;svg+='<path d="M0 '+yy+'H320" stroke="#87786e" stroke-width="2" opacity=".6"/>'}
 svg+='<rect x="104" y="31" width="112" height="180" fill="#c4af8d" stroke="#756b5d" stroke-width="10"/><rect x="132" y="72" width="56" height="93" fill="#718e87" stroke="#e3d9bb" stroke-width="5"/><rect x="146" y="91" width="28" height="61" fill="#eacda1" stroke="#49645b" stroke-width="4"/>';
 svg+=[0,1,2].map((v,i)=>s.doors.includes(i)?'<path class="mf-door-open" d="M'+(17+i*12)+' '+(32+i*22)+'h'+(38-i*5)+'v'+(142-i*25)+'H'+(17+i*12)+'Z" fill="#fcecc8" opacity=".4" stroke="#f6e4b5" stroke-width="3"/>':'').join('');
 svg+='<circle cx="'+(x*3.2)+'" cy="'+(y*2.45)+'" r="10" fill="#f5d687" stroke="#fff5d0" stroke-width="3"/><circle cx="160" cy="110" r="14" fill="none" stroke="#4c9183" stroke-width="3" stroke-dasharray="4 4"/></svg>';
 return '<div class="mf-board mf-perspective">'+svg+'<button type="button" class="mf-drag-point" data-mf-drag="point" aria-label="'+safe(t.point)+'" style="left:'+x+'%;top:'+y+'%">✦</button>'+
 [0,1,2].map((v,i)=>'<button class="mf-door-button '+(s.doors.includes(i)?'open':'')+'" data-mf="door" data-v="'+i+'" type="button" style="left:'+(15+i*29)+'%;top:'+(17+i*9)+'%" aria-label="'+safe(t.count)+' '+(i+1)+'">'+(s.doors.includes(i)?'✓':i+1)+'</button>').join('')+'</div>'+
 '<div class="mf-meter">'+safe(t.count)+' <b>'+s.doors.length+'/3</b></div><div class="mf-controls">'+button('←','move-point','left')+button('↑','move-point','up')+button('↓','move-point','down')+button('→','move-point','right')+'</div>';
}
function fortin(s,t){
 const sky='<svg class="mf-svg" viewBox="0 0 320 245" role="img" aria-label="'+safe(t.title)+'"><defs><linearGradient id="mf-storm" x2="0" y2="1"><stop stop-color="#253b59"/><stop offset=".52" stop-color="#6d83a0"/><stop offset="1" stop-color="#e6c18d"/></linearGradient></defs><rect width="320" height="245" fill="url(#mf-storm)"/><path d="M-10 39Q70 4 139 32T330 19M-10 72Q90 42 170 62T330 51M-10 111Q90 80 151 99T330 92" stroke="#e5d5c3" stroke-width="22" fill="none" opacity=".43"/>'+
 s.strokes.map((p,i)=>'<path d="M'+p.x+' '+p.y+'q32 -25 90 3" stroke="'+(i%2?'#fff0d5':'#f6c785')+'" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round" class="mf-storm-stroke"/>').join('')+
 '<path d="M0 192h33v-40h11v-22h10v22h12v40h38v-25h27v25h23v-60l14-11 14 11v60h23v-35h28v35h25v-26h40v26h22v53H0Z" fill="#233c36"/><path d="M143 131v-45l13-24 13 24v45" fill="#2a423a"/>'+
 Array.from({length:10},(_,i)=>'<rect x="'+(10+i*29)+'" y="195" width="9" height="13" fill="#e0b47a" opacity=".7"/>').join('')+'</svg>';
 return '<div class="mf-board mf-storm" data-mf-drag="sky">'+sky+'<button type="button" class="mf-sun-handle" data-mf-drag="sun" style="left:'+(10+s.sun*80)+'%" aria-label="'+safe(t.light)+'">☀</button><div class="mf-light-wash" style="opacity:'+s.sun*.7+'"></div></div>'+
 '<div class="mf-meter">'+safe(t.count)+' <b>'+s.strokes.length+'/3</b> · '+safe(t.light)+' <b>'+Math.round(s.sun*100)+'%</b></div>';
}
function eye(s,t){
  const scale=.28+s.eye*1.63,view=s.view??-1;
  const shift=view===0?34:view===1?-38:0,vertical=view===0?-11:view===1?20:0,turn=view===0?-13:view===1?24:0,zoom=view===0?1.1:view===1?.69:1;
  const skyline=view===1?'<path d="M0 239L0 90H42V183L83 139L139 202L220 155L320 116V248H0Z" fill="#6d8785"/><path d="M0 235L139 184L320 219" stroke="#e4d5b7" stroke-width="9" fill="none"/>':'<path d="M0 215h30v-93h30v93h15V85h45v130h18V122h34v93h15V70h48v145h19V110h40v105h26v33H0Z" fill="#718d89"/>';
  const foreground=view===0?'<path d="M0 248L97 220H223L320 248" fill="#9ca79d"/><path d="M160 222L140 248M160 222L180 248" stroke="#d5ccaf" stroke-width="2"/>':view===1?'<path d="M0 248L0 203L78 222L150 217L241 226L320 202V248Z" fill="#bbc9ad"/><path d="M0 220Q160 198 320 218" stroke="#e8dcc1" stroke-width="8" fill="none"/>':'';
  const svg='<svg class="mf-svg" viewBox="0 0 320 248" role="img" aria-label="'+safe(t.title)+'"><defs><radialGradient id="mf-eye-sky"><stop stop-color="#fbe0be"/><stop offset="1" stop-color="'+(view===1?'#89aaa3':'#b0c4bd')+'"/></radialGradient></defs><rect width="320" height="248" fill="url(#mf-eye-sky)"/><g class="mf-eye-city" transform="translate('+(view===0?-24:view===1?21:0)+' '+(view===1?27:0)+') skewX('+(view===0?7:view===1?-7:0)+')">'+skyline+'</g><g class="mf-big-eye" transform="translate('+(160+shift)+' '+(123+vertical)+') rotate('+turn+') scale('+(scale*zoom)+')"><path d="M-80 0Q0 -61 80 0Q0 61 -80 0Z" fill="#e7dfc8" stroke="#2f5d62" stroke-width="6"/><circle r="40" fill="#83b69f"/><circle r="25" fill="#2e5563"/><circle r="13" fill="#1f3942"/><circle cx="-9" cy="-11" r="9" fill="#fff6df"/></g>'+foreground+'</svg>';
  return '<div class="mf-board mf-monument" data-view="'+view+'">'+svg+'<div class="mf-perspective-caption" aria-live="polite">'+safe(view<0?t.intro:t.viewsText[view])+'</div><button class="mf-size-handle" type="button" data-mf-drag="eye" aria-label="'+safe(t.scale)+'" style="left:'+(20+s.eye*65)+'%">↗</button></div><div class="mf-controls">'+[0,1].map(i=>button('◫ '+t.viewsText[i],'view',i,view===i?'active':'')).join('')+'</div><div class="mf-meter">'+safe(t.scale)+' <b>'+Math.round(s.eye*100)+'%</b> · '+safe(t.count)+' <b>'+s.views.length+'/2</b></div>';
}
function frink(s,t){
  const points=[13,31,50,69,87],selected=s.selectedGuardian??0;
  const svg='<svg class="mf-svg" viewBox="0 0 320 235" role="img" aria-label="'+safe(t.title)+'"><rect width="320" height="235" fill="#e6e6d7"/><path d="M0 170Q160 144 320 171V235H0Z" fill="#9aa99a"/><path d="M0 189h320M0 213h320" stroke="#e4ddc9" stroke-width="3"/></svg>';
  let bodies='';
  for(let i=0;i<2;i++){
   if(s.guardians[i]===-1)continue;
   const x=points[s.guardians[i]],other=s.guardians[1-i],towards=other<0?(i===0?1:-1):(s.guardians[i]<other?1:-1),f=s.facing[i]?towards:-towards;
   bodies+='<div class="mf-guardian '+(s.facing[i]?'looking':'')+' '+(selected===i?'is-selected':'')+'" data-mf-drag="guardian" data-v="'+i+'" style="left:'+x+'%;--f:'+f+'" role="button" tabindex="0" aria-label="'+safe(t.move)+' '+(i+1)+'"><svg viewBox="0 0 90 140" aria-hidden="true"><ellipse cx="44" cy="134" rx="38" ry="5" fill="#526962" opacity=".42"/><path d="M31 51Q45 43 58 50L75 118Q45 137 13 119Z" fill="#9ba59e" stroke="#526c66" stroke-width="5"/><path d="M30 14Q48 3 60 18L64 33 53 47 29 43Q17 30 30 14Z" fill="#afaea2" stroke="#526c66" stroke-width="4"/><path d="M58 27l13 4-12 5" fill="#8d958d" stroke="#526c66" stroke-width="2"/></svg><span>'+(i+1)+'</span></div>';
  }
  const gazing=s.facing.every(Boolean)&&s.guardians.every(x=>x>=0),left=gazing?Math.min(...s.guardians.map(i=>points[i])):0,right=gazing?Math.max(...s.guardians.map(i=>points[i])):0;
  return '<div class="mf-board mf-courtyard">'+svg+bodies+(gazing?'<div class="mf-gaze-line" style="left:'+left+'%;width:'+(right-left)+'%"></div>':'')+
  points.map((x,i)=>'<button class="mf-courtyard-spot '+(s.guardians.includes(i)?'occupied':'')+'" style="left:'+x+'%" data-mf="guardian" data-v="'+i+'" type="button" aria-label="'+safe(t.move)+' '+(i+1)+'">'+(s.guardians.includes(i)?'●':'＋')+'</button>').join('')+'</div>'+
  '<div class="mf-controls">'+[0,1].map(i=>button((selected===i?'✓ ':'◉ ')+t.move+' '+(i+1),'select-guardian',i,selected===i?'active':'')).join('')+'</div><div class="mf-controls">'+[0,1].map(i=>button((s.facing[i]?'↶ ':'↻ ')+t.turn+' '+(i+1),'face',i,s.facing[i]?'active':'')).join('')+'</div><div class="mf-meter">'+safe(t.count)+' <b>'+s.facing.filter(Boolean).length+'/2</b></div>';
}
function riopelle(s,t){
 const shapes={
 wheel:'<circle r="24" fill="none" stroke="#435c62" stroke-width="12"/><circle r="9" fill="#d3b18e" stroke="#435c62" stroke-width="5"/><path d="M-21 0H21M0 -21V21" stroke="#627f81" stroke-width="4"/>',
 wire:'<path d="M-21 21Q-37 4 -11 -12T16 -27Q32 -36 27 -16T6 9Q-13 23 18 27" stroke="#bba87b" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-28 -3Q0 -20 25 -1" stroke="#e0d1a7" stroke-width="3" fill="none"/>',
 scrap:'<path d="M-22 24L-26 -24L4 -29L27 -1L14 27Z" fill="#7e8a82" stroke="#425c5d" stroke-width="5"/><path d="M4 -29L0 0L27 -1M-22 24L0 0L14 27" stroke="#c9c2a4" stroke-width="4" fill="none"/>',
 fabric:'<path d="M-27 -27Q-6 -35 10 -19T29 8Q-8 -1 20 28Q-11 13 -25 29Z" fill="#bd818a" stroke="#8e596b" stroke-width="3"/><path d="M-19 -12Q4 -5 9 18" stroke="#f4d6bd" stroke-width="4" fill="none"/>',
 bark:'<path d="M-19 -31Q7 -39 22 -27L15 30L-25 27Z" fill="#775b40" stroke="#4e4c3b" stroke-width="4"/><path d="M-9 -27Q-19 -1 -4 26M8 -28Q0 -8 14 24" stroke="#b09a74" stroke-width="5" fill="none"/>'};
 const loose=[[75,79],[240,97],[95,166],[242,166],[160,56]],locked=[[153,182],[177,145],[146,112],[181,78],[153,47]];
 const parts=s.pieces.map((name,i)=>{
  const start=loose[i],end=locked[i],p=s.anchor?end:start,rot=s.anchor?(i%2?24:-17):(i*43-42);
  return '<g class="mf-junk mf-junk-'+name+'" transform="translate('+p[0]+' '+p[1]+') rotate('+rot+')" aria-label="'+safe(name)+'" role="img">'+(shapes[name]||'')+'</g>';
 }).join('');
 const ties=s.anchor?'<g class="mf-assembly-joints"><path d="M153 216L153 182L177 145L146 112L181 78L153 47" stroke="#726a61" stroke-width="9" fill="none" stroke-linecap="round"/>'+locked.slice(0,s.pieces.length).map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#e8c88a" stroke="#6b6e5a" stroke-width="3"/>').join('')+'</g>':'';
 const plank=s.base?'<path d="M77 218L249 218L262 231L63 231Z" fill="'+(s.base==='dark'?'#674d3c':'#d7b88a')+'" stroke="#625543" stroke-width="6"/><path d="M95 224H236" stroke="#e6d2ae" opacity=".55" stroke-width="3"/>':'<rect x="79" y="213" width="162" height="14" rx="4" fill="#b2aaa0" stroke-dasharray="5 5"/>';
 const illustration='<svg class="mf-assembly-sculpture '+(s.anchor?'assembled':'')+'" viewBox="0 0 320 245" role="img" aria-label="'+safe(t.title)+'"><ellipse cx="160" cy="233" rx="105" ry="11" fill="#606763" opacity=".2"/>'+plank+ties+parts+(s.anchor?'<g class="mf-assembly-sparks"><path d="M64 65l8 -14m0 14l-10 -12M246 67l9 -12m-13 0l13 12M244 190l15 -9" stroke="#fbe2a6" stroke-width="4" stroke-linecap="round"/></g>':'')+'</svg>';
 return '<div class="mf-board mf-assemblage"><div class="mf-assembly-back">✦ <span>FOUND OBJECTS</span> ✦</div>'+illustration+'<div class="mf-assembly-wires"></div></div>'+
 '<div class="mf-controls">'+button('◧','base','light',s.base==='light'?'active':'')+button('▥','base','dark',s.base==='dark'?'active':'')+'</div>'+
 '<div class="mf-controls">'+P.map((name,i)=>button(PI[i]+' '+name,'piece',name,s.pieces.includes(name)?'active':'')).join('')+'</div>'+
 button((s.anchor?'✓ ':'⚓ ')+t.anchor,'anchor','yes',s.anchor?'active':'')+
 '<div class="mf-meter">'+safe(t.count)+' <b>'+new Set(s.pieces).size+'/3</b>'+(s.anchor?' · ✦':'')+'</div>';
}
const RODIN_POSES=[
 {shoulder:[151,95],hip:[157,164],head:[153,59],elbow:[209,130],hand:[191,159],knee:[128,205]},
 {shoulder:[148,94],hip:[171,155],head:[148,62],elbow:[191,130],hand:[180,162],knee:[133,169]},
 {shoulder:[147,92],hip:[175,153],head:[146,64],elbow:[195,137],hand:[180,150],knee:[132,171]},
 {shoulder:[144,91],hip:[175,153],head:[144,62],elbow:[191,129],hand:[157,77],knee:[132,171]}
];
function rodinGeometry(s){
 const source=s.joints||RODIN_POSES[clamp(s.pose||0,0,3)];
 return Object.fromEntries(Object.entries(source).map(([k,v])=>[k,[...v]]));
}
function rodinPaths(p){
 const xy=k=>p[k][0]+' '+p[k][1];
 return {torso:'M'+xy('shoulder')+'L'+xy('hip'),arm:'M'+xy('shoulder')+'L'+xy('elbow')+'L'+xy('hand'),legs:'M'+xy('hip')+'L'+xy('knee')+'L137 213M'+xy('hip')+'L204 170L207 212'};
}
function rodin(s,t){
 const pose=s.pose,p=rodinGeometry(s),path=rodinPaths(p);
 const svg='<svg class="mf-svg mf-thinker-svg" viewBox="0 0 320 240" role="img" aria-label="'+safe(t.title)+'"><defs><linearGradient id="mf-bronze"><stop stop-color="#b68b66"/><stop offset=".55" stop-color="#746e63"/><stop offset="1" stop-color="#3e5855"/></linearGradient></defs><rect width="320" height="240" fill="#e8e2d0"/><path d="M80 212H240" stroke="#b9aa93" stroke-width="9"/><path d="M106 158H182V216" stroke="#65726a" stroke-width="16" fill="none"/><g class="mf-pose-motion"><path class="mf-rodin-leg" d="'+path.legs+'" stroke="#435b56" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path class="mf-rodin-torso" d="'+path.torso+'" stroke="url(#mf-bronze)" stroke-width="34" stroke-linecap="round"/><path class="mf-rodin-arm" d="'+path.arm+'" stroke="#b29072" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle class="mf-rodin-head" cx="'+p.head[0]+'" cy="'+p.head[1]+'" r="24" fill="#a78e73" stroke="#6c6255" stroke-width="4"/></g>'+(pose>=3||(s.moves||[]).length>=3?'<path class="mf-thought" d="M184 52Q224 15 255 52" fill="none" stroke="#d5a45b" stroke-width="4" stroke-dasharray="6 6"/><text x="255" y="29" font-size="25" fill="#a57853">?</text>':'')+'</svg>';
 const handles=['head','elbow','hand','knee'].map((name,i)=>'<button class="mf-joint-handle mf-joint-'+name+'" type="button" data-mf-drag="joint" data-joint="'+name+'" style="left:'+(p[name][0]/320*100)+'%;top:'+(p[name][1]/240*100)+'%" aria-label="'+safe(name)+' '+safe(t.title)+'">'+['◌','↷','✋','⌁'][i]+'</button>').join('');
 return '<div class="mf-board mf-rodin" data-pose="'+pose+'">'+svg+handles+'<button class="mf-body-handle" type="button" data-mf="pose" data-v="'+(pose+1)+'" aria-label="'+safe(t.title)+' '+(pose+1)+'">'+(pose===3?'✓':'⇢')+'</button></div>'+
 '<div class="mf-controls">'+['①','②','③'].map((v,i)=>button(v,'pose',i+1,pose>=i+1?'active':'')).join('')+'</div>'+
 '<div class="mf-meter">'+safe(t.count)+' <b>'+Math.max(pose,(s.moves||[]).length)+'/3</b></div>';
}
function updateRodinLive(s){
 const p=rodinGeometry(s),path=rodinPaths(p),board=document.querySelector('.mf-rodin');if(!board)return;
 const set=(selector,a,v)=>{const e=board.querySelector(selector);if(e)e.setAttribute(a,v)};
 set('.mf-rodin-torso','d',path.torso);set('.mf-rodin-arm','d',path.arm);set('.mf-rodin-leg','d',path.legs);
 set('.mf-rodin-head','cx',p.head[0]);set('.mf-rodin-head','cy',p.head[1]);
 for(const name of ['head','elbow','hand','knee']){const e=board.querySelector('.mf-joint-'+name);if(e){e.style.left=(p[name][0]/320*100)+'%';e.style.top=(p[name][1]/240*100)+'%'}}
}
function cragg(s,t){
 const profiles=['M57 30Q78 12 91 40L99 50L90 59Q93 93 67 110','M131 27Q153 21 166 45L169 61L159 69Q164 96 139 117','M204 28Q229 21 243 47L252 63L241 72Q237 96 211 111'];
 const visible=Math.min(2,Math.max(0,Math.round((s.angle+45)/45))),shades=['#b6c9bd','#87a99e','#587e78'];
 const svg='<svg class="mf-cragg-model" viewBox="0 0 320 260" role="img" aria-label="'+safe(t.title)+'"><defs><linearGradient id="mf-stone" x2="1" y2=".5"><stop stop-color="'+shades[visible]+'"/><stop offset=".55" stop-color="#c1cbbc"/><stop offset="1" stop-color="#4a746b"/></linearGradient></defs><g class="mf-cragg-volume"><path d="M155 18Q204 7 226 57Q255 107 219 139Q257 174 220 219Q177 247 115 222Q71 201 97 162Q57 120 91 86Q83 42 155 18Z" fill="#436964" stroke="#466e67" stroke-width="11" transform="translate(17 0)"/><path d="M155 18Q204 7 226 57Q255 107 219 139Q257 174 220 219Q177 247 115 222Q71 201 97 162Q57 120 91 86Q83 42 155 18Z" fill="url(#mf-stone)" stroke="#607e75" stroke-width="6"/><path d="M150 20Q115 85 146 126Q172 163 121 223" stroke="#e9f0df" fill="none" stroke-width="16" opacity=".61"/><path d="M203 40Q173 89 204 143Q233 187 204 227" stroke="#547d79" fill="none" stroke-width="9" opacity=".65"/><path d="'+profiles[visible]+'" stroke="#fff2c9" stroke-width="6" fill="none" opacity=".7"/>'+
 s.faces.map(v=>'<path d="'+profiles[v]+'" stroke="'+['#c77a61','#e5ba7c','#7b9a91'][v]+'" stroke-width="7" fill="none" opacity=".92"/>').join('')+'</g></svg>';
 return '<div class="mf-board mf-cragg" data-mf-drag="rotate"><div class="mf-cragg-backdrop"><div class="mf-turntable" style="--turn:'+(s.angle*1.72)+'deg">'+svg+'</div><div class="mf-cragg-shadow" style="transform:translateX('+(s.angle*.3)+'px) scale('+(1-Math.abs(s.angle)/230)+')"></div></div><button class="mf-face-hotspot" style="left:'+(30+visible*22)+'%" type="button" data-mf="reveal" data-v="'+visible+'" aria-label="'+safe(t.count)+' '+(visible+1)+'">'+(s.faces.includes(visible)?'✓':'✧')+'</button></div>'+
 '<div class="mf-controls">'+button('↶','turn','left')+[-45,0,45].map((angle,i)=>button('◖ '+(i+1),'angle',angle,visible===i?'active':'')).join('')+button('↷','turn','right')+'</div>'+
 '<div class="mf-meter">'+safe(t.rotate)+' <b>'+Math.round(s.angle)+'°</b> · '+safe(t.count)+' <b>'+s.faces.length+'/3</b></div>';
}
const scenes={marrel,witte,fortin,eye,frink,riopelle,rodin,cragg};
function game(a,C){
 const id=a.id.slice(5),s=data(C,a.id),t=tr()[id],common=tr().common;if(!t)return '';
 C.done=complete(id,s);
 return '<div class="t1-screen mf-screen mf-game-'+id+'"><div class="t1-overline">MMFA · '+safe(a.artist)+'</div><h2 class="t1-h1">'+safe(t.title)+'</h2>'+
 '<p class="mf-intro">'+safe(t.intro)+'</p>'+scenes[id](s,t)+
 '<p class="mf-hint">'+safe(t.hint)+'</p>'+
 (C.done?'<div class="mf-mica-conclusion" role="status"><div class="mf-mica-avatar" aria-hidden="true"><span>•ᴗ•</span></div><div><strong>'+safe(common.mica)+'</strong><p>'+safe(t.lesson)+'</p></div><span class="mf-stardust" aria-hidden="true">✧ ✦ ✧</span></div>':'<p class="mf-note" role="status">'+safe(common.care)+'</p>')+
 '<button type="button" class="button" data-t1-finish '+(C.done?'':'disabled')+'>'+safe(C.done?common.complete:common.locked)+'</button>'+
 '<button type="button" class="button ghost" data-t1-assist>'+safe(common.assist)+'</button><button type="button" class="button outline" data-action="v7-story">'+safe(common.story)+'</button></div>';
}
function ctx(){if(state.venue!=='mmfa'||state.tab!=='quest'||state.stage!=='puzzle')return null;const a=A[state.current],C=window.TRACE_V1?.puzzle;if(!a||!C||!a.id.startsWith('mmfa-'))return null;return {a,C,s:data(C,a.id),id:a.id.slice(5)}}
function redraw(c){if(!c)return;c.C.done=complete(c.id,c.s);window.__traceAppRender?.()}
function hit(ev){const b=ev.target.closest('[data-mf]'),c=ctx();if(!b||!c)return;ev.preventDefault();ev.stopImmediatePropagation();
const s=c.s,act=b.dataset.mf,v=b.dataset.v;
switch(c.id){
case 'marrel':if(act==='find')push(s.found,Number(v));if(act==='sweep')s.sweep=Math.min(150,s.sweep+20);break;
case 'witte':if(act==='door')push(s.doors,Number(v));if(act==='move-point'){s.point.x=clamp(s.point.x+(v==='left'?-12:v==='right'?12:0),2,98);s.point.y=clamp(s.point.y+(v==='up'?-10:v==='down'?10:0),2,98)}break;
case 'fortin':if(act==='add-stroke')s.strokes.push({x:70+s.strokes.length*39,y:45+s.strokes.length*22});if(act==='light')s.sun=clamp(s.sun+.2,0,1);break;
case 'eye':if(act==='view'){s.view=Number(v);push(s.views,s.view)}if(act==='eye')s.eye=clamp(s.eye+.2,0,1);break;
case 'frink':if(act==='select-guardian')s.selectedGuardian=Number(v);if(act==='guardian'){const n=Number(v),occupant=s.guardians.indexOf(n);if(occupant>=0)s.selectedGuardian=occupant;else{let idx=s.guardians.indexOf(-1);if(idx<0)idx=s.selectedGuardian??0;s.guardians[idx]=n;s.selectedGuardian=idx===0?1:0;s.facing=[false,false]}}if(act==='face'){const i=Number(v);if(s.guardians.every(x=>x>=0))s.facing[i]=!s.facing[i]}break;
case 'riopelle':if(act==='base'){s.base=v;s.anchor=false}if(act==='piece'){push(s.pieces,v);s.anchor=false}if(act==='anchor'&&s.base&&new Set(s.pieces).size>=3)s.anchor=true;break;
case 'rodin':if(act==='pose'&&Number(v)===s.pose+1){s.pose++;s.joints=null}break;
case 'cragg':if(act==='angle')s.angle=Number(v);if(act==='turn')s.angle=clamp(s.angle+(v==='left'?-15:15),-45,45);if(act==='reveal'){const n=Number(v);if(n===Math.min(2,Math.max(0,Math.round((s.angle+45)/45))))push(s.faces,n)}break;
}redraw(c)
}
function push(a,x){if(!a.includes(x))a.push(x)}
document.addEventListener('click',hit,true);
let drag=null;
document.addEventListener('pointerdown',ev=>{
 const node=ev.target.closest('[data-mf-drag]'),c=ctx();if(!node||!c)return;
 const kind=node.dataset.mfDrag;
 // Placing and revealing a symbol is a click, not a painting drag.
 if(ev.target.closest('[data-mf]')&&['sweep','rotate'].includes(kind))return;
 const map={sweep:'marrel',point:'witte',sky:'fortin',sun:'fortin',eye:'eye',rotate:'cragg',guardian:'frink',joint:'rodin'};
 if(map[kind]!==c.id)return;
 const r=node.closest('.mf-board')?.getBoundingClientRect();if(!r)return;
 drag={c,kind,node,rect:r,startX:ev.clientX,startY:ev.clientY,lastX:ev.clientX,lastY:ev.clientY,distance:0,guardian:Number(node.dataset.v),joint:node.dataset.joint};
 if(kind==='sweep'){c.s.rubs??=[];c.s.rubs.push([]);drag.rubIndex=c.s.rubs.length-1}
 try{node.setPointerCapture(ev.pointerId)}catch(_){}
 ev.preventDefault();
},true);
document.addEventListener('pointermove',ev=>{
 const d=drag;if(!d)return;const s=d.c.s,r=d.rect;
 const dx=ev.clientX-d.lastX,dy=ev.clientY-d.lastY;
 d.distance+=Math.hypot(dx,dy);d.lastX=ev.clientX;d.lastY=ev.clientY;
 if(d.kind==='point'){s.point.x=clamp((ev.clientX-r.left)/r.width*100,0,100);s.point.y=clamp((ev.clientY-r.top)/r.height*100,0,100);d.node.style.left=s.point.x+'%';d.node.style.top=s.point.y+'%'}
 if(d.kind==='sun'){s.sun=clamp((ev.clientX-r.left)/r.width,0,1);d.node.style.left=(10+s.sun*80)+'%';const light=document.querySelector('.mf-light-wash');if(light)light.style.opacity=s.sun*.7}
 if(d.kind==='eye'){s.eye=clamp((ev.clientX-r.left)/r.width,0,1);d.node.style.left=(20+s.eye*65)+'%';const eye=document.querySelector('.mf-big-eye');if(eye){const v=s.view??-1;eye.setAttribute('transform','translate('+(160+(v===0?34:v===1?-38:0))+' '+(123+(v===0?-11:v===1?20:0))+') rotate('+(v===0?-13:v===1?24:0)+') scale('+((.28+s.eye*1.63)*(v===0?1.1:v===1?.69:1))+')')}}
 if(d.kind==='rotate'){s.angle=clamp(s.angle+dx*.65,-45,45);const sculpture=document.querySelector('.mf-turntable');if(sculpture)sculpture.style.setProperty('--turn',(s.angle*1.72)+'deg')}
 if(d.kind==='sweep'){s.sweep=clamp(s.sweep+Math.hypot(dx,dy)*.34,0,150);const p=[Math.round(clamp((ev.clientX-r.left)/r.width*320,0,320)),Math.round(clamp((ev.clientY-r.top)/r.height*245,0,245))];const rub=s.rubs[d.rubIndex];if(rub&&rub.length<350){rub.push(p);const path=document.getElementById('mf-rub-'+d.rubIndex);if(path)path.setAttribute('d',rub.map((xy,i)=>(i?'L':'M')+xy[0]+' '+xy[1]).join(' '))}}
 if(d.kind==='sky'){const x=clamp((ev.clientX-r.left)/r.width*320,10,205),y=clamp((ev.clientY-r.top)/r.height*245,10,130);d.x=x;d.y=y}
 if(d.kind==='guardian'&&d.distance>7)d.node.style.left=clamp((ev.clientX-r.left)/r.width*100,12,88)+'%';
 if(d.kind==='joint'){s.joints??=rodinGeometry(s);const p=s.joints[d.joint];if(p){p[0]=Math.round(clamp((ev.clientX-r.left)/r.width*320,65,255));p[1]=Math.round(clamp((ev.clientY-r.top)/r.height*240,19,217));updateRodinLive(s)}}
},true);
function end(ev){
 const d=drag;if(!d)return;drag=null;
 if(d.kind==='sky'&&d.distance>=28)d.c.s.strokes.push({x:d.x||30,y:d.y||40});
 if(d.kind==='sweep'&&d.distance>=8)d.c.s.sweep=clamp(d.c.s.sweep+8,0,150);
 if(d.kind==='joint'&&d.distance>=11)push(d.c.s.moves,d.joint);
 if(d.kind==='guardian'&&d.distance>=16){const pts=[13,31,50,69,87],x=(ev.clientX-d.rect.left)/d.rect.width*100,n=pts.reduce((best,p,i)=>Math.abs(p-x)<Math.abs(pts[best]-x)?i:best,0);if(!d.c.s.guardians.includes(n)||d.c.s.guardians[d.guardian]===n){d.c.s.guardians[d.guardian]=n;d.c.s.facing=[false,false];d.c.s.selectedGuardian=d.guardian}}
 redraw(d.c);
}
document.addEventListener('pointerup',end,true);
document.addEventListener('pointercancel',end,true);
document.addEventListener('keydown',ev=>{
 const node=ev.target.closest('[data-mf-drag]'),c=ctx();if(!node||!c||!['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const s=c.s,k=node.dataset.mfDrag;
 if(k==='sweep')s.sweep=Math.min(150,s.sweep+38);
 if(k==='point'){s.point.x=clamp(s.point.x+(ev.key==='ArrowLeft'?-10:ev.key==='ArrowRight'?10:0),0,100);s.point.y=clamp(s.point.y+(ev.key==='ArrowUp'?-10:ev.key==='ArrowDown'?10:0),0,100)}
 if(k==='sun')s.sun=clamp(s.sun+.25,0,1);
 if(k==='sky')s.strokes.push({x:35+(s.strokes.length%3)*35,y:30+s.strokes.length*14});
 if(k==='eye')s.eye=clamp(s.eye+.22,0,1);
 if(k==='guardian')s.selectedGuardian=Number(node.dataset.v);
 if(k==='joint'){s.joints??=rodinGeometry(s);const p=s.joints[node.dataset.joint];if(p){p[0]=clamp(p[0]+(ev.key==='ArrowLeft'?-10:ev.key==='ArrowRight'?10:0),65,255);p[1]=clamp(p[1]+(ev.key==='ArrowUp'?-10:ev.key==='ArrowDown'?10:0),19,217);push(s.moves,node.dataset.joint)}}
 if(k==='rotate')s.angle=clamp(s.angle+45,-45,45);
 redraw(c);
},true);
window.TRACE_MMFA_GAME={has:id=>typeof id==='string'&&id.startsWith('mmfa-')&&Object.hasOwn(scenes,id.slice(5)),game,translations:E,conclusion:(id,lang)=>E[lang]?.[id?.slice(5)]?.lesson||E.en[id?.slice(5)]?.lesson||null,complete:(id,s)=>complete(id,s)};
})();