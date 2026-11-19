// v1853 Feature Shop: sprite 10159/frame 29, button load/release scripts.
export const FEATURES=[
 {id:'idle',name:'Idle Mode',level:2,cost:500},
 {id:'boost',name:'Boost Generator',level:4,cost:2000},
 {id:'garden',name:'Garden',level:12,cost:10000},
 {id:'arena',name:'Battle Arena',level:25,cost:50000},
 {id:'button',name:'Button Machine',level:40,cost:150000},
 {id:'arcade',name:'Arcade',level:80,cost:750000},
 {id:'arcadePack',name:'Arcade Pack',level:0,cost:750,currency:'blueCoin',requires:'arcade'},
];
export const newFeatures=()=>({version:1,...Object.fromEntries(FEATURES.map(f=>[f.id,false]))});
export function validFeatures(f){return !!f&&f.version===1&&FEATURES.every(x=>typeof f[x.id]==='boolean'||['arcadePack','button'].includes(x.id)&&f[x.id]===undefined);}
export function owns(r,id){return r.features?.[id]===true;}
export function buyFeature(r,id){const f=FEATURES.find(f=>f.id===id);if(!f||owns(r,id)||r.save.level<f.level||r.save[f.currency??'coin']<f.cost||f.requires&&!owns(r,f.requires))return false;r.features[id]=true;r.save[f.currency??'coin']-=f.cost;if(id==='boost')r.save.featureBoostGen=true;return true;}
export function migrateFeatures(r,old){
 const f=newFeatures();f.idle=old.save?.idleMode===true;f.boost=(old.save?.boostPurchased??0)>0||old.save?.boost>100;
 f.arena=(old.arena?.kills??0)>0||(old.arena?.xp??0)>0||(old.arena?.zone??0)>0;
 f.garden=(old.garden?.harvests??0)>0||(old.garden?.capacity??1)>1||old.garden?.plots?.some(Boolean)===true;
 f.arcade=Object.values(old.arcade??{}).some(x=>x&&typeof x==='object'&&x.plays>0)||(old.arcade?.plays??0)>0;
 f.arcadePack=['mind','balance','mmrx'].some(id=>(old.arcade?.[id]?.plays??0)>0);
 return f;
}
