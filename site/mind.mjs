import {ensureArcade} from './arcade.mjs?v=0.21.0';
import {awardExperience} from './game.mjs?v=0.21.0';
const rand=(rng,n)=>Math.floor(rng()*n);
function newBoard(g,rng){g.key=rand(rng,20)+20*rand(rng,10);g.found=false;g.revealed=0;g.red=false;g.focus=-1;g.cooldown=0;g.cells=Array.from({length:200},(_,index)=>{let kind=3;const m=g.multiplier;
 if(rng()<.02+m*.0002&&m>=20)kind=9;else if(rng()<.1+.4/m)kind=4;else if(rng()<.04+.16/m)kind=5;else if(rng()<.065+Math.min(m,25)*.00035)kind=6;else if(rng()<.0475+Math.min(m,25)*.00025)kind=7;
 if(index===g.key)kind=2;return {kind,open:false,flag:false,arrow:0,number:0};});}
export function startMind(rng=Math.random){const g={running:true,settled:false,score:0,multiplier:1,stage:1,turns:50,time:900,message:'READY'};newBoard(g,rng);return g;}
export function stepMind(g,dt){if(!g.running||!Number.isFinite(dt)||dt<=0)return;g.time=Math.max(0,g.time-dt);g.cooldown=Math.max(0,g.cooldown-dt);if(g.time===0||g.turns<=0){g.running=false;g.message='GAME OVER';}}
function arrow(g,index,rng){const x=index%20,y=Math.floor(index/20),kx=g.key%20,ky=Math.floor(g.key/20);if(kx===x)return ky<y?0:180;if(ky===y)return kx<x?270:90;return rng()<.5?(ky<y?0:180):(kx<x?270:90);}
export function revealMind(r,g,index,rng=Math.random){const c=g.cells[index];if(!g.running||!c||c.open)return false;const m=g.multiplier;let kind=c.kind;
 if(g.revealed<1&&kind!==2)kind=4;
 else if(g.revealed>=Math.round(3+m/3)&&kind!==2&&kind!==3&&!g.red){g.red=true;kind=5;}
 else if(g.revealed>=Math.round(3+m/3)&&g.revealed%5===0&&kind===6)kind=g.revealed%10===0?4:7;
 c.kind=kind;c.open=true;c.flag=false;
 if(kind===2){g.found=true;g.turns+=2;g.score+=2000*m;r.progPercent=100;g.message='GOAL FOUND!';}
 else if(kind===3){const x=index%20,y=Math.floor(index/20);let count=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if((dx||dy)&&nx>=0&&nx<20&&ny>=0&&ny<10&&g.cells[ny*20+nx].kind!==3)count++;}c.number=count;g.score+=10*m;g.message='NEARBY · '+count;}
 else if(kind===4){c.arrow=arrow(g,index,rng);g.score+=200*m;g.message='DIRECTION';}
 else if(kind===5){c.number=Math.abs(index%20-g.key%20)+Math.abs(Math.floor(index/20)-Math.floor(g.key/20));g.score+=200*m;g.message='DISTANCE · '+c.number;}
 else if(kind===6){g.score+=100*m;g.time+=5;g.message='+5 SECONDS';}
 else if(kind===7){g.score+=100*m;g.turns+=2;g.message='+2 TURNS';}
 else if(kind===9){g.score+=100*m;ensureArcade(r).whiteCoins++;g.message='WHITE COIN!';}
 g.revealed++;return true;}
