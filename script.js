const storyPages = [
  "A veces m pongo a pensar en lo inmenso que es el universo. Existen miles de millones de estrellas, galaxias infinitas, planetas que jamás conoceremos y distancias que parecen imposibles de recorrer, y aún así, entre todo ese caos hermoso, nuestras vidas terminaron cruzándose.",
  "No sé si fue el destino, la suerte o alguna estrella caprichosa, pero agradezco cada día que eso haya pasado, pq quién diría que detrás de una pantalla iba a encontrar a una persona la cuál poco a poco se convirtió en mi lugar favorito.",
  "Alguien que hizo que mis días normales tengan un brillo diferente, que logra sacarme sonrisas incluso cuando todo parece apagado y que, sin darse cuenta, terminó ocupando un espacio demasiado grande en mi corazón.",
  "Sé que por ahora todo lo nuestro es virtual y que nos separan muchos kilómetros, pero hay algo que siempre he sentido desde que t empecé a amar, la distancia solo existe entre nuestros cuerpos, porque nuestras almas parecen haberse encontrado hace muchísimo tiempo.",
  "Cada llamada, cada mensaje, cada desvelo juntos y cada momento contigo han sido como pequeñas estrellas formando nuestra propia constelación, una que solo tú y yo entendemos.",
  "Contigo aprendí que no hace falta tocar una mano para sentir compañía, ni abrazar a alguien para sentir calor. A veces basta con un mensaje tuyo para que todo mi día cambie por completo.",
  "Eres esa estrella que aparece justo en el cielo oscuro, el planeta al que siempre quiero volver y el pedacito de universo donde mi corazón se siente en casa.",
  "Mientras más tiempo paso contigo, más m doy cuenta de que eres la persona con la que quiero seguir creando recuerdos, desvelándome, riéndome por tonterías, compartiendo mis días y soñando con ese momento en el que la distancia ya no exista, mi chikita.",
  "Ya sin seguir poniendo mucho texto y ya no alargarla más, quiero preguntarte algo, algo que haga que nos una un poco más y que sea un contrato entre los dos, el cuál cuidemos y busquemos en que sea bien bonito como todo lo que tú representas para mi."
];

const $ = id => document.getElementById(id);
const screens = [...document.querySelectorAll('.screen')];
const sleep = ms => new Promise(r => setTimeout(r, ms));
function show(id){ screens.forEach(s => s.classList.toggle('active', s.id === id)); }
function safePlay(audio, volume=.6){ audio.volume=volume; audio.play().catch(()=>{}); }

// Fondo vivo
const sky=$('sky');
for(let i=0;i<155;i++){
  const star=document.createElement('i'); star.className='star';
  star.style.left=Math.random()*100+'%'; star.style.top=Math.random()*100+'%';
  star.style.setProperty('--d',(1.8+Math.random()*4.5)+'s');
  star.style.setProperty('--o',(.18+Math.random()*.82).toFixed(2));
  const size=Math.random()<.12?3:2; star.style.width=size+'px'; star.style.height=size+'px';
  sky.appendChild(star);
}

// Carga
let load=0;
const loader=setInterval(()=>{
  load=Math.min(100,load+Math.ceil(Math.random()*6));
  $('loadingFill').style.height=load+'%'; $('loadingPercent').textContent=load+'%';
  if(load>=100){clearInterval(loader);setTimeout(()=>show('introScreen'),1000)}
},105);
$('introBtn').addEventListener('click',()=>{show('bookScreen');safePlay($('cuentoAudio'),.48)});

