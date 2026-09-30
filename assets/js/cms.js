(function(){
'use strict';

var CMS_PASS='GSBMPS2026!';
var WORKER_URL='https://cms-publish.goosebumpsevents.workers.dev';
var WORKER_KEY='GSBMPS2026!';  // must match CMS_KEY secret in Cloudflare Worker
var CMS_KEY='gbcms_v2';
var GH_OWNER='DSMeridian';
var GH_REPO='goosebumpsevents.eu';
var GH_FILE='index.html';
var CONTENT_FILE='assets/js/content.js';  // IMGS paths + TR translations live here
var TEXT_FILES=['index.html','assets/js/content.js','assets/js/main.js'];  // files that may contain contact details
var GH_BRANCH='main';

var KEY_LABELS={'nav.ab':'About Us','nav.sv':'Services','nav.gl':'Gallery','nav.tm':'Our Team','nav.ct':'Contact','h.eye':'Eyebrow label','h.ttl':'Main headline','h.sub':'Subheadline','h.c1':'Button 1','h.c2':'Button 2','h.scr':'Scroll hint','a.lbl':'Section label','a.ttl':'Section title','a.p1':'Paragraph 1','a.p2':'Paragraph 2','a.q':'Pull quote','s.yr':'Stat: Years','s.ev':'Stat: Events','s.co':'Stat: Countries','s.di':'Stat 4 label','nb.yr':'Stat: Years number','nb.ev':'Stat: Events number','nb.co':'Stat: Countries number','nb.di':'Stat 4 number','sv.lbl':'Section label','sv.ttl':'Section title','sv.intro':'Intro text','s1.n':'Service 1 — Name','s1.d':'Service 1 — Description','s2.n':'Service 2 — Name','s2.d':'Service 2 — Description','s3.n':'Service 3 — Name','s3.d':'Service 3 — Description','s4.n':'Service 4 — Name','s4.d':'Service 4 — Description','s5.n':'Service 5 — Name','s5.d':'Service 5 — Description','s6.n':'Service 6 — Name','s6.d':'Service 6 — Description','pb1.h':'Quote 1 — Heading','pb1.p':'Quote 1 — Body text','pb2.h':'Quote 2 — Heading','pb2.p':'Quote 2 — Body text','pr.lbl':'Section label','pr.ttl':'Section title','p1.t':'Step 1 — Title','p1.d':'Step 1 — Description','p2.t':'Step 2 — Title','p2.d':'Step 2 — Description','p3.t':'Step 3 — Title','p3.d':'Step 3 — Description','p4.t':'Step 4 — Title','p4.d':'Step 4 — Description','g.lbl':'Section label','g.ttl':'Section title','gt.all':'Filter: All','gt.lt':'Filter: Lighting','gt.mu':'Filter: Music','gt.ev':'Filter: Events','tm.lbl':'Section label','tm.ttl':'Section title','tm.r1':'Member 1 — Role','tm.r2':'Member 2 — Role','tm.r3':'Member 3 — Role','tm.r4':'Member 4 — Role','tm.r5':'Member 5 — Role','tm.r6':'Member 6 — Role','tm.b1':'Member 1 — Bio','tm.b2':'Member 2 — Bio','tm.b3':'Member 3 — Bio','tm.b4':'Member 4 — Bio','tm.b5':'Member 5 — Bio','tm.b6':'Member 6 — Bio','t0.t':'Member 1 — Name','t0.a':'Member 1 — Alt text','t1.t':'Member 2 — Name','t1.a':'Member 2 — Alt text','t2.t':'Member 3 — Name','t2.a':'Member 3 — Alt text','w.lbl':'Section label','w.ttl':'Section title','w.badge':'Badge text','w1.t':'Reason 1 — Title','w1.d':'Reason 1 — Description','w2.t':'Reason 2 — Title','w2.d':'Reason 2 — Description','w3.t':'Reason 3 — Title','w3.d':'Reason 3 — Description','w4.t':'Reason 4 — Title','w4.d':'Reason 4 — Description','c.lbl':'Section label','c.ttl':'Section title','c.intro':'Intro text','c.loc':'Location text','f.fn':'Field: First name','f.ln':'Field: Last name','f.em':'Field: Email','f.ph':'Field: Phone','f.ty':'Field: Event type','f.dt':'Field: Date','f.lo':'Field: Location','f.ms':'Field: Message','f.sb':'Submit button','f.t0':'Type option: Corporate','f.t1':'Type option: Wedding','f.t2':'Type option: Birthday','f.t3':'Type option: Festival','f.t4':'Type option: Private','f.t5':'Type option: Exhibition','f.t6':'Type option: Other','f.sent':'Success message','ft.tag':'Footer tagline','ft.nav':'Heading: Navigation','ft.sv':'Heading: Services','ft.con':'Heading: Contact','ft.rts':'Copyright text','loader':'Loading screen text'};

var TR_SECTIONS=[
  {title:'Navigation',keys:['nav.ab','nav.sv','nav.gl','nav.tm','nav.ct']},
  {title:'Hero Section',keys:['h.eye','h.ttl','h.sub','h.c1','h.c2','h.scr']},
  {title:'About Section',keys:['a.lbl','a.ttl','a.p1','a.p2','a.q','s.yr','s.ev','s.co','s.di','nb.yr','nb.ev','nb.co','nb.di']},
  {title:'Services',keys:['sv.lbl','sv.ttl','sv.intro','s1.n','s1.d','s2.n','s2.d','s3.n','s3.d','s4.n','s4.d','s5.n','s5.d','s6.n','s6.d']},
  {title:'Parallax Quotes',keys:['pb1.h','pb1.p','pb2.h','pb2.p']},
  {title:'Process Steps',keys:['pr.lbl','pr.ttl','p1.t','p1.d','p2.t','p2.d','p3.t','p3.d','p4.t','p4.d']},
  {title:'Gallery',keys:['g.lbl','g.ttl','gt.all','gt.lt','gt.mu','gt.ev']},
  {title:'Team',keys:['tm.lbl','tm.ttl','tm.r1','tm.r2','tm.r3','tm.r4','tm.r5','tm.r6','tm.b1','tm.b2','tm.b3','tm.b4','tm.b5','tm.b6','t0.t','t0.a','t1.t','t1.a','t2.t','t2.a']},
  {title:'Why Choose Us',keys:['w.lbl','w.ttl','w1.t','w1.d','w2.t','w2.d','w3.t','w3.d','w4.t','w4.d','w.badge']},
  {title:'Contact Section',keys:['c.lbl','c.ttl','c.intro','c.loc']},
  {title:'Contact Form',keys:['f.fn','f.ln','f.em','f.ph','f.ty','f.dt','f.lo','f.ms','f.sb','f.t0','f.t1','f.t2','f.t3','f.t4','f.t5','f.t6','f.sent']},
  {title:'Footer',keys:['ft.tag','ft.nav','ft.sv','ft.con','ft.rts','loader']},
];

var IMG_LABELS={logo:'Logo',hero:'Hero Background (main)',hero2:'Hero Background (layer 2)',hfloat:'Hero Floating Image',about:'About Section Image',about2:'About Section Image 2',wimga:'Why Choose — Image Left',wimg_b:'Why Choose — Image Right',pb1:'Parallax Background',g1:'Gallery 1',g2:'Gallery 2',g3:'Gallery 3',g4:'Gallery 4',g5:'Gallery 5',g6:'Gallery 6',g7:'Gallery 7',g8:'Gallery 8',g9:'Gallery 9',g10:'Gallery 10',g11:'Gallery 11',g12:'Gallery 12',t1:'Team Photo 1',t2:'Team Photo 2',t3:'Team Photo 3',t4:'Team Photo 4',t5:'Team Photo 5',t6:'Team Photo 6'};
var IMG_ORDER=['logo','hero2','hfloat','about','about2','wimga','wimg_b','pb1','g1','g2','g3','g4','g5','g6','g7','g8','g9','g10','g11','g12','t1','t2','t3','t4','t5','t6'];

/* ── STATE ── */
var overrides={tr:{en:{},fr:{},nl:{}},imgs:{},contact:{}};
try{var _s=localStorage.getItem(CMS_KEY);if(_s)overrides=JSON.parse(_s);}catch(e){}

/* ── APPLY OVERRIDES ON LOAD ── */
if(typeof TR!=='undefined'&&overrides.tr){
  ['en','fr','nl'].forEach(function(l){if(overrides.tr[l])Object.keys(overrides.tr[l]).forEach(function(k){TR[l][k]=overrides.tr[l][k];});});
}
if(typeof IMGS!=='undefined'&&overrides.imgs){
  Object.keys(overrides.imgs).forEach(function(k){IMGS[k]=overrides.imgs[k];});
}

/* ── CUSTOM CURSOR ABOVE THE CMS ──
   Move the cursor dot/ring after the CMS markup so they render on top of it */
['cur-ring','cur'].forEach(function(id){var el=document.getElementById(id);if(el)document.body.appendChild(el);});

/* ── DOM VARS ── */
var root=document.getElementById('gcms');
var lgEl=document.getElementById('gcms-lg');
var pnEl=document.getElementById('gcms-pn');
var passEl=document.getElementById('gcms-pass');
var errEl=document.getElementById('gcms-err');
var toast=document.getElementById('gcms-toast');
var curLang='en';
var loggedIn=false;
var toastTimer=null;

window.gcmsOpen=function(){if(loggedIn){showPanel();}else{showLogin();}};

function showToast(msg,ok){
  clearTimeout(toastTimer);
  toast.textContent=msg;
  toast.style.background=ok===false?'#9e2a2a':'#7c5cbf';
  toast.classList.add('show');
  toastTimer=setTimeout(function(){toast.classList.remove('show');},3000);
}

/* ── TRIGGER ── */
var clickCount=0,clickTimer=null;
document.addEventListener('click',function(e){
  var t=e.target;
  if(t.closest('#ll')||t.closest('#nlogo')||t.closest('.logo')||t.closest('[href="#"]')){
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer=setTimeout(function(){clickCount=0;},600);
    if(clickCount>=3){clickCount=0;showLogin();}
  }
},true);

if(new URLSearchParams(location.search).has('cms')){
  document.addEventListener('DOMContentLoaded',function(){showLogin();});
}


/* ── AUTH ── */
function showLogin(){
  root.classList.add('active');
  document.body.classList.add('gcms-active');
  lgEl.classList.add('show');
  passEl.value='';
  errEl.textContent='';
  setTimeout(function(){passEl.focus();},300);
}

function hideLg(){
  lgEl.classList.remove('show');
}

function closeLogin(){
  hideLg();
  if(!pnEl.classList.contains('show'))document.body.classList.remove('gcms-active');
}
document.getElementById('gcms-close-lg').addEventListener('click',closeLogin);
lgEl.addEventListener('click',function(e){if(e.target===lgEl)closeLogin();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lgEl.classList.contains('show'))closeLogin();});

document.getElementById('gcms-login-btn').addEventListener('click',doLogin);
passEl.addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});

