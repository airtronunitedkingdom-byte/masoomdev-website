(()=>{"use strict";function init(){const nav=document.querySelector('header nav.links,header nav.md-nav-links,header nav:not(.footer nav)');if(!nav)return;const apps=[...nav.querySelectorAll('a')].find(a=>a.getAttribute('href')==='/apps/');if(!apps)return;nav.querySelectorAll('a[href="/tools/"],a[href="/games/"],a[href="/extensions/"]').forEach(a=>a.remove());if(apps.parentElement?.classList.contains('md-apps-menu'))return;const group=document.createElement('div');group.className='md-apps-menu';const trigger=document.createElement('button');trigger.type='button';trigger.className='md-apps-toggle';trigger.setAttribute('aria-label','Open Our Apps submenu');trigger.setAttribute('aria-expanded','false');trigger.textContent='⌄';apps.parentNode.insertBefore(group,apps);group.appendChild(apps);group.appendChild(trigger);const menu=document.createElement('div');menu.className='md-apps-dropdown';menu.setAttribute('aria-label','Our Apps categories');menu.innerHTML='<a href="/tools/">🛠️ Free Tools</a><a href="/extensions/">🧩 Extensions</a><a href="/games/">🎮 Games</a>';group.appendChild(menu);const setOpen=v=>{group.classList.toggle('md-open',v);trigger.setAttribute('aria-expanded',String(v))};trigger.addEventListener('click',e=>{e.stopPropagation();setOpen(!group.classList.contains('md-open'))});group.addEventListener('mouseenter',()=>setOpen(true));group.addEventListener('mouseleave',()=>setOpen(false));group.addEventListener('focusin',()=>setOpen(true));group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))setOpen(false)});document.addEventListener('click',e=>{if(!group.contains(e.target))setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);trigger.focus()}})}const style=document.createElement('style');style.textContent=`.md-apps-menu{position:relative;display:inline-flex;align-items:center;gap:0;isolation:isolate}.md-apps-menu>a{white-space:nowrap}.md-apps-toggle{border:0!important;background:transparent!important;color:inherit!important;cursor:pointer!important;font:inherit!important;padding:6px 7px!important;min-width:24px!important;min-height:30px!important;box-shadow:none!important}.md-apps-toggle:focus-visible{outline:2px solid #8c78ec;outline-offset:2px}.md-apps-dropdown{display:none;position:absolute;top:calc(100% - 1px);left:0;min-width:190px;padding:8px;border:1px solid #d8d8eb;border-radius:12px;background:#fff;box-shadow:0 14px 32px #11152a38;z-index:99999;flex-direction:column;gap:3px;text-align:left}.md-apps-menu:hover .md-apps-dropdown,.md-apps-menu:focus-within .md-apps-dropdown,.md-apps-menu.md-open .md-apps-dropdown{display:flex}.md-apps-dropdown a{display:block!important;float:none!important;padding:11px 13px!important;line-height:1.25!important;font:600 14px system-ui,sans-serif!important;text-decoration:none!important;color:#222e49!important;background:transparent!important;border:0!important;border-radius:8px!important;white-space:nowrap!important}.md-apps-dropdown a:hover,.md-apps-dropdown a:focus-visible{background:#f0edff!important;color:#5136af!important}.md-apps-menu{z-index:9998}@media(max-width:600px){.md-apps-dropdown{left:auto;right:0;min-width:175px}.md-apps-toggle{min-width:32px!important}}`;document.head.appendChild(style);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();

/* Mobile navigation enhancement: isolated from desktop styles. */
(()=>{'use strict';
function setup(){
 const header=document.querySelector('header');
 const nav=header?.querySelector('nav.links,nav.md-nav-links');
 if(!header||!nav||nav.dataset.mdMobileReady)return;
 nav.dataset.mdMobileReady='1';
 if(!nav.id)nav.id='md-mobile-navigation';
 const button=document.createElement('button');
 button.type='button';button.className='md-mobile-menu-button';
 button.setAttribute('aria-controls',nav.id);
 button.setAttribute('aria-expanded','false');
 button.setAttribute('aria-label','Open navigation menu');
 button.textContent='☰';
 nav.parentElement.insertBefore(button,nav);
 const close=()=>{nav.classList.remove('md-mobile-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation menu');button.textContent='☰'};
 button.addEventListener('click',()=>{const opened=nav.classList.toggle('md-mobile-open');button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',opened?'Close navigation menu':'Open navigation menu');button.textContent=opened?'✕':'☰'});
 nav.addEventListener('click',e=>{if(e.target.closest('a')&&e.target.closest('a').getAttribute('href')!=='#')close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.addEventListener('click',e=>{if(!header.contains(e.target))close()});
 window.addEventListener('resize',()=>{if(window.innerWidth>760)close()});
}
const css=document.createElement('style');css.id='md-mobile-nav-fix';css.textContent=`
html,body{max-width:100%;overflow-x:clip}
.md-mobile-menu-button{display:none}
@media(max-width:760px){
 header.top,header{overflow:visible}
 header .nav,header .md-nav{position:relative;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;flex-wrap:wrap!important;min-height:64px!important;padding-top:10px!important;padding-bottom:10px!important;gap:10px!important}
 header .brand{min-width:0;max-width:calc(100% - 70px);font-size:clamp(17px,5vw,22px)}
 .md-mobile-menu-button{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 44px;width:44px;height:44px;border:1px solid #d8d8eb;border-radius:11px;background:#fff;color:#182235;font-size:24px;cursor:pointer;z-index:10002}
 header nav.links,header nav.md-nav-links{display:none!important;position:relative!important;top:auto!important;left:auto!important;right:auto!important;order:10!important;flex:0 0 100%!important;width:100%!important;max-width:100%!important;flex-direction:column!important;align-items:stretch!important;flex-wrap:nowrap!important;gap:0!important;padding:8px!important;margin:0!important;background:#fff!important;border:1px solid #e1e4ed!important;border-radius:14px!important;box-shadow:0 12px 30px #11152a1a!important;overflow:visible!important}
 header nav.links.md-mobile-open,header nav.md-nav-links.md-mobile-open{display:flex!important}
 header nav.links>a,header nav.md-nav-links>a{display:block!important;width:100%;padding:12px 14px!important;font-size:15px!important;line-height:1.4!important}
 header .md-apps-menu{display:flex!important;width:100%;flex-wrap:wrap;justify-content:space-between;z-index:auto}
 header .md-apps-menu>a{flex:1;padding:12px 14px!important;font-size:15px!important}
 header .md-apps-toggle{width:44px!important;height:44px!important}
 header .md-apps-dropdown{position:static!important;flex-basis:100%!important;width:100%!important;min-width:0!important;box-shadow:none!important;border:0!important;border-radius:8px!important;padding:0 6px 6px 14px!important}
 header .md-apps-menu:not(.md-open) .md-apps-dropdown{display:none!important}
 header .md-apps-menu.md-open .md-apps-dropdown{display:flex!important}
 .shell{width:100%;max-width:100%;padding-left:16px!important;padding-right:16px!important}
 .hero h1{overflow-wrap:anywhere}
 .actions .btn{max-width:100%;white-space:normal;text-align:center}
 .cards,.grid2{min-width:0}
 .card,.feature,.document{min-width:0;overflow-wrap:anywhere}
}
`;document.head.appendChild(css);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
