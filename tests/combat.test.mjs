import assert from 'node:assert/strict';
import {newGame,restore} from '../site/game.mjs';
import {ensureArena,travel,attack,combatTick,ENEMIES} from '../site/combat.mjs';
const rng=()=>.5;
let r=newGame(),a=ensureArena(r);
assert.equal(attack(r,rng),null);
assert.ok(restore(JSON.stringify(r)));
travel(r,1,()=>0);
let result;
for(let i=0;i<100 && a.kills===0;i++){
 result=attack(r,rng);
 assert.equal(attack(r,rng),null);
 combatTick(r,.25,rng);combatTick(r,.25,rng);
}
assert.equal(a.kills,1);assert.equal(a.pixels,500);assert.equal(a.xp,280);
const coins=r.save.coin;assert.equal(attack(r,rng),null);assert.equal(r.save.coin,coins);
assert.ok(restore(JSON.stringify(r)));
for(let i=0;i<12;i++)combatTick(r,.25,rng);
assert.equal(a.enemyIndex,ENEMIES.findIndex(e=>e.id===6));assert.equal(a.enemyAlive,true);assert.equal(a.spawnTimer,0);
assert.ok(restore(JSON.stringify(r)));
// A forest boss can defeat an under-equipped player in one hit.
a.xp=9000;travel(r,3,()=>.15);a.hp=1;a.enemyTimer=2.49;a.regenClock=0;
for(let i=0;i<100&&a.zone!==0;i++)combatTick(r,.025,rng);
assert.equal(a.zone,0);assert.equal(a.hp,0);assert.equal(travel(r,1,()=>0),false);
combatTick(r,.1,rng);assert.ok(a.hp>0);
travel(r,1,()=>0);a.auto=true;
for(let i=0;i<400;i++)combatTick(r,.025,rng);
assert.ok(a.kills>1);assert.ok(restore(JSON.stringify(r)));
r=newGame();a=ensureArena(r);travel(r,1,()=>0);
for(let i=0;i<200;i++)combatTick(r,.25,rng);
assert.equal(a.hp,500);assert.equal(a.kills,0);
assert.ok(restore(JSON.stringify(newGame())));
console.log('PASS: manual/auto combat, cooldown, single kill rewards, wave respawn save, defeat, recovery, passive dummy, legacy save.');
