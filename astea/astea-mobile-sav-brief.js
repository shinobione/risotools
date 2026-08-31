(async()=>{try{
const S=m=>new Promise(r=>setTimeout(r,m));
const fetchCode=async path=>{const u='https://api.github.com/repos/shinobione/risotools/contents/'+path+'?ref=main&t='+Date.now();const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);const j=await r.json();if(!j.content)throw Error(path+' absent');const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));return new TextDecoder().decode(a)};
const makePrompt=pack=>`PRÉPARE MA TOURNÉE SAV RISO À PARTIR DU PACK ASTEA CI-DESSOUS.\n\nUtilise d'abord les manuels et documents du projet Riso comme source de vérité. Pour chaque intervention : identifie précisément le modèle/gamme, analyse le code erreur ou le symptôme, donne une démarche de diagnostic terrain simple→mécanique→capteurs/câblage→électrique→cartes, puis indique les composants/emplacements/valeurs uniquement s'ils sont documentés. Distingue clairement « Confirmé par le manuel », « Déduction technique » et « Hypothèse ». Croise le stock véhicule et ne propose une référence que si sa compatibilité est confirmée par les documents ; sinon dis-le. Cite document + page + section autant que possible. Si une intervention manque d'informations, indique ce qu'il faut relever sur place au lieu d'inventer. Classe les interventions par heure et commence par un résumé opérationnel de la tournée.\n\nPACK ASTEA :\n${pack}`;
const code=await fetchCode('astea/astea-v91-pack-mobile.js');
eval(code);
let ov=null,ta=null;for(let i=0;i<650;i++){ov=document.getElementById('shinoAsteaV9Out');ta=ov?.querySelector('textarea')||null;if(ta)break;await S(100)}
if(!ov||!ta)throw Error('Résultat mobile introuvable après le scan.');
const buttons=[...ov.querySelectorAll('button')],close=buttons.find(b=>/FERMER/i.test(b.textContent||'')),bar=close?.parentElement;
if(!bar)throw Error('Barre d’actions mobile introuvable.');
if(document.getElementById('shinoAsteaSavMobile'))return;
const sav=document.createElement('button');sav.id='shinoAsteaSavMobile';sav.textContent='🧰 COPIER POUR CHATGPT — PRÉPARER TOURNÉE';sav.style='min-height:54px;font-weight:800;border-radius:10px;border:0;grid-column:1 / -1';
sav.onclick=async()=>{const out=makePrompt(ta.value);try{await navigator.clipboard.writeText(out)}catch{const x=document.createElement('textarea');x.value=out;document.body.append(x);x.select();document.execCommand('copy');x.remove()}sav.textContent='✅ PRÊT — COLLE DANS LE PROJET RISO'};
bar.insertBefore(sav,bar.firstChild);
}catch(e){alert('ShinoAstea SAV mobile : '+e.message)}})();
