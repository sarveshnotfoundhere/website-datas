const loader=document.querySelector('.loader');
const cursor=document.querySelector('.cursor');
const progress=document.querySelector('.progress span');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load',()=>{setTimeout(()=>loader?.classList.add('is-done'),450)});

let mx=window.innerWidth/2,my=window.innerHeight/2,cx=mx,cy=my;
window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
function cursorLoop(){
  cx+=(mx-cx)*0.16; cy+=(my-cy)*0.16;
  if(cursor) cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;
  requestAnimationFrame(cursorLoop);
}
if(!prefersReduced && window.matchMedia('(pointer:fine)').matches) cursorLoop();

document.querySelectorAll('.magnetic,.magnetic-card').forEach(el=>{
  el.addEventListener('pointerenter',()=>cursor?.classList.add('active'));
  el.addEventListener('pointerleave',()=>{cursor?.classList.remove('active');el.style.transform=''});
  el.addEventListener('pointermove',e=>{
    if(prefersReduced||!window.matchMedia('(pointer:fine)').matches)return;
    const r=el.getBoundingClientRect();
    const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
    const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
    el.style.transform=`translate3d(${dx*5}px,${dy*5}px,0)`;
  });
});

document.querySelectorAll('.cursor').forEach(el=>el.addEventListener('pointerenter',()=>el.classList.add('active')));

const sections=[...document.querySelectorAll('main section[id],main section')];
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
};
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();

const revealables=document.querySelectorAll('.section,.exp-item,.work-slide,.award-card,.education-row,.mini-grid div,.terminal');
if(!prefersReduced && 'IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-inview');io.unobserve(entry.target)}
  }),{threshold:.08,rootMargin:'0px 0px -6%'});
  revealables.forEach(el=>{el.classList.add('reveal');io.observe(el)});
}else revealables.forEach(el=>el.classList.add('is-inview'));

const works=document.querySelector('.works');
const track=document.querySelector('.works-track');
if(track&&!prefersReduced){
  works?.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX) && window.innerWidth>900){
      const atStart=track.scrollLeft<=0;
      const atEnd=track.scrollLeft+track.clientWidth>=track.scrollWidth-1;
      if((e.deltaY<0&&!atStart)||(e.deltaY>0&&!atEnd)){e.preventDefault();track.scrollLeft+=e.deltaY;}
    }
  },{passive:false});
}

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(!target)return;e.preventDefault();target.scrollIntoView({behavior:prefersReduced?'auto':'smooth'});
}));

document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>document.body.classList.add('navigating')));