import {ensureArcade} from './arcade.mjs?v=0.23.0';
import {awardExperience} from './game.mjs?v=0.23.0';
export const PONG={width:480,height:250,top:20,bottom:230,paddleWidth:20,paddleHeight:70,ballSize:20};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function resetBall(g,rng){g.ball={x:240,y:125,vx:5,vy:(1.2+rng()-rng())*(rng()<.5?-1:1),count:0,alpha:1};}
export function startPong(rng=Math.random){const g={running:true,settled:false,time:420,life:1,score:0,difficulty:1,multiplier:1,power:0,powerType:'',elapsed:0,acc:0,hits:0,goals:0,player:{y:125,vy:0},opponent:{y:125,vy:0},message:'READY'};resetBall(g,rng);return g;}
export function activatePongPower(g,rng=Math.random){if(!g.running||g.life===0||g.power<50||g.powerType)return false;g.power=Math.min(100,g.power);g.powerType=['Smaller Paddle','Slower Paddle','Invisiball'][Math.floor(rng()*3)];g.message=g.powerType+' · 2× SCORE';return true;}
function boundPaddle(p,height){if(p.y<20+height/2){p.y=21+height/2;p.vy*=-.8;}if(p.y>230-height/2){p.y=229-height/2;p.vy*=-.8;}}
export function pongFrame(r,g,input={},rng=Math.random){
 if(!g.running)return;g.time=Math.max(0,g.time-.025);g.elapsed+=.025;
 if(g.time===0){g.score=Math.floor(g.score*1.1);g.running=false;g.message='SURVIVED! · +10%';return;}
 g.multiplier=g.difficulty*(g.powerType?2:1);const b=g.ball,p=g.player,ai=g.opponent,ph=70*(g.powerType==='Smaller Paddle'?.9:1),power=(g.powerType==='Slower Paddle'?.4:.5)*Math.max(1,1.5-g.elapsed/120);
 // Keyboard uses the original acceleration/damping. Drag target is a web control adaptation.
 if(Number.isFinite(input.targetY)){const delta=clamp(input.targetY,20+ph/2,230-ph/2)-p.y;p.vy=clamp(delta,-8,8);p.y+=p.vy;}
 else{if(input.up)p.vy-=power;if(input.down)p.vy+=power;p.vy*=.9;p.y+=p.vy;}boundPaddle(p,ph);
 const aiPower=.5+g.difficulty*.02;if(ai.y>b.y+20)ai.vy-=aiPower;if(ai.y<b.y-20)ai.vy+=aiPower;ai.vy*=.9;ai.y+=ai.vy;boundPaddle(ai,70);
 b.count++;
 if(b.count>40){
 b.alpha=g.powerType==='Invisiball'&&b.vx<0?Math.max(0,b.alpha-.03):1;
 if(b.y<30){b.y=31;b.vy*=-1;g.power+=.25;g.score+=Math.floor(50*g.multiplier);}
 if(b.y>220){b.y=219;b.vy*=-1;g.power+=.25;g.score+=Math.floor(50*g.multiplier);}
 if(b.x<20){if(g.life>0){g.life=0;b.x=40;b.vx=5;g.message='FINAL CHANCE!';}else{g.running=false;g.message='GAME OVER';return;}}
 if(b.x>460){r.progPercent=100;g.score+=Math.floor(5000*g.multiplier);g.power+=5+g.difficulty*.5;g.difficulty++;g.goals++;g.message='GOAL!';resetBall(g,rng);}
 const ball=g.ball;
 if(ball.vx<0&&ball.x>=0&&ball.x<=40&&Math.abs(ball.y-p.y)<=ph/2+10){r.progPercent=Math.min(100,r.progPercent+Math.floor(25+g.multiplier*5));g.score+=Math.floor(200*g.multiplier);g.power+=.75;g.hits++;ball.x=40;ball.vy+=(ball.y-p.y)/15;ball.vx*=-1.1;g.message='HIT!';}
 if(ball.vx>0&&ball.x>=440&&ball.x<=480&&Math.abs(ball.y-ai.y)<=45){ball.x=440;ball.vy+=(ball.y-ai.y)/15;ball.vx*=-1.1;}
 ball.vx=clamp(ball.vx,-14,14)*.9997;ball.vy=clamp(ball.vy,-14,14)*.9986;ball.x+=ball.vx;ball.y+=ball.vy;
 }
 if(g.life===0){g.power=0;g.powerType='';}else if(g.powerType){g.power=Math.max(0,Math.min(100,g.power)-.05);if(g.power===0)g.powerType='';}else g.power=Math.min(100,g.power);
}
export function stepPong(r,g,dt,input={},rng=Math.random){if(!g.running||!Number.isFinite(dt)||dt<=0)return;g.acc+=Math.min(dt,.25);while(g.acc>=.025&&g.running){g.acc-=.025;pongFrame(r,g,input,rng);}}
export function finishPong(r,g){if(g.settled)return null;g.settled=true;g.running=false;const a=ensureArcade(r);a.pong??={best:0,total:0,plays:0};const record=a.pong,score=g.score,fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;
 const reward={score,exp:Math.ceil(Math.floor(fake/90*3)*scale),coin:Math.ceil(Math.floor(fake/120*3)*scale),green:Math.floor(fake/20*3),blue:Math.floor(fake/10000*3)};
 record.best=Math.max(record.best,score);record.total+=score;record.plays++;a.medals+=Math.floor(score/100000)*3;r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;}