// Libro
const stage=$('pageStage');
storyPages.forEach((text,i)=>{
  const page=document.createElement('article'); page.className='page';
  page.innerHTML=`<div class="corner-spark">✦</div><p>${text}</p><span class="page-number">${i+1}</span>`;
  stage.appendChild(page);
});
const pages=[...document.querySelectorAll('.page')];
let pageIndex=0,opened=false,turning=false;
function renderPage(direction=1){
  pages.forEach((p,i)=>p.classList.toggle('current',i===pageIndex));
  const p=pages[pageIndex]; p.classList.remove('turn-in','turn-back-in'); void p.offsetWidth;
  p.classList.add(direction>0?'turn-in':'turn-back-in');
  $('prevBtn').disabled=pageIndex===0; $('pageCounter').textContent=`${pageIndex+1} / ${pages.length}`;
}
$('cover').addEventListener('click',async()=>{
  if(opened)return; opened=true; $('book').classList.add('opened');
  await sleep(1050); $('bookNav').classList.remove('hidden'); renderPage();
});
$('prevBtn').addEventListener('click',()=>turnPage(-1));
$('nextBtn').addEventListener('click',()=>turnPage(1));
function turnPage(direction){
  if(turning)return;
  if(direction<0&&pageIndex===0)return;
  if(direction>0&&pageIndex===pages.length-1){finishBook();return;}
  turning=true; safePlay($('paginaAudio'),.42);
  const old=pages[pageIndex]; old.classList.add(direction>0?'turn-out':'turn-back-out');
  setTimeout(()=>{
    old.classList.remove('current','turn-out','turn-back-out'); pageIndex+=direction; renderPage(direction); turning=false;
  },770);
}
async function finishBook(){
  if(turning)return; turning=true; $('bookNav').classList.add('hidden'); $('book').classList.add('closing');
  await sleep(1150); resetNoButton(); show('proposalScreen'); $('proposalLead').classList.remove('fade'); $('proposalCard').classList.remove('show');
  await sleep(1600); $('proposalLead').classList.add('fade'); await sleep(850); $('proposalCard').classList.add('show'); await sleep(1050); noReady=true;
  turning=false;
}

// Botón No: nace junto al Sí y huye dentro de la pantalla sin saltos raros
const noBtn=$('noBtn');
const proposalActions=$('proposalActions');
const taunts=['GG EZ','Que bobita','🤣🤣🤣','Papi es papi 😎','Eres mía ya','¿Qué haces?','Me estoy enojando 😤','Payasa','Ya dale al sí 💔'];
let tauntIndex=0,noReady=false,noPlaceholder=null;
function resetNoButton(){
  noReady=false;tauntIndex=0;noBtn.className='no-btn';noBtn.removeAttribute('style');
  if(noPlaceholder){noPlaceholder.remove();noPlaceholder=null}
  proposalActions.appendChild(noBtn);noBtn.hidden=false;
}
function beginNoEscape(){
  if(!noReady)return false;
  if(noBtn.classList.contains('fleeing'))return true;
  const r=noBtn.getBoundingClientRect();
  noPlaceholder=document.createElement('span');noPlaceholder.className='no-placeholder';
  noPlaceholder.style.width=r.width+'px';noPlaceholder.style.height=r.height+'px';
  proposalActions.appendChild(noPlaceholder);
  document.body.appendChild(noBtn);
  noBtn.classList.add('fleeing');
  Object.assign(noBtn.style,{width:r.width+'px',height:r.height+'px',left:r.left+'px',top:r.top+'px'});
  return true;
}
function moveNo(e){
  if(!noReady)return;if(e)e.preventDefault();if(!beginNoEscape())return;
  const margin=18,w=noBtn.offsetWidth,h=noBtn.offsetHeight;
  const maxX=Math.max(margin,innerWidth-w-margin),maxY=Math.max(margin,innerHeight-h-margin);
  const yes=$('yesBtn').getBoundingClientRect();let x,y,tries=0;
  do{ x=margin+Math.random()*(maxX-margin); y=margin+Math.random()*(maxY-margin); tries++; }
  while(tries<30 && (Math.hypot(x+w/2-(yes.left+yes.width/2),y+h/2-(yes.top+yes.height/2))<190 || y<65));
  noBtn.style.left=Math.round(x)+'px';noBtn.style.top=Math.round(y)+'px';
  const t=document.createElement('div');t.className='taunt';t.textContent=taunts[Math.min(tauntIndex++,taunts.length-1)];
  t.style.left=Math.max(8,Math.min(innerWidth-150,x))+'px';t.style.top=Math.max(8,y-42)+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),1050);
}
noBtn.addEventListener('pointerenter',moveNo);
noBtn.addEventListener('pointerdown',moveNo,{passive:false});
addEventListener('resize',()=>{if(noBtn.classList.contains('fleeing'))moveNo()});

