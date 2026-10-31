"use strict";
const $=id=>document.getElementById(id),cv=$("table"),ctx=cv.getContext("2d");
const W=1000,H=520,L=67,T=62,R=933,B=458,rad=11;
const colors={red:"#dd314b",yellow:"#ffd44e",green:"#24ae66",brown:"#995c35",blue:"#347bdb",pink:"#f69bb7",black:"#171c2b",white:"#f7fbff"};
const values={red:1,yellow:2,green:3,brown:4,blue:5,pink:6,black:7};
const spots={yellow:[L+195,347],green:[L+195,173],brown:[L+195,260],blue:[500,260],pink:[690,260],black:[851,260]};
const order=["yellow","green","brown","blue","pink","black"];
const pockets=[[L,T],[500,T],[R,T],[L,B],[500,B],[R,B]];
let guideOn=true,spinX=0,spinY=0,aiTimer=null,lastFrameTime=0,shotHistory=[],balls=[],player=0,scores=[0,0],reds=6,phase="red",clearIndex=0,aim={x:1,y:0},moving=false,shot=null,placing=false,soundOn=true,raf=0,won=false,dragStart=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function ball(type,x,y){return{type,x,y,vx:0,vy:0,spinX:0,spinY:0,alive:true,home:type==="red"||type==="white"?null:[x,y]}}
function reset(){clearTimeout(aiTimer);lastFrameTime=0;cancelAnimationFrame(raf);reds=+$("reds").value;balls=[];shotHistory=[];scores=[0,0];player=0;phase="red";clearIndex=0;moving=false;shot=null;placing=false;won=false;aim={x:1,y:0};
 balls.push(ball("white",L+155,315));
 const n=reds===6?3:4;let count=0;for(let row=0;row<n;row++)for(let k=0;k<=row;k++){if(count++>=reds)break;balls.push(ball("red",740+row*20,260-row*11+k*22))}
 for(const type of order)balls.push(ball(type,...spots[type]));
 message("Player 1 to break. Drag to aim.");renderHistory();resetShotControls();ui();draw()}
function cue(){return balls.find(b=>b.type==="white")}
function redCount(){return balls.filter(b=>b.alive&&b.type==="red").length}
function ui(){for(let i=0;i<2;i++){$("s"+i).textContent=scores[i];$("p"+i).classList.toggle("active",player===i)}
 $("remaining").textContent="Reds: "+redCount();$("target").textContent=phase==="red"?"On: Red (1)":phase==="color"?"On: Colour (2–7)":"On: "+order[clearIndex]+" ("+values[order[clearIndex]]+")";
 $("shoot").disabled=moving||won||!cue().alive||isComputerTurn();$("place").disabled=moving||won||cue().alive}
function message(t){$("message").textContent=t}
function nearestFree(x,y,skip){for(let d=0;d<90;d+=12)for(let a=0;a<16;a++){const xx=clamp(x+Math.cos(a*Math.PI/8)*d,L+rad+3,R-rad-3),yy=clamp(y+Math.sin(a*Math.PI/8)*d,T+rad+3,B-rad-3);if(balls.every(b=>!b.alive||b===skip||Math.hypot(b.x-xx,b.y-yy)>rad*2+2))return[xx,yy]}return[x,y]}
function resPot(b){const p=nearestFree(...spots[b.type],b);b.x=p[0];b.y=p[1];b.vx=b.vy=0;b.alive=true}
function switchTurn(){player=1-player;queueComputer()}
function renderHistory(){const el=$("history");if(el)el.innerHTML=shotHistory.slice(-6).reverse().map(h=>"<li>"+h+"</li>").join("")}
function recordShot(label){shotHistory.push("P"+(shot.player+1)+": "+label);renderHistory()}
function foul(reason){recordShot("Foul — "+reason);scores[1-player]+=Math.max(4,...(shot.potted.map(t=>values[t]||0)),values[shot.first]||0);switchTurn();phase=redCount()?"red":phase==="clear"?"clear":"color";message("Foul: "+reason+". Opponent awarded points.")}
function settle(){moving=false;const white=cue(),p=shot.potted,first=shot.first,required=shot.required;
 const illegalFirst=!first||(required==="red"?first!=="red":required==="color"?first==="red"||first==="white":first!==required);
 const illegalPots=p.some(t=>t==="white"||(required==="red"?t!=="red":required==="color"?t==="red":t!==required));
 if(illegalFirst||illegalPots){foul(!white.alive?"Cue ball potted":illegalFirst?"Wrong first ball":"Wrong ball potted")}
 else if(p.length){recordShot("Potted "+p.join(", "));let earned=p.reduce((sum,t)=>sum+(values[t]||0),0);scores[player]+=earned;
  if(required==="red")phase="color";
  else if(required==="color"){phase=redCount()?"red":"clear";clearIndex=0}
  else{clearIndex++;phase="clear"}
  message("Player "+(player+1)+" scores "+earned+"! "+(phase==="clear"?"Clear the colours.":"Continue your visit."))}
 else{recordShot("No pot");switchTurn();message("No pot. Player "+(player+1)+" to play.")}
 // Colours return to spots until clearance, except colours legitimately cleared in order.
 for(const b of balls){if(b.type==="red"||b.type==="white"||b.alive)continue;
  if(phase==="clear"&&order.indexOf(b.type)<clearIndex)continue;
  resPot(b)}
 if(!white.alive){placing=true;message($("message").textContent+" Place the white ball inside the D.")}
 if(phase==="clear"&&clearIndex>=order.length){won=true;message("Frame over! "+(scores[0]===scores[1]?"Tie game.":"Player "+(scores[0]>scores[1]?1:2)+" wins!")+" Final "+scores.join("–"))}
 shot=null;resetShotControls();ui();draw();queueComputer()}
