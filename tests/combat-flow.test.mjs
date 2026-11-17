import assert from 'node:assert/strict';
import {newGame,tick,claim,restore} from '../site/game.mjs';
import {ensureArena,travel,combatTick} from '../site/combat.mjs';
import {arenaRank,craftGear,equipGear,ensureEquipment,WEAPONS,ARMOR,weapon} from '../site/equipment.mjs';
import {raiseSkill,skillLevel} from '../site/skills.mjs';
import {growthStats} from '../site/growth.mjs';
let seed=1853;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
let r=newGame();ensureArena(r);let frames=0,claims=0,defeats=0;const limit=40*1800;
for(;frames<limit&&r.arena.defeatedBosses.length<4;frames++){
 const a=r.arena,rank=arenaRank(r).rank;
 tick(r);if(r.progPercent>=100){claim(r,rng);claims++;}
 if(frames%40===0){
  const eq=ensureEquipment(r);
  for(const g of WEAPONS.filter(g=>g.rank<=rank).sort((a,b)=>a.attack-b.attack)){if(!eq.owned.includes(g.id))craftGear(r,g.id);if(eq.owned.includes(g.id)&&g.attack>weapon(r).attack)equipGear(r,g.id);}
  for(const slot of ['hat','shirt','gloves','pants','shoes']){
   const candidates=ARMOR.filter(g=>g.slot===slot&&g.rank<=rank).sort((a,b)=>a.defense-b.defense);
   for(const g of candidates){if(!eq.armorOwned.includes(g.id))craftGear(r,g.id);const old=ARMOR.find(g=>g.id===eq.armor[slot]);if(eq.armorOwned.includes(g.id)&&(!old||g.defense>old.defense))equipGear(r,g.id);}
  }
  while(skillLevel(r,54)<20&&raiseSkill(r,54)){}
  while(rank>=10&&skillLevel(r,9)<10&&raiseSkill(r,9)){}
 }
 const target=rank<5?1:!a.defeatedBosses.includes(15)||rank<10?2:3;
 if(a.zone===0){if(a.hp>=growthStats(r).maxHp*.9)travel(r,target,rng);}else if(target!==a.zone)travel(r,target,rng);
 a.auto=true;a.autoSkill=rank>=10?'quick':'basic';
 const events=combatTick(r,.025,rng);if(events.some(e=>e.type==='defeat'))defeats++;
 if(frames%400===0){const restored=restore(JSON.stringify(r));assert.ok(restored,'live state roundtrip');r=restored;}
}
assert.equal(r.arena.defeatedBosses.length,4,'new player must be able to progress through all early bosses');
assert.ok(claims>0);assert.ok(r.arena.kills>0);assert.ok(ensureEquipment(r).armorOwned.length>=5);assert.ok(weapon(r).attack>30);
console.log(`PASS: fresh save → progress claims → rank gates → crafting/armor → MP auto skills → all 4 bosses; ${Math.ceil(frames/40)} simulated seconds, ${r.arena.kills} kills, ${claims} progress claims, ${defeats} defeats, deterministic save/reload throughout.`);
