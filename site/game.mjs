import {validPrinter} from './printer.mjs?v=0.23.0';
import {validButtonMachine} from './button-machine.mjs?v=0.23.0';
import {newFeatures,validFeatures,migrateFeatures,owns} from './features.mjs?v=0.23.0';
import {validDragon,ensureDragon} from './dragon.mjs?v=0.23.0';
import {validArcade} from './arcade.mjs?v=0.23.0';
import {validGarden} from './garden.mjs?v=0.23.0';
import {region,ENEMY_DATA} from './regions.mjs?v=0.23.0';
import {validSkills} from './skills.mjs?v=0.23.0';
import {baseStats,growthStats,settleGrowth} from './growth.mjs?v=0.23.0';
import {arenaRank,validEquipment} from './equipment.mjs?v=0.23.0';
import {calcReqExp,progressUp,gainBoost} from './core.mjs?v=0.23.0';
export function newGame(){return {version:1,progressVersion:1,features:newFeatures(),fps:40,saveid:0,progPercent:0,boostMax:500,idlerAppreciate:false,curCareerLevel:[0,0],save:{level:1,bestLevel:1,gDifficulty:1,banned:0,gOldAscension:false,totalExp:0,currentExp:0,idleMode:false,progStore:100,progSpeedManual:100,progSpeedAuto:30,careerLevel:[0,0],totalStupidity:0,permaBanPenalty:Array(32).fill(0),boost:100,boostPurchased:0,featureBoostGen:false,rewardClaim:0,coin:0,greenCoin:0,blueCoin:0},upgrades:0,log:[]};}
export function tick(r){ensureDragon(r);if(!owns(r,'idle'))r.save.idleMode=false;progressUp(r);r.progPercent=Math.min(r.progPercent,100);if(r.save.idleMode&&r.progPercent>=100)return claim(r);return null;}
export function progressReward(r,{idle=r.save.idleMode,rng=Math.random,claimNumber=r.save.rewardClaim+1}={}){const s=r.save;calcReqExp(r);let exp=Math.floor(1.4*s.boost*Math.pow(s.level,.6)),coin=Math.floor(.35*s.boost*Math.pow(s.level,.6)*(.8+rng()*.4)),green=100,blue=0;
 if(s.bestLevel<35)exp=Math.min(Math.floor(exp*.5),r.requiredExp*2);if(claimNumber<=5){exp=4;coin=1000;green=200;blue=20;}
 const penalty=s.permaBanPenalty??[],blueChance=[.1,.3,.4,.6][penalty[2]??0]??.1;if(!idle){green+=100;if(rng()<blueChance)blue++;}
 const expMod=idle?[1,1.06,1.09,1.15][penalty[25]??0]:[1,1.1,1.15,1.25][penalty[17]??0],coinMod=idle?[1,1.06,1.09,1.15][penalty[36]??0]:[1,1.1,1.15,1.25][penalty[26]??0];exp=Math.floor(exp*(expMod??1));coin=Math.floor(coin*(coinMod??1));green+=([0,200,300,500][penalty[2]??0]??0);return {exp,coin,green,blue,blueChance:idle?0:blueChance};}
