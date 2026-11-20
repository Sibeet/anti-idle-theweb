import {owns} from './features.mjs?v=0.23.0';
import {ensurePrinter,printerCapacity,printerPayout,printerUpgrade,upgradePrinter,chargePrinter} from './printer.mjs?v=0.23.0';
export function createPrinterUI({getRoot,save,log,refresh}){
 const $=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('en-US');
 function charge(){const r=getRoot(),before=ensurePrinter(r).charge;if(chargePrinter(r)){log('Printer charged: '+before+' → '+r.printer.charge+' · −2 G');save();refresh();}}
 $('printerCharge').onclick=$('quickPrinterCharge').onclick=charge;
 $('printerUpgrade').onclick=()=>{if(upgradePrinter(getRoot())){log('Money Printer upgraded to Lv. '+getRoot().printer.level);save();refresh();}};
 function render(){const r=getRoot(),d=ensurePrinter(r),cap=printerCapacity(r),up=printerUpgrade(r),owned=owns(r,'printer');
 for(const [id,value] of Object.entries({printerLevel:d.level,printerPower:printerPayout(r),printerBattery:d.charge,printerTotal:d.totalMoney,printerPrints:d.prints,printerCriticals:d.criticals,printerCharged:d.totalCharge}))$(id).textContent=fmt(value);
 $('printerPercent').textContent=d.progress.toFixed(1)+'%';$('printerFill').style.width=d.progress+'%';$('printerBatteryFill').style.width=Math.min(100,d.charge/cap*100)+'%';$('printerTime').textContent=d.charge?Math.ceil((100-d.progress)/(d.charge*.04))+'s':'EMPTY';$('printerState').textContent=d.charge?'PRINTING':'BATTERY EMPTY';$('printerScene').classList.toggle('printer-empty',d.charge===0);$('printerBill').style.transform='translate('+(d.progress*.913)+'px, '+(-d.progress*.228)+'px)';
 $('printerCharge').textContent='Charge to '+cap+' · G 2';$('printerCharge').disabled=!owned||r.save.greenCoin<2||d.charge>=cap;
 $('printerUpgrade').textContent=up.max?'MAX LEVEL':r.save.bestLevel<up.level?'Requires best Lv. '+fmt(up.level):'Upgrade · Y '+fmt(up.cost);$('printerUpgrade').disabled=!owned||up.max||r.save.coin<up.cost||r.save.bestLevel<up.level;$('printerNext').textContent=up.max?'Lv. 400 / 400':'Next Lv. '+(d.level+1)+' · Best Lv. '+fmt(up.level)+' · Y '+fmt(up.cost);
 $('printerLast').textContent=d.prints?'+'+fmt(d.lastCoin)+' Y'+(d.lastGreen?' · CRITICAL! +'+fmt(d.lastGreen)+' G':'')+(d.lastBlue?' · +1 B':''):'—';renderQuick();
 }
 function renderQuick(){const r=getRoot(),d=ensurePrinter(r),visible=owns(r,'printer')&&owns(r,'superBattery');$('quickPrinterCharge').classList.toggle('hidden',!visible);if(visible){$('quickPrinterCharge').textContent='Battery '+d.charge+' / '+printerCapacity(r)+' · G 2';$('quickPrinterCharge').disabled=r.save.greenCoin<2||d.charge>=printerCapacity(r);}}
 return {render,renderQuick};
}
