/* TRACE v1.8: ten actual, artwork-specific sculpture/mixed-media interactions.
   Illustrations are original educational abstractions, not reproductions of museum objects. */
(function(){
'use strict';
const ACTIVITIES={
 'mmfa-eye':['Make the eye monumental','Drag the scale slider. Watch one familiar eye become larger than the buildings.','Changing the scale of a familiar object changes how it feels.'],
 'mmfa-frink':['Place two guardians','Tap two different positions in the courtyard to place the sculptures. Then turn them toward one another.','Two separate sculptures can create a conversation through the space between them.'],
 'mmfa-riopelle':['The found-object laboratory','Choose a wooden base, then combine at least two different found objects. Tap any object on the board to remove it.','Mixed-media sculpture creates new meaning by joining unlike materials.'],
 'mmfa-rodin':['The language of a pose','Change the illustrated figure, one gesture at a time. You can copy the finished pose with your body if you wish.','A seated body, bent arm and lowered head can express deep thought without words.'],
 'mmfa-cragg':['Reveal the many faces','Tap the three dotted circles on this imagined sculptural form. Each reveals a different profile within its curves.','A single sculptural shape can suggest several figures when we look from different angles.'],
 'pamm-chaos':['Balance impossible cubes','Stack three open cubes, then tilt at least two of them. Watch the outline of the tower change.','Unexpected angles make a rigid steel structure appear to move.'],
 'pamm-fonseca':['Make a miniature marble world','Tap a stone panel to carve an opening. Choose a shape and tap a carved opening to fill it. Fill two niches.','Carved openings can make a solid block feel like a tiny inhabited world.'],
 'pamm-yanko':['Transform industrial materials','Select a material, then tap one of the three positions on the sculpture. Place metal, a hose and paint skin.','Industrial materials can be rearranged into an expressive organic sculpture.'],
 'pamm-christo':['Wrap the islands in colour','Move the fabric slider to surround the green islands with pink. Compare the landscape before and after.','A temporary installation can change how we see a familiar landscape.'],
 'pamm-chromati':['Layer a glittering world','Choose an art material, then tap the canvas to apply it. Try acrylic, gouache and glitter.','Colour, opaque shapes and reflective details create distinct layers of visual texture.']
};
const e=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const btn=(label,attr,value,selected)=>'<button type="button" '+attr+'="'+e(value)+'" class="te-control'+(selected?' is-selected':'')+'">'+label+'</button>';
const progress=(n,total)=>'<span class="te-counter" aria-live="polite">'+n+' / '+total+' discoveries</span>';
function getState(C,id){
 if(!C.extra||C.extra.id!==id){C.extra={id,eye:15,guardian:[-1,-1],facing:false,base:'',objects:[],pose:0,faces:[],cubeCount:0,angles:[0,0,0],niches:['closed','closed','closed'],shape:'triangle',material:'metal',materials:['','',''],fabric:0,tool:'acrylic',cells:Array.from({length:9},()=>[])};C.done=false;C.points=[];}
 return C.extra;
}
function isComplete(s){
 switch(s.id){
 case 'mmfa-eye':return s.eye>=80;
 case 'mmfa-frink':return s.guardian[0]>=0&&s.guardian[1]>=0&&s.guardian[0]!==s.guardian[1]&&s.facing;
 case 'mmfa-riopelle':return !!s.base&&new Set(s.objects).size>=2;
 case 'mmfa-rodin':return s.pose===3;
 case 'mmfa-cragg':return s.faces.length===3;
 case 'pamm-chaos':return s.cubeCount===3&&s.angles.filter(x=>x!==0).length>=2;
 case 'pamm-fonseca':return s.niches.filter(x=>x!=='closed'&&x!=='open').length>=2;
 case 'pamm-yanko':return ['metal','hose','skin'].every(x=>s.materials.includes(x));
 case 'pamm-christo':return s.fabric>=90;
 case 'pamm-chromati':return ['acrylic','gouache','glitter'].every(x=>s.cells.some(c=>c.includes(x)));
 default:return false;
 }
}
function eye(s){
 const scale=(.28+s.eye/44).toFixed(2);
 return '<div class="te-workspace te-city" style="--eye-scale:'+scale+'">'+
 '<div class="te-skyline" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
 '<svg class="te-eye" viewBox="0 0 160 105" role="img" aria-label="An illustrated eye grows above the city"><path d="M8 53 Q80 -19 152 53 Q80 124 8 53Z" fill="#f4e4d1" stroke="#173e41" stroke-width="7"/><circle cx="80" cy="53" r="33" fill="#5d9181"/><circle cx="80" cy="53" r="18" fill="#1c323b"/><circle cx="70" cy="41" r="7" fill="#fff"/></svg>'+
 '<span class="te-city-label">A familiar eye becomes a monument</span></div>'+
 '<label class="te-slider-label" for="te-scale">Scale of the eye <b id="te-readout">'+s.eye+'%</b></label>'+
 '<input type="range" id="te-scale" data-te-slider="eye" min="0" max="100" value="'+s.eye+'" aria-label="Change eye size">'+
 '<div class="te-label-pair"><span>Everyday size</span><span>Monumental size</span></div>';
}
function guardianShape(isRight,facing){
 const flip=(isRight?(!facing):facing)?'scale(-1,1) translate(-60,0)':'';
 return '<svg viewBox="0 0 60 96" aria-hidden="true"><g transform="'+flip+'"><path d="M22 10 Q40 5 42 25 L37 36 41 41 34 44 30 39 22 39 Q14 30 16 20Z" fill="#9e977f" stroke="#4c5c57" stroke-width="2"/><path d="M18 43 Q31 36 44 46 L52 87 Q30 98 8 87 L12 55Z" fill="#7d8b82" stroke="#4c5c57" stroke-width="2"/><path d="M25 13 Q34 15 36 28" fill="none" stroke="#465b59" stroke-width="2"/></g></svg>';
}
function frink(s){
 const spots=Array.from({length:5},(_,i)=>{
  const who=s.guardian.indexOf(i);
  const occupied=who>=0;
  return '<button type="button" class="te-guardian-spot'+(occupied?' occupied':'')+'" data-te-spot="'+i+'" aria-label="'+(occupied?'Move guardian '+(who?'B':'A'):'Place guardian here')+'">'+(occupied?guardianShape(who===1,s.facing)+'<span>Guardian '+(who?'B':'A')+'</span>':'<span class="te-empty-spot">＋</span>')+'</button>';
 }).join('');
 const placed=s.guardian.filter(x=>x!==-1).length;
 return '<div class="te-workspace te-courtyard"><div class="te-courtyard-label">SCULPTURE COURTYARD · TAP A POSITION</div><div class="te-guardian-row">'+spots+'</div><div class="te-courtyard-floor"></div></div>'+
 '<p class="te-instruction" aria-live="polite">'+(placed===0?'1. Tap an empty circle to place Guardian A.':placed===1?'2. Tap another circle to place Guardian B.':s.facing?'Both guardians face inward. Notice the space connecting them.':'3. Turn the guardians to change their relationship.')+'</p>'+
 '<div class="te-toolbar">'+btn(s.facing?'↶ Turn away again':'↔ Turn toward each other','data-te-face-guardians','yes',s.facing)+btn('Start again','data-te-reset','yes',false)+'</div>';
}
function riopelle(s){
 const objs={wheel:['◉','wheel'],wire:['〰','wire'],scrap:['◆','scrap'],fabric:['▧','fabric']};
 const placed=s.objects.map((name,i)=>'<button type="button" class="te-found-piece te-found-'+name+'" data-te-remove="'+i+'" style="--idx:'+i+'" aria-label="Remove '+name+'">'+objs[name][0]+'</button>').join('');
 return '<div class="te-workspace te-lab"><div class="te-board '+(s.base?'te-wood-'+s.base:'te-empty-board')+'">'+(s.base?placed:'<span>Choose a wooden base ↓</span>')+'</div></div>'+
 '<p class="te-instruction">1. Choose the base. 2. Select and combine different found objects on the board.</p>'+
 '<div class="te-toolbar">'+btn('Light wood','data-te-base','light',s.base==='light')+btn('Dark wood','data-te-base','dark',s.base==='dark')+'</div>'+
 '<div class="te-toolbar">'+Object.keys(objs).map(x=>btn(objs[x][0]+' '+x,'data-te-object',x,false)).join('')+'</div>'+
 '<p class="te-hint" aria-live="polite">'+new Set(s.objects).size+' of 2 different objects combined. Tap a placed object to remove it.</p>';
}
function poseArt(s){
 const torso=s.pose===0?'M116 86 L119 158':'M106 86 L128 138';
 const legs=s.pose===0?'M119 158 L102 203 M119 158 L155 205':'M128 138 L164 157 L164 195 M128 138 L98 160 L103 196';
 const arm=s.pose<2?'M112 95 L84 132 L107 150':s.pose===2?'M112 95 L159 128 L130 151':'M112 95 L159 130 L105 60';
 const head=s.pose===3?'<circle cx="105" cy="67" r="22" fill="#d3a676" stroke="#755c55" stroke-width="4"/>':'<circle cx="111" cy="58" r="22" fill="#d3a676" stroke="#755c55" stroke-width="4"/>';
 return '<svg viewBox="0 0 260 225" class="te-pose-svg" role="img" aria-label="Illustrated pose changing from standing to thinking"><path d="M65 193 H190" stroke="#c8b79d" stroke-width="5"/><path d="M85 147 H151 V195" stroke="#61766c" stroke-width="8" fill="none"/>'+
 '<path d="'+torso+'" stroke="#9b694d" stroke-width="24" stroke-linecap="round" fill="none"/>'+
 '<path d="'+legs+'" stroke="#374f56" stroke-width="14" stroke-linecap="round" fill="none"/>'+
 '<path d="'+arm+'" stroke="#c88e5f" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+head+
 (s.pose===3?'<path d="M142 51 Q171 30 194 53" stroke="#d0a653" stroke-width="3" stroke-dasharray="5 5" fill="none"/><text x="169" y="28" fill="#9b6a34" font-size="20">?</text>':'')+'</svg>';
}
function rodin(s){
 return '<div class="te-workspace te-pose-stage">'+poseArt(s)+'</div>'+
 '<p class="te-instruction" aria-live="polite">'+['Start with this neutral figure. Let’s transform the posture.','The figure sits down. How does that change its mood?','Now the arm rests on the knee. What is it about to do?','Finally the hand touches the chin. The figure seems deep in thought.'][s.pose]+'</p>'+
 '<div class="te-toolbar">'+btn('① Sit down','data-te-pose','1',s.pose>=1)+btn('② Bend the arm','data-te-pose','2',s.pose>=2)+btn('③ Hand to chin','data-te-pose','3',s.pose>=3)+'</div>'+
 '<p class="te-hint">OPTIONAL BODY CHALLENGE: Try the finished pose yourself and notice how it feels.</p>'+btn('↺ Reset figure','data-te-reset','yes',false);
}
function faceSvg(s){
 const colors=['#e5ab88','#a7d5cb','#e6c88b'];
 const paths=['M60 44 Q87 20 107 54 L104 79 124 87 106 99 107 122 Q92 154 65 140 Q37 125 39 85Z',
 'M114 26 Q146 35 145 63 L163 76 143 87 Q147 127 123 143 Q100 133 101 99 L91 57Z',
 'M143 71 Q183 62 198 99 L196 123 216 135 193 143 Q184 175 157 162 Q132 145 132 112Z'];
 return '<svg viewBox="0 0 260 205" class="te-faces-svg" role="img" aria-label="Three overlapping abstract profiles highlighted as they are found">'+
 '<path d="M49 46 Q95 -2 147 32 Q207 35 205 91 Q238 136 190 175 Q114 213 60 159 Q13 124 49 46Z" fill="#a7b2a9" stroke="#52645d" stroke-width="7"/>'+
 paths.map((p,i)=>'<path d="'+p+'" fill="'+(s.faces.includes(i)?colors[i]:'#9baaa2')+'" stroke="'+(s.faces.includes(i)?'#435a5b':'#7b8a82')+'" stroke-width="'+(s.faces.includes(i)?4:2)+'" opacity="'+(s.faces.includes(i)?1:.44)+'"/>'+
 (s.faces.includes(i)?'<path d="'+(['M85 64 L93 64 M88 104 L101 107','M126 57 L134 56 M128 104 L142 105','M167 100 L174 102 M168 142 L189 145'][i])+'" stroke="#493c3b" stroke-width="3" fill="none"/>':'')).join('')+'</svg>';
}
function cragg(s){
 const positions=[[30,38],[51,28],[72,59]];
 return '<div class="te-workspace te-faces-stage">'+faceSvg(s)+positions.map((p,i)=>'<button type="button" class="te-face-spot'+(s.faces.includes(i)?' found':'')+'" style="left:'+p[0]+'%;top:'+p[1]+'%" data-te-find="'+i+'" aria-label="Reveal profile '+(i+1)+'">'+(s.faces.includes(i)?'✓':'?')+'</button>').join('')+'</div>'+
 '<p class="te-instruction" aria-live="polite">Tap the dotted question marks. We highlight one possible face each time. Then look for your own interpretations in the real sculpture.</p>'+progress(s.faces.length,3);
}
function cube(i,angle){
 return '<div class="te-cube te-cube-'+i+'" style="--tilt:'+angle+'deg"><svg viewBox="0 0 110 110" aria-hidden="true"><path d="M17 36 L60 10 101 34 58 60Z M17 36 V79 L58 105 V60 M101 34 V78 L58 105 M17 79 L60 54 101 78 M60 10 V54" fill="none" stroke="#677d82" stroke-width="7" stroke-linejoin="round"/></svg></div>';
}
function chaos(s){
 return '<div class="te-workspace te-tower">'+Array.from({length:s.cubeCount},(_,i)=>cube(i,s.angles[i])).join('')+'<div class="te-tower-ground"></div></div>'+
 '<p class="te-instruction" aria-live="polite">'+(s.cubeCount<3?'Add open steel cubes to the tower, one by one.':'The tower is built. Tilt two cubes to create an unstable-looking composition.')+'</p>'+
 '<div class="te-toolbar">'+btn('＋ Add cube '+(s.cubeCount+1),'data-te-cube','add',false)+'</div>'+
 (s.cubeCount?'<div class="te-toolbar">'+Array.from({length:s.cubeCount},(_,i)=>btn('↻ Tilt cube '+(i+1),'data-te-tilt',i,s.angles[i]!==0)).join('')+'</div>':'')+
 '<p class="te-hint">Tilts made: '+s.angles.filter(x=>x!==0).length+' / 2. '+(s.cubeCount===3?'Try different angles.':'')+'</p>'+btn('↺ Rebuild tower','data-te-reset','yes',false);
}
function fonseca(s){
 const symbols={triangle:'▲',sphere:'●',arch:'⌒'};
 return '<div class="te-workspace te-marble-scene"><div class="te-marble-column">'+s.niches.map((slot,i)=>'<button type="button" class="te-niche'+(slot==='closed'?' closed':' carved')+'" data-te-niche="'+i+'" aria-label="'+(slot==='closed'?'Carve opening '+(i+1):'Place shape in opening '+(i+1))+'">'+(slot==='closed'?'✧':slot==='open'?'<span class="te-niche-empty">＋</span>':symbols[slot])+'</button>').join('')+'</div></div>'+
 '<p class="te-instruction">Tap an uncarved square to open it. Choose a shape below, then tap a carved opening to place it inside.</p>'+
 '<div class="te-toolbar">'+Object.keys(symbols).map(x=>btn(symbols[x]+' '+x,'data-te-shape',x,s.shape===x)).join('')+'</div>'+
 '<p class="te-hint" aria-live="polite">'+s.niches.filter(x=>!['closed','open'].includes(x)).length+' / 2 small worlds furnished.</p>';
}
function materialShape(x){
 if(x==='metal')return '<svg viewBox="0 0 92 80" aria-hidden="true"><path d="M12 66 L27 10 78 35 61 72Z" fill="#9aaeb5" stroke="#405b62" stroke-width="5"/><path d="M27 10 L61 72" stroke="#e5edf0" stroke-width="4"/></svg>';
 if(x==='hose')return '<svg viewBox="0 0 92 80" aria-hidden="true"><path d="M9 58 C85 0 21 1 77 62" fill="none" stroke="#2e5455" stroke-width="13" stroke-linecap="round"/><path d="M9 58 C85 0 21 1 77 62" fill="none" stroke="#87a49c" stroke-width="4" stroke-dasharray="5 7"/></svg>';
 return x==='skin'?'<svg viewBox="0 0 92 80" aria-hidden="true"><path d="M9 19 Q40 -7 81 16 L77 66 Q52 44 26 75Z" fill="#d38275" stroke="#9d4e60" stroke-width="4"/><path d="M30 18 Q51 31 40 51" stroke="#ffe4c6" fill="none" stroke-width="4"/></svg>':'<span>＋</span>';
}
function yanko(s){
 return '<div class="te-workspace te-industrial"><div class="te-industrial-base">'+s.materials.map((x,i)=>'<button class="te-material-slot slot-'+i+'" data-te-place="'+i+'" aria-label="Place '+s.material+' in sculptural position '+(i+1)+'">'+materialShape(x)+'</button>').join('')+'</div></div>'+
 '<p class="te-instruction">Pick a material, then tap a glowing position to place or replace it. Combine all three different materials.</p>'+
 '<div class="te-toolbar">'+btn('▱ Metal','data-te-material','metal',s.material==='metal')+btn('〰 Hose','data-te-material','hose',s.material==='hose')+btn('◖ Paint skin','data-te-material','skin',s.material==='skin')+'</div>'+
 '<p class="te-hint" aria-live="polite">'+new Set(s.materials.filter(Boolean)).size+' / 3 different materials placed.</p>';
}
function christo(s){
 const ribbon=Math.round(s.fabric*4.4);
 return '<div class="te-workspace te-bay"><svg viewBox="0 0 320 205" role="img" aria-label="Aerial view of green islands gradually surrounded by pink fabric"><rect width="320" height="205" rx="15" fill="#86c5ce"/>'+
 '<path d="M0 46 Q70 15 136 38 T320 30 M0 160 Q86 125 155 154 T320 143" fill="none" stroke="#b9e4dc" stroke-width="5" opacity=".6"/>'+
 '<g fill="#588b5c" stroke="#376b55" stroke-width="4"><path d="M47 88 Q76 45 125 70 Q135 111 100 138 Q68 147 47 88Z"/><path d="M185 113 Q207 73 252 87 Q284 124 252 150 Q209 162 185 113Z"/></g>'+
 '<g fill="none" stroke="#f795ad" stroke-width="17" stroke-linecap="round"><path d="M36 89 Q65 34 131 58 Q156 111 105 150 Q54 163 36 89Z" stroke-dasharray="'+ribbon+' 500"/><path d="M171 113 Q191 58 257 74 Q307 127 257 163 Q200 176 171 113Z" stroke-dasharray="'+ribbon+' 500"/></g>'+
 '<text x="15" y="190" font-size="12" fill="#25596e">Biscayne Bay · conceptual map</text></svg></div>'+
 '<label class="te-slider-label" for="te-fabric">Pink fabric surrounding the islands <b id="te-readout">'+s.fabric+'%</b></label>'+
 '<input type="range" id="te-fabric" data-te-slider="fabric" min="0" max="100" value="'+s.fabric+'" aria-label="Surround islands with pink fabric">'+
 '<div class="te-label-pair"><span>Before</span><span>Surrounded</span></div>';
}
function chromati(s){
 const glyphs={acrylic:'●',gouache:'◆',glitter:'✦'};
 return '<div class="te-workspace te-paint-stage"><div class="te-paint-board">'+s.cells.map((c,i)=>'<button type="button" data-te-paint="'+i+'" class="te-paint-cell '+(c.includes('acrylic')?'has-acrylic ':'')+(c.includes('gouache')?'has-gouache ':'')+(c.includes('glitter')?'has-glitter':'')+'" aria-label="Paint area '+(i+1)+'">'+c.map(x=>'<span class="te-paint-mark te-mark-'+x+'">'+glyphs[x]+'</span>').join('')+'</button>').join('')+'</div></div>'+
 '<p class="te-instruction">1. Choose a material. 2. Tap any square on the artwork to apply it. Layer materials in the same square or try a new one.</p>'+
 '<div class="te-toolbar">'+btn('● Acrylic','data-te-tool','acrylic',s.tool==='acrylic')+btn('◆ Gouache','data-te-tool','gouache',s.tool==='gouache')+btn('✦ Glitter','data-te-tool','glitter',s.tool==='glitter')+'</div>'+
 '<p class="te-hint" aria-live="polite">Materials used: '+['acrylic','gouache','glitter'].filter(x=>s.cells.some(c=>c.includes(x))).map(x=>glyphs[x]+' '+x).join(' · ')+'</p>'+btn('↺ Clear canvas','data-te-reset','yes',false);
}
function makeScene(s){
 switch(s.id){
 case 'mmfa-eye':return eye(s);
 case 'mmfa-frink':return frink(s);
 case 'mmfa-riopelle':return riopelle(s);
 case 'mmfa-rodin':return rodin(s);
 case 'mmfa-cragg':return cragg(s);
 case 'pamm-chaos':return chaos(s);
 case 'pamm-fonseca':return fonseca(s);
 case 'pamm-yanko':return yanko(s);
 case 'pamm-christo':return christo(s);
 case 'pamm-chromati':return chromati(s);
 default:return '';
 }
}
function game(a,C){
 if(!ACTIVITIES[a.id])return '';
 const s=getState(C,a.id),data=ACTIVITIES[a.id];C.done=isComplete(s);
 return '<div class="t1-screen te-game"><div class="t1-overline">TRACE ART-MAKING LAB · '+e(a.artist)+'</div>'+
 '<h2 class="t1-h1">'+e(data[0])+'</h2>'+
 '<div class="t1-task te-prompts"><strong>YOUR MISSION</strong><p>'+e(data[1])+'</p></div>'+
 makeScene(s)+
 (C.done?'<div class="t1-success" role="status">✦ Discovery made! '+e(data[2])+'</div>':'<p class="te-action-hint" role="status">Experiment with the illustration above to unlock this discovery.</p>')+
 '<button type="button" class="button" data-t1-finish '+(C.done?'':'disabled')+'>'+(C.done?'Collect your discovery ✦':'Complete the experiment first')+'</button>'+
 '<button type="button" class="button ghost" data-t1-assist>Use a guided alternative</button>'+
 '<button type="button" class="button outline" data-action="v7-story">Read the artwork story</button>'+
 '<p class="tiny">These illustrated experiments are creative interpretations, not exact models of the real objects. Compare your result with the artwork in the gallery or collection record.</p></div>';
}
function mutate(s,act,value){
 switch(act){
 case 'spot':{const n=Number(value);if(s.guardian[0]===n||s.guardian[1]===n)return;if(s.guardian[0]===-1)s.guardian[0]=n;else s.guardian[1]=n;break}
 case 'face-guardians':if(s.guardian.every(x=>x>=0))s.facing=!s.facing;break;
 case 'base':s.base=value;break;
 case 'object':if(s.base&&s.objects.length<6)s.objects.push(value);break;
 case 'remove':s.objects.splice(Number(value),1);break;
 case 'pose':if(Number(value)===s.pose+1)s.pose++;break;
 case 'find':{const n=Number(value);if(!s.faces.includes(n))s.faces.push(n);break}
 case 'cube':if(s.cubeCount<3)s.cubeCount++;break;
 case 'tilt':if(Number(value)<s.cubeCount)s.angles[Number(value)]=(s.angles[Number(value)]+15)%60;break;
 case 'shape':s.shape=value;break;
 case 'niche':{const n=Number(value);if(s.niches[n]==='closed')s.niches[n]='open';else s.niches[n]=s.shape;break}
 case 'material':s.material=value;break;
 case 'place':s.materials[Number(value)]=s.material;break;
 case 'tool':s.tool=value;break;
 case 'paint':{const c=s.cells[Number(value)];if(c&&!c.includes(s.tool))c.push(s.tool);break}
 }
}
const clickActions={'teSpot':'spot','teFaceGuardians':'face-guardians','teBase':'base','teObject':'object','teRemove':'remove','tePose':'pose','teFind':'find','teCube':'cube','teTilt':'tilt','teShape':'shape','teNiche':'niche','teMaterial':'material','tePlace':'place','teTool':'tool','tePaint':'paint'};
document.addEventListener('click',ev=>{
 const target=ev.target.closest('button');
 if(!target||state.stage!=='puzzle'||state.tab!=='quest')return;
 const a=A[state.current],C=window.TRACE_V1?.puzzle;
 if(!a||!ACTIVITIES[a.id]||!C)return;
 if(target.hasAttribute('data-te-reset')){
  ev.preventDefault();ev.stopImmediatePropagation();C.extra=null;C.done=false;window.__traceAppRender?.();return;
 }
 let action=null,value=null;
 for(const [key,name] of Object.entries(clickActions)){if(target.dataset[key]!==undefined){action=name;value=target.dataset[key];break}}
 if(!action)return;
 ev.preventDefault();ev.stopImmediatePropagation();
 mutate(getState(C,a.id),action,value);C.done=isComplete(C.extra);
 window.__traceAppRender?.();
},true);
document.addEventListener('input',ev=>{
 if(!ev.target.matches('[data-te-slider]')||state.stage!=='puzzle'||state.tab!=='quest')return;
 const C=window.TRACE_V1?.puzzle,a=A[state.current];if(!C||!a||!ACTIVITIES[a.id])return;
 const s=getState(C,a.id),n=clamp(Number(ev.target.value),0,100);
 if(ev.target.dataset.teSlider==='eye'){
  s.eye=n;const city=document.querySelector('.te-city');if(city)city.style.setProperty('--eye-scale',(.28+n/44).toFixed(2));
 }else if(ev.target.dataset.teSlider==='fabric'){
  s.fabric=n;document.querySelectorAll('.te-bay svg g[stroke="#f795ad"] path').forEach(x=>x.setAttribute('stroke-dasharray',Math.round(n*4.4)+' 500'));
 }
 const out=document.querySelector('#te-readout');if(out)out.textContent=n+'%';
 C.done=isComplete(s);const finish=document.querySelector('[data-t1-finish]');if(finish){finish.disabled=!C.done;finish.textContent=C.done?'Collect your discovery ✦':'Complete the experiment first';}
},true);
document.addEventListener('change',ev=>{
 if(ev.target.matches('[data-te-slider]')&&state.stage==='puzzle'&&ACTIVITIES[A[state.current]?.id])window.__traceAppRender?.();
},true);
window.TRACE_EXTRA={steps:ACTIVITIES,game,has:id=>!!ACTIVITIES[id],isComplete};
})();