export function claim(r,rng=Math.random){if(r.progPercent<100)return null;r.progPercent-=100;r.save.rewardClaim++;const result=progressReward(r,{rng,claimNumber:r.save.rewardClaim});r.save.coin+=result.coin;r.save.greenCoin+=result.green;r.save.blueCoin+=result.blue;const levels=awardExperience(r,result.exp);return {...result,levels};}
// v1853 Progress shop, sprite 10159/frame 20. Each purchase adds 1 percentage point.
export function upgradeCost(r,mode='manual'){const v=mode==='idle'?r.save.progSpeedAuto:r.save.progSpeedManual;if(mode==='idle')return v>=200?Infinity:v>=150?Math.floor((v-149)*180000):Math.floor(v*v*(v>=100?8:.8));return v>=500?Infinity:v>=400?Math.floor((v-398)*9000):v>=300?Math.floor((v-299)*180):Math.floor(v*v/(v>=200?500:5000));}
export function buySpeed(r,mode='manual'){if(!['manual','idle'].includes(mode)||mode==='idle'&&!owns(r,'idle'))return false;const cost=upgradeCost(r,mode),currency=mode==='idle'?'greenCoin':'blueCoin';if(!Number.isFinite(cost)||r.save[currency]<cost)return false;r.save[currency]-=cost;r.save[mode==='idle'?'progSpeedAuto':'progSpeedManual']++;r.upgrades++;return true;}
export function progressProfile(r,idle=r.save.idleMode){const sample={...r,progPercent:0,save:{...r.save,idleMode:idle}};progressUp(sample);const speed=idle?r.save.progSpeedAuto:Math.max(r.save.progSpeedManual,r.save.progSpeedAuto);return {speed,seconds:100/(sample.progPercent*r.fps),...progressReward(r,{idle,rng:()=>.5})};}
export function buyBoost(r){if(!owns(r,'boost')||r.save.greenCoin<100||r.save.boost>=r.boostMax)return false;r.save.greenCoin-=100;gainBoost(r,25,1);return true;}
export function restore(text){try{
 const parsed=JSON.parse(text);if(!parsed||parsed.version!==1)return null;const r=newGame();
 const finite=(v,min=0,max=Number.MAX_VALUE)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const integer=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 for(const key of ['level','bestLevel','gDifficulty','banned','totalExp','currentExp','boost','boostPurchased','rewardClaim','coin','greenCoin','blueCoin','progSpeedManual','progSpeedAuto']){const v=parsed.save?.[key];if(!finite(v))return null;r.save[key]=v;}
 if(!integer(r.save.level,1,8998)||!integer(r.save.bestLevel,r.save.level,8998)||r.save.boost<100||r.save.boost>1200||r.save.gDifficulty!==1)return null;
 r.save.idleMode=parsed.save.idleMode===true;r.upgrades=Math.min(590,Math.max(0,Math.floor(parsed.upgrades||0)));r.progPercent=Math.min(100,Math.max(0,Number(parsed.progPercent)||0));
 if(parsed.progressVersion!==undefined&&parsed.progressVersion!==1)return null;
 if(parsed.progressVersion===undefined&&r.save.progSpeedManual===100+25*r.upgrades&&r.save.progSpeedAuto===r.save.progSpeedManual)r.save.progSpeedAuto=30+25*r.upgrades;
 r.save.progSpeedAuto=Math.min(200,r.save.progSpeedAuto);r.save.progSpeedManual=Math.min(500,r.save.progSpeedManual);
 if(parsed.features!==undefined&&!validFeatures(parsed.features))return null;
 r.features=parsed.features?{...newFeatures(),...parsed.features,arcadePack:parsed.features.arcadePack??migrateFeatures(r,parsed).arcadePack}:migrateFeatures(r,parsed);r.save.featureBoostGen=owns(r,'boost');if(!owns(r,'idle'))r.save.idleMode=false;
 if(parsed.dragon!==undefined){if(!validDragon(parsed.dragon,r.save.bestLevel))return null;r.dragon=structuredClone(parsed.dragon);}
 ensureDragon(r);if(r.save.boost>r.boostMax*(owns(r,'button')?1.5:1))return null;
 if(parsed.printer!==undefined){if(!validPrinter(parsed.printer))return null;r.printer=structuredClone(parsed.printer);}
 if(parsed.arena!==undefined){
  const a=parsed.arena;if(!a||typeof a!=='object'||Array.isArray(a))return null;r.arena={};
  for(const key of ['hp','kills','pixels','xp','cooldown','enemyTimer','spawnTimer','enemyIndex','enemyHp']){if(!finite(a[key]))return null;r.arena[key]=a[key];}
  const zone=region(a.zone);if(!zone||arenaRank(r).rank<zone.rank||!integer(a.enemyIndex,0,ENEMY_DATA.length-1)||a.zone>0&&zone.pool.length>0&&!zone.pool.includes(a.enemyIndex))return null;
  const discovered=a.discoveredZones??[];if(!Array.isArray(discovered)||new Set(discovered).size!==discovered.length||!discovered.every(id=>region(id)?.hidden===true)||zone.hidden&&!discovered.includes(a.zone)||!zone.pool.length&&a.enemyAlive)return null;r.arena.discoveredZones=[...discovered];
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
