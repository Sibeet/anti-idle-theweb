// Runs the real app module with a small DOM adapter. It checks event wiring, not browser layout.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame} from '../site/game.mjs';
import {ensureArena} from '../site/combat.mjs';
import {settleGrowth} from '../site/growth.mjs';
const ids=new Map(),nodes=[],listeners={};let raf;const domWrites={attributes:0,progress:0,byId:{}};
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.attrs={...attrs};this.dataset={};for(const [k,v] of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.id=attrs.id;this.value=attrs.value??'';this.textContent='';this.disabled=false;this.children=[];this.options=[];this.style=new Proxy({setProperty(){}},{set:(target,key,value)=>{if(this.id==='progressFill'&&key==='height')domWrites.progress++;target[key]=value;return true;}});this.classes=new Set((attrs.class??'').split(' '));this.classList={contains:x=>this.classes.has(x),add:(...x)=>x.forEach(x=>this.classes.add(x)),remove:(...x)=>x.forEach(x=>this.classes.delete(x)),toggle:(x,force)=>{const on=force===undefined?!this.classes.has(x):force;if(on)this.classes.add(x);else this.classes.delete(x);return on;}};this.parentElement={setAttribute(){}};nodes.push(this);if(this.id)ids.set(this.id,this);}
 setAttribute(k,v){domWrites.attributes++;domWrites.byId[this.id]=(domWrites.byId[this.id]??0)+1;this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}
 set innerHTML(html){this.html=html;parse(html);if(this.tagName==='SELECT'){this.options=[...html.matchAll(/<option\b([^>]*)>([^<]*)/g)].map(m=>{const e=new Element('option',attributes(m[1]));e.textContent=m[2];return e;});this.value=this.options[0]?.value??'';}}
 get innerHTML(){return this.html??'';}
 querySelector(selector){if(selector==='b')return this.bold??=new Element('b');return query(selector);}
 append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}remove(){}click(){this.onclick?.({target:this});}
 closest(selector){if(selector==='button'||selector.startsWith('button['))return this.tagName==='BUTTON'?this:null;return this;}
}
function attributes(s){return Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));}
function parse(html){for(const m of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi))new Element(m[1],attributes(m[2]));for(const m of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/g)){const id=attributes(m[1]).id;if(id)ids.get(id).innerHTML=m[2];}}
function query(selector){if(selector.startsWith('.'))return nodes.find(n=>n.classes.has(selector.slice(1)));const filters=[...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];return nodes.find(n=>filters.length&&filters.every(m=>m[2]===undefined?m[1] in n.attrs:n.attrs[m[1]]===m[2]));}
parse(readFileSync(new URL('../site/index.html',import.meta.url),'utf8'));
globalThis.document={getElementById:id=>ids.get(id)??null,createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),querySelector:query,querySelectorAll:selector=>selector==='[data-tab]'?nodes.filter(n=>'tab' in n.dataset):[]};
const data=new Map();globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
globalThis.addEventListener=(event,fn)=>listeners[event]=fn;globalThis.requestAnimationFrame=fn=>raf=fn;globalThis.setInterval=()=>1;globalThis.setTimeout=()=>1;globalThis.clearTimeout=()=>{};
const fixture=newGame();ensureArena(fixture);fixture.arena.xp=60000;settleGrowth(fixture);fixture.progPercent=100;fixture.save.level=50;fixture.save.bestLevel=50;fixture.arena.hp=1000;
for(const id of ['arena','garden','arcade','idle','boost','arcadePack'])fixture.features[id]=true;fixture.save.featureBoostGen=true;
localStorage.setItem('anti-idle-web-prototype-v1',JSON.stringify(fixture));
if(process.env.FEATURE_GATE_TEST==='1'){
 const fresh=newGame();localStorage.setItem('anti-idle-web-prototype-v1',JSON.stringify(fresh));globalThis.location={hash:'#arcade'};
}
await import('../site/app.mjs');
if(process.env.PRINTER_TEST==='1'){
 const r=newGame();r.save.level=r.save.bestLevel=60;r.save.coin=1000000;r.save.greenCoin=4;r.save.blueCoin=750;r.printer={version:1,level:1,charge:80,progress:99.99,prints:0,criticals:0,totalMoney:0,totalCharge:0,lastCoin:0,lastGreen:0,lastBlue:0};
 await ids.get('importFile').onchange({target:{files:[{size:20000,text:async()=>JSON.stringify(r)}],value:''}});
 nodes.find(n=>n.dataset.tab==='printer').click();assert.equal(ids.get('shop').classes.has('hidden'),false);ids.get('unlockprinter').click();ids.get('unlocksuperBattery').click();nodes.find(n=>n.dataset.tab==='printer').click();ids.get('printerCharge').click();ids.get('printerUpgrade').click();assert.equal(ids.get('printerLevel').textContent,'2');assert.equal(ids.get('printerBattery').textContent,'200');
 nodes.find(n=>n.dataset.tab==='dragon').click();let now=performance.now();now+=25;raf(now);ids.get('saveButton').click();let saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(saved.printer.prints,1);assert.equal(saved.printer.charge,195);assert.equal(ids.get('dragon').classes.has('hidden'),false);
 ids.get('quickPrinterCharge').click();ids.get('saveButton').click();saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(saved.printer.charge,200);assert.ok(saved.save.greenCoin>=0);assert.equal(ids.get('dragon').classes.has('hidden'),false);
 console.log('PASS: actual printer Feature Shop purchase, Super Battery dependency, recharge/upgrade, background print/save and remote battery without leaving Dragon.');process.exit(0);
}
if(process.env.BUTTON_MACHINE_TEST==='1'){
 const r=newGame();r.save.level=r.save.bestLevel=40;r.features.button=true;r.save.coin=300000;
 await ids.get('importFile').onchange({target:{files:[{size:20000,text:async()=>JSON.stringify(r)}],value:''}});
 nodes.find(n=>n.dataset.tab==='button').click();assert.equal(ids.get('button').classes.has('hidden'),false);
 let now=performance.now();globalThis.performance={now:()=>now};for(let i=0;i<4;i++){now+=25;raf(now);}
 const field=ids.get('machineField');field.getBoundingClientRect=()=>({left:0,top:0,width:500,height:150});field.onclick({detail:1,clientX:250,clientY:75});
 assert.ok(ids.get('machineResult').textContent.startsWith('PERFECT!'));assert.equal(ids.get('machinePurple').textContent,'1');
 ids.get('barButton').click();assert.equal(ids.get('button').classes.has('hidden'),false);
 nodes.find(n=>n.dataset.tab==='dragon').click();nodes.find(n=>n.dataset.tab==='button').click();assert.equal(ids.get('machineTotal').textContent,'1');
 console.log('PASS: actual Button Machine tab, pointer coordinates, Perfect feedback, saved rewards, shared progress bar and reentry.');process.exit(0);
}
if(process.env.RENDER_BENCHMARK==='1'){domWrites.attributes=0;domWrites.progress=0;domWrites.byId={};let now=performance.now();for(let i=0;i<120;i++)raf(now+i*1000/60);assert.equal(domWrites.byId.mmrxNote0??0,0,'hidden MMRX must not repaint');assert.equal(domWrites.byId.mindCell0??0,0,'hidden MindSweeper must not repaint');assert.ok(domWrites.progress>=120,'progress fill must draw on every animation frame');assert.ok(domWrites.attributes<1000,'idle Dragon should not repaint all game boards');console.log(JSON.stringify({frames:120,progressDraws:domWrites.progress,attributeWrites:domWrites.attributes,hiddenMmrX:domWrites.byId.mmrxNote0??0,hiddenMind:domWrites.byId.mindCell0??0}));process.exit(0);}
if(process.env.BAR_INPUT_TEST==='1'){
 const r=newGame();r.features.arcade=true;r.progPercent=99.99;
 await ids.get('importFile').onchange({target:{files:[{size:20000,text:async()=>JSON.stringify(r)}],value:''}});
 nodes.find(n=>n.dataset.tab==='arcade').click();
 const bar=ids.get('barButton'),saved=()=>{ids.get('saveButton').click();return JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));};
 let now=performance.now();const advance=n=>{for(let i=0;i<n;i++){now+=250;raf(now);}};
 bar.onpointerenter({pointerType:'mouse'});assert.equal(saved().save.rewardClaim,0,'entering before full must not pay');advance(1);assert.equal(saved().save.rewardClaim,1,'bar filling under stationary cursor must pay');assert.equal(ids.get('arcade').classes.has('hidden'),false,'hover must preserve content');
 bar.click();assert.equal(saved().save.rewardClaim,1,'click after hover must not double pay');
 advance(20);assert.ok(saved().save.rewardClaim>=2,'remaining hovered can claim the next full bar');bar.onpointerleave();const count=saved().save.rewardClaim;advance(30);assert.equal(saved().save.rewardClaim,count,'leaving stops hover collection');
 bar.onpointerenter({pointerType:'touch'});bar.onpointermove({pointerType:'touch'});advance(1);assert.equal(saved().save.rewardClaim,count,'touch pointer entry is not hover');bar.click();assert.equal(saved().save.rewardClaim,count+1,'touch/click activation still works');
 bar.onpointerenter({pointerType:'mouse'});listeners.blur();advance(30);assert.equal(saved().save.rewardClaim,count+1,'blur clears hover');bar.onpointerenter({pointerType:'mouse'});assert.equal(saved().save.rewardClaim,count+2,'entering a full bar pays immediately');bar.click();assert.equal(saved().save.rewardClaim,count+2);
 console.log('PASS: hover entry, fill under stationary cursor, repeat readiness, leave/blur cancellation, touch/click fallback, duplicate guard and current content preservation.');process.exit(0);
}
if(process.env.FEATURE_GATE_TEST==='1'){
 assert.equal(ids.get('shop').classes.has('hidden'),false,'locked URL routes to Feature Shop');
 assert.equal(ids.get('arcade').classes.has('hidden'),true);assert.equal(ids.get('mode').disabled,true);assert.equal(ids.get('selectMind').disabled,true);assert.equal(ids.get('selectMmrx').disabled,true);assert.equal(ids.get('selectBalance').disabled,true);assert.equal(ids.get('dragonFeed').disabled,true);
 nodes.find(n=>n.dataset.tab==='dragon').click();assert.equal(ids.get('dragon').classes.has('hidden'),false);
 const fresh=newGame();fresh.save.level=fresh.save.bestLevel=12;fresh.save.coin=10000;
 const load=async r=>ids.get('importFile').onchange({target:{files:[{size:20000,text:async()=>JSON.stringify(r)}],value:''}});
 await load(fresh);nodes.find(n=>n.dataset.tab==='garden').click();assert.equal(ids.get('shop').classes.has('hidden'),false);ids.get('unlockgarden').click();
 nodes.find(n=>n.dataset.tab==='garden').click();assert.equal(ids.get('garden').classes.has('hidden'),false);ids.get('saveButton').click();let s=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(s.save.coin,0);assert.equal(s.features.garden,true);
 const fed=newGame();fed.save.level=fed.save.bestLevel=50;fed.save.coin=100000;await load(fed);nodes.find(n=>n.dataset.tab==='dragon').click();ids.get('dragonFeed').click();ids.get('saveButton').click();s=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(s.dragon.total,1);assert.equal(s.save.blueCoin,1);assert.ok(ids.get('dragonSpeech').textContent.includes('CTRL'));assert.equal(ids.get('dragon').classes.has('hidden'),false);
 console.log('PASS: actual app locked hash, Dragon navigation, Idle lock, imported level threshold, Feature Shop purchase, unlocked Garden and Dragon feeding/save wiring.');process.exit(0);
}
assert.ok(ids.get('combatSpeed').textContent.includes('0.35'));
const arenaTab=nodes.find(n=>n.dataset.tab==='arena');arenaTab.click();assert.equal(ids.get('arena').classes.has('hidden'),false);
ids.get('barButton').click();ids.get('saveButton').click();let saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(saved.save.rewardClaim,1);assert.equal(ids.get('arena').classes.has('hidden'),false);assert.ok(!ids.has('claim'));
ids.get('regionSelect').value='3';ids.get('regionSelect').onchange();ids.get('travelRegion').click();ids.get('saveButton').click();saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(saved.arena.zone,3);
ids.get('quickAttack').click();ids.get('saveButton').click();saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.ok(saved.arena.mp<fixture.arena.mp);assert.ok(saved.arena.attacks>0);
ids.get('gearFilter').value='hat';ids.get('gearFilter').onchange();assert.ok(ids.get('weaponList').innerHTML.includes('Training Hat'));
const craft=nodes.slice().reverse().find(n=>n.dataset.gear==='hat:102'&&n.tagName==='BUTTON');ids.get('weaponList').onclick({target:craft});ids.get('saveButton').click();saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.ok(saved.equipment.armorOwned.includes('hat:102'));
assert.ok(ids.get('bestiaryList').innerHTML.includes('Master Dummy'));assert.ok(ids.get('bossProgress').textContent.includes('/ 4'));
// A separate Garden view can plant, mature and harvest while keeping the active view.
const gardenTab=nodes.find(n=>n.dataset.tab==='garden');gardenTab.click();assert.equal(ids.get('garden').classes.has('hidden'),false);
let plot=nodes.slice().reverse().find(n=>n.dataset.plot==='0'&&n.tagName==='BUTTON');ids.get('gardenPlots').onclick({target:plot});
saved=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(saved.garden.plots[0].tree,1);
const realNow=Date.now;Date.now=()=>saved.garden.plots[0].plantedAt+30000;raf(performance.now()+250);
plot=nodes.slice().reverse().find(n=>n.dataset.plot==='0'&&n.tagName==='BUTTON');assert.ok(plot.attrs['aria-label'].includes('HARVEST'));ids.get('gardenPlots').onclick({target:plot});
const afterGarden=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterGarden.garden.harvests,1);assert.equal(ids.get('garden').classes.has('hidden'),false);assert.equal(afterGarden.arena.zone,3);Date.now=realNow;
console.log('PASS: actual app initialization, bar reward preserves arena, travel click, MP skill click, armor crafting click, bestiary rendering Garden planting/maturation/harvesting and save wiring (DOM adapter; no visual/browser claim).');

