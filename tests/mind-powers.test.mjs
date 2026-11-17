import assert from 'node:assert/strict';
import {newGame} from '../site/game.mjs';
import {startMind,mindPowers,useMindPower,stepMind,clickMind} from '../site/mind.mjs';
const rng=()=>.5;
function fixture(kind=3){const g=startMind(rng);g.key=199;g.cells.forEach(c=>{c.kind=3;c.open=false;c.flag=false;});g.cells[199].kind=2;g.cells[105]={kind,open:true,flag:false,arrow:90,number:18};g.focus=105;g.revealed=1;g.red=true;return g;}
const costs={1:25,2:25,3:25,4:25,5:40,6:40,7:15,8:15,9:35,10:50,11:25,12:25,13:10,14:30,15:20,16:50,17:120};
let r=newGame(),g=startMind(rng);assert.equal(mindPowers(g).length,9);assert.equal(mindPowers(g).filter(p=>p.enabled).length,1);assert.equal(mindPowers(g)[8].type,17);assert.equal(useMindPower(r,g,0,rng),false);assert.equal(useMindPower(r,g,9,rng),false);
for(const [kind,types] of [[3,[7,8]],[4,[9,10]],[5,[11,12]],[6,[13,14]],[7,[15,16]],[2,[18,18]],[9,[18,18]]]){g=fixture(kind);assert.deepEqual(mindPowers(g).slice(6,8).map(p=>p.type),types);}
for(const kind of [3,4,5,6,7])for(const slot of [6,7]){g=fixture(kind);const p=mindPowers(g)[slot];assert.equal(p.cost,costs[p.type]);g.time=p.cost;const snapshot=JSON.stringify(g);assert.equal(useMindPower(r,g,slot,rng),false);assert.equal(JSON.stringify(g),snapshot);}
const expected={0:16,2:5,3:4,4:5,5:14};for(const [slot,count] of Object.entries(expected)){g=fixture();const time=g.time,turns=g.turns;assert.equal(useMindPower(r,g,Number(slot),rng),true);assert.equal(g.cells.filter(c=>c.open).length,count+1);assert.equal(g.turns,turns);assert.equal(g.focus,105);assert.equal(g.time,time-costs[Number(slot)+1]);assert.equal(g.cooldown,1);assert.equal(useMindPower(r,g,8,rng),false);stepMind(g,1);assert.equal(mindPowers(g)[8].enabled,true);}
g=fixture();g.cells[84].kind=6;g.cells[86].kind=4;useMindPower(r,g,6,rng);assert.equal(g.cells[84].open,true);assert.equal(g.cells[86].open,true);assert.equal(g.cells[104].open,false);assert.equal(g.focus,105);
g=fixture();useMindPower(r,g,7,rng);assert.equal(g.cells[110].open,true);assert.equal(g.cells.filter(c=>c.open).length,2);
g=fixture();g.cells[110].kind=4;useMindPower(r,g,7,rng);assert.equal(g.cells[110].open,false);
g=fixture(4);useMindPower(r,g,6,rng);assert.equal(g.cells.filter(c=>c.open).length,29);assert.equal(g.focus,105);
g=fixture(4);useMindPower(r,g,7,rng);for(let i=0;i<200;i++){const x=i%20,y=Math.floor(i/20);assert.equal(g.cells[i].open,x===5||y===5||Math.abs(x-5)===Math.abs(y-5));}
for(const slot of [6,7]){g=fixture(5);useMindPower(r,g,slot,rng);for(let i=0;i<200;i++)if(i!==105)assert.equal(g.cells[i].open,Math.abs(i%20-5)+Math.abs(Math.floor(i/20)-5)===18+(slot===6?-1:1));assert.equal(g.focus,105);}
g=fixture(6);const score=g.score;useMindPower(r,g,6,rng);assert.equal(g.cells[105].kind,4);assert.equal(g.cells[105].arrow,90);assert.equal(g.score-score,200);assert.equal(g.focus,105);assert.equal(mindPowers(g)[6].type,9);
g=fixture(6);useMindPower(r,g,7,rng);assert.equal(g.cells[105].kind,5);assert.equal(g.cells[105].number,18);assert.equal(mindPowers(g)[7].type,12);
for(const [slot,gain] of [[6,3],[7,9]]){g=fixture(7);const turns=g.turns;useMindPower(r,g,slot,rng);assert.equal(g.turns,turns+gain);}
g=startMind(rng);const turns=g.turns;useMindPower(r,g,8,rng);assert.equal(g.found,true);assert.equal(g.cells[g.key].open,true);assert.equal(g.focus,-1);assert.equal(g.turns,turns+2);assert.equal(g.time,780);assert.equal(mindPowers(g)[8].enabled,false);stepMind(g,1);assert.equal(useMindPower(r,g,8,rng),false);
// A scan must preserve the selected clue even when it reveals a goal elsewhere.
g=fixture();g.key=85;g.cells[199].kind=3;g.cells[85].kind=2;useMindPower(r,g,0,rng);assert.equal(g.found,true);assert.equal(g.focus,105);assert.equal(mindPowers(g)[6].type,7);
console.log('PASS: all 17 Mind power variants, original costs/conditions, strict time gate/shared cooldown, direction/cross/diagonal/distance targets, blank/treasure filters, conversions, turns, goal and focus preservation.');

