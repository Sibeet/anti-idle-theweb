function checkPrinter()
{
   moneyToPrint = Math.floor(((_root.save.printerLevel + 25) * Math.pow(Math.min(_root.save.level,9001),0.65) * 0.63 * 10 + 4560) * (100 + _root.save.printerLevel) / 100);
   moneyToPrint = Math.round(moneyToPrint / 125) * 500;
   printSpeed = _root.save.printerCharge * 0.04 / _root.fps;
   if(_root.save.permaBanPenalty[4] == 3)
   {
      moneyToPrint = Math.round(moneyToPrint * 5);
   }
   else if(_root.save.permaBanPenalty[4] == 2)
   {
      moneyToPrint = Math.round(moneyToPrint * 3.4);
   }
   else if(_root.save.permaBanPenalty[4] == 1)
   {
      moneyToPrint = Math.round(moneyToPrint * 2.6);
   }
   _root.printPercent += printSpeed;
   if(_root.printPercent >= 100)
   {
      _root.printMoney(moneyToPrint);
   }
}
function printMoney(moneyToPrintX)
{
   _root.printPercent = 0;
   if(_root.save.printerCharge > 0)
   {
      if(_root.save.questType == "Print")
      {
         if(_root.save.questSubtype == "Any")
         {
            _root.save.questCount += 1;
         }
      }
      _root.save.printerCharge -= 1;
      if(_root.save.printerCharge > 160)
      {
         _root.save.printerCharge -= 4;
      }
      if(_root.save.printerCharge > 1000)
      {
         _root.save.printerCharge = 1000;
      }
      if(Math.random() < Math.min(Math.floor(_root.save.totalStupidity / 20),25) * 0.04)
      {
         _root.gainBlueCoin(1);
      }
      _root.dispNews(75,"Money printed! (+" + _root.withComma(moneyToPrintX) + " Coins)");
      critPrintChance = 0.01;
      if(_root.save.permaBanPenalty[29] == 3)
      {
         critPrintChance *= 6;
      }
      else if(_root.save.permaBanPenalty[29] == 2)
      {
         critPrintChance *= 4;
      }
      else if(_root.save.permaBanPenalty[29] == 1)
      {
         critPrintChance *= 3;
      }
      if(Math.random() < critPrintChance)
      {
         greenCoinToGain = Math.floor(((_root.save.printerLevel + 25) * Math.pow(Math.min(_root.save.level,9001),0.65) * 0.63 * 10 + 4560) * (100 + _root.save.printerLevel) / 100);
         greenCoinToGain = Math.round(greenCoinToGain / 125) * 10;
         if(_root.save.permaBanPenalty[4] == 3)
         {
            greenCoinToGain = Math.round(greenCoinToGain * 2.5);
         }
         else if(_root.save.permaBanPenalty[4] == 2)
         {
            greenCoinToGain = Math.round(greenCoinToGain * 1.9);
         }
         else if(_root.save.permaBanPenalty[4] == 1)
         {
            greenCoinToGain = Math.round(greenCoinToGain * 1.6);
         }
         _root.gainGreenCoin(greenCoinToGain);
         _root.dispNews(76,"CRITICAL PRINT! (+" + _root.withComma(greenCoinToGain) + " Green Coins)");
         if(_root.save.questType == "Print")
         {
            if(_root.save.questSubtype == "Critical")
            {
               _root.save.questCount += 1;
            }
         }
      }
   }
   if(_root.save.printerCharge > 0 && _root.save.printerCharge < 10)
   {
      _root.dispNews(156,"Your Printer Battery is low.");
   }
   if(_root.save.printerCharge <= 0)
   {
      _root.dispNews(157,"Your Printer Battery has run out. Charge it now!");
   }
   _root.gainCoin(moneyToPrintX,9);
   _root.save.totalPrinterMoney += moneyToPrintX;
   if(_root.save.totalPrinterMoney >= 1000000)
   {
      _root.save.totalPrinterMillion += Math.floor(_root.save.totalPrinterMoney / 1000000);
      _root.save.totalPrinterMoney %= 1000000;
   }
}