const arcadeTab=nodes.find(n=>n.dataset.tab==='arcade');arcadeTab.click();assert.equal(ids.get('arcade').classes.has('hidden'),false);
const originalPerformance=globalThis.performance,originalRandom=Math.random;let arcadeNow=1000;globalThis.performance={now:()=>arcadeNow};Math.random=()=>0;
ids.get('whackStart').click();assert.equal(ids.get('whackEnd').disabled,false);arcadeNow+=3100;raf(arcadeNow);
const greg=nodes.slice().reverse().find(n=>n.tagName==='BUTTON'&&n.attrs['aria-label']?.startsWith('Greg tile'));
assert.ok(greg);ids.get('whackBoard').onclick({target:greg});assert.ok(Number(String(ids.get('whackScore').textContent).replaceAll(',',''))>0);
ids.get('barButton').click();assert.equal(ids.get('arcade').classes.has('hidden'),false);ids.get('whackEnd').click();ids.get('saveButton').click();
const afterArcade=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterArcade.arcade.plays,1);assert.ok(afterArcade.arcade.best>0);assert.equal(afterArcade.garden.harvests,1);assert.equal(afterArcade.arena.zone,3);
ids.get('whackEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.plays,1);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: Arcade tab, start, original tile rendering, hit, right bar preserves Arcade, finish, save and duplicate reward guard.');

