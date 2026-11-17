// Source: frame_13/DoAction_2.as:315
export function calcReqExp(root) {

   root.requiredExp = root.save.level * root.save.level * 10 + 10;
   if(root.save.gDifficulty == 3)
   {
      root.requiredExp = Math.floor(root.requiredExp * 4);
      if(root.save.level == 8999)
      {
         root.requiredExp = 10000000000000 - root.save.totalExp;
         if(root.save.gOldAscension == false)
         {
            if(root.save.banned >= 1000)
            {
               root.requiredExp += 25000000000000;
            }
            else if(root.save.banned >= 800)
            {
               root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
            }
            else if(root.save.banned >= 600)
            {
               root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
            }
            else if(root.save.banned >= 400)
            {
               root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
            }
            else if(root.save.banned >= 200)
            {
               root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
            }
            else if(root.save.banned >= 100)
            {
               root.requiredExp += 50000000000 * (root.save.banned - 100);
            }
         }
      }
      if(root.save.level == 9000)
      {
         root.requiredExp = 12000000000000 - root.save.totalExp;
         if(root.save.gOldAscension == false)
         {
            if(root.save.banned >= 1000)
            {
               root.requiredExp += 25000000000000;
            }
            else if(root.save.banned >= 800)
            {
               root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
            }
            else if(root.save.banned >= 600)
            {
               root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
            }
            else if(root.save.banned >= 400)
            {
               root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
            }
            else if(root.save.banned >= 200)
            {
               root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
            }
            else if(root.save.banned >= 100)
            {
               root.requiredExp += 50000000000 * (root.save.banned - 100);
            }
         }
      }
   }
   else if(root.save.gDifficulty == 2)
   {
      root.requiredExp = Math.floor(root.requiredExp * 2);
      if(root.save.level == 8999)
      {
         root.requiredExp = 5000000000000 - root.save.totalExp;
         if(root.save.gOldAscension == false)
         {
            if(root.save.banned >= 1000)
            {
               root.requiredExp += 25000000000000;
            }
            else if(root.save.banned >= 800)
            {
               root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
            }
            else if(root.save.banned >= 600)
            {
               root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
            }
            else if(root.save.banned >= 400)
            {
               root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
            }
            else if(root.save.banned >= 200)
            {
               root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
            }
            else if(root.save.banned >= 100)
            {
               root.requiredExp += 50000000000 * (root.save.banned - 100);
            }
         }
      }
      if(root.save.level == 9000)
      {
         root.requiredExp = 6000000000000 - root.save.totalExp;
         if(root.save.gOldAscension == false)
         {
            if(root.save.banned >= 1000)
            {
               root.requiredExp += 25000000000000;
            }
            else if(root.save.banned >= 800)
            {
               root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
            }
            else if(root.save.banned >= 600)
            {
               root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
            }
            else if(root.save.banned >= 400)
            {
               root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
            }
            else if(root.save.banned >= 200)
            {
               root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
            }
            else if(root.save.banned >= 100)
            {
               root.requiredExp += 50000000000 * (root.save.banned - 100);
            }
         }
      }
   }
   else if(root.save.level == 8999)
   {
      root.requiredExp = 2500000000000 - root.save.totalExp;
      if(root.save.gOldAscension == false)
      {
         if(root.save.banned >= 1000)
         {
            root.requiredExp += 25000000000000;
         }
         else if(root.save.banned >= 800)
         {
            root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
         }
         else if(root.save.banned >= 600)
         {
            root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
         }
         else if(root.save.banned >= 400)
         {
            root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
         }
         else if(root.save.banned >= 200)
         {
            root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
         }
         else if(root.save.banned >= 100)
         {
            root.requiredExp += 50000000000 * (root.save.banned - 100);
         }
      }
   }
   else if(root.save.level == 9000)
   {
      root.requiredExp = 3000000000000 - root.save.totalExp;
      if(root.save.gOldAscension == false)
      {
         if(root.save.banned >= 1000)
         {
            root.requiredExp += 25000000000000;
         }
         else if(root.save.banned >= 800)
         {
            root.requiredExp += 10000000000 * (root.save.banned - 800) + 23000000000000;
         }
         else if(root.save.banned >= 600)
         {
            root.requiredExp += 20000000000 * (root.save.banned - 600) + 19000000000000;
         }
         else if(root.save.banned >= 400)
         {
            root.requiredExp += 30000000000 * (root.save.banned - 400) + 13000000000000;
         }
         else if(root.save.banned >= 200)
         {
            root.requiredExp += 40000000000 * (root.save.banned - 200) + 5000000000000;
         }
         else if(root.save.banned >= 100)
         {
            root.requiredExp += 50000000000 * (root.save.banned - 100);
         }
      }
   }
   if(root.save.level > 9002 || root.save.level == 9002 && root.save.totalExp < 999000000000000)
   {
      root.save.level = 1;
      root.save.currentExp = 0;
      root.save.totalExp = 0;
      root.save.bestLevel = 1;
   }
   if(root.save.level == 9002)
   {
      root.save.currentExp = 0;
      root.save.totalExp = 999999999999999;
      root.requiredExp = 1;
   }
   else if(root.save.level == 9001)
   {
      root.requiredExp = 999999999999999 - root.save.totalExp;
   }
}

