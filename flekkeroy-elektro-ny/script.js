document.addEventListener('DOMContentLoaded',()=>{

  // === NAVBAR SCROLL ===
  const nb=document.getElementById('navbar');
  window.addEventListener('scroll',()=>nb.classList.toggle('scrolled',scrollY>10));

  // === MOBILE MENU ===
  const hb=document.getElementById('hamburger'),nv=document.getElementById('nav');
  hb.addEventListener('click',()=>{
    hb.classList.toggle('open');nv.classList.toggle('open');
    hb.setAttribute('aria-expanded',nv.classList.contains('open'));
  });
  nv.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
    hb.classList.remove('open');nv.classList.remove('open');hb.setAttribute('aria-expanded','false');
  }));

  // === SCROLL REVEAL ===
  const ro=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');ro.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

  // === ANIMATED COUNTERS ===
  const co=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,t=+el.dataset.target;
      let c=0;const d=Math.max(1,Math.floor(2000/(t||1)));
      const iv=setInterval(()=>{c++;el.textContent=c;if(c>=t){clearInterval(iv);el.textContent=t}},d);
      co.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.stat-num').forEach(el=>co.observe(el));

  // === CONTACT FORM ===
  const cf=document.getElementById('kontakt-form');
  cf.addEventListener('submit',e=>{
    e.preventDefault();
    const b=cf.querySelector('button[type="submit"]'),ot=b.textContent;
    b.textContent='Sendt! ✓';b.style.background='#16a34a';b.style.borderColor='#16a34a';b.style.color='#fff';b.disabled=true;
    setTimeout(()=>{b.textContent=ot;b.style.background='';b.style.borderColor='';b.style.color='';b.disabled=false;cf.reset()},3000);
  });

  // === ELBIL KALKULATOR ===
  const cars=[
    {id:'t3',n:'Tesla Model 3',b:60,r:491,ac:11,dc:170,i:'🚗'},
    {id:'ty',n:'Tesla Model Y',b:75,r:533,ac:11,dc:250,i:'🚙'},
    {id:'id4',n:'VW ID.4',b:77,r:520,ac:11,dc:135,i:'🚙'},
    {id:'id3',n:'VW ID.3',b:58,r:426,ac:11,dc:120,i:'🚗'},
    {id:'p2',n:'Polestar 2',b:69,r:478,ac:11,dc:155,i:'🚗'},
    {id:'i5',n:'Hyundai Ioniq 5',b:77,r:481,ac:11,dc:220,i:'🚙'},
    {id:'ev6',n:'Kia EV6',b:77,r:528,ac:11,dc:233,i:'🚙'},
    {id:'aq4',n:'Audi Q4 e-tron',b:77,r:520,ac:11,dc:135,i:'🚙'},
    {id:'ix3',n:'BMW iX3',b:74,r:460,ac:11,dc:150,i:'🚙'},
    {id:'ex30',n:'Volvo EX30',b:51,r:344,ac:11,dc:153,i:'🚗'},
    {id:'eny',n:'Škoda Enyaq',b:77,r:535,ac:11,dc:135,i:'🚙'},
    {id:'leaf',n:'Nissan Leaf',b:40,r:270,ac:6.6,dc:50,i:'🚗'},
  ];
  const chgs=[
    {id:'sk',n:'Vanlig stikkontakt',p:2.3,t:'AC',i:'🔌',d:'230V / 10A – Nødlading'},
    {id:'1f16',n:'1-fase 16A ladeboks',p:3.6,t:'AC',i:'🏠',d:'230V / 16A – Enkel hjemmelader'},
    {id:'1f32',n:'1-fase 32A ladeboks',p:7.4,t:'AC',i:'⚡',d:'230V / 32A – Rask hjemmelader'},
    {id:'3f16',n:'3-fase 11 kW ladeboks',p:11,t:'AC',i:'🔋',d:'400V / 16A – Anbefalt hjemmelader'},
    {id:'3f32',n:'3-fase 22 kW ladeboks',p:22,t:'AC',i:'⚡',d:'400V / 32A – Profesjonell'},
    {id:'dc50',n:'Hurtiglader 50 kW',p:50,t:'DC',i:'🚀',d:'CCS – Offentlig hurtiglader'},
  ];

  let selCar=null,selChg=null;
  const cg=document.getElementById('car-grid'),chgG=document.getElementById('charger-grid');
  const bs2=document.getElementById('btn-s2'),bs3=document.getElementById('btn-s3');
  const bb1=document.getElementById('btn-b1'),bb2=document.getElementById('btn-b2');
  const steps=document.querySelectorAll('.cs');
  const panels={1:document.getElementById('cp1'),2:document.getElementById('cp2'),3:document.getElementById('cp3')};

  cars.forEach(c=>{
    const d=document.createElement('div');d.className='car-opt';
    d.innerHTML=`<span>${c.i}</span><div class="co-info"><strong>${c.n}</strong><span>${c.b} kWh · ${c.r} km</span></div>`;
    d.addEventListener('click',()=>{cg.querySelectorAll('.car-opt').forEach(x=>x.classList.remove('sel'));d.classList.add('sel');selCar=c;bs2.disabled=false});
    cg.appendChild(d);
  });
  chgs.forEach(c=>{
    const d=document.createElement('div');d.className='chg-opt';
    d.innerHTML=`<span>${c.i}</span><div class="ch-info"><strong>${c.n}</strong><span>${c.d}</span></div>`;
    d.addEventListener('click',()=>{chgG.querySelectorAll('.chg-opt').forEach(x=>x.classList.remove('sel'));d.classList.add('sel');selChg=c;bs3.disabled=false});
    chgG.appendChild(d);
  });

  function goStep(s){
    Object.values(panels).forEach(p=>p.classList.add('hidden'));
    panels[s].classList.remove('hidden');
    steps.forEach(st=>{const n=+st.dataset.s;st.classList.remove('active','done');if(n===s)st.classList.add('active');if(n<s)st.classList.add('done')});
  }
  bs2.addEventListener('click',()=>{if(selCar)goStep(2)});
  bb1.addEventListener('click',()=>goStep(1));
  bb2.addEventListener('click',()=>goStep(2));
  bs3.addEventListener('click',()=>{if(selCar&&selChg){calcResult();goStep(3)}});

  function calcResult(){
    const c=selCar,ch=selChg;
    const eff=ch.t==='AC'?Math.min(ch.p,c.ac):Math.min(ch.p,c.dc);
    const eta=ch.t==='AC'?.9:.95;
    const hrs=c.b/(eff*eta);
    const h=Math.floor(hrs),m=Math.round((hrs-h)*60);
    const cost=(c.b/eta)*1.5;
    const kmh=Math.round(c.r/hrs);
    const ts=h>0?`${h}t ${m}min`:`${m} min`;
    document.getElementById('calc-result').innerHTML=`
      <div class="res-card hl"><span class="res-val">${ts}</span><span class="res-lbl">Ladetid 0–100%</span></div>
      <div class="res-card"><span class="res-val">${Math.round(cost)} kr</span><span class="res-lbl">Kostnad full lading</span></div>
      <div class="res-card"><span class="res-val">${eff} kW</span><span class="res-lbl">Effektiv ladeeffekt</span></div>
      <div class="res-card"><span class="res-val">${kmh} km/t</span><span class="res-lbl">Rekkevidde per time</span></div>
      <div class="res-summary">Med en <strong>${ch.n}</strong> lader du din <strong>${c.n}</strong> (${c.b} kWh) fra 0–100% på ca. <strong>${ts}</strong>, som gir opptil <strong>${c.r} km</strong> rekkevidde.</div>`;
  }

});
