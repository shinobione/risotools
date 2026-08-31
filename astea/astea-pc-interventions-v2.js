(async()=>{try{
const u='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-pc-interventions.js?ref=main&t='+Date.now();
const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);
const j=await r.json();if(!j.content)throw Error('Scanner PC V1 absent');
const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));let s=new TextDecoder().decode(a);

const re=/const closeOverviewPC=async\(\)=>\{[\s\S]*?\};\nconst openOne=/;
const replacement=`const closeOverviewPC=async()=>{
  if(!overviewOpen())return true;
  const waitGone=async(n=10)=>{for(let i=0;i<n;i++){if(!overviewOpen())return true;await S(100)}return !overviewOpen()};
  const tryFire=async e=>{if(!e)return false;fire(e);return await waitGone(10)};

  // 1) Boutons explicitement marqués close/fermer ou X.
  const direct=Q(document,'button,a,[role="button"],[ng-click],[data-ng-click],md-button,md-icon,svg,i,span,div').filter(V).filter(e=>{
    const q=e.getBoundingClientRect(),tx=T(e),meta=N((e.getAttribute?.('aria-label')||'')+' '+(e.getAttribute?.('title')||'')+' '+(e.getAttribute?.('ng-click')||'')+' '+(e.getAttribute?.('data-ng-click')||'')+' '+String(e.className?.baseVal||e.className||''));
    return q.top<220&&q.right>innerWidth*.55&&q.width<150&&q.height<150&&(/^(x|×)$/i.test(tx)||/close|fermer|dismiss|cancel|times|xmark/i.test(meta));
  }).sort((x,y)=>y.getBoundingClientRect().right-x.getBoundingClientRect().right);
  for(const e of direct.slice(0,12))if(await tryFire(e))return true;

  // 2) Sur PC, le X est souvent une icône SVG sans label. On le vise relativement au bandeau "Aperçu".
  const heads=Q(document,'*').filter(V).filter(e=>/^(Aper[cç]u|Overview)$/i.test(T(e))).sort((x,y)=>x.children.length-y.children.length);
  for(const h of heads.slice(0,4)){
    const hr=h.getBoundingClientRect();
    let e=h;
    for(let k=0;k<8&&e&&e!==document.body;k++,e=e.parentElement){
      const rr=e.getBoundingClientRect();
      if(rr.width<280||rr.height>220||rr.top>hr.top+35||rr.bottom<hr.bottom-10)continue;
      const ys=[hr.top+hr.height/2,rr.top+Math.min(36,rr.height/2),rr.top+Math.min(52,rr.height/2)];
      const xs=[rr.right-24,rr.right-34,rr.right-44,rr.right-58];
      for(const y of ys)for(const x of xs){
        if(x<0||y<0||x>innerWidth||y>innerHeight)continue;
        const stack=document.elementsFromPoint?document.elementsFromPoint(x,y):[document.elementFromPoint(x,y)].filter(Boolean);
        const seen=new Set();
        for(const base of stack){
          let z=base;
          for(let n=0;n<7&&z&&z!==document.body;n++,z=z.parentElement){
            if(seen.has(z))continue;seen.add(z);
            const zr=z.getBoundingClientRect();
            if(zr.right<rr.right-130||zr.top>rr.top+140)continue;
            const tag=(z.tagName||'').toLowerCase(),ng=z.getAttribute?.('ng-click')||z.getAttribute?.('data-ng-click')||'',role=z.getAttribute?.('role')||'',cur=getComputedStyle(z).cursor;
            if(/button|a|md-button|md-icon/.test(tag)||role==='button'||ng||cur==='pointer')if(await tryFire(z))return true;
          }
        }
      }
    }
  }

  // 3) Dernier recours sans navigation : Escape. Jamais de history.back() sur PC.
  for(const target of [document,document.body,window]){try{target.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,which:27,bubbles:true,cancelable:true}))}catch{}if(await waitGone(5))return true}
  return false;
};
const openOne=`;
if(!re.test(s))throw Error('Patch fermeture PC introuvable');
s=s.replace(re,replacement);
s=s.replace("const KEY='shinoastea_pc_last_scan_v1';","const KEY='shinoastea_pc_last_scan_v2';");
s=s.replaceAll('SHINOASTEA PC —','SHINOASTEA PC V2 —');
s=s.replaceAll('FIN SHINOASTEA PC','FIN SHINOASTEA PC V2');
s=s.replace("<b style=\"font-size:20px\">ShinoAstea PC</b>","<b style=\"font-size:20px\">ShinoAstea PC V2</b>");
eval(s);
}catch(e){window.__shinoAsteaPcRunning=false;document.getElementById('shinoAsteaPcProgress')?.remove();alert('ShinoAstea PC V2 : '+e.message)}})();