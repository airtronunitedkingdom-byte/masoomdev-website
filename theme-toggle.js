(function () {
  'use strict';
  var key = 'masoomdev-theme';
  var root = document.documentElement;
  var css = `
    #md-theme-toggle{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;gap:9px;padding:12px 16px;border:1px solid #a78bfa80;border-radius:999px;background:#24203d;color:#fff;box-shadow:0 8px 28px #0005;font:700 14px system-ui,sans-serif;cursor:pointer}
    #md-theme-toggle:hover{transform:translateY(-2px)}
    #md-theme-toggle:focus-visible{outline:3px solid #a78bfa;outline-offset:3px}
    html[data-md-theme="light"]{background:#f7f8fc!important;color:#182235!important;color-scheme:light}
    html[data-md-theme="light"] body{background:#f7f8fc!important;color:#182235!important}
    html[data-md-theme="light"] .top,html[data-md-theme="light"] header,html[data-md-theme="light"] footer,html[data-md-theme="light"] .footer{background:#fff!important;color:#182235!important;border-color:#dce2ed!important}
    html[data-md-theme="light"] .section.alt{background:#eef1f9!important}
    html[data-md-theme="light"] .card,html[data-md-theme="light"] .document,html[data-md-theme="light"] .box,html[data-md-theme="light"] .panel,html[data-md-theme="light"] .feature,html[data-md-theme="light"] .faq,html[data-md-theme="light"] .info{background:#fff!important;color:#182235!important;border-color:#dce2ed!important}
    html[data-md-theme="light"] :is(p,li,small,.muted,.lead,.card p,.links a,.footlinks a,.stat span,.footer span){color:#48566e!important}
    html[data-md-theme="light"] :is(h1,h2,h3,h4,strong,.brand,nav a,.links a.active){color:#182235!important}
    html[data-md-theme="light"] a:not(.btn):not(.button){color:#5543bd}
    html[data-md-theme="light"] .btn:not(.primary),html[data-md-theme="light"] .button:not(.primary){background:#ecebfa!important;color:#382a91!important;border-color:#c9c4f0!important}
    html[data-md-theme="light"] .btn.primary{color:#fff!important}
    html[data-md-theme="light"] .eyebrow,html[data-md-theme="light"] .pill{color:#5642ae!important}
    html[data-md-theme="light"] .gradient{color:#6748d7!important;background:none!important}
    html[data-md-theme="light"] #md-theme-toggle{background:#fff;color:#182235;border-color:#c5bde8;box-shadow:0 8px 24px #18223524}
    @media(max-width:600px){#md-theme-toggle{right:14px;bottom:14px;padding:11px 14px;font-size:13px}}
    @media(prefers-reduced-motion:no-preference){#md-theme-toggle{transition:transform .2s,background .2s}}
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  var stored;
  try { stored = localStorage.getItem(key); } catch (_) {}
  var theme = stored === 'light' || stored === 'dark' ? stored : (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  function apply(next) {
    root.setAttribute('data-md-theme', next);
    var b = document.getElementById('md-theme-toggle');
    if (b) { b.textContent = next === 'dark' ? '☀ Light theme' : '☾ Dark theme'; b.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' theme'); b.setAttribute('aria-pressed', String(next === 'light')); }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0b1020' : '#f7f8fc');
  }
  apply(theme);
  function ready() {
    if (document.getElementById('md-theme-toggle')) return;
    var button = document.createElement('button');
    button.id = 'md-theme-toggle';
    button.type = 'button';
    button.title = 'Change website theme';
    button.addEventListener('click', function () {
      theme = root.getAttribute('data-md-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, theme); } catch (_) {}
      apply(theme);
    });
    document.body.appendChild(button);
    apply(theme);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
