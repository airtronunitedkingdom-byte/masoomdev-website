/* Universal MasoomDev navigation: one header on every page. */
(()=>{'use strict';function init(){if(document.getElementById('md-universal-header'))return;const old=document.querySelector('body > header,body > .top');const h=document.createElement('header');h.id='md-universal-header';h.innerHTML='<a class="md-u-brand" href="/"><span class="md-u-logo">M</span><span>MasoomDev</span></a><div class="md-u-actions"><div class="md-u-menu"><button class="md-u-menu-button" type="button" aria-expanded="false" aria-controls="md-u-panel">☰ Menu</button><nav id="md-u-panel" hidden aria-label="Universal navigation"></nav></div><button class="md-u-theme" type="button" aria-label="Switch theme">☾</button></div>';const css=document.createElement('style');css.textContent=`
#md-universal-header{position:relative!important;z-index:10020!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;flex-wrap:wrap!important;min-height:70px!important;padding:12px clamp(14px,4vw,44px)!important;margin:0!important;width:100%!important;max-width:none!important;background:#fff!important;color:#261b3b!important;border-bottom:1px solid #e7def5!important;box-sizing:border-box!important;font:600 14px/1.4 system-ui,sans-serif!important}
#md-universal-header *{box-sizing:border-box}#md-universal-header .md-u-brand{display:flex!important;align-items:center!important;gap:9px!important;color:#261b3b!important;text-decoration:none!important;font-weight:800!important;font-size:18px!important}
#md-universal-header .md-u-logo{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#a16af7,#5b36bf);color:#fff;font-size:21px}
#md-universal-header .md-u-actions{display:flex;align-items:center;gap:10px;margin-left:auto}
#md-universal-header button{font:700 14px system-ui,sans-serif!important;border:1px solid #d5c9ea!important;background:#f7f3ff!important;color:#382557!important;border-radius:12px!important;padding:10px 13px!important;min-height:42px!important;cursor:pointer!important}
#md-universal-header .md-u-menu{position:relative}#md-universal-header #md-u-panel{position:absolute!important;right:0;top:calc(100% + 9px);width:min(290px,calc(100vw - 25px));max-height:75vh;overflow:auto;background:#fff!important;color:#2b1d42!important;border:1px solid #ded1f2;border-radius:15px;box-shadow:0 14px 40px #26153c35;padding:7px;display:grid;gap:2px;z-index:10030}
#md-universal-header #md-u-panel[hidden]{display:none!important}#md-universal-header #md-u-panel:not([hidden]){transform-origin:top right;animation:md-menu-open .24s cubic-bezier(.2,.8,.2,1) both}#md-universal-header #md-u-panel.md-u-closing{display:grid!important;pointer-events:none;animation:md-menu-close .18s ease-in both!important}@keyframes md-menu-close{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-8px) scale(.97)}}#md-universal-header #md-u-panel:not([hidden]) a{animation:md-menu-item .25s ease-out both}#md-universal-header #md-u-panel:not([hidden]) a:nth-child(2){animation-delay:30ms}#md-universal-header #md-u-panel:not([hidden]) a:nth-child(3){animation-delay:60ms}#md-universal-header #md-u-panel:not([hidden]) a:nth-child(4){animation-delay:90ms}#md-universal-header .md-u-menu-button{transition:transform .18s ease,background .18s ease!important}#md-universal-header .md-u-menu-button:active{transform:scale(.95)}#md-universal-header .md-u-menu-button:focus-visible,#md-universal-header .md-u-theme:focus-visible,#md-universal-header #md-u-panel a:focus-visible{outline:3px solid #8655d6!important;outline-offset:3px!important}#md-universal-header #md-u-panel a{transition:background-color .16s ease,transform .16s ease}#md-universal-header #md-u-panel a:active{transform:scale(.98)}#md-universal-header #md-u-panel{scrollbar-width:thin;scrollbar-color:#b6a0d8 transparent}#md-universal-header #md-u-panel a[aria-current="page"]{font-weight:800!important;border-left:3px solid #8655d6;padding-left:9px!important}#md-universal-header #md-u-panel a:focus-visible{background:#efe8ff!important}html[data-md-theme="dark"] #md-universal-header #md-u-panel a:focus-visible{background:#3b2956!important}@media(hover:hover){#md-universal-header #md-u-panel a:hover{transform:translateX(2px)}}@keyframes md-menu-open{from{opacity:0;transform:translateY(-10px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes md-menu-item{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}@media(prefers-reduced-motion:reduce){#md-universal-header #md-u-panel:not([hidden]),#md-universal-header #md-u-panel:not([hidden]) a{animation:none!important}}#md-universal-header #md-u-panel a{display:block!important;padding:11px 12px!important;color:#34234c!important;text-decoration:none!important;border-radius:9px!important;font-size:14px!important}#md-universal-header #md-u-panel a:hover,#md-universal-header #md-u-panel a[aria-current="page"]{background:#efe8ff!important}
html[data-md-theme="dark"] #md-universal-header{background:#151022!important;color:#fff!important;border-color:#403255!important}html[data-md-theme="dark"] #md-universal-header .md-u-brand{color:#fff!important}html[data-md-theme="dark"] #md-universal-header button{background:#2d2043!important;color:#fff!important;border-color:#5e497a!important}html[data-md-theme="dark"] #md-universal-header #md-u-panel{background:#20172f!important;color:#fff!important}html[data-md-theme="dark"] #md-universal-header #md-u-panel a{color:#fff!important}html[data-md-theme="dark"] #md-universal-header #md-u-panel a:hover{background:#3b2956!important}
@media(max-width:420px){#md-universal-header{padding:10px 12px!important}#md-universal-header #md-u-panel{max-height:min(70dvh,520px);overscroll-behavior:contain}#md-universal-header .md-u-brand{font-size:15px!important}#md-universal-header .md-u-logo{width:33px;height:33px}#md-universal-header .md-u-actions{gap:5px}#md-universal-header button{padding:9px!important;font-size:12px!important}}

/* Shared dark-mode readability: all pages using the universal navigation. */
html[data-md-theme="dark"]{color-scheme:dark;--md-input-bg:#211b32;--md-input-text:#f8f5ff;--md-input-border:#786a95;--md-input-placeholder:#b9afce}
html[data-md-theme="dark"] :is(input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,select){
 background:var(--md-input-bg)!important;color:var(--md-input-text)!important;border-color:var(--md-input-border)!important;caret-color:#d7baff!important}
html[data-md-theme="dark"] :is(input,textarea)::placeholder{color:var(--md-input-placeholder)!important;opacity:1!important}
html[data-md-theme="dark"] :is(input,textarea,select):disabled{opacity:.65}
html[data-md-theme="dark"] :is(input,textarea,select):focus-visible{outline:2px solid #bd9bff!important;outline-offset:2px}
html[data-md-theme="dark"] select option{background:#211b32!important;color:#f8f5ff!important}
html[data-md-theme="dark"] :is(pre,code,output,[role="textbox"],[contenteditable="true"],.output,.result,.output-box,.result-box,.text-output,.code-output){
 color:#f4efff!important;border-color:#64577f!important}
html[data-md-theme="dark"] :is(pre,output,[role="textbox"],[contenteditable="true"],.output,.result,.output-box,.result-box,.text-output,.code-output){
 background:#241e36!important}
html[data-md-theme="dark"] :is(.output,.result,.output-box,.result-box,.text-output,.code-output) :is(p,span,div,small,strong){color:inherit}
html[data-md-theme="dark"] :is(input,textarea,select,pre,output,[role="textbox"],[contenteditable="true"],.output,.result,.output-box,.result-box,.text-output,.code-output)::selection{background:#7852b5;color:#fff}
`;document.head.appendChild(css);if(old)old.replaceWith(h);else document.body.insertBefore(h,document.body.firstChild);
const links=[['Home','/'],['Our Apps','/apps/'],['HTML Tools','/tools/'],['Games','/games/'],['Extensions','/extensions/'],['About','/about/'],['Privacy','/privacy/'],['Support','/support/'],['Terms','/terms/']];const panel=h.querySelector('#md-u-panel');for(const [name,url] of links){const x=document.createElement('a');x.href=url;x.textContent=name;if(location.pathname.replace(/index\.html$/,'')===url)x.setAttribute('aria-current','page');panel.appendChild(x)}
const menu=h.querySelector('.md-u-menu-button');let closingTimer;const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');function finishClose(){panel.hidden=true;panel.classList.remove('md-u-closing');panel.inert=true}function close(returnFocus=false){if(panel.hidden||panel.classList.contains('md-u-closing'))return;menu.setAttribute('aria-expanded','false');menu.textContent='☰ Menu';panel.inert=true;if(returnFocus)menu.focus();if(reduceMotion.matches){finishClose();return}panel.classList.add('md-u-closing');clearTimeout(closingTimer);closingTimer=setTimeout(finishClose,190)}panel.inert=true;menu.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='true'){close(true);return}clearTimeout(closingTimer);panel.classList.remove('md-u-closing');panel.hidden=false;panel.inert=false;menu.setAttribute('aria-expanded','true');menu.textContent='✕ Close'});document.addEventListener('pointerdown',e=>{if(!h.querySelector('.md-u-menu').contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')close(true)});panel.addEventListener('click',e=>{if(e.target.closest('a'))close()});
const key='md2-theme',theme=h.querySelector('.md-u-theme');let saved;try{saved=localStorage.getItem(key)}catch{}function sync(){const dark=document.documentElement.dataset.mdTheme==='dark';theme.textContent=dark?'☀':'☾';theme.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');theme.setAttribute('aria-pressed',String(dark))}if(saved==='dark'||saved==='light')document.documentElement.dataset.mdTheme=saved;sync();theme.addEventListener('click',()=>{const next=document.documentElement.dataset.mdTheme==='dark'?'light':'dark';document.documentElement.dataset.mdTheme=next;try{localStorage.setItem(key,next)}catch{}sync()});

/* Directory-only search, category filter and sorting; game/tool workspaces remain unchanged. */
function setupDirectoryControls(){
 const path=location.pathname.replace(/index\\.html$/,'');
 const configs={
 '/tools/':{hub:'#toolsHub',grid:'.tool-grid',item:'.tool-launch',title:'strong',categories:[['All',''],['Editors','notepad|html-editor'],['Calculators','calc|ebay|pct|percentage'],['Text & Code','words|pass|json|case'],['Images','image']]},
 '/games/':{hub:'#gamesHub',grid:'.game-grid',item:'.game-launch',title:'strong',categories:[['All',''],['Puzzle & Strategy','puzzle|ttt|mines|word-scramble|number-guess|math-quiz'],['Action & Arcade','snake|dino|lane|reaction-time|snooker']]},
 '/extensions/':{hub:'main',grid:'.grid',item:'.card',title:'h2',categories:[['All',''],['Productivity','text-expander'],['Shopping Tools','shein|ebay']]},
 '/apps/':{hub:'main',grid:'.cards',item:'.card',title:'h3',categories:[]}
 };
 const cfg=configs[path];if(!cfg)return;
 const hub=document.querySelector(cfg.hub);if(!hub)return;
 const grids=[...hub.querySelectorAll(cfg.grid)].filter(g=>g.querySelector(cfg.item));
 if(!grids.length)return;
 const style=document.createElement('style');style.textContent=`
 .md-directory-controls{display:flex;align-items:end;flex-wrap:wrap;gap:12px;margin:18px 0 20px;padding:16px;border:1px solid #dcd5ed;border-radius:15px;background:#f8f6ff;color:#28203c}
 .md-directory-controls label{display:grid;gap:5px;font-size:13px;font-weight:700;flex:1 1 160px;min-width:0}
 .md-directory-controls input,.md-directory-controls select{width:100%;box-sizing:border-box;padding:10px 12px;min-height:42px;border-radius:9px;border:1px solid #b9afd0;background:#fff;color:#261c3d;font:inherit}
 .md-directory-count{flex:1 1 100%;font-size:12px;opacity:.8}
 .md-directory-empty{padding:16px;text-align:center;border:1px dashed #9585b6;border-radius:12px;margin:12px 0}
 html[data-md-theme="dark"] .md-directory-controls{background:#241d36;color:#f6f1ff;border-color:#65577d}
 html[data-md-theme="dark"] .md-directory-controls input,html[data-md-theme="dark"] .md-directory-controls select{background:#191426!important;color:#f6f1ff!important;border-color:#82739c!important}
 html[data-md-theme="dark"] .md-directory-empty{color:#f6f1ff;border-color:#82739c}
 `;document.head.appendChild(style);
 grids.forEach(grid=>{
  const cards=[...grid.querySelectorAll(':scope > '+cfg.item)];
  if(cards.length<2)return;
  const bar=document.createElement('div');bar.className='md-directory-controls';bar.setAttribute('role','search');
  const searchLabel=document.createElement('label');searchLabel.textContent='Search';const search=document.createElement('input');search.type='search';search.placeholder='Search by name or description';search.setAttribute('aria-label','Search items');searchLabel.appendChild(search);bar.appendChild(searchLabel);
  let filter=null;
  if(cfg.categories.length){const label=document.createElement('label');label.textContent='Filter';filter=document.createElement('select');filter.setAttribute('aria-label','Filter by category');cfg.categories.forEach(([name,value])=>{const o=document.createElement('option');o.value=value;o.textContent=name;filter.appendChild(o)});label.appendChild(filter);bar.appendChild(label)}
  const sortLabel=document.createElement('label');sortLabel.textContent='Sort by';const sort=document.createElement('select');[['default','Default order'],['az','Name: A to Z'],['za','Name: Z to A'],['latest','Latest added'],['oldest','Oldest added']].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;sort.appendChild(o)});sortLabel.appendChild(sort);bar.appendChild(sortLabel);
  const count=document.createElement('div');count.className='md-directory-count';count.setAttribute('aria-live','polite');bar.appendChild(count);
  const empty=document.createElement('p');empty.className='md-directory-empty';empty.hidden=true;empty.textContent='No matching items found. Try a different search or filter.';
  grid.before(bar);grid.after(empty);
  const data=cards.map((el,index)=>({el,index,name:(el.querySelector(cfg.title)?.textContent||'').trim(),text:el.textContent.toLowerCase(),link:(el.querySelector('a[href]')||el).getAttribute('href')||''}));
  function apply(){
   const q=search.value.trim().toLowerCase(),category=filter?.value||'';
   const visible=data.filter(x=>(!q||x.text.includes(q))&&(!category||category.split('|').some(k=>(x.name+' '+x.link).toLowerCase().includes(k))));
   visible.sort((a,b)=>sort.value==='az'?a.name.localeCompare(b.name):sort.value==='za'?b.name.localeCompare(a.name):sort.value==='latest'?b.index-a.index:a.index-b.index);
   data.forEach(x=>{x.el.hidden=!visible.includes(x);x.el.style.display=visible.includes(x)?'':'none'});
   visible.forEach(x=>grid.appendChild(x.el));
   count.textContent=visible.length+' of '+data.length+' items';empty.hidden=visible.length!==0;
  }
  search.addEventListener('input',apply);filter?.addEventListener('change',apply);sort.addEventListener('change',apply);apply();
 });
}
setupDirectoryControls();

/* Remove legacy injected theme buttons while retaining the single universal control. */const removeLegacy=()=>{document.querySelectorAll('#md2-theme,#md-theme-toggle').forEach(b=>b.remove())};removeLegacy();const observer=new MutationObserver(removeLegacy);observer.observe(document.body,{childList:true,subtree:true});
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();