$('yesBtn').addEventListener('click',async()=>{
  noBtn.hidden=true;$('cuentoAudio').pause();safePlay($('musicaAudio'),.74);show('yesTransitionScreen');
  await sleep(350);$('yesLine1').classList.add('show');await sleep(1750);$('yesLine2').classList.add('show');
  await sleep(1350);$('brokenHeart').classList.add('show');await sleep(1750);show('gameIntroScreen');
});

// Animador de sprites por cuadros reales
const spriteSets={
  girlBasketFront:['girl_basket_front_v2_0.png','girl_basket_front_v2_1.png','girl_basket_front_v2_2.png','girl_basket_front_v2_3.png'],
  cineGirlHold:['cine_girl_hold_0.png','cine_girl_hold_1.png','cine_girl_hold_2.png','cine_girl_hold_3.png'],
  cineGirlOffer:['cine_girl_offer_0.png','cine_girl_offer_1.png','cine_girl_offer_2.png','cine_girl_offer_3.png'],
  cineGirlIdle:['cine_girl_idle_0.png','cine_girl_idle_1.png','cine_girl_idle_2.png','cine_girl_idle_3.png'],
  cineGirlBack:['cine_girl_back_0.png','cine_girl_back_1.png','cine_girl_back_2.png','cine_girl_back_3.png'],
  cineBoyIdle:['cine_boy_idle_0.png','cine_boy_idle_1.png','cine_boy_idle_2.png','cine_boy_idle_3.png'],
  cineBoyReceive:['cine_boy_receive_0.png','cine_boy_receive_1.png','cine_boy_receive_2.png','cine_boy_receive_3.png'],
  cineBoyBack:['cine_boy_back_0.png','cine_boy_back_1.png','cine_boy_back_2.png','cine_boy_back_3.png'],
  coupleBenchV3:['couple_bench_v3_0.png','couple_bench_v3_1.png','couple_bench_v3_2.png','couple_bench_v3_3.png']
}
const animators=new WeakMap();
function animateSprite(img,setName,fps=7){
  const old=animators.get(img);if(old)clearInterval(old);
  const frames=spriteSets[setName],base='sprites/';let i=0;img.src=base+frames[0];
  if(frames.length>1){const timer=setInterval(()=>{i=(i+1)%frames.length;img.src=base+frames[i]},1000/fps);animators.set(img,timer)}
}

