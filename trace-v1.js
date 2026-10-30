/* TRACE v1.0 playable layer. The camera, museum map, journal and museum CMS remain in index.html.
 * This layer runs solely in the browser; no children's data is transmitted.
 */
(function(){
'use strict';
const K='trace-v1-play';
let prefs={mode:'family',age:'8-12',familyPoints:{mmfa:0,pamm:0},symbols:{}};
try{const stored=JSON.parse(localStorage.getItem(K)||'{}');if(stored&&typeof stored==='object')prefs={...prefs,...stored}}catch(e){}
const L={
 mmfa:{
 name:'The Lost Colours',description:'Recover the three powers of art from a garden, a mysterious room and a stormy city.',
 nodes:[
 {symbol:'✺',name:'The Secret Garden',subtitle:'The power of detail',hint:'A creature is hiding among the flowers',friend:'Are the tiny creatures real? We need eagle eyes!'},
 {symbol:'◈',name:'The Rooms Beyond',subtitle:'The power of perspective',hint:'Follow the doors into another world',friend:'A doorway inside a painting? I wonder how deep it goes.'},
 {symbol:'☼',name:'The City Before the Storm',subtitle:'The power of light',hint:'A dark city under a glowing sky',friend:'The sky is telling us something. Can you find out what?'}]},
 pamm:{
 name:'The Hidden Signals',description:'Decode an artistic language through masks, photographs and secret symbols.',
 nodes:[
 {symbol:'◉',name:'The Language of Shapes',subtitle:'The power of symbols',hint:'Masks and fish hide inside a grid',friend:'A mask, a fish and a grid! Can they speak to us?'},
 {symbol:'⌁',name:'The Houses on the Hill',subtitle:'The power of storytelling',hint:'A road connects the houses',friend:'Every photograph chooses what to show. What do you notice?'},
 {symbol:'✧',name:'The Hidden Alphabet',subtitle:'The power of making',hint:'A world of small drawn signs',friend:'A pencil made this whole world. What message can you make?'}]}
};
const EXTRA_SYMBOLS={'mmfa-eye':'👁','mmfa-frink':'♟','mmfa-riopelle':'🧩','mmfa-rodin':'◕','mmfa-cragg':'◉','pamm-chaos':'⬡','pamm-fonseca':'▣','pamm-yanko':'⚒','pamm-christo':'🏝','pamm-chromati':'✷'};
for(const [venue,items] of [['mmfa',mmfa],['pamm',pamm]]){
 for(const art of items.slice(3))L[venue].nodes.push({symbol:EXTRA_SYMBOLS[art.id],name:art.chapter,subtitle:'Power of '+art.power.toLowerCase(),hint:art.clue,friend:'Not all art is a painting! Look at the materials, shapes and space around this work.'})
}
const esc=s=>escapeHTML(String(s??''));
const C={id:null,progress:0,points:[],done:false,chosen:null,xy:{x:78,y:77},teamCount:0,assisted:false,lastPuzzleId:null};
function persist(){try{localStorage.setItem(K,JSON.stringify(prefs))}catch(e){}}
function activeArts(){return window.TRACE_DISPLAY?window.TRACE_DISPLAY.activeWorks(state.venue):A}
function t1Found(){return activeArts().filter(a=>state.found.includes(a.id))}
function allDone(){const aa=activeArts();return aa.length>0&&aa.every(a=>state.found.includes(a.id))}
function settingMode(mode){if(['solo','family'].includes(mode)){prefs.mode=mode;persist();render()}}
function settingAge(age){if(['5-7','8-12','teen'].includes(age)){prefs.age=age;persist();render()}}
function paintProgress(){return '<div class="t1-progress"><span style="width:'+(t1Found().length/Math.max(1,activeArts().length)*100)+'%"></span></div>'}
function mascot(message){return '<div class="t1-companion"><div class="t1-mica" aria-hidden="true"><div class="t1-mica-body"><div class="t1-mica-mouth"></div></div><span class="t1-mica-sparkle">✦</span></div><div><div class="t1-mica-label">MICA · YOUR ART GUIDE</div><p class="t1-mica-line">'+esc(message)+'</p></div></div>'}
function btn(label,act,variant){
 if(act==='t1-start'||act==='t1-hub')
  return '<button class="button '+(variant||'')+'" data-'+act+'>'+esc(label)+'</button>';
 return button(label,act,variant||'');
}
function picks(){return '<div class="t1-choices"><button class="t1-choice '+(prefs.mode==='family'?'selected':'')+'" data-t1-mode="family"><span>👨‍👩‍👧</span>Family team<small style="display:block;font-weight:500;margin-top:4px">Share discoveries together</small></button><button class="t1-choice '+(prefs.mode==='solo'?'selected':'')+'" data-t1-mode="solo"><span>🔎</span>Solo explorer<small style="display:block;font-weight:500;margin-top:4px">Play at your own pace</small></button></div>'+
 '<div class="t1-choose" role="group" aria-label="Age or challenge level">'+[['5-7','Little eyes'],['8-12','Detective'],['teen','Explorer+']].map(([id,label])=>'<button class="'+(prefs.age===id?'active':'')+'" data-t1-age="'+id+'">'+label+'</button>').join('')+'</div>'}
const INTRO_LANG={
 en:{hello:'Hello! I’m Mica, your spark of curiosity. I have something exciting to show you about this museum!',style:'CHOOSE YOUR ADVENTURE STYLE',task:'Explore the real art, spot clues and discover stories. First, meet Mica for a short animated introduction to the museum and how to explore it safely.',start:'✧ Meet Mica and start the adventure',foot:'Use MAP for the real museum floor plan. Artworks may not be on display, and museum rules should always be followed.',lang:'CHOOSE YOUR LANGUAGE'},
 fr:{hello:'Bonjour ! Je suis Mica, ton étincelle de curiosité. J’ai tant de choses à te montrer dans ce musée !',style:'CHOISIS TON STYLE D’AVENTURE',task:'Explore de vraies œuvres, suis des indices et découvre leurs histoires. D’abord, Mica te présente le musée et comment le visiter avec respect.',start:'✧ Rencontre Mica et commence l’aventure',foot:'Consulte CARTE pour le plan réel du musée. Certaines œuvres ne sont peut-être pas exposées.',lang:'CHOISIS TA LANGUE'},
 es:{hello:'¡Hola! Soy Mica, tu chispa de curiosidad. ¡Tengo muchas cosas que enseñarte en este museo!',style:'ELIGE TU ESTILO DE AVENTURA',task:'Explora obras de arte reales, sigue pistas y descubre sus historias. Primero, Mica te presenta el museo y cómo visitarlo con respeto.',start:'✧ Conoce a Mica y empieza la aventura',foot:'Usa MAPA para ver el plano real del museo. Algunas obras podrían no estar expuestas.',lang:'ELIGE TU IDIOMA'}
};
function intro(){
 const world=L[state.venue],l=INTRO_LANG[state.lang]||INTRO_LANG.en;
 const localized=typeof V7_OPENINGS!=='undefined'?V7_OPENINGS[state.lang]?.[state.venue]:null;
 return '<div class="t1-screen"><div class="t1-head"><div class="t1-overline">TRACE · ART BECOMES AN ADVENTURE</div><h2>'+esc(localized?.title||world.name)+'</h2><p>'+esc(localized?.intro||world.description)+'</p><div class="venueSelect"><button data-venue="mmfa" class="'+(state.venue==='mmfa'?'chosen':'')+'">MONTRÉAL · MMFA</button><button data-venue="pamm" class="'+(state.venue==='pamm'?'chosen':'')+'">MIAMI · PAMM</button></div></div>'+
 mascot(l.hello)+
 '<div class="t1-overline">'+esc(l.lang)+'</div><div class="v7-language">'+['en','fr','es'].map(code=>'<button data-lang="'+code+'" class="'+(state.lang===code?'active':'')+'" aria-pressed="'+(state.lang===code)+'">'+code.toUpperCase()+'</button>').join('')+'</div>'+
 '<div class="t1-overline">'+esc(l.style)+'</div>'+picks()+
 '<div class="t1-task">'+esc(l.task)+'</div>'+
 btn(l.start,'t1-start')+
 '<p class="tiny">'+esc(l.foot)+'</p></div>';
}
function hub(){
 const world=L[state.venue],arts=activeArts(),n=t1Found().length,done=allDone(),found=new Set(t1Found().map(a=>a.id));
 if(!arts.length)return '<div class="t1-screen"><h2 class="t1-h1">No artworks currently available</h2>'+mascot('The museum is updating this adventure. Check back after the administrator activates an artwork.')+'<p class="t1-task">No works are enabled in this museum’s visitor route. Earlier discoveries remain in My Finds.</p>'+btn('View my earlier discoveries','album','outline')+'</div>';
 const nodes=arts.map((a,i)=>{
  const index=A.findIndex(x=>x.id===a.id),node=world.nodes[index],isDone=found.has(a.id),open=isDone||i<=n+1;
  return '<button class="t1-island '+(isDone?'solved':open?'unlocked':'locked')+'" data-t1-open="'+index+'" '+(!open?'disabled':'')+'><b>'+node.symbol+'</b><span class="t1-island-text"><strong>'+esc(node.name)+'</strong><small>'+esc(node.subtitle)+(isDone?' · DISCOVERED':'')+(a.kind?' · '+esc(a.kind):'')+'</small></span><span class="t1-island-status">'+(isDone?'✓':open?'›':'🔒')+'</span></button>';
 }).join('');
 const companion=done?'You found every currently available artwork in this museum!':n===0?'Two mysteries are open. Find either to unlock the next.':n===1?'Your first discovery opened another path!':'Only '+(arts.length-n)+' currently available mysteries left!';
 const maxPairs=Math.min(10,arts.length*(arts.length-1)/2);
 return '<div class="t1-screen"><div class="t1-overline">ADVENTURE MAP · '+esc(world.name)+'</div><h2 class="t1-h1">Where shall we explore?</h2>'+paintProgress()+
 mascot(companion)+
 '<div class="t1-map"><div class="t1-map-head"><div class="t1-overline">A MAGICAL QUEST MAP</div><h3>'+arts.length+' works currently playable</h3></div><div class="t1-islands">'+nodes+'</div><p class="t1-legend">✦ New works are activated by museum administrators. The map shows adventures, not the real floor plan.</p></div>'+
 '<div class="t1-task">⌖ Plan a 3-stop visit or choose your own available artworks in the MAP tab. Room locations require staff confirmation.</div>'+
 (n>=2?'<div class="tb-bonus-card"><div class="t1-overline">✦ A SECRET CHALLENGE HAS OPENED</div><h3>Connect the Artworks</h3><p>Explore two completed works together, compare them through a sliding lens and collect an Art Connector badge.</p><p><strong>✧ '+(window.TRACE_BONUS?.links()?.length||0)+' saved connections · up to '+maxPairs+' curated pairs per museum</strong></p><button class="button" type="button" data-bonus-open>✧ Play the comparison bonus →</button></div>':'')+
 (done?'<div class="t1-complete"><h2 class="t1-h2">All available artworks discovered! ✦</h2><p class="t1-small">Come back when the museum activates more artworks. Your discoveries stay saved.</p>'+btn('Open my discovery passport','album')+'</div>':'')+
 '<div class="t1-team"><h3>How will you play?</h3>'+picks()+'<p class="t1-small">Switch modes without losing progress.</p></div>'+
 btn('⌖ Plan my museum route','map','outline')+btn('View my passport','album','outline')+
 '<button class="button ghost" type="button" data-t1-replay>'+esc(window.TRACE_WELCOME?.translations[state.lang]?.replay||'Watch Mica’s welcome again')+'</button></div>';
}

function roleMessage(){
 if(prefs.mode!=='family')return '<div class="t1-role">🔎 Solo explorer: notice one tiny detail in the artwork before scanning. You can play at your own pace.</div>';
 return window.TRACE_COOP?.render(A[state.current]) || '<div class="t1-role">Look together, then scan the artwork.</div>';
}

function clue(){
 const a=A[state.current];if(!a||!activeArts().some(x=>x.id===a.id))return hub();
 const node=L[state.venue].nodes[state.current],focus=a.id==='mmfa-marrel'?'18% 14%':a.focus;
 if(!a)return hub();
 if(C.id!==a.id){C.id=a.id;C.points=[];C.teamCount=0;}
 let txt=prefs.age==='5-7'?'Look carefully at the little picture. Can you find its matching artwork?':prefs.age==='teen'?'Investigate the subject, composition and detail, then locate the matching work.':'Search for the artwork containing this unusual detail. Look at the real artwork before the phone.';
 return '<div class="t1-screen"><div class="t1-overline">MYSTERY '+(state.current+1)+' OF '+A.length+' · '+esc(node.subtitle)+'</div><h2 class="t1-h1">'+esc(node.name)+'</h2>'+paintProgress()+
 mascot(node.friend)+
 '<div class="t1-task">'+txt+'</div>'+
 '<div class="v7-fragment"><img src="'+img(a)+'" style="object-position:'+focus+'" alt="Mystery fragment from selected artwork"><div class="v7-cover">FIND THIS DETAIL</div></div>'+
 '<div class="t1-team"><div class="t1-overline">YOUR CLUE</div><h3>'+esc(a.chapter)+'</h3><p class="t1-small">'+esc(v7field(a,'clue'))+'</p></div>'+roleMessage()+
 (a.previewOnly?'<div class="te-notice"><strong>Visual identification preview</strong><p>Automatic recognition is not yet validated for this work. Observe it in person and compare with the official collection record. The work may not be on display.</p><a href="'+a.url+'" target="_blank" rel="noopener noreferrer">Official museum artwork record ↗</a></div>': '')+
 (a.reference?btn('⌾ Scan artwork with camera','scan'):btn('⌾ Take one photo or compare visually','manual-review'))+
 btn('⌖ Help me find the gallery','map','outline')+
 (state.hints.includes(a.id)?'<div class="t1-task">✧ '+esc(a.hint)+'</div>'+
 btn('👁 Camera not working? Compare visually','manual-review','outline'):btn('✧ Ask Mica for a hint','hint','ghost'))+
 btn('← Back to adventure map','t1-hub','ghost')+
 (a.previewOnly?'':'<details class="v7-cms"><summary style="font-size:12px;cursor:pointer;font-weight:800">Demo testing tools</summary><p class="t1-small">This artwork might not be on display. Test with the published collection image on a second screen, or use the simulated image test below.</p>'+
 btn('Test matching with a reference','sample:'+a.id,'outline')+'</details>')+
 '<p class="tiny">Museum collection image rights belong to their respective holders. <a target="_blank" rel="noopener noreferrer" href="'+a.url+'">Collection record ↗</a></p></div>';
}
function puzzleIntro(a){return '<div class="t1-overline">CREATE, EXPERIMENT, DISCOVER · '+esc(a.artist)+'</div><h2 class="t1-h1">'+esc(a.chapter)+'</h2>'+
 mascot('Great detective work! Now try something the artist might have tried. This is a hands-on challenge, not a memory quiz.')+
 '<div class="t1-task">👀 Look at the physical artwork first. Discuss one artistic choice with someone nearby, or think about it quietly.</div>'}
function puzzle(){
 const a=A[state.current];if(!a||!activeArts().some(x=>x.id===a.id))return hub();
 if(C.id!==a.id||C.lastPuzzleId!==a.id){C.id=a.id;C.lastPuzzleId=a.id;C.progress=0;C.points=[];C.done=false;C.chosen=null;C.xy={x:78,y:77};}
 if(window.TRACE_EXTRA?.has(a.id))return window.TRACE_EXTRA.game(a,C);
 let content='';
 if(a.id==='mmfa-marrel')content='<div class="t1-puzzle"><h3>Reveal the copper beneath</h3><p class="t1-small">Marrel painted on a smooth copper surface. Rub the mist away with your finger to reveal its warm shimmer.</p>'+
 '<div class="t1-surface t1-scratch" id="t1-scratch"><canvas id="t1-copper" width="640" height="410" aria-label="Rub to reveal the copper surface"></canvas></div>'+
 '<div class="t1-task" id="t1-status">Reveal at least half the hidden surface, or choose the accessible alternative.</div></div>';
 else if(a.id==='mmfa-witte')content='<div class="t1-puzzle"><h3>Build a room with perspective</h3><p class="t1-small">Drag the warm circle into the small green target. When the lines meet at a vanishing point, the room looks deep.</p>'+
 '<div class="t1-surface t1-perspective" id="t1-perspective"><svg viewBox="0 0 300 200" aria-hidden="true"><path d="M0 195L150 90L300 195 M0 0L150 90L300 0 M55 0L150 90L245 0 M55 200L150 90L245 200" fill="none" stroke="#6e8c74" stroke-width="2"/><rect x="102" y="42" width="96" height="101" fill="none" stroke="#496854" stroke-width="4"/><rect x="133" y="72" width="34" height="40" fill="#ede4cb" stroke="#577264" stroke-width="2"/></svg>'+
 '<div class="t1-target"></div><div class="t1-marker" role="slider" tabindex="0" aria-label="Vanishing point" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="left:'+C.xy.x+'%;top:'+C.xy.y+'%"></div></div><div class="t1-task" id="t1-status">Move the point closer to the centre. You can also use arrow keys or the buttons below.</div>'+
 '<div class="t1-choose"><button data-t1-move="left">←</button><button data-t1-move="up">↑</button><button data-t1-move="down">↓</button><button data-t1-move="right">→</button></div></div>';
 else if(a.id==='mmfa-fortin')content='<div class="t1-puzzle"><h3>Make the storm glow</h3><p class="t1-small">Fortin used contrast between dark landscapes and bright skies. Slide the light until the stormy sky feels luminous.</p>'+
 '<div class="t1-surface t1-fortin" id="t1-storm" style="--sky:'+(C.progress/100)+'"></div><label class="t1-small" for="t1-light">Sky brightness · <b id="t1-reading">'+C.progress+'%</b></label>'+
 '<input id="t1-light" class="t1-slider" type="range" min="0" max="100" step="5" value="'+C.progress+'" aria-label="Adjust sky brightness"><div class="t1-task">Move the slider past 75% to unlock the contrast technique.</div></div>';
 else if(a.id==='pamm-masks')content='<div class="t1-puzzle"><h3>Decode the visual language</h3><p class="t1-small">Torres-García organized symbols into a grid. Create this code in order: <b>MASK → FISH → GRID</b>.</p>'+
 '<div class="t1-decode">'+[0,1,2].map((_,i)=>'<span>'+(C.points[i]||'?')+'</span>').join('')+'</div>'+
 '<div class="t1-symbols"><button data-t1-symbol="🎭" aria-label="Mask">🎭</button><button data-t1-symbol="🐟" aria-label="Fish">🐟</button><button data-t1-symbol="▦" aria-label="Grid">▦</button><button data-t1-symbol="☼" aria-label="Sun">☼</button><button data-t1-symbol="⚓" aria-label="Anchor">⚓</button><button data-t1-symbol="★" aria-label="Star">★</button></div>'+
 '<div class="t1-task" id="t1-status">Choose the first symbol. Tap in the right order to complete the code.</div></div>';
 else if(a.id==='pamm-delano')content='<div class="t1-puzzle"><h3>Move the photographer’s eye</h3><p class="t1-small">Explore this photograph with a movable spotlight. Notice the winding road and how it connects the houses.</p>'+
 '<div class="t1-surface t1-viewfinder" id="t1-view"><img src="'+img(a)+'" alt="Delano photograph to explore"><div class="t1-spotlight" style="--x:'+C.xy.x+'%;--y:'+C.xy.y+'%"></div></div>'+
 '<div class="t1-choose"><button data-t1-move="left">← Move</button><button data-t1-move="up">↑ Move</button><button data-t1-move="down">↓ Move</button><button data-t1-move="right">→ Move</button></div>'+
 '<p class="t1-small">What connects the houses in this photo?</p>'+
 '<div class="t1-choices"><button class="t1-choice" data-t1-photo-choice="0">The winding road</button><button class="t1-choice" data-t1-photo-choice="1">A painted grid</button></div>'+
 '<div class="t1-task" id="t1-status">Move the spotlight to investigate, then choose your answer.</div></div>';
 else content='<div class="t1-puzzle"><h3>Make your own visual alphabet</h3><p class="t1-small">A graphite pencil gave Torres-García a whole world of symbols. Choose three signs to build your own message.</p>'+
 '<div class="t1-symbol-grid">'+[0,1,2].map((_,i)=>'<button data-t1-cell="'+i+'" aria-label="Symbol cell '+(i+1)+'">'+(C.points[i]||'＋')+'</button>').join('')+'</div>'+
 '<div class="t1-picker">'+['⌂','☼','◎','≋','△','♢','✺'].map(x=>'<button data-t1-place="'+x+'" aria-label="Add symbol '+x+'">'+x+'</button>').join('')+'</div>'+
 '<div class="t1-task" id="t1-status">Fill all three panels. Your original symbol combination will be saved locally in your creative journal.</div></div>';
 return '<div class="t1-screen">'+paintProgress()+puzzleIntro(a)+content+
 '<button class="button" id="t1-finish" data-t1-finish disabled>Finish the creative challenge ✦</button>'+
 '<button class="button ghost" data-t1-assist>Use a guided alternative</button>'+
 btn('Read this artwork’s story','v7-story','outline')+
 '<p class="tiny">Visual activities are original interactive interpretations inspired by the works, not reconstructions of the artists’ actual methods. Alternate completion is available for accessibility.</p></div>';
}
function success(){
 const a=A[state.current],win=allDone(),node=L[state.venue].nodes[state.current];
 return '<div class="t1-screen"><div class="t1-complete">'+mascot(win?'We recovered every power! Now the museum is full of possibilities.':'You did it! Your eyes and imagination helped restore another piece of the lens.')+
 '<div class="t1-overline">POWER UNLOCKED ✦</div><h2 class="t1-h1">'+esc(a.power)+'</h2><p class="t1-small">'+esc(node.subtitle)+'</p>'+
 '<div class="t1-storyboard">'+t1Found().map(x=>'<span>'+v7meta(x).symbol+' '+esc(x.power)+'</span>').join('')+'</div>'+
 (win?'<h3 class="t1-h2">Current adventure complete!</h3><p class="t1-small">You found all available works. New ones may appear when the museum updates the route.</p>':'<p class="t1-small">There are '+(activeArts().length-t1Found().length)+' available mysteries left. The map may have changed!</p>')+'</div>'+
 btn(win?'View the completed adventure map':'Choose my next mystery','t1-hub')+
 btn('See my discoveries','album','outline')+
 '<p class="tiny">Your creativity and discoveries stay on this device.</p></div>';
}
function renderGame(v){
 if(state.tab!=='quest')return false;
 if(state.stage==='bonus'){if(window.TRACE_BONUS?.render(v))return true;v.innerHTML=hub();return true}
 if(state.stage==='intro'){v.innerHTML=intro();return true}
 if(state.stage==='welcome'){v.innerHTML=window.TRACE_WELCOME?.render()||intro();return true}
 if(state.stage==='hub'){v.innerHTML=hub();return true}
 if(state.stage==='clue'){v.innerHTML=clue();window.TRACE_COOP?.install();return true}
 if(state.stage==='puzzle'){v.innerHTML=puzzle();if(!window.TRACE_EXTRA?.has(A[state.current]?.id))installPuzzle();return true}
 if(state.stage==='success'){v.innerHTML=success();return true}
 if(state.stage==='complete'||state.current>=A.length){v.innerHTML=hub();return true}
 return false;
}
function openWork(i){
 const art=A[i],active=activeArts(),position=active.findIndex(a=>a.id===art?.id),n=t1Found().length;
 if(!art||position<0||!(position<=n+1||state.found.includes(art.id)))return;
 stopCamera();state.current=i;state.quizError=false;state.reviewId=null;state.scanImage=null;state.result=null;C.id=null;C.lastPuzzleId=null;C.done=false;C.progress=0;C.points=[];C.xy={x:78,y:77};stage(state.found.includes(A[i].id)?'clue':'clue');
}
function finishPuzzle(assisted){
 if(state.stage!=='puzzle'||!activeArts().some(a=>a.id===A[state.current]?.id))return;
 if(!assisted&&!C.done)return;
 const a=A[state.current];
 if(!state.found.includes(a.id))state.found.push(a.id);
 if(a.id==='pamm-grid')prefs.symbols[a.id]=C.points.slice();
 persist();stage('success');
}
function setDone(message){C.done=true;const el=document.getElementById('t1-finish');if(el)el.disabled=false;const label=document.getElementById('t1-status');if(label)label.textContent=message||'Discovery unlocked. Finish the creative challenge!'}
function installPuzzle(){
 const a=A[state.current];if(!a||state.stage!=='puzzle')return;
 if(a.id==='mmfa-marrel'){
  const can=document.getElementById('t1-copper');if(!can)return;
  const c=can.getContext('2d');c.fillStyle='#dde6e0';c.fillRect(0,0,can.width,can.height);
  c.fillStyle='#96a79a';c.font='bold 37px Georgia';c.textAlign='center';c.fillText('Rub to uncover the metal',320,200);
  c.globalCompositeOperation='destination-out';let last=null,travel=0;
  function pt(e){const rect=can.getBoundingClientRect();return {x:(e.clientX-rect.left)/rect.width*can.width,y:(e.clientY-rect.top)/rect.height*can.height}}
  can.addEventListener('pointerdown',e=>{can.setPointerCapture(e.pointerId);last=pt(e);c.beginPath();c.arc(last.x,last.y,40,0,Math.PI*2);c.fill();travel+=40});
  can.addEventListener('pointermove',e=>{if(!last)return;const p=pt(e);c.lineCap='round';c.lineJoin='round';c.lineWidth=72;c.beginPath();c.moveTo(last.x,last.y);c.lineTo(p.x,p.y);c.stroke();travel+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(travel>750)setDone('You uncovered the warm copper beneath the painted surface!')});
  for(const evt of ['pointerup','pointercancel','lostpointercapture'])can.addEventListener(evt,()=>{last=null});
 }else if(a.id==='mmfa-witte'){
  const box=document.getElementById('t1-perspective'),marker=box?.querySelector('.t1-marker');if(!box||!marker)return;
  marker.addEventListener('pointerdown',e=>{marker.setPointerCapture(e.pointerId)});
  marker.addEventListener('pointermove',e=>{if(!marker.hasPointerCapture(e.pointerId))return;moveXY((e.clientX-box.getBoundingClientRect().left)/box.clientWidth*100,(e.clientY-box.getBoundingClientRect().top)/box.clientHeight*100)});
  marker.addEventListener('keydown',e=>{const change={ArrowUp:[0,-4],ArrowDown:[0,4],ArrowLeft:[-4,0],ArrowRight:[4,0]}[e.key];if(change){e.preventDefault();moveXY(C.xy.x+change[0],C.xy.y+change[1])}});
 }
 else if(a.id==='pamm-delano'){
  const box=document.getElementById('t1-view');if(!box)return;
  box.addEventListener('pointerdown',e=>{box.setPointerCapture(e.pointerId);moveXY((e.clientX-box.getBoundingClientRect().left)/box.clientWidth*100,(e.clientY-box.getBoundingClientRect().top)/box.clientHeight*100)});
  box.addEventListener('pointermove',e=>{if(!box.hasPointerCapture(e.pointerId))return;moveXY((e.clientX-box.getBoundingClientRect().left)/box.clientWidth*100,(e.clientY-box.getBoundingClientRect().top)/box.clientHeight*100)});
 }
}
function moveXY(x,y){
 C.xy.x=Math.min(95,Math.max(5,x));C.xy.y=Math.min(95,Math.max(5,y));
 if(A[state.current]?.id==='mmfa-witte'){
  const dot=document.querySelector('.t1-marker');if(dot){dot.style.left=C.xy.x+'%';dot.style.top=C.xy.y+'%';dot.setAttribute('aria-valuenow',String(Math.round((100-Math.hypot(C.xy.x-50,C.xy.y-46))/100*100)))}
  if(Math.hypot(C.xy.x-50,C.xy.y-46)<12)setDone('Your lines now converge toward the vanishing point. That creates depth!');
 }else if(A[state.current]?.id==='pamm-delano'){
  C.progress++;const spot=document.querySelector('.t1-spotlight');if(spot){spot.style.setProperty('--x',C.xy.x+'%');spot.style.setProperty('--y',C.xy.y+'%')}
  if(C.progress>=3&&C.chosen===0)setDone('You followed the road connecting the houses. Every viewpoint tells a story!');
 }
}
function event(e){
 const click=e.target.closest('[data-t1-replay],[data-t1-mode],[data-t1-age],[data-t1-open],[data-t1-start],[data-t1-hub],[data-t1-move],[data-t1-symbol],[data-t1-photo-choice],[data-t1-place],[data-t1-cell],[data-t1-finish],[data-t1-assist]');
 if(click){e.stopImmediatePropagation();e.preventDefault();const d=click.dataset;
  if(d.t1Replay!==undefined){window.TRACE_WELCOME?.enter();return}
  if(d.t1Mode){settingMode(d.t1Mode);return}
  if(d.t1Age){settingAge(d.t1Age);return}
  if(d.t1Start!==undefined){if(window.TRACE_WELCOME)window.TRACE_WELCOME.enter();else stage('hub');return}
  if(d.t1Hub!==undefined){window.TRACE_WELCOME?.cleanup();stage('hub');return}
  if(d.t1Open!==undefined){openWork(Number(d.t1Open));return}
  if(d.t1Move){const q={left:[-8,0],up:[0,-8],down:[0,8],right:[8,0]}[d.t1Move];if(q)moveXY(C.xy.x+q[0],C.xy.y+q[1]);return}
  if(d.t1Symbol){
    const wanted=['🎭','🐟','▦'];
    if(d.t1Symbol===wanted[C.points.length]){C.points.push(d.t1Symbol);if(C.points.length===3)setDone('You built a visual language using a mask, a fish and a grid!');else render()}
    else {C.points=[];render();const m=document.getElementById('t1-status');if(m)m.textContent='Try the sequence again: mask, fish, grid.'}
    return;
  }
  if(d.t1PhotoChoice!==undefined){C.chosen=Number(d.t1PhotoChoice);if(C.chosen===0&&C.progress>=3)setDone('Great! The winding road leads through the houses.');else {const m=document.getElementById('t1-status');if(m)m.textContent=C.chosen===0?'Correct! Move the spotlight three times to finish.':'Look for the winding road and try again.'}return}
  if(d.t1Place){if(C.points.length<3)C.points.push(d.t1Place);if(C.points.length===3){setDone('You created your own three-symbol alphabet!');const cells=document.querySelectorAll('[data-t1-cell]');cells.forEach((x,i)=>x.textContent=C.points[i]);}else render();return}
  if(d.t1Cell!==undefined){C.points.splice(Number(d.t1Cell),1);C.done=false;render();return}
  if(d.t1Finish!==undefined){finishPuzzle(false);return}
  if(d.t1Assist!==undefined){if(confirm('Use the guided alternative to complete this creative activity? The story and discovery will still be available.'))finishPuzzle(true);return}
 }
}
document.addEventListener('input',e=>{
 if(e.target?.id!=='t1-light'||A[state.current]?.id!=='mmfa-fortin')return;
 C.progress=Number(e.target.value);
 const sky=document.getElementById('t1-storm'),reading=document.getElementById('t1-reading');
 if(sky)sky.style.setProperty('--sky',String(C.progress/100));
 if(reading)reading.textContent=C.progress+'%';
 if(C.progress>=75)setDone('The bright sky now contrasts with the dark land, creating a dramatic storm!');
});
document.addEventListener('click',event,true);
window.TRACE_V1={render:renderGame,finishPuzzle,openWork,prefs,hub,moveXY,get puzzle(){return C},get allDone(){return allDone()}};
render();
})();