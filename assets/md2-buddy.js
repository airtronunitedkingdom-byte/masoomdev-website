/* Masoom Buddy 2.0 — animated local guide. No AI API, tracking or account required. */
(()=>{'use strict';
const robot='<svg class="mb-robot" viewBox="-12 0 124 125" role="img" aria-label="Smiling purple robot"><defs><linearGradient id="mb-shell" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#c8b7ff"/></linearGradient></defs><g class="mb-antenna"><path d="M50 17V9" stroke="#8b5cf6" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="8" r="5" fill="#c084fc"/></g><g class="mb-arm mb-arm-left"><path d="M13 45 Q-5 38 -5 56" fill="none" stroke="#a78bfa" stroke-width="9" stroke-linecap="round"/><circle cx="-5" cy="56" r="7" fill="#d8c8ff"/></g><g class="mb-arm mb-arm-right"><path d="M87 45 Q105 38 105 56" fill="none" stroke="#a78bfa" stroke-width="9" stroke-linecap="round"/><circle cx="105" cy="56" r="7" fill="#d8c8ff"/></g><g class="mb-leg mb-leg-left"><path d="M36 82 L33 104" stroke="#8b5cf6" stroke-width="10" stroke-linecap="round"/><ellipse cx="28" cy="106" rx="13" ry="7" fill="#c4b5fd"/></g><g class="mb-leg mb-leg-right"><path d="M64 82 L67 104" stroke="#8b5cf6" stroke-width="10" stroke-linecap="round"/><ellipse cx="72" cy="106" rx="13" ry="7" fill="#c4b5fd"/></g><rect x="12" y="22" width="76" height="63" rx="26" fill="url(#mb-shell)" stroke="#8c65e8" stroke-width="3"/><rect x="20" y="31" width="60" height="43" rx="17" fill="#211641"/><ellipse cx="38" cy="50" rx="7" ry="9" fill="#7cecff" class="mb-eye"/><ellipse cx="62" cy="50" rx="7" ry="9" fill="#7cecff" class="mb-eye"/><path d="M41 63q9 9 18 0" fill="none" stroke="#c6a6ff" stroke-width="4" stroke-linecap="round"/><circle class="mb-cheek" cx="19" cy="68" r="6" fill="#f9a8d4"/><circle class="mb-cheek" cx="81" cy="68" r="6" fill="#f9a8d4"/></svg>';
const css=document.createElement('style');css.textContent=`
#md2-buddy{position:fixed;right:18px;bottom:18px;z-index:9000;font:14px/1.5 system-ui,sans-serif;color:#24183f}#md2-buddy *{box-sizing:border-box}
#md2-buddy-launch{width:96px;height:96px;border-radius:50%;border:3px solid white;background:linear-gradient(145deg,#ad86ff,#6735d9);box-shadow:0 9px 30px #5630b66e;cursor:pointer;display:grid;place-items:center;animation:mb-float 3.5s ease-in-out infinite}
.mb-robot{width:84px;height:84px;filter:drop-shadow(0 2px 3px #3b1b8d50)}.mb-eye{animation:mb-blink 6s infinite;transform-origin:center}
#md2-buddy-launch:hover{transform:scale(1.08);animation:none}#md2-buddy-launch:focus-visible,#md2-buddy button:focus-visible,#md2-buddy a:focus-visible,#md2-buddy input:focus-visible{outline:3px solid #eaa900;outline-offset:3px}
#md2-buddy-panel{position:absolute;right:0;bottom:108px;width:min(390px,calc(100vw - 24px));height:min(590px,75vh);display:flex;flex-direction:column;overflow:hidden;border:1px solid #d9c8fc;border-radius:22px;background:#fff;box-shadow:0 20px 60px #25133e50;color:#24183f}
#md2-buddy-panel[hidden]{display:none}.mb-head{display:flex;align-items:center;gap:10px;padding:13px 15px;background:linear-gradient(110deg,#6225c7,#9d57e8);color:white}.mb-head .mb-robot{width:43px;height:43px}.mb-head strong{display:block;font-size:16px}.mb-head small{font-size:11px;opacity:.9}.mb-close{margin-left:auto;border:0;border-radius:10px;background:#ffffff30;color:white;font-size:24px;width:35px;height:35px;cursor:pointer}
.mb-chat{padding:14px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:12px;background:#faf8ff}.mb-bubble{max-width:94%;padding:11px 13px;border-radius:16px;background:#fff;box-shadow:0 2px 9px #39255d10;white-space:pre-wrap;overflow-wrap:anywhere}.mb-bubble.user{align-self:flex-end;background:#7040dc;color:white}.mb-bubble.bot{align-self:flex-start}.mb-bubble a{color:#6331c7;font-weight:700}.mb-chips{display:flex;gap:6px;flex-wrap:wrap;padding:9px 12px}.mb-chips button{border:1px solid #d7c9f5;background:#f5f0ff;color:#5330a5;padding:7px 10px;border-radius:20px;font:600 12px system-ui;cursor:pointer}.mb-form{display:flex;gap:7px;padding:0 12px 13px}.mb-form input{min-width:0;flex:1;padding:11px;border:1px solid #d7c9f5;border-radius:12px;font:inherit}.mb-form button{border:0;border-radius:12px;padding:10px 15px;background:#7040dc;color:white;cursor:pointer;font-weight:700}.mb-prompt{position:absolute;right:0;bottom:110px;background:white;padding:8px 12px;border-radius:14px;box-shadow:0 4px 15px #38205628;font-size:12px;white-space:nowrap}
@keyframes mb-float{0%,100%{translate:0 0}50%{translate:0 -7px}}@keyframes mb-blink{0%,44%,48%,100%{scale:1 1}46%{scale:1 .15}}
@media(max-width:480px){#md2-buddy{right:12px;bottom:12px}#md2-buddy-launch{width:74px;height:74px}#md2-buddy-launch .mb-robot{width:66px;height:66px}#md2-buddy-panel{bottom:74px;height:min(530px,70dvh)}.mb-prompt{display:none}}
@media(prefers-reduced-motion:reduce){#md2-buddy-launch,.mb-eye{animation:none!important}}
/* Lightweight Buddy personality: breathing glow, antenna pulse, gentle tilt, cheek shimmer. */
#md2-buddy-launch{position:relative;isolation:isolate;transition:box-shadow .3s ease,background .3s ease;animation:mb-float 3.5s ease-in-out infinite,mb-glow 5s ease-in-out infinite}
#md2-buddy-launch:before{content:"";position:absolute;inset:-7px;border:2px solid #a78bfa70;border-radius:50%;z-index:-1;pointer-events:none;animation:mb-ring 4.8s ease-out infinite}
#md2-buddy-launch .mb-robot{animation:mb-tilt 7s ease-in-out infinite;transform-origin:50% 70%}
#md2-buddy-launch .mb-antenna{animation:mb-antenna 2.7s ease-in-out infinite;transform-origin:50px 17px}
#md2-buddy-launch .mb-cheek{animation:mb-cheeks 5s ease-in-out infinite}
#md2-buddy-launch:hover{animation:mb-glow 2s ease-in-out infinite}
#md2-buddy-launch:hover .mb-robot{animation:mb-wave .8s ease-in-out infinite alternate}
#md2-buddy-launch:active .mb-robot{transform:scale(.92)}
#md2-buddy-launch[aria-expanded="true"]:before{animation:none;opacity:0}
@keyframes mb-glow{0%,100%{box-shadow:0 9px 30px #5630b66e}50%{box-shadow:0 11px 38px #8b5cf6a8,0 0 13px #a78bfa55}}
@keyframes mb-ring{0%{transform:scale(.88);opacity:0}18%{opacity:.7}70%,100%{transform:scale(1.22);opacity:0}}
@keyframes mb-tilt{0%,42%,100%{transform:rotate(0)}48%{transform:rotate(-9deg)}54%{transform:rotate(6deg)}60%{transform:rotate(0)}}
@keyframes mb-wave{from{transform:rotate(-10deg) scale(1.02)}to{transform:rotate(10deg) scale(1.08)}}
@keyframes mb-antenna{0%,100%{transform:rotate(0)}45%{transform:rotate(13deg)}65%{transform:rotate(-8deg)}}
@keyframes mb-cheeks{0%,100%{opacity:.85}50%{opacity:1;filter:brightness(1.25)}}
@media(prefers-reduced-motion:reduce){#md2-buddy-launch,#md2-buddy-launch:before,#md2-buddy-launch .mb-robot,#md2-buddy-launch .mb-antenna,#md2-buddy-launch .mb-cheek{animation:none!important;transition:none!important}}


/* Animated limbs: walking gait, waves, and a cheerful stationary dance. */
#md2-buddy-launch .mb-arm,#md2-buddy-launch .mb-leg{transform-box:fill-box;transform-origin:center top}
#md2-buddy.mb-walking .mb-leg-left{animation:mb-step-left .42s ease-in-out infinite alternate}
#md2-buddy.mb-walking .mb-leg-right{animation:mb-step-right .48s ease-in-out infinite alternate}
#md2-buddy.mb-walking .mb-arm-left{animation:mb-step-right .48s ease-in-out infinite alternate}
#md2-buddy.mb-walking .mb-arm-right{animation:mb-step-left .48s ease-in-out infinite alternate}
#md2-buddy.mb-waving .mb-arm-right{animation:mb-hand-wave .35s ease-in-out 6 alternate}
#md2-buddy.mb-dancing .mb-arm-left{animation:mb-hand-wave .4s ease-in-out 5 alternate}
#md2-buddy.mb-dancing .mb-arm-right{animation:mb-hand-wave .4s ease-in-out 5 alternate-reverse}
#md2-buddy.mb-dancing .mb-leg-left{animation:mb-step-left .4s ease-in-out 5 alternate}
#md2-buddy.mb-dancing .mb-leg-right{animation:mb-step-right .4s ease-in-out 5 alternate}
@keyframes mb-step-left{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}
@keyframes mb-step-right{from{transform:rotate(24deg)}to{transform:rotate(-24deg)}}
@keyframes mb-hand-wave{from{transform:rotate(-15deg)}to{transform:rotate(-65deg)}}
@media(prefers-reduced-motion:reduce){#md2-buddy .mb-arm,#md2-buddy .mb-leg{animation:none!important}}
/* Roaming stays within the viewport; chat returns to its original dock. */
#md2-buddy{transition:transform 5.2s linear}
#md2-buddy .mb-roam-emote{position:absolute;bottom:82px;right:16px;font-size:38px;pointer-events:none;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;filter:drop-shadow(0 3px 6px #27154855)}
#md2-buddy .mb-roam-emote.mb-visible{opacity:1;transform:translateY(-8px)}
@media(prefers-reduced-motion:reduce){#md2-buddy{transition:none!important}}
`;document.head.appendChild(css);
function init(){if(document.querySelector('#md2-buddy'))return;
const root=document.createElement('aside');root.id='md2-buddy';root.setAttribute('aria-label','Masoom Buddy website guide');
root.innerHTML='<div class="mb-prompt" id="mb-prompt">Need help? Ask me! ✨</div><section id="md2-buddy-panel" role="dialog" aria-label="Chat with Masoom Buddy" hidden><div class="mb-head">'+robot+'<div><strong>Masoom Buddy ✨</strong><small>Your friendly website guide · local replies</small></div><button class="mb-close" type="button" aria-label="Close chat">×</button></div><div class="mb-chat" id="mb-chat" aria-live="polite"></div><div class="mb-chips"><button type="button" data-ask="Recommend an app">📱 Apps</button><button type="button" data-ask="Find a tool">🛠️ Tools</button><button type="button" data-ask="Play a game">🎮 Games</button><button type="button" data-ask="What is this page?">📍 This page</button></div><form class="mb-form"><input aria-label="Message Masoom Buddy" placeholder="Ask about apps, games or tools..." maxlength="250" autocomplete="off"><button type="submit">Send</button></form></section><button id="md2-buddy-launch" type="button" aria-label="Open Masoom Buddy" aria-expanded="false" aria-controls="md2-buddy-panel">'+robot+'</button>';
document.body.appendChild(root);const emote=document.createElement('span');emote.className='mb-roam-emote';emote.setAttribute('aria-hidden','true');root.appendChild(emote);
const panel=root.querySelector('#md2-buddy-panel'),chat=root.querySelector('#mb-chat'),launch=root.querySelector('#md2-buddy-launch'),input=root.querySelector('input');
const items=[{terms:/video|movie|player|audio|music/i,name:'MH Player',desc:'An offline video and audio player for Android.',url:'/apps/mh-player/'},{terms:/auth|2fa|otp|password|security/i,name:'Easy Authenticator',desc:'Explore the authenticator app and its features.',url:'/apps/easy-authenticator/'},{terms:/snip|ocr|screenshot|extract|text capture/i,name:'Snip & Extract',desc:'Capture screenshots and extract text on Windows.',url:'/apps/snip-extract/'},{terms:/unit|convert|length|weight|temperature/i,name:'Unit Converter',desc:'Convert everyday measurements in your browser.',url:'/tools/unit-converter/'},{terms:/age|birthday/i,name:'Age Calculator',desc:'Calculate age using the online tool.',url:'/tools/age-calculator/'},{terms:/loan|emi|interest/i,name:'Loan Calculator',desc:'Estimate payments using the calculator.',url:'/tools/loan-calculator/'},{terms:/game|play|fun|snake|puzzle/i,name:'Games',desc:'Find free browser games to play.',url:'/games/'},{terms:/extension|browser add/i,name:'Extensions',desc:'Browse helpful browser extensions.',url:'/extensions/'},{terms:/tool|calculator|utility/i,name:'Free Tools',desc:'Explore free online utilities.',url:'/tools/'},{terms:/app|android|windows|download/i,name:'Our Apps',desc:'Browse Android and Windows applications.',url:'/apps/'}];
function bubble(message,who='bot',url){const el=document.createElement('div');el.className='mb-bubble '+who;el.textContent=message;if(url){const link=document.createElement('a');link.href=url;link.textContent='Open page →';el.append(document.createElement('br'),link)}chat.appendChild(el);chat.scrollTop=chat.scrollHeight}
function reply(q){bubble(q,'user');const text=q.toLowerCase();let item=items.find(x=>x.terms.test(q));if(/this page|where am i|current page/i.test(q)){bubble('You are on '+document.title+'. I can help you find related apps, tools and games.');return}if(/hello|hi|hey|salam/i.test(text)){bubble('Hello! 👋 I’m Masoom Buddy. Tell me what you need: an app, a game, a converter or another tool.');return}if(item){bubble('I think '+item.name+' could help! '+item.desc,item.url?'bot':'bot',item.url)}else{bubble('I can guide you around MasoomDev, but I am not a live AI chatbot yet. Try asking for a video player, OCR, unit converter, calculator, apps or games.');}}
let roamTimer=null,emoteTimer=null,roamPaused=false;
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
function dock(){root.classList.remove('mb-walking','mb-waving','mb-dancing');root.style.transform='translate(0px,0px)';emote.classList.remove('mb-visible')}
function roam(){if(roamPaused||!panel.hidden||motion.matches||document.hidden||window.innerWidth<700){dock();return}
 const size=launch.getBoundingClientRect().width||76;
 const maxX=Math.max(0,window.innerWidth-size-32),maxY=Math.max(0,window.innerHeight-size-42);
 const x=16+Math.random()*maxX-(window.innerWidth-size-18);
 const y=16+Math.random()*maxY-(window.innerHeight-size-18);
 root.classList.remove('mb-waving','mb-dancing');root.classList.add('mb-walking');root.style.transform='translate('+Math.round(x)+'px,'+Math.round(y)+'px)';setTimeout(()=>{root.classList.remove('mb-walking');if(!panel.hidden||document.hidden)return;root.classList.add(Math.random()<.65?'mb-waving':'mb-dancing');setTimeout(()=>root.classList.remove('mb-waving','mb-dancing'),2400)},5300);
 emote.textContent=['👋','💜','✨','😍','🎉','🥳','⭐','❤️','😎','🌟'][Math.floor(Math.random()*7)];
 emote.classList.add('mb-visible');clearTimeout(emoteTimer);emoteTimer=setTimeout(()=>emote.classList.remove('mb-visible'),1800);
}
roamTimer=setInterval(roam,9500);
root.addEventListener('pointerenter',()=>{roamPaused=true});
root.addEventListener('pointerleave',()=>{roamPaused=false});
window.addEventListener('resize',dock,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)dock()});
setTimeout(roam,5000);
function setOpen(open){if(open)dock();panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));root.querySelector('#mb-prompt').hidden=open;if(open){if(!chat.children.length)bubble('Hi! 👋 I’m Masoom Buddy. Tell me what you want to do and I’ll suggest a page that fits.');input.focus()}else launch.focus()}
launch.addEventListener('click',()=>setOpen(panel.hidden));root.querySelector('.mb-close').addEventListener('click',()=>setOpen(false));root.querySelectorAll('[data-ask]').forEach(b=>b.addEventListener('click',()=>reply(b.dataset.ask)));root.querySelector('.mb-form').addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';reply(q)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();