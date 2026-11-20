import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {newGame,restore} from '../site/game.mjs';
import {buyFeature} from '../site/features.mjs';
import {ensurePrinter,printerCapacity,printerPayout,printerUpgrade,upgradePrinter,chargePrinter,printerTick} from '../site/printer.mjs';
const r=newGame();r.save.level=r.save.bestLevel=60;r.save.coin=300000;r.save.greenCoin=10;r.save.blueCoin=750;
assert.equal(printerTick(r),null);assert.equal(buyFeature(r,'superBattery'),false);assert.equal(buyFeature(r,'printer'),true);const d=ensurePrinter(r);assert.equal(d.charge,80);assert.equal(printerCapacity(r),160);
assert.equal(printerPayout(r),28000);for(let i=0;i<1250;i++)assert.equal(printerTick(r,()=>.99),null);const payout=printerTick(r,()=>.99);assert.equal(payout.coin,28000);assert.equal(d.charge,79);assert.equal(d.progress,0);assert.equal(d.prints,1);
assert.equal(chargePrinter(r),true);assert.equal(d.charge,160);assert.equal(d.totalCharge,81);assert.equal(r.save.greenCoin,8);assert.equal(buyFeature(r,'superBattery'),true);assert.equal(printerCapacity(r),200);assert.equal(chargePrinter(r),true);assert.equal(d.charge,200);assert.equal(d.totalCharge,121);
d.progress=99.99;r.save.totalStupidity=500;const crit=printerTick(r,()=>0);assert.equal(crit.coin,28000);assert.equal(crit.green,560);assert.equal(crit.blue,1);assert.equal(d.charge,195);assert.equal(d.criticals,1);
d.charge=161;d.progress=99.99;printerTick(r,()=>.99);assert.equal(d.charge,160,'extra drain only applies above 160 after first decrement');d.charge=0;d.progress=0;for(let i=0;i<1000;i++)assert.equal(printerTick(r),null);
r.save.coin=39999;assert.equal(upgradePrinter(r),false);r.save.coin=40000;assert.equal(upgradePrinter(r),true);assert.equal(d.level,2);assert.equal(r.save.coin,0);assert.deepEqual(printerUpgrade(r),{cost:90000,level:60,max:false});r.save.bestLevel=59;r.save.coin=1e12;assert.equal(upgradePrinter(r),false);r.save.bestLevel=r.save.level=8998;d.level=400;assert.equal(upgradePrinter(r),false);
assert.ok(restore(JSON.stringify(r)));const old=structuredClone(r);delete old.printer;delete old.features.printer;delete old.features.superBattery;assert.ok(restore(JSON.stringify(old)));d.progress=100;assert.equal(restore(JSON.stringify(r)),null);d.progress=0;d.level=401;assert.equal(restore(JSON.stringify(r)),null);d.level=400;
console.log('PASS: Money Printer unlock/payout timing, exhaustion, 160/200 recharge, super drain boundary, critical/blue rewards, upgrade gates/cap and save migration.');

const reference=readFileSync(new URL('./printer-reference.js',import.meta.url),'utf-8');
for(let i=0;i<256;i++){
 const r=newGame();r.features.printer=true;r.save.level=r.save.bestLevel=1+(i*37)%8998;r.save.totalStupidity=i%501;r.save.permaBanPenalty[4]=i%4;r.save.permaBanPenalty[29]=Math.floor(i/4)%4;const d=ensurePrinter(r);d.level=1+(i*13)%400;d.charge=1+i%400;d.progress=99.999;const random=()=>i%5===0?0:.99;
 const source={fps:40,printPercent:d.progress,save:{...structuredClone(r.save),printerLevel:d.level,printerCharge:d.charge,totalPrinterMoney:0,totalPrinterMillion:0},dispNews(){},withComma:x=>String(x),gainCoin(n){this.save.coin+=n;},gainGreenCoin(n){this.save.greenCoin+=n;},gainBlueCoin(n){this.save.blueCoin+=n;}};
 const math=Object.create(Math);math.random=random;const ctx=vm.createContext({_root:source,Math:math});vm.runInContext(reference,ctx);source.printMoney=ctx.printMoney;ctx.checkPrinter();printerTick(r,random);
 assert.equal(d.charge,source.save.printerCharge);assert.equal(d.progress,source.printPercent);for(const key of ['coin','greenCoin','blueCoin'])assert.equal(r.save[key],source.save[key],key+' differential '+i);assert.equal(d.totalMoney,source.save.totalPrinterMoney+source.save.totalPrinterMillion*1000000);
}
console.log('PASS: 256 differential printer ticks against original AS-compatible functions, including critical/blue rolls and ascension modifiers.');
