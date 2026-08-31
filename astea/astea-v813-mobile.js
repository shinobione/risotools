(async()=>{try{
const u='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-v811-mobile.js?ref=main&t='+Date.now();
const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);
const j=await r.json();if(!j.content)throw Error('V8.11 absente');
const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));let s=new TextDecoder().decode(a);

const re=/const openOne=async x=>\{[\s\S]*?\};\nfor\(let n=0;n<liveBasics\.length;n\+\+\)/;
const replacement=`const workCardById=id=>Q(document,'worklist-card').find(e=>T(e).toUpperCase().includes(id.toUpperCase()))||card(id);
const overviewBtnDirect=c=>c?.querySelector('button[aria-label*="orderOverviewStr"]')||c?.querySelector('button[aria-label*="orderOverview"]')||null;
const openOne=async x=>{try{await goWork()}catch{};await S(100);let c=workCardById(x.id),fb=cardFallback(c,x.id);if(!c)return{...x,...fb,currentETA:x.date,error:'Carte introuvable'};c.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});await S(140);c=workCardById(x.id)||c;let btn=overviewBtnDirect(c);if(!btn)return{...x,...fb,currentETA:x.date,error:'Bouton Aperçu exact introuvable'};fire(btn);let d=await waitOverview(x.id,24);if(!d){await closeOverview();try{await goWork()}catch{};await S(160);c=workCardById(x.id)||c;c.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});await S(120);btn=overviewBtnDirect(c);if(btn){fire(btn);d=await waitOverview(x.id,24)}}if(!d){await closeOverview();try{await goWork()}catch{};return{...x,...fb,currentETA:x.date,error:'Aperçu '+x.id+' non ouvert'}}const info=parseOverview(d),whole=parseOverview(document.body);for(const k of ['company','site','address','requestType','machine','productId','serial','contact','phone','problem','orderETA','currentETA'])if(!info[k]&&whole[k])info[k]=whole[k];for(const k of ['company','address','contact','phone','problem'])if(!info[k]&&fb[k])info[k]=fb[k];if(!info.currentETA)info.currentETA=x.date;const ok=await closeOverview(x.id);if(!ok)info.error='Fermeture Aperçu échouée';try{await goWork()}catch{};await S(100);return{...x,...info}};
for(let n=0;n<liveBasics.length;n++)`;
if(!re.test(s))throw Error('Patch openOne V8.11 introuvable');s=s.replace(re,replacement);

s=s.replace("const KEY='astea_v84_mobile_last_scan';","const KEY='astea_v813_mobile_last_scan';");
s=s.replaceAll('V8.4','V8.13');
eval(s);
}catch(e){alert('ASTEA V8.13 loader: '+e.message)}})();