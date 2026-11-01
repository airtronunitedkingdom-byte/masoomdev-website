/* MasoomDev desktop navigation preview — mobile-style drawer on desktop only. */
(()=>{'use strict';function init(){const header=document.querySelector('header');if(!header||header.querySelector('#md-desktop-menu-button'))return;const bar=header.querySelector('.shell.nav,.md-header-inner,.nav,.header-inner')||header;const existing=header.querySelector('nav.links,nav.md-nav-links,nav[aria-label="Main navigation"]');if(!existing)return;
const css=document.createElement('style');css.textContent=`
@media(min-width:900px){
header.md-desktop-nav-ready nav.links,header.md-desktop-nav-ready nav.md-nav-links,header.md-desktop-nav-ready nav[aria-label="Main navigation"]{display:none!important}
header.md-desktop-nav-ready .md-desktop-menu-button{display:flex!important}
header.md-desktop-nav-ready .md-desktop-menu-wrap{margin-left:auto;position:relative;z-index:10010}
header.md-desktop-nav-ready .md-desktop-menu-panel{position:absolute;right:0;top:calc(100% + 12px);width:min(310px,calc(100vw - 32px));max-height:min(75vh,650px);overflow-y:auto;padding:10px;border:1px solid #b8a9df55;border-radius:19px;background:var(--md-surface,#fff);color:var(--md-text,#29213c);box-shadow:0 16px 44px #1b0e3d30;display:grid;gap:3px}
header.md-desktop-nav-ready .md-desktop-menu-panel[hidden]{display:none!important}
header.md-desktop-nav-ready .md-desktop-menu-panel a{display:block;padding:12px 14px;border-radius:11px;color:inherit;text-decoration:none;font:600 14px system-ui,sans-serif}
header.md-desktop-nav-ready .md-desktop-menu-panel a:hover,header.md-desktop-nav-ready .md-desktop-menu-panel a:focus-visible{background:#7953dd1b;outline-offset:2px}
header.md-desktop-nav-ready .md-desktop-menu-panel a[aria-current="page"]{background:#7953dd26}
}
.md-desktop-menu-wrap,.md-desktop-menu-button{display:none}
.md-desktop-menu-button{align-items:center;gap:9px;border:1px solid #a797d777;border-radius:13px;padding:10px 15px;min-height:44px;background:var(--md-surface,#fff);color:var(--md-text,#29213c);font:700 14px system-ui,sans-serif;cursor:pointer}
.md-desktop-menu-button:focus-visible{outline:3px solid #7953dd;outline-offset:3px}
@media(min-width:900px){.md-desktop-menu-wrap{display:block!important}}
`;document.head.appendChild(css);
const wrap=document.createElement('div');wrap.className='md-desktop-menu-wrap';const btn=document.createElement('button');btn.type='button';btn.id='md-desktop-menu-button';btn.className='md-desktop-menu-button';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','md-desktop-menu-panel');btn.setAttribute('aria-label','Open navigation menu');btn.textContent='☰  Menu';const panel=document.createElement('nav');panel.id='md-desktop-menu-panel';panel.className='md-desktop-menu-panel';panel.setAttribute('aria-label','Desktop navigation');panel.hidden=true;
const links=[['Home','/'],['Our Apps','/apps/'],['Free Tools','/tools/'],['Games','/games/'],['Extensions','/extensions/'],['About','/about/'],['Privacy','/privacy/'],['Support','/support/']];
const current=location.pathname.replace(/index\.html$/,'');for(const [name,href] of links){const l=document.createElement('a');l.href=href;l.textContent=name;if(current===href)l.setAttribute('aria-current','page');panel.appendChild(l)}
wrap.append(btn,panel);bar.appendChild(wrap);header.classList.add('md-desktop-nav-ready');
function close(){panel.hidden=true;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Open navigation menu');btn.textContent='☰  Menu'}
btn.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');btn.textContent=open?'✕  Close':'☰  Menu'});
document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();btn.focus()}});window.addEventListener('resize',()=>{if(innerWidth<900)close()});
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();