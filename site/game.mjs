import {validButtonMachine} from './button-machine.mjs?v=0.21.0';
import {newFeatures,validFeatures,migrateFeatures,owns} from './features.mjs?v=0.21.0';
import {validDragon,ensureDragon} from './dragon.mjs?v=0.21.0';
import {validArcade} from './arcade.mjs?v=0.21.0';
import {validGarden} from './garden.mjs?v=0.21.0';
import {region,ENEMY_DATA} from './regions.mjs?v=0.21.0';
import {validSkills} from './skills.mjs?v=0.21.0';
import {baseStats,growthStats,settleGrowth} from './growth.mjs?v=0.21.0';
import {arenaRank,validEquipment} from './equipment.mjs?v=0.21.0';
import {calcReqExp,progressUp,gainBoost} from './core.mjs?v=0.21.0';
export function newGame(){return {version:1,features:newFeatures(),fps:40,saveid:0,progPercent:0,boostMax:500,idlerAppreciate:false,curCareerLevel:[0,0],save:{level:1,bestLevel:1,gDifficulty:1,banned:0,gOldAscension:false,totalExp:0,currentExp:0,idleMode:false,progStore:100,progSpeedManual:100,progSpeedAuto:100,careerLevel:[0,0],totalStupidity:0,permaBanPenalty:Array(32).fill(0),boost:100,boostPurchased:0,featureBoostGen:false,rewardClaim:0,coin:0,greenCoin:0,blueCoin:0},upgrades:0,log:[]};}
export function tick(r){ensureDragon(r);if(!owns(r,'idle'))r.save.idleMode=false;progressUp(r);r.progPercent=Math.min(r.progPercent,100);if(r.save.idleMode&&r.progPercent>=100)return claim(r);return null;}
export function claim(r,rng=Math.random){if(r.progPercent<100)return null;const s=r.save;calcReqExp(r);r.progPercent-=100;s.rewardClaim++;let exp=Math.floor(1.4*s.boost*Math.pow(s.level,.6)),coin=Math.floor(.35*s.boost*Math.pow(s.level,.6)*(.8+rng()*.4)),green=100,blue=0;
if(s.bestLevel<35)exp=Math.min(Math.floor(exp*.5),r.requiredExp*2);
if(s.rewardClaim<=5){exp=4;coin=1000;green=200;blue=20;}
if(!s.idleMode){green+=100;if(rng()<.1)blue++;}
s.currentExp+=exp;s.coin+=coin;s.greenCoin+=green;s.blueCoin+=blue;const levels=awardExperience(r,0);
return {exp,coin,green,blue,levels};}
// Prototype shop prices; not yet a port of the original shop.
export function upgradeCost(r){return Math.floor(500*Math.pow(1.6,r.upgrades));}
export function buySpeed(r){const cost=upgradeCost(r);if(r.save.coin<cost||r.upgrades>=20)return false;r.save.coin-=cost;r.upgrades++;r.save.progSpeedManual+=25;r.save.progSpeedAuto+=25;return true;}
export function buyBoost(r){if(!owns(r,'boost')||r.save.greenCoin<100||r.save.boost>=r.boostMax)return false;r.save.greenCoin-=100;gainBoost(r,25,1);return true;}
export function restore(text){try{
 const parsed=JSON.parse(text);if(!parsed||parsed.version!==1)return null;const r=newGame();
 const finite=(v,min=0,max=Number.MAX_VALUE)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const integer=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 for(const key of ['level','bestLevel','gDifficulty','banned','totalExp','currentExp','boost','boostPurchased','rewardClaim','coin','greenCoin','blueCoin','progSpeedManual','progSpeedAuto']){const v=parsed.save?.[key];if(!finite(v))return null;r.save[key]=v;}
 if(!integer(r.save.level,1,8998)||!integer(r.save.bestLevel,r.save.level,8998)||r.save.boost<100||r.save.boost>1200||r.save.gDifficulty!==1)return null;
 r.save.idleMode=parsed.save.idleMode===true;r.upgrades=Math.min(20,Math.max(0,Math.floor(parsed.upgrades||0)));r.progPercent=Math.min(100,Math.max(0,Number(parsed.progPercent)||0));
 if(parsed.features!==undefined&&!validFeatures(parsed.features))return null;
 r.features=parsed.features?{...newFeatures(),...parsed.features,arcadePack:parsed.features.arcadePack??migrateFeatures(r,parsed).arcadePack}:migrateFeatures(r,parsed);r.save.featureBoostGen=owns(r,'boost');if(!owns(r,'idle'))r.save.idleMode=false;
 if(parsed.dragon!==undefined){if(!validDragon(parsed.dragon,r.save.bestLevel))return null;r.dragon=structuredClone(parsed.dragon);}
 ensureDragon(r);if(r.save.boost>r.boostMax*(owns(r,'button')?1.5:1))return null;
 if(parsed.arena!==undefined){
  const a=parsed.arena;if(!a||typeof a!=='object'||Array.isArray(a))return null;r.arena={};
  for(const key of ['hp','kills','pixels','xp','cooldown','enemyTimer','spawnTimer','enemyIndex','enemyHp']){if(!finite(a[key]))return null;r.arena[key]=a[key];}
  const zone=region(a.zone);if(!zone||arenaRank(r).rank<zone.rank||!integer(a.enemyIndex,0,ENEMY_DATA.length-1)||a.zone>0&&!zone.pool.includes(a.enemyIndex))return null;
  const enemy=ENEMY_DATA[a.enemyIndex];if(a.enemyHp>enemy.hp||!integer(a.kills)||!integer(a.xp))return null;
  if(a.growthVersion!==undefined&&a.growthVersion!==1)return null;
  if(a.growthVersion===1){r.arena.growthVersion=1;for(const key of ['rewardedRank','skillPoints','craftingMaterial','battlePoints']){if(!integer(a[key]))return null;r.arena[key]=a[key];}if(a.rewardedRank<1||a.rewardedRank>arenaRank(r).rank)return null;}
  for(const key of ['attacks','criticals','bestHit','bossKills']){const v=a[key]??0;if(!integer(v))return null;r.arena[key]=v;}
  if(r.arena.criticals>r.arena.attacks||r.arena.bossKills>a.kills)return null;
  for(const [key,max] of [['enemyEffectClock',.025],['regenClock',.1]]){const v=a[key]===undefined?0:a[key];if(!finite(v)||v>=max)return null;r.arena[key]=v;}
  for(const key of ['enemyAge','rangeClock']){const v=a[key]??0;if(!finite(v))return null;r.arena[key]=v;}
  const buff=a.healBuff??0;if(!finite(buff,0,4))return null;r.arena.healBuff=buff;
  if(a.enemyRampage!==undefined&&typeof a.enemyRampage!=='boolean')return null;r.arena.enemyRampage=a.enemyRampage===true;
  if(r.arena.enemyRampage&&(a.zone===0||!enemy.rampagePct))return null;
  r.arena.zone=a.zone;r.arena.auto=a.auto===true;r.arena.enemyAlive=a.enemyAlive===true;
  if(a.autoSkill!==undefined&&!['basic','quick','power'].includes(a.autoSkill))return null;r.arena.autoSkill=a.autoSkill??'basic';
  const bestiary=a.bestiary??{};if(!bestiary||typeof bestiary!=='object'||Array.isArray(bestiary)||!Object.entries(bestiary).every(([id,n])=>ENEMY_DATA.some(e=>String(e.id)===id)&&integer(n,0,a.kills)))return null;
  if(Object.values(bestiary).reduce((sum,n)=>sum+n,0)>a.kills)return null;r.arena.bestiary={...bestiary};
  const bosses=a.defeatedBosses??[];if(!Array.isArray(bosses)||new Set(bosses).size!==bosses.length||!bosses.every(id=>ENEMY_DATA.some(e=>e.id===id&&e.boss)))return null;r.arena.defeatedBosses=[...bosses];
 }
 if(parsed.equipment!==undefined){if(!validEquipment(parsed.equipment))return null;r.equipment={weapon:parsed.equipment.weapon,owned:[...parsed.equipment.owned],armor:{...(parsed.equipment.armor??{})},armorOwned:[...(parsed.equipment.armorOwned??[])]};}
 if(parsed.skills!==undefined){if(!validSkills(parsed.skills,r))return null;r.skills={...parsed.skills};}
 if(r.arena){const a=parsed.arena;if(a.hp>(a.growthVersion===1?growthStats(r).maxHp:300))return null;settleGrowth(r);const mp=a.mp??growthStats(r).maxMana;if(!finite(mp,0,growthStats(r).maxMana))return null;r.arena.mp=mp;}
 if(parsed.garden!==undefined){if(!validGarden(parsed.garden))return null;r.garden=structuredClone(parsed.garden);}
 if(parsed.arcade!==undefined){if(!validArcade(parsed.arcade))return null;r.arcade=structuredClone(parsed.arcade);}
 if(parsed.buttonMachine!==undefined){if(!validButtonMachine(parsed.buttonMachine))return null;r.buttonMachine=structuredClone(parsed.buttonMachine);}
 return r;
 }catch{return null;}}

export function awardExperience(r,amount){const s=r.save;s.currentExp+=amount;calcReqExp(r);let levels=0;
while(s.currentExp>=r.requiredExp&&s.level<8998&&levels<50){s.currentExp-=r.requiredExp;s.totalExp+=r.requiredExp;s.level++;s.bestLevel=Math.max(s.bestLevel,s.level);s.coin+=200*s.level;if(s.level%1000===0)s.blueCoin+=s.level;else s.greenCoin+=s.level*(s.level%100===0?10:1);levels++;calcReqExp(r);}
return levels;}
