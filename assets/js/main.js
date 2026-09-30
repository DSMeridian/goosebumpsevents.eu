function si(id,src,bg){var e=document.getElementById(id);if(!e)return;if(bg)e.style.backgroundImage="url('"+bg+"')";else if(src)e.src=src;}

/* inject immediately — script is at end of body */
si('ll',IMGS.logo); si('nlogo',IMGS.logo); si('flogo',IMGS.logo);
si('hfloat',IMGS.hfloat); si('hbg1',null,IMGS.hero); si('hbg2',null,IMGS.hero2||IMGS.hero);
si('aimg1',IMGS.wimga); si('aimg2',IMGS.wimg_b||IMGS.wimga);
si('wimg1',IMGS.about); si('wimg2',IMGS.about2||IMGS.about);
si('pb1bg',null,IMGS.pb1); for(var i=1;i<=12;i++) si('g'+i,IMGS['g'+i]);
si('t1',IMGS.t1); si('t2',IMGS.t2); si('t3',IMGS.t3); si('t4',IMGS.t4); si('t5',IMGS.t5); si('t6',IMGS.t6);

/* ── TRANSLATIONS ── */
var LNG='en', CURRT=0;
function t(k){return(TR[LNG]&&TR[LNG][k])||TR.en[k]||k;}
function applyTr(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n'),v=t(k);
    if(!v||v===k)return;
    el.innerHTML=v;
  });
  showT(CURRT);
  document.documentElement.lang=LNG;
  document.querySelectorAll('.lb').forEach(function(b){b.classList.toggle('on',b.textContent.trim().toLowerCase()===LNG);});
}
function setLang(l){LNG=l;applyTr();}

/* ── LOADER ── */
var loaderShownAt = Date.now();
var MIN_LOADER_MS = 1200;

function hideLoader(){
  var l=document.getElementById('loader');
  if(!l||l.classList.contains('out'))return;
  var elapsed = Date.now() - loaderShownAt;
  var remaining = Math.max(0, MIN_LOADER_MS - elapsed);
  setTimeout(function(){
    l.classList.add('out');
    document.body.style.overflow='';
  }, remaining);
}
/* Block scroll until loader gone */
document.body.style.overflow='hidden';
/* All content is embedded — DOMContentLoaded fires as soon as HTML is parsed,
   no need to wait for external fonts (Google Fonts) which delays window.load */
if(document.readyState==='complete'||document.readyState==='interactive'){
  hideLoader();
} else {
  document.addEventListener('DOMContentLoaded', hideLoader);
  /* Hard fallback — catches any edge case */
  setTimeout(hideLoader, 2500);
}

/* ── SCROLL PROGRESS ── */
var prog=document.getElementById('prog');
function updateProg(){/* handled in handleScroll */}

/* ── PARALLAX ── */
var NO_PARALLAX = window.matchMedia && window.matchMedia('(hover:none),(pointer:coarse),(max-width:768px)').matches;
function doParallax(sy){
  sy = sy !== undefined ? sy : (window.pageYOffset||0);
  if(NO_PARALLAX) return;
  /* Hero background layers */
  var hbg1=document.getElementById('hbg1');
  var hbg2=document.getElementById('hbg2');
  if(hbg1) hbg1.style.transform='translateY('+(sy*0.4)+'px)';
  if(hbg2) hbg2.style.transform='translateY('+(sy*0.2)+'px)';
  /* Hero content — subtle upward drift only */
  var hc=document.getElementById('hero-content');
  if(hc&&sy<window.innerHeight){
    hc.style.transform='translateY('+(sy*0.15)+'px)';
    hc.style.opacity=Math.max(0,1-sy/(window.innerHeight*0.75));
  }
  /* Photo breaks */
  document.querySelectorAll('.photo-break-bg').forEach(function(el){
    var spd=parseFloat(el.dataset.speed)||0.3;
    var rect=el.closest('.photo-break').getBoundingClientRect();
    var offset=rect.top+sy;
    el.style.transform='translateY('+((sy-offset)*spd)+'px)';
  });
}

