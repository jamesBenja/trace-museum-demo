/* TRACE MoMA v3.0: eight physically distinct touch, mouse and keyboard art experiments.
   No external game engine, image recognition, third-party audio, or remote data.
   Direct manipulation updates the active artwork lab only; all other museums unchanged. */
(function(){
'use strict';
const I={
en:{
starry:{title:'Paint a living night',intro:'Drag across the sky to summon sweeping, painterly wind currents. Create three large swirls.',hint:'Drag across the sky, rather than just tapping stars.',count:'Brushstroke currents',win:'Van Gogh made a still night feel alive through energetic, directional brushwork.'},
dance:{title:'Hold the rhythm',intro:'Drag each glowing hand toward the next dancer’s hand. Connect all five to complete the circle.',hint:'Drag a glowing hand to its matching dotted target.',count:'Hands joined',win:'Matisse created rhythm with simplified bodies, vibrant colour and a circle of human connection.'},
lilies:{title:'Bring the pond to life',intro:'Place four lilies, then drag the golden sun across the water. Watch reflected clouds, colour and ripples appear.',hint:'Tap four open lily positions, then drag the sun toward the bright side.',count:'Water lilies',light:'Reflected light',win:'Monet studied shifting light and reflections until the water and sky seemed to merge.'},
warhol:{title:'Pop-art jackpot',intro:'Pull the lever to spin three illustrated soup cans. Hold a reel, or tap a can to change its flavour. Match all three for a repetition jackpot.',spin:'PULL THE LEVER · SPIN',hold:'Hold',release:'Release',hint:'Spin at least once, then match three of a kind. Tap individual reels to nudge them.',win:'Warhol used repetition, tiny variations and ordinary consumer imagery to make us look twice.',jackpot:'THREE OF A KIND · JACKPOT!',count:'Spins'},
oppenheim:{title:'Make a familiar object strange',intro:'Drag a material onto the cup, saucer or spoon. Or select a swatch and tap a part. Mix textures and choose your reaction.',materials:['Fur','Velvet','Ice','Spikes','Grass','Metal','Feathers','Ceramic'],part:['Cup','Saucer','Spoon'],feelings:['Cosy','Unsettling','Funny','Impossible'],prompt:'How does this impossible tea set make you feel?',hint:'Transform all three objects with at least two different materials, then choose a feeling.',win:'Oppenheim disrupted the familiar by giving an ordinary cup an unexpected tactile identity.'},
tinguely:{title:'Build an absurd chain reaction',intro:'Drag each salvaged part onto its matching numbered socket. Then turn the real wheel by dragging around its rim to release the fishing rod and tip the paint can.',parts:['Drive gear','Connecting belt','Fishing rod','Hanging hook','Paint can'],run:'Turn the wheel',hint:'Assemble all five parts in sequence, then rotate the big wheel to drive the mechanism.',connected:'Connected parts',win:'Tinguely turned scrap machinery, motion and joyful disorder into a work of art.'},
brancusi:{title:'Sculpt the sound of a rooster',intro:'Pull the glowing control points to stretch, bend and reshape a wooden form. Change its silhouette, then hear your own sculpted call.',tip:'Stretch the crest',width:'Widen the body',bend:'Bend the neck',waist:'Reshape the base',listen:'Hear my sculpture',hint:'Move at least two different handles, then preview the resulting sound. Keep the museum quiet and use headphones.',win:'Brancusi reduced a rooster to its rising form and the impression of its crow: essence instead of imitation.'},
lamelas:{title:'How does news travel?',intro:'One fictional museum announcement. Explore it as a newspaper, radio broadcast and television report. Watch how each reaches an audience.',channels:['NEWSPAPER','RADIO','TELEVISION'],descs:['A headline is printed and carried from reader to reader. It can be reread.','An announcement becomes sound waves heard by listeners as it is broadcast.','Moving images and a voice reach viewers through separate screens.'],message:'The museum opens a new exhibition today',take:'Which discovery feels true?',choices:['The medium shapes how the message travels','Every medium reaches people in exactly the same way'],win:'Lamelas studied how sound, images and printed text shape how we consume information.',seen:'Media explored'},
common:{done:'Collect my discovery ✦',locked:'Complete the creative experiment first',care:'Original interactive interpretation. Observe the real artwork, and never touch museum objects.',mica:'MICA DISCOVERED',assist:'Use a guided alternative',story:'Read this artwork’s story',replay:'Try again',next:'Continue exploring'}
},
fr:{
starry:{title:'Peins une nuit vivante',intro:'Fais glisser ton doigt dans le ciel pour créer de grands tourbillons de coups de pinceau. Trace trois courants.',hint:'Dessine dans le ciel au lieu de toucher simplement les étoiles.',count:'Courants peints',win:'Van Gogh rendait la nuit vivante grâce à des coups de pinceau énergiques et orientés.'},
dance:{title:'Relie les danseurs',intro:'Fais glisser chaque main lumineuse jusqu’à celle du danseur suivant. Relie les cinq pour fermer la ronde.',hint:'Fais glisser une main brillante vers le cercle pointillé correspondant.',count:'Mains reliées',win:'Matisse créait du rythme avec des corps simplifiés, des couleurs vives et une ronde humaine.'},
lilies:{title:'Fais vivre l’étang',intro:'Ajoute quatre nénuphars, puis fais glisser le soleil doré sur l’eau. Observe les reflets, les couleurs et les rides.',hint:'Pose quatre nénuphars, puis entraîne le soleil vers la zone lumineuse.',count:'Nénuphars',light:'Lumière reflétée',win:'Monet étudiait les reflets et la lumière changeante jusqu’à fusionner eau et ciel.'},
warhol:{title:'Jackpot pop art',intro:'Tire le levier pour faire tourner trois boîtes de soupe illustrées. Bloque une case ou touche une boîte pour changer sa saveur. Trouve trois identiques.',spin:'TIRER LE LEVIER · TOURNER',hold:'Bloquer',release:'Libérer',hint:'Tourne au moins une fois, puis aligne trois boîtes identiques en touchant les cases.',win:'Warhol utilisait les répétitions, les variations et les produits du quotidien pour modifier notre regard.',jackpot:'TROIS IDENTIQUES · JACKPOT !',count:'Tours'},
oppenheim:{title:'Rends un objet familier étrange',intro:'Dépose une matière sur la tasse, la soucoupe ou la cuillère. Tu peux aussi choisir une matière et toucher l’objet. Mélange et décris ta réaction.',materials:['Fourrure','Velours','Glace','Pointes','Herbe','Métal','Plumes','Céramique'],part:['Tasse','Soucoupe','Cuillère'],feelings:['Douillet','Inquiétant','Drôle','Impossible'],prompt:'Que ressens-tu devant cet impossible service à thé ?',hint:'Transforme les trois objets avec au moins deux matières différentes, puis choisis une émotion.',win:'Oppenheim troublait le quotidien en donnant à une simple tasse une identité tactile inattendue.'},
tinguely:{title:'Construis une réaction en chaîne',intro:'Glisse chaque pièce récupérée vers son emplacement numéroté. Ensuite, fais tourner la grande roue du doigt pour abaisser la canne à pêche et renverser la peinture.',parts:['Engrenage','Courroie','Canne à pêche','Hameçon','Pot de peinture'],run:'Tourner la roue',hint:'Assemble les cinq pièces dans l’ordre, puis fais tourner la roue pour actionner le mécanisme.',connected:'Pièces reliées',win:'Tinguely transformait la ferraille, le mouvement et le joyeux désordre en art.'},
brancusi:{title:'Sculpte le chant du coq',intro:'Tire sur les points lumineux pour allonger et déformer la sculpture en bois. Transforme sa silhouette, puis écoute ton cri sculpté.',tip:'Étirer la crête',width:'Élargir le corps',bend:'Courber le cou',waist:'Modeler la base',listen:'Écouter ma sculpture',hint:'Déplace au moins deux points différents, puis écoute le son. Utilise un casque pour préserver le calme du musée.',win:'Brancusi réduisait le coq à son élan et à son cri : l’essence plutôt qu’une copie fidèle.'},
lamelas:{title:'Comment circule une nouvelle ?',intro:'Une annonce fictive de musée. Découvre-la dans un journal, à la radio et à la télévision. Observe comment elle circule.',channels:['JOURNAL','RADIO','TÉLÉVISION'],descs:['Un titre est imprimé et passe de lecteur en lecteur. On peut le relire.','Une annonce devient des ondes sonores écoutées au moment de la diffusion.','Des images animées et une voix rejoignent des spectateurs sur différents écrans.'],message:'Le musée ouvre une nouvelle exposition aujourd’hui',take:'Quelle observation est juste ?',choices:['Le média influence la circulation du message','Tous les médias atteignent les gens de la même façon'],win:'Lamelas étudiait comment le son, l’image et le texte changent notre manière de recevoir l’information.',seen:'Médias explorés'},
common:{done:'Enregistrer ma découverte ✦',locked:'Termine d’abord l’expérience',care:'Interprétation interactive originale. Regarde l’œuvre réelle, sans jamais la toucher.',mica:'DÉCOUVERTE DE MICA',assist:'Utiliser une autre méthode guidée',story:'Lire l’histoire de l’œuvre',replay:'Recommencer',next:'Continuer'}
},
es:{
starry:{title:'Pinta una noche viva',intro:'Desliza el dedo por el cielo para crear enormes remolinos de pinceladas. Dibuja tres corrientes.',hint:'Arrastra por el cielo, en vez de tocar solo las estrellas.',count:'Corrientes pintadas',win:'Van Gogh daba vida a la noche mediante pinceladas enérgicas y direccionales.'},
dance:{title:'Une el ritmo',intro:'Arrastra cada mano brillante hasta la del siguiente bailarín. Conecta las cinco para cerrar la rueda.',hint:'Arrastra una mano iluminada hacia su objetivo punteado.',count:'Manos unidas',win:'Matisse creó ritmo con cuerpos simplificados, colores vivos y un círculo de conexión humana.'},
lilies:{title:'Da vida al estanque',intro:'Coloca cuatro nenúfares y luego arrastra el sol dorado sobre el agua. Observa los reflejos, colores y ondas.',hint:'Pon cuatro nenúfares y arrastra el sol hacia el lado luminoso.',count:'Nenúfares',light:'Luz reflejada',win:'Monet estudió la luz cambiante y los reflejos hasta fundir el agua y el cielo.'},
warhol:{title:'Premio pop art',intro:'Tira de la palanca para girar tres latas de sopa ilustradas. Bloquea una o toca una lata para cambiar su sabor. Consigue tres iguales.',spin:'TIRA DE LA PALANCA · GIRA',hold:'Bloquear',release:'Soltar',hint:'Gira al menos una vez y ajusta las latas hasta obtener tres idénticas.',win:'Warhol usaba la repetición, las variaciones y los productos cotidianos para cambiar nuestra mirada.',jackpot:'TRES IGUALES · ¡PREMIO!',count:'Giros'},
oppenheim:{title:'Vuelve extraño lo cotidiano',intro:'Arrastra un material sobre la taza, el platillo o la cuchara. También puedes seleccionar uno y tocar el objeto. Mezcla texturas y elige una reacción.',materials:['Piel','Terciopelo','Hielo','Púas','Hierba','Metal','Plumas','Cerámica'],part:['Taza','Platillo','Cuchara'],feelings:['Acogedor','Inquietante','Gracioso','Imposible'],prompt:'¿Qué te hace sentir este juego de té imposible?',hint:'Transforma los tres objetos usando al menos dos materiales distintos y elige una emoción.',win:'Oppenheim transformó una taza común con una identidad táctil inesperada.'},
tinguely:{title:'Construye una reacción en cadena',intro:'Arrastra cada pieza reciclada a su lugar numerado. Luego gira con el dedo la gran rueda para bajar la caña y volcar la pintura.',parts:['Engranaje','Correa','Caña de pescar','Anzuelo','Bote de pintura'],run:'Girar la rueda',hint:'Conecta las cinco piezas en orden y gira la rueda para activar el mecanismo.',connected:'Piezas conectadas',win:'Tinguely convirtió la chatarra, el movimiento y el alegre caos en arte.'},
brancusi:{title:'Esculpe el canto del gallo',intro:'Tira de los puntos luminosos para estirar y doblar la escultura de madera. Cambia su silueta y escucha el sonido.',tip:'Estira la cresta',width:'Ensancha el cuerpo',bend:'Dobla el cuello',waist:'Modela la base',listen:'Escuchar mi escultura',hint:'Mueve al menos dos puntos diferentes y escucha el sonido. Usa auriculares para respetar el silencio del museo.',win:'Brancusi redujo el gallo a su forma ascendente y su canto: esencia en lugar de imitación.'},
lamelas:{title:'¿Cómo viaja una noticia?',intro:'Un anuncio ficticio de museo. Explóralo como periódico, radio y televisión. Observa cómo llega a su público.',channels:['PERIÓDICO','RADIO','TELEVISIÓN'],descs:['Un titular se imprime y pasa de lector a lector. Se puede volver a leer.','Un anuncio se convierte en ondas sonoras escuchadas durante la transmisión.','Las imágenes en movimiento y una voz llegan a espectadores en varias pantallas.'],message:'El museo inaugura hoy una nueva exposición',take:'¿Cuál descubrimiento es correcto?',choices:['El medio cambia cómo viaja el mensaje','Todos los medios llegan a la gente de la misma manera'],win:'Lamelas investigó cómo el sonido, la imagen y la palabra escrita cambian nuestra forma de consumir información.',seen:'Medios explorados'},
common:{done:'Guardar mi descubrimiento ✦',locked:'Completa primero la actividad',care:'Interpretación interactiva original. Observa la obra real sin tocarla.',mica:'DESCUBRIMIENTO DE MICA',assist:'Usar una alternativa guiada',story:'Leer la historia de esta obra',replay:'Empezar de nuevo',next:'Continuar'}
}
};
const tr=()=>I[state.lang]||I.en;
const h=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const F=['tomato','mushroom','pea','chicken','corn'],Ficons=['🍅','🍄','🫛','🐓','🌽'];
const Ftext={en:['Tomato','Mushroom','Pea','Chicken','Corn'],fr:['Tomate','Champignon','Pois','Poulet','Maïs'],es:['Tomate','Champiñón','Guisantes','Pollo','Maíz']};
const MAT=['fur','velvet','ice','spikes','grass','metal','feathers','ceramic'];
const PART=['gear','belt','rod','hook','paint'];
const LANG=()=>state.lang in Ftext?state.lang:'en';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const svgWrap=(inner,extra='')=>'<svg class="mg-art" viewBox="0 0 340 270" role="img" '+extra+'>'+inner+'</svg>';
const action=(label,act,val='',klass='')=>'<button type="button" class="mg-action '+klass+'" data-mg="'+act+'" data-value="'+h(val)+'">'+h(label)+'</button>';
const icon=(t)=>'<span aria-hidden="true">'+t+'</span>';
function data(C,id){
 if(!C.extra||C.extra.id!==id)C.extra={id,swirls:[],links:[],pads:[],sun:0.10,reels:['tomato','mushroom','pea'],held:[false,false,false],spins:0,textures:{cup:'ceramic',saucer:'ceramic',spoon:'metal'},chosenTexture:'fur',reaction:'',installed:[],selectedPart:'gear',degrees:0,fired:false,sculpt:{tip:62,width:36,bend:0,waist:21},sculptMoves:[],previewed:false,mediaSeen:[],currentMedia:'news',takeaway:''};
 return C.extra;
}
function won(id,s){
 if(id.startsWith('moma-'))id=id.slice(5);
 switch(id){
 case 'starry':return s.swirls.length>=3;
 case 'dance':return s.links.length>=5;
 case 'lilies':return s.pads.length>=4&&s.sun>=.70;
 case 'warhol':return s.spins>=1&&s.reels.every(x=>x===s.reels[0]);
 case 'oppenheim':return Object.values(s.textures).every(x=>x!=='ceramic'&&x!=='metal')&&new Set(Object.values(s.textures)).size>=2&&!!s.reaction;
 case 'tinguely':return s.installed.length===5&&s.fired;
 case 'brancusi':return s.sculptMoves.length>=2&&s.previewed;
 case 'lamelas':return s.mediaSeen.length===3&&s.takeaway==='different';
 }return false;
}
const swirlPath=(x,y,r,flip=1)=>{let d='';for(let i=0;i<=65;i++){const t=i/65,a=flip*t*Math.PI*4.3,rad=2+(r-2)*t;const xx=x+Math.cos(a)*rad,yy=y+Math.sin(a)*rad*.72;d+=(i?' L':'M')+xx.toFixed(1)+' '+yy.toFixed(1)}return d};
function starry(s,t){
 const stars=[[30,36,6],[91,50,8],[170,30,8],[263,49,10],[309,94,5],[125,103,5],[55,125,6]];
 let sky='<defs><linearGradient id="mgNight" x2="0" y2="1"><stop stop-color="#102254"/><stop offset=".72" stop-color="#355aa4"/><stop offset="1" stop-color="#7778a2"/></linearGradient><linearGradient id="mgGold"><stop stop-color="#e3b14f"/><stop offset=".55" stop-color="#fff0a6"/><stop offset="1" stop-color="#d6a954"/></linearGradient></defs><rect width="340" height="270" fill="url(#mgNight)"/>';
 for(let i=0;i<13;i++){sky+='<path d="M-20 '+(30+i*10)+' Q140 '+(9+i*13)+' 360 '+(20+i*10)+'" stroke="'+(i%3?'#7ea5cf':'#e0be8a')+'" opacity=".23" stroke-width="'+(i%2+2)+'" fill="none"/>'}
 sky+=stars.map(([x,y,r],i)=>'<g class="mg-starlight"><circle cx="'+x+'" cy="'+y+'" r="'+(r*2.4)+'" fill="#fceab5" opacity=".10"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fbe9a1"/><path d="M'+(x-r*2)+' '+y+'h'+r*4+' M'+x+' '+(y-r*2)+'v'+r*4+'" stroke="#fff0c8" stroke-width="2" opacity=".75"/></g>').join('');
 sky+=s.swirls.map((w,i)=>'<g class="mg-swirl"><path d="'+swirlPath(w.x,w.y,w.r,w.dir)+'" fill="none" stroke="#e7a951" stroke-width="19" opacity=".26" stroke-linecap="round"/><path d="'+swirlPath(w.x,w.y,w.r,w.dir)+'" fill="none" stroke="'+(i%2?'#d7e9fb':'url(#mgGold)')+'" stroke-width="9" stroke-linecap="round"/><path d="'+swirlPath(w.x,w.y,w.r,w.dir)+'" fill="none" stroke="#fff7d5" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 13"/></g>').join('');
 sky+='<path id="mg-sky-draw" stroke="#ffe3ab" stroke-width="8" fill="none" stroke-linecap="round" opacity=".5"/><path d="M0 214l35-12 25 13 31-8 20 9 29-14 19 15 23-8 15 8 25-14 18 10 19-13 37 12v68H0Z" fill="#1c3759"/><path d="M0 239l40-13 29 11 20-17 23 16 40-13 21 17 27-17 34 9 30-14 38 19v41H0Z" fill="#314865"/><g fill="#f5c783">';
 for(let i=0;i<13;i++){const x=i*27+7;sky+='<path d="M'+x+' 234v-16h14v16z" opacity=".7"/>'}
 sky+='</g><path d="M53 270Q30 205 37 154Q50 120 44 81Q69 111 64 146Q92 190 80 270Z" fill="#152f31"/><path d="M63 268Q60 196 47 143" stroke="#61825a" stroke-width="4" fill="none"/>';
 return '<div class="mg-scene mg-night" data-mg-drag="sky" aria-label="'+h(t.hint)+'">'+svgWrap(sky)+'</div><div class="mg-meter">'+h(t.count)+' <b>'+s.swirls.length+'/3</b></div>';
}
function dancerCoords(i){const angle=i*Math.PI*2/5-Math.PI/2;return {x:170+112*Math.cos(angle),y:137+92*Math.sin(angle)}}
function dance(s,t){
 let content='<defs><linearGradient id="mgDanceBg" x2="0" y2="1"><stop stop-color="#30699c"/><stop offset=".62" stop-color="#477fbd"/><stop offset=".63" stop-color="#549a83"/><stop offset="1" stop-color="#51836c"/></linearGradient></defs><rect width="340" height="270" fill="url(#mgDanceBg)"/><path d="M0 179Q120 151 230 176T340 170v100H0Z" fill="#6ba67b" opacity=".86"/><g class="'+(s.links.length===5?'mg-dance-complete':'')+'">';
 for(let i=0;i<5;i++){
  const c=dancerCoords(i),sx=c.x+20,sy=c.y-11,tx=dancerCoords((i+1)%5).x-20,ty=dancerCoords((i+1)%5).y-11,connected=s.links.includes(i);
  if(connected)content+='<path d="M'+sx+' '+sy+'Q'+((sx+tx)/2)+' '+((sy+ty)/2-19)+' '+tx+' '+ty+'" fill="none" stroke="#f9cead" stroke-width="10" stroke-linecap="round"/>';
 }
 for(let i=0;i<5;i++){
  const c=dancerCoords(i),next=dancerCoords((i+1)%5),sx=c.x+20,sy=c.y-11,tx=next.x-20,ty=next.y-11,linked=s.links.includes(i);
  content+='<g class="mg-dancer" style="--delay:'+(i*.18)+'s"><path d="M'+c.x+' '+(c.y+5)+'l-15 35m15-35l16 35" fill="none" stroke="#e8a38b" stroke-width="10" stroke-linecap="round"/><path d="M'+(c.x-16)+' '+(c.y+4)+'Q'+c.x+' '+(c.y-20)+' '+(c.x+16)+' '+(c.y+4)+'Q'+c.x+' '+(c.y+33)+' '+(c.x-16)+' '+(c.y+4)+'" fill="#eab29b"/><circle cx="'+c.x+'" cy="'+(c.y-25)+'" r="14" fill="#eeb9a5"/><path d="M'+(c.x-7)+' '+(c.y-4)+'Q'+(c.x-26)+' '+(c.y-11)+' '+(c.x-27)+' '+(c.y-28)+' M'+(c.x+7)+' '+(c.y-5)+'L'+sx+' '+sy+'" stroke="#eab29b" stroke-width="9" fill="none" stroke-linecap="round"/></g>';
  if(!linked){content+='<circle class="mg-hand-target" data-mg-target="'+i+'" cx="'+tx+'" cy="'+ty+'" r="16" fill="#fff7dc22" stroke="#ffdfaa" stroke-dasharray="4 4" stroke-width="2"/><circle class="mg-hand-handle" data-mg-drag="hand" data-i="'+i+'" cx="'+sx+'" cy="'+sy+'" r="12" fill="#ffe3b2" stroke="#da8658" stroke-width="2" role="button" aria-label="'+h(t.hint)+' '+(i+1)+'" tabindex="0"/>'}
 }
 content+='</g><path id="mg-dance-ghost" fill="none" stroke="#ffe8ae" stroke-width="8" stroke-linecap="round"/>';
 return '<div class="mg-scene mg-dance-scene">'+svgWrap(content)+'</div><div class="mg-meter">'+h(t.count)+' <b>'+s.links.length+'/5</b></div><div class="mg-nudges">'+Array.from({length:5},(_,i)=>action((s.links.includes(i)?'✓ ':'✋ ')+(i+1),'connect',i,s.links.includes(i)?'is-active':'')).join('')+'</div>';
}
const PADPOS=[[45,126],[109,150],[173,100],[243,138],[298,102],[83,212],[197,197],[282,217]];
function lilies(s,t){
 const bright=(.12+s.sun*.88).toFixed(2);
 let art='<defs><linearGradient id="mgPond" x2="0" y2="1"><stop stop-color="#486fa1"/><stop offset=".45" stop-color="#588ea6"/><stop offset="1" stop-color="#315e75"/></linearGradient><linearGradient id="mgReflection" x2="0" y2="1"><stop stop-color="#e9dbd0"/><stop offset=".45" stop-color="#f6d6bd"/><stop offset=".64" stop-color="#b1c9d1"/><stop offset="1" stop-color="#ddd9ac"/></linearGradient></defs><rect width="340" height="270" fill="url(#mgPond)"/><g class="mg-reflected-sky" id="mg-reflect" opacity="'+bright+'"><path d="M0 45q65-35 110 8t130-7t100-4v144H0Z" fill="url(#mgReflection)"/><path d="M-20 105q45-20 80 5t90-8t105 2t110-13" stroke="#faf5e4" stroke-width="21" opacity=".55" fill="none"/><path d="M-30 170q75-22 130 5t120-5t130 8" stroke="#d2ccdf" stroke-width="31" opacity=".65" fill="none"/></g>';
 for(let i=0;i<24;i++){const y=8+i*11;art+='<path class="mg-wave" d="M'+((i*31)%35-35)+' '+y+'Q70 '+(y+(i%3-2)*4)+' 145 '+y+'T350 '+(y+(i%2?3:-3))+'" fill="none" stroke="'+(i%2?'#a4d5d0':'#fff5d5')+'" stroke-width="'+(i%3+1)+'" opacity="'+(.15+s.sun*.29).toFixed(2)+'"/>'}
 art+=PADPOS.map(([x,y],i)=>'<g class="mg-pad '+(s.pads.includes(i)?'is-planted':'')+'" data-mg="pad" data-value="'+i+'" role="button" aria-label="'+h(t.count)+' '+(i+1)+'" tabindex="0" transform="translate('+x+' '+y+')">'+(s.pads.includes(i)?'<ellipse rx="23" ry="11" fill="#305f4c" transform="rotate(-12)"/><ellipse rx="20" ry="9" fill="#7ea46c" transform="rotate(-12)"/><path d="M0 0L18 -11L13 4Z" fill="#427b5c"/><circle cy="-4" r="7" fill="#fff1de"/><path d="M-7-4L0-13L7-4L0 5Z" fill="#f9bad1"/>':'<circle r="16" fill="#f6eecb33" stroke="#fff8d0" stroke-dasharray="4 4" stroke-width="2"/><path d="M-5 0H5M0-5V5" stroke="#fff3c6" stroke-width="2"/>')+'</g>').join('');
 return '<div class="mg-scene mg-pond-scene">'+svgWrap(art)+'<button class="mg-sun" style="left:'+((.10+s.sun*.8)*100)+'%" data-mg-drag="sun" aria-label="'+h(t.light)+'" title="'+h(t.light)+'">☀</button><div class="mg-ripple-wash" style="opacity:'+(.07+s.sun*.43)+'"></div></div><div class="mg-meter"><span>'+h(t.count)+' <b>'+s.pads.length+'/4</b></span><span>'+h(t.light)+' <b id="mg-light-value">'+Math.round(s.sun*100)+'%</b></span></div>';
}
function canHtml(flavour,i){
 const index=Math.max(0,F.indexOf(flavour));
 return '<div class="mg-can mg-can-'+flavour+'" aria-label="'+h(Ftext[LANG()][index])+'"><div class="mg-can-rim"></div><div class="mg-can-upper">'+h(Ficons[index])+'</div><div class="mg-can-banner">SOUP<br><small>STUDIES</small></div><div class="mg-can-flavour">'+h(Ftext[LANG()][index])+'</div><div class="mg-can-bottom"></div></div>';
}
function warhol(s,t){
 let reels='<div class="mg-reels '+(s.spins?'mg-reels-spun':'')+'">'+s.reels.map((f,i)=>'<div class="mg-reel-cell '+(s.held[i]?'mg-held':'')+'"><button type="button" data-mg="nudge" data-value="'+i+'" class="mg-reel" aria-label="'+h(t.hint)+'">'+canHtml(f,i)+'</button>'+action(s.held[i]?t.release+' ✓':t.hold,'hold',i,'mg-hold')+'</div>').join('')+'</div>';
 const match=won('warhol',s);
 return '<div class="mg-slot"><div class="mg-slot-top">✦ POP ART ✦ <span>777</span></div>'+reels+'<div class="mg-slot-base">'+action('◉ '+t.spin,'spin','','mg-spin')+'<b>🍒 ✦ 🍒</b></div></div>'+
 '<div class="mg-meter">'+h(t.count)+' <b>'+s.spins+'</b></div>'+
 (match?'<div class="mg-jackpot">✦ '+h(t.jackpot)+' ✦<div class="mg-pop-grid">'+Array.from({length:9},(_,i)=>'<div style="--i:'+i+'">'+canHtml(s.reels[0],i)+'</div>').join('')+'</div></div>':'');
}
/* All three tea-set objects are actual vector silhouettes. Each material is
   painted onto their surfaces with a unique SVG pattern and dimensional relief,
   never onto the background of a generic emoji or div. */
const TEA_PALETTE={
 ceramic:['#f3f4ef','#d5e5e1','#879b94'],
 fur:['#ddc4a3','#b38c6b','#654d3c'],
 velvet:['#b88bb6','#733873','#3d2450'],
 ice:['#e8ffff','#95d5e7','#4d9aad'],
 spikes:['#d1c5af','#8a7d6f','#514c48'],
 grass:['#bada84','#64934e','#325d3a'],
 metal:['#f8fbf8','#a9b6b8','#506972'],
 feathers:['#f6e9d1','#cbad96','#987d72']
};
function teaDefs(part,material){
 const id='mg-tea-'+part,base=TEA_PALETTE[material]||TEA_PALETTE.ceramic;
 let texture='';
 if(material==='fur'){
  for(let i=0;i<34;i++){
   const x=(i*19+7)%49,y=(i*23+11)%49,dx=(i%4-1.5)*2;
   texture+='<path d="M'+x+' '+(y+4)+'q'+dx+' -5 '+(dx+2)+' -10" stroke="'+(i%3?'#f5e1bf':'#765743')+'" stroke-width="'+(i%3?1.5:2.4)+'" stroke-linecap="round" fill="none"/>';
  }
 }else if(material==='velvet'){
  texture='<path d="M-8 4 Q16 -3 30 6T58 2 M-8 18Q14 11 31 21T56 16 M-8 32 Q16 25 31 36T58 29" fill="none" stroke="#e6b5e2" stroke-width="2" opacity=".42"/>';
  for(let i=0;i<26;i++)texture+='<circle cx="'+(i*17%48)+'" cy="'+(i*29%48)+'" r=".9" fill="#fce4f0" opacity=".48"/>';
 }else if(material==='ice'){
  texture='<path d="M0 0L21 16L44 0 M21 16L13 45L48 34 M0 38L21 16 M21 16L34 25" stroke="#ffffff" stroke-width="2.3" opacity=".8" fill="none"/><path d="M0 15l13-15h25l-9 14-13 12z" fill="#d9fcff" opacity=".48"/><circle cx="36" cy="10" r="3" fill="#ffffff"/>';
 }else if(material==='spikes'){
  texture='<path d="M0 15L10 0L18 19L30 4L45 20L48 0V42L35 30L23 46L10 29L0 46Z" fill="#423f3d" opacity=".57"/><path d="M10 0L18 19L30 4L35 30L23 46" stroke="#fbefd5" stroke-width="2" fill="none" opacity=".65"/>';
 }else if(material==='grass'){
  for(let i=0;i<20;i++){const x=i*11%48,y=(i*19)%48;texture+='<path d="M'+x+' '+(y+12)+'q'+(i%2?8:-8)+' -10 '+(i%3?4:-4)+' -19" stroke="'+(i%3?'#285b33':'#d1ef8e')+'" stroke-width="2.1" fill="none"/>'}
 }else if(material==='metal'){
  texture='<path d="M-10 8H60 M-10 15H60 M-10 32H60 M-10 40H60" stroke="#effbfb" stroke-width="5" opacity=".48"/><path d="M0 10h48 M0 34h48" stroke="#546c74" stroke-width="3" opacity=".28"/>';
 }else if(material==='feathers'){
  for(let y=-8;y<=55;y+=17)for(let x=-7;x<=57;x+=19){
   texture+='<path d="M'+x+' '+(y+12)+'Q'+(x+12)+' '+(y-4)+' '+(x+19)+' '+(y+11)+'Q'+(x+8)+' '+(y+20)+' '+x+' '+(y+12)+'Z" fill="#f8eacc" stroke="#a48a79" stroke-width="1.1"/><path d="M'+(x+9)+' '+(y+4)+'v13" stroke="#ae9383" stroke-width=".7"/>';
  }
 }else{
  texture='<path d="M0 12Q24 6 48 12 M0 33Q24 27 48 33" fill="none" stroke="#ffffff" opacity=".45" stroke-width="2"/>';
 }
 return '<defs>'+
  '<linearGradient id="'+id+'-base" x1="0" x2="1" y1="0" y2=".7"><stop stop-color="'+base[0]+'"/><stop offset=".45" stop-color="'+base[1]+'"/><stop offset="1" stop-color="'+base[2]+'"/></linearGradient>'+
  '<linearGradient id="'+id+'-depth" x1="0" x2="1"><stop stop-color="#ffffff" stop-opacity=".56"/><stop offset=".3" stop-color="#ffffff" stop-opacity=".02"/><stop offset=".82" stop-color="#1c2424" stop-opacity=".10"/><stop offset="1" stop-color="#171b1a" stop-opacity=".3"/></linearGradient>'+
  '<pattern id="'+id+'-coat" patternUnits="userSpaceOnUse" width="48" height="48">'+
  '<rect width="48" height="48" fill="url(#'+id+'-base)"/>'+texture+'</pattern>'+
  '</defs>';
}
function teaFringe(part,material){
 if(!['fur','grass','spikes','feathers'].includes(material))return '';
 const points=[];
 if(part==='cup'){
  for(let y=52;y<=124;y+=5){points.push([23+(y-52)*.16,y,-1,0],[105-(y-52)*.15,y,1,0])}
  for(let x=35;x<=97;x+=5)points.push([x,130-7*Math.abs(x-66)/32,0,1]);
 }else if(part==='saucer'){
  for(let i=0;i<48;i++){const a=i*Math.PI*2/48;points.push([70+61*Math.cos(a),96+24*Math.sin(a),Math.cos(a),Math.sin(a)])}
 }else{
  for(let i=0;i<33;i++){const a=i*Math.PI*2/33;points.push([70+23*Math.cos(a),48+29*Math.sin(a),Math.cos(a),Math.sin(a)])}
  for(let y=89;y<=145;y+=5)points.push([62,y,-1,0],[78,y,1,0]);
 }
 let marks='';
 const count=material==='feathers'?Math.ceil(points.length/3):points.length;
 for(let i=0;i<count;i++){
  const [x,y,dx,dy]=points[material==='feathers'?i*3:i];
  const v=material==='spikes'?9+(i%3)*3:material==='grass'?8+(i%4)*2:material==='feathers'?12:6+(i%4)*2;
  const bend=(i%4-1.5)*2.3;
  if(material==='spikes'){
   const px=-dy*3,py=dx*3;
   marks+='<path d="M'+(x+px).toFixed(1)+' '+(y+py).toFixed(1)+'L'+(x+dx*v).toFixed(1)+' '+(y+dy*v).toFixed(1)+'L'+(x-px).toFixed(1)+' '+(y-py).toFixed(1)+'Z" fill="#999185" stroke="#5d5b57" stroke-width=".8"/>';
  }else if(material==='feathers'){
   marks+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'q'+(dx*v-dy*4).toFixed(1)+' '+(dy*v+dx*4).toFixed(1)+' '+(dx*(v+7)).toFixed(1)+' '+(dy*(v+7)).toFixed(1)+'q-7 -4 '+(-dx*(v+7)).toFixed(1)+' '+(-dy*(v+7)).toFixed(1)+'Z" fill="#f6e3c4" stroke="#ad9982" stroke-width=".8"/>';
  }else{
   marks+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+'q'+(dx*v*.65-dy*bend).toFixed(1)+' '+(dy*v*.65+dx*bend).toFixed(1)+' '+(dx*v).toFixed(1)+' '+(dy*v).toFixed(1)+'" fill="none" stroke="'+(material==='fur'?(i%3?'#e5c8a7':'#977358'):(i%3?'#9ad070':'#356d42'))+'" stroke-width="'+(material==='fur'?2.5:2)+'" stroke-linecap="round"/>';
  }
 }
 return '<g class="mg-tea-fringe mg-tea-fringe-'+material+'" aria-hidden="true">'+marks+'</g>';
}
function teaCup(material){
 const coat='url(#mg-tea-cup-coat)',shadow='url(#mg-tea-cup-depth)';
 const body='M23 47 Q64 39 105 47 L97 121 Q92 138 64 140 Q35 139 31 122 Z';
 return '<ellipse cx="66" cy="149" rx="50" ry="6" fill="#493e3455"/>'+
  '<path d="M105 60 C139 42 144 103 106 113" fill="none" stroke="#85786b" stroke-width="19"/>'+
  '<path class="mg-tea-coating mg-tea-handle-coat" d="M105 60 C139 42 144 103 106 113" fill="none" stroke="'+coat+'" stroke-width="13"/>'+
  teaFringe('cup',material)+
  '<path class="mg-tea-coating mg-tea-cup-body" d="'+body+'" fill="'+coat+'" stroke="#746958" stroke-width="3"/>'+
  '<path d="'+body+'" fill="'+shadow+'" pointer-events="none"/>'+
  '<ellipse cx="64" cy="47" rx="41.5" ry="13" fill="'+coat+'" stroke="#827467" stroke-width="3"/>'+
  '<ellipse cx="64" cy="46" rx="32" ry="7" fill="'+(material==='ice'?'#a8effa':material==='fur'?'#8c6b4f':'#5b6666')+'" opacity=".48"/>'+
  '<path d="M34 61Q37 105 45 123" fill="none" stroke="#ffffff" stroke-width="3" opacity=".48" stroke-linecap="round"/>';
}
function teaSaucer(material){
 const coat='url(#mg-tea-saucer-coat)',shadow='url(#mg-tea-saucer-depth)';
 return '<ellipse cx="70" cy="141" rx="65" ry="6" fill="#443b3650"/>'+
  teaFringe('saucer',material)+
  '<path class="mg-tea-coating mg-tea-saucer-body" d="M10 95 Q14 80 70 75 Q127 80 130 95 Q133 119 98 133 Q70 145 41 133 Q8 117 10 95Z" fill="'+coat+'" stroke="#786c5d" stroke-width="3"/>'+
  '<path d="M10 95 Q14 80 70 75 Q127 80 130 95 Q133 119 98 133 Q70 145 41 133 Q8 117 10 95Z" fill="'+shadow+'"/>'+
  '<ellipse class="mg-tea-coating mg-tea-saucer-rim" cx="70" cy="93" rx="60" ry="21" fill="'+coat+'" stroke="#aa977d" stroke-width="3"/>'+
  '<ellipse cx="70" cy="92" rx="38" ry="11.5" fill="none" stroke="#fff9e4" stroke-width="4" opacity=".67"/>'+
  '<path d="M13 104 Q70 145 127 104" fill="none" stroke="#fff7e0" opacity=".56" stroke-width="2.5"/>';
}
function teaSpoon(material){
 const coat='url(#mg-tea-spoon-coat)',shadow='url(#mg-tea-spoon-depth)';
 return '<ellipse cx="78" cy="153" rx="29" ry="4" fill="#44362f44"/>'+
  '<g transform="rotate(26 70 91)">'+
  teaFringe('spoon',material)+
  '<path d="M63 80 Q59 104 62 145 Q70 154 78 145 Q81 104 77 80Z" class="mg-tea-coating mg-tea-spoon-handle" fill="'+coat+'" stroke="#766e68" stroke-width="3"/>'+
  '<path d="M63 80 Q59 104 62 145 Q70 154 78 145 Q81 104 77 80Z" fill="'+shadow+'"/>'+
  '<path class="mg-tea-coating mg-tea-spoon-bowl" d="M70 19 C44 20 41 57 52 76 Q60 93 70 91 Q82 93 89 76 C99 56 96 19 70 19Z" fill="'+coat+'" stroke="#8d7b6c" stroke-width="3"/>'+
  '<path d="M70 19 C44 20 41 57 52 76 Q60 93 70 91 Q82 93 89 76 C99 56 96 19 70 19Z" fill="'+shadow+'"/>'+
  '<path d="M58 39Q55 59 61 75" fill="none" stroke="#ffffff" stroke-width="3" opacity=".62"/>'+
  '<path d="M65 103Q64 132 68 141" fill="none" stroke="#ffffff" stroke-width="2" opacity=".57"/>'+
  '</g>';
}
function objectPart(name,label,material,t){
 const words=t||tr().oppenheim;
 const materialName=words.materials[MAT.indexOf(material)]||material;
 const drawing=name==='cup'?teaCup(material):name==='saucer'?teaSaucer(material):teaSpoon(material);
 const effect=material==='fur'?'✧':material==='ice'?'❄':material==='spikes'?'✦':material==='grass'?'✿':material==='feathers'?'❧':material==='velvet'?'✧':material==='metal'?'✧':'';
 return '<button type="button" class="mg-tea-part mg-tea-'+name+' mg-material-'+material+'" data-mg="apply" data-value="'+name+'" data-mg-drop="'+name+'" data-object="'+name+'" data-material="'+material+'" aria-label="'+h(label+' · '+materialName)+'">'+
 '<svg class="mg-tea-illustration" viewBox="0 0 140 160" aria-hidden="true" focusable="false">'+teaDefs(name,material)+'<g class="mg-tea-object mg-coat-'+material+'" data-object-surface="'+name+'" data-material="'+material+'">'+drawing+'</g></svg>'+
 (effect?'<span class="mg-tea-touch-reaction" aria-hidden="true">'+effect+'</span>':'')+
 '<small class="mg-tea-part-label">'+h(label)+'</small><span class="mg-tea-material-name">'+h(materialName)+'</span></button>';
}
function oppenheim(s,t){
 const textureKeys=Object.values(s.textures),n=textureKeys.filter(x=>x!=='ceramic'&&x!=='metal').length;
 return '<div class="mg-material-lab"><div class="mg-tea-stage">'+['cup','saucer','spoon'].map((part,i)=>objectPart(part,t.part[i],s.textures[part],t)).join('')+'</div>'+
 '<div class="mg-texture-palette" role="group" aria-label="'+h(t.intro)+'">'+MAT.map((m,i)=>'<button class="mg-texture-swatch mg-material-'+m+' '+(s.chosenTexture===m?'is-selected':'')+'" type="button" data-mg="texture" data-value="'+m+'" data-mg-drag="texture" data-material="'+m+'" aria-pressed="'+(s.chosenTexture===m)+'"><span class="mg-texture-sample"></span><small>'+h(t.materials[i])+'</small></button>').join('')+'</div>'+
 '<div class="mg-reaction"><p>'+h(t.prompt)+'</p><div class="mg-reaction-options">'+t.feelings.map((f,i)=>action((s.reaction===String(i)?'✓ ':'')+f,'reaction',i,s.reaction===String(i)?'is-active':'')).join('')+'</div></div><div class="mg-meter">'+n+'/3 · '+h(t.part.join(' · '))+'</div></div>';
}
function tinguely(s,t){
 const assembled=i=>s.installed.includes(PART[i]);
 const parts=[['⚙',82,161],['〰',158,147],['🎣',216,75],['↧',255,145],['🪣',282,197]];
 const sockets=parts.map(([icon,x,y],i)=>'<button class="mg-socket '+(assembled(i)?'is-connected':'')+'" style="left:'+(x/340*100)+'%;top:'+(y/270*100)+'%" data-mg="socket" data-value="'+i+'" data-mg-drop="'+i+'" aria-label="'+h(t.parts[i])+'">'+(assembled(i)?'<span>'+icon+'</span>':'<b>'+(i+1)+'</b>')+'</button>').join('');
 const lines='<svg class="mg-mechanism" viewBox="0 0 340 270" aria-hidden="true"><path d="M82 161L158 147L216 75L255 145L282 197" stroke="#625f59" stroke-width="13" opacity=".55" fill="none"/><path d="M82 161L158 147L216 75L255 145L282 197" stroke="#d6b576" stroke-width="4" stroke-dasharray="10 7" fill="none"/><path class="mg-fishing-rod" d="M186 89L275 64L276 135" stroke="#855b3b" stroke-width="5" fill="none"/><path d="M279 149v47" stroke="#3e5656" stroke-width="2" stroke-dasharray="3 2"/><rect x="268" y="210" width="39" height="14" rx="4" fill="#b5a595"/></svg>';
 const ready=s.installed.length===5;
 return '<div class="mg-machine-outer"><div class="mg-machine '+(s.fired?'is-fired':'')+'"><div class="mg-machine-sky"></div>'+lines+
 '<div class="mg-wheel '+(ready?'can-spin':'')+'" data-mg-drag="wheel" data-mg-wheel tabindex="0" role="button" aria-label="'+h(t.run)+'" style="transform:rotate('+s.degrees+'deg)"><div class="mg-spoke">✣</div></div>'+
 '<div class="mg-crank"></div><div class="mg-paint-bucket">PAINT</div><div class="mg-splash">🎨</div><div class="mg-result-flag">✦</div>'+sockets+'</div></div>'+
 '<div class="mg-parts-tray">'+PART.map((part,i)=>'<button class="mg-piece '+(s.selectedPart===part?'is-selected':'')+' '+(assembled(i)?'is-installed':'')+'" data-mg="part" data-value="'+part+'" data-mg-drag="part" data-part="'+part+'" aria-label="'+h(t.parts[i])+'"><b>'+parts[i][0]+'</b><small>'+(i+1)+'. '+h(t.parts[i])+'</small></button>').join('')+'</div>'+
 '<div class="mg-meter">'+h(t.connected)+' <b>'+s.installed.length+'/5</b></div>'+
 (ready?action('⟳ '+t.run,'turn','','mg-turn-button'):'')+
 (s.fired?'<div class="mg-machine-result">✦ '+h(t.win)+'</div>':'');
}
function sculptPath(s){
 const tip=clamp(s.tip,34,100),top=125-tip,wide=clamp(s.width,20,72),bend=clamp(s.bend,-48,48),base=clamp(s.waist,14,54);
 return 'M '+(170-base)+' 234 L '+(170-wide*.58)+' 184 L '+(170+bend-13)+' 151 L '+(170+bend+wide*.65)+' 115 L '+(170+bend-10)+' '+(top+25)+' L '+(170+bend+16)+' '+top+' L '+(170+bend+wide*.28)+' '+(top+46)+' L '+(170+bend+wide*.82)+' '+(top+81)+' L '+(170+wide*.9)+' 172 L '+(170+base)+' 234 Z';
}
function sculptHandles(s){
 return [['tip',170+s.bend+16,125-s.tip],['width',170+s.width*.9,170],['bend',170+s.bend,125],['waist',170+s.waist,233]];
}
function brancusi(s,t){
 const shape=s.sculpt,handles=sculptHandles(shape);
 let svg='<defs><linearGradient id="mgCherry" x2="1" y2="0"><stop stop-color="#76402c"/><stop offset=".39" stop-color="#c48351"/><stop offset=".71" stop-color="#e1b37b"/><stop offset="1" stop-color="#8c4d30"/></linearGradient><pattern id="mgWood" width="9" height="31" patternUnits="userSpaceOnUse"><path d="M3 0q-7 19 2 31M7 0q-4 12 0 31" stroke="#6c3929" stroke-width=".8" fill="none" opacity=".21"/></pattern></defs><rect width="340" height="270" fill="#efe5d7"/><ellipse cx="170" cy="250" rx="78" ry="10" fill="#694837" opacity=".18"/><path id="mg-sculpt-shape" d="'+sculptPath(shape)+'" fill="url(#mgCherry)" stroke="#815033" stroke-width="3"/><path id="mg-sculpt-wood" d="'+sculptPath(shape)+'" fill="url(#mgWood)"/><path d="M112 235h116v21H112z" fill="#8c5636"/>';
 svg+=handles.map(([key,x,y],i)=>'<g role="button" tabindex="0" data-mg-drag="sculpt" data-point="'+key+'" class="mg-sculpt-handle"><circle cx="'+x+'" cy="'+y+'" r="15" fill="#ffe0a6" stroke="#a36c43" stroke-width="2"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="15" fill="#765037">'+(i+1)+'</text></g>').join('');
 return '<div class="mg-sculpt-work">'+svgWrap(svg)+'</div><div class="mg-sculpt-controls">'+['tip','width','bend','waist'].map((key,i)=>'<span><b>'+(i+1)+'</b> '+h(t[key])+(s.sculptMoves.includes(key)?' ✓':'')+'</span>').join('')+'</div>'+
 action('♪ '+t.listen,'listen','','mg-listen')+'<div class="mg-meter">'+s.sculptMoves.length+'/2 · '+(s.previewed?'♪ ✓':'♪')+'</div>';
}
function mediaScene(s,t){
 const i=['news','radio','tv'].indexOf(s.currentMedia);
 const ch=Math.max(i,0);
 let view='';
 if(ch===0)view='<div class="mg-news-paper"><span>THE DAILY ART</span><h4>'+h(t.message)+'</h4><div class="mg-paper-picture">▧</div><div class="mg-paper-columns">▥ ▥ ▥</div></div><div class="mg-news-copies"><span>▤</span><span>▤</span><span>▤</span></div>';
 if(ch===1)view='<div class="mg-radio-tower">♬<span class="mg-broadcast-wave">)))</span></div><div class="mg-radio-people"><span>◉</span><span>◉</span><span>◉</span><span>◉</span></div>';
 if(ch===2)view='<div class="mg-television"><div class="mg-tv-screen"><span class="mg-tv-person">●</span><span class="mg-tv-title">'+h(t.message)+'</span></div><div class="mg-tv-foot">◉ ◉</div></div><div class="mg-tv-people"><span>▣</span><span>▣</span><span>▣</span></div>';
 return '<div class="mg-media-demo mg-media-'+s.currentMedia+'" key="'+ch+'">'+view+'</div><div class="mg-media-caption">'+h(t.descs[ch])+'</div>';
}
function lamelas(s,t){
 return '<div class="mg-media-station"><div class="mg-media-sources">'+['news','radio','tv'].map((k,i)=>'<button class="mg-source '+(s.currentMedia===k?'is-current':'')+' '+(s.mediaSeen.includes(k)?'is-seen':'')+'" data-mg="media" data-value="'+k+'"><b>'+['▤','◖))','▣'][i]+'</b><small>'+h(t.channels[i])+'</small>'+(s.mediaSeen.includes(k)?'<span>✓</span>':'')+'</button>').join('')+'</div>'+mediaScene(s,t)+'</div><div class="mg-meter">'+h(t.seen)+' <b>'+s.mediaSeen.length+'/3</b></div>'+
 (s.mediaSeen.length===3?'<div class="mg-compare-takeaway"><strong>'+h(t.take)+'</strong>'+t.choices.map((q,i)=>action(q,'takeaway',i===0?'different':'same',s.takeaway===(i===0?'different':'same')?'is-active':'')).join('')+'</div>':'');
}
function game(a,C){
 const id=a.id.split('-')[1],t=tr()[id],s=data(C,a.id),common=tr().common;
 if(!t)return '<div class="t1-screen">No game available</div>';
 C.done=won(a.id,s);
 let html='';
 if(id==='starry')html=starry(s,t);
 if(id==='dance')html=dance(s,t);
 if(id==='lilies')html=lilies(s,t);
 if(id==='warhol')html=warhol(s,t);
 if(id==='oppenheim')html=oppenheim(s,t);
 if(id==='tinguely')html=tinguely(s,t);
 if(id==='brancusi')html=brancusi(s,t);
 if(id==='lamelas')html=lamelas(s,t);
 return '<div class="t1-screen mg-screen mg-game-'+id+'"><div class="t1-overline">MoMA · '+h(a.artist)+'</div><h2 class="t1-h1">'+h(t.title)+'</h2><p class="mg-lesson-intro">'+h(t.intro)+'</p>'+html+
 '<p class="mg-help">'+h(t.hint||common.care)+'</p>'+
 '<div class="mg-feedback '+(C.done?'is-complete':'')+'" role="status">'+(C.done?'<div class="mg-mica" aria-hidden="true">✦</div><div><strong>'+h(common.mica)+'</strong><p>'+h(t.win)+'</p></div>':h(common.care))+'</div>'+
 '<button type="button" class="button mg-complete-button" data-t1-finish '+(C.done?'':'disabled')+'>'+h(C.done?common.done:common.locked)+'</button>'+
 '<button type="button" class="button ghost" data-t1-assist>'+h(common.assist)+'</button>'+
 '<button type="button" class="button outline" data-action="v7-story">'+h(common.story)+'</button></div>';
}
function context(){if(state.venue!=='moma'||state.tab!=='quest'||state.stage!=='puzzle')return null;const a=A[state.current],C=window.TRACE_V1?.puzzle;if(!a||!C||!a.id.startsWith('moma-'))return null;return {a,C,s:data(C,a.id)}}
const redraw=(ctx)=>{if(!ctx)return;ctx.C.done=won(ctx.a.id,ctx.s);window.__traceAppRender?.()};
const pushUnique=(arr,val)=>{if(!arr.includes(val))arr.push(val)};
function shortTone(freq=500,duration=.12){
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const ctx=new Audio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(freq*1.3,ctx.currentTime+duration*.7);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration+.02);osc.onended=()=>ctx.close().catch(()=>{})}catch(e){}
}
function sculptCall(s){
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const ctx=new Audio();const dur=.67;
  const o=ctx.createOscillator(),g=ctx.createGain(),filter=ctx.createBiquadFilter();o.type=s.sculpt.width>48?'sawtooth':'triangle';
  const f=240+(100-s.sculpt.tip)*4+Math.abs(s.sculpt.bend)*2;o.frequency.setValueAtTime(f,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.8,ctx.currentTime+.2);o.frequency.exponentialRampToValueAtTime(f*.78,ctx.currentTime+.57);
  filter.type='lowpass';filter.frequency.value=1250+s.sculpt.width*22;
  g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.linearRampToValueAtTime(.055,ctx.currentTime+.06);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
  o.connect(filter);filter.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur);o.onended=()=>ctx.close().catch(()=>{});
 }catch(e){}
}
function actionClick(ev){
 const b=ev.target.closest('[data-mg]');if(!b)return;
 const ctx=context();if(!ctx)return;ev.preventDefault();ev.stopImmediatePropagation();
 const {a,s}=ctx,id=a.id.split('-')[1],kind=b.dataset.mg,v=b.dataset.value;
 if(id==='dance'&&kind==='connect')pushUnique(s.links,Number(v));
 if(id==='lilies'&&kind==='pad')pushUnique(s.pads,Number(v));
 if(id==='warhol'){
  if(kind==='spin'){s.spins++;s.reels=s.reels.map((fl,i)=>s.held[i]?fl:F[Math.floor(Math.random()*F.length)]);shortTone(360+s.spins*28,.1)}
  if(kind==='hold')s.held[Number(v)]=!s.held[Number(v)];
  if(kind==='nudge')s.reels[Number(v)]=F[(F.indexOf(s.reels[Number(v)])+1)%F.length];
 }
 if(id==='oppenheim'){
  if(kind==='texture')s.chosenTexture=v;
  if(kind==='apply')s.textures[v]=s.chosenTexture;
  if(kind==='reaction')s.reaction=v;
 }
 if(id==='tinguely'){
  if(kind==='part')s.selectedPart=v;
  if(kind==='socket'){const i=Number(v);if(PART[i]===s.selectedPart)pushUnique(s.installed,s.selectedPart)}
  if(kind==='turn'&&s.installed.length===5){s.degrees+=360;s.fired=true;shortTone(410,.32)}
 }
 if(id==='brancusi'&&kind==='listen'){s.previewed=true;sculptCall(s)}
 if(id==='lamelas'){
  if(kind==='media'){s.currentMedia=v;pushUnique(s.mediaSeen,v)}
  if(kind==='takeaway')s.takeaway=v;
 }
 redraw(ctx);
}
document.addEventListener('click',actionClick,true);
function coord(el,x,y){
 const svg=el.closest('svg')||el.querySelector('svg'),box=svg?.getBoundingClientRect();
 if(!svg||!box||!box.width||!box.height)return{x:170,y:135};
 return{x:(x-box.left)/box.width*340,y:(y-box.top)/box.height*270};
}
let active=null;
document.addEventListener('pointerdown',ev=>{
 const el=ev.target.closest('[data-mg-drag]'),ctx=context();if(!el||!ctx)return;
 const type=el.dataset.mgDrag,id=ctx.a.id.split('-')[1],allowed={sky:'starry',hand:'dance',sun:'lilies',texture:'oppenheim',part:'tinguely',wheel:'tinguely',sculpt:'brancusi'};
 if(allowed[type]!==id)return;
 const p=type==='wheel'?null:coord(el,ev.clientX,ev.clientY);
 const box=el.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2;
 active={el,ctx,type,origin:p,point:p,downX:ev.clientX,downY:ev.clientY,changed:false,angle:Math.atan2(ev.clientY-cy,ev.clientX-cx),lastAngle:Math.atan2(ev.clientY-cy,ev.clientX-cx),total:0,key:el.dataset.point,index:Number(el.dataset.i),material:el.dataset.material,part:el.dataset.part};
 try{el.setPointerCapture(ev.pointerId)}catch(e){}
 if(type==='sky'||type==='hand'||type==='sun'||type==='wheel'||type==='sculpt'){ev.preventDefault()}
},true);
document.addEventListener('pointermove',ev=>{
 const a=active;if(!a)return;const {type,ctx,el}=a;
 a.changed=a.changed||Math.hypot(ev.clientX-a.downX,ev.clientY-a.downY)>9;
 if(type==='sky'){
  const p=coord(el,ev.clientX,ev.clientY);a.point=p;
  const path=document.getElementById('mg-sky-draw');if(path)path.setAttribute('d','M '+a.origin.x+' '+a.origin.y+' Q '+(p.x+42)+' '+(p.y-42)+' '+p.x+' '+p.y);
 }
 if(type==='hand'){
  const p=coord(el,ev.clientX,ev.clientY);a.point=p;
  const c=dancerCoords(a.index),sx=c.x+20,sy=c.y-11;
  const path=document.getElementById('mg-dance-ghost');if(path)path.setAttribute('d','M'+sx+' '+sy+'Q'+((sx+p.x)/2)+' '+((sy+p.y)/2-15)+' '+p.x+' '+p.y);
 }
 if(type==='sun'){
  const rect=el.closest('.mg-pond-scene')?.getBoundingClientRect();if(!rect)return;
  ctx.s.sun=clamp((ev.clientX-rect.left)/rect.width,0,1);
  el.style.left=(10+ctx.s.sun*80)+'%';
  const ref=document.getElementById('mg-reflect');if(ref)ref.setAttribute('opacity',(.12+ctx.s.sun*.88).toFixed(2));
  const meter=document.getElementById('mg-light-value');if(meter)meter.textContent=Math.round(ctx.s.sun*100)+'%';
 }
 if(type==='wheel'){
  const rect=el.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,angle=Math.atan2(ev.clientY-cy,ev.clientX-cx);
  let delta=(angle-a.lastAngle)*180/Math.PI;if(delta>180)delta-=360;if(delta< -180)delta+=360;
  if(Math.abs(delta)<75){a.total+=delta;ctx.s.degrees+=delta;el.style.transform='rotate('+ctx.s.degrees+'deg)'}
  a.lastAngle=angle;
 }
 if(type==='sculpt'){
  const p=coord(el,ev.clientX,ev.clientY);a.point=p;const v=ctx.s.sculpt;
  if(a.key==='tip')v.tip=clamp(125-p.y,34,100);
  if(a.key==='width')v.width=clamp(p.x-170,20,72);
  if(a.key==='bend')v.bend=clamp(p.x-170,-48,48);
  if(a.key==='waist')v.waist=clamp(p.x-170,14,54);
  const d=sculptPath(v);document.querySelectorAll('#mg-sculpt-shape,#mg-sculpt-wood').forEach(x=>x.setAttribute('d',d));
  const positions=sculptHandles(v);document.querySelectorAll('.mg-sculpt-handle').forEach((g,i)=>{const [k,x,y]=positions[i];const circle=g.querySelector('circle'),text=g.querySelector('text');if(circle){circle.setAttribute('cx',x);circle.setAttribute('cy',y)}if(text){text.setAttribute('x',x);text.setAttribute('y',y+5)}});
 }
},true);
function pointerEnd(ev){
 const a=active;if(!a)return;active=null;
 const {ctx,type}=a,s=ctx.s;
 if(type==='sky'&&a.changed){const p=a.point||a.origin;const x=clamp(p.x,57,282),y=clamp(p.y,46,174);s.swirls.push({x,y,r:45+Math.min(26,Math.hypot(p.x-a.origin.x,p.y-a.origin.y)*.2),dir:p.x>a.origin.x?1:-1});}
 if(type==='hand'){
  const targetEl=document.querySelector('.mg-hand-target[data-mg-target="'+a.index+'"]');
  const rect=targetEl?.getBoundingClientRect();
  const near=rect&&Math.hypot(ev.clientX-(rect.left+rect.width/2),ev.clientY-(rect.top+rect.height/2))<48;
  const distance=Math.hypot(ev.clientX-a.downX,ev.clientY-a.downY);
  if((a.changed||distance>15)&&near)pushUnique(s.links,a.index);
 }
 function dropTarget(selector){
  const under=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('[data-mg-drop]');
  if(under&&under.matches(selector))return under;
  let nearest=null,best=Infinity;
  document.querySelectorAll(selector).forEach(target=>{
   const r=target.getBoundingClientRect();
   const distance=Math.hypot(ev.clientX-(r.left+r.width/2),ev.clientY-(r.top+r.height/2));
   if(distance<best){nearest=target;best=distance}
  });
  return best<52?nearest:null;
 }
 if(type==='texture'&&a.changed){const point=dropTarget('.mg-tea-part[data-mg-drop]');if(point){s.chosenTexture=a.material;s.textures[point.dataset.mgDrop]=a.material}}
 if(type==='part'){
  const point=dropTarget('.mg-socket[data-mg-drop]');
  if((a.changed||Math.hypot(ev.clientX-a.downX,ev.clientY-a.downY)>15)&&point){const i=Number(point.dataset.mgDrop);if(PART[i]===a.part){s.selectedPart=a.part;pushUnique(s.installed,a.part)}}
 }
 if(type==='wheel'&&s.installed.length===5&&Math.abs(a.total)>=220){s.fired=true;shortTone(425,.30)}
 if(type==='sculpt'&&a.changed)pushUnique(s.sculptMoves,a.key);
 if(a.changed||type==='hand'||type==='sun'||type==='wheel')redraw(ctx);
}
document.addEventListener('pointerup',pointerEnd,true);
document.addEventListener('pointercancel',pointerEnd,true);
document.addEventListener('keydown',ev=>{
 const el=ev.target.closest('[data-mg-drag]');if(!el||!['Enter',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key))return;
 const ctx=context();if(!ctx)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const {s}=ctx,type=el.dataset.mgDrag,key=el.dataset.point;
 if(type==='hand')pushUnique(s.links,Number(el.dataset.i));
 if(type==='wheel'&&s.installed.length===5){s.degrees+=360;s.fired=true}
 if(type==='sun')s.sun=clamp(s.sun+(.15),0,1);
 if(type==='sculpt'){
  if(key==='tip')s.sculpt.tip=clamp(s.sculpt.tip+(ev.key==='ArrowDown'?-13:13),34,100);
  if(key==='width')s.sculpt.width=clamp(s.sculpt.width+12,20,72);
  if(key==='bend')s.sculpt.bend=clamp(s.sculpt.bend+12,-48,48);
  if(key==='waist')s.sculpt.waist=clamp(s.sculpt.waist+9,14,54);
  pushUnique(s.sculptMoves,key);
 }
 redraw(ctx);
},true);
window.TRACE_MOMA_GAME={game,has:id=>typeof id==='string'&&id.startsWith('moma-'),isComplete:won,translations:I,reset:()=>{const C=window.TRACE_V1?.puzzle;if(C)C.extra=null}};
})();
