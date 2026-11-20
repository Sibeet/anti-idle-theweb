import {owns} from './features.mjs?v=0.23.0';
export function ensurePrinter(r){return r.printer??={version:1,level:1,charge:80,progress:0,prints:0,criticals:0,totalMoney:0,totalCharge:0,lastCoin:0,lastGreen:0,lastBlue:0};}
export const printerCapacity=r=>owns(r,'superBattery')?200:160;
function base(r){const d=ensurePrinter(r);return Math.round(Math.floor(((d.level+25)*Math.pow(Math.min(r.save.level,9001),.65)*.63*10+4560)*(100+d.level)/100)/125);}
export function printerPayout(r){return Math.round(base(r)*500*([1,2.6,3.4,5][r.save.permaBanPenalty?.[4]??0]??1));}
export function printerUpgrade(r){const d=ensurePrinter(r);return {cost:(d.level+1)**2*10000,level:Math.max(60,20+d.level*20),max:d.level>=400};}
export function upgradePrinter(r){const d=ensurePrinter(r),u=printerUpgrade(r);if(!owns(r,'printer')||u.max||r.save.bestLevel<u.level||r.save.coin<u.cost)return false;r.save.coin-=u.cost;d.level++;return true;}
export function chargePrinter(r){if(!owns(r,'printer')||r.save.greenCoin<2)return false;const d=ensurePrinter(r),gain=Math.max(0,printerCapacity(r)-d.charge);r.save.greenCoin-=2;d.charge+=gain;d.totalCharge+=gain;return true;}
// Called once per original 40 Hz game tick, including while another feature is open.
export function printerTick(r,rng=Math.random){if(!owns(r,'printer'))return null;const d=ensurePrinter(r);d.progress+=d.charge*.04/40;if(d.progress<100)return null;d.progress=0;const coin=printerPayout(r);let green=0,blue=0;if(d.charge>0){d.charge--;if(d.charge>160)d.charge-=4;d.charge=Math.min(d.charge,1000);if(rng()<Math.min(Math.floor(r.save.totalStupidity/20),25)*.04)blue=1;const chance=.01*([1,3,4,6][r.save.permaBanPenalty?.[29]??0]??1);if(rng()<chance){green=Math.round(base(r)*10*([1,1.6,1.9,2.5][r.save.permaBanPenalty?.[4]??0]??1));d.criticals++;}}
 r.save.coin+=coin;r.save.greenCoin+=green;r.save.blueCoin+=blue;d.prints++;d.totalMoney+=coin;d.lastCoin=coin;d.lastGreen=green;d.lastBlue=blue;return {coin,green,blue};}
export function validPrinter(d){const int=(x,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(x)&&x>=min&&x<=max;return !!d&&d.version===1&&int(d.level,1,400)&&int(d.charge,0,400)&&Number.isFinite(d.progress)&&d.progress>=0&&d.progress<100&&['prints','criticals','totalMoney','totalCharge','lastCoin','lastGreen','lastBlue'].every(k=>int(d[k]))&&d.criticals<=d.prints&&d.lastBlue<=1;}
