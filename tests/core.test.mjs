import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import * as port from '../site/core.mjs';
const reference=readFileSync(new URL('./reference.js',import.meta.url),'utf8');
let count=0;
function check(name,root,...args){
 const actual=structuredClone(root), expected=structuredClone(root);
 const ctx=vm.createContext({_root:expected});vm.runInContext(reference,ctx);
 const a=port[name](actual,...args), b=ctx[name](...args);
 assert.deepEqual(actual,expected,name);assert.equal(a,b,name);count++;
}
for(const level of [1,5,34,35,100,8998,8999,9000,9001,9002])
for(const gDifficulty of [0,1,2,3])
for(const banned of [0,99,100,199,200,399,400,599,600,799,800,999,1000])
for(const gOldAscension of [true,false])
 check('calcReqExp',{save:{level,gDifficulty,banned,gOldAscension,bestLevel:level,totalExp:100000,currentExp:1234}});
for(const idleMode of [true,false])for(const bestLevel of [1,34,35,100])for(const rewardClaim of [0,4,5,100])for(const gDifficulty of [1,2,3])for(const penalty of [0,1,2,3]){
 const root={fps:40,saveid:0,progPercent:0,idlerAppreciate:false,curCareerLevel:[0,50],save:{idleMode,bestLevel,level:bestLevel,rewardClaim,gDifficulty,progStore:100,progSpeedManual:120,progSpeedAuto:100,careerLevel:[0,100],totalStupidity:1000,permaBanPenalty:Array(32).fill(penalty),boost:150}};
 check('progressUp',root);root.progPercent=100;check('progressUp',root);
}
for(const bestLevel of [1,5,6,100])for(const featureBoostGen of [true,false])for(const boost of [50,100,150,300,1000])for(const amount of [-10,0,10,1000,NaN])for(const limit of [0,1,2,3])check('gainBoost',{boostMax:200,save:{bestLevel,featureBoostGen,boost,boostPurchased:0}},amount,limit);
for(const gDifficulty of [1,2,3])for(const level of [1,8998,8999])for(const total of [0,1,1e12,1e15])for(const sa of [0,1,7,40])check('sauceMult',{save:{gDifficulty,level,expSauceAsc:Array(41).fill(total)}},sa);
for(const days of [28,29,30,31])for(let day=1;day<=days;day++)check('checkAttReward',{refresh_max_date:days},day);
assert.equal((()=>{let r={save:{level:1,gDifficulty:1,bestLevel:1}};port.calcReqExp(r);return r.requiredExp})(),20);
console.log(`PASS: ${count} differential cases plus baseline assertion. Reference executes decompiled AS-compatible functions in JS; not a Flash-runtime equivalence test.`);
