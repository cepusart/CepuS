// The saved game stays on this origin; only offer to reload, never interrupt play.
(function(){
 'use strict';
 const current=document.querySelector('meta[name="moho-release"]')?.content;
 if(!current||location.protocol==='file:')return;
 let pending=false,busy=false;
 async function check(){
  if(busy||pending||document.hidden)return;busy=true;
  try{
   const response=await fetch(new URL('release.json',location.href),{cache:'no-store'});
   if(!response.ok)return;const release=await response.json();
   if(typeof release.version!=='string'||!/^[a-f0-9]{20}$/.test(release.version)||release.version===current)return;
   pending=true;const banner=document.createElement('aside');banner.id='moho-web-update';banner.setAttribute('aria-label','Actualización disponible');
   banner.style.cssText='position:fixed;right:16px;bottom:16px;z-index:10000;max-width:min(360px,calc(100vw - 32px));padding:14px;box-sizing:border-box;border:1px solid #cbdba5;border-radius:10px;background:#1d3029;color:#eee6cb;box-shadow:0 5px 25px #0008;font:14px system-ui';
   const text=document.createElement('p');text.textContent='Hay una versión nueva de M.O.H.O.';text.style.margin='0 0 10px';
   const reload=document.createElement('button');reload.type='button';reload.textContent='Actualizar juego';reload.onclick=()=>{const url=new URL(location.href);url.searchParams.set('v',release.version);location.replace(url.href)};
   const later=document.createElement('button');later.type='button';later.textContent='Más tarde';later.style.marginLeft='8px';later.onclick=()=>banner.remove();
   banner.append(text,reload,later);document.body.append(banner);
  }catch{/* A failed check must never interfere with a running game. */}finally{busy=false}
 }
 setTimeout(check,1500);setInterval(check,60000);window.addEventListener('focus',check);
 document.addEventListener('visibilitychange',check);
})();
