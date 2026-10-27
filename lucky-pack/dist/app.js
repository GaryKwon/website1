import { createFortuneDraw } from './draw.js';
import { initHoverEffects } from './hover.js';

const $ = (selector) => document.querySelector(selector);
const packs = [
  {name:'COSMIC VIOLET',korean:'코스믹 바이올렛',className:'violet',theme:'star',tag:'FOLLOW YOUR STAR'},
  {name:'MYSTIC MINT',korean:'미스틱 민트',className:'mint',theme:'clover',tag:'A LITTLE EXTRA LUCK'},
  {name:'ROSY DREAM',korean:'로지 드림',className:'rose',theme:'heart',tag:'SOMETHING TO LOVE'},
  {name:'LUNAR BLUE',korean:'루나 블루',className:'blue',theme:'moon',tag:'TRUST YOUR OWN ORBIT'},
  {name:'GOLDEN HOUR',korean:'골든 아워',className:'gold',theme:'sun',tag:'LET YOUR DAY GLOW'}
];
const gradient = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
gradient.id='metal-gradient'; gradient.setAttribute('x1','0'); gradient.setAttribute('y1','0'); gradient.setAttribute('x2','1'); gradient.setAttribute('y2','1');
gradient.innerHTML='<stop offset="0%" stop-color="#fdf5ff"/><stop offset="19%" stop-color="#746c8b"/><stop offset="35%" stop-color="#eee7f6"/><stop offset="49%" stop-color="#ffffff"/><stop offset="51%" stop-color="#aaa1bf"/><stop offset="71%" stop-color="#6d6386"/><stop offset="86%" stop-color="#efe5ff"/><stop offset="100%" stop-color="#aaa0bd"/>';
$('.svg-library defs').append(gradient);

function packMarkup(pack,index,interactive=false) {
  return `<div class="pack ${pack.className}"><div class="pack-back" aria-hidden="true"></div><div class="pack-edge pack-edge-right" aria-hidden="true"></div><div class="pack-edge pack-edge-left" aria-hidden="true"></div><div class="pack-edge pack-edge-bottom" aria-hidden="true"></div><div class="pack-foil"></div><div class="pack-crimp"></div><div class="pack-print"><div class="pack-brand">LUCKY<br><span>PACK.</span></div><div class="pack-art"><span class="orbit"></span><svg aria-hidden="true"><use href="#icon-${pack.theme}"/></svg><span class="pack-spark" aria-hidden="true"><svg><use href="#icon-star"/></svg></span><span class="pack-spark two" aria-hidden="true"><svg><use href="#icon-star"/></svg></span></div></div><div class="pack-crimp bottom"></div>${interactive?'<div class="tear-strip" role="slider" tabindex="0" aria-label="봉인 뜯기. 오른쪽으로 드래그하거나 오른쪽 방향키를 누르세요" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="tear-progress"></span></div>':''}</div>`;
}

const stage = $('#pack-stage');
for (const [index,pack] of packs.entries()) {
  const button = document.createElement('button');
  button.className='pack-choice';
  button.style.setProperty('--pack-yaw',[-18,-10,-4,10,18][index]+'deg');
  button.setAttribute('aria-label',`${pack.korean} 팩 선택`);
  button.innerHTML=packMarkup(pack,index);
  button.addEventListener('click',()=>selectPack(index));
  stage.append(button);
}
initHoverEffects();