export function nextMindStage(g,rng=Math.random){if(!g.running||!g.found)return false;g.multiplier=Math.min(99,g.multiplier+1);g.stage++;g.score+=1250*g.multiplier;g.turns+=Math.max(5,15-g.multiplier);g.time+=Math.max(3,Math.floor((50-g.multiplier)/5));newBoard(g,rng);g.message='STAGE '+g.stage;return true;}
export function clickMind(r,g,index,flag=false,rng=Math.random){if(!g.running||!Number.isInteger(index)||index<0||index>=200)return false;const c=g.cells[index];if(flag){if(c.open)return false;c.flag=!c.flag;return true;}if(c.open){g.focus=index;if(c.kind===2)return nextMindStage(g,rng);return true;}if(c.flag)return false;revealMind(r,g,index,rng);g.focus=index;g.turns--;if(g.turns<=0){g.running=false;g.message='NO TURNS LEFT';}return true;}
export const MIND_POWER_NAMES={1:'Scan nearby',2:'Scan random',3:'Scan up',4:'Scan down',5:'Scan left',6:'Scan right',7:'Nearby treasures',8:'Random blank tiles',9:'Row + column',10:'Eight directions',11:'Distance −1',12:'Distance +1',13:'Convert to arrow',14:'Convert to distance',15:'+3 turns',16:'+9 turns',17:'Reveal goal'};
const POWER_COSTS={1:25,2:25,3:25,4:25,5:40,6:40,7:15,8:15,9:35,10:50,11:25,12:25,13:10,14:30,15:20,16:50,17:120};
export function mindPowers(g){const c=g?.cells[g.focus],focused=!!c?.open,kind=c?.kind,context={3:[7,8],4:[9,10],5:[11,12],6:[13,14],7:[15,16]}[kind]??[18,18];return [1,2,3,4,5,6,...context,17].map((type,slot)=>{const cost=POWER_COSTS[type]??0,valid=type===17?!g?.found:focused&&type!==18;return {slot,type,cost,name:MIND_POWER_NAMES[type]??'Select a clue tile',available:!!g?.running&&valid,enabled:!!g?.running&&valid&&g.cooldown<=0&&g.time>cost};});}
export function useMindPower(r,g,slot,rng=Math.random){if(!Number.isInteger(slot)||slot<0||slot>8)return false;const power=mindPowers(g)[slot];if(!power.enabled)return false;const {type,cost}=power,anchor=g.focus,c=g.cells[anchor],x=anchor%20,y=Math.floor(anchor/20),targets=new Set();g.time-=cost;g.cooldown=1;
 const add=(nx,ny)=>{if(nx>=0&&nx<20&&ny>=0&&ny<10)targets.add(ny*20+nx);};
 if(type===1){for(const [dx,dy] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1],[-2,0],[0,-2],[0,2],[2,0],[-2,-2],[2,-2],[-2,2],[2,2]])add(x+dx,y+dy);}
 else if(type===2||type===8){for(let i=0;i<(type===2?15:25);i++)add(rand(rng,20),rand(rng,10));}
 else if(type>=3&&type<=6){if(type===3)for(let ny=0;ny<y;ny++)add(x,ny);if(type===4)for(let ny=y+1;ny<10;ny++)add(x,ny);if(type===5)for(let nx=0;nx<x;nx++)add(nx,y);if(type===6)for(let nx=x+1;nx<20;nx++)add(nx,y);}
 else if(type===7){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy)add(x+dx,y+dy);}
 else if(type===9||type===10){for(let nx=0;nx<20;nx++)add(nx,y);for(let ny=0;ny<10;ny++)add(x,ny);if(type===10)for(let d=-9;d<10;d++){add(x+d,y+d);add(x-d,y+d);}}
 else if(type===11||type===12){for(let i=0;i<200;i++)if(Math.abs(i%20-x)+Math.abs(Math.floor(i/20)-y)===c.number+(type===11?-1:1))targets.add(i);}
 else if(type===13||type===14){c.kind=type===13?4:5;if(type===13)c.arrow=arrow(g,anchor,rng);else c.number=Math.abs(x-g.key%20)+Math.abs(y-Math.floor(g.key/20));g.score+=200*g.multiplier;}
 else if(type===15||type===16)g.turns+=type===15?3:9;
 else if(type===17)targets.add(g.key);
 for(const index of [...targets].sort((a,b)=>a-b)){const cell=g.cells[index];if(type===7&&cell.kind===3||type===8&&cell.kind!==3)continue;revealMind(r,g,index,rng);}
 // Automatic reveals and conversions preserve the selected tile, as Flash's focus globals do.
 g.focus=anchor;g.message=power.name;return true;}
export function scanMind(r,g,type,rng=Math.random){return type==='nearby'?useMindPower(r,g,0,rng):type==='random'?useMindPower(r,g,1,rng):false;}
export function finishMind(r,g){if(g.settled)return null;g.settled=true;g.running=false;const a=ensureArcade(r);a.mind??={best:0,total:0,plays:0};const record=a.mind,score=g.score,fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;const reward={score,exp:Math.ceil(Math.floor(fake/180*3)*scale),coin:Math.ceil(Math.floor(fake/240*3)*scale),green:Math.floor(fake/40*3),blue:Math.floor(fake/20000*3)};record.best=Math.max(record.best,score);record.total+=score;record.plays++;a.medals+=Math.floor(score/100000)*4;r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;}
