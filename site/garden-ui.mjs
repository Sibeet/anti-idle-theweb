import {TREES,ensureGarden,advanceGarden,slotState,canPlant,plantTree,harvestTree,harvestAll,plantAll,clearTree,plotCost,buyPlot} from './garden.mjs';
import {GARDEN_ART} from './garden-art.mjs';
export function createGardenUI({getRoot,save,log,toast,refresh}){
 const $=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('en-US');let removeMode=false,lastSignature='';
 const time=ms=>{const n=Math.max(0,Math.ceil(ms/1000));return n>=3600?Math.floor(n/3600)+'h '+Math.floor(n%3600/60)+'m':Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
 $('gardenSeed').innerHTML=TREES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
 const selected=()=>TREES.find(t=>t.id===Number($('gardenSeed').value))||TREES[0];
 function harvestResult(result){if(!result)return;log(result.tree+' harvested! +'+fmt(result.coin)+' Y | +'+result.points+' Garden Points');if(result.levels)toast('LEVEL UP! Lv. '+getRoot().save.level);}
 function changed(){save();lastSignature='';refresh();}
 $('gardenSeed').onchange=()=>{removeMode=false;lastSignature='';render();};
 $('gardenPlots').onclick=event=>{const b=event.target.closest('button[data-plot]');if(!b)return;const index=Number(b.dataset.plot),r=getRoot(),state=slotState(r,index);
 if(removeMode){if(clearTree(r,index)){log('Garden plot '+(index+1)+' cleared.');changed();}return;}
 if(state.state==='ready'){const result=harvestTree(r,index);if(result){harvestResult(result);changed();}}
 else if(state.state==='empty'&&plantTree(r,index,selected().id)){log(selected().name+' planted in plot '+(index+1)+'.');changed();}
 };
 $('gardenPlantAll').onclick=()=>{const count=plantAll(getRoot(),selected().id);if(count){log(count+' trees planted.');changed();}};
 $('gardenHarvestAll').onclick=()=>{const results=harvestAll(getRoot());if(results.length){const coins=results.reduce((sum,r)=>sum+r.coin,0);log('Harvested '+results.length+' trees! +'+fmt(coins)+' Y');if(results.some(r=>r.levels))toast('LEVEL UP! Lv. '+getRoot().save.level);changed();}};
 $('gardenRemoveMode').onclick=()=>{removeMode=!removeMode;lastSignature='';render();};
 $('gardenBuyPlot').onclick=()=>{if(buyPlot(getRoot())){log('Garden plot '+getRoot().garden.capacity+' unlocked!');changed();}};
 function render(){
 const r=getRoot(),g=ensureGarden(r),now=Date.now();const expired=advanceGarden(r,now);if(expired.length){log(expired.length+' Garden trees expired.');save();}
 const states=Array.from({length:25},(_,i)=>slotState(r,i,now)),ready=states.filter(s=>s.state==='ready').length,t=selected();
 for(const b of document.querySelectorAll('[data-tab]'))if(b.dataset.tab==='garden')b.textContent=ready?'Garden · '+ready:'Garden';
 $('gardenPoints').textContent=fmt(g.points);$('gardenExp').textContent=fmt(g.exp);$('gardenCapacity').textContent=g.capacity+' / 25';$('gardenHarvests').textContent=fmt(g.harvests);
 $('gardenSeedName').textContent=t.name;$('gardenSeedGrow').textContent=time(t.grow*1000);$('gardenSeedLife').textContent=time(t.life*1000);$('gardenSeedValue').textContent=fmt(t.value)+' Y';$('gardenSeedExp').textContent='+'+t.exp+' GP / EXP';
 const costs=[t.coin?fmt(t.coin)+' Y':'',t.green?fmt(t.green)+' G':'',t.blue?fmt(t.blue)+' B':'',t.points?fmt(t.points)+' GP':''].filter(Boolean);$('gardenSeedCost').textContent=costs.length?costs.join(' + '):'FREE';
 const preview=GARDEN_ART['ready'+t.id];$('gardenPreview').parentElement.setAttribute('viewBox',preview.crop);$('gardenPreview').setAttribute('href',preview.src);$('gardenPreview').setAttribute('width',preview.width);$('gardenPreview').setAttribute('height',preview.height);
 $('gardenHarvestAll').disabled=ready===0;$('gardenPlantAll').disabled=!canPlant(r,t.id)||!states.some(s=>s.state==='empty');$('gardenRemoveMode').classList.toggle('selected',removeMode);$('gardenRemoveMode').textContent=removeMode?'Clear mode ON':'Clear mode';$('gardenRemoveMode').setAttribute('aria-pressed',String(removeMode));
 const cost=plotCost(r);$('gardenBuyPlot').textContent=cost?'Unlock plot · '+fmt(cost.coin)+' Y + '+fmt(cost.points)+' GP':'All plots unlocked';$('gardenBuyPlot').disabled=!cost||r.save.coin<cost.coin||g.points<cost.points;
 const signature=JSON.stringify([g.plots,g.slotExp,g.capacity,t.id,removeMode,Math.floor(now/1000),canPlant(r,t.id)]);if(signature===lastSignature)return;lastSignature=signature;
 $('gardenPlots').innerHTML=states.map((s,i)=>{
 const occupied=s.state==='growing'||s.state==='ready',action=removeMode&&occupied?'CLEAR':s.state==='ready'?'HARVEST':s.state==='empty'?'PLANT':s.state==='locked'?'LOCKED':time(s.remaining),disabled=s.state==='locked'||!removeMode&&s.state==='growing'||!removeMode&&s.state==='empty'&&!canPlant(r,t.id);
 const art=occupied?GARDEN_ART[(s.state==='ready'?'ready':'growing')+s.tree.id]:null;
 const graphic=art?`<svg class="garden-tree" viewBox="${art.crop}" aria-hidden="true"><image href="${art.src}" width="${art.width}" height="${art.height}"/></svg>`:'';
 return `<button class="garden-plot ${s.state} ${removeMode&&occupied?'remove-target':''}" data-plot="${i}" ${disabled?'disabled':''} aria-label="Plot ${i+1}: ${occupied?s.tree.name+', ':''}${action}" title="${occupied?'Expires in '+time(s.life):'Plot '+(i+1)}"><b>${String(i+1).padStart(2,'0')}</b><img class="plot-ground" src="assets/garden-plot.png" alt="">${graphic}<span>${action}</span>${occupied?`<small>${s.state==='ready'?time(s.life)+' left':Math.floor(s.progress*100)+'%'}</small>`:''}</button>`;
 }).join('');
 }
 return {render};
}