// Minijuego: dirección visible, canasta real y ritmo cómodo para leer
const TOTAL=12;
const phrases=['Tu sonrisa ✨','Tus ojitos 💕','Tu voz 🌙','Tu paciencia y tus celos locos 🌸','Tu forma de quererme ❤️','Tus desvelos conmigo ⭐','Tu compañía 🌌','Tu manera de alegrar mis días ☀️','Tus abrazos pendientes...','Tu ternura 💗','Todo lo que eres 💖','La última pieza siempre fuiste tú ❤️'];
let running=false,collected=0,playerX=0,dir=0,last=0,spawnClock=0,pieces=[],raf=0,lastPlayerSet='',nextAllowedSpawn=0;
$('startGameBtn').addEventListener('click',startGame);
function setPlayerAnim(name){if(lastPlayerSet===name)return;lastPlayerSet=name;animateSprite($('player').querySelector('img'),'girlBasketFront',6)}
function startGame(){
  show('gameScreen');running=true;collected=0;pieces.forEach(p=>p.el.remove());pieces=[];lastPlayerSet='';dir=0;setPlayerAnim('girlBasketFront');
  $('player').classList.remove('face-left','walking');
  $('heartFill').style.clipPath='inset(100% 0 0 0)';$('heartCracks').style.opacity='.5';$('gameMessage').textContent='Atrapa cada pedacito ✨';
  requestAnimationFrame(()=>{playerX=($('gameArea').clientWidth-$('player').offsetWidth)/2;positionPlayer();last=performance.now();spawnClock=500;nextAllowedSpawn=0;raf=requestAnimationFrame(loop)});
}
function positionPlayer(){
  const player=$('player');player.style.left=playerX+'px';
  player.classList.toggle('walking',dir!==0);
  // Mantiene la vista frontal al moverse; solo cambia el balanceo del cuerpo.
  setPlayerAnim('girlBasketFront');
}
function basketPoint(){
  const pr=$('player').getBoundingClientRect();
  // La canasta permanece centrada porque el personaje siempre mira al frente.
  const x=pr.left+pr.width*.50;
  return {x,y:pr.top+pr.height*.57,w:42,h:26};
}
function spawnOnePiece(x,delay=0){
  const el=document.createElement('div');el.className='heart-piece '+(Math.random()<.5?'fragment-left':'fragment-right');el.innerHTML='<span></span>';
  el.style.left=x+'px';el.style.top=(-55-delay*.15)+'px';$('gameArea').appendChild(el);
  pieces.push({el,x,y:-55-delay*.15,speed:255+Math.random()*35,rot:(Math.random()-.5)*8,drift:(Math.random()-.5)*7,wave:Math.random()*6.28,delay});
}
function spawnPiece(){
  const areaW=$('gameArea').clientWidth, margin=Math.max(44,areaW*.08);
  const available=Math.max(1,TOTAL-collected-pieces.length);
  const count = Math.min(available, 2);
  const minGap=Math.min(210,Math.max(125,areaW*.24));
  let x1=margin+Math.random()*(areaW-margin*2);
  spawnOnePiece(x1,0);
  if(count>=2){
    let x2,tries=0;
    do{x2=margin+Math.random()*(areaW-margin*2);tries++}while(Math.abs(x2-x1)<minGap&&tries<40);
    if(Math.abs(x2-x1)<minGap)x2=x1<areaW/2?Math.min(areaW-margin,x1+minGap):Math.max(margin,x1-minGap);
    spawnOnePiece(x2,150);
    if(count===3){
      let x3,tries3=0;
      do{x3=margin+Math.random()*(areaW-margin*2);tries3++}while((Math.abs(x3-x1)<minGap*.72||Math.abs(x3-x2)<minGap*.72)&&tries3<60);
      if(tries3>=60)x3=areaW/2;
      spawnOnePiece(x3,300);
    }
  }
}
function loop(now){
  if(!running)return;const dt=Math.min(.034,(now-last)/1000);last=now;
  playerX=Math.max(0,Math.min($('gameArea').clientWidth-$('player').offsetWidth,playerX+dir*260*dt));positionPlayer();
  spawnClock-=dt*1000;
  if(spawnClock<=0&&pieces.length===0&&now>=nextAllowedSpawn){spawnPiece();spawnClock=999999}
  const area=$('gameArea').getBoundingClientRect(),basket=basketPoint();
  for(let i=pieces.length-1;i>=0;i--){
    const p=pieces[i];if(p.delay>0){p.delay-=dt*1000;continue}p.y+=p.speed*dt;p.wave+=dt*2.3;p.x+=p.drift*dt+Math.sin(p.wave)*8*dt;p.rot+=18*dt;
    p.el.style.left=p.x+'px';p.el.style.transform=`translateY(${p.y}px) rotate(${p.rot}deg)`;
    const r=p.el.getBoundingClientRect();
    // Se recoge justo al cruzar la abertura de la canasta y se anima hacia dentro.
    if(r.right>basket.x-basket.w/2&&r.left<basket.x+basket.w/2&&r.bottom>basket.y&&r.top<basket.y+basket.h){catchPiece(p,i,basket);continue}
    if(r.top>area.bottom){p.el.remove();pieces.splice(i,1);spawnClock=320}
  }
  raf=requestAnimationFrame(loop);
}
function catchPiece(p,i,basket){
  pieces.splice(i,1);collected++;
  const area=$('gameArea').getBoundingClientRect(),r=p.el.getBoundingClientRect();
  p.el.classList.add('basket-caught');
  p.el.style.setProperty('--catch-x',(basket.x-(r.left+r.width/2))+'px');
  p.el.style.setProperty('--catch-y',(basket.y-(r.top+r.height/2)+8)+'px');
  setTimeout(()=>p.el.remove(),470);
  $('heartFill').style.clipPath=`inset(${100-collected/TOTAL*100}% 0 0 0)`;$('heartCracks').style.opacity=String(.5*(1-collected/TOTAL));
  $('gameMessage').classList.remove('message-pop');void $('gameMessage').offsetWidth;$('gameMessage').textContent=phrases[collected-1];$('gameMessage').classList.add('message-pop');
  burst(basket.x-area.left,basket.y-area.top+10);if(navigator.vibrate)navigator.vibrate(22);
  if(collected>=TOTAL){running=false;cancelAnimationFrame(raf);dir=0;setPlayerAnim('girlBasketFront');$('heartCracks').style.opacity='0';setTimeout(()=>startCinematic(playerX),1500)}
  else{ // tiempo de lectura entre cada mensaje, sin hacer lenta la caída
    nextAllowedSpawn=performance.now()+1450;spawnClock=1450;
  }
}
function burst(x,y){for(let i=0;i<10;i++){const s=document.createElement('b');s.className='spark';s.textContent=i%2?'✦':'·';s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--x',(Math.random()*110-55)+'px');s.style.setProperty('--y',(Math.random()*-95-18)+'px');$('gameArea').appendChild(s);setTimeout(()=>s.remove(),820)}}
function bindMove(btn,value){btn.addEventListener('pointerdown',e=>{e.preventDefault();dir=value});['pointerup','pointercancel','pointerleave'].forEach(t=>btn.addEventListener(t,()=>{if(dir===value)dir=0}))}
bindMove($('leftBtn'),-1);bindMove($('rightBtn'),1);
addEventListener('keydown',e=>{if(!running)return;if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')dir=-1;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')dir=1});
addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key))dir=0});

