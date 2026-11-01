/* MasoomDev 2.0: progressive, lightweight homepage motion. */
(()=>{'use strict';
const css=document.createElement('style');css.id='md2-home-motion';css.textContent=`
.hero{position:relative;isolation:isolate;overflow:hidden}
.hero:before,.hero:after{content:"";position:absolute;pointer-events:none;z-index:-1;border-radius:50%;filter:blur(4px)}
.hero:before{width:clamp(190px,28vw,430px);aspect-ratio:1;right:-7%;top:2%;background:radial-gradient(circle,#a58bfa33,transparent 70%);animation:md2-orbit 14s ease-in-out infinite alternate}
.hero:after{width:clamp(150px,23vw,330px);aspect-ratio:1;left:-8%;bottom:-12%;background:radial-gradient(circle,#7ddac92e,transparent 70%);animation:md2-orbit 17s ease-in-out infinite alternate-reverse}
.hero .eyebrow{display:inline-flex;align-items:center;gap:8px}
.hero h1{letter-spacing:-.035em;line-height:1.08}
.hero .gradient{background-size:180% 180%;animation:md2-gradient 9s ease-in-out infinite alternate}
.hero .actions{display:flex;flex-wrap:wrap;gap:10px}
.hero .actions .btn{transition:transform .18s ease,box-shadow .18s ease}
.hero .actions .btn:hover{transform:translateY(-3px);box-shadow:0 9px 20px #5940a72a}
.md2-entrance{opacity:0;transform:translateY(15px);transition:opacity .55s ease,transform .55s ease}
.md2-entrance.md2-visible{opacity:1;transform:none}
@keyframes md2-orbit{from{transform:translate(0,0) scale(1)}to{transform:translate(-28px,22px) scale(1.1)}}
@keyframes md2-gradient{from{background-position:0% 50%}to{background-position:100% 50%}}
@media(max-width:760px){.hero:before{right:-28%;top:8%}.hero:after{left:-35%}.hero .actions .btn{max-width:100%;white-space:normal}}
@media(prefers-reduced-motion:reduce){.hero:before,.hero:after,.hero .gradient{animation:none!important}.hero .actions .btn{transition:none!important}.md2-entrance{opacity:1!important;transform:none!important;transition:none!important}}
`;document.head.appendChild(css);
function init(){if(!document.querySelector('.hero'))return;const targets=[...document.querySelectorAll('.hero .eyebrow,.hero h1,.hero .lead,.hero .actions,.sectionhead,.section .card')];if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('md2-visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 30px 0px'});targets.forEach((el,i)=>{el.classList.add('md2-entrance');el.style.transitionDelay=Math.min(i%5*55,220)+'ms';observer.observe(el)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();