ids.get('selectMath').click();assert.equal(ids.get('mathView').classes.has('hidden'),false);assert.equal(ids.get('whackView').classes.has('hidden'),true);
let mathNow=1000;globalThis.performance={now:()=>mathNow};Math.random=()=>0;ids.get('mathStart').click();assert.equal(ids.get('selectWhack').disabled,true);assert.ok(ids.get('mathQuestion').textContent.includes('?'));
ids.get('mathAnswer0').click();assert.equal(ids.get('mathScore').textContent,'3,200');ids.get('mathAnswer3').click();assert.equal(ids.get('mathScore').textContent,'2,880');assert.equal(ids.get('mathTime').textContent,'54.0s');
let prevented=false;listeners.keydown({key:'1',code:'Digit1',target:{tagName:'DIV'},preventDefault:()=>prevented=true});assert.equal(prevented,true);assert.equal(ids.get('mathCorrect').textContent,'2');assert.ok(ids.get('mathHistory').innerHTML.includes('0 + 0 = 0'));
ids.get('barButton').click();assert.equal(ids.get('arcade').classes.has('hidden'),false);assert.equal(ids.get('mathView').classes.has('hidden'),false);
mathNow+=60000;raf(mathNow);assert.equal(ids.get('mathEnd').disabled,true);assert.equal(ids.get('mathTime').textContent,'0.0s');ids.get('saveButton').click();
const afterMath=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterMath.arcade.math.plays,1);assert.ok(afterMath.arcade.math.best>0);assert.equal(afterMath.arcade.plays,1);assert.equal(afterMath.garden.harvests,1);assert.equal(afterMath.arena.zone,3);
ids.get('mathEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.math.plays,1);ids.get('selectWhack').click();assert.equal(ids.get('whackView').classes.has('hidden'),false);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: Arcade selector, Math correct/wrong/keyboard input, bar without navigation, automatic timeout settlement, saved separate records and no duplicate payouts.');

