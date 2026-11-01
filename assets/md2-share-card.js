/* MasoomDev 2.0 Phase 6 — shareable achievement card; rendered locally. */
(()=>{'use strict';
const ACH='md2-achievements-v1',QUEST='md2-daily-progress-v1';
function read(k){try{const v=JSON.parse(localStorage.getItem(k)||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
function init(){const hero=document.querySelector('.hero .shell');if(!hero||document.getElementById('md2-share'))return;
const style=document.createElement('style');style.textContent=`
#md2-share{margin:24px 0;padding:clamp(18px,3vw,28px);border:1px solid var(--md-border,#ded9ef);border-radius:22px;background:var(--md-surface,#fff);color:var(--md-text,#27213b)}
#md2-share h2{margin:0 0 6px;font-size:clamp(21px,3vw,28px)}#md2-share p{color:var(--md-muted,#655b78);margin:0 0 16px}
.md2-share-preview{max-width:560px;overflow:hidden;border-radius:17px;background:linear-gradient(125deg,#321b72,#7953dd 65%,#ab77e8);color:#fff;padding:22px 24px}
.md2-share-preview .md2-share-brand{font-size:13px;letter-spacing:.12em;font-weight:800;opacity:.9}
.md2-share-preview h3{font-size:clamp(22px,4vw,31px);margin:13px 0 16px;color:#fff}
.md2-share-stats{display:flex;flex-wrap:wrap;gap:12px}.md2-share-stat{background:#ffffff20;border:1px solid #ffffff35;border-radius:12px;padding:11px 17px;min-width:115px}
.md2-share-stat strong{display:block;font-size:28px}.md2-share-stat span{font-size:12px}
.md2-share-preview .md2-share-footer{font-size:12px;opacity:.85;margin-top:16px}
.md2-share-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:15px}
.md2-share-actions button{border:0;border-radius:11px;padding:12px 17px;background:#7151d7;color:#fff;font:700 14px system-ui;cursor:pointer;min-height:44px}
.md2-share-actions button:hover{background:#5939b7}.md2-share-actions button:focus-visible{outline:3px solid #ffb84a;outline-offset:2px}
#md2-share-status{margin:10px 0 0!important;font-size:13px}
`;document.head.appendChild(style);
const root=document.createElement('section');root.id='md2-share';root.setAttribute('aria-label','Share your progress');
root.innerHTML='<h2>🎨 Share your progress</h2><p>Turn your streak and achievements into a shareable image. Your data stays on this device.</p><div class="md2-share-preview" aria-label="Challenge card preview"><div class="md2-share-brand">✦ MASOOMDEV</div><h3>My Everyday Adventure</h3><div class="md2-share-stats"><div class="md2-share-stat"><strong id="md2-share-streak">0</strong><span>🔥 Day streak</span></div><div class="md2-share-stat"><strong id="md2-share-badges">0/5</strong><span>🏅 Achievements</span></div></div><div class="md2-share-footer">Small things. Big smiles. • masoomdev-website.vercel.app</div></div><div class="md2-share-actions"><button type="button" id="md2-share-download">⬇ Save PNG</button><button type="button" id="md2-share-native">↗ Share card</button></div><p id="md2-share-status" role="status" aria-live="polite"></p>';
hero.appendChild(root);
const status=root.querySelector('#md2-share-status');
function stats(){const a=read(ACH),q=read(QUEST);const count=['hello','explorer','quest','streak3','secret'].filter(x=>a.unlocked&&a.unlocked[x]).length;const streak=Math.max(0,Math.min(9999,Number(q.streak)||0));return {count,streak}}
function refresh(){const s=stats();root.querySelector('#md2-share-streak').textContent=s.streak;root.querySelector('#md2-share-badges').textContent=s.count+'/5'}refresh();
window.addEventListener('md2-quest-update',refresh);window.addEventListener('pageshow',refresh);
function makeImage(){const s=stats(),canvas=document.createElement('canvas');canvas.width=1200;canvas.height=630;const c=canvas.getContext('2d');if(!c)throw Error('Canvas unavailable');const grad=c.createLinearGradient(0,0,1200,630);grad.addColorStop(0,'#2f1b72');grad.addColorStop(.65,'#7953dd');grad.addColorStop(1,'#ad78e8');c.fillStyle=grad;c.fillRect(0,0,1200,630);c.fillStyle='#ffffff14';c.beginPath();c.arc(1090,80,230,0,Math.PI*2);c.fill();c.beginPath();c.arc(90,570,210,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.font='bold 30px system-ui,sans-serif';c.fillText('✦  MASOOMDEV',80,95);c.font='bold 66px system-ui,sans-serif';c.fillText('My Everyday Adventure',80,205);
function tile(x,label,value){c.fillStyle='#ffffff22';c.beginPath();if(typeof c.roundRect==='function'){c.roundRect(x,265,480,210,24)}else{c.rect(x,265,480,210)}c.fill();c.fillStyle='#fff';c.font='bold 96px system-ui,sans-serif';c.fillText(value,x+36,377);c.font='28px system-ui,sans-serif';c.fillText(label,x+36,429)}
tile(80,'Day streak',String(s.streak));tile(640,'Achievements',s.count+' / 5');c.fillStyle='#ffffffdf';c.font='25px system-ui,sans-serif';c.fillText('Small things. Big smiles.',80,552);c.font='20px system-ui,sans-serif';c.fillText('masoomdev-website.vercel.app',80,590);return canvas}
function blob(){return new Promise((resolve,reject)=>{try{makeImage().toBlob(b=>b?resolve(b):reject(Error('PNG creation failed')),'image/png')}catch(e){reject(e)}})}
function download(b){const url=URL.createObjectURL(b),link=document.createElement('a');link.href=url;link.download='MasoomDev-My-Adventure.png';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
root.querySelector('#md2-share-download').addEventListener('click',async()=>{try{status.textContent='Preparing image…';download(await blob());status.textContent='PNG prepared for download.'}catch(e){status.textContent='Could not generate the image in this browser.'}});
root.querySelector('#md2-share-native').addEventListener('click',async()=>{try{status.textContent='Preparing share card…';const b=await blob(),file=new File([b],'MasoomDev-My-Adventure.png',{type:'image/png'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'My MasoomDev Adventure'});status.textContent='Share sheet opened.'}else{download(b);status.textContent='Image downloaded — sharing files is not supported here.'}}catch(e){status.textContent=e.name==='AbortError'?'Sharing cancelled.':'Sharing unavailable. Try Save PNG.'}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();