function doLogin(){
  if(passEl.value===CMS_PASS){
    errEl.textContent='';
    hideLg();
    showPanel();
  }else{
    errEl.textContent='Incorrect password. Please try again.';
    passEl.value='';
    passEl.focus();
  }
}

/* ── PANEL ── */
var tbEl=document.getElementById('gcms-topbar');
function showPanel(){
  loggedIn=true;
  tbEl.classList.add('show');
  pnEl.classList.add('show');
  document.body.classList.add('gcms-open','gcms-active');
  buildUI();
}

document.getElementById('gcms-close-btn').addEventListener('click',function(){
  tbEl.classList.remove('show');
  pnEl.classList.remove('show');
  lgEl.classList.remove('show');
  document.body.classList.remove('gcms-open','gcms-active');
  clearPreviewHighlight();
});

/* ── TABS ── */
var TAB_TITLES={text:'Text & Content',images:'Photos & Images',contact:'Contact & Links'};
var TAB_DESCS={text:'Edit all text, labels and translations across all 3 languages',images:'Replace any photo or image on the website',contact:'Update email address, phone number and Instagram link'};
document.querySelectorAll('.gcms-nb').forEach(function(btn){
  btn.addEventListener('click',function(){
    var tab=this.dataset.tab;
    document.querySelectorAll('.gcms-nb').forEach(function(b){b.classList.remove('on');});
    document.querySelectorAll('.gcms-pane').forEach(function(p){p.classList.remove('on');});
    this.classList.add('on');
    var pane=document.getElementById('gcms-tab-'+tab);
    if(pane)pane.classList.add('on');
    document.getElementById('gcms-mh-title').textContent=TAB_TITLES[tab]||tab;
    document.getElementById('gcms-mh-desc').textContent=TAB_DESCS[tab]||'';
  });
});

