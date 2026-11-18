import {SPEECHES} from './dragon-speeches.mjs?v=0.20.0';
const day=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function ensureDragon(r,now=new Date()){
 const d=r.dragon??={version:1,day:day(now),today:0,total:0,knowledge:0,meter:0,boost:0,levelRewards:0,discovered:{},inventory:{},lastSpeech:''};
 const today=day(now);if(today>d.day){d.day=today;d.today=0;}r.boostMax=500+d.boost;return d;
}
export const feedingRequirement=boost=>boost>=300?500:boost>=250?250:boost>=200?100:boost>=150?50:boost>=100?25:boost>=50?10:5;
export function feedCost(r,now=new Date()){const d=ensureDragon(r,now);return Math.floor((100+d.today*2.5)*Math.sqrt(Math.min(r.save.bestLevel,9000))*Math.min((d.total+1)/100,1))*500;}
export function speeches(r){return SPEECHES.filter(s=>r.save.bestLevel>=s.level).map(s=>s.text);}
function add(d,key,n){d.inventory[key]=(d.inventory[key]??0)+n;}
const ITEM_NAMES=['','White Coins','Legendary Boxes','Mega Fertilizers','Mega Career Potions','Golden Treasure Boxes','Golden Keys','Treasure Boxes','Keys','Fertilizers','Random Career Potions','Energy Refills','Chaotic Fragments of Chaos','Unobtainium','Superior Crafting Material','1.5x EXP seconds','1.5x Coin seconds'];
function randomReward(r,d,rng){
 let kind;if(rng()<.0005)kind=1;else if(rng()<.2)kind=2+Math.floor(rng()*5);else if(rng()<.5)kind=7+Math.floor(rng()*5);else kind=12+Math.floor(rng()*5);
 let amount=kind===1?2500:kind>=15?10800:0;
 if(kind>=2&&kind<=14){const scale=rng()<.01?4:rng()<.1?3:rng()<.3?2:1;amount=scale*(kind<=8?10:kind<=11?25:500);}
 if(kind===1){r.arcade??={version:1,best:0,total:0,plays:0,medals:0,whiteCoins:0};r.arcade.whiteCoins+=amount;}else add(d,ITEM_NAMES[kind],amount);
 return `${amount.toLocaleString('en-US')} ${ITEM_NAMES[kind]}`;
}
export function feedDragon(r,rng=Math.random,now=new Date()){
 const d=ensureDragon(r,now),cost=feedCost(r,now);if(r.save.bestLevel<50||r.save.coin<cost)return null;
 r.save.coin-=cost;r.save.blueCoin++;d.today++;d.total++;d.knowledge++;
 const list=speeches(r),id=d.discovered[2]===undefined?2:Math.floor(rng()*list.length);d.discovered[id]=(d.discovered[id]??0)+1;d.lastSpeech=list[id];
 d.meter+=now.getDay()===5?2:1;const rewards=[];
 while(d.meter>=feedingRequirement(d.boost)){d.meter-=feedingRequirement(d.boost);if(d.boost<300){d.boost++;rewards.push('+1% Dragon Boost');}else rewards.push(randomReward(r,d,rng));}
 r.boostMax=500+d.boost;return {cost,speech:d.lastSpeech,rewards};
}
export function deservedRewards(level){return level>=9001?13:level>=1000?3+Math.floor(level/1000):level>=500?3:level>=250?2:level>=100?1:0;}
export function claimDragonLevelReward(r){const d=ensureDragon(r);if(d.levelRewards>=deservedRewards(r.save.bestLevel))return null;d.levelRewards++;let text;
 if(d.levelRewards===1){for(const key of ['Idlebot Card','Autoharvest Card','Invincibility Stars Card','Battery Charger Card'])add(d,key,1);text='Idlebot / Autoharvest / Invincibility Stars / Battery Charger Cards';}
 else if(d.levelRewards===2){add(d,'Legendary Boxes',2);text='2 Legendary Boxes';}
 else if(d.levelRewards===3){add(d,'Quest Tokens',5000);text='5,000 Quest Tokens';}
 else{add(d,'Supply Crates',1);text='1 Supply Crate';}return text;
}
export function validDragon(d,bestLevel){
 const int=(n,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
 const names=[...ITEM_NAMES.slice(2),'Idlebot Card','Autoharvest Card','Invincibility Stars Card','Battery Charger Card','Quest Tokens','Supply Crates'];
 return !!d&&d.version===1&&typeof d.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d.day)&&['today','total','knowledge','meter','boost','levelRewards'].every(k=>int(d[k]))&&d.today<=d.total&&d.knowledge===d.total&&d.boost<=300&&d.meter<feedingRequirement(d.boost)&&d.levelRewards<=deservedRewards(bestLevel)&&typeof d.lastSpeech==='string'&&d.lastSpeech.length<2000&&d.discovered&&typeof d.discovered==='object'&&!Array.isArray(d.discovered)&&Object.entries(d.discovered).every(([k,v])=>int(Number(k),SPEECHES.length-1)&&int(v,d.total)&&v>0)&&Object.values(d.discovered).reduce((a,b)=>a+b,0)===d.total&&d.inventory&&typeof d.inventory==='object'&&!Array.isArray(d.inventory)&&Object.entries(d.inventory).every(([k,v])=>names.includes(k)&&int(v));
}
