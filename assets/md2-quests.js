/* MasoomDev 2.0 Phase 4 — privacy-first daily quests and streaks. */
(()=>{'use strict';
const KEY='md2-daily-progress-v1';
const tasks=[
{id:'visit',label:'Visit MasoomDev today',detail:'Open the website',href:'/',icon:'🏠'},
{id:'game',label:'Explore a game',detail:'Open the Games page or a game',href:'/games/',icon:'🎮'},
{id:'tool',label:'Explore a useful tool',detail:'Open the Tools page or a tool',href:'/tools/',icon:'🛠️'}
];
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function previous(date){const parts=date.split('-').map(Number);if(parts.length!==3||parts.some(x=>!Number.isFinite(x)))return '';const d=new Date(parts[0],parts[1]-1,parts[2]);d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||'{}');return p&&typeof p==='object'?p:{}}catch(e){return {}}}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
function normalise(p,day){if(p.day!==day){const continued=p.lastComplete===previous(day);p={day,done:{},streak:continued?Math.max(0,Math.min(9999,Number(p.streak)||0)):0,lastComplete:p.lastComplete||''}}p.done=p.done&&typeof p.done==='object'?p.done:{};return p}
function mark(id){if(!tasks.some(t=>t.id===id))return;const day=today(),p=normalise(load(),day);p.done[id]=true;if(tasks.every(t=>p.done[t.id])&&p.lastComplete!==day){p.streak=Math.min(9999,(Number(p.streak)||0)+1);p.lastComplete=day}save(p);window.dispatchEvent(new CustomEvent('md2-quest-update',{detail:{day}}))}
function classify(){const path=location.pathname;if(path.startsWith('/games/'))return 'game';if(path.startsWith('/tools/')||path.startsWith('/seo-tools/'))return 'tool';return null}
function init(){mark('visit');const id=classify();if(id)mark(id);
if(!document.querySelector('.hero .shell')||document.getElementById('md2-quest'))return;
const root=document.createElement('section');root.id='md2-quest';root.setAttribute('aria-label','Daily Quest');
root.innerHTML='<div class="md2-quest-head"><div><span class="md2-quest-kicker">✨ YOUR DAILY ADVENTURE</span><h2>Daily Quest</h2><p>Three simple activities. Come back tomorrow to build your streak!</p></div><div class="md2-streak" aria-live="polite"><strong id="md2-streak-count">0</strong><span>🔥 day streak</span></div></div><div class="md2-quest-progress"><div id="md2-quest-bar"></div></div><p id="md2-quest-status" role="status"></p><div id="md2-quest-tasks" class="md2-quest-tasks"></div><p class="md2-quest-privacy">Progress stays in this browser. No login or tracking.</p>';
const hero=document.querySelector('.hero .shell');hero.appendChild(root);
function render(){const p=normalise(load(),today()),done=tasks.filter(t=>p.done[t.id]).length;root.querySelector('#md2-streak-count').textContent=String(Math.max(0,Number(p.streak)||0));root.querySelector('#md2-quest-bar').style.width=(done/tasks.length*100)+'%';root.querySelector('#md2-quest-status').textContent=done===3?'🎉 Daily Quest complete! See you tomorrow.':done+' of '+tasks.length+' activities completed';const list=root.querySelector('#md2-quest-tasks');list.replaceChildren();tasks.forEach(t=>{const link=document.createElement('a');link.className='md2-quest-task'+(p.done[t.id]?' md2-quest-done':'');link.href=t.href;const icon=document.createElement('span');icon.textContent=t.icon;const body=document.createElement('span');const title=document.createElement('strong');title.textContent=t.label;const desc=document.createElement('small');desc.textContent=t.detail;body.append(title,desc);const check=document.createElement('span');check.className='md2-quest-check';check.textContent=p.done[t.id]?'✓':'→';link.append(icon,body,check);if(t.id==='game'||t.id==='tool')link.addEventListener('click',()=>mark(t.id));list.appendChild(link)})}render();window.addEventListener('md2-quest-update',render);window.addEventListener('pageshow',render)}
const css=document.createElement('style');css.id='md2-quest-css';css.textContent=`
#md2-quest{margin:28px 0;padding:clamp(18px,3vw,28px);border:1px solid var(--md-border,#ded9ef);border-radius:22px;background:var(--md-surface,#fff);color:var(--md-text,#27213b)}
.md2-quest-head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.md2-quest-kicker{font-size:12px;letter-spacing:.1em;font-weight:800;color:var(--md-accent,#7654e8)}
#md2-quest h2{font-size:clamp(22px,3vw,29px);margin:5px 0}
#md2-quest p{color:var(--md-muted,#655b78);margin:5px 0 12px}
.md2-streak{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:98px;padding:12px;border-radius:14px;background:var(--md-soft,#f2edff)}
.md2-streak strong{font-size:29px;line-height:1.1}.md2-streak span{font-size:12px}
.md2-quest-progress{height:9px;background:var(--md-soft,#eee8ff);border-radius:20px;overflow:hidden;margin:16px 0 8px}
#md2-quest-bar{height:100%;width:0;background:linear-gradient(90deg,#8060ef,#45bda5);border-radius:20px;transition:width .3s}
.md2-quest-tasks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.md2-quest-task{display:flex;align-items:center;gap:10px;min-width:0;min-height:80px;border:1px solid var(--md-border,#ded9ef);border-radius:13px;padding:12px;color:var(--md-text,#27213b)!important;background:var(--md-soft,#f3efff);text-decoration:none!important}
.md2-quest-task>span:first-child{font-size:23px}.md2-quest-task>span:nth-child(2){min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}.md2-quest-task strong{font-size:13px}.md2-quest-task small{font-size:11px;color:var(--md-muted,#655b78)}
.md2-quest-check{font-size:20px;font-weight:800;color:#7551de}.md2-quest-done .md2-quest-check{color:#15977c}
.md2-quest-task:focus-visible,.md2-quest-task:hover{outline:2px solid #8468e8;outline-offset:2px}
#md2-quest .md2-quest-privacy{font-size:12px;margin:13px 0 0}
@media(max-width:760px){.md2-quest-tasks{grid-template-columns:1fr}.md2-quest-task{min-height:65px}}
@media(prefers-reduced-motion:reduce){#md2-quest-bar{transition:none}}
`;document.head.appendChild(css);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();