/* ── BUILD UI ── */
var built=false;
function buildUI(){
  if(built)return;
  built=true;
  buildTextTab();
  buildImagesTab();
  buildContactTab();
  wireContactLivePreview();
}

/* ── TEXT TAB ── */
function buildTextTab(){
  var langSel=document.getElementById('gcms-langs');
  ['en','fr','nl'].forEach(function(l){
    var b=document.createElement('button');
    b.className='gcms-lbtn'+(l==='en'?' on':'');
    b.textContent=l.toUpperCase();
    b.dataset.lang=l;
    b.addEventListener('click',function(){
      collectTextEdits();
      document.querySelectorAll('.gcms-lbtn').forEach(function(x){x.classList.remove('on');});
      this.classList.add('on');
      curLang=this.dataset.lang;
      updateTextInputs();
    });
    langSel.appendChild(b);
  });

  var secsEl=document.getElementById('gcms-secs');
  TR_SECTIONS.forEach(function(sec,si){
    var secDiv=document.createElement('div');
    secDiv.className='gcms-sec'+(si===0?' open':'');
    var hdr=document.createElement('div');
    hdr.className='gcms-sch';
    hdr.innerHTML='<span>'+sec.title+'</span><span class="gcms-arr">▶</span>';
    hdr.addEventListener('click',function(){secDiv.classList.toggle('open');});
    var body=document.createElement('div');
    body.className='gcms-scb';
    sec.keys.forEach(function(key){
      var row=document.createElement('div');
      row.className='gcms-row';
      var lbl=document.createElement('div');
      lbl.className='gcms-lbl';
      var labelText=KEY_LABELS[key]||key;
      lbl.innerHTML=labelText+(KEY_LABELS[key]?'<span class="gcms-lbl-sub">'+key+'</span>':'');
      var val=(typeof TR!=='undefined'&&TR.en&&TR.en[key])||'';
      var cleanVal=val.replace(/<[^>]+>/g,'');
      var isLong=cleanVal.length>80;
      var inp;
      if(isLong){
        inp=document.createElement('textarea');
        inp.rows=Math.min(5,Math.ceil(cleanVal.length/60)+1);
      }else{
        inp=document.createElement('input');
        inp.type='text';
      }
      inp.className='gcms-inp';
      inp.dataset.key=key;
      inp.value=(typeof TR!=='undefined'&&TR[curLang]&&TR[curLang][key])||'';
      inp.placeholder=cleanVal.slice(0,80)||(KEY_LABELS[key]||key);
      // Live preview: update DOM as you type
      var _debTimer;
      inp.addEventListener('input',function(){
        var k=this.dataset.key,v=this.value;
        if(typeof TR!=='undefined'&&TR[curLang])TR[curLang][k]=v;
        clearTimeout(_debTimer);
        _debTimer=setTimeout(function(){if(typeof applyTr==='function')applyTr();},80);
      });
      // Highlight the element being edited on the live page
      inp.addEventListener('focus',function(){highlightPreview(this.dataset.key);});
      inp.addEventListener('blur',function(){clearPreviewHighlight();});
      row.appendChild(lbl);
      row.appendChild(inp);
      body.appendChild(row);
    });
    secDiv.appendChild(hdr);
    secDiv.appendChild(body);
    secsEl.appendChild(secDiv);
  });
}