function handleScroll(){
  var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
  /* Progress bar */
  try{
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if(prog) prog.style.width = (max > 0 ? (sy/max*100) : 0) + '%';
  }catch(e){}
  /* Nav sticky */
  var navEl = document.getElementById('nav');
  if(navEl){
    if(sy > 60){
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  }
  /* Parallax */
  try{ doParallax(sy); }catch(e){}
}
window.addEventListener('scroll', handleScroll, {passive:true});
/* Run once on load to set correct state */
handleScroll();

/* ── CURSOR ── */
var cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){
  mx=e.clientX;my=e.clientY;
  if(cur){cur.style.left=mx+'px';cur.style.top=my+'px';}
  /* Aurora */
  var hero=document.getElementById('hero');
  if(hero){var r=hero.getBoundingClientRect();if(my>=r.top&&my<=r.bottom){var haur=document.getElementById('haur');if(haur){haur.style.setProperty('--ax',(mx-r.left)+'px');haur.style.setProperty('--ay',(my-r.top)+'px');}}}
});
(function animR(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}requestAnimationFrame(animR);})();
document.addEventListener('mouseover',function(e){
  var el=e.target.closest('a,button,label,.sc,.gi,.tc,.stat,.lb,.why-item,.step,.gcms-sch');
  if(el){if(cur)cur.style.transform='translate(-50%,-50%) scale(2.2)';if(ring){ring.style.width='56px';ring.style.height='56px';ring.style.borderColor='rgba(123,108,196,.75)';}}
  else{if(cur)cur.style.transform='translate(-50%,-50%) scale(1)';if(ring){ring.style.width='34px';ring.style.height='34px';ring.style.borderColor='rgba(123,108,196,.45)';}}
});

/* ── PARTICLES ── */
var canvas=document.getElementById('ptcl');
if(canvas){
  var ctx=canvas.getContext('2d'),W,H,ptcls=[];
  function rsz(){W=canvas.width=canvas.offsetWidth||window.innerWidth;H=canvas.height=canvas.offsetHeight||window.innerHeight;}
  rsz();window.addEventListener('resize',rsz);
  function P(){this.r(true);}
  P.prototype.r=function(i){this.x=Math.random()*W;this.y=i?Math.random()*H:H+4;this.s=Math.random()*1.3+.2;this.vx=(Math.random()-.5)*.3;this.vy=-Math.random()*.45-.08;this.o=Math.random()*.5+.1;this.l=0;this.m=Math.random()*300+130;this.h=Math.random()>.6?258:248;};
  P.prototype.u=function(){this.x+=this.vx;this.y+=this.vy;this.l++;if(this.l>this.m||this.y<-4)this.r(false);};
  P.prototype.d=function(){var f=this.l<30?this.l/30:this.l>this.m-30?(this.m-this.l)/30:1;ctx.beginPath();ctx.arc(this.x,this.y,this.s,0,Math.PI*2);ctx.fillStyle='hsla('+this.h+',56%,65%,'+(this.o*f)+')';ctx.fill();};
  for(var i=0;i<100;i++)ptcls.push(new P());
  (function anim(){ctx.clearRect(0,0,W,H);ptcls.forEach(function(p){p.u();p.d();});requestAnimationFrame(anim);})();
}

