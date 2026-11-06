/* MasoomDev: safe, optional AdSense loader. No ad calls or empty
 * placeholders when disabled or unconfigured.
 */
(function () {
  "use strict";
  function start() {
    var cfg = window.MasoomDevAds;
    if (!cfg || cfg.enabled !== true) return;
    if (!/^ca-pub-\d{16}$/.test(cfg.publisherId || "")) {
      console.warn("[MasoomDev Ads] Publisher ID is missing or invalid; ads remain off.");
      return;
    }
    var slots = document.querySelectorAll("[data-md-ad-slot]");
    var ready = [];
    slots.forEach(function (host) {
      var key = host.getAttribute("data-md-ad-slot");
      var id = cfg.slots && cfg.slots[key];
      if (!/^\d{10}$/.test(id || "")) return;
      ready.push({host:host,id:id});
    });
    if (!ready.length) return;
    var script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.publisherId);
    script.onload = function () {
      ready.forEach(function (entry) {
        var ad = document.createElement("ins");
        ad.className = "adsbygoogle";
        ad.style.display = "block";
        ad.dataset.adClient = cfg.publisherId;
        ad.dataset.adSlot = entry.id;
        ad.dataset.adFormat = "auto";
        ad.dataset.fullWidthResponsive = "true";
        entry.host.appendChild(ad);
        entry.host.hidden = false;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
        catch (e) { console.warn("[MasoomDev Ads] Ad request failed", e); }
      });
    };
    script.onerror = function () { console.warn("[MasoomDev Ads] AdSense script could not load."); };
    document.head.appendChild(script);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