function isComputerTurn(){return $("mode").value==="pvc"&&player===1&&!won}
function queueComputer(){clearTimeout(aiTimer);if(!isComputerTurn()||moving||won)return;aiTimer=setTimeout(computerShot,850)}
function clearPath(from,to,ignore){const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy);if(len<1)return false;return balls.every(b=>!b.alive||b===from||b===ignore||Math.abs((b.x-from.x)*dy-(b.y-from.y)*dx)/len>rad*2+2||((b.x-from.x)*dx+(b.y-from.y)*dy)/len<=0||((b.x-from.x)*dx+(b.y-from.y)*dy)/len>=len)}
function computerShot(){if(!isComputerTurn()||moving)return;if(!cue().alive){const b=cue(),p=nearestFree(L+145,260,b);Object.assign(b,{x:p[0],y:p[1],alive:true,vx:0,vy:0});placing=false;ui()}const white=cue(),required=phase==="clear"?order[clearIndex]:phase;const targets=balls.filter(b=>b.alive&&b!==white&&(required==="red"?b.type==="red":required==="color"?b.type!=="red":b.type===required));let choices=[];
 for(const b of targets)for(const [px,py] of pockets){const vx=px-b.x,vy=py-b.y,d=Math.hypot(vx,vy);if(d<1)continue;const ghost={x:b.x-vx/d*rad*2,y:b.y-vy/d*rad*2};if(ghost.x<L+rad||ghost.x>R-rad||ghost.y<T+rad||ghost.y>B-rad)continue;if(!clearPath(white,ghost,b)||!clearPath(b,{x:px,y:py},white))continue;const dist=Math.hypot(white.x-ghost.x,white.y-ghost.y);choices.push({x:ghost.x-white.x,y:ghost.y-white.y,rank:dist+d*.3,dist})}
 if(!choices.length){for(const b of targets){if(clearPath(white,b,b))choices.push({x:b.x-white.x,y:b.y-white.y,rank:2000+Math.hypot(b.x-white.x,b.y-white.y),dist:Math.hypot(b.x-white.x,b.y-white.y)})}}
 if(!choices.length&&targets.length){const b=targets[0];choices.push({x:b.x-white.x,y:b.y-white.y,rank:9999,dist:600})}
 if(!choices.length){message("Computer has no available target.");return}choices.sort((a,b)=>a.rank-b.rank);const choice=choices[0],angle=Math.atan2(choice.y,choice.x)+(Math.random()-.5)*.025;aim={x:Math.cos(angle),y:Math.sin(angle)};syncAimControls();$("power").value=clamp(Math.round(38+choice.dist/12),40,100);$("powerLabel").textContent=$("power").value+"%";message("Computer is taking a shot…");draw();aiTimer=setTimeout(()=>{if(isComputerTurn()&&!moving)hit()},450)}
