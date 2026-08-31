(async()=>{try{
const u='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-v811-mobile.js?ref=main&t='+Date.now();
const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);
const j=await r.json();if(!j.content)throw Error('V8.11 absente');
const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));let s=new TextDecoder().decode(a);

const re=/const openOne=async x=>\{[\s\S]*?\};\nfor\(let n=0;n<liveBasics\.length;n\+\+\)/;
const replacement=`const getWorkCard=id=>{let h=findId(id);let c=h?.closest?.('worklist-card');if(c&&T(c).toUpperCase().includes(id.toUpperCase()))return c;return Q(document,'worklist-card').find(e=>T(e).toUpperCase().includes(id.toUpperCase()))||null};
const waitOverviewButton=async id=>{let c=getWorkCard(id);if(!c)return{c:null,btn:null};c.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});await S(520);for(let i=0;i<18;i++){c=getWorkCard(id)||c;let btn=c?.querySelector?.('button[aria-label*="orderOverviewStr"],button[aria-label*="orderOverview"]');if(btn)return{c,btn};if(i===5)c?.scrollIntoView?.({block:'end',inline:'nearest',behavior:'auto'});await S(100)}return{c,btn:null}};
const openOne=async x=>{try{await goWork()}catch{};await S(120);let z=await waitOverviewButton(x.id),c=z.c,btn=z.btn,fb=cardFallback(c,x.id);if(!c)return{...x,...fb,currentETA:x.date,error:'Carte introuvable'};if(!btn)return{...x,...fb,currentETA:x.date,error:'Bouton Aperçu non rendu après attente'};fire(btn);let d=await waitOverview(x.id,30);if(!d){await closeOverview();try{await goWork()}catch{};await S(180);z=await waitOverviewButton(x.id);c=z.c||c;btn=z.btn;if(btn){fire(btn);d=await waitOverview(x.id,30)}}if(!d){await closeOverview();try{await goWork()}catch{};return{...x,...fb,currentETA:x.date,error:'Aperçu '+x.id+' non ouvert'}}const info=parseOverview(d),whole=parseOverview(document.body);for(const k of ['company','site','address','requestType','machine','productId','serial','contact','phone','problem','orderETA','currentETA'])if(!info[k]&&whole[k])info[k]=whole[k];for(const k of ['company','address','contact','phone','problem'])if(!info[k]&&fb[k])info[k]=fb[k];if(!info.currentETA)info.currentETA=x.date;const ok=await closeOverview(x.id);if(!ok)info.error='Fermeture Aperçu échouée';try{await goWork()}catch{};await S(100);return{...x,...info}};
for(let n=0;n<liveBasics.length;n++)`;
if(!re.test(s))throw Error('Patch openOne V8.11 introuvable');s=s.replace(re,replacement);

s=s.replace("const KEY='astea_v84_mobile_last_scan';","const KEY='astea_v813_mobile_last_scan';");
s=s.replaceAll('V8.4','V8.14');
eval(s);
}catch(e){alert('ASTEA V8.14 loader: '+e.message)}})();
