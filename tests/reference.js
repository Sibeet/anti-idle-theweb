function calcReqExp()
{
   _root.requiredExp = _root.save.level * _root.save.level * 10 + 10;
   if(_root.save.gDifficulty == 3)
   {
      _root.requiredExp = Math.floor(_root.requiredExp * 4);
      if(_root.save.level == 8999)
      {
         _root.requiredExp = 10000000000000 - _root.save.totalExp;
         if(_root.save.gOldAscension == false)
         {
            if(_root.save.banned >= 1000)
            {
               _root.requiredExp += 25000000000000;
            }
            else if(_root.save.banned >= 800)
            {
               _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
            }
            else if(_root.save.banned >= 600)
            {
               _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
            }
            else if(_root.save.banned >= 400)
            {
               _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
            }
            else if(_root.save.banned >= 200)
            {
               _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
            }
            else if(_root.save.banned >= 100)
            {
               _root.requiredExp += 50000000000 * (_root.save.banned - 100);
            }
         }
      }
      if(_root.save.level == 9000)
      {
         _root.requiredExp = 12000000000000 - _root.save.totalExp;
         if(_root.save.gOldAscension == false)
         {
            if(_root.save.banned >= 1000)
            {
               _root.requiredExp += 25000000000000;
            }
            else if(_root.save.banned >= 800)
            {
               _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
            }
            else if(_root.save.banned >= 600)
            {
               _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
            }
            else if(_root.save.banned >= 400)
            {
               _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
            }
            else if(_root.save.banned >= 200)
            {
               _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
            }
            else if(_root.save.banned >= 100)
            {
               _root.requiredExp += 50000000000 * (_root.save.banned - 100);
            }
         }
      }
   }
   else if(_root.save.gDifficulty == 2)
   {
      _root.requiredExp = Math.floor(_root.requiredExp * 2);
      if(_root.save.level == 8999)
      {
         _root.requiredExp = 5000000000000 - _root.save.totalExp;
         if(_root.save.gOldAscension == false)
         {
            if(_root.save.banned >= 1000)
            {
               _root.requiredExp += 25000000000000;
            }
            else if(_root.save.banned >= 800)
            {
               _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
            }
            else if(_root.save.banned >= 600)
            {
               _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
            }
            else if(_root.save.banned >= 400)
            {
               _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
            }
            else if(_root.save.banned >= 200)
            {
               _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
            }
            else if(_root.save.banned >= 100)
            {
               _root.requiredExp += 50000000000 * (_root.save.banned - 100);
            }
         }
      }
      if(_root.save.level == 9000)
      {
         _root.requiredExp = 6000000000000 - _root.save.totalExp;
         if(_root.save.gOldAscension == false)
         {
            if(_root.save.banned >= 1000)
            {
               _root.requiredExp += 25000000000000;
            }
            else if(_root.save.banned >= 800)
            {
               _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
            }
            else if(_root.save.banned >= 600)
            {
               _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
            }
            else if(_root.save.banned >= 400)
            {
               _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
            }
            else if(_root.save.banned >= 200)
            {
               _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
            }
            else if(_root.save.banned >= 100)
            {
               _root.requiredExp += 50000000000 * (_root.save.banned - 100);
            }
         }
      }
   }
   else if(_root.save.level == 8999)
   {
      _root.requiredExp = 2500000000000 - _root.save.totalExp;
      if(_root.save.gOldAscension == false)
      {
         if(_root.save.banned >= 1000)
         {
            _root.requiredExp += 25000000000000;
         }
         else if(_root.save.banned >= 800)
         {
            _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
         }
         else if(_root.save.banned >= 600)
         {
            _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
         }
         else if(_root.save.banned >= 400)
         {
            _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
         }
         else if(_root.save.banned >= 200)
         {
            _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
         }
         else if(_root.save.banned >= 100)
         {
            _root.requiredExp += 50000000000 * (_root.save.banned - 100);
         }
      }
   }
   else if(_root.save.level == 9000)
   {
      _root.requiredExp = 3000000000000 - _root.save.totalExp;
      if(_root.save.gOldAscension == false)
      {
         if(_root.save.banned >= 1000)
         {
            _root.requiredExp += 25000000000000;
         }
         else if(_root.save.banned >= 800)
         {
            _root.requiredExp += 10000000000 * (_root.save.banned - 800) + 23000000000000;
         }
         else if(_root.save.banned >= 600)
         {
            _root.requiredExp += 20000000000 * (_root.save.banned - 600) + 19000000000000;
         }
         else if(_root.save.banned >= 400)
         {
            _root.requiredExp += 30000000000 * (_root.save.banned - 400) + 13000000000000;
         }
         else if(_root.save.banned >= 200)
         {
            _root.requiredExp += 40000000000 * (_root.save.banned - 200) + 5000000000000;
         }
         else if(_root.save.banned >= 100)
         {
            _root.requiredExp += 50000000000 * (_root.save.banned - 100);
         }
      }
   }
   if(_root.save.level > 9002 || _root.save.level == 9002 && _root.save.totalExp < 999000000000000)
   {
      _root.save.level = 1;
      _root.save.currentExp = 0;
      _root.save.totalExp = 0;
      _root.save.bestLevel = 1;
   }
   if(_root.save.level == 9002)
   {
      _root.save.currentExp = 0;
      _root.save.totalExp = 999999999999999;
      _root.requiredExp = 1;
   }
   else if(_root.save.level == 9001)
   {
      _root.requiredExp = 999999999999999 - _root.save.totalExp;
   }
}
function progressUp()
{
   if(_root.progPercent < _root.save.progStore)
   {
      if(_root.save.idleMode == false || _root.idlerAppreciate == true || _root.saveid >= 10 && _root.saveid < 20)
      {
         if(_root.save.progSpeedManual > _root.save.progSpeedAuto)
         {
            progSpeed = _root.save.progSpeedManual;
         }
         else
         {
            progSpeed = _root.save.progSpeedAuto;
         }
      }
      else
      {
         progSpeed = _root.save.progSpeedAuto;
         if(_root.save.careerLevel[1] >= 100)
         {
            progSpeed += 30;
         }
         progSpeed += _root.curCareerLevel[1] * 0.6;
      }
      progSpeed *= 1 + Math.min(Math.floor(_root.save.totalStupidity / 50),20) * 0.01;
      if(_root.save.permaBanPenalty[31] == 3)
      {
         progSpeed *= 1.25;
      }
      else if(_root.save.permaBanPenalty[31] == 2)
      {
         progSpeed *= 1.15;
      }
      else if(_root.save.permaBanPenalty[31] == 1)
      {
         progSpeed *= 1.1;
      }
      if(_root.save.rewardClaim < 5)
      {
         progSpeed *= 2.5;
      }
      if(_root.save.gDifficulty >= 3 && _root.save.level < 8999)
      {
         progSpeed *= 0.8;
      }
      else if(_root.save.gDifficulty >= 2 && _root.save.level < 8999)
      {
         progSpeed *= 0.9;
      }
      _root.progPercent += 0.02 * (_root.save.boost / 100) * (40 / _root.fps) * (progSpeed / 100);
      if(_root.save.rewardClaim < 5)
      {
         _root.progPercent += 20 / _root.fps;
      }
      else if(_root.save.bestLevel < 35)
      {
         _root.progPercent += 0.125 * (_root.save.boost / 100) * (40 / _root.fps) * (progSpeed / 100);
      }
   }
}
function gainBoost(amount, limit)
{
   if(!isNaN(amount))
   {
      if(limit == 1)
      {
         realLimit = _root.boostMax;
      }
      else if(limit == 2 || limit == 3)
      {
         realLimit = _root.boostMax * 1.5;
      }
      else
      {
         realLimit = _root.boostMax * 2.5;
      }
      if(_root.save.bestLevel <= 5 && _root.save.featureBoostGen != true)
      {
         realLimit = 100;
      }
      actualGain = amount;
      if(actualGain > realLimit - _root.save.boost)
      {
         actualGain = realLimit - _root.save.boost;
      }
      if(actualGain < 0)
      {
         actualGain = 0;
      }
      _root.save.boost += actualGain;
      _root.save.boostPurchased += actualGain;
   }
}
function sauceMult(sa)
{
   if(_root.save.gDifficulty >= 3 && _root.save.level < 8999)
   {
      tMult = 1.2 - _root.save.expSauceAsc[sa] / 1000000 / 20000000 - _root.save.expSauceAsc[sa] / (_root.save.expSauceAsc[40] + 1) * 0.2;
      if(sa == 0 || sa == 7)
      {
         tMult += 0.1;
      }
      if(tMult > 1.2)
      {
         tMult = 1.2;
      }
      if(tMult < 0.8)
      {
         tMult = 0.8;
      }
   }
   else if(_root.save.gDifficulty >= 2 && _root.save.level < 8999)
   {
      tMult = 1.2 - _root.save.expSauceAsc[sa] / 1000000 / 10000000 - _root.save.expSauceAsc[sa] / (_root.save.expSauceAsc[40] + 1) * 0.2;
      if(sa == 0 || sa == 7)
      {
         tMult += 0.1;
      }
      if(tMult > 1.1)
      {
         tMult = 1.1;
      }
      if(tMult < 0.9)
      {
         tMult = 0.9;
      }
   }
   else
   {
      tMult = 1;
   }
   tMult = Math.round(tMult * 100) / 100;
   if(isNaN(tMult))
   {
      tMult = 1;
   }
   return tMult;
}
function checkAttReward(dayCount)
{
   if(dayCount == _root.refresh_max_date)
   {
      return 8;
   }
   if(dayCount == _root.refresh_max_date - 1)
   {
      return 7;
   }
   if(dayCount == 14)
   {
      return 9;
   }
   if(dayCount == 24)
   {
      return 6;
   }
   if(dayCount == 8 || dayCount == 16)
   {
      return 5;
   }
   if(dayCount == 1 || dayCount == 9 || dayCount == 25 || dayCount == 28)
   {
      return 4;
   }
   if(dayCount == 2 || dayCount == 3 || dayCount == 4 || dayCount == 12 || dayCount == 17 || dayCount == 18 || dayCount == 19 || dayCount == 20)
   {
      return 3;
   }
   if(dayCount >= 21 || dayCount == 6 || dayCount == 14)
   {
      return 2;
   }
   return 1;
}