(function(){
  const endpoint="/api/counters";
  const format=n=>Number(n||0).toLocaleString();
  async function fetchTotals(){
    try{
      const r=await fetch(endpoint,{credentials:"same-origin",cache:"no-store"});
      if(!r.ok)return;
      const totals=await r.json();
      document.querySelectorAll("[data-md-counter]").forEach(el=>{
        const key=el.dataset.mdCounter;
        if(key in totals)el.textContent=format(totals[key]);
      });
    }catch(_){}
  }
  function event(type){
    try{fetch(endpoint,{method:"POST",credentials:"same-origin",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({type})}).catch(()=>{});}catch(_){}
  }
  window.MasoomCounters={refresh:fetchTotals,track:event};
  fetchTotals();
  if(document.querySelector("[data-md-counter]"))setInterval(fetchTotals,30000);
})();
