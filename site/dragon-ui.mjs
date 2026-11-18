import {FEATURES,owns,buyFeature} from './features.mjs?v=0.20.0';
import {ensureDragon,feedCost,feedDragon,feedingRequirement,speeches,claimDragonLevelReward,deservedRewards} from './dragon.mjs?v=0.20.0';
export function createDragonUI({getRoot,save,log,refresh,openShop}){
 const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('en-US');let book=false,signature='';
 $('featureShopList').innerHTML=FEATURES.map(f=>`<article class="feature-card"><div><strong>${f.name}</strong><span>${f.requires?'Requires Arcade':'Lv. '+f.level} · ${f.currency?'B':'Y'} ${fmt(f.cost)}</span></div><button id="unlock${f.id}" data-unlock="${f.id}">Buy</button></article>`).join('');
 for(const f of FEATURES)$('unlock'+f.id).onclick=()=>{if(buyFeature(getRoot(),f.id)){log(f.name+' unlocked!');save();refresh();}};
 $('dragonFeed').onclick=()=>{const result=feedDragon(getRoot());if(result){log('Dragon fed! −'+fmt(result.cost)+' Y · +1 B');for(const reward of result.rewards)log(reward);save();refresh();}};
 $('dragonLevelReward').onclick=()=>{const reward=claimDragonLevelReward(getRoot());if(reward){log('Dragon reward: '+reward);save();refresh();}};
 $('dragonBook').onclick=()=>{book=!book;refresh();};$('dragonShop').onclick=openShop;
 function render(){
  const r=getRoot(),d=ensureDragon(r),cost=feedCost(r),list=speeches(r);
  for(const f of FEATURES){const b=$('unlock'+f.id),owned=owns(r,f.id);b.textContent=owned?'Owned':f.requires&&!owns(r,f.requires)?'Requires Arcade':r.save.level<f.level?'Lv. '+f.level:'Buy · '+(f.currency?'B':'Y')+' '+fmt(f.cost);b.disabled=owned||r.save.level<f.level||r.save[f.currency??'coin']<f.cost||!!f.requires&&!owns(r,f.requires);}
  $('dragonSpeech').textContent=d.lastSpeech||(r.save.bestLevel<50?'Welcome to Anti-Idle: The Game!':'Hello! I am the Dragon of Wisdom. I know many things that you don’t, but I’m really hungry for food. So, feed me!');
  const next=FEATURES.find(f=>!owns(r,f.id));$('dragonTask').textContent=next?(r.save.level<next.level?'Reach Lv. '+next.level:'Visit the Feature Shop')+' · '+next.name:'Feed the Dragon of Wisdom';
  $('dragonFeed').textContent=r.save.bestLevel<50?'Feed · Lv. 50':'Feed · Y '+fmt(cost);$('dragonFeed').disabled=r.save.bestLevel<50||r.save.coin<cost;
  $('dragonToday').textContent=fmt(d.today);$('dragonTotal').textContent=fmt(d.total);$('dragonKnowledge').textContent=fmt(d.knowledge);$('dragonBoost').textContent='+'+d.boost+'%';$('dragonMeterText').textContent=d.meter+' / '+feedingRequirement(d.boost);$('dragonMeter').style.width=d.meter/feedingRequirement(d.boost)*100+'%';
  const thresholds=[100,250,500,1000,2000,3000,4000,5000,6000,7000,8000,9000,9001];$('dragonLevelReward').disabled=d.levelRewards>=deservedRewards(r.save.bestLevel);$('dragonLevelReward').textContent=$('dragonLevelReward').disabled?'Level Reward · '+(thresholds[d.levelRewards]?'Lv. '+fmt(thresholds[d.levelRewards]):'Complete'):'Claim Level Reward';
  $('dragonBookPanel').classList.toggle('hidden',!book);$('dragonBook').textContent='Book of Wisdom · '+Object.keys(d.discovered).length+' / '+list.length;
  const sig=JSON.stringify([d.discovered,d.inventory,list.length]);if(sig!==signature){signature=sig;$('dragonBookEntries').replaceChildren(...Object.entries(d.discovered).map(([id,n])=>{const el=document.createElement('li');el.textContent=list[id]+' ×'+n;return el;}));$('dragonInventory').replaceChildren(...Object.entries(d.inventory).map(([name,n])=>{const el=document.createElement('li');el.textContent=name+' · '+fmt(n);return el;}));}
 }
 return {render};
}
