import {awardExperience} from './game.mjs?v=0.23.0';
import {gainBoost} from './core.mjs?v=0.23.0';
import {owns} from './features.mjs?v=0.23.0';
const localDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const GRADE=['','MISS','HIT','GOOD','NICE','GREAT','EXCELLENT!','PERFECT!'];
export const GRANDPA_COSTS=[0,3000000,15000000,75000000,300000000,1500000000,7500000000,30000000000,150000000000,750000000000,3000000000000,Infinity];
export function ensureButtonMachine(r,now=new Date()){
 const d=r.buttonMachine??={version:1,day:localDay(now),presses:0,today:0,perfect:0,purple:0,maxCombo:0,breaks:0,broken:false,blessing:0,multiplierBonus:0,grandpas:0,speed:1,accuracy:1,discipline:1,grandpaPress:0,potions:0,inventory:{}};
 const today=localDay(now);if(today>d.day){d.day=today;d.today=0;}return d;
}
export function createButtonSession(r,rng=Math.random){const d=ensureButtonMachine(r);const x=d.presses?Math.floor(rng()*50)-Math.floor(rng()*50):0;return {x,previousX:x,speed:0,dir:1,cooldown:2,life:5000,combo:0,comboAge:0,score:0,chain:0};}
export function buttonMultiplier(r,s,shift=false){const d=ensureButtonMachine(r);let m=100+Math.min(500,Math.floor(Math.sqrt(d.today)))+Math.min(2500,Math.floor(Math.sqrt(d.presses*.5)))+Math.min(500,Math.floor(Math.sqrt(s.combo*10)))+d.multiplierBonus;if(shift)m=Math.floor(m*.6);if(d.today>1000000)m=Math.floor(m*.2);if(d.blessing>0)m=Math.floor(m*2);return m;}
export function buttonGrade(x,y,s){const perfection=Math.max(10,Math.ceil(100-Math.hypot(x-s.x,y)*2));return {perfection,rank:perfection>=99?7:perfection>=97?6:perfection>=94?5:perfection>=89?4:perfection>=79?3:2};}
export const targetContains=(s,x,y)=>Number.isFinite(x)&&Number.isFinite(y)&&Math.hypot(x-s.x,y)<=51;
function whiteCoins(r,n){r.arcade??={version:1,best:0,total:0,plays:0,medals:0,whiteCoins:0};r.arcade.whiteCoins+=n;}
export function pressButton(r,s,x,y,{shift=false,rng=Math.random,now=new Date()}={}){
 if(!owns(r,'button')||!Number.isFinite(x)||!Number.isFinite(y))return null;
 const d=ensureButtonMachine(r,now);if(d.broken)return null;
 if(!targetContains(s,x,y)){s.combo=0;return {rank:1,perfection:0,exp:0,coin:0,green:0,blue:0,purple:0,levels:0};}
 if(s.cooldown>0)return null;
 const {rank,perfection}=buttonGrade(x,y,s),mult=buttonMultiplier(r,s,shift);
 s.cooldown=shift?(d.today>50000?7:d.today>10000?6:d.today>2500?5:d.today>500?4:3):3;
 s.life-=100-perfection;d.presses++;d.today++;s.combo+=rank-1;s.comboAge=0;s.score+=rank-1;s.speed=2.3+rng()*.7;
 const reward=Math.floor(Math.pow(r.save.level*perfection*rank,.6)*mult/100);
 let exp=Math.floor(reward*r.save.boost/100*.18),coin=Math.floor(reward*r.save.boost/100*.05);
 if(d.blessing>0)d.blessing--;if(d.today>=250000){exp=Math.floor(exp*.1);coin=Math.floor(coin*.1);}
 const penalty=r.save.permaBanPenalty?.[24]??0;if(penalty)exp=Math.floor(exp*([1,1.8,2.2,3][penalty]??1));
 let green=rank===4?10:rank===5?50:rank===6?250:0,blue=rank===6&&d.today<250000&&rng()<.5?1:0,purple=0,boost=0;
 if(rank===7){s.chain++;d.perfect++;if(s.chain>15){exp=1;coin=1;s.combo=0;}else{const before=r.save.boost;gainBoost(r,1,3);boost=r.save.boost-before;purple=1;green=1000;blue=d.today<250000?2:0;}}else s.chain=0;
 d.purple+=purple;d.maxCombo=Math.max(d.maxCombo,s.combo);r.save.coin+=coin;r.save.greenCoin+=green;r.save.blueCoin+=blue;const levels=awardExperience(r,exp),drops=[];
 if(s.life<=0){s.life=0;d.broken=true;d.breaks++;if(d.today<250000&&s.score<20000){const white=Math.ceil(s.score/500);whiteCoins(r,white);if(white)drops.push(`${white} White Coins`);for(const [i,name] of ['Explosion Crate','Awesome Crate','Chaos Crate','Legendary Box'].entries())if(rng()<s.score/[750,1500,3000,6000][i]-1){d.inventory[name]=(d.inventory[name]??0)+1;drops.push(name);}}}
 return {rank,perfection,exp,coin,green,blue,purple,boost,levels,broke:d.broken,drops};
}
export function stepButtonSession(s){s.previousX=s.x;s.cooldown=Math.max(0,s.cooldown-1);s.x+=s.speed*s.dir;s.speed*=.7;if(Math.abs(s.speed)<.5)s.speed=0;if(s.x>190){s.x=190;s.dir=-1;}if(s.x< -190){s.x=-190;s.dir=1;}s.comboAge++;if(s.comboAge>=75)s.combo=0;}
export function buttonRepairCost(r){const d=ensureButtonMachine(r);return Math.min(2000000,Math.floor((Math.ceil(Math.sqrt(r.save.level)*(d.broken?500:5000))+(d.broken?2564:25631))/25)*100);}
export function repairButton(r,s){if(!owns(r,'button'))return false;const cost=buttonRepairCost(r);if(r.save.coin<cost)return false;r.save.coin-=cost;const d=ensureButtonMachine(r);const broken=d.broken;d.broken=false;s.life=5000;s.score=0;if(broken){s.chain=0;s.combo=0;s.cooldown=2;s.speed=0;}return true;}
export function grandpaCost(r){const n=ensureButtonMachine(r).grandpas;return n>=20?Infinity:Math.round(2**(n+1)+(n+1)**4+(n+1)**2+Math.max(0,2**(n-9)));}
export function buyButtonUpgrade(r,id){if(!owns(r,'button'))return false;const d=ensureButtonMachine(r);let field,currency='purple',cost,limit=Number.MAX_SAFE_INTEGER,amount=1;
 if(id==='multiplier'){field='multiplierBonus';cost=200;limit=1200;amount=2;}else if(id==='blessing'){field='blessing';cost=500;amount=2000;}else if(id==='potion'){field='potions';cost=250;limit=9999;}else if(id==='grandpa'){field='grandpas';cost=grandpaCost(r);limit=20;}else if(['speed','accuracy','discipline'].includes(id)){field=id;currency=id==='discipline'?'greenCoin':'coin';cost=GRANDPA_COSTS[d[id]]/(id==='discipline'?1000:1);limit=11;}else return false;
 const wallet=currency==='purple'?d:r.save;if(d[field]>=limit||wallet[currency]<cost)return false;wallet[currency]-=cost;d[field]+=amount;return true;
}
export function useButtonPotion(r){const d=ensureButtonMachine(r);if(!owns(r,'button')||d.potions<1||r.save.boost>=r.boostMax*1.5-1)return false;d.potions--;gainBoost(r,9999,3);return true;}
export function grandpaSecond(r,active,rng=Math.random,now=new Date()){
 if(!owns(r,'button'))return null;const d=ensureButtonMachine(r,now),factor=active?1:d.discipline*.02,rate=d.speed*.01*factor,accuracy=d.accuracy*.04*factor,mult=100+Math.min(2500,Math.floor(Math.sqrt(d.presses*.5)))+d.multiplierBonus;
 let clicks=0,exp=0,coin=0,green=0,blue=0,purple=0;
 for(let i=0;i<d.grandpas;i++)if(rng()<rate){let rank=4,perfection=89;if(rng()<accuracy){rank=6;perfection=97;if(rng()<.25){rank=7;perfection=99;}}else if(rng()<.5){rank=5;perfection=94;}
  clicks++;d.presses++;d.grandpaPress++;const reward=Math.floor(Math.pow(r.save.level*perfection*rank,.6)*mult/100);exp+=Math.floor(reward*r.save.boost/100*.175);coin+=Math.floor(reward*r.save.boost/100*.05);green+={4:10,5:50,6:250,7:1000}[rank];blue+=rank===6?1:rank===7?2:0;if(rank===7){d.perfect++;d.purple++;purple++;}}
 if(!clicks)return null;r.save.coin+=coin;r.save.greenCoin+=green;r.save.blueCoin+=blue;const levels=awardExperience(r,exp);return {clicks,exp,coin,green,blue,purple,levels};
}
export function validButtonMachine(d){const int=(x,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(x)&&x>=min&&x<=max;return !!d&&d.version===1&&typeof d.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d.day)&&['presses','today','perfect','purple','maxCombo','breaks','blessing','grandpaPress','potions'].every(k=>int(d[k]))&&d.today<=d.presses-d.grandpaPress&&d.perfect<=d.presses&&d.grandpaPress<=d.presses&&typeof d.broken==='boolean'&&int(d.multiplierBonus,0,1200)&&d.multiplierBonus%2===0&&int(d.grandpas,0,20)&&['speed','accuracy','discipline'].every(k=>int(d[k],1,11))&&d.potions<=9999&&d.inventory&&typeof d.inventory==='object'&&!Array.isArray(d.inventory)&&Object.entries(d.inventory).every(([k,v])=>['Explosion Crate','Awesome Crate','Chaos Crate','Legendary Box'].includes(k)&&int(v));}
