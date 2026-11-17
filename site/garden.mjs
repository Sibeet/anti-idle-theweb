import {TREES} from './garden-data.mjs';
import {awardExperience} from './game.mjs';
export {TREES};
const POINT_COST=[0,50,150,300,500,750,1000,1250,1500,1750,2000,2500,3000,3500,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000];
export function ensureGarden(r){return r.garden??={version:1,capacity:1,points:0,exp:0,harvests:0,totalCoin:0,slotExp:Array(25).fill(0),plots:Array(25).fill(null),lastSeen:0};}
const treeFor=id=>TREES.find(t=>t.id===id);
export function gardenTime(r,now=Date.now()){const g=ensureGarden(r);g.lastSeen=Math.max(g.lastSeen,Number.isFinite(now)?now:0);return g.lastSeen;}
export function advanceGarden(r,now=Date.now()){const g=ensureGarden(r),time=gardenTime(r,now),expired=[];for(let i=0;i<g.capacity;i++)if(g.plots[i]&&time>=g.plots[i].expiresAt){g.plots[i]=null;expired.push(i);}return expired;}
export function slotState(r,index,now=Date.now()){
 const g=ensureGarden(r);if(!Number.isInteger(index)||index<0||index>=g.capacity)return {state:'locked'};
 const p=g.plots[index],time=Math.max(g.lastSeen,now);if(!p||time>=p.expiresAt)return {state:'empty'};
 const t=treeFor(p.tree);return {state:time>=p.readyAt?'ready':'growing',tree:t,plot:p,remaining:Math.max(0,p.readyAt-time),life:Math.max(0,p.expiresAt-time),progress:Math.max(0,Math.min(1,1-(p.readyAt-time)/(t.grow*1000)))};
}
export function canPlant(r,id){const t=treeFor(id),g=ensureGarden(r);return !!t&&r.save.coin>=t.coin&&r.save.greenCoin>=t.green&&r.save.blueCoin>=t.blue&&g.points>=t.points;}
export function plantTree(r,index,id,now=Date.now(),rng=Math.random){
 const g=ensureGarden(r);advanceGarden(r,now);if(slotState(r,index,now).state!=='empty'||!canPlant(r,id))return false;
 const t=treeFor(id),time=gardenTime(r,now);let grade=Math.floor(Math.sqrt(g.slotExp[index]/1000))+1;if(grade>11)grade=g.slotExp[index]>=index*100000+600000?12:11;
 r.save.coin-=t.coin;r.save.greenCoin-=t.green;r.save.blueCoin-=t.blue;g.points-=t.points;
 g.plots[index]={tree:id,plantedAt:time,readyAt:time+t.grow*1000,expiresAt:time+t.life*1000,value:Math.floor(t.value*(.95+grade*.1+rng()*.1))};return true;
}
export function harvestTree(r,index,now=Date.now()){
 const g=ensureGarden(r);advanceGarden(r,now);const state=slotState(r,index,now);if(state.state!=='ready')return null;
 const t=state.tree,p=state.plot,multiplier=Math.floor(Math.pow(r.save.level,.6))/10+6.5;
 const coin=Math.floor(p.value*multiplier),exp=Math.floor(p.value*multiplier*.3),green=Math.ceil(250+t.exp*50),blue=t.id===1?1:Math.ceil(.5+t.exp*.1);
 r.save.coin+=coin;r.save.greenCoin+=green;r.save.blueCoin+=blue;const levels=awardExperience(r,exp);
 g.points+=t.exp;g.exp+=t.exp;g.slotExp[index]+=t.exp;g.harvests++;g.totalCoin+=coin;p.readyAt=gardenTime(r,now)+t.grow*1000;
 return {tree:t.name,coin,exp,green,blue,points:t.exp,levels};
}
export function harvestAll(r,now=Date.now()){const results=[];for(let i=0;i<ensureGarden(r).capacity;i++){const result=harvestTree(r,i,now);if(result)results.push(result);}return results;}
export function plantAll(r,id,now=Date.now(),rng=Math.random){let count=0;for(let i=0;i<ensureGarden(r).capacity;i++)if(plantTree(r,i,id,now,rng))count++;return count;}
export function clearTree(r,index){const g=ensureGarden(r);if(!Number.isInteger(index)||index<0||index>=g.capacity||!g.plots[index])return false;g.plots[index]=null;return true;}
export function plotCost(r){const n=ensureGarden(r).capacity;return n<25?{coin:n*n*500000,points:POINT_COST[n]}:null;}
export function buyPlot(r){const g=ensureGarden(r),cost=plotCost(r);if(!cost||r.save.coin<cost.coin||g.points<cost.points)return false;r.save.coin-=cost.coin;g.points-=cost.points;g.capacity++;return true;}
export function validGarden(g){
 const integer=(n,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
 if(!g||g.version!==1||!integer(g.capacity,1,25)||!integer(g.lastSeen)||!['points','exp','harvests','totalCoin'].every(k=>integer(g[k]))||!Array.isArray(g.slotExp)||g.slotExp.length!==25||!g.slotExp.every(n=>integer(n))||!Array.isArray(g.plots)||g.plots.length!==25)return false;
 return g.plots.every((p,i)=>{if(p===null)return true;if(i>=g.capacity||!p||!treeFor(p.tree))return false;const t=treeFor(p.tree);return ['plantedAt','readyAt','expiresAt','value'].every(k=>integer(p[k]))&&p.value>=Math.floor(t.value*1.05)&&p.value<=Math.ceil(t.value*2.25)&&p.expiresAt===p.plantedAt+t.life*1000&&p.readyAt>=p.plantedAt+t.grow*1000&&p.readyAt<=g.lastSeen+t.grow*1000&&p.plantedAt<=g.lastSeen;});
}
