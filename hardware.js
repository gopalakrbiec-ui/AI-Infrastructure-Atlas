const hw={
 h100:{name:'H100 SXM',chips:72,hbm:80,bw:3.35,kw:.7,note:'Illustrative 72-GPU rack-equivalent. Real H100 deployments commonly use 8-GPU HGX nodes; rack layouts vary.'},
 b200:{name:'B200 SXM',chips:72,hbm:180,bw:8,kw:1.0,note:'Uses 72 B200 GPUs as a rack-equivalent for comparison. NVIDIA HGX B200 is an 8-GPU baseboard; actual rack density varies.'},
 rubin:{name:'Rubin NVL72',chips:72,hbm:288,bw:22,kw:1.2,note:'Vera Rubin NVL72 contains 72 Rubin GPUs. Power uses an illustrative 1.2kW/GPU planning value here, not a vendor rack TDP specification.'},
 ironwood:{name:'TPU7x slice',chips:72,hbm:192,bw:7.38,kw:.9,note:'Uses a 72-chip logical slice only for comparable scaling. Ironwood pods contain 9,216 chips; power here is an illustrative planning assumption.'}
};
let selected='h100';
const fmt=x=>x>=1000?(x/1000).toFixed(x>=10000?0:1)+'K':Math.round(x).toLocaleString();
function bytesGB(gb){if(gb>=1e6)return(gb/1e6).toFixed(2)+' PB';if(gb>=1000)return(gb/1000).toFixed(1)+' TB';return gb.toFixed(0)+' GB'}
function power(mw){if(mw>=1000)return(mw/1000).toFixed(2)+' GW';return mw.toFixed(mw<10?2:1)+' MW'}
function updateRack(){const d=hw[selected],r=+document.getElementById('rackCount').value,pue=+document.getElementById('pue').value,chips=d.chips*r;document.getElementById('rackCountOut').textContent=r.toLocaleString();document.getElementById('pueOut').textContent=pue.toFixed(2);document.getElementById('accelResult').textContent=fmt(chips);document.getElementById('hbmResult').textContent=bytesGB(chips*d.hbm);document.getElementById('accelPower').textContent=power(chips*d.kw/1000);document.getElementById('facilityPower').textContent=power(chips*d.kw/1000*pue);document.getElementById('hbmBw').textContent=(chips*d.bw/1000).toFixed(1)+' PB/s';document.getElementById('hwNote').textContent=d.note}
document.querySelectorAll('#hwSelect button').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.hw;document.querySelectorAll('#hwSelect button').forEach(x=>x.classList.toggle('active',x===b));updateRack()}));['rackCount','pue'].forEach(id=>document.getElementById(id).addEventListener('input',updateRack));updateRack();