ids.get('selectPong').click();assert.equal(ids.get('pongView').classes.has('hidden'),false);let pongNow=70000;globalThis.performance={now:()=>pongNow};Math.random=()=>.5;
ids.get('pongStart').click();assert.equal(ids.get('selectMath').disabled,true);let keyPrevented=false;listeners.keydown({code:'ArrowUp',key:'ArrowUp',target:{tagName:'DIV'},preventDefault:()=>keyPrevented=true});pongNow+=250;raf(pongNow);assert.equal(keyPrevented,true);assert.ok(Number(ids.get('pongPlayer').attrs.y)<90);listeners.keyup({code:'ArrowUp'});
const board=ids.get('pongBoard');board.getBoundingClientRect=()=>({top:0,height:250});board.onpointerdown({clientY:180,pointerId:1,preventDefault(){}});pongNow+=250;raf(pongNow);assert.ok(Number(ids.get('pongPlayer').attrs.y)>90);
for(let i=0;i<400;i++){board.onpointermove({clientY:Number(ids.get('pongBall').attrs.y)+10});pongNow+=25;raf(pongNow);}board.onpointerup();listeners.blur();
assert.ok(Number(String(ids.get('pongScore').textContent).replaceAll(',',''))>0);ids.get('barButton').click();assert.equal(ids.get('pongView').classes.has('hidden'),false);ids.get('pongEnd').click();ids.get('saveButton').click();
const afterPong=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterPong.arcade.pong.plays,1);assert.ok(afterPong.arcade.pong.best>0);assert.equal(afterPong.arcade.math.plays,1);assert.equal(afterPong.arcade.plays,1);assert.equal(afterPong.garden.harvests,1);assert.equal(afterPong.arena.zone,3);
ids.get('pongEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.pong.plays,1);ids.get('selectWhack').click();assert.equal(ids.get('whackView').classes.has('hidden'),false);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: Pong selector/start, keyboard/release, pointer drag, per-frame SVG motion, scoring, right bar, separate saved records and once-only finish.');

