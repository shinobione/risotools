(async()=>{try{
if(typeof Element!=='undefined'&&typeof Element.prototype.click!=='function'){
  Object.defineProperty(Element.prototype,'click',{configurable:true,value:function(){this.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))}});
}
const u='https://api.github.com/repos/shinobione/risotools/contents/astea/astea-v89-mobile.js?ref=main&t='+Date.now();
const r=await fetch(u,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error('GitHub API '+r.status);
const j=await r.json();if(!j.content)throw Error('V8.9 absente');
const b=atob(j.content.replace(/\s/g,'')),a=Uint8Array.from(b,c=>c.charCodeAt(0));let s=new TextDecoder().decode(a);
s=s.replaceAll('V8.9','V8.10');
eval(s);
}catch(e){alert('ASTEA V8.10 loader: '+e.message)}})();