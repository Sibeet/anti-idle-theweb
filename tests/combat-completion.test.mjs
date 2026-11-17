import assert from 'node:assert/strict';
import {newGame,restore,claim} from '../site/game.mjs';
import {ensureArena,travel,attack,combatTick,canCast,combatStats,ENEMIES} from '../site/combat.mjs';
import {rankRequirement,craftGear,equipGear,ensureEquipment,equipmentTotals} from '../site/equipment.mjs';
import {GEAR} from '../site/gear-data.mjs';
import {growthStats,settleGrowth} from '../site/growth.mjs';
import {activeSkill,raiseSkill} from '../site/skills.mjs';
import {REGIONS,chooseEnemy} from '../site/regions.mjs';
function ranked(rank=30){const r=newGame();ensureArena(r);for(let i=1;i<rank;i++)r.arena.xp+=rankRequirement(i);settleGrowth(r);r.save.level=60;r.save.bestLevel=60;r.arena.hp=growthStats(r).maxHp;r.arena.mp=growthStats(r).maxMana;return r;}
const r=ranked(),a=r.arena;
const training=GEAR.find(g=>g.name==='Training Hat'),sword=GEAR.find(g=>g.name==='Broken Greatsword');
const before={pixels:a.pixels,craft:a.craftingMaterial};assert.ok(craftGear(r,training.id));assert.equal(a.pixels,before.pixels-500);assert.equal(a.craftingMaterial,before.craft-100);assert.equal(craftGear(r,training.id),false);
assert.ok(equipGear(r,training.id));assert.ok(combatStats(r).criticalDamage>100);assert.ok(equipmentTotals(r).defense>0);
assert.ok(craftGear(r,sword.id));assert.equal(a.craftingMaterial,before.craft-600);assert.ok(equipGear(r,sword.id));
const armors=GEAR.filter(g=>g.name.startsWith('Leather '));for(const g of armors){assert.ok(craftGear(r,g.id));assert.ok(equipGear(r,g.id));}
assert.equal(Object.keys(ensureEquipment(r).armor).length,5);assert.ok(equipmentTotals(r).attack>sword.attack);assert.ok(combatStats(r).resist>growthStats(r).defense);
assert.ok(restore(JSON.stringify(r)));assert.deepEqual(restore(JSON.stringify(r)).equipment,r.equipment);
travel(r,3,()=>0);a.mp=0;assert.equal(canCast(r,'quick'),false);assert.equal(attack(r,()=>.5,'quick'),null);
combatTick(r,.1,()=>.5);assert.ok(a.mp>=40);a.mp=growthStats(r).maxMana;
const mp=a.mp;const quick=attack(r,()=>.5,'quick');assert.ok(quick);assert.equal(mp-a.mp,70);assert.ok(quick.hits>=1&&quick.hits<=3);
assert.equal(attack(r,()=>.5,'power'),null);a.cooldown=0;a.enemyAlive=true;a.enemyHp=1;
const kills=a.kills;const last=attack(r,()=>.5,'quick');assert.equal(last.type,'kill');assert.equal(last.hits,1);assert.equal(a.kills,kills+1);assert.equal(attack(r,()=>.5,'quick'),null);
travel(r,0);a.cooldown=0;a.hp=Math.floor(growthStats(r).maxHp/2);a.mp=growthStats(r).maxMana;
const defense=growthStats(r).defense;const heal=attack(r,()=>.5,'heal');assert.equal(heal.type,'heal');assert.equal(heal.amount,Math.floor(growthStats(r).maxHp*.1));assert.equal(a.healBuff,3);assert.equal(growthStats(r).defense,defense*2);
assert.ok(restore(JSON.stringify(r)));for(let i=0;i<13;i++)combatTick(r,.25,()=>.5);assert.equal(a.healBuff,0);assert.equal(growthStats(r).defense,defense);
assert.ok(raiseSkill(r,1));assert.equal(activeSkill(r,'quick').mp,71);assert.equal(activeSkill(r,'quick').power,46);
assert.ok(raiseSkill(r,54));assert.equal(activeSkill(r,'basic').power,105);
const fresh=newGame();ensureArena(fresh);assert.equal(canCast(fresh,'power'),false);assert.equal(attack(fresh,()=>.5,'heal'),null);
// Every original early monster can be selected by its area's uniform integer roll.
assert.equal(ENEMIES.length,33);assert.deepEqual(REGIONS.slice(1).map(z=>z.pool.length),[9,14,19]);
for(const z of REGIONS.slice(1))for(let i=0;i<z.pool.length;i++)assert.equal(chooseEnemy(z.id,()=>i/z.pool.length+.00001),z.pool[i]);
// Clear every boss through the real attack/reward path, with independent encounters.
for(const boss of ENEMIES.filter(e=>e.boss)){
 travel(r,0);const zone=REGIONS.find(z=>z.id>0&&z.pool.includes(ENEMIES.indexOf(boss)));const slot=zone.pool.indexOf(ENEMIES.indexOf(boss));travel(r,zone.id,()=>slot/zone.pool.length+.00001);
 let n=0;while(a.enemyAlive&&n++<300){a.cooldown=0;a.mp=growthStats(r).maxMana;attack(r,()=>.5,'power');}
 assert.ok(n<300,boss.name+' must be defeatable');assert.ok(a.defeatedBosses.includes(boss.id));assert.ok(a.bestiary[boss.id]>0);
}
assert.equal(a.defeatedBosses.length,4);assert.ok(a.bossKills>=4);
const save=JSON.stringify(r);assert.ok(restore(save));assert.deepEqual(restore(save).arena.defeatedBosses,a.defeatedBosses);
const bad=structuredClone(r);bad.arena.mp=-1;assert.equal(restore(JSON.stringify(bad)),null);bad.arena.mp=1e9;assert.equal(restore(JSON.stringify(bad)),null);
const progress=newGame();ensureArena(progress);progress.progPercent=100;travel(progress,1,()=>0);const zone=progress.arena.zone;assert.ok(claim(progress,()=>.5));assert.equal(progress.arena.zone,zone);assert.equal(claim(progress),null);
// A surviving player receives the source's partial explosion rewards exactly once.
const explosive=ranked(),ea=explosive.arena;travel(explosive,2,()=>11/14+.00001);
assert.equal(ENEMIES[ea.enemyIndex].id,13);ea.enemyHp=350;ea.enemyAge=4.99;ea.auto=false;
const beforeKills=ea.kills;const explosions=combatTick(explosive,.025,()=>.5);const boomKill=explosions.find(e=>e.type==='kill');
assert.ok(boomKill);assert.equal(boomKill.exp,88);assert.equal(boomKill.pixel,20);assert.equal(ea.kills,beforeKills+1);
combatTick(explosive,.025,()=>.5);assert.equal(ea.kills,beforeKills+1);
console.log('PASS: 33-monster/4-boss roster, exact encounter pools, material crafting, five armor slots, combat effects, MP/cooldown/heal/skills, single multihit kill reward, boss journal, save migration and cross-content progress claim.');