ids.get('selectAvoidance').click();assert.equal(ids.get('avoidanceView').classes.has('hidden'),false);let avoidNow=100000;globalThis.performance={now:()=>avoidNow};Math.random=()=>.5;ids.get('avoidStart').click();assert.equal(ids.get('selectMath').disabled,true);
const avoidBoard=ids.get('avoidBoard');avoidBoard.getBoundingClientRect=()=>({left:0,top:0,width:500,height:350});avoidBoard.onpointermove({clientX:400,clientY:300});avoidNow+=250;raf(avoidNow);assert.equal(Number(ids.get('avoidPlayer').attrs.x),392.5);assert.equal(Number(ids.get('avoidPlayer').attrs.y),292.5);
listeners.keydown({code:'ShiftLeft',target:{tagName:'DIV'},preventDefault(){}});avoidBoard.onpointermove({clientX:100,clientY:100});avoidNow+=250;raf(avoidNow);assert.equal(Number(ids.get('avoidPlayer').attrs.x),392.5);listeners.keyup({code:'ShiftLeft'});avoidNow+=250;raf(avoidNow);assert.equal(Number(ids.get('avoidPlayer').attrs.x),92.5);
ids.get('avoidShieldButton').click();assert.equal(ids.get('avoidShieldRing').style.opacity,1);listeners.keydown({code:'ArrowRight',target:{tagName:'DIV'},preventDefault(){}});avoidNow+=250;raf(avoidNow);assert.ok(Number(ids.get('avoidPlayer').attrs.x)>92.5);listeners.keyup({code:'ArrowRight'});listeners.blur();
assert.ok(Number(String(ids.get('avoidScore').textContent).replaceAll(',',''))>0);ids.get('barButton').click();assert.equal(ids.get('avoidanceView').classes.has('hidden'),false);ids.get('avoidEnd').click();ids.get('saveButton').click();
const afterAvoid=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterAvoid.arcade.avoidance.plays,1);assert.ok(afterAvoid.arcade.avoidance.best>0);assert.equal(afterAvoid.arcade.pong.plays,1);assert.equal(afterAvoid.arcade.math.plays,1);assert.equal(afterAvoid.arcade.plays,1);assert.equal(afterAvoid.garden.harvests,1);assert.equal(afterAvoid.arena.zone,3);
ids.get('avoidEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.avoidance.plays,1);ids.get('selectWhack').click();assert.equal(ids.get('whackView').classes.has('hidden'),false);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: Avoidance selector/start, pointer tracking, Shift freeze/release, keyboard, shield rendering, survival score, bar, separate records and duplicate settlement guard.');

