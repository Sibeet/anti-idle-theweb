import {skillLevel} from './skills.mjs?v=0.22.1';
import {arenaRank,weapon,equipmentTotals} from './equipment.mjs?v=0.22.1';
// Normal-mode baseline restored in frame_5/DoAction.as:5279-5284.
// Rank increments: sprite 5992/frame_1/DoAction_2.as:5725-5738.
const RANK_STATS=[null,{maxHp:500,maxMana:300,attack:100,defense:100,accuracy:50,evasion:50}];
for(let rank=2;rank<=500;rank++){
 const prev=RANK_STATS[rank-1];
 RANK_STATS.push({maxHp:prev.maxHp+250+rank*5,maxMana:prev.maxMana+100+rank*2,attack:prev.attack+25+Math.floor(rank*.5),defense:prev.defense+25+Math.floor(rank*.5),accuracy:prev.accuracy+10+Math.floor(rank*.2),evasion:prev.evasion+10+Math.floor(rank*.2)});
}
export function baseStats(rank){return {...RANK_STATS[Math.max(1,Math.min(500,rank))]};}
export function growthStats(r){const rank=arenaRank(r).rank,stats=baseStats(rank);stats.attack=Math.floor(stats.attack*(1+skillLevel(r,9)*.01));stats.defense=Math.floor(stats.defense*(1+skillLevel(r,9)*.01));stats.accuracy=Math.floor(stats.accuracy*(1+(weapon(r).dexterity||0)/100));const gear=equipmentTotals(r);stats.maxHp=Math.floor(stats.maxHp*(1+gear.health/100));stats.evasion=Math.floor(stats.evasion*(1+gear.evasion/100));if(r.arena?.healBuff>0)stats.defense=Math.floor(stats.defense*(2+skillLevel(r,5)*.1));return {...stats,rank};}
export function settleGrowth(r){
 const a=r.arena,rank=arenaRank(r).rank;
 if(a.growthVersion!==1){a.hp=Math.min(1,a.hp/300)*baseStats(rank).maxHp;a.growthVersion=1;}
 a.rewardedRank??=1;a.skillPoints??=20;a.craftingMaterial??=0;a.battlePoints??=0;
 const rewards={from:a.rewardedRank,to:rank,ranks:0,pixels:0,craft:0,sp:0};
 for(let next=a.rewardedRank+1;next<=rank;next++){rewards.ranks++;rewards.pixels+=100*next*next;rewards.craft+=10*next*next;rewards.sp+=20;}
 a.pixels+=rewards.pixels;a.craftingMaterial+=rewards.craft;a.skillPoints+=rewards.sp;a.battlePoints+=rewards.ranks;a.rewardedRank=rank;
 return rewards;
}
