/* MoMA: 8 unique artwork-specific, camera-free interactive creative laboratories.
 * Self-contained state and accessible buttons/sliders; visitor progress never uploaded. */
(function(){
'use strict';
const G={
en:{
starry:['Draw a swirling night','Tap three places in the sky to make the stars swirl. Notice how the movement changes the mood.','Add a swirl','Swirls','You gave the night sky movement!'],
dance:['Connect the dancers','Link the five dancers one by one. Can their arms make a circle?','Connect dancer','Connections','A simple line can create a rhythm.'],
lilies:['Paint the changing pond','Add four lily pads and move the reflection slider to change the light on the water.','Place a lily','Reflection','Monet watched the same water transform with light.'],
warhol:['Print a pop-art shelf','Choose three soup flavours and stamp three cans. Compare repetition and difference.','Stamp a can','Flavours','You made ordinary packaging into a pattern.'],
oppenheim:['Change the everyday object','Try different imagined surfaces on this cup. Choose fur and describe the surprising feeling.','Texture','Fur','Smooth','Paper','A new material can change an everyday object completely.'],
tinguely:['Build a restless machine','Add a wheel, a spring and a bell, then turn the wheel. Imagine the motion and sounds without touching the real sculpture.','Wheel','Spring','Bell','Turn wheel','A machine can be an artwork in motion.'],
brancusi:['Sculpt a sound','Move the silhouette slider. Make the shape tall and sharp like the call of a rooster.','Height of the crest','Simple shape','You made a sound visible as a form.'],
lamelas:['Sort the information','Choose a source for each channel: sound, image and printed word. How does the message change?','Sound','Image','Text','News','Music','Advertisement','You separated a message into different media.'],
common:['Collect your discovery ✦','Complete the experiment first','No physical artwork needs to be touched.']
},
fr:{
starry:['Dessine un ciel tourbillonnant','Touche trois endroits du ciel pour faire tourbillonner les étoiles. Quel effet produit le mouvement ?','Ajouter un tourbillon','Tourbillons','Tu as mis le ciel nocturne en mouvement !'],
dance:['Relie les danseurs','Relie les cinq danseurs un à un. Leurs bras peuvent-ils former un cercle ?','Relier le danseur','Liens','Une ligne simple peut créer un rythme.'],
lilies:['Peins l’étang changeant','Ajoute quatre nénuphars et déplace le curseur pour transformer la lumière sur l’eau.','Placer un nénuphar','Reflet','Monet observait comment la lumière changeait l’étang.'],
warhol:['Imprime une étagère pop','Choisis trois soupes et imprime trois boîtes. Compare les répétitions et les différences.','Imprimer une boîte','Soupes','Tu as transformé un emballage ordinaire en motif.'],
oppenheim:['Transforme un objet quotidien','Imagine différentes textures sur cette tasse. Choisis la fourrure et décris cette sensation étrange.','Texture','Fourrure','Lisse','Papier','Un matériau nouveau transforme complètement un objet ordinaire.'],
tinguely:['Construis une machine turbulente','Ajoute une roue, un ressort et une cloche, puis tourne la roue. Imagine les sons sans toucher l’œuvre réelle.','Roue','Ressort','Cloche','Tourner la roue','Une machine peut devenir une œuvre en mouvement.'],
brancusi:['Sculpte un son','Déplace le curseur de la silhouette. Fais monter une crête aiguë comme le chant du coq.','Hauteur de la crête','Forme simplifiée','Tu as rendu un son visible.'],
lamelas:['Trie les informations','Choisis une source pour chaque canal : son, image et texte imprimé. Comment le message change-t-il ?','Son','Image','Texte','Actualités','Musique','Publicité','Tu as séparé le message en différents médias.'],
common:['Enregistrer la découverte ✦','Termine d’abord l’expérience','Tu n’as pas besoin de toucher une œuvre réelle.']
},
es:{
starry:['Dibuja una noche turbulenta','Toca tres lugares del cielo para crear estrellas que giran. ¿Cómo cambia la emoción?','Añadir remolino','Remolinos','¡Le diste movimiento al cielo nocturno!'],
dance:['Une a los bailarines','Conecta a cinco bailarines uno por uno. ¿Pueden formar un círculo con los brazos?','Conectar bailarín','Conexiones','Una línea sencilla puede crear ritmo.'],
lilies:['Pinta el estanque cambiante','Añade cuatro nenúfares y mueve el deslizador para cambiar la luz sobre el agua.','Colocar nenúfar','Reflejo','Monet observaba cómo cambiaba el agua con la luz.'],
warhol:['Imprime un estante pop','Elige tres sabores de sopa y estampa tres latas. Compara la repetición y las diferencias.','Estampar lata','Sabores','Convertiste un envase corriente en un patrón.'],
oppenheim:['Transforma un objeto cotidiano','Prueba texturas imaginarias para esta taza. Elige piel y describe la sensación extraña.','Textura','Piel','Liso','Papel','Un material nuevo transforma por completo un objeto cotidiano.'],
tinguely:['Construye una máquina inquieta','Añade una rueda, un muelle y una campana, y después gira la rueda. Imagina los sonidos sin tocar la escultura real.','Rueda','Muelle','Campana','Girar rueda','Una máquina puede convertirse en una obra en movimiento.'],
brancusi:['Esculpe un sonido','Mueve el control de la silueta. Crea una cresta alta y afilada como el canto del gallo.','Altura de la cresta','Forma simple','Hiciste visible un sonido.'],
lamelas:['Clasifica la información','Elige una fuente para cada canal: sonido, imagen y texto impreso. ¿Cómo cambia el mensaje?','Sonido','Imagen','Texto','Noticias','Música','Anuncio','Separaste un mensaje en distintos medios.'],
common:['Guardar descubrimiento ✦','Completa primero el experimento','No necesitas tocar ninguna obra real.']
}};
const tr=k=>(G[state.lang]||G.en)[k];
const e=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function model(C,id){
 if(!C.extra||C.extra.id!==id)C.extra={id,steps:[],reflection:0,crest:25,turn:0,surface:'',source:[],flavours:[],chosen:[]};
 return C.extra;
}
function good(id,s){switch(id){
 case'moma-starry':return s.steps.length>=3;
 case'moma-dance':return s.steps.length>=5;
 case'moma-lilies':return s.steps.length>=4&&s.reflection>=55;
 case'moma-warhol':return s.flavours.length>=3;
 case'moma-oppenheim':return s.surface==='fur'&&s.chosen.length>=2;
 case'moma-tinguely':return s.steps.length===3&&s.turn>=50;
 case'moma-brancusi':return s.crest>=75;
 case'moma-lamelas':return s.source.length===3;
 default:return false}}
const btn=(label,action,val)=>'<button class="tm-control" type="button" data-tm="'+action+'" data-val="'+val+'">'+e(label)+'</button>';
function play(a,C){
 const s=model(C,a.id),id=a.id.split('-')[1],t=tr(id);C.done=good(a.id,s);
 let stage='';
 switch(id){
 case'starry':
 stage='<div class="tm-stars" role="group" aria-label="'+e(t[0])+'">'+Array.from({length:6},(_,i)=>'<button class="tm-star '+(s.steps.includes(i)?'is-picked':'')+'" data-tm="star" data-val="'+i+'" style="--x:'+([15,45,78,28,62,87][i])+'%;--y:'+([20,29,16,65,73,51][i])+'%" aria-label="'+e(t[2])+' '+(i+1)+'">'+(s.steps.includes(i)?'🌀':'✦')+'</button>').join('')+'<span class="tm-cypress">♠</span></div><div class="tm-progress">'+e(t[3])+': '+s.steps.length+' / 3</div>';break;
 case'dance':
 stage='<div class="tm-dancers">'+Array.from({length:5},(_,i)=>'<button type="button" data-tm="dancer" data-val="'+i+'" class="tm-dancer '+(s.steps.includes(i)?'linked':'')+'" aria-label="'+e(t[2])+' '+(i+1)+'"><span>●</span>╱│╲<small>'+(i+1)+'</small></button>').join('')+'</div><p class="tm-progress">'+e(t[3])+': '+s.steps.length+' / 5</p>';break;
 case'lilies':
 stage='<div class="tm-pond" style="--reflection:'+s.reflection+'%">'+Array.from({length:8},(_,i)=>'<button type="button" data-tm="lily" data-val="'+i+'" class="tm-lily '+(s.steps.includes(i)?'placed':'')+'" aria-label="'+e(t[2])+' '+(i+1)+'" style="--x:'+([15,38,70,83,24,51,66,13][i])+'%;--y:'+([24,37,22,60,72,60,79,49][i])+'%">'+(s.steps.includes(i)?'✿':'＋')+'</button>').join('')+'</div><label class="tm-label">'+e(t[3])+': '+s.reflection+'%<input type="range" min="0" max="100" step="5" data-tm-range="reflection" value="'+s.reflection+'"></label>';break;
 case'warhol':
 stage='<div class="tm-soups">'+Array.from({length:3},(_,i)=>'<div class="tm-can">'+(s.flavours[i]?'<span>🥫</span><small>'+e(s.flavours[i])+'</small>':'<span class="tm-empty">＋</span>')+'</div>').join('')+'</div><div class="tm-controls">'+['Tomato','Mushroom','Pea','Chicken'].map((v,i)=>btn((['🍅','🍄','🫛','🍗'][i])+' '+v,'soup',v)).join('')+'</div>';break;
 case'oppenheim':
 stage='<div class="tm-cup '+(s.surface==='fur'?'furry':s.surface==='paper'?'paper':'smooth')+'"><span>☕</span></div><div class="tm-controls">'+['fur','smooth','paper'].map((v,i)=>btn(t[i+3],'texture',v)).join('')+'</div><p class="tm-progress">'+(s.surface==='fur'?e(t[6]):'')+'</p><div class="tm-controls">'+btn('Surprising / Surprenant / Sorprendente','feeling','surprise')+btn('Uncomfortable / Étrange / Extraño','feeling','strange')+'</div>';break;
 case'tinguely':
 stage='<div class="tm-machine">'+['⚙','〰','🔔'].map((v,i)=>'<button class="tm-part '+(s.steps.includes(i)?'added':'')+'" data-tm="part" data-val="'+i+'">'+(s.steps.includes(i)?v:'＋')+'</button>').join('')+'</div><div class="tm-controls">'+[t[2],t[3],t[4]].map((v,i)=>btn(v,'part',i)).join('')+'</div><label class="tm-label">'+e(t[5])+': '+s.turn+'%<input type="range" min="0" max="100" step="10" data-tm-range="turn" value="'+s.turn+'"></label>';break;
 case'brancusi':
 stage='<div class="tm-sculpture"><div class="tm-crest" style="--height:'+s.crest+'%"></div><div class="tm-base"></div></div><label class="tm-label">'+e(t[2])+': '+s.crest+'%<input type="range" min="0" max="100" step="5" data-tm-range="crest" value="'+s.crest+'"></label><p class="tm-progress">'+e(t[3])+'</p>';break;
 case'lamelas':
 stage='<div class="tm-media">'+['🔊','▣','▤'].map((v,i)=>'<button class="tm-channel '+(s.source.includes(i)?'added':'')+'" data-tm="source" data-val="'+i+'"><span>'+v+'</span><small>'+e(t[2+i])+'</small></button>').join('')+'</div><div class="tm-controls">'+[t[5],t[6],t[7]].map((v,i)=>btn(v,'source',i)).join('')+'</div>';break;
 }
 return '<div class="t1-screen tm-screen">'+
 '<div class="t1-overline">MoMA · '+e(a.artist)+'</div><h2 class="t1-h1">'+e(t[0])+'</h2>'+
 '<div class="t1-task">'+e(t[1])+'</div>'+
 stage+
 '<div class="tm-progress" role="status">'+(C.done?'✦ '+e(t[t.length-1]):e(tr('common')[2]))+'</div>'+
 '<button type="button" class="button" data-t1-finish '+(C.done?'':'disabled')+'>'+e(C.done?tr('common')[0]:tr('common')[1])+'</button>'+
 '<button type="button" class="button ghost" data-t1-assist>'+e('Use a guided alternative')+'</button>'+
 '<button type="button" class="button outline" data-action="v7-story">'+e('Read this artwork’s story')+'</button></div>';
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-tm]');if(!b||state.stage!=='puzzle'||state.tab!=='quest'||state.venue!=='moma')return;
 ev.stopImmediatePropagation();ev.preventDefault();
 const C=window.TRACE_V1?.puzzle,a=A[state.current];if(!C||!a)return;
 const s=model(C,a.id),kind=b.dataset.tm,n=Number(b.dataset.val);
 if(['star','dancer','lily','part','source'].includes(kind)){
  if(!s.steps.includes(n)&&kind!=='source'&&kind!=='part')s.steps.push(n);
  else if(kind==='part'&&!s.steps.includes(n))s.steps.push(n);
  else if(kind==='source'&&!s.source.includes(n))s.source.push(n);
 }else if(kind==='soup'&&s.flavours.length<3)s.flavours.push(b.dataset.val);
 else if(kind==='texture')s.surface=b.dataset.val;
 else if(kind==='feeling'&&!s.chosen.includes(b.dataset.val))s.chosen.push(b.dataset.val);
 C.done=good(a.id,s);window.__traceAppRender?.();
},true);
document.addEventListener('input',ev=>{
 const el=ev.target;if(!el.matches('[data-tm-range]')||state.venue!=='moma'||state.stage!=='puzzle')return;
 const C=window.TRACE_V1?.puzzle,a=A[state.current];if(!C||!a)return;
 const s=model(C,a.id);if(['reflection','turn','crest'].includes(el.dataset.tmRange))s[el.dataset.tmRange]=Number(el.value);
 C.done=good(a.id,s);window.__traceAppRender?.();
},true);
window.TRACE_MOMA_GAME={game:play,has:id=>id.startsWith('moma-'),isComplete:good,translations:G};
})();