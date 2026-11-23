(function(){
 document.addEventListener("click",function(e){
  const link=e.target.closest('a[href$=".zip"]');if(!link)return;
  const card=link.closest("[data-md-extension-card]");const slug=card&&card.dataset.mdExtensionCard;
  if(slug&&window.MasoomCounters)window.MasoomCounters.track("download",slug);
 },true);
})();