/* ── SCROLL REVEAL — IntersectionObserver ── */
var saEls=document.querySelectorAll('.sa');
var saObs=new IntersectionObserver(function(ents){ents.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');saObs.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
saEls.forEach(function(el){saObs.observe(el);});

/* ── 3D TILT ── */
document.querySelectorAll('.stat').forEach(function(el){
  el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5;var y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(500px) rotateX('+(-y*12)+'deg) rotateY('+(x*12)+'deg) scale(1.05)';});
  el.addEventListener('mouseleave',function(){el.style.transform='';});
});

/* ── COUNTER ANIMATION ── */
var cntObs=new IntersectionObserver(function(ents){ents.forEach(function(e){if(e.isIntersecting){var ns=e.target.querySelectorAll('.stat-n, .num-val');ns.forEach(function(n){var tx=n.textContent,m=tx.match(/([0-9]+)(.*)/);if(m){var tg=parseInt(m[1]),sf=m[2],st=performance.now();(function tick(now){var pg=Math.min((now-st)/1400,1),ea=1-Math.pow(1-pg,3);n.textContent=Math.floor(ea*tg)+sf;if(pg<1)requestAnimationFrame(tick);else n.textContent=tg+sf;})(performance.now());}});cntObs.unobserve(e.target);}});},{threshold:.5});
document.querySelectorAll('#about .stats-row,#numbers').forEach(function(el){cntObs.observe(el);});

/* ── SERVICE SPOTLIGHT ── */
var spot=document.getElementById('svc-spot'),sg=document.querySelector('.sg');
if(spot&&sg){
  var sgp=sg.parentElement;
  sgp.style.position='relative';
  sgp.addEventListener('mousemove',function(e){var r=sgp.getBoundingClientRect();spot.style.setProperty('--sx',(e.clientX-r.left)+'px');spot.style.setProperty('--sy',(e.clientY-r.top)+'px');});
  sgp.addEventListener('mouseleave',function(){spot.style.setProperty('--sx','-999px');});
}

/* ── RIPPLE on service cards ── */
document.querySelectorAll('.sc').forEach(function(card){
  card.addEventListener('click',function(e){
    var r=card.getBoundingClientRect();
    var rip=document.createElement('div');rip.className='ripple';
    rip.style.cssText='position:absolute;left:'+(e.clientX-r.left)+'px;top:'+(e.clientY-r.top)+'px;width:80px;height:80px;margin-left:-40px;margin-top:-40px;pointer-events:none;';
    card.appendChild(rip);setTimeout(function(){rip.remove();},750);
  });
});

/* ── GALLERY LIGHTBOX with arrows + keyboard ── */
var galImgs=[],lbIdx=0;
document.querySelectorAll('.gi img').forEach(function(img,i){galImgs.push(img);});
document.querySelectorAll('.gi').forEach(function(item,i){item.addEventListener('click',function(){openLB(i);});});
function openLB(idx){
  lbIdx=idx;
  var existing=document.getElementById('lb');if(existing)existing.remove();
  var lb=document.createElement('div');lb.id='lb';
  lb.style.cssText='position:fixed;inset:0;background:rgba(5,5,7,.97);z-index:3000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(18px);';
  var img=document.createElement('img');img.style.cssText='max-width:90vw;max-height:88vh;object-fit:contain;border-radius:2px;box-shadow:0 0 80px rgba(85,69,165,.4);transition:opacity .25s;';
  var close=mkBtn('\u00d7','top:1.4rem;right:1.4rem;font-size:1.4rem;');
  var prev=mkBtn('\u2039','left:1.4rem;top:50%;transform:translateY(-50%);font-size:1.8rem;');
  var next=mkBtn('\u203a','right:1.4rem;top:50%;transform:translateY(-50%);font-size:1.8rem;');
  function mkB(el){lb.appendChild(el);}
  lb.appendChild(img);lb.appendChild(close);lb.appendChild(prev);lb.appendChild(next);
  close.onclick=function(){lb.remove();};
  prev.onclick=function(e){e.stopPropagation();lbIdx=(lbIdx-1+galImgs.length)%galImgs.length;setLBImg();};
  next.onclick=function(e){e.stopPropagation();lbIdx=(lbIdx+1)%galImgs.length;setLBImg();};
  lb.onclick=function(e){if(e.target===lb)lb.remove();};
  document.body.appendChild(lb);
  setLBImg();
  function setLBImg(){img.style.opacity='0';setTimeout(function(){if(galImgs[lbIdx])img.src=galImgs[lbIdx].src;img.style.opacity='1';},150);}
}
function mkBtn(html,extra){
  var b=document.createElement('button');
  b.innerHTML=html;
  b.style.cssText='position:absolute;'+extra+'width:44px;height:44px;border:1px solid rgba(123,108,196,.45);border-radius:2px;background:rgba(5,5,7,.82);color:#F7F5FF;cursor:pointer;display:flex;align-items:center;justify-content:center;';
  return b;
}
document.addEventListener('keydown',function(e){
  var lb=document.getElementById('lb');if(!lb)return;
  if(e.key==='Escape')lb.remove();
  if(e.key==='ArrowLeft'){lbIdx=(lbIdx-1+galImgs.length)%galImgs.length;var img=lb.querySelector('img');if(img&&galImgs[lbIdx]){img.style.opacity='0';setTimeout(function(){img.src=galImgs[lbIdx].src;img.style.opacity='1';},150);}}
  if(e.key==='ArrowRight'){lbIdx=(lbIdx+1)%galImgs.length;var img=lb.querySelector('img');if(img&&galImgs[lbIdx]){img.style.opacity='0';setTimeout(function(){img.src=galImgs[lbIdx].src;img.style.opacity='1';},150);}}
});

/* ── GALLERY TABS (visual feedback only) ── */
document.querySelectorAll('.gtab').forEach(function(tab){
  tab.addEventListener('click',function(){
    document.querySelectorAll('.gtab').forEach(function(t){t.classList.remove('on');});
    tab.classList.add('on');
  });
});

/* ── MOBILE NAV TOGGLE ── */
(function(){
  var nav=document.getElementById('nav'),btn=document.getElementById('nav-toggle');
  if(!nav||!btn)return;
  function setOpen(o){nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');}
  btn.addEventListener('click',function(){setOpen(!nav.classList.contains('open'));});
  nav.querySelectorAll('.nav-menu a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  window.addEventListener('resize',function(){if(window.innerWidth>768)setOpen(false);});
})();

/* ── ACTIVE NAV ITEM (scroll spy + click) ── */
(function(){
  var links=[].slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
  var items=links.map(function(a){return {a:a,sec:document.querySelector(a.getAttribute('href'))};}).filter(function(x){return x.sec;});
  if(!items.length)return;
  var current=null,lockUntil=0;
  function setActive(id){
    if(id===current)return;
    current=id;
    items.forEach(function(x){
      var on=('#'+x.sec.id)===id;
      x.a.classList.toggle('active',on);
      if(on)x.a.setAttribute('aria-current','true');else x.a.removeAttribute('aria-current');
    });
  }
  function spy(){
    if(Date.now()<lockUntil)return;
    var nav=document.getElementById('nav');
    var line=(nav?nav.offsetHeight:0)+window.innerHeight*0.3;
    var id=null;
    items.forEach(function(x){if(x.sec.getBoundingClientRect().top<=line)id='#'+x.sec.id;});
    var doc=document.documentElement;
    if(window.innerHeight+(window.pageYOffset||doc.scrollTop)>=doc.scrollHeight-4)id='#'+items[items.length-1].sec.id;
    setActive(id);
  }
  items.forEach(function(x){
    x.a.addEventListener('click',function(){
      setActive('#'+x.sec.id);
      lockUntil=Date.now()+1200;           /* ignore the smooth-scroll in between */
      setTimeout(spy,1250);
    });
  });
  window.addEventListener('scroll',spy,{passive:true});
  window.addEventListener('resize',spy);
  if('onscrollend' in window)window.addEventListener('scrollend',function(){lockUntil=0;spy();});
  spy();
})();

/* ── MAGNETIC NAV ── */
document.querySelectorAll('.nav-menu a').forEach(function(a){
  a.addEventListener('mousemove',function(e){var r=a.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*.2;var y=(e.clientY-r.top-r.height/2)*.2;a.style.transform='translate('+x+'px,'+y+'px)';});
  a.addEventListener('mouseleave',function(){a.style.transform='';});
});

/* ── TESTIMONIALS ── */
function showT(idx){
  CURRT=idx;
  var tt=document.getElementById('ttext'),ta=document.getElementById('tauth');
  if(!tt||!ta)return;
  tt.style.opacity='0';ta.style.opacity='0';
  setTimeout(function(){tt.textContent=t('t'+idx+'.t');ta.textContent=t('t'+idx+'.a');tt.style.opacity='1';ta.style.opacity='1';},320);
  document.querySelectorAll('.tdot').forEach(function(d,i){d.classList.toggle('on',i===idx);});
}
setInterval(function(){showT((CURRT+1)%3);},7000);

/* ── FORM ── */
function doSub(e){
  e.preventDefault();
  var form=e.target;
  var btn=form.querySelector('.f-sub');
  btn.textContent='Sending…';btn.disabled=true;
  var data={};
  new FormData(form).forEach(function(v,k){if(!k.startsWith('_'))data[k]=v;});
  data['_subject']='New Event Enquiry — Goosebumps';
  data['_template']='table';
  fetch('https://formsubmit.co/ajax/info@goosebumpsevents.eu',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(data)
  }).then(function(r){return r.json();}).then(function(res){
    if(res.success==='true'||res.success===true){
      btn.textContent=t('f.sent');btn.style.background='linear-gradient(135deg,#1a7a4a,#2d9e64)';
      setTimeout(function(){btn.textContent=t('f.sb');btn.style.background='';btn.disabled=false;form.reset();},5000);
    } else {
      btn.textContent='Error — try again';btn.style.background='#7a1a1a';
      setTimeout(function(){btn.textContent=t('f.sb');btn.style.background='';btn.disabled=false;},4000);
    }
  }).catch(function(){
    btn.textContent='Error — try again';btn.style.background='#7a1a1a';
    setTimeout(function(){btn.textContent=t('f.sb');btn.style.background='';btn.disabled=false;},4000);
  });
}

/* ── INIT ── */
try{applyTr();}catch(e){console.warn('applyTr:',e);}
/* Init nav state immediately */
(function(){var nav=document.getElementById('nav');if(nav)nav.classList.toggle('scrolled',window.scrollY>80);})();
try{doParallax();}catch(e){console.warn('parallax:',e);}
try{handleScroll();}catch(e){console.warn('scroll init:',e);}

/* ── HERO FLOAT IMAGE INTERACTIVE TILT ── */
(function(){
  var hf = document.querySelector('.hero-img-float');
  var hero = document.getElementById('hero');
  if(!hf||!hero) return;
  hero.addEventListener('mousemove', function(e){
    var r = hero.getBoundingClientRect();
    var cx = r.left + r.width/2;
    var cy = r.top + r.height/2;
    var dx = (e.clientX - cx) / (r.width/2);
    var dy = (e.clientY - cy) / (r.height/2);
    hf.style.transform = 'perspective(900px) rotateY('+(dx*-6)+'deg) rotateX('+(dy*4)+'deg) translateY('+(dy*-12)+'px)';
    hf.style.filter = 'drop-shadow('+(dx*-8)+'px '+(dy*-8)+'px 30px rgba(85,69,165,.5))';
  });
  hero.addEventListener('mouseleave', function(){
    hf.style.transform = '';
    hf.style.filter = '';
  });
})();
