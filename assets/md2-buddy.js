/* Masoom Buddy — lightweight, accessible, no tracking or external services. */
(()=>{'use strict';
const css=document.createElement('style');css.id='md2-buddy-style';css.textContent=`
#md2-buddy{position:fixed;right:clamp(12px,3vw,24px);bottom:clamp(12px,3vw,24px);z-index:9000;font:15px/1.45 system-ui,sans-serif;color:#28213b}
#md2-buddy *{box-sizing:border-box}
#md2-buddy-launch{width:62px;height:62px;border-radius:21px;border:2px solid #fff;background:linear-gradient(145deg,#a88cff,#6843da);color:white;box-shadow:0 8px 25px #30205655;display:grid;place-items:center;cursor:pointer;font-size:32px;transition:transform .2s}
#md2-buddy-launch:hover{transform:translateY(-3px)}
#md2-buddy-launch:focus-visible,#md2-buddy button:focus-visible,#md2-buddy a:focus-visible{outline:3px solid #ffbe4d;outline-offset:3px}
#md2-buddy-panel{position:absolute;bottom:75px;right:0;width:min(345px,calc(100vw - 24px));max-height:min(75vh,550px);overflow:auto;border:1px solid #ded5f7;border-radius:20px;background:#fff;color:#28213b;box-shadow:0 16px 50px #25153b40;padding:18px}
#md2-buddy-panel[hidden]{display:none}
.md2-buddy-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.md2-buddy-top strong{font-size:19px}
#md2-buddy-close{width:38px;height:38px;border:0;background:#eee8ff;border-radius:10px;font-size:22px;cursor:pointer;color:#36276a}
#md2-buddy-message{margin:12px 0 16px;color:#5b526b}
.md2-buddy-links{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.md2-buddy-links a{display:flex;align-items:center;justify-content:center;min-height:44px;text-align:center;text-decoration:none;font-weight:700;font-size:13px;padding:9px;border-radius:11px;background:#f1ebff;color:#4933a2}
.md2-buddy-links a:hover{background:#e5d9ff}
#md2-buddy-tip{margin:15px 0 0;padding:11px;background:#f8f5ff;border-radius:11px;color:#564a6b;font-size:13px}
#md2-buddy-tip-btn{margin-top:10px;border:1px solid #d5c7f3;border-radius:9px;padding:9px 12px;background:white;color:#51369e;cursor:pointer;font-weight:700}
@media(max-width:480px){#md2-buddy{right:12px;bottom:12px}#md2-buddy-launch{width:54px;height:54px;border-radius:18px;font-size:28px}#md2-buddy-panel{bottom:66px;right:0;max-height:65vh}}
@media(prefers-reduced-motion:reduce){#md2-buddy-launch{transition:none}}
`;document.head.appendChild(css);
function init(){if(document.getElementById('md2-buddy'))return;const root=document.createElement('aside');root.id='md2-buddy';root.setAttribute('aria-label','Masoom Buddy website helper');
root.innerHTML='<section id="md2-buddy-panel" role="dialog" aria-modal="false" aria-label="Masoom Buddy suggestions" hidden><div class="md2-buddy-top"><strong>👋 Hey, I’m Masoom Buddy!</strong><button id="md2-buddy-close" type="button" aria-label="Close Masoom Buddy">×</button></div><p id="md2-buddy-message">Need something fun or useful? Pick a destination below.</p><div class="md2-buddy-links"><a href="/games/">🎮 Play a game</a><a href="/tools/">🛠️ Try a tool</a><a href="/apps/">📱 Explore apps</a><a href="/extensions/">🧩 Extensions</a></div><p id="md2-buddy-tip" aria-live="polite"></p><button id="md2-buddy-tip-btn" type="button">Another tip ✨</button></section><button id="md2-buddy-launch" type="button" aria-expanded="false" aria-controls="md2-buddy-panel" aria-label="Open Masoom Buddy">✦</button>';
document.body.appendChild(root);
const panel=root.querySelector('#md2-buddy-panel'),launch=root.querySelector('#md2-buddy-launch'),close=root.querySelector('#md2-buddy-close'),tip=root.querySelector('#md2-buddy-tip');
const tips=['Try the free browser games for a quick break.','Our online tools work without creating an account.','Explore the Extensions page for useful browser utilities.','You can switch between light and dark themes.','Use Magic Search on the homepage to find something quickly.'];
let index=0;function showTip(){tip.textContent=tips[index++%tips.length]}showTip();
function setOpen(open){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));launch.setAttribute('aria-label',open?'Close Masoom Buddy':'Open Masoom Buddy');if(open)close.focus();else launch.focus()}
launch.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));root.querySelector('#md2-buddy-tip-btn').addEventListener('click',showTip);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!root.contains(e.target)){panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-label','Open Masoom Buddy')}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();