const opening=$('#opening-dialog');
const drawFortune=createFortuneDraw();
let selectedIndex=0,currentFortune=null,openingState='closed',drag=null,progress=0,revealTimer=null,lastFocus=null;
function selectPack(index){
  if(!opening.open)lastFocus=document.activeElement; selectedIndex=index; currentFortune=null; progress=0;drag=null; openingState='ready';
  opening.classList.remove('is-opening','is-revealed');
  $('#opening-title').textContent='열기';
  $('#opening-description').textContent='드래그 →';
  $('#selected-pack').innerHTML=packMarkup(packs[index],index,true);
  initHoverEffects($('#selected-pack'));
  $('#fortune-result').hidden=true;
  $('#instant-open').disabled=false;
  const strip=$('.tear-strip');
  strip.addEventListener('pointerdown',startDrag);
  strip.addEventListener('pointermove',moveDrag);
  strip.addEventListener('pointerup',endDrag);
  strip.addEventListener('pointercancel',cancelDrag);
  strip.addEventListener('lostpointercapture',()=>{if(drag)cancelDrag();});
  strip.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();setProgress(progress+25);if(progress>=100)openPack();}
    if(event.key==='ArrowLeft'){event.preventDefault();setProgress(progress-25);}
    if(event.key==='Enter'||event.key===' '){event.preventDefault();openPack();}
  });
  if(!opening.open)opening.showModal();
  document.body.style.overflow='hidden';
  
}
function setProgress(value){progress=Math.max(0,Math.min(100,value));const strip=$('.tear-strip');if(strip){strip.style.setProperty('--tear',progress+'%');strip.setAttribute('aria-valuenow',Math.round(progress));}}
function startDrag(event){
  if(openingState!=='ready'||(event.pointerType==='mouse'&&event.button!==0))return;
  event.preventDefault();
  drag={x:event.clientX,width:event.currentTarget.getBoundingClientRect().width,progress};
  event.currentTarget.setPointerCapture(event.pointerId);
}
function moveDrag(event){
  if(!drag||openingState!=='ready')return;
  setProgress(drag.progress+(event.clientX-drag.x)/drag.width*120);
  if(progress>=94){drag=null;openPack();}
}
function endDrag(){if(!drag)return;drag=null;if(progress>=76)openPack();else{setProgress(0);$('#opening-description').textContent='오른쪽으로 →';}}
function cancelDrag(){drag=null;if(openingState==='ready')setProgress(0);}
$('#instant-open').addEventListener('click',openPack);
function openPack(){
  if(openingState!=='ready')return;
  currentFortune=drawFortune();
  openingState='opening';drag=null;setProgress(100);$('#instant-open').disabled=true;opening.classList.add('is-opening');
  $('#opening-description').textContent='열리는 중';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  revealTimer=setTimeout(()=>{
    if(!opening.open)return;
    openingState='revealed';opening.classList.add('is-revealed');
    $('#opening-title').textContent='오늘의 운세';
    $('#opening-description').textContent='';
    renderResult();
    if(!reduced)burst();
  },reduced?80:850);
}
function cardMarkup(fortune){
  return `<div class="fortune-card"><div class="card-inner"><div class="card-art"><svg aria-hidden="true"><use href="#icon-${fortune.theme}"/></svg></div><h3 class="card-title">${fortune.title}</h3><p class="card-message">${fortune.message}</p></div></div>`;
}
function renderResult(){
  const section=$('#fortune-result');
  section.innerHTML=cardMarkup(currentFortune)+`<div class="result-actions"><button class="secondary-button" id="share-fortune">복사</button><button class="primary-button" id="choose-again">다시</button></div>`;
  section.dataset.fortuneId=currentFortune.id;
  section.hidden=false;
  initHoverEffects(section);
  $('#share-fortune').addEventListener('click',copyFortune);
  $('#choose-again').addEventListener('click',closeOpening);
}

async function copyFortune(){
  const f=currentFortune;const content=`${f.title}\n${f.message}`;
  try{await navigator.clipboard.writeText(content);toast('복사됨');}catch{
    const area=document.createElement('textarea');area.value=content;area.style.cssText='position:fixed;left:0;top:0;opacity:0';opening.append(area);area.select();let copied=false;try{copied=document.execCommand('copy');}catch{}area.remove();toast(copied?'복사됨':'복사 불가. 내용을 선택해 주세요.');
  }
}
function closeOpening(){clearTimeout(revealTimer);openingState='closed';drag=null;opening.close();document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus();}
$('.close-opening').addEventListener('click',closeOpening);
opening.addEventListener('cancel',event=>{event.preventDefault();closeOpening();});

let toastTimer;
function toast(message){clearTimeout(toastTimer);const host=opening.open?opening:document.body;host.append($('#toast'));$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2800);}

let particleFrame;
function burst(){
  cancelAnimationFrame(particleFrame);const canvas=$('#confetti'),ctx=canvas.getContext('2d');if(!ctx)return;
  const ratio=Math.min(devicePixelRatio||1,2),width=innerWidth,height=innerHeight;canvas.width=width*ratio;canvas.height=height*ratio;ctx.scale(ratio,ratio);
  const colors=['#b597dd','#e6b8ca','#a9d3c8','#d5bc7e','#ffffff'];
  const particles=Array.from({length:100},()=>({x:width*.5,y:height*.45,vx:(Math.random()-.5)*13,vy:(Math.random()-.7)*13,size:Math.random()*5+2,spin:Math.random()*6,color:colors[Math.floor(Math.random()*colors.length)],life:1}));
  let frame=0;
  function tick(){ctx.clearRect(0,0,width,height);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.09;p.vx*=.995;p.life-=.006;p.spin+=.06;ctx.save();ctx.globalAlpha=Math.max(0,p.life);ctx.translate(p.x,p.y);ctx.rotate(p.spin);ctx.fillStyle=p.color;if(p.size>5){ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(p.size*.3,-p.size*.3);ctx.lineTo(p.size,0);ctx.lineTo(p.size*.3,p.size*.3);ctx.lineTo(0,p.size);ctx.lineTo(-p.size*.3,p.size*.3);ctx.lineTo(-p.size,0);ctx.lineTo(-p.size*.3,-p.size*.3);ctx.closePath();ctx.fill();}else{ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);}ctx.restore();}frame++;if(frame<175&&opening.open)particleFrame=requestAnimationFrame(tick);else ctx.clearRect(0,0,width,height);}
  particleFrame=requestAnimationFrame(tick);
}
