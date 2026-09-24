const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Mobile navigation
const navToggle = $('#navToggle');
const nav = $('.nav');
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Scroll reveal
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

// Number count-up
function formatCompact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1).replace('.0','') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace('.0','') + 'K';
  return String(n);
}
const countObs = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const el = entry.target;
  const target = Number(el.dataset.count);
  const compact = el.dataset.compact === 'true';
  const start = performance.now();
  const duration = 1200;
  const tick = now => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = target * eased;
    el.textContent = compact ? formatCompact(value) : (target < 100 ? value.toFixed(target < 10 ? 3 : 2) : Math.round(value).toLocaleString());
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  countObs.unobserve(el);
}), {threshold:.5});
$$('[data-count]').forEach(el => countObs.observe(el));

// Animated background particles
const canvas = $('#particleCanvas');
const ctx = canvas?.getContext('2d');
let particles = [];
function resizeCanvas(){
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.min(90, Math.floor(innerWidth / 18));
  particles = Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.5+.4}));
}
function drawParticles(){
  if (!ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(let i=0;i<particles.length;i++){
    const p=particles[i]; p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(127,194,255,.28)';ctx.fill();
    for(let j=i+1;j<particles.length;j++){
      const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);
      if(d<110){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(107,228,255,${.06*(1-d/110)})`;ctx.stroke();}
    }
  }
  requestAnimationFrame(drawParticles);
}
if(canvas){resizeCanvas();addEventListener('resize',resizeCanvas);drawParticles();}

// Cluster explorer
const clusters = {
  google:{badge:'MULTI-SITE TRAINING',name:'Google Pathways + TPU',desc:'Google says JAX + Pathways can distribute training across multiple sites and scale training across more than one million TPUs globally.',scale:'>1M TPUs',topology:'Multi-site',why:'Weeks, not months',link:'https://blog.google/intl/en-in/company-news/technology/sundar-pichai-io-2026/'},
  microsoft:{badge:'AI SUPERFACTORY',name:'Microsoft Fairwater',desc:'Microsoft describes Fairwater sites as a distributed AI superfactory where multiple locations can cooperate on one training job using hundreds of thousands of Blackwell GPUs.',scale:'100Ks of GPUs',topology:'Linked regions',why:'One distributed job',link:'https://news.microsoft.com/source/features/ai/from-wisconsin-to-atlanta-microsoft-connects-datacenters-to-build-its-first-ai-superfactory/'},
  aws:{badge:'ULTRACLUSTER',name:'AWS Project Rainier',desc:'AWS says Project Rainier brought nearly 500,000 Trainium2 chips online for Anthropic workloads using UltraServer and UltraCluster architecture.',scale:'~500K Trainium2',topology:'UltraCluster',why:'Hyperscale training',link:'https://aws.amazon.com/blogs/aws/aws-weekly-roundup-project-rainier-online-amazon-nova-amazon-bedrock-and-more-november-3-2025/'},
  xai:{badge:'SINGLE INTERCONNECTED CLUSTER',name:'xAI Colossus',desc:'xAI describes Colossus as a single interconnected H100 cluster that reached 200,000 GPUs; a later disclosure says Colossus 1 has over 220,000 NVIDIA GPUs including H100, H200 and GB200.',scale:'200K H100 cluster',topology:'Concentrated site',why:'Fast iteration',link:'https://x.ai/colossus'}
};
$$('.cluster-tab').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.cluster-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const c=clusters[btn.dataset.cluster];
  $('#clusterBadge').textContent=c.badge;$('#clusterName').textContent=c.name;$('#clusterDesc').textContent=c.desc;$('#clusterScale').textContent=c.scale;$('#clusterTopology').textContent=c.topology;$('#clusterWhy').textContent=c.why;$('#clusterLink').href=c.link;
  $('#clusterViz').animate([{opacity:.35,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:360,easing:'ease-out'});
}));

// Compute simulator
const inputs = ['totalParams','activeRatio','tokens','gpuCount','effectiveTflops','hourlyCost'];
inputs.forEach(id => $('#'+id)?.addEventListener('input', updateLab));
function fmtSci(n){
  const exp=Math.floor(Math.log10(n)); const mant=n/10**exp;
  return `${mant.toFixed(2)}×10${toSup(exp)}`;
}
function toSup(n){const map={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return String(n).split('').map(c=>map[c]).join('')}
function money(n){if(n>=1e9)return '$'+(n/1e9).toFixed(2)+'B';if(n>=1e6)return '$'+(n/1e6).toFixed(1)+'M';if(n>=1e3)return '$'+(n/1e3).toFixed(1)+'K';return '$'+n.toFixed(0)}
function bytesFmt(n){const units=['B','KB','MB','GB','TB','PB'];let i=0;while(n>=1000&&i<units.length-1){n/=1000;i++}return `${n>=100? n.toFixed(0):n>=10?n.toFixed(1):n.toFixed(2)} ${units[i]}`}
function hoursFmt(h){if(h>=1e9)return (h/1e9).toFixed(2)+'B';if(h>=1e6)return (h/1e6).toFixed(2)+'M';if(h>=1e3)return (h/1e3).toFixed(1)+'K';return h.toFixed(0)}
function energyFmt(kwh){if(kwh>=1e9)return (kwh/1e9).toFixed(2)+' TWh';if(kwh>=1e6)return (kwh/1e6).toFixed(1)+' GWh';if(kwh>=1e3)return (kwh/1e3).toFixed(1)+' MWh';return kwh.toFixed(0)+' kWh'}
function updateLab(){
  const totalB=+$('#totalParams').value,ratio=+$('#activeRatio').value/100,tokensT=+$('#tokens').value,gpus=+$('#gpuCount').value,tflops=+$('#effectiveTflops').value,rate=+$('#hourlyCost').value;
  const activeB=totalB*ratio;
  const flops=6*(activeB*1e9)*(tokensT*1e12);
  const gpuHours=flops/(tflops*1e12*3600);
  const days=gpuHours/gpus/24;
  const modelBytes=totalB*1e9*2;
  const cost=gpuHours*rate;
  const kwh=gpuHours*.7;
  $('#totalParamsOut').textContent=totalB>=1000?(totalB/1000).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+'T':totalB+'B';
  $('#activeRatioOut').textContent=Math.round(ratio*100)+'%';$('#tokensOut').textContent=tokensT+'T';$('#gpuCountOut').textContent=gpus.toLocaleString();$('#effectiveTflopsOut').textContent=tflops;$('#hourlyCostOut').textContent='$'+rate.toFixed(2);
  $('#daysResult').textContent=days<1?(days*24).toFixed(1)+' hours':days<365?days.toFixed(1)+' days':(days/365).toFixed(1)+' years';
  $('#activeParamsResult').textContent=activeB>=1000?(activeB/1000).toFixed(2)+'T':activeB.toFixed(activeB<10?1:0)+'B';
  $('#modelSizeResult').textContent=bytesFmt(modelBytes);$('#flopsResult').textContent=fmtSci(flops);$('#gpuHoursResult').textContent=hoursFmt(gpuHours);$('#costResult').textContent=money(cost);$('#energyResult').textContent=energyFmt(kwh);
  $('#timeGauge').style.width=Math.max(2,Math.min(100,(Math.log10(Math.max(days,.1))+1)/4*100))+'%';
}
if ($('#totalParams')) updateLab();

// Iteration demo
$$('.iter-btn').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.iter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const days=+btn.dataset.days, cycles=365/days;
  $('#iterationsPerYear').textContent=cycles.toFixed(1)+'×';
  $('#iterationRing').style.strokeDashoffset=String(Math.max(4,100-Math.min(100,cycles/10*100)));
}));
