(async()=>{try{
const S=m=>new Promise(r=>setTimeout(r,m));
const N=s=>(s||'').replace(/\s+/g,' ').trim();
const fetchCode=async path=>{const u='https://api.github.com/repos/shinobione/risotools/contents/'+path+'?ref=main&t='+Date.now();const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);const j=await r.json();if(!j.content)throw Error(path+' absent');const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));return new TextDecoder().decode(a)};
const STOCK_KEY='shinoastea_stock_cache_v1';

// IMPORTANT: on ne touche pas au moteur V9.1 validé. Ce wrapper ne fait que présenter/enrichir le résultat.
const code=await fetchCode('astea/astea-v91-mobile.js');
eval(code);

let ov=null;for(let i=0;i<500;i++){ov=document.getElementById('shinoAsteaV9Out');if(ov)break;await S(100)}
if(!ov)return;
const ta=ov.querySelector('textarea');if(!ta)return;

// Finition 1 : récupérer le contact depuis la carte Work List (il est visible sur la carte mais pas toujours dans Aperçu).
const contactFromCard=id=>{
  try{
    const cards=[...document.querySelectorAll('worklist-card')];
    const c=cards.find(x=>(x.innerText||'').toUpperCase().includes(String(id).toUpperCase()));
    if(!c)return'';
    const lines=(c.innerText||'').split(/\n/).map(N).filter(Boolean);
    // Le téléphone est la dernière ligne "numéro" de la carte ; le contact est juste au-dessus.
    for(let i=lines.length-1;i>=1;i--){
      const l=lines[i],digits=l.replace(/\D/g,'');
      if(digits.length>=8&&!/\d{2}\/\d{2}\/\d{2,4}/.test(l)){
        const prev=lines[i-1];
        if(prev&&!/^SV\d+\/\d+/i.test(prev)&&!/\d{2}\/\d{2}\/\d{2,4}/.test(prev)&&prev.replace(/\D/g,'').length<6)return prev;
      }
    }
  }catch{}
  return'';
};

// Finition 2 : ordre chronologique sans modifier le moteur ni la baseline de changements.
const parseTs=block=>{
  const m=block.match(/^Date\s*:\s*(\d{2})\/(\d{2})\/(\d{2,4})\s+(\d{1,2}):(\d{2})/m);
  if(!m)return Number.MAX_SAFE_INTEGER;
  let y=+m[3];if(y<100)y+=2000;
  return new Date(y,+m[2]-1,+m[1],+m[4],+m[5]).getTime();
};
const startMarker='=== INTERVENTIONS ACTIVES ===';
const endMarker='=== CHANGEMENTS ===';
const start=ta.value.indexOf(startMarker),end=ta.value.indexOf(endMarker);
if(start>=0&&end>start){
  const before=ta.value.slice(0,start+startMarker.length);
  const middle=ta.value.slice(start+startMarker.length,end);
  const after=ta.value.slice(end);
  let blocks=middle.match(/--- INTERVENTION \d+ ---[\s\S]*?(?=\n\n--- INTERVENTION \d+ ---|\s*$)/g)||[];
  blocks=blocks.map(block=>{
    const id=(block.match(/^WO\s*:\s*(SV\d+\/\d+)/m)||[])[1]||'';
    const contact=contactFromCard(id);
    if(contact&&/^Contact\s*:\s*$/m.test(block))block=block.replace(/^Contact\s*:\s*$/m,'Contact : '+contact);
    return block.trim();
  }).sort((a,b)=>parseTs(a)-parseTs(b)).map((block,i)=>block.replace(/^--- INTERVENTION \d+ ---/,'--- INTERVENTION '+(i+1)+' ---'));
  if(blocks.length)ta.value=before+'\n\n'+blocks.join('\n\n')+'\n\n'+after;
}

// Stock : uniquement cache local validé, aucune navigation automatique.
let stock=null;try{stock=JSON.parse(localStorage.getItem(STOCK_KEY)||'null')}catch{}
let section='Aucun stock mémorisé.\nOuvre LOGISTIQUE > Stock puis lance ShinoAstea > RAFRAÎCHIR STOCK une fois.';
if(stock?.useful?.length){const age=Math.max(0,Date.now()-(stock.ts||0)),hours=Math.floor(age/3600000),mins=Math.floor((age%3600000)/60000);section=`Cache stock : ${new Date(stock.ts).toLocaleString()} (${hours}h ${mins}min)\nRéférences disponibles : ${stock.useful.length}\nFormat : REF | DESCRIPTION | QTY AVAILABLE\n\n${stock.useful.map(x=>`${x.ref} | ${x.desc} | QTY ${x.available}`).join('\n')}`}
const re=/==============================\nSTOCK VEHICULE\n==============================\n[\s\S]*?\n\nScan interventions\s*:/;
if(re.test(ta.value))ta.value=ta.value.replace(re,`==============================\nSTOCK VEHICULE — CACHE LOCAL\n==============================\n${section}\n\nScan interventions :`);

const buttons=[...ov.querySelectorAll('button')];const copy=buttons.find(b=>/COPIER|COPIÉ/.test(b.textContent||''));if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(ta.value)}catch{ta.focus();ta.select();document.execCommand('copy')}copy.textContent='✅ COPIÉ'};
const small=ov.querySelector('small');if(small)small.textContent=(stock?.useful?.length?'Interventions triées + stock en cache':'Interventions triées • stock non mémorisé');
}catch(e){alert('ShinoAstea Pack : '+e.message)}})();