function updateTextInputs(){
  document.querySelectorAll('#gcms-tab-text .gcms-inp').forEach(function(inp){
    var key=inp.dataset.key;
    if(key&&typeof TR!=='undefined'&&TR[curLang]){
      inp.value=TR[curLang][key]||'';
    }
  });
}

/* ── IMAGES TAB ── */
function buildImagesTab(){
  var grid=document.getElementById('gcms-igrd');
  IMG_ORDER.forEach(function(key){
    var card=document.createElement('div');
    card.className='gcms-icard';

    var imgData=typeof IMGS!=='undefined'?IMGS[key]:'';
    var thumb;
    if(key==='hero'||key==='hero2'||key==='pb1'){
      thumb=document.createElement('div');
      thumb.className='gcms-ithumb bg-style';
      if(imgData)thumb.style.backgroundImage="url('"+imgData+"')";
    }else{
      thumb=document.createElement('img');
      thumb.className='gcms-ithumb';
      thumb.alt=key;
      if(imgData)thumb.src=imgData;
    }
    thumb.id='gcms-thumb-'+key;

    var lbl=document.createElement('div');
    lbl.className='gcms-ilbl';
    lbl.textContent=IMG_LABELS[key]||key;

    var keyLbl=document.createElement('div');
    keyLbl.className='gcms-ikey';
    keyLbl.textContent=key;

    var upBtn=document.createElement('label');
    upBtn.className='gcms-iup';
    upBtn.textContent='Upload new image';
    var inp=document.createElement('input');
    inp.type='file';
    inp.accept='image/*';
    inp.className='gcms-iinp';
    inp.dataset.imgkey=key;
    inp.addEventListener('change',function(){handleImgUpload(this,key,thumb);});
    upBtn.appendChild(inp);

    card.appendChild(thumb);
    card.appendChild(lbl);
    card.appendChild(keyLbl);
    card.appendChild(upBtn);
    grid.appendChild(card);
  });
}

