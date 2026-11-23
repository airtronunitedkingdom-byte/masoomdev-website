(function(){
 const endpoint="/api/counters",fmt=n=>Number(n||0).toLocaleString();
 async function refresh(){
  try{const r=await fetch(endpoint,{credentials:"same-origin",cache:"no-store"});if(!r.ok)return;const d=await r.json();
   document.querySelectorAll("[data-md-counter]").forEach(el=>{const k=el.dataset.mdCounter;if(k in d)el.textContent=fmt(d[k])});
   document.querySelectorAll("[data-md-extension-download]").forEach(el=>{const k=el.dataset.mdExtensionDownload;el.textContent=fmt((d.downloads||{})[k])});
  }catch(_){}
 }
 function track(type,slug){try{fetch(endpoint,{method:"POST",credentials:"same-origin",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({type,slug})}).then(()=>refresh()).catch(()=>{})}catch(_){}}
 window.MasoomCounters={refresh,track};refresh();if(document.querySelector("[data-md-counter], [data-md-extension-download]"))setInterval(refresh,30000);
})();