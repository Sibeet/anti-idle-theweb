import {ensureArcade} from './arcade.mjs?v=0.22.1';
import {awardExperience} from './game.mjs?v=0.22.1';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function resetBeam(b,rng){b.speed=0;b.cross=rng()*250-rng()*250;b.loc=(b.index%2===0?-1:1)*500;b.power=Math.min(20,b.power+.1);}
export function startAvoidance(rng=Math.random){const g={running:true,settled:false,score:0,avoided:0,multiplier:1,life:1,invincibility:3,shieldCharge:1,shieldTime:0,elapsed:0,second:0,acc:0,angle:0,direction:1,player:{x:250,y:175},pickup:{x:0,y:0,alpha:0,count:0},coin:{x:0,y:0,delay:0},message:'READY',beams:[]};for(let i=0;i<4;i++){const b={index:i,power:5,position:0};resetBeam(b,rng);b.position=b.loc;g.beams.push(b);}return g;}
export function shieldAvoidance(g){if(!g.running||g.shieldTime>=0||g.shieldCharge<1)return false;g.shieldCharge--;g.shieldTime=1;g.message='SHIELD!';return true;}
export function worldToAvoidLocal(g,x,y){const a=-g.angle*Math.PI/180,dx=x-250,dy=y-162.5;return {x:dx*Math.cos(a)-dy*Math.sin(a),y:dx*Math.sin(a)+dy*Math.cos(a)};}
export function localToAvoidWorld(g,x,y){const a=g.angle*Math.PI/180;return {x:250+x*Math.cos(a)-y*Math.sin(a),y:162.5+x*Math.sin(a)+y*Math.cos(a)};}
export function avoidanceFrame(r,g,input={},rng=Math.random){if(!g.running)return;g.elapsed+=.025;g.second+=.025;if(g.second>=1){g.second=0;g.score+=500*g.multiplier;}
 if(g.shieldTime>-1)g.shieldTime-=.025;g.shieldCharge=Math.min(3,g.shieldCharge+.025/45);if(input.shield)shieldAvoidance(g);
 if(!input.freeze){if(Number.isFinite(input.x)&&Number.isFinite(input.y)){g.player.x=Math.round(input.x);g.player.y=Math.round(input.y);}else{g.player.x+=((input.right?1:0)-(input.left?1:0))*4;g.player.y+=((input.down?1:0)-(input.up?1:0))*4;}}
 g.player.x=clamp(g.player.x,1,499);g.player.y=clamp(g.player.y,1,349);if(g.life===0)g.invincibility=Math.max(0,g.invincibility-.025);
 const rotSpeed=g.avoided>=70?10:g.avoided>=10?5:0;if(g.avoided>=30&&rng()<.005)g.direction*=-1;g.angle=(g.angle+rotSpeed*g.direction/40)%360;const pt=worldToAvoidLocal(g,g.player.x,g.player.y);
 for(const b of g.beams){b.position=b.loc;if(g.avoided<[0,5,25,50][b.index])continue;
 b.speed+=b.power/50;b.loc+=(b.index%2===0?1:-1)*b.speed*.94;b.speed=Math.min(b.speed,b.power,30);
 const axis=b.index<2?pt.y:pt.x,cross=b.index<2?pt.x:pt.y;
 // Flash shape-point hitTest is approximated by the exported beam rectangle.
 if(Math.abs(axis-b.position)<=15&&Math.abs(cross-b.cross)<=505&&g.shieldTime<-.2){if(g.life>0){g.life=0;g.message='FINAL CHANCE · 3s';}else if(g.invincibility<=0){g.running=false;g.message='GAME OVER';return;}}
 if((b.index%2===0&&b.position>300)||(b.index%2===1&&b.position< -300)){g.avoided++;g.score+=Math.ceil(b.power*200*g.multiplier);if(b.index===0&&g.avoided<=5)g.score+=Math.ceil(b.power*300*g.multiplier);r.progPercent=Math.min(100,r.progPercent+Math.floor(50+g.multiplier*10));g.message='AVOIDED!';resetBeam(b,rng);}
 }
 const p=g.pickup;if(g.life>0&&g.multiplier<20)p.count+=.025;if(p.alpha>0){p.alpha=Math.max(0,p.alpha-.9375);if(Math.hypot(pt.x-p.x,pt.y-p.y)<=25){g.multiplier++;p.alpha=0;g.message='MULTIPLIER '+g.multiplier+'×';}}
 if(p.count>10+g.multiplier){p.count=0;p.alpha=100;const coord=()=>{const n=rng()*150-rng()*150;return n>-60&&n<=0?-60:n>0&&n<60?60:n;};p.x=coord();p.y=coord();}
 const c=g.coin;if(c.delay<2500)c.delay++;if(c.delay>2400){if(Math.hypot(pt.x-c.x,pt.y-c.y)<=12){ensureArcade(r).whiteCoins++;c.delay=Math.min(1900,g.multiplier*50+900);g.message='WHITE COIN!';}}else{c.x=rng()*150-rng()*150;c.y=rng()*150-rng()*150;}
}
export function stepAvoidance(r,g,dt,input={},rng=Math.random){if(!g.running||!Number.isFinite(dt)||dt<=0)return;g.acc+=Math.min(dt,.25);while(g.acc>=.025&&g.running){g.acc-=.025;avoidanceFrame(r,g,input,rng);}}
export function finishAvoidance(r,g){if(g.settled)return null;g.settled=true;g.running=false;const a=ensureArcade(r);a.avoidance??={best:0,total:0,plays:0};const record=a.avoidance,score=g.score,fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;
 const reward={score,exp:Math.ceil(Math.floor(fake/90*3)*scale),coin:Math.ceil(Math.floor(fake/120*3)*scale),green:Math.floor(fake/20*3),blue:Math.floor(fake/10000*3)};record.best=Math.max(record.best,score);record.total+=score;record.plays++;a.medals+=Math.floor(score/100000)*3;r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;}