function hit(){if(moving||won||!cue().alive)return;clearTimeout(aiTimer);const b=cue(),p=+$("power").value/100;b.vx=aim.x*(7+p*41);b.vy=aim.y*(7+p*41);b.spinX=spinX;b.spinY=spinY;shot={player,first:null,potted:[],required:phase==="clear"?order[clearIndex]:phase};moving=true;lastFrameTime=0;placing=false;ui();raf=requestAnimationFrame(frame)}
function collision(a,b){let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>=rad*2||d<.0001)return;const nx=dx/d,ny=dy/d,over=rad*2-d;a.x-=nx*over/2;b.x+=nx*over/2;a.y-=ny*over/2;b.y+=ny*over/2;const va=a.vx*nx+a.vy*ny,vb=b.vx*nx+b.vy*ny;if(va-vb<=0)return;if(shot&&!shot.first&&(a.type==="white"||b.type==="white"))shot.first=a.type==="white"?b.type:a.type;const k=(va-vb)*.992;if(a.type==="white"&&Math.abs(a.spinY)>.02){a.vx+=nx*a.spinY*1.9;a.vy+=ny*a.spinY*1.9;a.spinY*=.55}if(b.type==="white"&&Math.abs(b.spinY)>.02){b.vx-=nx*b.spinY*1.9;b.vy-=ny*b.spinY*1.9;b.spinY*=.55}a.vx-=k*nx;a.vy-=k*ny;b.vx+=k*nx;b.vy+=k*ny;beep(210,.025)}
function frame(timestamp){const elapsed=lastFrameTime?Math.min(34,timestamp-lastFrameTime):16.67;lastFrameTime=timestamp;const scale=elapsed/16.67;for(let sub=0;sub<4;sub++){for(const b of balls){if(!b.alive)continue;b.x+=b.vx*scale/4;b.y+=b.vy*scale/4;b.vx*=Math.pow(.9972,scale);b.vy*=Math.pow(.9972,scale);if(b.type==="white"&&Math.abs(b.spinX)>.001){const side=b.spinX*.005*scale;const vx=b.vx,vy=b.vy;b.vx-=vy*side;b.vy+=vx*side;b.spinX*=Math.pow(.996,scale)}if(b.type==="white"&&Math.abs(b.spinY)>.001){b.vx+=aim.x*b.spinY*.013*scale;b.vy+=aim.y*b.spinY*.013*scale;b.spinY*=Math.pow(.992,scale)}if(Math.abs(b.vx)+Math.abs(b.vy)<.065)b.vx=b.vy=0;
 let sunk=false;for(const [px,py] of pockets)if(Math.hypot(b.x-px,b.y-py)<19){b.alive=false;b.vx=b.vy=0;shot.potted.push(b.type);beep(460,.065);sunk=true;break}if(sunk)continue;
 if(b.x<L+rad){b.x=L+rad;b.vx=Math.abs(b.vx)*.86}if(b.x>R-rad){b.x=R-rad;b.vx=-Math.abs(b.vx)*.86}if(b.y<T+rad){b.y=T+rad;b.vy=Math.abs(b.vy)*.86}if(b.y>B-rad){b.y=B-rad;b.vy=-Math.abs(b.vy)*.86}}
 for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++)if(balls[i].alive&&balls[j].alive)collision(balls[i],balls[j])}
 draw();if(balls.some(b=>b.alive&&(Math.abs(b.vx)+Math.abs(b.vy)>.05)))raf=requestAnimationFrame(frame);else{lastFrameTime=0;settle()}}
