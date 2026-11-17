import assert from 'node:assert/strict';
import {newGame,restore} from '../site/game.mjs';
import {startMath,stepMath,answerMath,finishMath,makeQuestion} from '../site/math-master.mjs';
let seed=8163;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const types=new Set();for(const d of [1,9,10,15,20,30,50,100])for(let i=0;i<100;i++){const q=makeQuestion(d,rng);types.add(q.type);assert.ok(q.correct.some(Boolean));assert.ok(q.choices.length>=3&&q.choices.length<=4);assert.ok(q.choices.every(x=>typeof x==='string'||Number.isFinite(x)));if(q.type===2)assert.equal(q.a/q.b,q.value);}
assert.equal(types.size,3);
let r=newGame(),g=startMath(rng);assert.equal(g.time,60);assert.equal(g.speed,1000);const first=g.question;let result=answerMath(r,g,first.correct.indexOf(true),rng);assert.equal(result.score,3200);assert.equal(result.progress,90);assert.equal(g.score,3200);assert.equal(g.difficulty,2);assert.equal(g.correct,1);assert.equal(g.history.length,1);assert.equal(r.progPercent,90);
stepMath(g,2);assert.equal(g.speed,200);result=answerMath(r,g,g.question.correct.indexOf(true),rng);assert.equal(result.progress,60);assert.equal(r.progPercent,100);assert.equal(g.score,6520);assert.equal(g.multiplier,2);
const q=g.question;const wrong=q.correct.indexOf(false);const oldTime=g.time;result=answerMath(r,g,wrong,rng);assert.equal(result.correct,false);assert.equal(g.time,oldTime-6);assert.equal(g.score,5868);assert.equal(g.power,0);assert.equal(g.speed,0);assert.equal(g.question,q);
result=answerMath(r,g,q.correct.indexOf(true),rng);assert.equal(result.progress,35);assert.equal(g.correct,3);assert.equal(g.speed,1000);
for(let i=0;i<70;i++)answerMath(r,g,g.question.correct.indexOf(true),rng);assert.equal(g.multiplier,9);assert.equal(g.power,100);assert.ok(r.arcade.whiteCoins>0);assert.equal(g.history.length,4);
stepMath(g,100);assert.equal(g.time,0);assert.equal(g.running,false);const before=g.score;assert.equal(answerMath(r,g,0),null);assert.equal(g.score,before);
r=newGame();g=startMath(rng);g.score=360000;result=finishMath(r,g);assert.equal(result.exp,4000);assert.equal(result.coin,3000);assert.equal(result.green,18000);assert.equal(result.blue,36);assert.equal(r.arcade.math.best,360000);assert.equal(r.arcade.math.plays,1);assert.equal(r.arcade.medals,6);let saved=JSON.stringify(r);assert.ok(restore(saved));assert.equal(finishMath(r,g),null);assert.equal(JSON.stringify(r),saved);
for(const changes of [{plays:-1},{best:360001},{total:NaN},{best:'1'}]){const bad=JSON.parse(saved);Object.assign(bad.arcade.math,changes);assert.equal(restore(JSON.stringify(bad)),null);}
g=startMath();g.time=5;g.question.correct=[false,true];g.question.choices=['no','yes'];assert.equal(answerMath(r,g,0).correct,false);assert.equal(g.running,false);assert.equal(g.time,0);assert.equal(answerMath(r,g,9),null);
console.log('PASS: Math Master 800 question cases, source scoring/speed/progress, retry penalties, multiplier cap, white coins, timeout, payouts, exactly-once settlement and save validation.');
