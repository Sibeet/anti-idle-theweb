import {ensureArcade} from './arcade.mjs?v=0.20.0';
import {startPong,stepPong,finishPong,activatePongPower} from './pong.mjs?v=0.20.0';
export function createPongUI({getRoot,save,log,refresh,isActive}){
 const $=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('en-US');let owner=getRoot(),game=null,last=performance.now(),result=null,drag=false,input={up:false,down:false};
 const clearInput=()=>{drag=false;input={up:false,down:false};};
 function settle(){if(!game||game.settled)return;result=finishPong(getRoot(),game);clearInput();save();log('Pong: '+fmt(result.score)+' | +'+fmt(result.coin)+' Y / +'+fmt(result.exp)+' EXP');}
 function update(){const now=performance.now();if(owner!==getRoot()){owner=getRoot();game=null;result=null;clearInput();}else if(game?.running){if(!isActive())clearInput();stepPong(getRoot(),game,(now-last)/1000,input);if(!game.running)settle();}last=now;}
 $('pongStart').onclick=()=>{if(game?.running)return;game=startPong();result=null;clearInput();last=performance.now();refresh();};$('pongEnd').onclick=()=>{update();settle();refresh();};$('pongPowerButton').onclick=()=>{update();if(game)activatePongPower(game);refresh();};
 function handleKey(e,release=false){const field={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down'}[e.code];if(release){if(field)input[field]=false;return;}if(!isActive()||!game?.running||e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;if(field){e.preventDefault();delete input.targetY;input[field]=true;}else if(e.code==='Space'&&!e.repeat&&!e.target?.closest?.('button')){e.preventDefault();activatePongPower(game);}}
 for(const [id,field] of [['pongUp','up'],['pongDown','down']]){const b=$(id);b.onpointerdown=e=>{if(!game?.running)return;e.preventDefault();delete input.targetY;input[field]=true;b.setPointerCapture?.(e.pointerId);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>input[field]=false;}
 const board=$('pongBoard');
 function target(e){const rect=board.getBoundingClientRect();if(rect.height>0)input.targetY=Math.max(0,Math.min(250,(e.clientY-rect.top)/rect.height*250));}
 board.onpointerdown=e=>{if(!game?.running)return;e.preventDefault();drag=true;target(e);board.setPointerCapture?.(e.pointerId);};board.onpointermove=e=>{if(drag)target(e);};board.onpointerup=board.onpointercancel=board.onlostpointercapture=()=>{drag=false;delete input.targetY;};
 function draw(){const p=game?.player??{y:125},ai=game?.opponent??{y:125},b=game?.ball??{x:240,y:125,alpha:1},height=game?.powerType==='Smaller Paddle'?63:70;
 $('pongPlayer').setAttribute('y',p.y-height/2);$('pongPlayer').setAttribute('height',height);$('pongOpponent').setAttribute('y',ai.y-35);$('pongBall').setAttribute('x',b.x-10);$('pongBall').setAttribute('y',b.y-10);$('pongBall').style.opacity=b.alpha;}
 function frame(){update();draw();}
 function render(){frame();const record=ensureArcade(getRoot()).pong;$('pongBest').textContent=fmt(record?.best??0);$('pongPlays').textContent=fmt(record?.plays??0);$('pongScore').textContent=fmt(game?.score??0);$('pongTime').textContent=Math.ceil(game?.time??420)+'s';$('pongMultiplier').textContent=(game?.multiplier??1)+'×';$('pongGoals').textContent=fmt(game?.goals??0);$('pongLife').textContent=game?.life===0?'FINAL CHANCE':'1';$('pongPowerFill').style.width=(game?.power??0)+'%';$('pongPowerLabel').textContent=game?.powerType??'';
 $('pongMessage').textContent=result?'FINISH · +'+fmt(result.coin)+' Y · +'+fmt(result.exp)+' EXP · +'+fmt(result.green)+' G · +'+fmt(result.blue)+' B':game?.message??'PONG';$('pongStart').disabled=!!game?.running;$('pongEnd').disabled=!game?.running;$('pongPowerButton').disabled=!game?.running||game.life===0||game.power<50||!!game.powerType;$('pongUp').disabled=$('pongDown').disabled=!game?.running;}
 return {render,frame,handleKey,clearInput,running:()=>!!game?.running};
}
