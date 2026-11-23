(function(){
  document.addEventListener("click",function(e){
    const link=e.target.closest('a[href$=".zip"]');
    if(!link)return;
    if(window.MasoomCounters)window.MasoomCounters.track("download");
  },true);
})();
