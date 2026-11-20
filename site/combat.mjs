import {skillLevel,activeSkill,ACTIVE_SKILLS} from './skills.mjs?v=0.23.0';
import {resetEnemyEffects,effectiveEnemy,enemyEffects} from './enemy-effects.mjs?v=0.23.0';
import {region,REGION_EXITS,ENEMY_DATA,chooseEnemy} from './regions.mjs?v=0.23.0';
import {baseStats,growthStats,settleGrowth} from './growth.mjs?v=0.23.0';
import {weapon,arenaRank,equipmentTotals} from './equipment.mjs?v=0.23.0';
import {awardExperience} from './game.mjs?v=0.23.0';
export const ENEMIES=ENEMY_DATA;
export const TRAINING={maxHp:500,attack:100,minMult:80,accuracy:50,evasion:50,defense:100,respawn:2.5,enemyPeriod:2.5};
export function ensureArena(r){
 const a=r.arena??={zone:0,hp:500,growthVersion:1,kills:0,pixels:0,xp:0,auto:false,enemyIndex:0,enemyHp:40,enemyAlive:false,cooldown:0,enemyTimer:0,spawnTimer:0};
 a.enemyRampage??=false;a.enemyEffectClock??=0;a.enemyAge??=0;a.rangeClock??=0;a.regenClock??=0;
 a.attacks??=0;a.criticals??=0;a.bestHit??=0;a.healBuff??=0;a.autoSkill??='basic';a.bossKills??=0;
 a.discoveredZones??=[];a.defeatedBosses??=[];a.bestiary??={};settleGrowth(r);a.mp??=growthStats(r).maxMana;return a;
}
export function damageRange(level,equipAttack=100,rank=1,power=baseStats(rank).attack){let max=Math.ceil((.000007*Math.sqrt(rank)*Math.sqrt(level)+.01)*power*equipAttack+power);if(level<100)max=Math.ceil(max*level/100);return {min:Math.ceil(TRAINING.minMult*max/100),max};}
export function playerDamage(level,enemy,rng=Math.random,equipAttack=100,rank=1,accuracy=baseStats(rank).accuracy,power=baseStats(rank).attack,skillPower=100,areaDamagePct=100){
 let penalty=Math.min(30,Math.floor((enemy.level-level)/100));if(enemy.level>level&&level<8999)penalty+=10;
 if(!(rng()>penalty/100&&(rng()<accuracy/enemy.evasion-.1||rng()<0)))return 0;
 const d=damageRange(level,equipAttack,rank,power);return Math.max(1,Math.ceil(((d.min+Math.floor(rng()*(d.max-d.min+1)))*skillPower/100-enemy.defense)*areaDamagePct/100));
}
export function incomingDamage(level,enemy,rng=Math.random,stats=baseStats(1)){
 const chance=Math.max(.1,enemy.accuracy/stats.evasion-.1);if(rng()>=chance)return 0;
 let defense=Math.floor((stats.resist??stats.defense)*(1+(level-enemy.level)/6000));if(enemy.level>level&&level<8999)defense=Math.floor(defense*.8);
 defense=Math.max(0,Math.min(defense,(stats.resist??stats.defense)*2));return Math.max(1,Math.ceil(enemy.attack-defense));
}
export function combatStats(r){
 const w=weapon(r),gear=equipmentTotals(r),g=growthStats(r);
 const speed=Math.max(1,Math.min(25,Math.floor(w.speed*(1+gear.armorSpeed*.05)*(1+.02*skillLevel(r,16)))));
 const resist=Math.floor((.0000007*Math.sqrt(g.rank)*Math.sqrt(r.save.level)+.002)*g.defense*gear.defense+g.defense);
 return {speed,cooldown:Math.ceil(175/speed)/40,criticalChance:Math.min(95,Math.floor(g.accuracy/1000)+w.crit+skillLevel(r,19)),criticalDamage:gear.criticalDamage+2*skillLevel(r,18),resist};
}
function spawn(r,index){const a=r.arena;a.enemyIndex=index;a.enemyHp=ENEMIES[index].hp;a.enemyAlive=true;a.enemyTimer=0;a.enemyAge=0;a.rangeClock=0;a.spawnTimer=0;resetEnemyEffects(a);}
export function canTravel(r,zone,viaExit=false){const a=ensureArena(r),target=region(zone);return !!target&&arenaRank(r).rank>=target.rank&&!(zone>0&&a.hp<=0)&&(!target.hidden||a.discoveredZones.includes(zone)||viaExit&&Object.values(REGION_EXITS[a.zone]??{}).includes(zone));}
export function travelExit(r,direction,rng=Math.random){const zone=REGION_EXITS[ensureArena(r).zone]?.[direction];return zone!==undefined&&travel(r,zone,rng,true);}
export function travel(r,zone,rng=Math.random,viaExit=false){
 const a=ensureArena(r),target=region(zone);if(!canTravel(r,zone,viaExit))return false;if(a.zone===zone)return true;
 if(target.hidden&&!a.discoveredZones.includes(zone))a.discoveredZones.push(zone);
 a.zone=zone;a.cooldown=0;a.enemyTimer=0;a.spawnTimer=0;resetEnemyEffects(a);
 if(target.pool.length&&zone>0)spawn(r,chooseEnemy(zone,rng));else{a.enemyAlive=false;a.auto=false;a.healBuff=0;a.enemyHp=0;}return true;
}
export function canCast(r,id){
 const a=ensureArena(r),spec=activeSkill(r,id),def=ACTIVE_SKILLS.find(s=>s.id===id);
 return !!spec&&!!def&&arenaRank(r).rank>=def.rank&&a.hp>0&&a.cooldown<=1e-8&&a.mp>=spec.mp&&(id==='heal'||a.zone>0&&a.enemyAlive);
}
export function attack(r,rng=Math.random,id='basic'){
 const a=ensureArena(r);if(!canCast(r,id))return null;
 const spec=activeSkill(r,id),stats=combatStats(r),g=growthStats(r),gear=equipmentTotals(r);
 a.mp-=spec.mp;a.cooldown=Math.ceil(spec.delay/stats.speed)/40;
 let recovered=0;
 if(id==='heal'){recovered=Math.min(g.maxHp-a.hp,Math.floor(g.maxHp*spec.heal/100));a.hp+=recovered;a.healBuff=spec.duration;if(!a.enemyAlive||!ENEMIES[a.enemyIndex].zombie)return {type:'heal',amount:recovered,skill:id};}
 const e=effectiveEnemy(a,ENEMIES[a.enemyIndex]);let damage=0,critical=false,hits=0;
 for(let i=0;i<spec.hits&&a.enemyHp>0;i++){
  let amount=playerDamage(r.save.level,e,rng,gear.attack,g.rank,g.accuracy,g.attack,spec.power,region(a.zone).damagePct??100);
  if(amount>0){let penalty=Math.max(0,40+(Math.pow(e.level,1.12)/(r.save.level+g.rank*10+999)-1)*50);if(e.level>r.save.level&&r.save.level<8999)penalty+=10;if(e.boss)penalty+=20;if(e.zombie&&id!=='heal')penalty+=70;amount=Math.max(1,Math.floor(amount*(100-Math.min(95,penalty))/100));}const crit=amount>0&&rng()*100<stats.criticalChance;if(crit){amount=Math.ceil(amount*stats.criticalDamage/100);a.criticals++;critical=true;}
  a.attacks++;a.bestHit=Math.max(a.bestHit,amount);a.enemyHp=Math.max(0,a.enemyHp-amount);damage+=amount;hits++;
 }
 const event={type:'attack',damage,critical,hits,skill:id,healed:recovered};
 if(a.enemyHp===0)Object.assign(event,finishEnemy(r,e));
 return event;
}
function finishEnemy(r,e,factor=1){
 const a=r.arena;if(!a.enemyAlive)return {};a.enemyAlive=false;a.enemyHp=0;a.kills++;
 const exp=Math.floor(e.exp*factor),coin=Math.floor(e.coin*factor),pixel=Math.floor(e.pixel*factor);
 a.pixels+=pixel;a.xp+=exp;const rankReward=settleGrowth(r);r.save.coin+=coin;
 a.bestiary[e.id]=(a.bestiary[e.id]??0)+1;if(e.boss){a.bossKills++;if(!a.defeatedBosses.includes(e.id))a.defeatedBosses.push(e.id);}
 const levels=awardExperience(r,exp);a.spawnTimer=region(a.zone).respawn??TRAINING.respawn;
 return {type:'kill',rankReward,name:e.name,exp,coin,pixel,levels,boss:e.boss};
}
function regenerate(r,dt){
 const a=r.arena,g=growthStats(r);a.regenClock+=dt;
 while(a.regenClock>=.1-1e-9){a.regenClock=Math.max(0,a.regenClock-.1);
  const hp=Math.floor(Math.floor((4000+g.maxHp/25)*(a.healBuff>0?3:1)/10)*10/10);
  const mp=Math.floor(Math.floor((400+g.maxMana/250)/10)*10/10);
  if(a.hp>0)a.hp=Math.min(g.maxHp,a.hp+hp);else if(a.zone===0)a.hp=Math.min(g.maxHp,a.hp+hp);
  a.mp=Math.min(g.maxMana,a.mp+mp);
 }
}
function hurt(r,enemy,rng,events,kind='melee'){
 const a=r.arena,g=growthStats(r);const damage=incomingDamage(r.save.level,enemy,rng,{...g,resist:combatStats(r).resist});a.hp=Math.max(0,a.hp-damage);events.push({type:'hurt',damage,kind});
 if(a.hp<=0){travel(r,0);events.push({type:'defeat'});return true;}return false;
}
export function combatTick(r,dt,rng=Math.random){
 const a=ensureArena(r);dt=Math.max(0,Math.min(.25,Number.isFinite(dt)?dt:0));a.cooldown=Math.max(0,a.cooldown-dt);a.healBuff=Math.max(0,a.healBuff-dt);const events=[];
 // Regen occurs at the original four-frame cadence. No offline simulation.
 regenerate(r,dt);if(a.zone===0||!region(a.zone).pool.length)return events;
 if(!a.enemyAlive){a.spawnTimer=Math.max(0,a.spawnTimer-dt);if(a.spawnTimer<=1e-9){spawn(r,chooseEnemy(a.zone,rng));events.push({type:'spawn'});}return events;}
 events.push(...enemyEffects(a,ENEMIES[a.enemyIndex],dt,rng));
 if(a.auto){const id=canCast(r,a.autoSkill)?a.autoSkill:'basic';const result=attack(r,rng,id);if(result)events.push(result);}if(!a.enemyAlive)return events;
 const enemy=effectiveEnemy(a,ENEMIES[a.enemyIndex]);a.enemyAge+=dt;
 if(enemy.explode>0&&a.enemyAge>=enemy.explode){if(hurt(r,{...enemy,attack:enemy.explodeDamage},rng,events,'explosion'))return events;events.push({type:'enemyExplosion',name:enemy.name});const factor=Math.max(.2,(enemy.hp-a.enemyHp)/enemy.hp);events.push({...finishEnemy(r,enemy,factor),damage:0,skill:'explosion'});return events;}
 if(enemy.rangeDamage>0&&a.enemyHp<enemy.hp){a.rangeClock+=dt*40;const delay=30+a.enemyHp/enemy.hp*50;if(a.rangeClock>delay){a.rangeClock=0;if(hurt(r,{...enemy,attack:enemy.rangeDamage*(.8+rng()*.2)},rng,events,'ranged'))return events;}}
 if(enemy.speed>0){a.enemyTimer+=dt*(a.enemyRampage?1.2:1);if(a.enemyTimer>=TRAINING.enemyPeriod){a.enemyTimer=0;hurt(r,{...enemy,attack:enemy.attack*(.8+rng()*.2)},rng,events);}}
 return events;
}