ids.get('selectMind').click();assert.equal(ids.get('mindView').classes.has('hidden'),false);let mindNow=120000;globalThis.performance={now:()=>mindNow};Math.random=()=>.5;ids.get('mindStart').click();assert.equal(ids.get('selectMath').disabled,true);assert.equal(ids.get('mindTurns').textContent,'50');
ids.get('mindBoard').onclick({target:ids.get('mindCell0')});assert.equal(ids.get('mindTurns').textContent,'49');assert.ok(ids.get('mindCell0').attrs['aria-label'].includes('DIRECTION'));assert.equal(ids.get('mindScanNear').disabled,false);
listeners.keydown({code:'KeyF',target:{tagName:'DIV'},preventDefault(){}});ids.get('mindBoard').onclick({target:ids.get('mindCell1')});listeners.keyup({code:'KeyF'});assert.ok(ids.get('mindCell1').attrs['aria-label'].includes('Flagged'));assert.equal(ids.get('mindTurns').textContent,'49');ids.get('mindBoard').oncontextmenu({target:ids.get('mindCell1'),preventDefault(){}});assert.ok(ids.get('mindCell1').attrs['aria-label'].includes('Covered'));
ids.get('mindScanNear').click();assert.equal(ids.get('mindTime').textContent,'14:35');assert.equal(ids.get('mindScanRandom').disabled,true);assert.equal(ids.get('mindTurns').textContent,'49');
ids.get('mindBoard').onclick({target:ids.get('mindCell110')});assert.equal(ids.get('mindNext').disabled,false);ids.get('mindNext').click();assert.equal(ids.get('mindStage').textContent,'2');assert.equal(ids.get('mindMultiplier').textContent,'2×');ids.get('barButton').click();assert.equal(ids.get('mindView').classes.has('hidden'),false);ids.get('mindEnd').click();ids.get('saveButton').click();
const afterMind=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));assert.equal(afterMind.arcade.mind.plays,1);assert.ok(afterMind.arcade.mind.best>0);assert.equal(afterMind.arcade.avoidance.plays,1);assert.equal(afterMind.arcade.pong.plays,1);assert.equal(afterMind.arcade.math.plays,1);assert.equal(afterMind.arcade.plays,1);assert.equal(afterMind.garden.harvests,1);assert.equal(afterMind.arena.zone,3);
ids.get('mindEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.mind.plays,1);ids.get('selectWhack').click();assert.equal(ids.get('whackView').classes.has('hidden'),false);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: MindSweeper selector, clue reveal, F/right-click flags, paid scan/cooldown, goal/next-stage flow, right bar, independent records and once-only finish.');

ids.get('selectMind').click();let powersNow=150000;globalThis.performance={now:()=>powersNow};let draw=0;Math.random=()=>{draw++;return draw>2&&(draw-2)%4===0?0:.5;};ids.get('mindStart').click();Math.random=()=>.5;
assert.equal(ids.get('mindRevealGoal').disabled,false);assert.equal(ids.get('mindPowerA').disabled,true);ids.get('mindBoard').onclick({target:ids.get('mindCell0')});assert.equal(ids.get('mindPowerA').attrs['data-power-type'],'9');assert.equal(ids.get('mindPowerB').attrs['data-power-type'],'10');
ids.get('mindBoard').onclick({target:ids.get('mindCell1')});assert.equal(ids.get('mindPowerA').attrs['data-power-type'],'13');assert.equal(ids.get('mindPowerB').attrs['data-power-type'],'14');ids.get('mindPowerA').click();assert.ok(ids.get('mindCell1').attrs['aria-label'].includes('DIRECTION'));assert.ok(ids.get('mindFocus').textContent.includes('2, 1'));assert.equal(ids.get('mindPowerA').attrs['data-power-type'],'9');assert.equal(ids.get('mindScanUp').disabled,true);
powersNow+=1000;raf(powersNow);ids.get('mindBoard').onclick({target:ids.get('mindCell2')});assert.equal(ids.get('mindPowerB').attrs['data-power-type'],'14');ids.get('mindPowerB').click();assert.ok(ids.get('mindCell2').attrs['aria-label'].includes('DISTANCE'));assert.equal(ids.get('mindPowerA').attrs['data-power-type'],'11');assert.equal(ids.get('mindPowerB').attrs['data-power-type'],'12');assert.ok(ids.get('mindFocus').textContent.includes('3, 1'));
powersNow+=1000;raf(powersNow);ids.get('mindRevealGoal').click();assert.equal(ids.get('mindNext').disabled,false);assert.ok(ids.get('mindFocus').textContent.includes('3, 1'));ids.get('mindNext').click();assert.equal(ids.get('mindPowerA').attrs['data-power-type'],'18');assert.equal(ids.get('mindPowerA').disabled,true);ids.get('mindEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.mind.plays,2);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: dynamic Mind power labels/conditions, arrow and distance conversions, shared cooldown, selected-tile preservation, direct goal and stage reset.');

