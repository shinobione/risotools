(async()=>{try{
const S=m=>new Promise(r=>setTimeout(r,m));
const N=s=>(s||'').replace(/\s+/g,' ').trim();
const V=e=>{if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
const Q=(r,s)=>[...(r||document).querySelectorAll(s)];
const KEY='shinoastea_stock_cache_v1';
const t0=Date.now();
const bodyText=()=>document.body.innerText||'';
const signal=()=>/\b(?:Available|Disponible)\s*:/i.test(bodyText());
const prog=msg=>{let p=document.getElementById('shinoAsteaStockProgress');if(!p){p=document.createElement('div');p.id='shinoAsteaStockProgress';p.style='position:fixed;left:12px;right:12px;bottom:18px;z-index:2147483646;background:#202124;color:#fff;padding:14px 16px;border-radius:14px;font:600 14px Arial;text-align:center;box-shadow:0 5px 25px #0008';document.body.append(p)}p.textContent='ShinoAstea • Stock • '+msg};
const rmProg=()=>document.getElementById('shinoAsteaStockProgress')?.remove();

if(/RECHERCHE STOCK|SEARCH STOCK/i.test(bodyText())&&!signal())throw Error('Ferme la fenêtre Recherche Stock / filtre, puis relance le rafraîchissement.');
prog('attente des données…');
for(let i=0;i<250&&!signal();i++){if(i%10===0)prog('chargement '+Math.floor(i/10+1)+'s…');await S(100)}
if(!signal())throw Error('Aucune donnée Stock détectée. Ouvre LOGISTIQUE > Stock, attends son chargement, puis relance.');

const hits=()=>Q(document,'body *').filter(e=>V(e)&&/\b(?:Available|Disponible)\s*:/i.test(e.innerText||'')&&!Q(e,':scope > *').some(c=>/\b(?:Available|Disponible)\s*:/i.test(c.innerText||'')));
const block=h=>{let e=h;while(e.parentElement&&e.parentElement!==document.body){const q=e.parentElement,t=(q.innerText||'').trim(),n=(t.match(/\b(?:Available|Disponible)\s*:/gi)||[]).length;if(n>1||t.length>520)break;e=q}return(e.innerText||'').trim()};
let first=hits()[0];if(!first)throw Error('Stock visible mais aucune ligne exploitable détectée.');
let sc=null,node=first.parentElement;
while(node&&node!==document.body){const sty=getComputedStyle(node);if(node.scrollHeight>node.clientHeight+100&&/(auto|scroll)/.test(sty.overflowY)){sc=node;break}node=node.parentElement}
if(!sc)sc=document.scrollingElement||document.documentElement;
const oldTop=sc.scrollTop,M=new Map();
const collect=()=>{for(const h of hits()){
  const t=block(h),r=t.match(/^\s*([0-9]{3}-[0-9]{5}(?:-[A-Za-z0-9]+)?)/),a=t.match(/\b(?:Available|Disponible)\s*:\s*(-?\d+)/i);
  if(!r)continue;
  const l=t.split(/\n+/).map(N).filter(Boolean);
  M.set(r[1],{ref:r[1],desc:l[1]||'',available:a?+a[1]:0});
}};
sc.scrollTop=0;await S(250);
let stable=0,last=-1;
for(let i=0;i<650;i++){
  collect();
  const pos=sc.scrollTop,max=Math.max(0,sc.scrollHeight-sc.clientHeight);
  prog(M.size+' réf. détectées');
  if(pos>=max-5){if(++stable>=3)break}else stable=0;
  sc.scrollTop=Math.min(pos+Math.max(230,sc.clientHeight*.75),max);
  await S(150);
  if(sc.scrollTop===last)stable++;last=sc.scrollTop;
}
collect();sc.scrollTop=oldTop;
const all=[...M.values()].sort((a,b)=>a.ref.localeCompare(b.ref)),useful=all.filter(x=>x.available>0);
if(all.length<20)throw Error('Scan incomplet ('+all.length+' réf.). Aucun cache remplacé.');
localStorage.setItem(KEY,JSON.stringify({ts:Date.now(),all,useful}));
const stamp=new Date().toLocaleString();
const pack=`==============================\nSHINOASTEA STOCK CACHE\n==============================\nMise à jour : ${stamp}\nRéférences totales : ${all.length}\nRéférences disponibles : ${useful.length}\nFormat : REF | DESCRIPTION | QTY AVAILABLE\n\n${useful.map(x=>`${x.ref} | ${x.desc} | QTY ${x.available}`).join('\n')}\n\nScan stock : ${((Date.now()-t0)/1000).toFixed(1)} s\n==============================`;
rmProg();
let old=document.getElementById('shinoAsteaStockOut');if(old)old.remove();
const ov=document.createElement('div');ov.id='shinoAsteaStockOut';ov.style='position:fixed;inset:0;z-index:2147483647;background:#111;color:#fff;display:flex;flex-direction:column;font-family:Arial;padding:12px';
const h=document.createElement('div');h.innerHTML=`<b>ShinoAstea — Stock mémorisé</b><br><small>${useful.length} disponibles / ${all.length} total • ${stamp}</small>`;h.style='padding:8px 4px 12px';
const ta=document.createElement('textarea');ta.value=pack;ta.readOnly=true;ta.style='flex:1;background:#1b1b1b;color:#eee;border:1px solid #555;border-radius:10px;padding:10px;font:12px monospace;min-height:0';
const bar=document.createElement('div');bar.style='display:grid;grid-template-columns:1fr 1fr;gap:10px;padding-top:12px';
const cp=document.createElement('button');cp.textContent='📋 COPIER';cp.style='min-height:54px;font-weight:700;border-radius:10px;border:0';cp.onclick=async()=>{try{await navigator.clipboard.writeText(pack)}catch{ta.focus();ta.select();document.execCommand('copy')}cp.textContent='✅ COPIÉ'};
const cl=document.createElement('button');cl.textContent='✕ FERMER';cl.style='min-height:54px;font-weight:700;border-radius:10px;border:0';cl.onclick=()=>ov.remove();
bar.append(cp,cl);ov.append(h,ta,bar);document.body.append(ov);
}catch(e){document.getElementById('shinoAsteaStockProgress')?.remove();alert('ShinoAstea Stock : '+e.message)}})();