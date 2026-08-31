(async()=>{try{
const U='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-v84-mobile.js?ref=main&t='+Date.now();
const R=await fetch(U,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!R.ok)throw Error('GitHub API '+R.status);
const J=await R.json();if(!J.content)throw Error('Base V8.4 absente');
const B=atob(J.content.replace(/\s/g,'')),A=Uint8Array.from(B,c=>c.charCodeAt(0));let s=new TextDecoder().decode(A);

// Clic robuste (HTMLElement + SVG)
const clickOld=/const click=e=>\{[\s\S]*?\nconst exact=/;
const clickNew=`const fire=e=>{if(!e)return false;try{if(typeof e.click==='function'){e.click();return true}}catch{}try{e.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true}catch{}return false};
const click=e=>{if(!e)return false;let x=e;for(let i=0;i<7&&x;i++,x=x.parentElement){if(x.matches?.('button,a,[role="button"],[onclick]')||getComputedStyle(x).cursor==='pointer')return fire(x)}return fire(e)};
const exact=`;
if(!clickOld.test(s))throw Error('Patch click introuvable');s=s.replace(clickOld,clickNew);

// Les WO hors viewport doivent rester trouvables.
s=s.replace("const findId=id=>Q(document,'*').filter(V).filter(e=>T(e).includes(id)).sort((a,b)=>T(a).length-T(b).length)[0]||null;","const findId=id=>Q(document,'*').filter(e=>T(e).includes(id)).sort((a,b)=>T(a).length-T(b).length)[0]||null;");

// Détection/fermeture d'Aperçu liée à la WO cible, jamais une ancienne page restée ouverte.
const ow=/const overviewRoot=\(\)=>\{[\s\S]*?\nconst bestVal=/;
const nw=`const overviewRoot=(targetId='')=>{const bt=bodyText();if(targetId&&!bt.toUpperCase().includes(targetId.toUpperCase()))return null;if(!/(aper[cç]u|overview)/i.test(bt))return null;if(!/(order eta|current activity eta|dpa demande|dpa activit[eé] en cours|company|soci[eé]t[eé]|info site|work order site info|problem|probl[eè]me|no s[eé]rie)/i.test(bt))return null;const cs=Q(document,'body *').filter(V).filter(e=>{const r=e.getBoundingClientRect(),t=T(e);return r.width>Math.min(280,innerWidth*.6)&&r.height>260&&/(order eta|dpa demande|dpa activit[eé] en cours|company|soci[eé]t[eé]|problem|probl[eè]me|no s[eé]rie)/i.test(t)}).sort((a,b)=>T(a).length-T(b).length);return cs[0]||document.body};
const waitOverview=async(targetId,cycles=35)=>{for(let i=0;i<cycles;i++){const d=overviewRoot(targetId);if(d){await S(160);return d}await S(100)}return null};
const closeOverview=async(targetId='')=>{if(!overviewRoot(targetId)&&!/(aper[cç]u|overview)/i.test(bodyText()))return true;const cand=Q(document,'button,a,[role="button"],[onclick],span,i,svg').filter(V).filter(e=>{const r=e.getBoundingClientRect(),txt=N(T(e)),meta=N((e.getAttribute?.('aria-label')||'')+' '+(e.getAttribute?.('title')||''));return r.top<115&&r.right>innerWidth-130&&r.width<120&&r.height<120&&(/^(×|x)$/i.test(txt)||/close|fermer/i.test(meta)||/fa-times|fa-xmark|close/i.test(String(e.className?.baseVal||e.className||''))) }).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right)[0];if(cand)fire(cand);else{const z=document.elementFromPoint(Math.max(1,innerWidth-35),52);if(z)fire(z)}for(let i=0;i<16;i++){if(!/(aper[cç]u|overview)/i.test(bodyText()))return true;await S(100)}history.back();for(let i=0;i<25;i++){if(/Liste DI|Work List/i.test(bodyText())&&ids().length)return true;await S(100)}return false};
const bestVal=`;
if(!ow.test(s))throw Error('Patch Overview introuvable');s=s.replace(ow,nw);

// Libellés réellement visibles dans l'Aperçu mobile FR.
s=s.replace("serial:get('Serial','Serial #','N° de série','N° de serie','No de série','No de serie','Numéro de série','Numero de serie')","serial:get('Serial','Serial #','Serial Number','Serial No','S/N','No série','No serie','N° série','N° serie','N° de série','N° de serie','No de série','No de serie','Numéro de série','Numero de serie')");
s=s.replace("contact:get('Contact Name','Nom du contact','Contact')","contact:get('Contact Name','Contact Person','Nom du contact','Contact')");
s=s.replace("phone:get('Contact Phone','Téléphone contact','Telephone contact','Téléphone','Telephone')","phone:get('Contact Phone','Phone','Phone Number','Téléphone du contact','Telephone du contact','Téléphone contact','Telephone contact','Téléphone','Telephone')");
s=s.replace("orderETA:get('Order ETA','ETA commande')","orderETA:get('Order ETA','ETA commande','DPA Demande')");
s=s.replace("currentETA:get('Current Activity ETA','ETA activité actuelle','ETA activite actuelle')","currentETA:get('Current Activity ETA','Current ETA','Activity ETA','ETA activité actuelle','ETA activite actuelle','DPA Activité en cours','DPA Activite en cours')");

const oldLoop="for(let n=0;n<liveBasics.length;n++){const x=liveBasics[n];prog(`Inter ${n+1}/${liveBasics.length} • ${x.id}`);const c=card(x.id);if(!c){parsed.set(x.id,{...x,error:'Carte introuvable'});continue}const b=overviewButton(c);if(!b){parsed.set(x.id,{...x,error:'Overview introuvable'});continue}click(b);const d=await waitOverview();if(!d){parsed.set(x.id,{...x,error:'Overview non détecté'});await closeOverview();continue}parsed.set(x.id,{...x,...parseOverview(d)});await closeOverview();await S(100)}";
const newLoop=`const cardFallback=(c,id)=>{const L=(c?.innerText||'').split(/\\n+/).map(N).filter(Boolean),o={};const wi=L.findIndex(v=>v.toUpperCase().includes(id));if(wi>=0){for(let i=wi+1;i<Math.min(L.length,wi+6);i++){if(!/received|reçu|device|^[-–—]+$/i.test(L[i])&&!/\\d{2}\\/\\d{2}\\/\\d{2}/.test(L[i])){o.company=L[i];break}}}const ph=L.findIndex(v=>/(?:\\+?33|0)[ .()\\d-]{8,}/.test(v));if(ph>=0){o.phone=L[ph].match(/(?:\\+?33|0)[ .()\\d-]{8,}/)?.[0]||L[ph];if(ph>0)o.contact=L[ph-1]}const ad=L.findIndex(v=>/\\b\\d{5}\\b/.test(v));if(ad>=0)o.address=N((ad>0?L[ad-1]+' ':'')+L[ad]);o.problem=L.find(v=>/S\\d{3}-\\d{4}|bourrage|urgent|erreur|error|réseau|reseau|connect/i.test(v))||'';return o};
const openOne=async x=>{try{await goWork()}catch{};await S(120);let c=card(x.id);const fb=cardFallback(c,x.id);if(!c)return{...x,...fb,error:'Carte introuvable'};c.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});await S(220);c=card(x.id)||c;let b=overviewButton(c);if(!b){const a=clickables(c).filter(V),r=c.getBoundingClientRect(),exp=a.filter(e=>{const q=e.getBoundingClientRect();return q.right>r.right-130&&q.top<r.top+120&&q.width<130&&q.height<130}).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right)[0];if(exp){click(exp);await S(250);c=card(x.id)||c;b=overviewButton(c)}}if(!b)return{...x,...fb,currentETA:x.date,error:'Overview introuvable'};click(b);let d=await waitOverview(x.id,24);if(!d){await closeOverview();try{await goWork()}catch{};return{...x,...fb,currentETA:x.date,error:'Aperçu cible non ouvert'}}const info=parseOverview(d),whole=parseOverview(document.body);for(const k of ['company','site','address','requestType','machine','productId','serial','contact','phone','problem','orderETA','currentETA'])if(!info[k]&&whole[k])info[k]=whole[k];for(const k of ['company','address','contact','phone','problem'])if(!info[k]&&fb[k])info[k]=fb[k];if(!info.currentETA)info.currentETA=x.date;const ok=await closeOverview(x.id);if(!ok)info.error='Fermeture Aperçu échouée';try{await goWork()}catch{};await S(120);return{...x,...info}};
for(let n=0;n<liveBasics.length;n++){const x=liveBasics[n];prog(\`Inter \${n+1}/\${liveBasics.length} • \${x.id}\`);parsed.set(x.id,await openOne(x))}`;
if(!s.includes(oldLoop))throw Error('Patch boucle interventions introuvable');s=s.replace(oldLoop,newLoop);

// Afficher l'erreur de parsing dans le pack.
const p3="Current Activity ETA : ${x.currentETA||''}`";const r3="Current Activity ETA : ${x.currentETA||''}\\nErreur parse : ${x.error||''}`";if(s.includes(p3))s=s.replace(p3,r3);

// Retourner sur Liste DI après le scan stock, sans cliquer dans d'autres écrans métier.
const end="const A=[...M.values()].sort((a,b)=>a.ref.localeCompare(b.ref)),U=A.filter(x=>x.available>0);";
const end2="const A=[...M.values()].sort((a,b)=>a.ref.localeCompare(b.ref)),U=A.filter(x=>x.available>0);prog('Retour Liste DI…');history.back();await S(450);if(!(/Liste DI|Work List/i.test(bodyText())&&ids().length)){try{await goWork()}catch{}}";
if(s.includes(end))s=s.replace(end,end2);

s=s.replaceAll('V8.4','V8.11');eval(s);
}catch(e){alert('ASTEA V8.11 loader: '+e.message)}})();