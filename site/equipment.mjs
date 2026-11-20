import {growthStats} from './growth.mjs?v=0.23.0';
import {GEAR} from './gear-data.mjs?v=0.23.0';
export const WEAPONS=GEAR.filter(g=>g.slot==='weapon');
export const ARMOR=GEAR.filter(g=>g.slot!=='weapon');
export const ARMOR_SLOTS=['hat','shirt','gloves','pants','shoes'];
export function ensureEquipment(r){const e=r.equipment??={weapon:101,owned:[101]};e.armor??={};e.armorOwned??=[];return e;}
export function weapon(r){return WEAPONS.find(w=>w.id===ensureEquipment(r).weapon)||WEAPONS[0];}
export function equippedArmor(r){const e=ensureEquipment(r);return ARMOR.filter(g=>e.armor[g.slot]===g.id);}
export function equipmentTotals(r){const w=weapon(r),armor=equippedArmor(r),items=[w,...armor];const sum=k=>items.reduce((n,g)=>n+(g[k]||0),0);return {attack:sum('attack'),defense:sum('defense'),armorSpeed:armor.reduce((n,g)=>n+g.speed,0),criticalDamage:100+armor.reduce((n,g)=>n+g.crit,0),health:armor.reduce((n,g)=>n+g.health,0),evasion:armor.reduce((n,g)=>n+g.dexterity,0)};}
// Original normal-mode rank thresholds. Current port feeds base enemy EXP.
export function rankRequirement(rank){if(rank<12)return rank*200;if(rank<30)return rank*(rank+1)*50;if(rank<70)return rank*(rank+1)*70-15000;if(rank<120)return rank*(rank+1)*100-150000;if(rank<180)return rank*(rank+1)*150-500000;if(rank<250)return rank*(rank+1)*250-2500000;if(rank<500)return rank*(rank+1)*400-10000000;return 100000000;}
export function arenaRank(r){let xp=r.arena?.xp||0,rank=1;while(rank<500&&xp>=rankRequirement(rank)){xp-=rankRequirement(rank);rank++;}return {rank,xp,required:rankRequirement(rank)};}

export function canCraft(r,id){const g=GEAR.find(g=>g.id===id),e=ensureEquipment(r);if(!g||!r.arena)return false;const owned=g.slot==='weapon'?e.owned:e.armorOwned;return !owned.includes(id)&&arenaRank(r).rank>=g.rank&&r.arena.pixels>=g.pixels&&r.arena.craftingMaterial>=g.craft;}
export function craftGear(r,id){if(!canCraft(r,id))return false;const g=GEAR.find(g=>g.id===id),e=ensureEquipment(r);r.arena.pixels-=g.pixels;r.arena.craftingMaterial-=g.craft;(g.slot==='weapon'?e.owned:e.armorOwned).push(id);return true;}
export function equipGear(r,id){const g=GEAR.find(g=>g.id===id),e=ensureEquipment(r);if(!g||arenaRank(r).rank<g.rank||!(g.slot==='weapon'?e.owned:e.armorOwned).includes(id))return false;if(g.slot==='weapon')e.weapon=id;else e.armor[g.slot]=id;if(r.arena){r.arena.hp=Math.min(r.arena.hp,growthStats(r).maxHp);if(r.arena.mp!==undefined)r.arena.mp=Math.min(r.arena.mp,growthStats(r).maxMana);}return true;}
export const craftWeapon=(r,id)=>typeof id==='number'&&craftGear(r,id);
export const equipWeapon=(r,id)=>typeof id==='number'&&equipGear(r,id);
export function validEquipment(e){if(!e||!Array.isArray(e.owned)||!e.owned.includes(101)||new Set(e.owned).size!==e.owned.length||!e.owned.every(id=>WEAPONS.some(w=>w.id===id))||!e.owned.includes(e.weapon))return false;const owned=e.armorOwned??[],slots=e.armor??{};return Array.isArray(owned)&&new Set(owned).size===owned.length&&owned.every(id=>ARMOR.some(g=>g.id===id))&&slots&&typeof slots==='object'&&!Array.isArray(slots)&&Object.entries(slots).every(([slot,id])=>ARMOR_SLOTS.includes(slot)&&owned.includes(id)&&ARMOR.some(g=>g.id===id&&g.slot===slot));}
