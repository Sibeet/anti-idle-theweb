import {awardExperience} from './game.mjs?v=0.23.0';
import {ensureArcade} from './arcade.mjs?v=0.23.0';
const OPS=['+','−','×','÷'];
const calc=(a,b,i)=>[a+b,a-b,a*b,b===0?NaN:a/b][i];
export function makeQuestion(d,rng=Math.random){
 const rand=n=>Math.floor(rng()*Math.max(0,n)),type=rand(3),sign=type<2?rand(4):0;let a,b,c,shown,choices,correct;
 if(type===0){b=sign<2?rand(10):sign===2?rand(5):1+rand(5);a=sign<2?b+rand(10):sign===2?b+rand(5):b*rand(5);c=calc(a,b,sign);
 const disguise=(n,threshold,subtractAt,parens)=>{if(d<threshold||rng()>=.8||c<=0)return String(n);let x,y,s;if(rng()<.5||d<=subtractAt){x=rand(n);y=n-x;s='+';}else{x=n+rand(10);y=x-n;s='−';}return (parens?'(':'')+x+s+y+(parens?')':'');};
 const ct=disguise(c,10,20,false),at=disguise(a,15,25,true),bt=disguise(b,20,30,true);shown=at+' ? '+bt+' = '+ct;choices=OPS;correct=OPS.map((_,i)=>calc(a,b,i)===c);
 }else if(type===1){b=sign<2?rand(10)+d:sign===2?rand(10)+Math.floor(d/3):1+rand(10)+Math.floor(d/3);a=sign<2?b+rand(10+d):sign===2?b+rand(10):b*rand(5+Math.floor(d/3));c=calc(a,b,sign);let comparison=rand(3),diff=Math.max(1,rand(50-d)),n=c;
 if(comparison===2){if(c>0){n=Math.ceil(c-c*diff/100)-1;if(rng()<.032&&n>20)n-=10;}else comparison=1;}
 if(comparison===0){n=Math.floor(c+c*diff/100)+1;if(rng()<.25&&n>30)n+=10;}
 shown=a+' '+OPS[sign]+' '+b+' ? '+n;choices=['<','=','>'];correct=[c<n,c===n,c>n];
 }else{b=1+rand(5+d)+Math.floor(d/3);a=b*(rand(10+Math.floor(d/3))+Math.floor(d/5)+3);if(b>249)b=225+rand(25);if(a>b*88)a=b*(69+rand(20));c=a/b;const index=rand(4),simple=rng()<.5||d<=15||c<[5,5,10,11][index];const offsets=simple?[[-0,1,2,3],[-1,0,1,2],[-2,-1,0,1],[-3,-2,-1,0]][index]:[[0,1,10,11],[-1,0,9,10],[-10,-9,0,1],[-11,-10,-1,0]][index];choices=offsets.map(n=>c+n);correct=choices.map(n=>n===c);shown=a+' ÷ '+b+' = ?';}
 return {type,a,b,value:c,text:shown,choices,correct};
}
export function startMath(rng=Math.random){return {running:true,settled:false,time:60,spent:0,speed:1000,score:0,correct:0,difficulty:1,multiplier:1,power:0,history:[],message:'READY',question:makeQuestion(1,rng)};}
export function stepMath(g,dt){if(!g.running||!Number.isFinite(dt)||dt<=0)return;const d=Math.min(g.time,dt);g.time=Math.max(0,g.time-d);g.spent+=d;g.speed=Math.max(0,g.speed-400*d);if(g.time===0)g.running=false;}
export function answerMath(r,g,index,rng=Math.random){
 if(!g.running||!Number.isInteger(index)||index<0||index>=g.question.choices.length)return null;
 if(!g.question.correct[index]){g.power=0;g.speed=0;g.time=Math.max(0,g.time-6);g.score=Math.floor(g.score*.9);g.spent+=6;g.message='WRONG · −6s / −10%';if(g.time===0)g.running=false;return {correct:false};}
 const score=Math.floor((3000+g.difficulty*(150+g.speed/20))*g.multiplier),progress=g.speed>500?75+g.multiplier*15:g.speed>0?50+g.multiplier*10:25+g.multiplier*5;
 g.score+=score;g.correct++;g.difficulty++;g.power+=(g.speed+1000)/(10+g.multiplier*20)+10;r.progPercent=Math.min(100,r.progPercent+progress);
 g.history.unshift({text:g.question.text.replace('?',String(g.question.choices[index])),seconds:g.spent,score});g.history=g.history.slice(0,4);
 if(g.power>=100&&g.multiplier<9){g.power-=100;g.multiplier++;if(g.multiplier>=4)ensureArcade(r).whiteCoins+=g.multiplier>=8?2:1;}if(g.multiplier===9)g.power=100;
 g.message=(g.speed>500?'EXCELLENT!':g.speed>0?'NICE!':'CORRECT!')+' +'+score;g.spent=0;g.speed=1000;g.question=makeQuestion(g.difficulty,rng);return {correct:true,score,progress};
}
export function finishMath(r,g){if(g.settled)return null;g.settled=true;g.running=false;const a=ensureArcade(r);a.math??={best:0,total:0,plays:0};const record=a.math,score=g.score,fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;
 const reward={score,exp:Math.ceil(Math.floor(fake/270*3)*scale),coin:Math.ceil(Math.floor(fake/360*3)*scale),green:Math.floor(fake/60*3),blue:Math.floor(fake/30000*3)};
 record.best=Math.max(record.best,score);record.total+=score;record.plays++;a.medals+=Math.floor(score/100000)*2;r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;}
