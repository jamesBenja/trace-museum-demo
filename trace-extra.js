/* TRACE v1.5 expansion studio: short tactile art activities for sculpture/mixed media. */
(function(){
'use strict';
const STEPS={
 'mmfa-eye':{icon:'👁',title:'Make the eye monumental',desc:'Discover how changing the size of something familiar can transform its meaning.',steps:[['👁','Start with a small eye'],['🔍','Make it enormous'],['🏙','Imagine it in the city']],lesson:'A change in scale can transform how we experience an everyday form.'},
 'mmfa-frink':{icon:'♟',title:'Place two guardians',desc:'See how two separate sculptures can create a silent conversation.',steps:[['♟','Place the first sculpture'],['♟','Place the second sculpture'],['↔','Explore the space between them']],lesson:'Two sculptures can create a shared feeling of remembrance.'},
 'mmfa-riopelle':{icon:'🧩',title:'The found-object laboratory',desc:'Imagine collecting objects and materials to create a new sculptural form.',steps:[['🪵','Choose a wooden base'],['✦','Add a found object'],['🎨','Combine your materials']],lesson:'Mixed-media art turns familiar materials into new forms.'},
 'mmfa-rodin':{icon:'◕',title:'The language of a pose',desc:'Discover how body language can suggest thought and emotion.',steps:[['🪑','Make a seated pose'],['💪','Bring an arm to the face'],['💭','Imagine a big thought']],lesson:'Rodin uses gesture and posture to suggest active thinking.'},
 'mmfa-cragg':{icon:'◉',title:'Reveal the many faces',desc:'This sculpture combines faces into one form. Reveal them one by one.',steps:[['◉','Reveal the first face'],['◉','Find another face'],['◉','Discover the third']],lesson:'Several figures can be imagined as one shared sculptural form.'},
 'pamm-chaos':{icon:'⬡',title:'Balance impossible cubes',desc:'Arrange three open cubes into an unusual, apparently unstable tower.',steps:[['□','Place the first cube'],['◇','Tilt the next cube'],['⬡','Balance the last cube']],lesson:'Open steel lines and shifting angles create a feeling of motion.'},
 'pamm-fonseca':{icon:'▣',title:'Make a miniature marble world',desc:'Build an imaginary architectural space inside a solid column.',steps:[['▯','Carve an opening'],['△','Place a small shape'],['◓','Design a hidden room']],lesson:'Even a solid column can suggest miniature worlds and secret spaces.'},
 'pamm-yanko':{icon:'⚒',title:'Transform industrial materials',desc:'Combine three kinds of material to understand how sculptural transformations happen.',steps:[['🔩','Add some metal'],['〰','Thread in a hose'],['🎨','Drape the paint skin']],lesson:'Paint skin is dried paint that can be peeled away and formed into sculpture.'},
 'pamm-christo':{icon:'🏝',title:'Wrap the islands in colour',desc:'Reimagine the temporary pink-fabric installation in Biscayne Bay.',steps:[['🏝','Find the islands'],['🧵','Surround them with pink fabric'],['🌊','Reveal the water around them']],lesson:'A temporary artwork can transform a landscape and later live on in drawings and maps.'},
 'pamm-chromati':{icon:'✷',title:'Layer a glittering world',desc:'Discover how different materials create colour, texture, and sparkle.',steps:[['🎨','Add acrylic colour'],['🖌','Layer in gouache'],['✨','Finish with glitter']],lesson:'Layering varied media gives an artwork a rich expressive surface.'}
};
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function game(a,C){
 const m=STEPS[a.id];if(!m)return '';
 const count=Math.min(3,C.points.length);
 return '<div class="t1-screen"><div class="t1-overline">ART-MAKING LAB · '+esc(a.kind.toUpperCase())+'</div><h2 class="t1-h1">'+esc(m.title)+'</h2>'+
 '<div class="t1-companion"><div class="t1-mica"><div class="t1-mica-body"></div><span class="t1-mica-sparkle">✦</span></div><div><b class="t1-mica-label">MICA</b><p class="t1-mica-line">This art is made with '+esc(a.medium)+'. Discover what makes its materials or form special!</p></div></div>'+
 '<div class="t1-task">'+esc(m.desc)+'</div>'+
 '<div class="te-stage"><div class="te-source"><b>'+esc(m.icon)+'</b><span>'+esc(a.artist)+'</span></div><div class="te-build">'+
 m.steps.slice(0,count).map((x,i)=>'<div class="te-piece"><b>'+x[0]+'</b><small>'+esc(x[1])+'</small></div>').join('')+
 (count===0?'<p>Tap the first tile below to begin your experiment.</p>':'')+'</div></div>'+
 '<h3 class="t1-h2">Build your artistic discovery</h3><div class="te-steps">'+m.steps.map((x,i)=>'<button type="button" data-extra-step="'+i+'" '+(i!==count?'disabled':'')+' class="'+(i<count?'done':'')+'"><b>'+x[0]+'</b><span>'+esc(x[1])+'</span><small>'+(i<count?'✓':i===count?'TAP':'LOCKED')+'</small></button>').join('')+'</div>'+
 (count>=3?'<div class="t1-success">✦ '+esc(m.lesson)+'</div>':'')+
 '<button class="button" data-t1-finish '+(count>=3?'':'disabled')+'>'+(count>=3?'Collect your discovery ✦':'Complete three creative steps')+'</button>'+
 '<button class="button ghost" data-t1-assist>Use a guided alternative</button><button class="button outline" data-action="v7-story">Read the artwork story</button>'+
 '<p class="tiny">Educational interpretation of the materials and forms, not a literal reconstruction of the artist’s working methods.</p></div>';
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-extra-step]');if(!b)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 if(state.stage!=='puzzle'||state.tab!=='quest')return;
 const a=A[state.current],C=window.TRACE_V1?.puzzle;
 if(!a||!STEPS[a.id]||!C)return;
 const i=Number(b.dataset.extraStep);
 if(i===C.points.length&&i<3){C.points.push(i);C.done=C.points.length>=3;window.__traceAppRender?.()}
},true);
window.TRACE_EXTRA={steps:STEPS,game,has:id=>!!STEPS[id]};
})();
