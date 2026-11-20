import assert from 'node:assert/strict';
import {newGame,tick,claim,buySpeed,buyBoost,restore} from '../site/game.mjs';
let r=newGame();assert.equal(claim(r),null);assert.equal(buySpeed(r),false);assert.equal(buyBoost(r),false);
for(let n=0;n<5;n++){for(let i=0;i<1000&&r.progPercent<100;i++)tick(r);assert.equal(r.progPercent,100);const result=claim(r,()=>.5);assert.equal(result.exp,4);assert.equal(result.coin,1000);assert.equal(claim(r),null);}
assert.equal(r.save.level,2);assert.equal(r.save.currentExp,0);assert.equal(r.save.coin,5400);assert.equal(r.save.greenCoin,1502);assert.equal(r.save.blueCoin,100);
assert.equal(buySpeed(r),true);assert.equal(r.save.coin,5400);assert.equal(r.save.blueCoin,98);assert.equal(r.save.progSpeedManual,101);r.features.boost=true;r.save.featureBoostGen=true;assert.equal(buyBoost(r),true);assert.equal(r.save.boost,125);assert.equal(r.save.greenCoin,1402);
const loaded=restore(JSON.stringify(r));assert.equal(loaded.save.coin,r.save.coin);assert.equal(loaded.upgrades,1);assert.equal(restore('{broken'),null);assert.equal(restore(JSON.stringify({version:99})),null);
r.features.idle=true;r.save.idleMode=true;r.progPercent=100;const result=tick(r);assert.ok(result);assert.equal(r.progPercent,0);assert.equal(r.save.rewardClaim,6);assert.ok(r.save.currentExp>0);
r.save.boost=500;assert.equal(buyBoost(r),false);console.log('PASS: first five rewards, level-up bonuses, double-claim guard, purchases, save roundtrip, invalid saves, idle claim and boost cap.');