// Cinemática reconstruida V8.6: corazón interno y transiciones estables
function moveTo(el,x,duration=1400){
  const from=parseFloat(el.style.left)||0;
  return new Promise(resolve=>{
    const st=performance.now();
    function f(now){
      const p=Math.min(1,(now-st)/duration);
      const q=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      el.style.left=(from+(x-from)*q)+'px';
      if(p<1)requestAnimationFrame(f);else resolve();
    }
    requestAnimationFrame(f);
  });
}
async function caption(text,ms=1000){
  const c=$('cinematicCaption');
  c.textContent=text;c.classList.add('show');
  await sleep(ms);c.classList.remove('show');await sleep(350);
}
async function actorSpeech(world,actor,text,ms=1800,extraClass=''){
  const bubble=document.createElement('div');
  bubble.className=`speech-bubble actor-speech ${extraClass}`.trim();
  bubble.textContent=text;
  world.appendChild(bubble);
  const place=()=>{
    const wr=world.getBoundingClientRect();
    const ar=actor.getBoundingClientRect();
    bubble.style.left=(ar.left-wr.left+ar.width/2)+'px';
    bubble.style.top=Math.max(18,ar.top-wr.top-56)+'px';
  };
  place();
  await sleep(ms);
  bubble.classList.add('hide');
  await sleep(750);
  bubble.remove();
}
async function fadeScene(world,fn){
  world.classList.add('scene-fade');
  await sleep(1500);
  fn();
  await sleep(250);
  world.classList.remove('scene-fade');
  await sleep(1600);
}
function worldPoint(world,actor,rx,ry){
  const wr=world.getBoundingClientRect();
  const r=actor.getBoundingClientRect();
  return {x:r.left-wr.left+r.width*rx,y:r.top-wr.top+r.height*ry};
}
function createStableHeart(world){
  const old=$('heartV86');if(old)old.remove();
  const h=document.createElement('div');
  h.id='heartV86';h.className='heart-v86';h.textContent='♥';
  world.appendChild(h);return h;
}
function setHeartPoint(heart,pt,scale=1,opacity=1){
  heart.style.left=pt.x+'px';heart.style.top=pt.y+'px';
  heart.style.transform=`translate(-50%,-50%) scale(${scale})`;
  heart.style.opacity=String(opacity);
}
function animateHeart(heart,from,to,duration=1500,fromScale=1,toScale=1){
  return new Promise(resolve=>{
    const st=performance.now();
    function frame(now){
      const p=Math.min(1,(now-st)/duration);
      const q=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      const x=from.x+(to.x-from.x)*q;
      const y=from.y+(to.y-from.y)*q;
      const sc=fromScale+(toScale-fromScale)*q;
      setHeartPoint(heart,{x,y},sc,1);
      if(p<1)requestAnimationFrame(frame);else resolve();
    }
    requestAnimationFrame(frame);
  });
}
async function startCinematic(gameEndX){
  show('cinematicScreen');
  await sleep(400);
  const world=document.querySelector('.cinematic-world');
  const girl=$('girlActor'),boy=$('boyActor');
  const gimg=$('girlSprite'),bimg=$('boySprite');
  const bench=$('benchCouple');
  const legacyHeart=$('cinematicHeart');
  legacyHeart.style.display='none';legacyHeart.style.opacity='0';
  const oldHands=$('joinedHands');if(oldHands)oldHands.remove();
  document.querySelectorAll('.speech-bubble,.heart-v86').forEach(e=>e.remove());
  world.classList.remove('scene-fade','final-zoom','world-heart-return');
  girl.className='actor girl-actor';boy.className='actor boy-actor';
  girl.style.opacity='1';boy.style.opacity='1';
  girl.style.transform='none';boy.style.transform='none';
  girl.style.marginLeft='0';boy.style.marginLeft='0';
  bench.classList.remove('show');
  $('finalPhrase').classList.remove('show');
  const ww=world.clientWidth,gw=girl.offsetWidth,bw=boy.offsetWidth;
  const ratio=Math.max(0,Math.min(1,gameEndX/Math.max(1,$('gameArea').clientWidth)));
  const startGX=Math.max(.08*ww,Math.min(.30*ww,ratio*ww))-gw/2;
  const startBX=.74*ww-bw/2;
  Object.assign(girl.style,{left:startGX+'px',bottom:'12%'});
  Object.assign(boy.style,{left:startBX+'px',bottom:'12%'});
  animateSprite(gimg,'cineGirlHold',5);
  animateSprite(bimg,'cineBoyIdle',4);
  const heart=createStableHeart(world);
  await caption('Lo reconstruiste pedacito a pedacito...',2100);
  await sleep(900);

  // El corazón nace dentro del escenario, exactamente frente al pecho de ella.
  let held=worldPoint(world,girl,.50,.57);
  setHeartPoint(heart,held,.76,0);
  requestAnimationFrame(()=>heart.classList.add('show'));
  await sleep(1900);

  // Ella se acerca sin canasta y mantiene el mismo diseño.
  const meetG=.405*ww-gw/2;
  const meetB=.595*ww-bw/2;
  girl.classList.add('front-walk');
  await moveTo(girl,meetG,3400);
  girl.classList.remove('front-walk');
  await moveTo(boy,meetB,1800);
  animateSprite(gimg,'cineGirlOffer',4);
  await sleep(1400);

  // Entrega visible: manos de ella -> punto medio -> pecho de él.
  const from=worldPoint(world,girl,.62,.61);
  const gHand=worldPoint(world,girl,.72,.62);
  const bHand=worldPoint(world,boy,.28,.62);
  const middle={x:(gHand.x+bHand.x)/2,y:(gHand.y+bHand.y)/2};
  setHeartPoint(heart,from,.9,1);
  // Pequeña pausa nerviosa antes de entregarlo.
  girl.classList.add('gaze-down');
  await sleep(950);
  girl.classList.remove('gaze-down');
  await sleep(420);
  await actorSpeech(world,girl,'ten',1500,'speech-girl');
  await animateHeart(heart,from,middle,3000,.9,1);
  heart.classList.add('pulse');
  await sleep(1800);
  heart.classList.remove('pulse');
  animateSprite(bimg,'cineBoyReceive',4);
  const chest=worldPoint(world,boy,.50,.52);
  await animateHeart(heart,middle,chest,3600,1,.72);

  // Entrada real: se encoge sobre el pecho, destella y desaparece ahí mismo.
  boy.classList.add('chest-flash');world.classList.add('world-heart-return');
  await heart.animate([
    {transform:'translate(-50%,-50%) translateY(0) scale(.72)',opacity:1,clipPath:'inset(0 0 0 0)',filter:'drop-shadow(0 0 8px #fff) drop-shadow(0 0 22px #ff5d9c)',offset:0},
    {transform:'translate(-50%,-50%) translateY(0) scale(.94)',opacity:1,clipPath:'inset(0 0 0 0)',offset:.16},
    {transform:'translate(-50%,-50%) translateY(1px) scale(.72)',opacity:1,clipPath:'inset(0 0 0 0)',offset:.31},
    {transform:'translate(-50%,-50%) translateY(2px) scale(.90)',opacity:1,clipPath:'inset(0 0 0 0)',offset:.45},
    {transform:'translate(-50%,-50%) translateY(5px) scale(.60)',opacity:1,clipPath:'inset(0 0 32% 0)',filter:'drop-shadow(0 0 16px #fff) drop-shadow(0 0 31px #ff4f96)',offset:.67},
    {transform:'translate(-50%,-50%) translateY(8px) scale(.34)',opacity:.9,clipPath:'inset(0 0 58% 0)',filter:'drop-shadow(0 0 20px #fff) drop-shadow(0 0 38px #ff4f96)',offset:.84},
    {transform:'translate(-50%,-50%) translateY(11px) scale(.04)',opacity:0,clipPath:'inset(0 0 88% 0)',filter:'blur(4px) drop-shadow(0 0 30px #fff)',offset:1}
  ],{duration:5400,easing:'cubic-bezier(.22,.72,.18,1)',fill:'forwards'}).finished;
  heart.remove();
  await sleep(1500);
  boy.classList.remove('chest-flash');world.classList.remove('world-heart-return');
  animateSprite(gimg,'cineGirlIdle',5);animateSprite(bimg,'cineBoyIdle',4);
  await actorSpeech(world,boy,'muchas gracias, mi bonita',2300,'speech-boy');
  await sleep(900);

  // Besito sugerido con sonrojo y un fundido sentimental.
  const kissG=.468*ww-gw/2,kissB=.532*ww-bw/2;
  girl.classList.add('blushing');boy.classList.add('blushing');
  await sleep(850);
  await Promise.all([moveTo(girl,kissG,1900),moveTo(boy,kissB,1900)]);
  await sleep(900);
  world.classList.add('scene-fade');
  await sleep(1600);
  const kissText=document.createElement('div');
  kissText.className='dark-kiss-text';kissText.textContent='besito*';
  world.appendChild(kissText);
  await sleep(1900);
  kissText.classList.add('hide');
  await sleep(650);
  kissText.remove();
  world.classList.remove('scene-fade');
  await sleep(1800);
  // Se quedan cerquita y sonrojados un instante, sin hablar.
  await sleep(1500);

  // Antes del primer fundido avanzan juntos unos segundos.
  await Promise.all([
    moveTo(girl,Math.max(24,kissG-90),2200),
    moveTo(boy,Math.max(88,kissB-90),2200)
  ]);
  await sleep(500);

  // Fundidos lentos. Aparecen muy juntos para que la pose se lea como mano tomada,
  // sin líneas ni brazos generados por CSS.
  await fadeScene(world,()=>{
    girl.style.left=(.405*ww-gw/2)+'px';boy.style.left=(.485*ww-bw/2)+'px';
    // El sonrojo desaparece justo cuando se dan la vuelta para ir a la banca.
    girl.classList.remove('blushing');boy.classList.remove('blushing');
    animateSprite(gimg,'cineGirlBack',4);animateSprite(bimg,'cineBoyBack',4);
    girl.classList.add('couple-close');boy.classList.add('couple-close');
  });
  await sleep(900);
  await fadeScene(world,()=>{
    girl.style.left=(.29*ww-gw/2)+'px';boy.style.left=(.37*ww-bw/2)+'px';
  });
  await fadeScene(world,()=>{
    girl.style.left=(.18*ww-gw/2)+'px';boy.style.left=(.26*ww-bw/2)+'px';
  });
  await fadeScene(world,()=>{
    girl.style.opacity='0';boy.style.opacity='0';
    bench.src='sprites/couple_bench_v3_0.png';
    bench.classList.add('show');
    animateSprite(bench,'coupleBenchV3',3.2);
  });
  await sleep(2400);
  const bubbleGirl=document.createElement('div');
  bubbleGirl.className='speech-bubble bubble-girl';bubbleGirl.textContent='te amo, amor..';
  world.appendChild(bubbleGirl);await sleep(2700);bubbleGirl.classList.add('hide');await sleep(900);bubbleGirl.remove();
  const bubbleBoy=document.createElement('div');
  bubbleBoy.className='speech-bubble bubble-boy';bubbleBoy.textContent='yo más, mi princesita';
  world.appendChild(bubbleBoy);await sleep(2700);bubbleBoy.classList.add('hide');await sleep(900);bubbleBoy.remove();
  world.classList.add('final-zoom');await sleep(1600);$('finalPhrase').classList.add('show');
}
