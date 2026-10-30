/* TRACE PAMM rebuilt creative adventures: eight distinct educational games, 2026.
   All scenery is original illustration; no claim to reproduce or modify collection art. */
(function(){
'use strict';
const L={
en:{
masks:['Make a visual language','Place four different signs into an architectural grid. Symbols become a story when you arrange them.','Choose a sign, then place it in any square.','Torres-García combined familiar signs in an ordered grid. You have arranged your own visual vocabulary.'],
delano:['Follow a photographer’s eye','Explore three details of a hillside community, then choose how the sky changes the photograph’s mood.','Find the houses, road and sky.','Jack Delano’s photograph records a real place. The winding road connects the homes, and his viewpoint helps us imagine life there.'],
grid:['Write with shapes','Use six architectural compartments to invent a graphite alphabet. Each sign carries a possible meaning.','Choose a sign and fill at least five rooms with three different signs.','With a pencil and a grid, Torres-García built a visual alphabet. Simple marks can carry complex ideas.'],
chaos:['Build a balancing tower','Shift two open steel cubes, then rotate one. Look how gaps become as expressive as metal.','Select a cube, move it and turn it. Keep the balance below the warning line.','Jedd Novatt’s sculpture challenges the idea that heavy steel must look stable. The empty space helps create its precarious energy.'],
fonseca:['Carve a miniature world','Open secret niches in a marble column, then furnish at least four with symbolic objects.','Tap a sealed niche to carve it, then tap again to place your chosen miniature.','Fonseca transforms solid marble into imagined architecture. Small recesses suggest entire worlds inside stone.'],
yanko:['Build with industrial materials','Assemble a sculpture with a base, metal, a hose, a dried paint skin and support. Watch how one material changes the next.','Choose the next component and connect the five sockets into one structure.','Kennedy Yanko transforms industrial metal, hoses and dried paint skins into sculptural forms. Materials become new forms through their relationships.'],
christo:['Surround the islands','Wrap both islands in luminous pink fabric. Each tap extends the perimeter and makes the bay sparkle.','Surround each island twice until the pink ribbons meet.','Christo and Jeanne-Claude temporarily changed how Miami saw Biscayne Bay. Fabric transformed the coastline without becoming a permanent monument.'],
chromati:['Create a glittering inner world','Compose a layered canvas with acrylic, gouache and glitter. Discover how colour, shapes and shine can express feeling.','Choose a material and paint at least five spaces, using all three materials.','Theresa Chromati brings expressive bodies and an inner world to life using layered paint, gesture and glitter.'],
common:{mica:'MICA’S DISCOVERY',done:'Collect your discovery ✦',locked:'Complete the creative activity first',assist:'Use a guided alternative',story:'Read the artwork’s story',count:'Creative progress',care:'This is an original illustration. Observe the artwork, never touch it.',reset:'Start over',choose:'Choose',symbols:['Mask','Fish','Sun','House','Star','Ship'],moods:['Stormy light','Golden light'],pieces:['Base','Steel panel','Pneumatic hose','Dried paint skin','Support'],tools:['Acrylic','Gouache','Glitter'],niches:['Arch','Sphere','Stair','Door'],direction:['← Shift left','Shift right →','↻ Rotate']}
},
fr:{
masks:['Crée un langage visuel','Place quatre signes différents dans une grille architecturale. Leur disposition raconte une histoire.','Choisis un signe et place-le dans une case.','Torres-García associait des signes familiers dans une grille ordonnée. Tu viens de composer ton propre vocabulaire visuel.'],
delano:['Le regard du photographe','Explore trois détails d’une communauté sur une colline, puis change la lumière du ciel.','Trouve les maisons, la route et le ciel.','La photographie de Jack Delano conserve le souvenir d’un lieu réel. La route relie les maisons et son cadrage nous fait imaginer la vie des habitants.'],
grid:['Écris avec des formes','Invente un alphabet au graphite dans six compartiments. Chaque symbole peut raconter quelque chose.','Choisis un signe et remplis cinq cases avec trois symboles différents.','Avec un crayon et une grille, Torres-García créait un alphabet visuel. De simples marques peuvent exprimer des idées complexes.'],
chaos:['Construis une tour en équilibre','Déplace deux cubes d’acier ajourés, puis fais tourner l’un d’eux. Les espaces deviennent aussi expressifs que le métal.','Choisis un cube, déplace-le et tourne-le. Garde la tour en équilibre.','La sculpture de Jedd Novatt défie notre idée de la stabilité de l’acier. Les vides lui donnent son énergie précaire.'],
fonseca:['Sculpte un monde miniature','Creuse des niches secrètes dans une colonne de marbre, puis dépose des objets dans quatre d’entre elles.','Touche une niche fermée pour l’ouvrir, puis touche-la à nouveau pour y placer un objet.','Fonseca transforme le marbre massif en architecture imaginée. De petites ouvertures cachent des mondes entiers.'],
yanko:['Construis avec des matériaux industriels','Assemble une base, une plaque métallique, un tuyau, une peau de peinture séchée et un support. Observe leurs interactions.','Choisis chaque pièce et relie les cinq points en une sculpture.','Kennedy Yanko transforme métal industriel, tuyaux et peinture séchée en sculpture. Les matériaux prennent un sens nouveau ensemble.'],
christo:['Entoure les îles','Enveloppe les deux îles dans un tissu rose lumineux. Chaque touche prolonge le contour et fait scintiller la baie.','Entoure deux fois chaque île jusqu’à fermer les rubans roses.','Christo et Jeanne-Claude ont temporairement transformé le regard sur la baie de Biscayne à Miami. Le tissu modifiait le paysage sans monument permanent.'],
chromati:['Crée un univers scintillant','Compose une toile avec acrylique, gouache et paillettes. Couleurs et textures peuvent exprimer des émotions.','Choisis une matière et peins cinq cases en utilisant les trois matières.','Theresa Chromati donne vie à un univers intérieur par les couches de peinture, les gestes expressifs et les paillettes.'],
common:{mica:'LA DÉCOUVERTE DE MICA',done:'Enregistrer ma découverte ✦',locked:'Termine d’abord la création',assist:'Utiliser une autre méthode guidée',story:'Lire l’histoire de l’œuvre',count:'Progression créative',care:'Illustration originale. Observe l’œuvre sans la toucher.',reset:'Recommencer',choose:'Choisir',symbols:['Masque','Poisson','Soleil','Maison','Étoile','Bateau'],moods:['Ciel orageux','Lumière dorée'],pieces:['Base','Plaque d’acier','Tuyau pneumatique','Peau de peinture','Support'],tools:['Acrylique','Gouache','Paillettes'],niches:['Arche','Sphère','Escalier','Porte'],direction:['← Vers la gauche','Vers la droite →','↻ Tourner']}
},
es:{
masks:['Crea un lenguaje visual','Coloca cuatro símbolos diferentes en una cuadrícula arquitectónica. Su disposición puede contar una historia.','Elige un signo y colócalo en una casilla.','Torres-García combinaba signos familiares en una cuadrícula ordenada. Acabas de crear tu propio vocabulario visual.'],
delano:['La mirada del fotógrafo','Explora tres detalles de una comunidad en la colina y cambia la luz del cielo.','Encuentra las casas, la carretera y el cielo.','La fotografía de Jack Delano conserva la memoria de un lugar real. La carretera conecta las casas y su encuadre nos ayuda a imaginar la vida allí.'],
grid:['Escribe con formas','Inventa un alfabeto a lápiz en seis compartimentos. Cada signo puede llevar un significado.','Elige un símbolo y llena cinco casillas con tres signos diferentes.','Con un lápiz y una cuadrícula, Torres-García construyó un alfabeto visual. Las marcas sencillas pueden expresar ideas complejas.'],
chaos:['Construye una torre equilibrada','Mueve dos cubos abiertos de acero y gira uno. El espacio vacío puede ser tan expresivo como el metal.','Elige un cubo, muévelo y gíralo. Mantén el equilibrio.','La escultura de Jedd Novatt desafía la idea de que el acero debe parecer estable. El espacio vacío crea su energía precaria.'],
fonseca:['Esculpe un mundo en miniatura','Abre nichos secretos en una columna de mármol y coloca objetos en al menos cuatro.','Toca un nicho cerrado para abrirlo y después toca otra vez para colocar un objeto.','Fonseca transforma el mármol sólido en arquitectura imaginaria. Los pequeños huecos sugieren mundos enteros.'],
yanko:['Construye con materiales industriales','Monta una base, una chapa de acero, una manguera, una piel de pintura seca y un soporte. Observa cómo se conectan.','Elige una pieza y conecta los cinco puntos para crear una escultura.','Kennedy Yanko transforma metal industrial, mangueras y pintura seca en formas escultóricas. Los materiales cobran nueva vida juntos.'],
christo:['Rodea las islas','Envuelve ambas islas en tela rosa luminosa. Cada toque extiende el borde y hace brillar la bahía.','Rodea cada isla dos veces hasta cerrar las cintas rosas.','Christo y Jeanne-Claude transformaron temporalmente la apariencia de la bahía de Biscayne en Miami. La tela cambió el paisaje sin dejar un monumento permanente.'],
chromati:['Crea un mundo brillante','Compón un lienzo con acrílico, gouache y purpurina. El color y las capas pueden expresar emociones.','Elige un material y pinta cinco espacios usando las tres técnicas.','Theresa Chromati da vida a un mundo interior con pintura por capas, gestos expresivos y purpurina.'],
common:{mica:'DESCUBRIMIENTO DE MICA',done:'Guardar mi descubrimiento ✦',locked:'Completa primero la actividad',assist:'Usar una alternativa guiada',story:'Leer la historia de la obra',count:'Progreso creativo',care:'Ilustración original. Observa la obra sin tocarla.',reset:'Empezar de nuevo',choose:'Elegir',symbols:['Máscara','Pez','Sol','Casa','Estrella','Barco'],moods:['Cielo de tormenta','Luz dorada'],pieces:['Base','Placa de acero','Manguera','Piel de pintura','Soporte'],tools:['Acrílico','Gouache','Purpurina'],niches:['Arco','Esfera','Escalera','Puerta'],direction:['← Mover a la izquierda','Mover a la derecha →','↻ Girar']}
}};
const ids=['masks','delano','grid','chaos','fonseca','yanko','christo','chromati'];
const tr=()=>L[state.lang]||L.en;
const h=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const push=(a,x)=>{if(!a.includes(x))a.push(x)};
const btn=(txt,cmd,v='',cls='')=>'<button type="button" class="pg-btn '+cls+'" data-pg="'+cmd+'" data-v="'+h(v)+'">'+h(txt)+'</button>';
const SYM=['◉','⌁','☼','⌂','✶','⚑'];
function data(C,id){
 if(!C.extra||C.extra.id!==id)C.extra={id,selected:0,seals:['','','',''],views:[],mood:'',glyphs:['','','','','',''],selectedGlyph:'⌂',tower:[0,0,0],turns:[0,0,0],selectedCube:1,niches:['closed','closed','closed','closed','closed'],mini:'arch',pieces:[],selectedPiece:'base',rings:[0,0],paint:[],tool:'acrylic'};
 return C.extra;
}
const kinds=['acrylic','gouache','glitter'],parts=['base','metal','hose','skin','support'];
function done(id,s){
 switch(id){
 case 'masks':return s.seals.every(Boolean)&&new Set(s.seals).size===4;
 case 'delano':return s.views.length===3&&!!s.mood;
 case 'grid':return s.glyphs.filter(Boolean).length>=5&&new Set(s.glyphs.filter(Boolean)).size>=3;
 case 'chaos':return s.tower.filter(x=>x!==0).length>=2&&s.turns.some(x=>x!==0)&&Math.abs(s.tower[1])+Math.abs(s.tower[2])<5;
 case 'fonseca':return s.niches.filter(x=>!['closed','open'].includes(x)).length>=4;
 case 'yanko':return s.pieces.length===5&&s.pieces.every((x,i)=>x===parts[i]);
 case 'christo':return s.rings[0]>=2&&s.rings[1]>=2;
 case 'chromati':return s.paint.length>=5&&kinds.every(k=>s.paint.some(x=>x.tool===k));
 }return false;
}
function masks(s,t){
 const slots=s.seals.map((v,i)=>'<button class="pg-symbol-slot '+(v?'filled':'')+'" data-pg="seal" data-v="'+i+'" aria-label="'+h(t[2])+' '+(i+1)+'"><b>'+h(v||'＋')+'</b><small>'+(i+1)+'</small></button>').join('');
 return '<div class="pg-board pg-symbol-board"><div class="pg-symbol-arch" aria-hidden="true">◧ ✦ ◩</div><div class="pg-symbol-row">'+slots+'</div><div class="pg-symbol-footer">✳ TORRES · VISUAL LANGUAGE ✳</div></div><div class="pg-palette">'+SYM.map((v,i)=>btn(v+' '+tr().common.symbols[i],'symbol',i,s.selected===i?'active':'')).join('')+'</div><p class="pg-progress">'+s.seals.filter(Boolean).length+'/4</p>';
}
function delano(s,t){
 const spots=[[42,118,'road'],[134,82,'houses'],[272,39,'sky']];
 const view='<svg viewBox="0 0 340 225" class="pg-illustration" aria-label="Illustration of a winding road, mountain houses and atmospheric sky" role="img"><defs><linearGradient id="pg-sky" x2="0" y2="1"><stop stop-color="'+(s.mood==='gold'?'#f2bc88':'#7896ae')+'"/><stop offset="1" stop-color="'+(s.mood==='gold'?'#fff1ce':'#cad3c9')+'"/></linearGradient></defs><rect width="340" height="225" fill="url(#pg-sky)"/><path d="M0 113Q70 50 133 98T340 84V225H0Z" fill="#8b9a7f"/><path d="M0 158Q110 94 174 151T340 143V225H0Z" fill="#6e8c70"/><path d="M54 225Q69 191 130 170T207 108T290 79" stroke="#dac7a5" stroke-width="24" fill="none"/><path d="M54 225Q69 191 130 170T207 108T290 79" stroke="#f5e5c6" stroke-width="4" fill="none" stroke-dasharray="3 10"/><path d="M99 139v-30h32v30z M237 98V75h31v23z" fill="#bd5e52"/><path d="M94 109l21-22 22 22 M233 75l19-20 22 20" stroke="#584a43" fill="none" stroke-width="7"/><path d="M0 39Q65 26 131 38T340 27" stroke="#f8f5ef" stroke-width="21" fill="none" opacity=".36"/>'+
 spots.map(([x,y,k],i)=>s.views.includes(i)?'<circle cx="'+x+'" cy="'+y+'" r="22" fill="none" stroke="#fff6ca" stroke-width="5" class="pg-found-ring"/>':'').join('')+'</svg>';
 return '<div class="pg-board pg-delano">'+view+spots.map(([x,y,k],i)=>'<button style="left:'+(x/340*100)+'%;top:'+(y/225*100)+'%" class="pg-photo-spot '+(s.views.includes(i)?'seen':'')+'" data-pg="view" data-v="'+i+'" aria-label="'+k+'">'+(s.views.includes(i)?'✓':'⌕')+'</button>').join('')+'</div><div class="pg-palette">'+btn(tr().common.moods[0],'mood','storm',s.mood==='storm'?'active':'')+btn(tr().common.moods[1],'mood','gold',s.mood==='gold'?'active':'')+'</div><p class="pg-progress">'+s.views.length+'/3</p>';
}
function grid(s,t){
 const palette=['⌂','☼','◎','≋','△','✺','↟'];
 return '<div class="pg-board pg-graphite"><div class="pg-graphite-title">VISUAL ALPHABET · 1936</div><div class="pg-graphite-cells">'+s.glyphs.map((v,i)=>'<button class="pg-graphite-cell '+(v?'marked':'')+'" data-pg="glyph" data-v="'+i+'">'+(v||'＋')+'</button>').join('')+'</div><div class="pg-graphite-pencil">✎</div></div><div class="pg-palette">'+palette.map(v=>btn(v,'choose-glyph',v,s.selectedGlyph===v?'active':'')).join('')+'</div><p class="pg-progress">'+s.glyphs.filter(Boolean).length+'/5</p>';
}
function chaos(s,t){
 const wobble=Math.abs(s.tower[1])+Math.abs(s.tower[2]),svg='<svg viewBox="0 0 340 245" class="pg-illustration" role="img" aria-label="Three interconnected open steel cubes"><defs><linearGradient id="pg-steel"><stop stop-color="#83a4a3"/><stop offset=".5" stop-color="#d3dfd8"/><stop offset="1" stop-color="#5f7f85"/></linearGradient></defs><rect width="340" height="245" fill="#dbe9e3"/>'+
 [0,1,2].map((v,i)=>{const y=164-i*63,x=113+(s.tower[i]*17),a=s.turns[i];return '<g transform="translate('+x+' '+y+') rotate('+a+' 55 44)" class="'+(wobble>=5?'pg-wobble':'pg-floating')+'"><path d="M12 30L54 6 96 28 54 54Z M12 30V81L54 104V54 M96 28V80L54 104 M12 81L54 56 96 80 M54 6V54" stroke="url(#pg-steel)" stroke-width="9" fill="none" stroke-linejoin="round"/></g>'}).join('')+
 '<path d="M56 237h225" stroke="#6a8980" stroke-width="10"/></svg>';
 return '<div class="pg-board pg-tower">'+svg+'</div><div class="pg-palette">'+[0,1,2].map(i=>btn((i+1)+' ◇','cube',i,s.selectedCube===i?'active':'')).join('')+'</div><div class="pg-palette">'+tr().common.direction.map((v,i)=>btn(v,'tower-action',i)).join('')+'</div><p class="pg-progress">'+(wobble>=5?'⚠ ': '✦ ')+Math.round(wobble*20)+' / 100</p>';
}
function fonseca(s,t){
 const G={arch:'⌒',sphere:'●',stair:'≋',door:'▤'};
 return '<div class="pg-board pg-fonseca"><div class="pg-marble-block"><div class="pg-marble-top"></div><div class="pg-niche-grid">'+s.niches.map((v,i)=>'<button class="pg-niche '+(v==='closed'?'sealed':'opened')+'" data-pg="niche" data-v="'+i+'" aria-label="'+h(tr().common.niches[i%4])+' '+(i+1)+'">'+(v==='closed'?'✧':v==='open'?'＋':G[v])+'</button>').join('')+'</div><div class="pg-marble-base"></div></div></div><div class="pg-palette">'+Object.keys(G).map((v,i)=>btn(G[v]+' '+tr().common.niches[i],'mini',v,s.mini===v?'active':'')).join('')+'</div><p class="pg-progress">'+s.niches.filter(x=>!['closed','open'].includes(x)).length+'/4</p>';
}
function yanko(s,t){
 const linked=s.pieces.length,items=[['▰',66,185],['◧',129,121],['〰',189,75],['◕',251,130],['╱',263,195]];
 const stage='<svg class="pg-illustration" viewBox="0 0 340 248" role="img" aria-label="A sculpture assembled from steel supports, a curved pneumatic hose and sheets of dried paint"><defs><linearGradient id="pg-metal"><stop stop-color="#486775"/><stop offset=".5" stop-color="#acbbc4"/><stop offset="1" stop-color="#35556a"/></linearGradient></defs><rect width="340" height="248" fill="#d2e4e4"/><path d="M18 227h305" stroke="#8ba39b" stroke-width="12"/>'+
 (linked>=1?'<path d="M48 205h231v14H48z" fill="url(#pg-metal)"/>':'')+
 (linked>=2?'<path d="M105 202l12-108 68-37 40 135z" fill="url(#pg-metal)" stroke="#4b6570" stroke-width="8"/>':'')+
 (linked>=3?'<path d="M95 177Q37 33 138 43T260 136" stroke="#28535d" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M95 177Q37 33 138 43T260 136" stroke="#9ab5ae" stroke-width="4" fill="none" stroke-dasharray="9 8"/>':'')+
 (linked>=4?'<path d="M116 79Q188 13 254 72L234 152Q173 190 137 148Z" fill="#5a8ca7" stroke="#294c66" stroke-width="5" class="pg-paint-skin"/><path d="M150 78Q191 93 207 118" stroke="#b9dce4" stroke-width="5" fill="none"/>':'')+
 (linked>=5?'<path d="M265 205L250 103L218 94" fill="none" stroke="url(#pg-metal)" stroke-width="12" stroke-linecap="round"/>':'')+'</svg>';
 return '<div class="pg-board pg-industrial">'+stage+items.map(([glyph,x,y],i)=>'<button class="pg-material-socket '+(i<linked?'joined':'')+'" data-pg="assemble" data-v="'+i+'" style="left:'+(x/340*100)+'%;top:'+(y/248*100)+'%" aria-label="'+h(tr().common.pieces[i])+' '+(i+1)+'">'+(i<linked?'✓':i+1)+'</button>').join('')+'</div><div class="pg-palette">'+parts.map((v,i)=>btn(tr().common.pieces[i],'piece',v,s.selectedPiece===v?'active':'')).join('')+'</div><p class="pg-progress">'+linked+'/5</p>';
}
function christo(s,t){
 const n=s.rings;
 const svg='<svg class="pg-illustration" viewBox="0 0 340 240" role="img" aria-label="Two islands in Biscayne Bay gradually encircled by pink fabric"><rect width="340" height="240" fill="#71bfce"/><path d="M0 55Q83 21 161 64T340 40M0 177Q110 144 173 173T340 160" stroke="#c7f5e9" stroke-width="5" fill="none" opacity=".52"/><path d="M42 99Q57 54 113 58Q157 83 121 137Q81 154 42 99Z M182 138Q215 74 264 98Q295 143 252 178Q202 185 182 138Z" fill="#568e69" stroke="#367657" stroke-width="5"/>'+
 [0,1].map((x,i)=>{const path=i===0?'M33 100Q51 38 115 46Q172 84 130 148Q65 174 33 100Z':'M168 139Q200 58 274 85Q320 151 266 190Q195 204 168 139Z';return '<path class="pg-pink-ring" d="'+path+'" stroke="#ff94b5" stroke-width="20" fill="none" stroke-linecap="round" stroke-dasharray="'+Math.min(390,n[i]*180)+' 600"/>'}).join('')+
 '<g class="pg-water-sparkle" fill="#e3f8eb"><circle cx="24" cy="31" r="3"/><circle cx="158" cy="204" r="3"/><circle cx="311" cy="31" r="3"/></g></svg>';
 return '<div class="pg-board pg-islands">'+svg+'<button class="pg-island-hit" style="left:21%;top:34%" data-pg="wrap" data-v="0" aria-label="Wrap island one">'+(n[0]>=2?'✓':'✦')+'</button><button class="pg-island-hit" style="left:66%;top:51%" data-pg="wrap" data-v="1" aria-label="Wrap island two">'+(n[1]>=2?'✓':'✦')+'</button></div><p class="pg-progress">'+(n[0]+n[1])+'/4</p>';
}
function chromati(s,t){
 const glyph={acrylic:'●',gouache:'◆',glitter:'✦'},painted=Object.fromEntries(s.paint.map(v=>[v.idx,v.tool])),colors=['#eb9799','#86a4cc','#e3b76c','#789e86','#e9a3bd','#9d8ec4','#f0b48b','#568f98','#ddbf8c'];
 return '<div class="pg-board pg-chromati"><div class="pg-painted-canvas">'+Array.from({length:9},(_,i)=>'<button class="pg-paint-patch '+(painted[i]?'pg-layer-'+painted[i]:'')+'" style="--patch:'+colors[i]+';--r:'+(i*23-75)+'deg" data-pg="paint" data-v="'+i+'" aria-label="Paint layer '+(i+1)+'"><span>'+ (painted[i]?glyph[painted[i]]:'＋')+'</span></button>').join('')+'</div><div class="pg-shimmer">✦ ✧ ✦</div></div><div class="pg-palette">'+kinds.map((v,i)=>btn(glyph[v]+' '+tr().common.tools[i],'tool',v,s.tool===v?'active':'')).join('')+'</div><p class="pg-progress">'+s.paint.length+'/5 · '+kinds.filter(k=>s.paint.some(x=>x.tool===k)).length+'/3</p>';
}
function game(a,C){
 const id=a.id.split('-')[1],t=tr()[id],s=data(C,a.id);if(!t)return '';
 C.done=done(id,s);
 const scenes={masks,delano,grid,chaos,fonseca,yanko,christo,chromati};
 return '<div class="t1-screen pg-screen pg-'+id+'"><div class="t1-overline">PAMM · '+h(a.artist)+'</div><h2 class="t1-h1">'+h(t[0])+'</h2><div class="pg-intro">'+h(t[1])+'</div>'+scenes[id](s,t)+'<p class="pg-hint">'+h(t[2])+'</p>'+
 (C.done?'<div class="pg-mica-conclusion" role="status"><div class="pg-mica-avatar" aria-hidden="true"><span>•ᴗ•</span></div><div><b>'+h(tr().common.mica)+'</b><p>'+h(t[3])+'</p></div><div class="pg-mica-sparks" aria-hidden="true">✧ ✦ ✧</div></div>':'<p class="pg-note" role="status">'+h(tr().common.care)+'</p>')+
 '<button class="button" type="button" data-t1-finish '+(C.done?'':'disabled')+'>'+h(C.done?tr().common.done:tr().common.locked)+'</button>'+
 '<button class="button ghost" type="button" data-t1-assist>'+h(tr().common.assist)+'</button><button class="button outline" type="button" data-action="v7-story">'+h(tr().common.story)+'</button></div>';
}
function context(){if(state.venue!=='pamm'||state.tab!=='quest'||state.stage!=='puzzle')return null;const a=A[state.current],C=window.TRACE_V1?.puzzle;if(!a?.id.startsWith('pamm-')||!C)return null;return {a,C,s:data(C,a.id),id:a.id.split('-')[1]}}
function click(ev){
 const b=ev.target.closest('[data-pg]'),c=context();if(!b||!c)return;ev.preventDefault();ev.stopImmediatePropagation();
 const {s,id,C}=c,act=b.dataset.pg,v=b.dataset.v;
 if(id==='masks'){if(act==='symbol')s.selected=Number(v);if(act==='seal')s.seals[Number(v)]=SYM[s.selected]}
 if(id==='delano'){if(act==='view')push(s.views,Number(v));if(act==='mood')s.mood=v}
 if(id==='grid'){if(act==='choose-glyph')s.selectedGlyph=v;if(act==='glyph')s.glyphs[Number(v)]=s.selectedGlyph}
 if(id==='chaos'){if(act==='cube')s.selectedCube=Number(v);if(act==='tower-action'){const n=Number(v),i=s.selectedCube;if(i>0){if(n===0)s.tower[i]=Math.max(-2,s.tower[i]-1);if(n===1)s.tower[i]=Math.min(2,s.tower[i]+1);if(n===2)s.turns[i]=(s.turns[i]+9)%45}}}
 if(id==='fonseca'){if(act==='mini')s.mini=v;if(act==='niche'){const i=Number(v);if(s.niches[i]==='closed')s.niches[i]='open';else s.niches[i]=s.mini}}
 if(id==='yanko'){if(act==='piece')s.selectedPiece=v;if(act==='assemble'){const i=Number(v);if(i===s.pieces.length&&parts[i]===s.selectedPiece)push(s.pieces,s.selectedPiece)}}
 if(id==='christo'){if(act==='wrap')s.rings[Number(v)]=Math.min(2,s.rings[Number(v)]+1)}
 if(id==='chromati'){if(act==='tool')s.tool=v;if(act==='paint'){const i=Number(v),entry=s.paint.find(x=>x.idx===i);if(entry)entry.tool=s.tool;else s.paint.push({idx:i,tool:s.tool})}}
 C.done=done(id,s);window.__traceAppRender?.();
}
document.addEventListener('click',click,true);
window.TRACE_PAMM_GAME={has:id=>typeof id==='string'&&id.startsWith('pamm-')&&ids.includes(id.slice(5)),game,conclusion:(id,lang)=>{const name=id?.split('-')[1];return (L[lang]||L.en)[name]?.[3]||null},translations:L};
})();