// Source: frame_13/DoAction_2.as:867
export function progressUp(root) {
  let progSpeed;

   if(root.progPercent < root.save.progStore)
   {
      if(root.save.idleMode == false || root.idlerAppreciate == true || root.saveid >= 10 && root.saveid < 20)
      {
         if(root.save.progSpeedManual > root.save.progSpeedAuto)
         {
            progSpeed = root.save.progSpeedManual;
         }
         else
         {
            progSpeed = root.save.progSpeedAuto;
         }
      }
      else
      {
         progSpeed = root.save.progSpeedAuto;
         if(root.save.careerLevel[1] >= 100)
         {
            progSpeed += 30;
         }
         progSpeed += root.curCareerLevel[1] * 0.6;
      }
      progSpeed *= 1 + Math.min(Math.floor(root.save.totalStupidity / 50),20) * 0.01;
      if(root.save.permaBanPenalty[31] == 3)
      {
         progSpeed *= 1.25;
      }
      else if(root.save.permaBanPenalty[31] == 2)
      {
         progSpeed *= 1.15;
      }
      else if(root.save.permaBanPenalty[31] == 1)
      {
         progSpeed *= 1.1;
      }
      if(root.save.rewardClaim < 5)
      {
         progSpeed *= 2.5;
      }
      if(root.save.gDifficulty >= 3 && root.save.level < 8999)
      {
         progSpeed *= 0.8;
      }
      else if(root.save.gDifficulty >= 2 && root.save.level < 8999)
      {
         progSpeed *= 0.9;
      }
      root.progPercent += 0.02 * (root.save.boost / 100) * (40 / root.fps) * (progSpeed / 100);
      if(root.save.rewardClaim < 5)
      {
         root.progPercent += 20 / root.fps;
      }
      else if(root.save.bestLevel < 35)
      {
         root.progPercent += 0.125 * (root.save.boost / 100) * (40 / root.fps) * (progSpeed / 100);
      }
   }
}

// Source: frame_3/DoAction.as:1250
export function gainBoost(root, amount, limit) {
  let realLimit, actualGain;

   if(!isNaN(amount))
   {
      if(limit == 1)
      {
         realLimit = root.boostMax;
      }
      else if(limit == 2 || limit == 3)
      {
         realLimit = root.boostMax * 1.5;
      }
      else
      {
         realLimit = root.boostMax * 2.5;
      }
      if(root.save.bestLevel <= 5 && root.save.featureBoostGen != true)
      {
         realLimit = 100;
      }
      actualGain = amount;
      if(actualGain > realLimit - root.save.boost)
      {
         actualGain = realLimit - root.save.boost;
      }
      if(actualGain < 0)
      {
         actualGain = 0;
      }
      root.save.boost += actualGain;
      root.save.boostPurchased += actualGain;
   }
}

// Source: frame_3/DoAction.as:1283
export function sauceMult(root, sa) {
  let tMult;

   if(root.save.gDifficulty >= 3 && root.save.level < 8999)
   {
      tMult = 1.2 - root.save.expSauceAsc[sa] / 1000000 / 20000000 - root.save.expSauceAsc[sa] / (root.save.expSauceAsc[40] + 1) * 0.2;
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
   else if(root.save.gDifficulty >= 2 && root.save.level < 8999)
   {
      tMult = 1.2 - root.save.expSauceAsc[sa] / 1000000 / 10000000 - root.save.expSauceAsc[sa] / (root.save.expSauceAsc[40] + 1) * 0.2;
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

// Source: frame_3/DoAction.as:55
export function checkAttReward(root, dayCount) {

   if(dayCount == root.refresh_max_date)
   {
      return 8;
   }
   if(dayCount == root.refresh_max_date - 1)
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
