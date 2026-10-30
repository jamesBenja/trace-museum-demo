/* TRACE v1.4 optional, artwork-grounded comparison game. No gallery-location or scan claims. */
(function(){
'use strict';
const KEY='trace-art-bridges-v1';
let saved={mmfa:{},pamm:{}};
try{const r=JSON.parse(localStorage.getItem(KEY)||'{}');for(const museum of ['mmfa','pamm'])if(r[museum]&&typeof r[museum]==='object')saved[museum]=r[museum];}catch(e){}
const LENSES=[
 {id:'shapes',label:'Shapes & lines',glyph:'⌗'},
 {id:'light',label:'Light & colour',glyph:'☼'},
 {id:'stories',label:'Stories & ideas',glyph:'✧'}
];
const DETAILS={
 'mmfa-marrel':{shapes:['Curving flower petals','Tiny creatures among leaves'],light:['Bright touches on the petals','Dark shadows between leaves'],stories:['A bouquet filled with life','Small surprises hidden in nature']},
 'mmfa-witte':{shapes:['Repeating door frames','Floor lines stretching into distance'],light:['Light entering the interior','Shadowed corners and doorways'],stories:['A person making music','Quiet rooms waiting to be explored']},
 'mmfa-fortin':{shapes:['Buildings and rooftops','Tall church and city silhouettes'],light:['A bright, dramatic sky','Dark shapes of the city'],stories:['A city before the storm','A changing Montréal neighbourhood']},
 'pamm-masks':{shapes:['Faces arranged in a grid','Geometric signs and blocks'],light:['Colour inside the masks','Contrasting coloured sections'],stories:['Masks that suggest people','Symbols that invite interpretation']},
 'pamm-delano':{shapes:['A winding road through the scene','Rows and shapes of houses'],light:['A dramatic sky over the houses','Light and shadow in the landscape'],stories:['Homes connected by a road','A documentary view of daily life']},
 'pamm-grid':{shapes:['Stacked rectangular sections','Small symbols drawn inside a grid'],light:['Dark graphite lines','Light blank space around marks'],stories:['Signs that feel like an alphabet','A drawing that suggests a map']}
};
/* New sculpture chapters use grounded, medium-specific comparison prompts. */
for(const art of [...mmfa,...pamm]){
 if(DETAILS[art.id])continue;
 DETAILS[art.id]={
  shapes:[art.kind==='sculpture'?'The three-dimensional outline of the object':'How different materials are arranged','The shapes and space around this work'],
  light:['The material changes how the light looks','Highlights, shadows, and what they reveal'],
  stories:[art.chapter,'Why the artist chose '+art.medium.toLowerCase()]
 };
}

const STORIES={
 mmfa:{
 '0-1':{shapes:'Marrel fills a vase with curving natural forms. De Witte makes a room feel deep through repeated doorways and floor lines.',light:'Marrel uses tiny bright highlights on flowers. De Witte uses interior light and shadows to make an imagined room feel real.',stories:'A still-life painting invites you to discover hidden creatures; a room painting invites you to imagine the life happening just outside its doors.'},
 '0-2':{shapes:'Marrel celebrates tiny natural forms, while Fortin uses the larger silhouettes of a city beneath an enormous sky.',light:'Both artists make highlights stand out against shadow, but Fortin works on the scale of an entire stormy city.',stories:'One artist captures a small, imagined world of nature. Another records the atmosphere of a changing Montréal landscape.'},
 '1-2':{shapes:'De Witte leads your eye into a series of rooms, while Fortin uses rooftops and silhouettes to arrange a cityscape.',light:'Both works use light against shadow. One invites you indoors; the other makes the coming weather feel dramatic.',stories:'A quiet musical interior and a city under a storm suggest different things might happen next. You can imagine both scenes continuing.'}
 },
 pamm:{
 '0-1':{shapes:'Torres-García arranges symbols in a grid. Delano leads our eyes through a landscape with a winding road and groups of buildings.',light:'Torres-García creates rhythm with coloured forms. Delano uses tonal contrasts and an expressive sky to frame the photographed scene.',stories:'One work turns signs into a visual language. The photograph shares a view of a real place and the homes along a road.'},
 '0-2':{shapes:'These two Torres-García works show how repeated grids can organize different signs into an invented visual vocabulary.',light:'The coloured construction and the quieter graphite drawing use contrast very differently, though both organize what we notice.',stories:'Both works offer symbols we can interpret. Their meanings are not simply a quiz with one correct answer.'},
 '1-2':{shapes:'Delano guides your eye through a road and buildings. Torres-García builds a small imagined structure with lines and compartments.',light:'Delano uses the photographic values of a landscape; Torres-García contrasts graphite lines with light paper.',stories:'The photograph records homes in a specific landscape. The drawing invites us to imagine a whole world from a handful of symbols.'}
 }
};
const S={museum:null,selected:[],stage:'choose',lens:'shapes',position:50,hasCompared:false,seen:{left:null,right:null},celebrate:false};
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const solved=()=>A.filter(a=>state.found.includes(a.id));
function pairKey(a,b){const x=A.findIndex(w=>w.id===a),y=A.findIndex(w=>w.id===b);return [x,y].sort((m,n)=>m-n).join('-')}
function keyNow(){return S.selected.length===2?pairKey(...S.selected):null}
function bonusData(){return saved[state.venue]||{}}
function links(){return Object.keys(bonusData()).filter(k=>{const ids=k.split('-').map(Number);return ids.length===2&&ids.every(i=>A[i]&&state.found.includes(A[i].id))})}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){console.warn('Cannot save art connections',e)}}
function clearVenue(id){saved[id]={};persist();if(S.museum===id)S.stage='choose'}
function prepare(){
 if(S.museum!==state.venue){S.museum=state.venue;S.selected=[];S.stage='choose';S.position=50;S.lens='shapes';S.hasCompared=false;S.celebrate=false;S.seen={left:null,right:null}}
}
function resetComparison(){
 S.lens='shapes';S.position=50;S.hasCompared=false;S.seen={left:null,right:null};S.celebrate=false;
}
function launch(){if(solved().length<2)return;prepare();S.stage='choose';S.selected=[];S.celebrate=false;stage('bonus')}
function choose(id){
 if(!solved().some(a=>a.id===id))return;
 if(S.selected.includes(id))S.selected=S.selected.filter(x=>x!==id);
 else if(S.selected.length<2)S.selected=[...S.selected,id];
 if(S.selected.length===2){resetComparison();S.stage='explore'}else S.stage='choose';
 appRender();
}
function appRender(){if(typeof window.__traceAppRender==='function')window.__traceAppRender()}
function mascot(text){return '<div class="tb-mica"><b>✦ MICA SAYS</b><p>'+esc(text)+'</p></div>'}
function header(){return '<div class="tb-top"><div class="t1-overline">BONUS MYSTERY · ARTWORK CONNECTIONS</div><h2 class="t1-h1">Connect the artworks.</h2><p class="t1-small">Artworks have secret things in common. Explore two you’ve already found, then build a bridge between them.</p></div>'}
function chooseScreen(){
 const works=solved(),picked=new Set(S.selected);
 return '<div class="tb-screen">'+header()+mascot('Pick any two discoveries. You can connect a new pair every time you explore.')+
 '<div class="tb-summary"><span>✦ '+links().length+' connections collected</span><span>'+works.length*(works.length-1)/2+' possible now</span></div>'+
 '<div class="tb-pairs">'+works.map(a=>'<button data-bonus-pick="'+a.id+'" class="'+(picked.has(a.id)?'selected':'')+'" type="button"><img src="'+img(a)+'" alt=""><span><strong>'+esc(a.artist)+'</strong><small>'+esc(a.name)+'</small><small>'+ (picked.has(a.id)?'✓ SELECTED':'Tap to choose')+'</small></span></button>').join('')+'</div>'+
 '<p class="tb-guide">Choose two works. Look for different ways the artists use shape, light and storytelling.</p>'+
 (links().length?'<div class="tb-saved"><b>YOUR DISCOVERED CONNECTIONS</b>'+links().map(k=>{const ids=k.split('-').map(Number);return '<button type="button" data-bonus-pair="'+k+'">✦ '+esc(A[ids[0]]?.artist||'')+' + '+esc(A[ids[1]]?.artist||'')+' <span>↗ Replay</span></button>'}).join('')+'</div>':'')+
 '<button class="button ghost" type="button" data-bonus-exit>← Adventure map</button></div>';
}
function imageCard(a){return '<div class="tb-full-card"><img src="'+img(a)+'" alt="'+esc(a.name)+'"><div><b>'+esc(a.artist)+'</b><small>'+esc(a.name)+'</small></div></div>'}
function sideOptions(a,side){
 const options=DETAILS[a.id][S.lens],chosen=S.seen[side];
 return '<section class="tb-details"><h3>✦ '+(side==='left'?'Artwork A':'Artwork B')+': What catches your eye?</h3>'+
 '<p>'+esc(a.artist)+'</p><div class="tb-details-options">'+options.map((x,i)=>'<button data-bonus-observe="'+side+':'+i+'" type="button" class="'+(chosen===i?'active':'')+'">'+(chosen===i?'✓ ':'○ ')+esc(x)+'</button>').join('')+'</div></section>';
}
function explore(){
 const [a,b]=S.selected.map(id=>A.find(x=>x.id===id));if(!a||!b)return chooseScreen();
 const done=S.seen.left!==null&&S.seen.right!==null;
 return '<div class="tb-screen">'+header()+
 '<button class="tb-back" data-bonus-back type="button">← Choose different artworks</button>'+
 '<div class="tb-section-heading"><span>STEP 1 OF 3</span><h3>Swipe between two worlds</h3><p>Drag the gold divider across the paintings. Look for a similarity or a surprising difference.</p></div>'+
 '<div class="tb-wipe" id="tb-wipe" style="--divide:'+S.position+'%">'+
 '<img class="tb-wipe-base" src="'+img(a)+'" alt="'+esc(a.artist)+' artwork">'+'<img class="tb-wipe-top" src="'+img(b)+'" alt="'+esc(b.artist)+' artwork">'+
 '<div class="tb-wipe-line"><div>⇄</div></div>'+
 '<div class="tb-wipe-labels"><span>A</span><span>B</span></div></div>'+
 '<label class="tb-slider-label" for="tb-slider">Drag to compare artworks</label>'+
 '<input id="tb-slider" class="tb-slider" type="range" min="5" max="95" step="1" value="'+S.position+'" aria-label="Reveal more or less of each artwork">'+
 '<div class="tb-full-images">'+imageCard(a)+imageCard(b)+'</div>'+
 '<div class="tb-section-heading"><span>STEP 2 OF 3</span><h3>Choose your detective lens</h3><p>What do you want to compare?</p></div>'+
 '<div class="tb-lenses">'+LENSES.map(l=>'<button class="'+(S.lens===l.id?'selected':'')+'" data-bonus-lens="'+l.id+'" type="button"><b>'+l.glyph+'</b><span>'+l.label+'</span></button>').join('')+'</div>'+
 '<div class="tb-section-heading"><span>STEP 3 OF 3</span><h3>Tap one detail in each artwork</h3><p>Choose what you noticed in artwork A and artwork B. Both options are valid observations.</p></div>'+
 sideOptions(a,'left')+'<div class="tb-beam"><span class="'+(S.seen.left!==null?'lit':'')+'">A</span><div class="'+(done?'complete':'')+'"></div><span class="'+(S.seen.right!==null?'lit':'')+'">B</span></div>'+
 sideOptions(b,'right')+
 (done?'<div class="tb-mica reveal"><b>✧ A CONNECTION IS FORMING</b><p>You connected <strong>'+esc(DETAILS[a.id][S.lens][S.seen.left])+'</strong> with <strong>'+esc(DETAILS[b.id][S.lens][S.seen.right])+'</strong>.</p></div>':'')+
 '<button type="button" data-bonus-finish class="button" '+(done?'':'disabled')+'>✦ '+(done?'Create our connection':'Select a detail from both artworks')+'</button>'+
 '<button type="button" data-bonus-exit class="button ghost">Return to the adventure map</button></div>';
}
function reveal(){
 const [a,b]=S.selected.map(id=>A.find(x=>x.id===id));if(!a||!b)return chooseScreen();
 const key=keyNow(),story=STORIES[state.venue][key]?.[S.lens]||'These artists worked with different materials and forms. '+a.artist+' uses '+a.medium.toLowerCase()+', while '+b.artist+' uses '+b.medium.toLowerCase()+'. What do their choices make you notice?';
 return '<div class="tb-screen"><div class="tb-celebration"><div class="tb-badge-big">✦</div><div class="t1-overline">ART BRIDGE CREATED</div><h2 class="t1-h1">You found a connection!</h2><div class="tb-bridge-names"><span>'+esc(a.artist)+'</span><b>✧</b><span>'+esc(b.artist)+'</span></div><p>'+esc(story)+'</p><div class="tb-stamp">✦ Art Connector badge earned</div></div>'+
 mascot('You looked at two artworks together and found a way to connect them. Try the same pair with another lens, or find a new pair!')+
 '<button class="button" type="button" data-bonus-another>Connect another pair</button>'+
 '<button class="button outline" type="button" data-bonus-replay>Compare these again</button>'+
 '<button class="button outline" type="button" data-action="album">Open my discovery passport</button>'+
 '<button class="button ghost" type="button" data-bonus-exit>Return to the adventure map</button></div>';
}
function render(v){
 if(state.tab!=='quest'||state.stage!=='bonus')return false;
 prepare();
 if(solved().length<2){v.innerHTML='<div class="tb-screen"><h2>One more discovery to go</h2><p>Solve two artworks to unlock the comparison bonus.</p><button class="button" data-bonus-exit>Back to adventure</button></div>';return true}
 if(S.stage==='explore'){v.innerHTML=explore();install();return true}
 if(S.stage==='reveal'){v.innerHTML=reveal();return true}
 v.innerHTML=chooseScreen();return true;
}
function moveSlider(v){
 S.position=Math.max(5,Math.min(95,Number(v)||50));
 if(Math.abs(S.position-50)>=14)S.hasCompared=true;
 const area=document.getElementById('tb-wipe');if(area)area.style.setProperty('--divide',S.position+'%');
 const input=document.getElementById('tb-slider');if(input&&Number(input.value)!==S.position)input.value=String(S.position);
}
function install(){
 const area=document.getElementById('tb-wipe');if(!area)return;
 function update(ev){const r=area.getBoundingClientRect();moveSlider(((ev.clientX-r.left)/r.width)*100)}
 area.addEventListener('pointerdown',ev=>{ev.preventDefault();area.setPointerCapture(ev.pointerId);update(ev)});
 area.addEventListener('pointermove',ev=>{if(area.hasPointerCapture(ev.pointerId))update(ev)});
}
function clearOld(){S.selected=[];S.stage='choose';S.seen={left:null,right:null};S.celebrate=false}
document.addEventListener('click',ev=>{
 const control=ev.target.closest('[data-bonus-open],[data-bonus-exit],[data-bonus-pick],[data-bonus-pair],[data-bonus-back],[data-bonus-lens],[data-bonus-observe],[data-bonus-finish],[data-bonus-another],[data-bonus-replay]');
 if(!control)return;
 ev.stopImmediatePropagation();ev.preventDefault();
 const d=control.dataset;
 if(d.bonusOpen!==undefined){launch();return}
 if(d.bonusExit!==undefined){S.stage='choose';stage('hub');return}
 if(d.bonusBack!==undefined||d.bonusAnother!==undefined){clearOld();appRender();return}
 if(d.bonusPick){choose(d.bonusPick);return}
 if(d.bonusPair){const ids=d.bonusPair.split('-').map(Number).map(i=>A[i]?.id);if(ids.every(id=>id&&solved().some(a=>a.id===id))){S.selected=ids;resetComparison();S.stage='explore';appRender()}return}
 if(d.bonusLens){if(!LENSES.some(l=>l.id===d.bonusLens))return;S.lens=d.bonusLens;S.seen={left:null,right:null};appRender();return}
 if(d.bonusObserve){const [side,nstr]=d.bonusObserve.split(':');const n=Number(nstr);if(!['left','right'].includes(side)||!Number.isInteger(n)||n<0||n>1)return;S.seen[side]=n;appRender();return}
 if(d.bonusFinish!==undefined){if(S.seen.left===null||S.seen.right===null||S.selected.length!==2)return;
   const k=keyNow();saved[state.venue][k]={lens:S.lens,observations:{...S.seen},artworks:S.selected.slice()};
   persist();S.stage='reveal';S.celebrate=true;appRender();return}
 if(d.bonusReplay!==undefined){resetComparison();S.stage='explore';appRender();return}
},true);
document.addEventListener('input',ev=>{if(ev.target.id==='tb-slider')moveSlider(ev.target.value)});
window.TRACE_BONUS={render,launch,links,clearVenue,pairKey,get saved(){return saved},get state(){return S}};
if(state.stage==='bonus')appRender();
})();