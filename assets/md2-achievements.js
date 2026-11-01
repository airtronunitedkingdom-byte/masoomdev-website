/* Phase 5: local-only achievements and a small, optional Easter egg. */
(()=>{'use strict';
const KEY='md2-achievements-v1',QUEST='md2-daily-progress-v1';
const defs=[
{id:'hello',icon:'👋',name:'First Hello',hint:'Visit MasoomDev'},
{id:'explorer',icon:'🧭',name:'Explorer',hint:'Visit Games, Tools and Apps'},
{id:'quest',icon:'🏆',name:'Quest Finisher',hint:'Complete a Daily Quest'},
{id:'streak3',icon:'🔥',name:'On a Roll',hint:'Reach a 3-day streak'},
{id:'secret',icon:'✨',name:'Secret Finder',hint:'Discover the hidden surprise'}
];
function read(key){try{const p=JSON.parse(localStorage.getItem(key)||'{}');return p&&typeof p==='object'?p:{}}catch(e){return {}}}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}}
function date(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function init(){if(document.getElementById('md2-achievements'))return;let state=read(KEY);state.unlocked=state.unlocked&&typeof state.unlocked==='object'?state.unlocked:{};state.visited=state.visited&&typeof state.visited==='object'?state.visited:{};
const path=location.pathname;const category=path.startsWith('/games/')?'games':path.startsWith('/tools/')||path.startsWith('/seo-tools/')?'tools':path.startsWith('/apps/')?'apps':null;if(category)state.visited[category]=true;
function unlock(id){if(!state.unlocked[id])state.unlocked[id]=date()}
unlock('hello');if(['games','tools','apps'].every(x=>state.visited[x]))unlock('explorer');
function sync(){const q=read(QUEST);if(q.lastComplete)unlock('quest');if(Number(q.streak)>=3)unlock('streak3');save(state);render()}
const css=document.createElement('style');css.id='md2-achievement-style';css.textContent=`
#md2-achievements{margin:24px 0;padding:clamp(18px,3vw,26px);border:1px solid var(--md-border,#ded9ef);border-radius:22px;background:var(--md-surface,#fff);color:var(--md-text,#27213b)}
#md2-achievements h2{font-size:clamp(21px,3vw,28px);margin:0 0 7px}#md2-achievements p{margin:0 0 16px;color:var(--md-muted,#655b78)}
.md2-badge-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.md2-badge{border:1px solid var(--md-border,#ded9ef);border-radius:13px;padding:13px 9px;text-align:center;min-width:0;background:var(--md-soft,#f3efff)}
.md2-badge .md2-badge-icon{font-size:28px;display:block;margin-bottom:5px}
.md2-badge strong{font-size:13px;display:block}.md2-badge small{font-size:11px;display:block;color:var(--md-muted,#655b78);margin-top:5px}
.md2-badge.md2-locked{opacity:.55;filter:grayscale(.75)}
#md2-easter{margin-top:14px;font-size:12px;color:var(--md-muted,#655b78)}
#md2-secret-trigger{border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:4px 6px;border-radius:6px}
#md2-secret-trigger:focus-visible{outline:2px solid #8468e8}
#md2-secret-msg{font-weight:700;color:var(--md-accent,#7654e8)}
@media(max-width:760px){.md2-badge-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;document.head.appendChild(css);
let root=null;
function render(){if(!root)return;const count=defs.filter(x=>state.unlocked[x.id]).length;root.querySelector('#md2-achievement-count').textContent=count+' of '+defs.length+' unlocked';const grid=root.querySelector('.md2-badge-grid');grid.replaceChildren();defs.forEach(x=>{const unlocked=!!state.unlocked[x.id],tile=document.createElement('div');tile.className='md2-badge'+(unlocked?'':' md2-locked');const icon=document.createElement('span');icon.className='md2-badge-icon';icon.textContent=unlocked?x.icon:'🔒';const name=document.createElement('strong');name.textContent=x.name;const hint=document.createElement('small');hint.textContent=unlocked?'Unlocked '+state.unlocked[x.id]:x.hint;tile.append(icon,name,hint);grid.appendChild(tile)})}
const hero=document.querySelector('.hero .shell');if(hero){root=document.createElement('section');root.id='md2-achievements';root.setAttribute('aria-label','Achievements');root.innerHTML='<h2>🏅 Achievements</h2><p id="md2-achievement-count"></p><div class="md2-badge-grid"></div><div id="md2-easter">Psst… sometimes the smallest <button id="md2-secret-trigger" type="button" aria-label="Reveal a hidden surprise">✦</button> brings the biggest smile. <span id="md2-secret-msg" role="status"></span></div>';hero.appendChild(root);root.querySelector('#md2-secret-trigger').addEventListener('click',()=>{unlock('secret');save(state);root.querySelector('#md2-secret-msg').textContent='You found it! 🎉';render()})}
sync();window.addEventListener('md2-quest-update',sync);window.addEventListener('pageshow',sync);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();