function draw(){const c=ctx;c.clearRect(0,0,W,H);const wood=c.createLinearGradient(0,0,W,H);wood.addColorStop(0,"#75421e");wood.addColorStop(.5,"#b47c3f");wood.addColorStop(1,"#573016");c.fillStyle=wood;c.fillRect(0,0,W,H);c.fillStyle="#173b2c";c.fillRect(34,28,932,464);const felt=c.createLinearGradient(0,T,0,B);felt.addColorStop(0,"#15754e");felt.addColorStop(.55,"#15945e");felt.addColorStop(1,"#0c6445");c.fillStyle=felt;c.fillRect(L,T,R-L,B-T);
 c.strokeStyle="#bce5bb99";c.lineWidth=2;c.beginPath();c.moveTo(L+195,T);c.lineTo(L+195,B);c.stroke();c.beginPath();c.arc(L+195,260,73,Math.PI/2,Math.PI*1.5);c.stroke();
 for(const [x,y] of pockets){c.fillStyle="#08110e";c.beginPath();c.arc(x,y,23,0,Math.PI*2);c.fill();c.strokeStyle="#d5b06a";c.lineWidth=4;c.stroke()}
 for(let i=0;i<8;i++){c.fillStyle="#e8d19a";c.fillRect(110+i*110,35,4,7);c.fillRect(110+i*110,479,4,7)}
 for(const b of balls){if(!b.alive)continue;const grad=c.createRadialGradient(b.x-4,b.y-5,1,b.x,b.y,rad);grad.addColorStop(0,"#fff9");grad.addColorStop(.3,colors[b.type]);grad.addColorStop(1,b.type==="white"?"#c1c9d1":"#171b24");c.fillStyle="#0005";c.beginPath();c.ellipse(b.x+3,b.y+5,rad,rad*.65,0,0,Math.PI*2);c.fill();c.fillStyle=grad;c.beginPath();c.arc(b.x,b.y,rad,0,Math.PI*2);c.fill()}
 const b=cue();if(b.alive&&!moving&&!won){let tx=b.x,ty=b.y,impact=null;for(let k=0;k<620;k++){tx+=aim.x*2;ty+=aim.y*2;if(tx<L+rad||tx>R-rad||ty<T+rad||ty>B-rad)break;const other=balls.find(o=>o.alive&&o!==b&&Math.hypot(o.x-tx,o.y-ty)<rad*2);if(other){impact={x:tx,y:ty};break}}if(guideOn&&impact){c.fillStyle="#ffffff55";c.beginPath();c.arc(impact.x,impact.y,rad,0,Math.PI*2);c.fill()}if(guideOn){c.setLineDash([10,6]);c.strokeStyle="#fff9";c.lineWidth=2;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(impact?impact.x:b.x+aim.x*180,impact?impact.y:b.y+aim.y*180);c.stroke();c.setLineDash([])}const tailX=b.x-aim.x*310,tailY=b.y-aim.y*310,tipX=b.x-aim.x*18,tipY=b.y-aim.y*18;const stick=c.createLinearGradient(tailX,tailY,tipX,tipY);stick.addColorStop(0,"#271910");stick.addColorStop(.13,"#4b2517");stick.addColorStop(.24,"#a65d30");stick.addColorStop(.72,"#e6bd79");stick.addColorStop(.95,"#f6e6bd");stick.addColorStop(1,"#61b9da");c.lineCap="round";c.strokeStyle="#100e12aa";c.lineWidth=12;c.beginPath();c.moveTo(tailX+3,tailY+4);c.lineTo(tipX+3,tipY+4);c.stroke();c.strokeStyle=stick;c.lineWidth=9;c.beginPath();c.moveTo(tailX,tailY);c.lineTo(tipX,tipY);c.stroke();c.strokeStyle="#f8eac9";c.lineWidth=2;c.beginPath();c.moveTo(b.x-aim.x*58,b.y-aim.y*58);c.lineTo(tipX,tipY);c.stroke();c.lineCap="butt"}
 if(moving){c.fillStyle="#ffffffcc";c.font="bold 16px system-ui";c.fillText("Balls in motion",70,49)}if(placing){c.fillStyle="#ffffffcc";c.font="bold 21px system-ui";c.fillText("Tap inside the D to place the cue ball",110,105)}}
