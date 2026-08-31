(async()=>{try{
const S=m=>new Promise(r=>setTimeout(r,m));
const fetchCode=async path=>{const u='https://api.github.com/repos/shinobione/risotools/contents/'+path+'?ref=main&t='+Date.now();const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);const j=await r.json();if(!j.content)throw Error(path+' absent');const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));return new TextDecoder().decode(a)};
const STOCK_KEY='shinoastea_stock_cache_v1';
const code=await fetchCode('astea/astea-v91-mobile.js');
eval(code);
let ov=null;for(let i=0;i<500;i++){ov=document.getElementById('shinoAsteaV9Out');if(ov)break;await S(100)}
if(!ov)return;
const ta=ov.querySelector('textarea');if(!ta)return;
let stock=null;try{stock=JSON.parse(localStorage.getItem(STOCK_KEY)||'null')}catch{}
let section='Aucun stock mémorisé.\nOuvre LOGISTIQUE > Stock puis lance ShinoAstea > RAFRAÎCHIR STOCK une fois.';
if(stock?.useful?.length){const age=Math.max(0,Date.now()-(stock.ts||0)),hours=Math.floor(age/3600000),mins=Math.floor((age%3600000)/60000);section=`Cache stock : ${new Date(stock.ts).toLocaleString()} (${hours}h ${mins}min)\nRéférences disponibles : ${stock.useful.length}\nFormat : REF | DESCRIPTION | QTY AVAILABLE\n\n${stock.useful.map(x=>`${x.ref} | ${x.desc} | QTY ${x.available}`).join('\n')}`}
const re=/==============================\nSTOCK VEHICULE\n==============================\n[\s\S]*?\n\nScan interventions\s*:/;
if(re.test(ta.value))ta.value=ta.value.replace(re,`==============================\nSTOCK VEHICULE — CACHE LOCAL\n==============================\n${section}\n\nScan interventions :`);
const buttons=[...ov.querySelectorAll('button')];const copy=buttons.find(b=>/COPIER|COPIÉ/.test(b.textContent||''));if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(ta.value)}catch{ta.focus();ta.select();document.execCommand('copy')}copy.textContent='✅ COPIÉ'};
const small=ov.querySelector('small');if(small)small.textContent=(stock?.useful?.length?'Interventions + stock en cache':'Interventions • stock non mémorisé');
}catch(e){alert('ShinoAstea Pack : '+e.message)}})();