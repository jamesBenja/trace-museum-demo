/* TRACE family discovery missions v1.1. Browser-only, optional, no child profiles or scoring. */
(function(){
'use strict';
const KEY='trace-family-discoveries-v1';
const MISSIONS={
 'mmfa-marrel':{
  name:'The Secret Garden',prompt:'Look at the flowers together. Can you spot a tiny creature hiding between the plants?',
  symbol:'🦎',reveal:'A little lizard has been hiding in the flowers!',
  story:'If this lizard could talk, what story would it tell?',
  choices:['I am exploring a secret jungle!','I am hiding until the gardener leaves!'],
  ending:'Marrel hid tiny creatures among his carefully painted flowers. You both looked closely enough to imagine a new story.',
  colours:['#c6e2bb','#608954']},
 'mmfa-witte':{
  name:'The Rooms Beyond',prompt:'Look into the painted room together. Which doorway seems to lead farther away?',
  symbol:'🚪',reveal:'A doorway can be a secret path into the painting.',
  story:'Where might the next doorway lead?',
  choices:['To a room full of quiet music','To another hidden room beyond the painting'],
  ending:'De Witte used perspective to make painted rooms seem deep. Your imagined doorway gives the scene another story.',
  colours:['#f4dfb2','#a17a51']},
 'mmfa-fortin':{
  name:'The City Before the Storm',prompt:'Look at the city and sky. Point out the brightest part and the darkest part to your teammate.',
  symbol:'☁️',reveal:'Dark buildings can make the bright sky feel even brighter.',
  story:'What does this sky make you imagine?',
  choices:['A storm is about to arrive','The sunlight might break through'],
  ending:'Fortin used contrasts between light and dark to create drama. Both interpretations start with what you can see.',
  colours:['#d0dfdf','#4e6872']},
 'pamm-masks':{
  name:'The Language of Shapes',prompt:'Search the artwork together. Can you find a face or mask among the geometric symbols?',
  symbol:'🎭',reveal:'The masks are part of a whole language of shapes.',
  story:'Imagine these symbols could send a message. What might they say?',
  choices:['Welcome to our world!','Every shape has a secret meaning!'],
  ending:'Torres-García arranged familiar signs in a grid. Looking at them together can suggest many different meanings.',
  colours:['#f2d7a6','#ad6953']},
 'pamm-delano':{
  name:'The Houses on the Hill',prompt:'Find the winding road. Show someone how your eyes follow it from one house to another.',
  symbol:'🛤️',reveal:'The winding road guides your eyes through the picture.',
  story:'If you followed the road, where would you go?',
  choices:['Toward the homes on the hillside','Off on an adventure beyond the photo'],
  ending:'Delano used the road and the surrounding landscape to guide how we read his photograph.',
  colours:['#c2decc','#738d79']},
 'pamm-grid':{
  name:'The Hidden Alphabet',prompt:'Find a small symbol or mark in the drawing and show it to your teammate.',
  symbol:'✎',reveal:'Just a few pencil lines can become a sign.',
  story:'If your chosen symbol belonged to a secret alphabet, what might it mean?',
  choices:['Home and belonging','A map of adventures'],
  ending:'Torres-García made a visual language out of simple shapes. Your own meanings turn looking into creating.',
  colours:['#e7decf','#978878']}
};
let completed={};
try{const obj=JSON.parse(localStorage.getItem(KEY)||'{}');if(obj&&typeof obj==='object')completed=obj}catch(e){}
const scene={id:null,phase:'invite',rubbed:false,travel:0};
const escapeText=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function current(){
 if(typeof state==='undefined'||state.stage!=='clue'||state.tab!=='quest')return null;
 const a=A[state.current];return a&&MISSIONS[a.id]?a:null;
}
function resetFor(a){
 if(scene.id!==a.id){scene.id=a.id;scene.phase='invite';scene.rubbed=false;scene.travel=0;}
}
function savedChoice(id){return Number.isInteger(completed[id]?.choice)?completed[id].choice:null;}
function safeSave(){
 try{localStorage.setItem(KEY,JSON.stringify(completed))}catch(e){console.warn('Family discovery could not be stored',e);}
}
function missionMarkup(a){
 const m=MISSIONS[a.id];resetFor(a);const choice=savedChoice(a.id);
 const top='<section class="tf-mission" aria-label="Optional family team challenge"><div class="tf-brow"><span>✦ MICA’S FAMILY CHALLENGE</span><span>OPTIONAL · ABOUT 1 MIN</span></div>';
 if(choice!==null&&scene.phase!=='rub'&&scene.phase!=='story')
  return top+'<div class="tf-result"><div class="tf-seal" aria-hidden="true">✦</div><div><strong>Team Discovery saved!</strong><p>You made a story together: “'+escapeText(m.choices[choice])+'”</p></div></div><div class="tf-actions"><button type="button" class="tf-small-btn" data-coop-again>Play together again</button></div><p class="tf-foot">Your Team Discovery is saved in My Finds. You can scan the artwork whenever you’re ready.</p></section>';
 if(scene.phase==='invite')
  return top+'<h3>Two people. One little mystery.</h3><p>Invite someone with you to look at the artwork together. Then pass the phone back and forth to reveal a secret and invent a story.</p>'+
  '<div class="tf-steps"><span><b>1</b> Look & rub</span><span><b>2</b> Imagine</span><span><b>✦</b> Collect</span></div>'+
  '<div class="tf-prompt"><span class="tf-prompt-symbol">👀</span><div><strong>First, look at the real artwork</strong><p>'+escapeText(m.prompt)+'</p></div></div>'+
  '<button type="button" class="tf-main-btn" data-coop-begin>We’ve looked. Reveal the secret ✨</button>'+
  '<p class="tf-foot">No correct answers or assigned roles. You can skip this and scan the artwork instead.</p></section>';
 if(scene.phase==='rub'){
  return top+'<div class="tf-step-name">STEP 1 OF 2 · LOOK AND RUB</div><h3>Polish away the mist!</h3><p>'+escapeText(m.prompt)+'</p><p>Take turns rubbing the panel with your finger to reveal Mica’s secret.</p>'+
  '<div class="tf-rub" style="--tf1:'+m.colours[0]+';--tf2:'+m.colours[1]+'"><div class="tf-rub-inner"><span aria-hidden="true">'+m.symbol+'</span><strong>'+escapeText(m.reveal)+'</strong></div><canvas id="tf-coop-canvas" width="640" height="380" aria-label="Rub the covered panel to reveal a clue"></canvas></div>'+
  '<p id="tf-rub-status" class="tf-status" role="status">'+(scene.rubbed?'✦ Secret revealed! Pass the phone to your teammate.':'Rub back and forth to uncover the secret.')+'</p>'+
  '<div class="tf-actions">'+(scene.rubbed?'<button type="button" class="tf-main-btn" data-coop-next>We found it! Continue →</button>':
  '<button type="button" class="tf-small-btn" data-coop-reveal>Reveal without rubbing</button>')+
  '<button type="button" class="tf-small-btn" data-coop-back>Back</button></div></section>';
 }
 if(scene.phase==='story'){
  return top+'<div class="tf-step-name">STEP 2 OF 2 · MAKE UP A STORY</div><div class="tf-big-symbol" aria-hidden="true">'+m.symbol+'</div>'+
  '<h3>'+escapeText(m.story)+'</h3><p>Turn to your teammate and share an idea. Then tap the story you like best. <strong>Both answers count!</strong></p>'+
  '<div class="tf-story-choices">'+m.choices.map((x,i)=>'<button type="button" data-coop-story="'+i+'"><span>'+(['✨','🌟'][i])+'</span>'+escapeText(x)+'</button>').join('')+'</div>'+
  '<button type="button" class="tf-small-btn" data-coop-back>← See the secret again</button></section>';
 }
 return top+'</section>';
}
function render(a){
 if(!a||!MISSIONS[a.id])return '';
 return missionMarkup(a);
}
function install(){
 const a=current();if(!a||scene.phase!=='rub'||scene.rubbed)return;
 const canvas=document.getElementById('tf-coop-canvas');
 if(!canvas)return;
 const context=canvas.getContext('2d');if(!context)return;
 context.globalCompositeOperation='source-over';
 context.fillStyle='#dfe8df';context.fillRect(0,0,canvas.width,canvas.height);
 for(let i=0;i<22;i++){
  context.fillStyle=i%2?'#c7d6cd':'#eef3ed';
  context.beginPath();context.arc((i*137)%640,(i*89)%380,17+(i%5)*7,0,Math.PI*2);context.fill();
 }
 context.fillStyle='#617d72';context.font='bold 31px Georgia';
 context.textAlign='center';context.fillText('RUB TO REVEAL',320,180);
 context.font='20px Arial';context.fillText('Take turns with your teammate',320,220);
 context.globalCompositeOperation='destination-out';
 let previous=null,done=false;
 function position(ev){const box=canvas.getBoundingClientRect();return {x:(ev.clientX-box.left)/box.width*canvas.width,y:(ev.clientY-box.top)/box.height*canvas.height}}
 function stroke(x,y,x2,y2){
  context.lineWidth=84;context.lineCap='round';context.lineJoin='round';
  context.beginPath();context.moveTo(x,y);context.lineTo(x2,y2);context.stroke();
 }
 function finish(){
  if(done)return;done=true;scene.rubbed=true;
  context.clearRect(0,0,canvas.width,canvas.height);
  canvas.classList.add('tf-cleared');canvas.setAttribute('aria-label','Clue revealed');
  const status=document.getElementById('tf-rub-status');
  if(status)status.textContent='✦ Secret revealed! Pass the phone to your teammate.';
  const controls=canvas.parentElement?.parentElement?.querySelector('.tf-actions');
  if(controls)controls.innerHTML='<button type="button" class="tf-main-btn" data-coop-next>We found it! Continue →</button><button type="button" class="tf-small-btn" data-coop-back>Back</button>';
  const wrapper=canvas.closest('.tf-rub');if(wrapper)wrapper.classList.add('tf-revealed');
 }
 canvas.addEventListener('pointerdown',ev=>{
  if(done)return;ev.preventDefault();canvas.setPointerCapture(ev.pointerId);previous=position(ev);
  stroke(previous.x,previous.y,previous.x+1,previous.y+1);scene.travel+=30;
 });
 canvas.addEventListener('pointermove',ev=>{
  if(done||!previous||!canvas.hasPointerCapture(ev.pointerId))return;
  ev.preventDefault();const pt=position(ev);
  stroke(previous.x,previous.y,pt.x,pt.y);
  scene.travel+=Math.hypot(pt.x-previous.x,pt.y-previous.y);previous=pt;
  if(scene.travel>=930)finish();
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{previous=null;});
}
function rerender(){if(typeof render==='function'){};if(typeof window.render==='function')window.render();else {
 // Top-level app function render() is a global binding from the original app.
 try{globalRender()}catch(e){console.error(e)}
}}
/* App's main render() declaration is globally available as a function. */
function globalRender(){renderApp();}
function renderApp(){const el=document.getElementById('view');if(!el)return;
 // This function is replaced at initialization by connecting the main app renderer.
 if(typeof window.TRACE_V1?.render==='function'){
  // Invoke the actual app rendering function, which handles the current tab/stage.
  if(typeof window.__traceAppRender==='function')window.__traceAppRender();
 }
}
function triggerRender(){
 if(typeof window.__traceAppRender==='function')window.__traceAppRender();
 else if(typeof window.render==='function')window.render();
}
function handle(ev){
 const el=ev.target.closest('[data-coop-begin],[data-coop-reveal],[data-coop-next],[data-coop-story],[data-coop-back],[data-coop-again]');
 if(!el)return;
 const a=current();if(!a)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 resetFor(a);
 if(el.hasAttribute('data-coop-begin')){scene.phase='rub';scene.rubbed=false;scene.travel=0;}
 else if(el.hasAttribute('data-coop-reveal')){scene.rubbed=true;}
 else if(el.hasAttribute('data-coop-next')){scene.phase='story';}
 else if(el.hasAttribute('data-coop-back')){
  scene.phase=scene.phase==='story'?'rub':'invite';
  if(scene.phase==='rub'){scene.rubbed=false;scene.travel=0;}
 }
 else if(el.hasAttribute('data-coop-again')){scene.phase='invite';scene.rubbed=false;scene.travel=0;}
 else if(el.hasAttribute('data-coop-story')){
  const choice=Number(el.dataset.coopStory);
  if(!(choice===0||choice===1)||scene.phase!=='story')return;
  if(savedChoice(a.id)===null){completed[a.id]={choice};safeSave();}
  scene.phase='done';
 }
 triggerRender();
}
document.addEventListener('click',handle,true);
window.TRACE_COOP={render,install,savedChoice,missions:MISSIONS,get completed(){return completed},get scene(){return scene}};
})();