/* TRACE Family Co-op v1.2: six distinct, short, tactile museum challenges. */
(function(){
'use strict';
const KEY='trace-family-discoveries-v1';
const TASKS={
'mmfa-marrel':{kind:'polish',title:'Reveal the hidden creature',look:'Find a tiny animal hiding among the flowers. Show someone where you found it.',symbol:'🦎',secret:'The little lizard is hiding in the bouquet!',question:'If the lizard could talk, what might it say?',choices:['These flowers are my secret jungle!','Shhh! I am hiding in plain sight.'],lesson:'Jacob Marrel painted intricate details on a smooth copper surface.'},
'mmfa-witte':{kind:'perspective',title:'Open the secret doorway',look:'Follow the doorways with your eyes. Where do the lines seem to meet?',symbol:'🚪',secret:'The lines meet at a vanishing point and make the room look deep!',question:'Where would you take your teammate through this doorway?',choices:['To a quiet room filled with music','To a hidden room beyond the painting'],lesson:'Emanuel de Witte used perspective to create the illusion of depth.'},
'mmfa-fortin':{kind:'light',title:'Wake up the glowing sky',look:'Point out the darkest and brightest areas of the painting to one another.',symbol:'☀️',secret:'You made the sky shine against a dark city!',question:'What do you think will happen next in this landscape?',choices:['A thunderstorm will begin','The sunlight will break through'],lesson:'Marc-Aurèle Fortin often dramatized scenes with light and dark contrast.'},
'pamm-masks':{kind:'code',title:'Decode the three symbols',look:'Look for faces and symbols organized into a grid. Show a detail to your teammate.',symbol:'🎭',secret:'The mask, fish and grid make a visual code!',question:'If the shapes were a message, what would it say?',choices:['Welcome to a world of symbols!','Every shape has its own secret.'],lesson:'Joaquín Torres-García used simple signs and structures to form a visual language.'},
'pamm-delano':{kind:'spotlight',title:'Follow the winding road',look:'Find the road in the photograph. How does it connect the houses?',symbol:'🛤️',secret:'You followed the path through the picture!',question:'If you walked along that road, where would you go?',choices:['To visit one of the houses','Beyond the hill on an adventure'],lesson:'Jack Delano used composition to guide the viewer through his photograph.'},
'pamm-grid':{kind:'glyph',title:'Build a secret message',look:'Find three different marks in the drawing and show them to your teammate.',symbol:'✎',secret:'Three marks became your own visual alphabet!',question:'What does your new secret alphabet mean?',choices:['A place to call home','An invitation to explore'],lesson:'Torres-García could create a symbolic language with just a pencil and a few lines.'}
};
const TYPES={polish:'Rub to reveal',perspective:'Move the doorway',light:'Slide the light',code:'Tap a secret code',spotlight:'Explore with a spotlight',glyph:'Stamp three symbols'};
let seals={};
try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object')seals=v}catch(e){}
const S={id:null,phase:'invite',replay:false,done:false,steps:0,value:0,point:{x:82,y:76},symbols:[],draw:0};
const e=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const current=()=>state.tab==='quest'&&state.stage==='clue'?A[state.current]:null;
function savedChoice(id){return Number.isInteger(seals[id]?.choice)?seals[id].choice:null}
function save(){try{localStorage.setItem(KEY,JSON.stringify(seals))}catch(err){console.warn('Cannot save team seal',err)}}
function reset(id){if(S.id!==id){S.id=id;S.phase='invite';S.replay=false;S.done=false;S.steps=0;S.value=0;S.draw=0;S.point={x:82,y:76};S.symbols=[]}}
function appRender(){if(typeof window.__traceAppRender==='function')window.__traceAppRender()}
function actions(){return '<div class="tf-actions">'+
 (S.done?'<button type="button" class="tf-main-btn" data-c2-next>✦ Secret revealed! Choose your story →</button>':'<button type="button" class="tf-small-btn" data-c2-help>Show the secret instead</button>')+
 '<button type="button" class="tf-small-btn" data-c2-back>← Back</button></div>'}
function intro(t){
 return '<h3>Look together. Play together.</h3><p>Take turns with the phone. There are no assigned roles or points to count.</p>'+
 '<div class="tf-steps"><span><b>1</b> Look</span><span><b>2</b> '+e(TYPES[t.kind])+'</span><span><b>✦</b> Team seal</span></div>'+
 '<div class="tf-prompt"><span class="tf-prompt-symbol">👀</span><div><strong>Look at the actual artwork first</strong><p>'+e(t.look)+'</p></div></div>'+
 '<button type="button" class="tf-main-btn" data-c2-start>We looked! Let’s play ✨</button>'+
 '<p class="tf-foot">This optional activity helps families observe art together. Scan whenever you like.</p>';
}
function play(t,a){
 const begin='<div class="tf-step-name">STEP 1 · YOUR INTERACTIVE DISCOVERY</div><h3>'+e(t.title)+'</h3>';
 let body='';
 if(t.kind==='polish')body='<p>Take turns polishing the silver mist with your finger. Watch what appears underneath!</p>'+
 '<div class="tf-rub"><div class="tf-rub-inner"><span aria-hidden="true">🦎</span><strong>The copper secret is revealed!</strong></div><canvas width="640" height="380" id="c2-polish" aria-label="Rub the covered surface with your finger"></canvas></div>';
 if(t.kind==='perspective')body='<p><strong>Drag the gold circle</strong> into the dashed target where the room lines meet. Use the arrow buttons if you prefer.</p>'+
 '<div class="c2-perspective" id="c2-perspective"><svg viewBox="0 0 300 190" aria-hidden="true"><rect x="0" y="0" width="300" height="190" fill="#dce7d7"/><path d="M0 0L150 90L300 0 M0 190L150 90L300 190 M52 0L150 90L248 0 M52 190L150 90L248 190" fill="none" stroke="#7e9885" stroke-width="3"/><rect x="111" y="39" width="78" height="103" fill="#f7edd9" stroke="#6c8976" stroke-width="4"/><rect x="130" y="60" width="40" height="53" fill="#ddd0aa" stroke="#6c8976" stroke-width="2"/></svg><span class="c2-perspective-target" aria-hidden="true"></span><button type="button" id="c2-point" class="c2-point" aria-label="Move gold circle into target" style="left:'+S.point.x+'%;top:'+S.point.y+'%">✦</button></div>'+
 '<div class="tf-actions"><button class="tf-small-btn" data-c2-arrow="left">← Left</button><button class="tf-small-btn" data-c2-arrow="up">↑ Up</button><button class="tf-small-btn" data-c2-arrow="down">↓ Down</button><button class="tf-small-btn" data-c2-arrow="right">→ Right</button></div>';
 if(t.kind==='light')body='<p><strong>Slide the light</strong> until the dark city is contrasted by a glowing sky.</p>'+
 '<div class="c2-storm" id="c2-storm" style="--light:'+S.value/100+'"><div class="c2-sky">☁️ ☁️</div><div class="c2-town">▂▃▅▂▅▃▂</div></div>'+
 '<label for="c2-light" class="tf-step-name">Brightness: <span id="c2-value">'+S.value+'</span>%</label><input class="c2-slider" id="c2-light" type="range" min="0" max="100" value="'+S.value+'" step="5" aria-label="Change sky brightness">';
 if(t.kind==='code')body='<p>Take turns tapping the symbols in this order: <strong>MASK → FISH → GRID</strong>.</p>'+
 '<div class="c2-code-slots">'+[0,1,2].map(i=>'<span>'+e(S.symbols[i]||'·')+'</span>').join('')+'</div>'+
 '<div class="c2-code">'+['🎭','☼','🐟','★','▦','⚓'].map(x=>'<button type="button" data-c2-code="'+x+'" aria-label="Select '+e(x)+'">'+x+'</button>').join('')+'</div>';
 if(t.kind==='spotlight')body='<p>Move the spotlight across the photograph. Explore <strong>three stops along the winding road</strong>.</p>'+
 '<div class="c2-photo" id="c2-photo"><div class="c2-abstract-road" role="img" aria-label="An original illustration of a winding road and simple houses, not a reproduction of the mystery artwork"><svg aria-hidden="true" viewBox="0 0 320 185" preserveAspectRatio="xMidYMid slice"><path d="M0 0H320V185H0Z" fill="#7c9b8d"/><path d="M0 80Q80 72 150 85T320 70V185H0Z" fill="#a4ab74"/><path d="M60 185Q104 155 167 130T280 79" stroke="#e6dac3" stroke-width="30" fill="none"/><path d="M60 185Q104 155 167 130T280 79" stroke="#f4e8d0" stroke-width="3" fill="none"/><path d="M66 91L86 69 106 91V115H66Z M218 74L239 57 260 74V99H218Z" fill="#b95952"/><path d="M58 91L86 64 113 91 M211 74L239 52 268 74" fill="none" stroke="#5e514d" stroke-width="8"/><path d="M79 100H90 M230 86H242" stroke="#f9e6ba" stroke-width="8"/></svg></div><div class="c2-spot" style="--x:'+([18,49,80][Math.min(S.steps,2)])+'%;--y:'+([75,48,27][Math.min(S.steps,2)])+'%"></div><div class="c2-step-label">Stop '+Math.min(3,S.steps+1)+' of 3</div></div>'+
 '<div class="c2-path-steps">'+['🏠 First house','🛤️ Follow the road','🏡 Beyond the hill'].map((x,i)=>'<button type="button" data-c2-stop="'+i+'" '+(i!==S.steps||S.done?'disabled':'')+'>'+x+'</button>').join('')+'</div>';
 if(t.kind==='glyph')body='<p><strong>Stamp three different symbols</strong> to create a message only your family understands.</p>'+
 '<div class="c2-glyph-grid">'+[0,1,2].map(i=>'<span>'+e(S.symbols[i]||'＋')+'</span>').join('')+'</div>'+
 '<div class="c2-glyph-options">'+['⌂','☼','◎','△','≋','♢','✺'].map(x=>'<button type="button" data-c2-glyph="'+x+'" aria-label="Stamp '+e(x)+'">'+x+'</button>').join('')+'</div>'+
 '<button type="button" class="tf-small-btn" data-c2-clear>Clear symbols</button>';
 return begin+body+'<p id="c2-status" role="status" class="tf-status">'+(S.done?'✦ '+e(t.secret):'Your next move will reveal the secret.')+'</p>'+actions();
}
function result(t){
 const choice=savedChoice(S.id);
 return '<div class="tf-result"><div class="tf-seal">✦</div><div><strong>Team Discovery earned!</strong><p>'+e(t.secret)+'</p><p><strong>Your family story:</strong> “'+e(t.choices[choice])+'”</p></div></div>'+
 '<div class="tf-actions"><button type="button" class="tf-small-btn" data-c2-again>Try this challenge again</button></div>'+
 '<p class="tf-foot">Your Team Discovery seal appears in My Finds. Continue with the artwork scan when you’re ready.</p>';
}
function render(a){
 if(!a||!TASKS[a.id])return '';
 reset(a.id);const t=TASKS[a.id],choice=savedChoice(a.id);
 const top='<section class="tf-mission" aria-label="Optional family discovery game"><div class="tf-brow"><span>✦ MICA’S FAMILY DISCOVERY</span><span>OPTIONAL · ABOUT 1 MIN</span></div>';
 if(choice!==null&&!S.replay&&S.phase!=='play'&&S.phase!=='story')return top+result(t)+'</section>';
 if(S.phase==='invite')return top+intro(t)+'</section>';
 if(S.phase==='play')return top+play(t,a)+'</section>';
 if(S.phase==='story')return top+'<div class="tf-step-name">STEP 2 · INVENT A STORY TOGETHER</div><div class="tf-big-symbol" aria-hidden="true">'+t.symbol+'</div><h3>'+e(t.question)+'</h3><p>Tell your teammate what you imagine. Tap either answer. <strong>Both are good stories!</strong></p>'+
 '<div class="tf-story-choices">'+t.choices.map((c,i)=>'<button type="button" data-c2-choice="'+i+'"><span>✧</span>'+e(c)+'</button>').join('')+'</div>'+
 '<div class="tf-actions"><button type="button" class="tf-small-btn" data-c2-back>← Back to the mini-game</button></div></section>';
 return top+intro(t)+'</section>';
}
function markDone(){
 if(S.done)return;S.done=true;
 const status=document.getElementById('c2-status');if(status)status.textContent='✦ '+TASKS[S.id].secret;
 const buttons=document.querySelector('.tf-mission .tf-actions:last-child');
 if(buttons&&buttons.querySelector('[data-c2-help]'))buttons.innerHTML=actions().replace(/^<div class="tf-actions">|<\/div>$/g,'');
 const area=document.querySelector('.tf-mission');if(area)area.classList.add('c2-won');
}
function movePoint(x,y){
 S.point={x:Math.max(5,Math.min(95,x)),y:Math.max(5,Math.min(95,y))};
 const dot=document.getElementById('c2-point');
 if(dot){dot.style.left=S.point.x+'%';dot.style.top=S.point.y+'%'}
 if(Math.hypot(S.point.x-50,S.point.y-47)<13)markDone();
}
function install(){
 if(S.phase!=='play'||S.done)return;
 const a=current();if(!a||a.id!==S.id)return;
 if(TASKS[a.id].kind==='polish'){
  const c=document.getElementById('c2-polish');if(!c)return;const g=c.getContext('2d');
  g.fillStyle='#e6ede7';g.fillRect(0,0,640,380);g.fillStyle='#8ea69b';g.font='bold 35px Georgia';g.textAlign='center';g.fillText('POLISH THE COPPER',320,180);
  g.globalCompositeOperation='destination-out';let last=null;
  const point=ev=>{const r=c.getBoundingClientRect();return {x:(ev.clientX-r.left)/r.width*640,y:(ev.clientY-r.top)/r.height*380}};
  c.addEventListener('pointerdown',ev=>{c.setPointerCapture(ev.pointerId);last=point(ev);g.beginPath();g.arc(last.x,last.y,40,0,Math.PI*2);g.fill();S.draw+=30});
  c.addEventListener('pointermove',ev=>{if(!last||S.done)return;const p=point(ev);g.strokeStyle='#000';g.lineWidth=86;g.lineCap='round';g.beginPath();g.moveTo(last.x,last.y);g.lineTo(p.x,p.y);g.stroke();S.draw+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(S.draw>=800){g.clearRect(0,0,640,380);markDone()}});
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>c.addEventListener(t,()=>last=null));
 }
 if(TASKS[a.id].kind==='perspective'){
  const dot=document.getElementById('c2-point'),box=document.getElementById('c2-perspective');
  if(!dot||!box)return;
  dot.addEventListener('pointerdown',ev=>dot.setPointerCapture(ev.pointerId));
  dot.addEventListener('pointermove',ev=>{
   if(!dot.hasPointerCapture(ev.pointerId))return;
   const r=box.getBoundingClientRect();movePoint((ev.clientX-r.left)/r.width*100,(ev.clientY-r.top)/r.height*100);
  });
  dot.addEventListener('keydown',ev=>{const changes={ArrowLeft:[-6,0],ArrowRight:[6,0],ArrowUp:[0,-6],ArrowDown:[0,6]};if(!changes[ev.key])return;ev.preventDefault();movePoint(S.point.x+changes[ev.key][0],S.point.y+changes[ev.key][1]);});
 }
}
function handleClick(ev){
 const el=ev.target.closest('[data-c2-start],[data-c2-back],[data-c2-next],[data-c2-help],[data-c2-again],[data-c2-choice],[data-c2-code],[data-c2-arrow],[data-c2-stop],[data-c2-glyph],[data-c2-clear]');
 if(!el||!current())return;
 ev.preventDefault();ev.stopImmediatePropagation();
 const d=el.dataset,t=TASKS[current().id];
 if(d.c2Start!==undefined){S.phase='play';S.done=false;S.steps=0;S.value=0;S.draw=0;S.symbols=[];S.point={x:82,y:76};appRender();return}
 if(d.c2Back!==undefined){S.phase=S.phase==='story'?'play':'invite';appRender();return}
 if(d.c2Again!==undefined){S.phase='invite';S.replay=true;S.done=false;appRender();return}
 if(d.c2Help!==undefined){markDone();return}
 if(d.c2Next!==undefined){if(S.done){S.phase='story';appRender()}return}
 if(d.c2Choice!==undefined&&S.phase==='story'){const n=Number(d.c2Choice);if(!(n===0||n===1))return;
  if(savedChoice(current().id)===null){seals[current().id]={choice:n};save()}
  S.phase='done';S.replay=false;appRender();return}
 if(S.phase!=='play'||S.done)return;
 if(d.c2Arrow){const moves={left:[-9,0],right:[9,0],up:[0,-9],down:[0,9]};const delta=moves[d.c2Arrow];if(delta)movePoint(S.point.x+delta[0],S.point.y+delta[1]);return}
 if(d.c2Code!==undefined){
  const wanted=['🎭','🐟','▦'],symbol=d.c2Code;
  if(symbol===wanted[S.symbols.length])S.symbols.push(symbol);else S.symbols=[];
  if(S.symbols.length===3){document.querySelectorAll('.c2-code-slots span').forEach((x,i)=>x.textContent=S.symbols[i]);markDone()}
  else{appRender();const m=document.getElementById('c2-status');if(m&&symbol!==wanted[S.symbols.length-1])m.textContent='Try mask, fish, grid in that order.'}
  return;
 }
 if(d.c2Stop!==undefined){if(Number(d.c2Stop)!==S.steps)return;S.steps++;
  if(S.steps===3)markDone();
  else{const spot=document.querySelector('.c2-spot');if(spot){spot.style.setProperty('--x',[18,49,80][S.steps]+'%');spot.style.setProperty('--y',[75,48,27][S.steps]+'%')}
   const label=document.querySelector('.c2-step-label');if(label)label.textContent='Stop '+(S.steps+1)+' of 3';
   document.querySelectorAll('[data-c2-stop]').forEach((x,i)=>x.disabled=i!==S.steps)}
  return;
 }
 if(d.c2Glyph!==undefined){if(S.symbols.length>=3)return;S.symbols.push(d.c2Glyph);
  document.querySelectorAll('.c2-glyph-grid span').forEach((x,i)=>x.textContent=S.symbols[i]||'＋');
  if(S.symbols.length===3)markDone();return}
 if(d.c2Clear!==undefined){S.symbols=[];appRender();return}
}
document.addEventListener('click',handleClick,true);
document.addEventListener('input',ev=>{
 if(ev.target.id!=='c2-light'||S.phase!=='play'||current()?.id!=='mmfa-fortin')return;
 S.value=Number(ev.target.value);
 const sky=document.getElementById('c2-storm'),label=document.getElementById('c2-value');
 if(sky)sky.style.setProperty('--light',S.value/100);
 if(label)label.textContent=String(S.value);
 if(S.value>=75)markDone();
});
window.TRACE_COOP={render,install,savedChoice,tasks:TASKS,get completed(){return seals},get scene(){return S}};
})();