ids.get('selectBalance').click();let nativeNow=200000;globalThis.performance={now:()=>nativeNow};Math.random=()=>.5;ids.get('balanceStart').click();assert.equal(ids.get('selectCount').disabled,true);for(let i=0;i<3;i++)ids.get('balanceDrop0').click();assert.equal(ids.get('balanceCleared').textContent,'3');assert.equal(ids.get('balanceScore').textContent,'3,435');listeners.keydown({code:'ArrowDown',target:{tagName:'DIV'},preventDefault(){}});nativeNow+=250;raf(nativeNow);assert.equal(ids.get('balanceBlock1_7').style.opacity,1);ids.get('barButton').click();assert.equal(ids.get('balanceView').classes.has('hidden'),false);ids.get('balanceEnd').click();ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.balance.plays,1);
ids.get('selectCount').click();nativeNow=250000;ids.get('countStart').click();assert.equal(ids.get('countLock').disabled,true);assert.equal(ids.get('countReveal').textContent,'');const startShape=ids.get('countShape0').attrs.x;for(let i=0;i<80;i++){nativeNow+=25;raf(nativeNow);}assert.notEqual(ids.get('countShape0').attrs.x,startShape);ids.get('countPlus').click();assert.equal(ids.get('countAnswer').value,'1');ids.get('countAnswer').value='0';ids.get('countAnswer').oninput();for(let i=0;i<1161;i++){nativeNow+=25;raf(nativeNow);}assert.equal(ids.get('countLock').disabled,false);ids.get('countLock').click();assert.equal(ids.get('countAnswer').disabled,true);assert.ok(ids.get('countReveal').textContent.startsWith('ANSWER'));for(let i=0;i<210;i++){nativeNow+=25;raf(nativeNow);}assert.equal(ids.get('countEnd').disabled,true);ids.get('saveButton').click();assert.equal(JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1')).arcade.count.plays,1);
ids.get('selectMmrx').click();nativeNow=300000;ids.get('mmrxStart').click();for(let i=0;i<160;i++){nativeNow+=25;raf(nativeNow);}const target=Array.from({length:35},(_,i)=>ids.get('mmrxNote'+i)).find(n=>n.style.opacity===1&&Math.abs(Number(n.attrs.y)-234.5)<8);assert.ok(target);const lane=Number(target.attrs.href.match(/note-(\d)/)[1]);ids.get('mmrxHit'+lane).click();assert.ok(Number(ids.get('mmrxAwesome').textContent)>0);ids.get('barButton').click();assert.equal(ids.get('mmrxView').classes.has('hidden'),false);ids.get('mmrxEnd').click();ids.get('saveButton').click();const allGames=JSON.parse(localStorage.getItem('anti-idle-web-prototype-v1'));for(const name of ['balance','count','mmrx','avoidance','pong','math'])assert.equal(allGames.arcade[name].plays,1);assert.equal(allGames.arcade.mind.plays,2);assert.equal(allGames.arcade.plays,1);assert.equal(allGames.garden.harvests,1);assert.equal(allGames.arena.zone,3);globalThis.performance=originalPerformance;Math.random=originalRandom;
console.log('PASS: Balance match/keyboard/records, Count motion/input/confidence/reveal/automatic end, MMRX visible-note hit/score, eight independent Arcade records and bar/Arena/Garden preservation.');
