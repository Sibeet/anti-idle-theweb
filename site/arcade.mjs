import {awardExperience} from './game.mjs?v=0.22.0';
const CELL_ORDER=[...Array.from({length:60},(_,i)=>Math.floor(i/10)*12+i%10),...Array.from({length:12},(_,i)=>Math.floor(i/2)*12+10+i%2)];
export function ensureArcade(r){return r.arcade??={version:1,best:0,total:0,plays:0,medals:0,whiteCoins:0};}
export function validArcade(a){const record=v=>!!v&&['best','total','plays'].every(k=>Number.isSafeInteger(v[k])&&v[k]>=0)&&v.best<=v.total;return !!a&&a.version===1&&record(a)&&['medals','whiteCoins'].every(k=>Number.isSafeInteger(a[k])&&a[k]>=0)&&['math','pong','avoidance','mind','balance','count','mmrx'].every(k=>a[k]===undefined||record(a[k]));}
export function startWhack(){return {running:true,life:100,score:0,hits:0,multiplier:1,appear:0,delay:3,elapsed:0,message:'READY',cells:Array.from({length:72},()=>({kind:1,time:0}))};}
export function stepWhack(g,dt,rng=Math.random){
 if(!g.running||!Number.isFinite(dt)||dt<=0)return;
 // Fixed 40 Hz steps preserve the original per-cell spawn order and shared delay.
 let remaining=Math.min(dt,60);while(remaining>0&&g.running){const d=Math.min(.025,remaining);remaining-=d;g.elapsed+=d;g.delay-=d;
 for(const index of CELL_ORDER){const c=g.cells[index];
 if(c.kind===1&&g.delay<=0&&rng()<.03*d){g.delay=.5;g.appear++;
 if(g.appear%21===0&&g.multiplier<9){c.kind=5;c.time=2;}
 else if(g.appear%7===0&&g.appear%21!==0){c.kind=3;c.time=3;}
 else if(rng()<.75){c.kind=2;c.time=5;}
 else if(rng()<.03){c.kind=6;c.time=2;}
 else{c.kind=4;c.time=4;g.appear--;}}
 if(c.kind!==1){c.time-=d;if(c.time<0){if(c.kind===2){g.life-=7;g.message='MISS · −7%';}c.kind=1;c.time=0;}}
 if(c.kind===2)g.life-=(.5+Math.sqrt(g.hits/10))*d;
 }
 g.life=Math.max(0,Math.min(100,g.life));if(g.life<=0)g.running=false;
 }
}
export function hitWhack(r,g,index){
 if(!g.running||!Number.isInteger(index)||index<0||index>=72)return null;
 const c=g.cells[index];let points=0,progress=0;
 if(c.kind===1){g.life-=3;g.message='OOPS · −3%';}
 if(c.kind===2){g.hits++;const base=Math.floor(c.time*50)+6,rank=base>=232?6:base>=225?4.5:base>=200?3:base>=175?2:1;
 points=Math.floor(base*g.multiplier*rank*10);progress=rank>=4.5?50+g.multiplier*10:rank===3?25+g.multiplier*5:rank===2?10+g.multiplier*2:0;
 g.message=(rank===6?'PERFECT!!':rank===4.5?'PERFECT!':rank===3?'GREAT!':rank===2?'GOOD!':'OK!')+' +'+points;
 }else if(c.kind===3){const life=Math.ceil(c.time*10)/10+.2;g.life+=life;progress=100+g.multiplier*20;g.message='AWESOME! +'+life.toFixed(1)+'%';}
 else if(c.kind===4||c.kind===7){g.life-=5;g.message='OOPS · −5%';}
 else if(c.kind===5){points=50000*g.multiplier;g.multiplier++;g.message='MULTIPLIER '+g.multiplier+'×';}
 else if(c.kind===6){ensureArcade(r).whiteCoins++;g.message='WHITE COIN!';}
 c.kind=1;c.time=0;g.score+=points;r.progPercent=Math.min(100,r.progPercent+progress);g.life=Math.max(0,Math.min(100,g.life));if(g.life===0)g.running=false;
 return {points,progress};
}
export function finishWhack(r,g){
 if(g.settled)return null;g.running=false;g.settled=true;const a=ensureArcade(r),score=g.score,fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;
 // Normal mode, original Arcade reward multiplier 3; no career/pet bonuses.
 const reward={score,exp:Math.ceil(Math.floor(fake/180*3)*scale),coin:Math.ceil(Math.floor(fake/240*3)*scale),green:Math.floor(fake/40*3),blue:Math.floor(fake/20000*3)};
 a.best=Math.max(a.best,score);a.total+=score;a.plays++;a.medals+=Math.floor(score/100000)*2;
 r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;
}