function coords(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
function aimAt(p){const b=cue();const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy);if(d>4){aim={x:dx/d,y:dy/d};syncAimControls();draw()}}
cv.addEventListener("pointerdown",e=>{if(moving||won||isComputerTurn())return;e.preventDefault();const p=coords(e);if(placing){if(p.x>L+rad&&p.x<L+195&&Math.hypot(p.x-(L+195),p.y-260)<=73){const pos=nearestFree(p.x,p.y,cue());Object.assign(cue(),{x:pos[0],y:pos[1],alive:true});placing=false;message("Cue ball placed. Aim and shoot.");ui();draw()}return}dragStart=p;aimAt(p);if(cv.setPointerCapture)cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",e=>{if(dragStart&&!moving&&!isComputerTurn())aimAt(coords(e))});cv.addEventListener("pointerup",e=>{if(dragStart&&!isComputerTurn()){aimAt(coords(e));dragStart=null}});cv.addEventListener("pointercancel",()=>dragStart=null);
let audio;function beep(freq,duration){if(!soundOn)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;g.gain.value=.025;o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
function syncAimControls(){const angle=(Math.atan2(aim.y,aim.x)*180/Math.PI+360)%360;$("aimAngle").textContent=Math.round(angle)+"°";$("aimWheel").setAttribute("aria-valuenow",String(Math.round(angle)));$("aimWheel").querySelector(".wheel-marker").style.transform="rotate("+(angle+90)+"deg)";}
function setAimAngle(degrees){if(moving||won||isComputerTurn())return;const a=degrees*Math.PI/180;aim={x:Math.cos(a),y:Math.sin(a)};syncAimControls();draw()}
function changeAim(delta){setAimAngle(Math.atan2(aim.y,aim.x)*180/Math.PI+delta)}
const wheel=$("aimWheel");let wheelDragging=false;
function aimFromWheel(e){const r=wheel.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);if(Math.hypot(dx,dy)<8)return;setAimAngle(Math.atan2(dy,dx)*180/Math.PI)}
wheel.addEventListener("pointerdown",e=>{if(moving||won||isComputerTurn())return;e.preventDefault();wheelDragging=true;wheel.setPointerCapture(e.pointerId);aimFromWheel(e)});
wheel.addEventListener("pointermove",e=>{if(wheelDragging)aimFromWheel(e)});
wheel.addEventListener("pointerup",()=>{wheelDragging=false});wheel.addEventListener("pointercancel",()=>{wheelDragging=false});
wheel.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();changeAim(e.key==="ArrowLeft"?-1:1)}});
$("aimMinus").onclick=()=>changeAim(-2);$("aimPlus").onclick=()=>changeAim(2);
$("fineAim").oninput=e=>{changeAim(Number(e.target.value));e.target.value=0};
$("mode").onchange=reset; $("power").oninput=()=>{$("powerLabel").textContent=$("power").value+"%"};$("shoot").onclick=hit;$("new").onclick=reset;$("reds").onchange=reset;
$("place").onclick=()=>{if(!moving&&!cue().alive){placing=true;message("Tap inside the D (left semicircle) to place the white ball.");draw()}};
$("sound").onclick=()=>{soundOn=!soundOn;$("sound").textContent=soundOn?"🔊 Sound On":"🔇 Sound Off";$("sound").setAttribute("aria-pressed",String(soundOn))};
$("guide").onclick=()=>{guideOn=!guideOn;$("guide").textContent=guideOn?"Guideline On":"Guideline Off";$("guide").setAttribute("aria-pressed",String(guideOn));draw()};function updateSpin(x,y){spinX=clamp(x,-1,1);spinY=clamp(y,-1,1);const dot=$("spinDot");dot.style.left=(50+spinX*38)+"%";dot.style.top=(50-spinY*38)+"%";$("spinValue").textContent="Side "+Math.round(spinX*100)+"% • Top/Back "+Math.round(spinY*100)+"%";draw()}
const spinWheel=$("spinWheel");let spinDragging=false;
function spinFromPointer(e){const r=spinWheel.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,radius=(r.width-12)*.38;let x=(e.clientX-cx)/radius,y=(cy-e.clientY)/radius;const d=Math.hypot(x,y);if(d>1){x/=d;y/=d}updateSpin(x,y)}
spinWheel.addEventListener("pointerdown",e=>{e.preventDefault();spinDragging=true;spinWheel.setPointerCapture(e.pointerId);spinFromPointer(e)});
spinWheel.addEventListener("pointermove",e=>{if(spinDragging)spinFromPointer(e)});
spinWheel.addEventListener("pointerup",()=>spinDragging=false);
spinWheel.addEventListener("pointercancel",()=>spinDragging=false);
$("resetSpin").onclick=()=>updateSpin(0,0);
function resetShotControls(){spinX=0;spinY=0;updateSpin(0,0);$("power").value=60;$("powerLabel").textContent="60%";$("fineAim").value=0;aim={x:1,y:0};syncAimControls()}
$("power").addEventListener("change",()=>draw());window.addEventListener("keydown",e=>{if(e.code==="Space"&&e.target.tagName!=="BUTTON"){e.preventDefault();hit()}});
reset();