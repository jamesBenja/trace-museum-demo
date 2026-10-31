/* TRACE: animated, museum-specific Mica onboarding.
   Museum history and architecture cross-checked against each museum's official site.
   Museum images are original stylised SVG illustrations, not official reproductions.
   Speech synthesis is opt-in and relies on device voices. */
(function(){
'use strict';
const T={
 en:{
  label:'A NOTE FROM MICA',next:'Next',back:'Back',skip:'Skip intro',start:'Start exploring',replay:'Watch Mica’s welcome again',speak:'Hear Mica',mute:'Stop voice',auto:'Auto-play',manual:'Pause',steps:'scene',disclaimer:'Independent TRACE prototype. Museum hours, display positions and photography rules should always be checked on site.',
  mmfa:[
   ['Hello, Montréal!','Bonjour, adventurer! I’m Mica, your little spark of curiosity. Ready to discover art at the Montréal Museum of Fine Arts?'],
   ['A museum with a long story','This museum began in 1860 as the Art Association of Montréal. More than 160 years later, it holds art from Québec, Canada and around the world.'],
   ['Look up at the buildings','The museum stretches across five pavilions. Notice the grand columns, marble façades and different shapes. The architecture is part of the adventure, too!'],
   ['Your mission today','Follow our clues, find artworks that are actually on your route, and explore their surprising details. Use the MAP tab for the real galleries, then scan or compare to discover each story.'],
   ['Be a brilliant museum explorer','Walk gently, use an indoor voice and never touch the artworks. Keep a safe distance, ask before taking photos, and give other visitors room. Ready? Let’s begin!']
  ],
  pamm:[
   ['Hello, Miami!','Hi, explorer! I’m Mica, your little spark of curiosity. Ready to find surprising stories at Pérez Art Museum Miami?'],
   ['Art for a changing city','This museum’s story began in 1984. It became a collecting museum in the 1990s and moved to its beautiful home on Biscayne Bay in 2013.'],
   ['A museum beside the water','Architects Herzog & de Meuron designed this building with wide shaded terraces, tall columns and hanging gardens. Look for the light, the plants and glimpses of the bay!'],
   ['Your mission today','Follow clues through modern and contemporary art. Open MAP for gallery directions, find an artwork, scan it or compare it, then unlock a story and make something of your own.'],
   ['Be a brilliant museum explorer','Walk, speak softly, and look with your eyes rather than your hands. Follow staff directions and photo rules; let other people enjoy the art too. Our adventure starts now!']
  ],
  moma:[["Hello, New York!","Hi, explorer! I’m Mica, your little spark of curiosity. Today we’ll discover why ordinary things can become extraordinary art at the Museum of Modern Art."],["A new idea in 1929","MoMA began in 1929, founded by people who believed art should keep changing. Its home on West 53rd Street opened in 1939, and the museum has grown ever since."],["An evolving building","Look for bright glass spaces, different connected wings and the famous Sculpture Garden. A major 2019 expansion made more room for art and surprising connections."],["Our adventure today","We’ll discover paintings, sculptures and an artwork made with sound and video. Open MAP for gallery information, find the clues, then scan or compare artworks and play a creative challenge."],["Be a thoughtful explorer","Walk slowly and give artworks at least an arm’s length of space. No touching! Ask about photo rules, avoid flash, keep voices gentle and follow the museum staff. Ready? Let’s explore!"]]
 },
 fr:{
  label:'UN MOT DE MICA',next:'Suivant',back:'Retour',skip:'Passer l’intro',start:'Commencer l’exploration',replay:'Revoir l’accueil de Mica',speak:'Écouter Mica',mute:'Arrêter la voix',auto:'Lecture auto',manual:'Pause',steps:'scène',disclaimer:'Prototype TRACE indépendant. Vérifiez toujours sur place les œuvres exposées, les emplacements et les règles de photographie.',
  mmfa:[
   ['Bonjour, Montréal !','Salut, exploratrice ou explorateur ! Je suis Mica, une petite étincelle de curiosité. Prêt à découvrir le Musée des beaux-arts de Montréal ?'],
   ['Une longue histoire','Tout a commencé en 1860 avec l’Art Association of Montreal. Aujourd’hui, le musée présente des œuvres du Québec, du Canada et du monde entier.'],
   ['Admire les bâtiments','Le musée occupe cinq pavillons. Observe les grandes colonnes, les façades de marbre et les formes différentes. L’architecture fait aussi partie de l’aventure !'],
   ['Ta mission du jour','Suis les indices et trouve les œuvres de ton parcours. Utilise l’onglet CARTE pour les vraies salles, puis prends une photo ou compare l’œuvre pour découvrir son histoire.'],
   ['Explore avec respect','Marche doucement, parle à voix basse et ne touche jamais aux œuvres. Garde tes distances, vérifie si les photos sont permises et laisse de la place aux autres. On y va !']
  ],
  pamm:[
   ['Bonjour, Miami !','Salut ! Je suis Mica, une petite étincelle de curiosité. Prêt à découvrir des histoires étonnantes au Pérez Art Museum Miami ?'],
   ['Un musée qui grandit','L’histoire du musée commence en 1984. Il développe sa collection dans les années 1990, puis s’installe au bord de la baie de Biscayne en 2013.'],
   ['Un musée au bord de l’eau','Les architectes Herzog & de Meuron ont imaginé de vastes terrasses ombragées, de hautes colonnes et des jardins suspendus. Observe la lumière et la baie !'],
   ['Ta mission du jour','Suis des indices parmi les œuvres modernes et contemporaines. Utilise la CARTE, trouve une œuvre, photographie-la ou compare-la, puis découvre son histoire et crée à ton tour.'],
   ['Explore avec respect','Marche tranquillement et parle doucement. Ne touche pas aux œuvres, respecte les consignes du personnel et vérifie les règles de photographie. À l’aventure !']
  ],
  moma:[["Bonjour, New York !","Salut ! Je suis Mica, ta petite étincelle de curiosité. Aujourd’hui, nous découvrirons pourquoi des objets ordinaires peuvent devenir des œuvres extraordinaires au Museum of Modern Art."],["Une idée nouvelle en 1929","Le MoMA a été fondé en 1929 par des personnes convaincues que l’art devait évoluer. Son bâtiment de la 53e Rue a ouvert en 1939, puis le musée s’est agrandi."],["Un bâtiment en évolution","Observe les espaces vitrés lumineux, les ailes reliées entre elles et le célèbre jardin de sculptures. L’agrandissement de 2019 a donné encore plus de place à l’art."],["Notre aventure aujourd’hui","Nous découvrirons des peintures, des sculptures et une installation mêlant son et vidéo. Ouvre la CARTE pour les salles, suis les indices, compare les œuvres et relève des défis créatifs."],["Explore avec respect","Marche doucement et garde au moins une longueur de bras des œuvres. Ne touche rien ! Respecte les règles photo, évite le flash, parle doucement et suis les consignes du personnel. On y va !"]]
 },
 es:{
  label:'UN MENSAJE DE MICA',next:'Siguiente',back:'Atrás',skip:'Saltar intro',start:'Empezar a explorar',replay:'Volver a ver la bienvenida de Mica',speak:'Escuchar a Mica',mute:'Detener voz',auto:'Reproducción automática',manual:'Pausar',steps:'escena',disclaimer:'Prototipo independiente de TRACE. Confirma siempre en el museo las obras expuestas, las salas y las normas de fotografía.',
  mmfa:[
   ['¡Hola, Montreal!','¡Hola, explorador o exploradora! Soy Mica, una pequeña chispa de curiosidad. ¿Te animas a descubrir el Museo de Bellas Artes de Montreal?'],
   ['Una historia muy larga','Este museo nació en 1860 como la Art Association of Montreal. Hoy conserva y presenta arte de Quebec, Canadá y de todo el mundo.'],
   ['Mira los edificios','El museo se extiende por cinco pabellones. Fíjate en las columnas, las fachadas de mármol y las distintas formas. ¡La arquitectura también es una obra de arte!'],
   ['Tu misión de hoy','Sigue las pistas y encuentra las obras de tu recorrido. Usa MAPA para llegar a las salas, escanea o compara las obras y descubre sus historias.'],
   ['Explora con respeto','Camina despacio, habla en voz baja y no toques las obras. Mantén tu distancia, pregunta antes de sacar fotos y deja espacio a los demás. ¡Empecemos!']
  ],
  pamm:[
   ['¡Hola, Miami!','¡Hola! Soy Mica, una pequeña chispa de curiosidad. ¿Quieres descubrir historias sorprendentes en el Pérez Art Museum Miami?'],
   ['Arte para una ciudad cambiante','La historia del museo comenzó en 1984. En los años noventa empezó a formar su colección y en 2013 se mudó a la bahía de Biscayne.'],
   ['Un museo junto al mar','Los arquitectos Herzog & de Meuron diseñaron terrazas sombreadas, columnas altas y jardines colgantes. ¡Observa la luz, las plantas y la bahía!'],
   ['Tu misión de hoy','Sigue pistas entre obras modernas y contemporáneas. Abre MAPA para encontrar las salas, escanea o compara una obra y descubre su historia y un juego creativo.'],
   ['Explora con respeto','Camina con calma, habla bajito y no toques las obras. Sigue las indicaciones del museo, comprueba las normas para hacer fotos y respeta a los demás. ¡Vamos!']
  ],
  moma:[["¡Hola, Nueva York!","¡Hola! Soy Mica, una pequeña chispa de curiosidad. Hoy descubriremos cómo las cosas cotidianas se convierten en obras extraordinarias en el Museo de Arte Moderno."],["Una idea nueva en 1929","El MoMA nació en 1929 gracias a personas convencidas de que el arte debía cambiar. Su edificio de la calle 53 abrió en 1939, y el museo siguió creciendo."],["Un edificio en transformación","Fíjate en los espacios de vidrio, las distintas alas conectadas y el famoso jardín de esculturas. Una gran ampliación en 2019 hizo más espacio para el arte."],["Nuestra aventura de hoy","Exploraremos pinturas, esculturas y una instalación de sonido y vídeo. Usa MAPA para encontrar las salas, sigue las pistas, compara las obras y juega con los retos creativos."],["Explora con respeto","Camina despacio y mantén al menos un brazo de distancia de las obras. ¡No las toques! Respeta las normas de fotografía, evita el flash y habla bajito. ¡Empecemos!"]]
 }
};
let scene=0,clock=null,playing=false,voicing=false;
const lang=()=>['en','fr','es'].includes(state.lang)?state.lang:'en';
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=()=>T[lang()];
function halt(){if(clock!==null){clearTimeout(clock);clock=null}}
function stopVoice(){if('speechSynthesis' in window)window.speechSynthesis.cancel();voicing=false}
function cleanup(){halt();stopVoice();playing=false;scene=0}
function showScene(n){halt();stopVoice();scene=Math.max(0,Math.min(4,n));window.__traceAppRender?.();if(playing)autoAdvance()}
function enter(options={}){cleanup();playing=options.autoplay===true;state.stage='welcome';state.tab='quest';save();window.__traceAppRender?.();if(playing)autoAdvance()}
function leave(){cleanup();state.stage='hub';state.tab='quest';save();window.__traceAppRender?.()}
function autoAdvance(){halt();if(!playing||state.stage!=='welcome')return;clock=setTimeout(()=>{if(state.stage!=='welcome')return;if(scene===4){playing=false;halt();window.__traceAppRender?.();return}showScene(scene+1)},9500)}
function voice(){
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window))return false;
 if(voicing){stopVoice();window.__traceAppRender?.();return true}
 stopVoice();
 const utter=new SpeechSynthesisUtterance(T[lang()][state.venue][scene].join('. '));
 utter.lang={en:'en-US',fr:'fr-CA',es:'es-US'}[lang()];utter.rate=.93;utter.pitch=1.13;
 utter.onend=()=>{voicing=false;const b=document.querySelector('[data-tw-voice]');if(b)b.textContent=text().speak};
 utter.onerror=()=>{voicing=false};
 voicing=true;window.speechSynthesis.speak(utter);window.__traceAppRender?.();return true;
}
function sceneArt(){
 if(state.venue==='moma')return '<svg class="tw-building" viewBox="0 0 320 142" aria-hidden="true"><path d="M10 121H310V134H10Z" fill="#9cafa9"/><rect x="26" y="34" width="268" height="86" fill="#e7e8e2" stroke="#48796d" stroke-width="3"/><rect x="26" y="34" width="268" height="22" fill="#293c3b"/><path d="M26 78H294M92 56V120M160 56V120M226 56V120" stroke="#81b3ab" stroke-width="4"/><path d="M100 89l14-18 14 18m40 13 22-28 20 28" stroke="#d0a77a" stroke-width="7" fill="none"/><text x="42" y="50" fill="#fff" font-size="14" font-weight="bold">MoMA</text></svg>';
 if(state.venue==='mmfa')return '<svg class="tw-building" viewBox="0 0 320 142" aria-hidden="true"><path d="M8 119H312V130H8Z" fill="#b6b4a1"/><path d="M50 40L162 8 274 40Z" fill="#f2dfbd" stroke="#6c897e" stroke-width="3"/><path d="M58 41H266V118H58Z" fill="#e7e7d9" stroke="#8aa99b" stroke-width="3"/><path d="M68 51H256V60H68Z" fill="#d1cab0"/>'+[80,123,166,209].map(x=>'<rect x="'+x+'" y="65" width="19" height="48" rx="3" fill="#b8c8bf" stroke="#6b8a81" stroke-width="2"/>').join('')+'<rect x="145" y="80" width="35" height="38" fill="#638276"/><circle cx="250" cy="27" r="6" fill="#f0bc85"/></svg>';
 return '<svg class="tw-building" viewBox="0 0 320 142" aria-hidden="true"><path d="M0 112Q95 99 180 115T320 108V142H0Z" fill="#7ab5c1"/><path d="M22 38H298V48H22Z" fill="#d3ac79"/>'+Array.from({length:11},(_,i)=>'<path d="M'+(27+i*26)+' 38V113" stroke="#cbd6c8" stroke-width="6"/>').join('')+'<path d="M22 49H298V60H22Z" fill="#e9cfac"/><path d="M62 67H258V112H62Z" fill="#b0c9c4"/>'+[70,126,183,239].map(x=>'<path d="M'+x+' 46v15q-18 13 0 26t0 30" stroke="#4e9365" stroke-width="9" stroke-linecap="round" fill="none"/>').join('')+'</svg>';
}
function render(){
 const tx=text(),lines=tx[state.venue][scene],id=state.venue,percent=(scene+1)/5*100;
 return '<div class="tw-screen" lang="'+lang()+'"><div class="tw-top"><span>'+esc(tx.label)+'</span><button type="button" data-tw-skip>'+esc(tx.skip)+' ×</button></div>'+
 '<div class="tw-visual tw-scene-'+scene+' tw-'+id+'"><div class="tw-glow"></div>'+sceneArt()+
 '<div class="tw-mica" aria-label="Animated Mica character" role="img"><div class="tw-mica-body"><span class="tw-eye left"></span><span class="tw-eye right"></span><span class="tw-smile"></span></div><span class="tw-star">✦</span><span class="tw-star tw-star-two">✧</span></div>'+
 '<div class="tw-speech"><span class="tw-mica-name">MICA ✦</span><h2>'+esc(lines[0])+'</h2><p>'+esc(lines[1])+'</p></div></div>'+
 '<div class="tw-step-progress" aria-label="'+(scene+1)+' of 5 '+esc(tx.steps)+'">'+Array.from({length:5},(_,i)=>'<span class="'+(i<=scene?'on':'')+'"></span>').join('')+'</div>'+
 '<div class="tw-options"><div class="v7-language">'+['en','fr','es'].map(l=>'<button type="button" data-tw-lang="'+l+'" class="'+(lang()===l?'active':'')+'" aria-pressed="'+(lang()===l)+'">'+l.toUpperCase()+'</button>').join('')+'</div>'+
 '<button type="button" data-tw-voice '+(!('speechSynthesis' in window)?'disabled':'')+'>'+esc(voicing?tx.mute:tx.speak)+' ♫</button>'+
 '<button type="button" data-tw-auto aria-pressed="'+playing+'">'+esc(playing?tx.manual:tx.auto)+(playing?' ❚❚':' ▷')+'</button></div>'+
 '<div class="tw-buttons"><button type="button" data-tw-back '+(scene===0?'disabled':'')+'>'+esc(tx.back)+'</button><button type="button" data-tw-next>'+esc(scene===4?tx.start:tx.next)+' '+(scene===4?'✦':'→')+'</button></div>'+
 '<p class="tw-disclaimer">'+esc(tx.disclaimer)+'</p></div>';
}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-tw-lang],[data-tw-next],[data-tw-back],[data-tw-skip],[data-tw-auto],[data-tw-voice]');
 if(!el||state.tab!=='quest'||state.stage!=='welcome')return;
 ev.preventDefault();ev.stopImmediatePropagation();
 if(el.dataset.twLang!==undefined){halt();stopVoice();if(window.TRACE_I18N)window.TRACE_I18N.setLanguage(el.dataset.twLang);else{state.lang=el.dataset.twLang;save();window.__traceAppRender?.()}if(playing)autoAdvance();return}
 if(el.dataset.twSkip!==undefined){leave();return}
 if(el.dataset.twNext!==undefined){if(scene===4)leave();else showScene(scene+1);return}
 if(el.dataset.twBack!==undefined){showScene(scene-1);return}
 if(el.dataset.twAuto!==undefined){playing=!playing;halt();window.__traceAppRender?.();if(playing)autoAdvance();return}
 if(el.dataset.twVoice!==undefined){voice();return}
},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){halt();stopVoice()}else if(playing&&state.stage==='welcome')autoAdvance()});
window.TRACE_WELCOME={render,enter,leave,cleanup,get scene(){return scene},get playing(){return playing},translations:T};
})();