function handleImgUpload(inp,key,thumb){
  var file=inp.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      var maxW=1400,maxH=1400;
      var w=img.width,h=img.height;
      if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
      if(h>maxH){w=Math.round(w*maxH/h);h=maxH;}
      var canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      var ctx=canvas.getContext('2d');
      ctx.drawImage(img,0,0,w,h);
      var dataUrl=canvas.toDataURL('image/jpeg',0.82);
      if(typeof IMGS!=='undefined')IMGS[key]=dataUrl;
      if(!overrides.imgs)overrides.imgs={};
      overrides.imgs[key]=dataUrl;
      if(thumb.tagName==='IMG'){thumb.src=dataUrl;}
      else{thumb.style.backgroundImage="url('"+dataUrl+"')";}
      applyImgToDOM(key,dataUrl);
      showToast('Image updated — click Save to keep changes');
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyImgToDOM(key,val){
  if(typeof si!=='function')return;
  if(key==='logo'){si('ll',val);si('nlogo',val);si('flogo',val);}
  else if(key==='hero'){si('hbg1',null,val);}
  else if(key==='hero2'){si('hbg2',null,val);}
  else if(key==='hfloat'){si('hfloat',val);}
  else if(key==='wimga'){si('aimg1',val);}
  else if(key==='wimg_b'){si('aimg2',val);}
  else if(key==='about'){si('wimg1',val);}
  else if(key==='about2'){si('wimg2',val);}
  else if(key==='pb1'){si('pb1bg',null,val);}
  else if(/^g\d+$/.test(key)){si(key,val);}
  else if(/^t\d$/.test(key)){si(key,val);}
}

/* ── CONTACT TAB ── */
function domContact(){
  var m=document.querySelector('a[href^="mailto:"]'),p=document.querySelector('a[href^="tel:"]'),ig=document.querySelector('a[href*="instagram.com"]');
  return {
    email:m?m.getAttribute('href').replace(/^mailto:/,''):'',
    phone:p?p.textContent.trim():'',
    phoneHref:p?p.getAttribute('href').replace(/^tel:/,''):'',
    instagram:ig?ig.getAttribute('href'):''
  };
}
function buildContactTab(){
  var c=overrides.contact||{},d=domContact();
  document.getElementById('gcms-c-email').value=c.email||d.email||'info@goosebumpsevents.eu';
  document.getElementById('gcms-c-phone').value=c.phone||d.phone||'+32 456 95 19 69';
  document.getElementById('gcms-c-phonehref').value=c.phoneHref||d.phoneHref||'+3245695169';
  document.getElementById('gcms-c-ig').value=c.instagram||d.instagram||'https://www.instagram.com/goosebumpsevents.eu/';
}

/* ── PUBLISH TAB ── */

/* ── SAVE & PUBLISH ── */
document.getElementById('gcms-save-btn').addEventListener('click',saveAll);

function saveAll(){
  collectTextEdits();
  collectContactEdits();
  try{localStorage.setItem(CMS_KEY,JSON.stringify(overrides));}catch(e){showToast('Could not save locally',false);return;}
  applyAllToDOM();
  var btn=document.getElementById('gcms-save-btn');
  var badge=document.getElementById('gcms-saved-badge');
  btn.disabled=true;
  btn.classList.add('publishing');
  btn.innerHTML='<span class="gcms-spinner"></span>Publishing…';
  badge.classList.remove('show');
  setStatus('Uploading to website…');
  doPublish().then(function(){
    btn.disabled=false;
    btn.classList.remove('publishing');
    btn.classList.add('success');
    btn.innerHTML='✓ Published!';
    setStatus('');
    badge.classList.add('show');
    setTimeout(function(){
      btn.classList.remove('success');
      btn.innerHTML='💾 Save &amp; Publish';
    },3000);
  }).catch(function(){
    btn.disabled=false;
    btn.classList.remove('publishing');
    btn.innerHTML='💾 Save &amp; Publish';
    setStatus('');
  });
}

function setStatus(msg){
  var el=document.getElementById('gcms-status');
  if(el)el.textContent=msg;
}

function collectTextEdits(){
  if(!overrides.tr)overrides.tr={en:{},fr:{},nl:{}};
  var seenLang=curLang;
  ['en','fr','nl'].forEach(function(l){
    if(!overrides.tr[l])overrides.tr[l]={};
  });
  document.querySelectorAll('#gcms-tab-text .gcms-inp').forEach(function(inp){
    var key=inp.dataset.key;
    if(!key)return;
    var val=inp.value;
    if(typeof TR!=='undefined'&&TR[seenLang]){
      TR[seenLang][key]=val;
      overrides.tr[seenLang][key]=val;
    }
  });
}

function collectContactEdits(){
  if(!overrides.contact)overrides.contact={};
  overrides.contact.email=document.getElementById('gcms-c-email').value.trim();
  overrides.contact.phone=document.getElementById('gcms-c-phone').value.trim();
  overrides.contact.phoneHref=document.getElementById('gcms-c-phonehref').value.trim().replace(/\s/g,'');
  overrides.contact.instagram=document.getElementById('gcms-c-ig').value.trim();
}

/* ── LIVE PREVIEW HELPERS ── */
var _hlEl=null,_hlLabel=null;

function highlightPreview(key){
  clearPreviewHighlight();
  var target=document.querySelector('[data-i18n="'+key+'"]');
  if(!target)return;
  _hlEl=target;
  target.classList.add('gcms-hl');
  // Scroll target into the visible portion of the page (left of panel)
  var rect=target.getBoundingClientRect();
  var panelW=380;
  var visW=window.innerWidth-panelW;
  var offscreen=rect.bottom<60||rect.top>window.innerHeight-60||rect.left>visW-40;
  if(offscreen){
    var scrollTop=target.getBoundingClientRect().top+window.scrollY-window.innerHeight/2+rect.height/2;
    window.scrollTo({top:Math.max(0,scrollTop),behavior:'smooth'});
  }
  // Show floating label badge
  if(!_hlLabel){
    _hlLabel=document.createElement('div');
    _hlLabel.id='gcms-preview-label';
    document.body.appendChild(_hlLabel);
  }
  _hlLabel.textContent='✏️ '+(KEY_LABELS[key]||key);
  _hlLabel.classList.add('show');
  _positionLabel();
}

function _positionLabel(){
  if(!_hlLabel||!_hlEl)return;
  var r=_hlEl.getBoundingClientRect();
  var panelW=380;
  var maxLeft=window.innerWidth-panelW-_hlLabel.offsetWidth-8;
  _hlLabel.style.top=Math.max(8,r.top-26)+'px';
  _hlLabel.style.left=Math.min(Math.max(4,r.left),maxLeft)+'px';
}

function clearPreviewHighlight(){
  if(_hlEl){_hlEl.classList.remove('gcms-hl');_hlEl=null;}
  if(_hlLabel)_hlLabel.classList.remove('show');
}

/* Wire contact inputs for live preview */
function wireContactLivePreview(){
  ['gcms-c-email','gcms-c-phone','gcms-c-phonehref','gcms-c-ig'].forEach(function(id){
    var el=document.getElementById(id);
    if(!el)return;
    var _t;
    el.addEventListener('input',function(){
      clearTimeout(_t);
      _t=setTimeout(function(){collectContactEdits();applyContactToDOM();},120);
    });
  });
}

function applyAllToDOM(){
  if(typeof applyTr==='function')applyTr();
  if(overrides.imgs)Object.keys(overrides.imgs).forEach(function(k){applyImgToDOM(k,overrides.imgs[k]);});
  applyContactToDOM();
}

function applyContactToDOM(){
  var c=overrides.contact||{};
  if(c.email){
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
      a.href='mailto:'+c.email;
      if(a.textContent&&a.textContent.trim()!=='@'&&a.textContent.indexOf('@')>-1)a.textContent=c.email;
    });
    document.querySelectorAll('form[action*="formsubmit"]').forEach(function(f){
      f.action='https://formsubmit.co/'+c.email;
    });
  }
  if(c.phone){
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      a.href='tel:'+(c.phoneHref||c.phone.replace(/\s/g,''));
      a.textContent=c.phone;
    });
  }
  if(c.instagram){
    document.querySelectorAll('a[href*="instagram.com"]').forEach(function(a){
      a.href=c.instagram;
      if(a.textContent&&a.textContent.indexOf('IG')===-1){
        var handle=c.instagram.replace(/\/+$/,'').split('/').pop();
        a.textContent='@'+handle;
      }
    });
  }
}

