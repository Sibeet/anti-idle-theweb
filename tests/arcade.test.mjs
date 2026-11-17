import assert from 'node:assert/strict';
import {newGame,restore} from '../site/game.mjs';
import {ensureArcade,startWhack,stepWhack,hitWhack,finishWhack} from '../site/arcade.mjs';
let r=newGame(),g=startWhack();assert.equal(g.cells.length,72);stepWhack(g,3.1,()=>0);assert.ok(g.cells.some(c=>c.kind===2));
g=startWhack();g.cells[0]={kind:2,time:5};const h=hitWhack(r,g,0);assert.equal(h.points,15360);assert.equal(r.progPercent,60);assert.equal(g.hits,1);hitWhack(r,g,0);assert.equal(g.score,15360);assert.equal(g.life,97);
g.cells[0]={kind:2,time:3.9};hitWhack(r,g,0);assert.equal(r.progPercent,90);g.cells[1]={kind:2,time:5};hitWhack(r,g,1);assert.equal(r.progPercent,100);
g.cells[0]={kind:4,time:4};hitWhack(r,g,0);assert.equal(g.life,92);g.cells[0]={kind:3,time:3};hitWhack(r,g,0);assert.equal(g.life,95.2);
g.cells[0]={kind:5,time:2};const before=g.score;hitWhack(r,g,0);assert.equal(g.score-before,50000);assert.equal(g.multiplier,2);
g.cells[0]={kind:6,time:2};hitWhack(r,g,0);assert.equal(r.arcade.whiteCoins,1);
assert.equal(hitWhack(r,g,-1),null);assert.equal(hitWhack(r,g,72),null);
let missed=startWhack();missed.cells[0]={kind:2,time:.01};stepWhack(missed,.025,()=>1);assert.equal(missed.life,93);assert.equal(missed.cells[0].kind,1);
let dead=startWhack();dead.life=1;dead.cells[0]={kind:2,time:.01};stepWhack(dead,1,()=>1);assert.equal(dead.running,false);assert.equal(dead.life,0);assert.equal(hitWhack(r,dead,0),null);
let rewards=startWhack();rewards.score=240000;r=newGame();const reward=finishWhack(r,rewards);assert.equal(reward.exp,4000);assert.equal(reward.coin,3000);assert.equal(reward.green,18000);assert.equal(reward.blue,36);assert.equal(r.arcade.medals,4);assert.equal(r.arcade.plays,1);const snapshot=JSON.stringify(r);assert.equal(finishWhack(r,rewards),null);assert.equal(JSON.stringify(r),snapshot);assert.equal(restore(snapshot).arcade.best,240000);
assert.ok(restore(JSON.stringify(newGame())));for(const change of [{plays:-1},{best:240001},{total:Infinity},{medals:1.2}]){const bad=JSON.parse(snapshot);Object.assign(bad.arcade,change);assert.equal(restore(JSON.stringify(bad)),null);}
// A missed round terminates naturally, then can settle exactly once.
let unattended=startWhack();for(let i=0;i<30&&unattended.running;i++)stepWhack(unattended,60,()=>0);assert.equal(unattended.running,false);assert.ok(finishWhack(r,unattended));
console.log('PASS: Arcade original normal scoring, progress bonuses, traps, life drain, special tiles, capped rewards, once-only settlement, old/new saves and natural round ending.');
