import assert from 'node:assert/strict';
import {newGame,restore} from '../site/game.mjs';
import {ensureArena,travel,travelExit,canTravel,combatTick,ENEMIES,playerDamage} from '../site/combat.mjs';
import {REGIONS,REGION_EXITS,region,visibleRegions,chooseEnemy} from '../site/regions.mjs';
import {rankRequirement} from '../site/equipment.mjs';
import {settleGrowth,growthStats} from '../site/growth.mjs';
const r=newGame(),a=ensureArena(r);assert.equal(travelExit(r,'right',()=>0),true);assert.equal(a.zone,1);assert.equal(travelExit(r,'right'),false);assert.equal(travelExit(r,'up'),false);assert.equal(a.zone,1);
for(let i=1;i<40;i++)a.xp+=rankRequirement(i);settleGrowth(r);a.hp=growthStats(r).maxHp;r.save.level=r.save.bestLevel=1500;
assert.deepEqual(visibleRegions(r).filter(z=>z.hidden),[]);assert.equal(travel(r,15),false);assert.equal(travel(r,16),false);assert.equal(canTravel(r,15,true),false,'no hidden entry from unrelated area');
for(const zone of [2,3,4,5]){assert.equal(travelExit(r,'right',()=>0),true);assert.equal(a.zone,zone);}assert.equal(travelExit(r,'up',()=>0),true);assert.equal(a.zone,15);assert.ok(a.discoveredZones.includes(15));assert.equal(visibleRegions(r).some(z=>z.id===15),true);assert.equal(visibleRegions(r).some(z=>z.id===16),false);assert.equal(travelExit(r,'down',()=>0),true);assert.equal(a.zone,5);
assert.equal(travel(r,7),true);assert.equal(a.enemyAlive,false);assert.equal(combatTick(r,.25).length,0);assert.equal(travelExit(r,'down',()=>0),true);assert.equal(a.zone,18);assert.equal(ENEMIES[a.enemyIndex].id,273);assert.equal(travelExit(r,'left',()=>0),true);assert.equal(a.zone,16);assert.equal(ENEMIES[a.enemyIndex].id,87);assert.equal(travelExit(r,'up',()=>0),true);assert.equal(a.zone,9);assert.equal(travel(r,16,()=>.999),true);assert.equal(ENEMIES[a.enemyIndex].id,99);
const restored=restore(JSON.stringify(r));assert.ok(restored);assert.deepEqual(restored.arena.discoveredZones,[15,16]);assert.equal(travel(restored,15,()=>.999),true);assert.equal(ENEMIES[restored.arena.enemyIndex].id,64);const bad=structuredClone(r);bad.arena.discoveredZones=[16,999];assert.equal(restore(JSON.stringify(bad)),null);bad.arena.discoveredZones=[];assert.equal(restore(JSON.stringify(bad)),null);
for(const [id,start,count] of [[4,35,20],[5,55,8],[6,65,7],[8,72,11],[9,83,15],[15,55,10],[16,87,13]]){const z=region(id);assert.deepEqual(z.pool.map(i=>ENEMIES[i].id),Array.from({length:count},(_,i)=>start+i));for(let i=0;i<count;i++)assert.equal(chooseEnemy(id,()=>i/count+.00001),z.pool[i]);}
assert.equal(region(15).damagePct,25);assert.equal(region(16).respawn,1.9);const enemy={level:1,evasion:1,defense:0};const full=playerDamage(1500,enemy,()=>.5,100,40,1000,1000,100,100),quarter=playerDamage(1500,enemy,()=>.5,100,40,1000,1000,100,25);assert.equal(quarter,Math.ceil(full*.25));
a.hp=0;assert.equal(travelExit(r,'up'),false);assert.equal(travel(r,0),true);assert.equal(a.auto,false);
console.log('PASS: directional paths/rank gates, two hidden discoveries, no unseen fast travel, original pools/Guardian, no-encounter Danger Zone, damage modifier, persistence and invalid discovery saves.');
