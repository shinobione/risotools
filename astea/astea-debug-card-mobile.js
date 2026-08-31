(async()=>{try{
const N=s=>(s||'').replace(/\s+/g,' ').trim();
const T=e=>N(e?.innerText||e?.textContent||'');
const WO=/SV\d+\/\d+/gi;
const all=[...new Set(((document.body.innerText||'').match(WO)||[]).map(x=>x.toUpperCase()))];
const target=all.includes('SV741051/1')?'SV741051/1':(all[1]||all[0]);
if(!target)throw Error('Aucune WO détectée');
const els=[...document.querySelectorAll('*')].filter(e=>T(e).includes(target)).sort((a,b)=>T(a).length-T(b).length);
let h=els[0];if(!h)throw Error('WO '+target+' introuvable');
h.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});
await new Promise(r=>setTimeout(r,500));
h=[...document.querySelectorAll('*')].filter(e=>T(e).includes(target)).sort((a,b)=>T(a).length-T(b).length)[0]||h;
const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
const meta=e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:String(e.className?.baseVal||e.className||'').slice(0,140),role:e.getAttribute?.('role')||'',title:e.getAttribute?.('title')||'',aria:e.getAttribute?.('aria-label')||'',text:T(e).slice(0,140),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),cursor:getComputedStyle(e).cursor}};
let ancestors=[],e=h;
for(let i=0;i<10&&e&&e!==document.body;i++,e=e.parentElement){const txt=T(e),r=e.getBoundingClientRect(),clicks=[...e.querySelectorAll('button,a,[role="button"],[onclick],i,svg,span')].filter(vis);ancestors.push({level:i,...meta(e),wo:[...new Set((txt.match(WO)||[]).map(x=>x.toUpperCase()))],clickables:clicks.length,textLen:txt.length});}
let card=null;
for(const a of ancestors){if(a.wo.length===1&&a.wo[0]===target&&a.w>240&&a.h>120&&a.clickables>=2){let x=h;for(let k=0;k<a.level;k++)x=x.parentElement;card=x;break}}
if(!card){card=h;for(let k=0;k<5&&card.parentElement&&card.parentElement!==document.body;k++)card=card.parentElement}
const clickable=[...card.querySelectorAll('button,a,[role="button"],[onclick],i,svg,span')].filter(vis).map(meta).sort((a,b)=>a.y-b.y||a.x-b.x);
const out='=== SHINOASTEA DEBUG CARTE ===\nTarget: '+target+'\nViewport: '+innerWidth+'x'+innerHeight+'\n\n--- ANCESTRES ---\n'+ancestors.map(a=>JSON.stringify(a)).join('\n')+'\n\n--- CLICKABLES CARTE ---\n'+clickable.map((a,i)=>i+' | '+JSON.stringify(a)).join('\n');
let old=document.getElementById('shinoAsteaDebug');if(old)old.remove();
let ov=document.createElement('div');ov.id='shinoAsteaDebug';ov.style='position:fixed;inset:0;z-index:2147483647;background:#111;color:#fff;display:flex;flex-direction:column;font-family:Arial;padding:12px';
let h1=document.createElement('div');h1.innerHTML='<b>ShinoAstea DEBUG</b><br><small>'+target+' — aucun clic métier effectué</small>';h1.style='padding:8px 4px 12px';
let ta=document.createElement('textarea');ta.value=out;ta.readOnly=true;ta.style='flex:1;background:#1b1b1b;color:#eee;border:1px solid #555;border-radius:10px;padding:10px;font:12px monospace;min-height:0';
let bar=document.createElement('div');bar.style='display:grid;grid-template-columns:1fr 1fr;gap:10px;padding-top:12px';
let cp=document.createElement('button');cp.textContent='📋 COPIER DEBUG';cp.style='min-height:54px;font-weight:700;border-radius:10px;border:0';cp.onclick=async()=>{try{await navigator.clipboard.writeText(out)}catch{ta.focus();ta.select();document.execCommand('copy')}cp.textContent='✅ COPIÉ'};
let cl=document.createElement('button');cl.textContent='✕ FERMER';cl.style='min-height:54px;font-weight:700;border-radius:10px;border:0';cl.onclick=()=>ov.remove();
bar.append(cp,cl);ov.append(h1,ta,bar);document.body.append(ov);
}catch(e){alert('ShinoAstea DEBUG: '+e.message)}})();