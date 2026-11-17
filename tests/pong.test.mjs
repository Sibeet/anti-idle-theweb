import assert from 'node:assert/strict';
import {newGame,restore} from '../site/game.mjs';
import {startPong,pongFrame,stepPong,activatePongPower,finishPong} from '../site/pong.mjs';
const rng=()=>.5;let r=newGame(),g=startPong(rng);assert.equal(g.time,420);assert.equal(g.ball.x,240);assert.equal(g.ball.vy,1.2);
for(let i=0;i<40;i++)pongFrame(r,g,{},rng);assert.equal(g.ball.x,240);pongFrame(r,g,{},rng);assert.ok(g.ball.x>240);
g=startPong(rng);pongFrame(r,g,{up:true},rng);assert.ok(g.player.y<125);assert.ok(g.player.vy<0);for(let i=0;i<200;i++)pongFrame(r,g,{up:true},rng);assert.ok(g.player.y>=55&&g.player.y<=195);
r=newGame();g=startPong(rng);g.ball={x:30,y:125,vx:-5,vy:0,count:41,alpha:1};pongFrame(r,g,{},rng);assert.equal(g.hits,1);assert.equal(g.score,200);assert.equal(r.progPercent,30);assert.ok(g.ball.vx>0);assert.equal(g.power,.75);
g=startPong(rng);g.ball={x:200,y:29,vx:5,vy:-2,count:41,alpha:1};pongFrame(r,g,{},rng);assert.equal(g.score,50);assert.ok(g.ball.vy>0);assert.equal(g.power,.25);
g=startPong(rng);g.ball={x:461,y:125,vx:5,vy:0,count:41,alpha:1};pongFrame(r,g,{},rng);assert.equal(g.goals,1);assert.equal(g.score,5000);assert.equal(g.difficulty,2);assert.equal(r.progPercent,100);assert.ok(g.ball.x>=240&&g.ball.x<=245);assert.equal(g.ball.count,0);
g=startPong(rng);g.power=80;g.powerType='Slower Paddle';g.ball={x:19,y:80,vx:-5,vy:0,count:41,alpha:1};pongFrame(r,g,{},rng);assert.equal(g.life,0);assert.equal(g.running,true);assert.equal(g.power,0);assert.equal(g.powerType,'');g.ball.x=19;g.ball.vx=-5;pongFrame(r,g,{},rng);assert.equal(g.running,false);
for(const [roll,type] of [[0,'Smaller Paddle'],[.5,'Slower Paddle'],[.99,'Invisiball']]){g=startPong(rng);assert.equal(activatePongPower(g,()=>roll),false);g.power=50;assert.equal(activatePongPower(g,()=>roll),true);assert.equal(g.powerType,type);assert.equal(activatePongPower(g),false);pongFrame(r,g,{},rng);assert.equal(g.multiplier,2);assert.equal(g.power,49.95);}
g=startPong(rng);g.power=1;g.powerType='Invisiball';g.ball={x:200,y:125,vx:-5,vy:0,count:41,alpha:1};pongFrame(r,g,{},rng);assert.equal(g.ball.alpha,.97);
g.power=.01;pongFrame(r,g,{},rng);assert.equal(g.powerType,'');pongFrame(r,g,{},rng);assert.equal(g.multiplier,1);assert.equal(g.ball.alpha,1);
g=startPong(rng);g.time=.025;g.score=100;pongFrame(r,g,{},rng);assert.equal(g.running,false);assert.equal(g.score,110);pongFrame(r,g,{},rng);assert.equal(g.score,110);
g=startPong(rng);const before=JSON.stringify(g);stepPong(r,g,NaN);stepPong(r,g,-1);assert.equal(JSON.stringify(g),before);stepPong(r,g,10);assert.ok(g.time>=419.75);
r=newGame();g=startPong(rng);g.score=120000;const reward=finishPong(r,g);assert.equal(reward.exp,4000);assert.equal(reward.coin,3000);assert.equal(reward.green,18000);assert.equal(reward.blue,36);assert.equal(r.arcade.medals,3);assert.equal(r.arcade.pong.best,120000);assert.equal(r.arcade.pong.plays,1);let saved=JSON.stringify(r);assert.ok(restore(saved));assert.equal(finishPong(r,g),null);assert.equal(JSON.stringify(r),saved);
for(const changes of [{best:120001},{plays:-1},{total:Infinity},{best:'1'}]){const bad=JSON.parse(saved);Object.assign(bad.arcade.pong,changes);assert.equal(restore(JSON.stringify(bad)),null);}
g=startPong(rng);g.score=9000000;const capped=finishPong(newGame(),g);assert.equal(capped.coin,200000);assert.equal(capped.blue,2400);
// With no input the model must eventually consume both chances and finish.
g=startPong(rng);r=newGame();for(let i=0;i<16810&&g.running;i++)pongFrame(r,g,{},rng);assert.equal(g.running,false);assert.equal(g.life,0);assert.ok(finishPong(r,g));
console.log('PASS: Pong source serve/acceleration/damping, walls, paddle hit, goal, extra life, powers, timeout bonus, stalled-frame cap, reward cap and save/duplicate guards.');
