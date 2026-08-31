(async()=>{try{
const U='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-v9-mobile.js?ref=main&t='+Date.now();
const R=await fetch(U,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!R.ok)throw Error('GitHub API '+R.status);
const J=await R.json();if(!J.content)throw Error('V9 absente');
const B=atob(J.content.replace(/\s/g,'')),A=Uint8Array.from(B,c=>c.charCodeAt(0));let s=new TextDecoder().decode(A);

const re=/const closeOverview=async\(\)=>\{[\s\S]*?\};\nconst clickMenu=/;
const replacement=`const closeOverview=async()=>{
  if(!overviewOpen())return true;
  const tryPoint=async(x,y)=>{
    const stack=document.elementsFromPoint?document.elementsFromPoint(x,y):[document.elementFromPoint(x,y)].filter(Boolean);
    const seen=new Set();
    for(const base of stack){
      let e=base;
      for(let k=0;k<7&&e&&e!==document.body;k++,e=e.parentElement){
        if(seen.has(e))continue;seen.add(e);
        const tag=(e.tagName||'').toLowerCase(),ng=e.getAttribute?.('ng-click')||e.getAttribute?.('data-ng-click')||'',role=e.getAttribute?.('role')||'',cur=getComputedStyle(e).cursor;
        if(/button|a|md-button|md-icon/.test(tag)||role==='button'||ng||cur==='pointer'){
          fire(e);await S(180);if(!overviewOpen())return true;
        }
      }
    }
    return false;
  };
  for(const y of [42,50,58,34,66])for(const x of [innerWidth-34,innerWidth-42,innerWidth-26])if(await tryPoint(x,y))return true;
  const cand=Q(document,'button,a,[role="button"],[ng-click],[data-ng-click],md-button,md-icon,svg,i,span,div').filter(V).filter(e=>{
    const r=e.getBoundingClientRect(),tx=T(e),meta=N((e.getAttribute?.('aria-label')||'')+' '+(e.getAttribute?.('title')||'')+' '+(e.getAttribute?.('ng-click')||'')+' '+(e.getAttribute?.('data-ng-click')||''));
    return r.top<100&&r.right>innerWidth-105&&r.width<105&&r.height<105&&(/^(x|×)$/i.test(tx)||/close|fermer|cancel|dismiss|back/i.test(meta));
  }).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right);
  for(const e of cand){fire(e);for(let i=0;i<8;i++){if(!overviewOpen())return true;await S(100)}}
  const z=document.elementFromPoint(innerWidth-34,50),d=z?((z.tagName||'?')+' '+String(z.className?.baseVal||z.className||'')+' ng='+String(z.getAttribute?.('ng-click')||'')): 'none';
  window.__shinoCloseDebug=d;
  return false;
};
const clickMenu=`;
if(!re.test(s))throw Error('Patch closeOverview V9 introuvable');
s=s.replace(re,replacement);
s=s.replace("const KEY='shinoastea_v9_mobile_last_scan';","const KEY='shinoastea_v91_mobile_last_scan';");
s=s.replace("if(!ok)info.error='Aperçu lu mais fermeture impossible';","if(!ok)info.error='Aperçu lu mais fermeture impossible | X='+String(window.__shinoCloseDebug||'?');");
s=s.replaceAll('ShinoAstea V9','ShinoAstea V9.1');
s=s.replaceAll('SHINOASTEA LIVE','SHINOASTEA LIVE V9.1');
eval(s);
}catch(e){alert('ShinoAstea V9.1 loader: '+e.message)}})();