/* ── APPLY CONTACT ON LOAD ── */
document.addEventListener('DOMContentLoaded',function(){
  applyContactToDOM();
  if(typeof applyTr==='function'&&Object.keys(overrides.tr&&overrides.tr.en||{}).length>0)applyTr();
  if(overrides.imgs)Object.keys(overrides.imgs).forEach(function(k){applyImgToDOM(k,overrides.imgs[k]);});
});

/* ── PUBLISH via Cloudflare Worker ──
   The site is split into several files, so publishing:
     1. fetches the current index.html, assets/js/content.js and assets/js/main.js from GitHub,
     2. rewrites the TR block / IMGS paths in content.js and contact details in every text file,
     3. turns newly uploaded photos (data: URLs) into real files under assets/images/,
     4. sends only the changed files to the Worker, which commits them in one commit. */
async function fetchSource(path){
  var url='https://raw.githubusercontent.com/'+GH_OWNER+'/'+GH_REPO+'/'+GH_BRANCH+'/'+path+'?t='+Date.now();
  var r=await fetch(url,{cache:'no-store'});
  if(!r.ok)throw new Error('Could not fetch '+path+' (HTTP '+r.status+')');
  return r.text();
}

async function doPublish(){
  try{
    setStatus('Fetching site source…');
    var srcs={};
    for(var i=0;i<TEXT_FILES.length;i++){srcs[TEXT_FILES[i]]=await fetchSource(TEXT_FILES[i]);}

    setStatus('Applying changes…');
    var ver=Date.now().toString(36);
    var files=[],newPaths={};
    if(overrides.imgs){
      Object.keys(overrides.imgs).forEach(function(key){
        var mm=/^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(overrides.imgs[key]||'');
        if(!mm||!/^[a-z0-9_]+$/i.test(key))return;
        var path='assets/images/'+key+'.'+(mm[1]==='jpeg'?'jpg':mm[1]);
        files.push({path:path,b64:mm[2]});
        newPaths[key]=path+'?v='+ver;   // cache-bust the replaced file
      });
    }
    TEXT_FILES.forEach(function(p){
      var out=p===CONTENT_FILE?applyContentChanges(srcs[p],newPaths):srcs[p];
      out=applyContactChanges(out);
      if(out!==srcs[p])files.push({path:p,b64:encodeText(out)});
    });
    if(!files.length){showToast('Nothing new to publish');return;}

    setStatus('Uploading…');
    var resp=await fetch(WORKER_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({key:WORKER_KEY,files:files})
    });
    var result=await resp.json();
    if(!resp.ok||result.error)throw new Error(result.error||'Upload error ('+resp.status+')');

    // Uploaded photos now live as files: remember their paths instead of the heavy data URLs
    Object.keys(newPaths).forEach(function(k){overrides.imgs[k]=newPaths[k];});
    try{localStorage.setItem(CMS_KEY,JSON.stringify(overrides));}catch(e){}
  }catch(err){
    showToast('Publish failed: '+err.message,false);
    throw err;
  }
}

