import {ensureArcade} from './arcade.mjs?v=0.20.0';
import {startMath,stepMath,answerMath,finishMath} from './math-master.mjs?v=0.20.0';
export function createMathUI({getRoot,save,log,refresh,isActive}){
 const $=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('en-US');let owner=getRoot(),game=null,last=performance.now(),result=null;
 function settle(){if(!game||game.settled)return;result=finishMath(getRoot(),game);save();log('Math Master: '+fmt(result.score)+' | +'+fmt(result.coin)+' Y / +'+fmt(result.exp)+' EXP');}
 function update(){const now=performance.now();if(owner!==getRoot()){owner=getRoot();game=null;result=null;}else if(game?.running){stepMath(game,(now-last)/1000);if(!game.running)settle();}last=now;}
 $('mathStart').onclick=()=>{if(game?.running)return;game=startMath();last=performance.now();result=null;refresh();};$('mathEnd').onclick=()=>{settle();refresh();};
 function answer(i){update();if(game&&answerMath(getRoot(),game,i)){if(!game.running)settle();refresh();}}
 for(let i=0;i<4;i++)$('mathAnswer'+i).onclick=()=>answer(i);
 function handleKey(e){if(!isActive()||!game?.running||e.repeat||e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;const key=Number(e.key);if(key>=1&&key<=4){e.preventDefault();answer(key-1);}}
 function render(){update();const a=ensureArcade(getRoot()),record=a.math;$('mathBest').textContent=fmt(record?.best??0);$('mathPlays').textContent=fmt(record?.plays??0);$('mathScore').textContent=fmt(game?.score??0);$('mathCorrect').textContent=fmt(game?.correct??0);$('mathMultiplier').textContent=(game?.multiplier??1)+'×';$('mathTime').textContent=(game?.time??60).toFixed(1)+'s';$('mathPower').style.width=Math.min(100,game?.power??0)+'%';$('mathQuestion').textContent=game?.question.text??'MATH MASTER';$('mathStart').disabled=!!game?.running;$('mathEnd').disabled=!game?.running;
 for(let i=0;i<4;i++){const b=$('mathAnswer'+i),choice=game?.question.choices[i];b.textContent=choice===undefined?'—':String(choice)+' ['+(i+1)+']';b.disabled=!game?.running||choice===undefined;}
 $('mathMessage').textContent=result?'FINISH · +'+fmt(result.coin)+' Y · +'+fmt(result.exp)+' EXP · +'+fmt(result.green)+' G · +'+fmt(result.blue)+' B':game?.message??'60 SECONDS';
 $('mathHistory').innerHTML=(game?.history??[]).map(h=>`<div><span>${h.text.replaceAll('<','&lt;')}</span><b>${h.seconds.toFixed(2)}s · +${fmt(h.score)}</b></div>`).join('');}
 return {render,handleKey,running:()=>!!game?.running};
}