function encodeText(str){
  var bytes=new TextEncoder().encode(str);
  var binary='';
  var chunkSize=8192;
  for(var i=0;i<bytes.length;i+=chunkSize){
    binary+=String.fromCharCode.apply(null,bytes.subarray(i,i+chunkSize));
  }
  return btoa(binary);
}

/* content.js: replace the whole TR block and any updated IMGS["key"]="path" entries */
function applyContentChanges(js,newPaths){
  if(overrides.tr&&(Object.keys(overrides.tr.en||{}).length||Object.keys(overrides.tr.fr||{}).length||Object.keys(overrides.tr.nl||{}).length)){
    var trStart=js.indexOf('\nvar TR=');
    var trEnd=js.indexOf('\n/* END TR */');
    if(trStart>-1&&trEnd>trStart){
      var fullTR={en:Object.assign({},typeof TR!=='undefined'?TR.en:{}),fr:Object.assign({},typeof TR!=='undefined'?TR.fr:{}),nl:Object.assign({},typeof TR!=='undefined'?TR.nl:{})};
      js=js.slice(0,trStart+1)+'var TR='+JSON.stringify(fullTR)+';'+js.slice(trEnd);
    }else{
      throw new Error('TR markers not found in '+CONTENT_FILE);
    }
  }
  Object.keys(newPaths||{}).forEach(function(key){
    var pattern='IMGS["'+key+'"]="';
    var start=js.indexOf(pattern);
    var line='IMGS["'+key+'"]="'+newPaths[key]+'";';
    if(start>-1){
      var valStart=start+pattern.length;
      var valEnd=js.indexOf('"',valStart);
      if(valEnd>-1)js=js.slice(0,valStart)+newPaths[key]+js.slice(valEnd);
    }else{
      var anchor=js.indexOf('\nvar IMGS={};');
      if(anchor>-1){anchor+='\nvar IMGS={};'.length;js=js.slice(0,anchor)+'\n'+line+js.slice(anchor);}
    }
  });
  return js;
}

/* every text file: swap contact details */
function applyContactChanges(text){
  var c=overrides.contact||{};
  if(c.email){
    text=text.replace(/info@goosebumpsevents\.eu/g,c.email);
    text=text.replace(/mailto:[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,'mailto:'+c.email);
  }
  if(c.phone){text=text.replace(/\+32 456 95 19 69/g,c.phone);}
  if(c.phoneHref){text=text.replace(/tel:\+3245695169/g,'tel:'+c.phoneHref);}
  if(c.instagram){text=text.replace(/https:\/\/www\.instagram\.com\/goosebumpsevents\.eu\//g,c.instagram);}
  return text;
}

})();
