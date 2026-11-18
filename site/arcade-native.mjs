// Static adapters for decompiled AS2-compatible game logic. No eval or Function compilation at runtime.
import {ensureArcade} from './arcade.mjs?v=0.20.0';
import {awardExperience} from './game.mjs?v=0.20.0';
function clip(){return new Proxy({_x:0,_y:-999,_alpha:0,_currentframe:1,_xscale:100,_yscale:100,_width:0,_height:0,_rotation:0,alp:0,text:'',gotoAndStop(n){this._currentframe=n;}},{get(o,k){if(k===Symbol.toPrimitive)return ()=>0;if(k in o)return o[k];return o[k]=clip();}});}
function context(r,rng){const session={running:true,settled:false,acc:0};const root={fps:40,save:{rankedMode:false,arcadeDifficulty:Array(10).fill(2),unrankedPower:Array(50).fill(0),arcadeConfig6:false,arcadeMmrNoteSkin:0},saveGlobal:{},withComma:n=>String(n),convertSec:n=>String(n),dispNews(){},gainWhiteCoin(n){ensureArcade(r).whiteCoins+=n;},arcadeDragonCount:0};Object.defineProperty(root,'progPercent',{get:()=>r.progPercent,set:n=>r.progPercent=Math.min(100,n)});const parent=clip();parent.gotoAndStop=()=>{session.running=false;};const math=Object.create(globalThis.Math);math.random=rng;return {session,root,parent,math};}
function drive(session,dt,frame){if(!session.running||!Number.isFinite(dt)||dt<=0)return;session.acc+=Math.min(dt,.25);while(session.acc>=.025&&session.running){session.acc-=.025;frame();}}
export function finishNative(r,g,name){if(g.settled)return null;g.settled=true;g.running=false;const a=ensureArcade(r);a[name]??={best:0,total:0,plays:0};const record=a[name],score=Math.max(0,Math.floor(g.root.arcadeScore)),fake=Math.min(score,8000000),scale=Math.pow(r.save.level,.6)*r.save.boost/100;const reward={score,exp:Math.ceil(Math.floor(fake/180*3)*scale),coin:Math.ceil(Math.floor(fake/240*3)*scale),green:Math.floor(fake/40*3),blue:Math.floor(fake/20000*3)};record.best=Math.max(record.best,score);record.total+=score;record.plays++;a.medals+=Math.floor(score/100000)*(name==='mmrx'?4:3);r.save.coin+=reward.coin;r.save.greenCoin+=reward.green;r.save.blueCoin+=reward.blue;reward.levels=awardExperience(r,reward.exp);return reward;}
export function createBalance(r,rng=globalThis.Math.random){const {session,root:_root,parent:_parent,math:Math}=context(r,rng);const random=n=>globalThis.Math.floor(rng()*n),mDispText=clip(),insideBar=clip();let queueFrame=1;const gotoAndStop=n=>queueFrame=n;
let balanceAlp,balanceBar,balanceBlock,balanceFlash,balanceLoc,count,curType,del,gameSpeed,holdingDown,holdingLeft,holdingRight,i,j,loc,oldCurType,onEnterFrame,progToEarn,purpleChain,targetScale,totalBlock;
function addBlock(bar, type)
{
   loc = 7 - balanceBlock[bar];
   if(loc >= 0)
   {
      balanceBar[bar][loc] = type;
      balanceBlock[bar] += 1;
      if(_root.save.arcadeDifficulty[7] == 4)
      {
         balanceAlp[bar][loc] = 100;
      }
      _root.arcadeScore += Math.floor((115 + 5 * loc) * _root.arcadeMultiplier);
      if(balanceBar[bar][loc + 1] == type && balanceBar[bar][loc + 2] == type)
      {
         balanceBar[bar][loc] = 0;
         balanceBar[bar][loc + 1] = 0;
         balanceBar[bar][loc + 2] = 0;
         balanceFlash[bar] = 1000;
         balanceBlock[bar] -= 3;
         _root.arcadeScore += Math.floor(3000 * _root.arcadeMultiplier);
         if(_root.save.arcadeDifficulty[7] == 1)
         {
            _root.arcadeScore -= Math.floor(1500 * _root.arcadeMultiplier);
         }
         if(_root.save.arcadeDifficulty[7] == 3)
         {
            _root.arcadeScore += Math.floor(1500 * _root.arcadeMultiplier);
         }
         if(_root.save.arcadeDifficulty[7] == 4)
         {
            _root.arcadeScore += Math.floor(7500 * _root.arcadeMultiplier);
         }
         _root.arcadeBlock += 3;
         if(_root.arcadeBlock % 30 == 0 && _root.arcadeMultiplier == 15)
         {
            _root.gainWhiteCoin(1);
         }
         _root.arcadeMultiplierProgress += 9;
         if(_root.save.arcadeDifficulty[7] == 3)
         {
            _root.arcadeMultiplierProgress += 3;
         }
         if(_root.save.arcadeDifficulty[7] == 4)
         {
            _root.arcadeMultiplierProgress += 9;
         }
         if(_root.save.rankedMode != true)
         {
            _root.arcadeMultiplierProgress += 0.45 * _root.save.unrankedPower[31];
            if(_root.save.arcadeDifficulty[7] == 3)
            {
               _root.arcadeMultiplierProgress += 0.15 * _root.save.unrankedPower[31];
            }
            if(_root.save.arcadeDifficulty[7] == 4)
            {
               _root.arcadeMultiplierProgress += 0.45 * _root.save.unrankedPower[31];
            }
         }
         progToEarn = 30 + _root.arcadeMultiplier * 6;
         _root.progPercent += progToEarn;
         _root.dispNews(90,"[Balance 3] Blocks destroyed! (+" + progToEarn + "% Progress)");
      }
   }
   else
   {
      _parent.gotoAndStop(37);
   }
}
balanceBar = new Array();
balanceBar[1] = [0,0,0,0,0,0,0,0];
balanceBar[2] = [0,0,0,0,0,0,0,0];
balanceBar[3] = [0,0,0,0,0,0,0,0];
balanceAlp = new Array();
balanceAlp[1] = [0,0,0,0,0,0,0,0];
balanceAlp[2] = [0,0,0,0,0,0,0,0];
balanceAlp[3] = [0,0,0,0,0,0,0,0];
balanceLoc = new Array();
balanceLoc[1] = 1300;
balanceLoc[2] = 1300;
balanceLoc[3] = 1300;
if(_root.save.rankedMode != true)
{
   balanceLoc[1] = 1300 - _root.save.unrankedPower[33] * 30;
   balanceLoc[2] = 1300 - _root.save.unrankedPower[33] * 30;
   balanceLoc[3] = 1300 - _root.save.unrankedPower[33] * 30;
}
balanceBlock = new Array();
balanceBlock[1] = 0;
balanceBlock[2] = 0;
balanceBlock[3] = 0;
balanceFlash = new Array();
balanceFlash[1] = 100;
balanceFlash[2] = 100;
balanceFlash[3] = 100;
_root.arcadeFakeScore = 0;
_root.arcadeScore = 0;
_root.arcadeBlock = 0;
_root.arcadeMultiplier = 1;
_root.arcadeMultiplierProgress = 0;
del = 0;
gameSpeed = 1;
if(_root.save.rankedMode != true)
{
   gameSpeed = 1 - _root.save.unrankedPower[32] * 0.04;
}
if(_root.save.arcadeDifficulty[7] == 1)
{
   gameSpeed *= 0.9;
}
if(_root.save.arcadeDifficulty[7] >= 3)
{
   gameSpeed *= 1.1;
}
onEnterFrame = function()
{
   if(_root.save.arcadeDifficulty[7] == 4)
   {
      i = 1;
      while(i <= 3)
      {
         j = 0;
         while(j <= 7)
         {
            if(balanceAlp[i][j] > 0)
            {
               balanceAlp[i][j] -= 100 / _root.fps * gameSpeed;
            }
            j++;
         }
         i++;
      }
   }
   _root.arcadeFakeScore += Math.ceil((_root.arcadeScore - _root.arcadeFakeScore) / 1.1);
   _parent.countText.text = _root.withComma(_root.arcadeBlock);
   _parent.scoreText.text = _root.withComma(_root.arcadeFakeScore);
   _parent.multiplierText.text = _root.arcadeMultiplier + "x";
   mDispText.text = _root.arcadeMultiplier + "x";
   totalBlock = balanceBlock[1] + balanceBlock[2] + balanceBlock[3];
   balanceLoc[1] += (balanceBlock[1] * 3 - totalBlock) * (1 + _root.arcadeBlock / 50) / _root.fps * gameSpeed;
   balanceLoc[2] += (balanceBlock[2] * 3 - totalBlock) * (1 + _root.arcadeBlock / 50) / _root.fps * gameSpeed;
   balanceLoc[3] += (balanceBlock[3] * 3 - totalBlock) * (1 + _root.arcadeBlock / 50) / _root.fps * gameSpeed;
   if(balanceLoc[1] > 2000 || balanceLoc[2] > 2000 || balanceLoc[3] > 2000)
   {
      _parent.gotoAndStop(37);
   }
   del += 1 / _root.fps * gameSpeed;
   if(del >= 1)
   {
      balanceLoc[1] += 1;
      balanceLoc[2] += 1;
      balanceLoc[3] += 1;
      del -= 1;
   }
   if(_root.arcadeMultiplierProgress > 0)
   {
      _root.arcadeMultiplierProgress -= (1.5 + _root.arcadeMultiplier * 0.1) / _root.fps * gameSpeed;
   }
};

   function reset()
   {
      oldCurType = curType;
      curType = 1;
      if(Math.random() < 0.5)
      {
         curType = 2;
         if(Math.random() < 0.5)
         {
            curType = 3;
         }
      }
      if(_root.save.arcadeDifficulty[7] >= 3 && Math.random() < 0.1 && purpleChain <= 0)
      {
         purpleChain = 3;
      }
      if(purpleChain > 0 && Math.random() < 0.85)
      {
         purpleChain -= 1;
         curType = 4;
      }
      if(_root.save.arcadeDifficulty[7] == 1 && Math.random() < 0.3 && !isNaN(oldCurType))
      {
         curType = oldCurType;
      }
      gotoAndStop(curType);
      count -= 1;
      if(count < 25 && count < _root.arcadeBlock / 10 && purpleChain <= 0 && curType != 4)
      {
         gotoAndStop(5);
         count = 40;
         if(_root.save.rankedMode != true)
         {
            count = 40 + _root.save.unrankedPower[34];
         }
         if(_root.save.arcadeDifficulty[7] == 1)
         {
            count += 10;
         }
         if(_root.save.arcadeDifficulty[7] >= 3)
         {
            count -= 5;
         }
      }
   }
   count = 40;
   if(_root.save.rankedMode != true)
   {
      count = 40 + _root.save.unrankedPower[34];
   }
   purpleChain = 0;
   reset();
   holdingLeft = false;
   holdingDown = false;
   holdingRight = false;

function powerFrame(){
   targetScale = _root.arcadeMultiplierProgress;
   insideBar._xscale += (targetScale - insideBar._xscale) / 5;
   if(_root.arcadeMultiplierProgress >= 100 && _root.arcadeMultiplier < 15)
   {
      _root.arcadeMultiplierProgress -= 100;
      _root.arcadeMultiplier += 1;
      if(_root.arcadeMultiplier == 6 || _root.arcadeMultiplier == 9)
      {
         _root.gainWhiteCoin(1);
      }
      if(_root.arcadeMultiplier == 12)
      {
         _root.gainWhiteCoin(2);
      }
      if(_root.arcadeMultiplier == 15)
      {
         _root.gainWhiteCoin(3);
      }
   }
   else if(_root.arcadeMultiplier == 15)
   {
      _root.arcadeMultiplierProgress = 100;
   }
}

session.root=_root;session.step=dt=>drive(session,dt,()=>{onEnterFrame();powerFrame();});session.drop=bar=>{if(!session.running||!Number.isInteger(bar)||bar<0||bar>2)return false;addBlock(bar+1,curType);reset();return true;};session.state=()=>({bars:balanceBar.slice(1),locations:balanceLoc.slice(1),queue:curType,hidden:queueFrame===5,progress:_root.arcadeMultiplierProgress});return session;}
function countShape(_root,Math,random,ori){let _Y=ori,_X=-70,_alpha=100,_currentframe=1;const colorChangeAnim=clip(),gotoAndStop=n=>_currentframe=n;let Xalpha,changeColor,changeColorDelay,changeColorMax,changeDirection,changeDirectionMax,col,curX,curY,dir,fade,jump,onEnterFrame,oriY,targetSpd,teleport,teleportDur,valid,xSpd,ySpd;
function resetTriangle()
{
   teleportDur = 0;
   ySpd = 0;
   curY = oriY;
   if(Math.random() < 0.5 && _root.arcadeDifficulty >= 6)
   {
      jump = "Jump";
   }
   else
   {
      jump = "";
   }
   changeDirection = 0;
   changeColor = 0;
   changeDirectionMax = 0;
   changeColorMax = 0;
   changeColorDelay = 0;
   if(_root.arcadeCondition3 != "Left" && _root.arcadeCondition3 != "Right" && Math.random() < 0.25 && _root.arcadeTimeLeft < _root.arcadeQuestionAppear + 9 && _root.save.arcadeDifficulty[8] >= 3)
   {
      changeDirectionMax = 1;
      if(_root.arcadeDifficulty >= 7)
      {
         changeDirectionMax = 1 + random(2);
      }
   }
   if(_root.arcadeCondition2 != "White" && _root.arcadeCondition2 != "Black" && Math.random() < 0.35 && _root.arcadeTimeLeft < _root.arcadeQuestionAppear + 9 && _root.save.arcadeDifficulty[8] >= 3)
   {
      changeColorMax = 1;
      if(_root.arcadeDifficulty >= 4)
      {
         changeColorMax = 1 + random(2);
      }
   }
   if(Math.random() < 0.1 && _root.arcadeDifficulty >= 2)
   {
      col = "Circle";
      gotoAndStop(4 + random(2));
   }
   else if(Math.random() < 0.5)
   {
      col = "White";
      gotoAndStop(2);
   }
   else
   {
      col = "Black";
      gotoAndStop(3);
   }
   if(Math.random() < 0.5 || _root.arcadeDifficulty < 4)
   {
      curX = 550 + Math.random() * 600;
      xSpd = -3 - Math.random() * 4;
      dir = "Left";
   }
   else
   {
      curX = -50 - Math.random() * 600;
      xSpd = 3 + Math.random() * 4;
      dir = "Right";
   }
   if(Math.random() < 0.03 * _root.arcadeDifficulty && _root.arcadeDifficulty >= 5 && changeColorMax < 1 && _root.save.arcadeDifficulty[8] >= 2)
   {
      fade = "In";
      Xalpha = 0;
   }
   else if(Math.random() < 0.03 * _root.arcadeDifficulty && _root.arcadeDifficulty >= 3 && changeColorMax < 1 && changeDirectionMax < 1 && _root.save.arcadeDifficulty[8] >= 2)
   {
      fade = "Out";
      Xalpha = 100;
   }
   else
   {
      fade = "";
      Xalpha = 100;
   }
   if(Math.random() < 0.03 * _root.arcadeDifficulty && _root.arcadeDifficulty >= 8 && changeColorMax < 1 && changeDirectionMax < 1 && _root.save.arcadeDifficulty[8] >= 2)
   {
      teleport = "Teleport";
   }
   else
   {
      teleport = "";
   }
   valid = true;
   if(col == "Circle")
   {
      valid = false;
   }
   if(_root.arcadeCondition1 == "Jump" && jump == "")
   {
      valid = false;
   }
   if(_root.arcadeCondition2 == "White" && col != "White")
   {
      valid = false;
   }
   if(_root.arcadeCondition2 == "Black" && col != "Black")
   {
      valid = false;
   }
   if(_root.arcadeCondition2 == "Color-Changing" && changeColorMax < 1)
   {
      valid = false;
   }
   if(_root.arcadeCondition3 == "Left" && dir != "Left")
   {
      valid = false;
   }
   if(_root.arcadeCondition3 == "Right" && dir != "Right")
   {
      valid = false;
   }
   if(_root.arcadeCondition3 == "Direction-Changing" && changeDirectionMax < 1)
   {
      valid = false;
   }
   if(_root.save.rankedMode != true)
   {
      if(col == "Circle" && Math.random() < _root.save.unrankedPower[24] * 0.2)
      {
         gotoAndStop(6);
      }
      if(col != "Circle")
      {
         xSpd *= 1 - _root.save.unrankedPower[22] * 0.04;
      }
   }
   if(_root.save.arcadeDifficulty[8] == 1)
   {
      xSpd *= 0.9;
   }
   if(_root.save.arcadeDifficulty[8] == 4 && Math.random() < 0.5)
   {
      xSpd *= 1.3 + Math.random() * 0.4;
   }
   if(_root.save.arcadeDifficulty[8] == 4 && Math.random() < 0.15)
   {
      xSpd *= 0.5;
   }
   targetSpd = xSpd;
}
curY = _Y;
oriY = curY;
jump = "";
col = "";
dir = "";
fade = "";
teleport = "";
changeDirection = 0;
changeColor = 0;
changeDirectionMax = 0;
changeColorMax = 0;
changeColorDelay = 0;
onEnterFrame = function()
{
   if(_root.arcadeTimeLeft > 5)
   {
      if(targetSpd != xSpd)
      {
         xSpd += (targetSpd - xSpd) / 25;
      }
      if(colorChangeAnim._alpha < 10 || _currentframe == 6)
      {
         curX += xSpd * 40 / _root.fps;
         if(teleportDur > 0)
         {
            curX += xSpd * 160 / _root.fps;
         }
      }
      teleportDur -= 1 / _root.fps;
      if(teleport == "Teleport" && Math.random() < 0.01 && teleportDur <= 0 && fade != "In")
      {
         teleport = "";
         teleportDur = 0.2;
      }
      if(jump == "Jump")
      {
         if(curY >= oriY)
         {
            ySpd = -10;
         }
         else
         {
            ySpd += 1;
         }
         curY += ySpd * 40 / _root.fps;
      }
      if(fade == "In" && curX > 25 && curX < 475)
      {
         Xalpha += 100 / _root.fps;
      }
      if(fade == "Out" && curX > 25 && curX < 475)
      {
         Xalpha -= 35 / _root.fps;
      }
   }
   if(_root.arcadeTimeLeft > 25 && _root.arcadeCorrectCount < 85)
   {
      if(xSpd > 0 && curX > 550 || xSpd < 0 && curX < -50)
      {
         resetTriangle();
      }
   }
   if(curX > 25 && curX < 475 && valid == true)
   {
      valid = false;
      _root.arcadeCorrectCount += 1;
      if(fade != "In" || Math.random() < Math.pow(0.96,_root.arcadeDifficulty))
      {
         _root.arcadeDragonCount += 1;
      }
   }
   if(curX > 200 && curX < 300)
   {
      if(_root.arcadeDifficulty >= 5 && Math.random() < 0.008 * _root.arcadeDifficulty / _root.fps)
      {
         _root.arcadeDragonCount += 1;
      }
   }
   _X = curX;
   _Y = curY;
   _alpha = Xalpha;
   changeColorDelay -= 1 / _root.fps;
   if(changeDirection < changeDirectionMax)
   {
      if((curX < 200 || curX < 225 && Math.random() < 0.2) && targetSpd < 0)
      {
         targetSpd *= -1;
         changeDirection += 1;
      }
      if((curX > 300 || curX > 275 && Math.random() < 0.2) && targetSpd > 0)
      {
         targetSpd *= -1;
         changeDirection += 1;
      }
   }
   if(changeColor < changeColorMax && changeColorDelay <= 0)
   {
      if((curX < 200 || curX < 250 && Math.random() < 0.1) && xSpd < 0)
      {
         if(_currentframe == 2)
         {
            gotoAndStop(3);
         }
         else if(_currentframe == 3)
         {
            gotoAndStop(2);
         }
         else if(_currentframe == 4)
         {
            gotoAndStop(5);
         }
         else if(_currentframe == 5)
         {
            gotoAndStop(4);
         }
         changeColor += 1;
         changeColorDelay = 1 + Math.random() * 0.5;
         colorChangeAnim._alpha = 100;
      }
      if((curX > 300 || curX > 250 && Math.random() < 0.1) && xSpd > 0)
      {
         if(_currentframe == 2)
         {
            gotoAndStop(3);
         }
         else if(_currentframe == 3)
         {
            gotoAndStop(2);
         }
         else if(_currentframe == 4)
         {
            gotoAndStop(5);
         }
         else if(_currentframe == 5)
         {
            gotoAndStop(4);
         }
         changeColor += 1;
         changeColorDelay = 0.5 + Math.random() * 0.5;
         colorChangeAnim._alpha = 100;
      }
   }
};
resetTriangle();

return {step(){if(colorChangeAnim._alpha>0)colorChangeAnim._alpha=Math.max(0,colorChangeAnim._alpha-10);onEnterFrame();},state:()=>({x:curX,y:curY,alpha:Xalpha,frame:_currentframe,direction:xSpd})};}
export function createCount(r,rng=globalThis.Math.random){const {session,root:_root,parent:_parent,math:Math}=context(r,rng);const random=n=>globalThis.Math.floor(rng()*n),hintText=clip(),questionText=clip();let difference,onEnterFrame,progToEarn,tmpScore;
_root.arcadeScore = 0;
_root.arcadeFakeScore = 0;
_root.arcadeTimeLeft = 45;
if(_root.save.rankedMode != true)
{
   _root.arcadeTimeLeft = 45 - _root.save.unrankedPower[23] * 2;
}
_root.arcadeQuestion = "How many triangles?";
_root.arcadeHint = "";
_root.arcadeQuestionAppear = 60;
_root.arcadeIdleTime = 10;
_root.arcadeSkipBonus = 0;
_root.arcadeMyCount = 0;
_root.arcadeCorrectCount = 0;
_root.arcadeCountForgiveness = 3;
_root.arcadeCondition1 = "";
_root.arcadeCondition2 = "";
_root.arcadeCondition3 = "";
_root.arcadeMultiplier = 1;
_root.arcadeDifficulty = 1;
onEnterFrame = function()
{
   _root.arcadeTimeLeft -= 1 / _root.fps;
   if(_root.arcadeTimeLeft <= 10 && _root.arcadeHint == "")
   {
      if(_root.arcadeMyCount == _root.arcadeCorrectCount)
      {
         _root.arcadeHint = "Hint: The answer is " + _root.arcadeCorrectCount + ".";
      }
      else if(_root.arcadeMyCount > _root.arcadeCorrectCount && (_root.arcadeDifficulty < 4 || _root.save.arcadeDifficulty[8] == 1))
      {
         _root.arcadeHint = "Hint: The answer is lower than " + _root.arcadeMyCount + ".";
      }
      else if(_root.arcadeMyCount < _root.arcadeCorrectCount && (_root.arcadeDifficulty < 4 || _root.save.arcadeDifficulty[8] == 1))
      {
         _root.arcadeHint = "Hint: The answer is higher than " + _root.arcadeMyCount + ".";
      }
      else
      {
         _root.arcadeHint = "Hint: The answer is NOT " + _root.arcadeMyCount + ".";
      }
   }
   if(_root.arcadeTimeLeft <= 0)
   {
      difference = Math.abs(_root.arcadeCorrectCount - _root.arcadeMyCount);
      if(difference > _root.arcadeCountForgiveness)
      {
         _parent.gotoAndStop(38);
      }
      else
      {
         tmpScore = Math.floor((20000 + _root.arcadeIdleTime * 1000 + _root.arcadeSkipBonus * 20000 - difference * 20000 + _root.save.arcadeDifficulty[8] * 50000) * _root.arcadeMultiplier);
         if(_root.save.arcadeDifficulty[8] == 1)
         {
            tmpScore = Math.floor(tmpScore * 0.5);
         }
         _root.arcadeScore += tmpScore;
         if(_root.save.rankedMode == true || difference > 1 || _root.arcadeDifficulty > 1 + _root.save.unrankedPower[21] * 2)
         {
            _root.arcadeCountForgiveness -= difference;
         }
         if(difference == 0 && _root.arcadeIdleTime > 5)
         {
            _root.arcadeMultiplier += 1;
            if(_root.save.arcadeDifficulty[8] >= 3)
            {
               _root.arcadeMultiplier += 1;
            }
            if(_root.arcadeMultiplier >= 9)
            {
               _root.gainWhiteCoin(4);
            }
            else if(_root.arcadeMultiplier >= 6)
            {
               _root.gainWhiteCoin(2);
            }
            else if(_root.arcadeMultiplier >= 3)
            {
               _root.gainWhiteCoin(1);
            }
         }
         _root.arcadeDifficulty += 1;
         progToEarn = Math.floor(1000 + _root.arcadeMultiplier * 200);
         _root.progPercent += progToEarn;
         _root.dispNews(91,"[Triangle Count] Stage cleared! (+" + progToEarn + "% Progress)");
         if(_root.save.arcadeConfig6 == true && difference == 0)
         {
            if(_root.arcadeDifficulty <= 6 && _root.save.arcadeDifficulty[8] < 3)
            {
               _root.arcadeDifficulty += 2;
               tmpScore = (50000 + _root.save.arcadeDifficulty[8] * 50000) * (_root.arcadeMultiplier * 2 + 1);
               if(_root.save.arcadeDifficulty[8] == 1)
               {
                  tmpScore = Math.floor(tmpScore * 0.5);
               }
               _root.arcadeScore += tmpScore;
               _root.arcadeMultiplier += 2;
            }
            else if(_root.arcadeDifficulty <= 11 && _root.save.arcadeDifficulty[8] < 3)
            {
               _root.arcadeDifficulty += 1;
               tmpScore = (50000 + _root.save.arcadeDifficulty[8] * 50000) * _root.arcadeMultiplier;
               if(_root.save.arcadeDifficulty[8] == 1)
               {
                  tmpScore = Math.floor(tmpScore * 0.5);
               }
               _root.arcadeScore += tmpScore;
               _root.arcadeMultiplier += 1;
            }
            else if(_root.arcadeDifficulty <= 4 && _root.save.arcadeDifficulty[8] >= 3)
            {
               _root.arcadeDifficulty += 1;
               tmpScore = (50000 + _root.save.arcadeDifficulty[8] * 50000) * _root.arcadeMultiplier;
               _root.arcadeScore += tmpScore;
               _root.arcadeMultiplier += 2;
            }
         }
         _root.arcadeCondition1 = "";
         _root.arcadeCondition2 = "";
         _root.arcadeCondition3 = "";
         if(_root.arcadeDifficulty >= 3)
         {
            if((Math.random() < 0.5 || _root.arcadeDifficulty <= 4) && _root.save.arcadeDifficulty[8] >= 3)
            {
               _root.arcadeCondition2 = "Color-Changing";
            }
            else if(Math.random() < 0.3333333333333333)
            {
               _root.arcadeCondition2 = "White";
            }
            else if(Math.random() < 0.5)
            {
               _root.arcadeCondition2 = "Black";
            }
         }
         if(_root.arcadeDifficulty >= 5)
         {
            if((Math.random() < 0.5 || _root.arcadeDifficulty <= 6) && _root.save.arcadeDifficulty[8] >= 3 && _root.arcadeCondition2 != "Color-Changing")
            {
               _root.arcadeCondition3 = "Direction-Changing";
            }
            else if(Math.random() < 0.3333333333333333)
            {
               _root.arcadeCondition3 = "Left";
            }
            else if(Math.random() < 0.5)
            {
               _root.arcadeCondition3 = "Right";
            }
         }
         if(_root.arcadeDifficulty >= 7)
         {
            if(Math.random() < 0.25 && _root.arcadeCondition2 != "Color-Changing" && _root.arcadeCondition3 != "Direction-Changing")
            {
               _root.arcadeCondition1 = "Jump";
            }
         }
         _root.arcadeQuestion = "How many";
         if(_root.arcadeCondition1 == "Jump")
         {
            _root.arcadeQuestion += " jumping";
         }
         if(_root.arcadeCondition2 == "White")
         {
            _root.arcadeQuestion += " white";
         }
         else if(_root.arcadeCondition2 == "Black")
         {
            _root.arcadeQuestion += " black";
         }
         else if(_root.arcadeCondition2 == "Color-Changing")
         {
            _root.arcadeQuestion += " color-changing";
         }
         if(_root.arcadeCondition3 == "Direction-Changing")
         {
            _root.arcadeQuestion += " direction-changing";
         }
         _root.arcadeQuestion += " triangles";
         if(_root.arcadeCondition3 == "Left")
         {
            _root.arcadeQuestion += " move left?";
         }
         else if(_root.arcadeCondition3 == "Right")
         {
            _root.arcadeQuestion += " move right?";
         }
         else
         {
            _root.arcadeQuestion += "?";
         }
         _root.arcadeHint = "";
         _root.arcadeTimeLeft = 45 + _root.arcadeDifficulty * 3;
         if(_root.save.rankedMode != true)
         {
            _root.arcadeTimeLeft = 45 + _root.arcadeDifficulty * 3 - _root.save.unrankedPower[23] * 2;
         }
         _root.arcadeQuestionAppear = 60 + _root.arcadeDifficulty * 1;
         if(_root.arcadeTimeLeft > 90)
         {
            _root.arcadeTimeLeft = 90;
            _root.arcadeQuestionAppear = 75;
         }
         if(_root.save.arcadeDifficulty[8] == 1)
         {
            _root.arcadeQuestionAppear += 10;
         }
         if(_root.save.arcadeDifficulty[8] == 4)
         {
            _root.arcadeTimeLeft += 5;
         }
         _root.arcadeIdleTime = 0;
         _root.arcadeSkipBonus = 0;
         _root.arcadeMyCount = 0;
         _root.arcadeCorrectCount = 0;
      }
   }
   _root.arcadeFakeScore += Math.ceil((_root.arcadeScore - _root.arcadeFakeScore) / 1.1);
   _parent.scoreText.text = _root.withComma(_root.arcadeFakeScore);
   _parent.timeText.text = _root.convertSec(_root.arcadeTimeLeft - 5);
   _parent.multiplierText.text = _root.arcadeMultiplier + "x";
   if(_root.arcadeHint == "" && _root.arcadeTimeLeft < 15)
   {
      hintText.text = "Confident of your answer? Press SPACE!";
   }
   else
   {
      hintText.text = _root.arcadeHint;
   }
   questionText.text = _root.arcadeQuestion;
   if(_root.arcadeTimeLeft > _root.arcadeQuestionAppear)
   {
      questionText.text = "Watch carefully!";
   }
};

const shapes=[215,225,240,250,265,275,290,300,315,325].map(y=>countShape(_root,Math,random,y));session.root=_root;session.step=dt=>drive(session,dt,()=>{onEnterFrame();if(session.running)for(const s of shapes)s.step();});session.adjust=value=>{if(!session.running||_root.arcadeTimeLeft<=5||!Number.isFinite(value))return false;_root.arcadeMyCount=globalThis.Math.max(0,globalThis.Math.min(99,globalThis.Math.floor(value)));_root.arcadeIdleTime=globalThis.Math.min(10,_root.arcadeTimeLeft-5);return true;};session.lock=()=>{if(!session.running||_root.arcadeTimeLeft>=15||_root.arcadeTimeLeft<=5)return false;if(_root.arcadeTimeLeft>=10){_root.arcadeSkipBonus=1;_root.progPercent+=1000+_root.arcadeMultiplier*200;}_root.arcadeTimeLeft=5;return true;};session.state=()=>({shapes:shapes.map(s=>s.state()),question:_root.arcadeQuestion,hint:_root.arcadeHint});return session;}
export function createMMRX(r,rng=globalThis.Math.random){const {session,root:_root,parent:_parent,math:Math}=context(r,rng);let clock=0;const Date=class{getTime(){return clock;}},random=n=>globalThis.Math.floor(rng()*n),Key={isDown:()=>false},stage=new Proxy({},{get(o,k){return o[k]??=clip();}}),mmrJudgement1=stage.mmrJudgement1,mmrJudgement2=stage.mmrJudgement2,mmrTrace1=stage.mmrTrace1,mmrTrace2=stage.mmrTrace2,mmrHealthBar=clip(),measLine=clip(),comboBreak=clip();let acceptableArr,anp,c,curBeat,curTimestamp,dist,earliestBeat,earliestBeatNum,frm,holdingA,holdingD,holdingDown,holdingLeft,holdingRight,holdingS,i,iter,j,judgementInst,mmrClock,noteBeatArr,noteColorArr,noteCount,noteCurrent,noteDispArr,noteLateArr,notePositionArr,noteResultArr,noteYposArr,onEnterFrame,pat,rev,rhythmArr,savedTimestamp,slowMult,timestampSa,tmpDamage,tmpScore,tol,xPos,yPos;
function timestampToBeat(tim)
{
   if(tim / slowMult < 300000)
   {
      return tim / slowMult / (150 - tim / slowMult / 3000);
   }
   return tim / slowMult * 3 / 50 - 12000;
}
function beatToTimestamp(bea)
{
   if(bea < 6000)
   {
      return bea * 450000 / (bea + 3000) * slowMult;
   }
   return 50 * (bea + 12000) / 3 * slowMult;
}
function pressKey(keyNum)
{
   earliestBeat = 0;
   earliestBeatNum = -1;
   c = noteCurrent - 10;
   while(c <= noteCurrent + 9)
   {
      if(earliestBeat == 0 && noteResultArr[c] == 0)
      {
         earliestBeat = noteBeatArr[c];
         earliestBeatNum = c;
         c = noteCurrent + 10;
      }
      c++;
   }
   acceptableArr = [0,-1,-1,-1];
   c = earliestBeatNum;
   while(c <= earliestBeatNum + 10)
   {
      if((noteBeatArr[c] == earliestBeat || curTimestamp >= beatToTimestamp(noteBeatArr[c]) - 300) && noteResultArr[c] == 0 && acceptableArr[noteColorArr[c]] == -1)
      {
         acceptableArr[noteColorArr[c]] = c;
      }
      c++;
   }
   if(acceptableArr[keyNum] == -1)
   {
      _root.arcadeMiss += 1;
      _root.arcadeCombo = 0;
      tmpDamage = 50 + Math.floor((_root.arcadeAwesome + _root.arcadeGood) / 20) + _root.arcadeMiss * 5;
      if(_root.save.rankedMode != true)
      {
         tmpDamage = Math.ceil(tmpDamage * (1 - _root.save.unrankedPower[38] * 0.1));
      }
      _root.arcadeHealth -= tmpDamage;
      comboBreak.alp = 10;
   }
   else
   {
      hitNote(acceptableArr[keyNum]);
   }
}
function hitNote(noteNum)
{
   dist = curTimestamp - beatToTimestamp(noteBeatArr[noteNum]);
   if(dist < -300)
   {
      _root.arcadeMiss += 1;
      _root.arcadeCombo = 0;
      tmpDamage = 50 + Math.floor((_root.arcadeAwesome + _root.arcadeGood) / 20) + _root.arcadeMiss;
      if(_root.save.rankedMode != true)
      {
         tmpDamage = Math.ceil(tmpDamage * (1 - _root.save.unrankedPower[38] * 0.1));
      }
      _root.arcadeHealth -= tmpDamage;
      comboBreak.alp = 10;
   }
   else
   {
      tol = 25;
      if(_root.arcadeAwesome >= 200)
      {
         tol = 0;
      }
      if(dist >= -30 && (dist <= 30 || noteLateArr[noteNum] < 1))
      {
         _root.arcadeAwesome += 1;
         if(_root.arcadeAwesome % 100 == 0)
         {
            _root.gainWhiteCoin(1);
         }
         _root.arcadeCombo += 1;
         tmpScore = 1010;
         if(_root.save.rankedMode != true)
         {
            tmpScore = Math.floor(1010 + _root.save.unrankedPower[36] * 50.5);
         }
         if(_root.save.arcadeDifficulty[6] == 1)
         {
            tmpScore = Math.floor(tmpScore * 0.7);
         }
         else if(_root.save.arcadeDifficulty[6] == 3)
         {
            tmpScore = Math.floor(tmpScore * 2.5);
         }
         else if(_root.save.arcadeDifficulty[6] == 4)
         {
            tmpScore = Math.floor(tmpScore * 4);
         }
         _root.arcadeScore += tmpScore;
         if(_root.arcadeCombo >= 10)
         {
            _root.arcadeScore += tmpScore;
            _root.arcadeHealth += 10;
            if(_root.save.rankedMode != true)
            {
               _root.arcadeHealth += _root.save.unrankedPower[37] * 5;
            }
         }
         if(_root.arcadeCombo >= 50)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 100)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 500)
         {
            _root.arcadeScore += tmpScore;
         }
         noteResultArr[noteNum] = 3;
         showJudgement(noteNum,1,1,_root.arcadeCombo);
      }
      else if(dist >= -55 - tol && dist < -30)
      {
         _root.arcadeAwesome += 1;
         if(_root.arcadeAwesome % 100 == 0)
         {
            _root.gainWhiteCoin(1);
         }
         _root.arcadeCombo += 1;
         tmpScore = 1000;
         if(_root.save.rankedMode != true)
         {
            tmpScore = Math.floor(1000 + _root.save.unrankedPower[36] * 50);
         }
         if(_root.save.arcadeDifficulty[6] == 1)
         {
            tmpScore = Math.floor(tmpScore * 0.7);
         }
         else if(_root.save.arcadeDifficulty[6] == 3)
         {
            tmpScore = Math.floor(tmpScore * 2.5);
         }
         else if(_root.save.arcadeDifficulty[6] == 4)
         {
            tmpScore = Math.floor(tmpScore * 4);
         }
         _root.arcadeScore += tmpScore;
         if(_root.arcadeCombo >= 10)
         {
            _root.arcadeScore += tmpScore;
            _root.arcadeHealth += 10;
            if(_root.save.rankedMode != true)
            {
               _root.arcadeHealth += _root.save.unrankedPower[37] * 5;
            }
         }
         if(_root.arcadeCombo >= 50)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 100)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 500)
         {
            _root.arcadeScore += tmpScore;
         }
         noteResultArr[noteNum] = 3;
         showJudgement(noteNum,1,2,_root.arcadeCombo);
      }
      else if(dist > 30 && dist <= 55 + tol)
      {
         _root.arcadeAwesome += 1;
         if(_root.arcadeAwesome % 100 == 0)
         {
            _root.gainWhiteCoin(1);
         }
         _root.arcadeCombo += 1;
         tmpScore = 1000;
         if(_root.save.rankedMode != true)
         {
            tmpScore = Math.floor(1000 + _root.save.unrankedPower[36] * 50);
         }
         if(_root.save.arcadeDifficulty[6] == 1)
         {
            tmpScore = Math.floor(tmpScore * 0.7);
         }
         else if(_root.save.arcadeDifficulty[6] == 3)
         {
            tmpScore = Math.floor(tmpScore * 2.5);
         }
         else if(_root.save.arcadeDifficulty[6] == 4)
         {
            tmpScore = Math.floor(tmpScore * 4);
         }
         _root.arcadeScore += tmpScore;
         if(_root.arcadeCombo >= 10)
         {
            _root.arcadeScore += tmpScore;
            _root.arcadeHealth += 10;
            if(_root.save.rankedMode != true)
            {
               _root.arcadeHealth += _root.save.unrankedPower[37] * 5;
            }
         }
         if(_root.arcadeCombo >= 50)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 100)
         {
            _root.arcadeScore += tmpScore;
         }
         if(_root.arcadeAwesome >= 500)
         {
            _root.arcadeScore += tmpScore;
         }
         noteResultArr[noteNum] = 3;
         showJudgement(noteNum,1,3,_root.arcadeCombo);
      }
      else if(dist >= -300 && dist < 0)
      {
         _root.arcadeGood += 1;
         _root.arcadeCombo += 1;
         _root.arcadeScore += 300;
         if(_root.arcadeCombo >= 10)
         {
            _root.arcadeScore += 300;
            _root.arcadeHealth += 1;
         }
         if(_root.arcadeCombo >= 50)
         {
            _root.arcadeScore += 300;
         }
         noteResultArr[noteNum] = 2;
         showJudgement(noteNum,2,2,_root.arcadeCombo);
      }
      else if(dist > 0 && dist <= 300)
      {
         _root.arcadeGood += 1;
         _root.arcadeCombo += 1;
         _root.arcadeScore += 300;
         if(_root.arcadeCombo >= 10)
         {
            _root.arcadeScore += 300;
            _root.arcadeHealth += 1;
         }
         if(_root.arcadeCombo >= 50)
         {
            _root.arcadeScore += 300;
         }
         noteResultArr[noteNum] = 2;
         showJudgement(noteNum,2,3,_root.arcadeCombo);
      }
      if(noteCurrent < noteNum)
      {
         noteCurrent = noteNum;
      }
   }
}
function showJudgement(noteNum, pgm, earlyLate, comboCount)
{
   judgementInst += 1;
   if(judgementInst > 2)
   {
      judgementInst = 1;
   }
   stage["mmrJudgement" + judgementInst]._x = notePositionArr[noteNum] * 50;
   stage["mmrJudgement" + judgementInst].pgm.gotoAndStop(pgm);
   stage["mmrJudgement" + judgementInst].earlyLate.gotoAndStop(earlyLate);
   if(comboCount > 0)
   {
      stage["mmrJudgement" + judgementInst].comboText.text = comboCount;
   }
   else
   {
      stage["mmrJudgement" + judgementInst].comboText.text = "";
   }
   stage["mmrJudgement" + judgementInst].alp = 250;
   if(pgm <= 2)
   {
      stage["mmrTrace" + judgementInst].gotoAndStop(pgm + 1);
      stage["mmrTrace" + judgementInst]._x = notePositionArr[noteNum] * 50;
      stage["mmrTrace" + judgementInst]._y = noteYposArr[noteNum];
      stage["mmrTrace" + judgementInst].alp = 100;
   }
}
function missNote(noteNum)
{
   _root.arcadeMiss += 1;
   tmpDamage = 100 + Math.floor((_root.arcadeAwesome + _root.arcadeGood) / 10) + _root.arcadeMiss;
   if(_root.save.rankedMode != true)
   {
      tmpDamage = Math.ceil(tmpDamage * (1 - _root.save.unrankedPower[38] * 0.1));
   }
   _root.arcadeHealth -= tmpDamage;
   _root.arcadeCombo = 0;
   noteResultArr[noteNum] = 1;
   if(noteCurrent < noteNum)
   {
      noteCurrent = noteNum;
   }
   showJudgement(noteNum,3,4,0);
}
_root.arcadeAwesome = 0;
_root.arcadeGood = 0;
_root.arcadeMiss = 0;
_root.arcadeCombo = 0;
_root.arcadeHealth = 10000;
_root.arcadeScore = 0;
_root.arcadeMultiplier = 1;
_root.arcadeFakeScore = 0;
holdingLeft = false;
holdingDown = false;
holdingRight = false;
holdingA = false;
holdingS = false;
holdingD = false;
slowMult = 2;
mmrClock = new Date();
curTimestamp = -4000;
savedTimestamp = mmrClock.getTime();
noteBeatArr = new Array();
notePositionArr = new Array();
noteColorArr = new Array();
noteResultArr = new Array();
noteLateArr = new Array();
noteYposArr = new Array();
noteCount = 0;
noteCurrent = 0;
judgementInst = 2;
noteDispArr = new Array();
iter = 0;
onEnterFrame = function()
{
   if(mmrJudgement1.alp > 100)
   {
      mmrJudgement1.alp -= 25;
      mmrJudgement1._alpha = 100;
   }
   else if(mmrJudgement1.alp > 0)
   {
      mmrJudgement1.alp -= 25;
      mmrJudgement1._alpha = mmrJudgement1.alp;
   }
   else if(mmrJudgement1.alp == 0)
   {
      mmrJudgement1.alp = -1;
      mmrJudgement1._x = 600;
      mmrJudgement1._alpha = 0;
   }
   if(mmrJudgement2.alp > 100)
   {
      mmrJudgement2.alp -= 25;
      mmrJudgement2._alpha = 100;
   }
   else if(mmrJudgement2.alp > 0)
   {
      mmrJudgement2.alp -= 25;
      mmrJudgement2._alpha = mmrJudgement2.alp;
   }
   else if(mmrJudgement2.alp == 0)
   {
      mmrJudgement2.alp = -1;
      mmrJudgement2._x = 600;
      mmrJudgement2._alpha = 0;
   }
   if(mmrTrace1.alp > 0)
   {
      mmrTrace1.alp -= 10;
      mmrTrace1._alpha = mmrTrace1.alp;
   }
   else if(mmrTrace1.alp == 0)
   {
      mmrTrace1.alp = -1;
      mmrTrace1._x = 600;
      mmrTrace1._alpha = 0;
   }
   if(mmrTrace2.alp > 0)
   {
      mmrTrace2.alp -= 10;
      mmrTrace2._alpha = mmrTrace2.alp;
   }
   else if(mmrTrace2.alp == 0)
   {
      mmrTrace2.alp = -1;
      mmrTrace2._x = 600;
      mmrTrace2._alpha = 0;
   }
   mmrHealthBar._width = Math.ceil(_root.arcadeHealth / 20);
   if(iter < 10000)
   {
      iter += 1;
      rhythmArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      if(iter % 8 == 0 || noteCount >= 10000)
      {
         rhythmArr = [2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1];
      }
      else if(iter % 4 == 0 || noteCount >= 5000)
      {
         rhythmArr = [2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1];
      }
      else if(iter % 2 == 0 || noteCount >= 1000)
      {
         rhythmArr = [2,0,1,0,1,0,1,0,2,0,1,0,1,0,1,0];
      }
      else
      {
         rhythmArr = [2,0,1,0,1,0,0,0,2,0,1,0,1,0,0,0];
      }
      i = 0;
      while(i <= 15)
      {
         if(rhythmArr[i] < 2 && Math.random() < 0.2 && (Math.random() < 0.3 || i % 2 == 0))
         {
            rhythmArr[i] += 1;
         }
         if(rhythmArr[i] > 0 && Math.random() < 0.3 && (Math.random() < 0.3 || i % 2 != 0))
         {
            rhythmArr[i] -= 1;
         }
         if(rhythmArr[i] == 2 && Math.random() < 0.7 && _root.save.arcadeDifficulty[6] == 1)
         {
            rhythmArr[i] -= 1;
         }
         if(rhythmArr[i] == 1 && Math.random() < 0.7 && _root.save.arcadeDifficulty[6] == 1 && i % 2 != 0)
         {
            rhythmArr[i] -= 1;
         }
         i++;
      }
      rev = 0;
      if((iter + 3) % 4 < 2)
      {
         rev = 4;
      }
      if(_root.save.arcadeDifficulty[6] >= 3)
      {
         pat = 0;
         if(iter % 2 == 1)
         {
            pat = random(59) + 1;
            anp = random(9) + 1;
         }
         i = 0;
         while(i <= 15)
         {
            if(pat > 0)
            {
               if(pat >= 1 && pat <= 9)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = Math.floor((pat - 1) / 3) + ((i + pat) % 3 + 1);
                  noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
               }
               else if(pat >= 10 && pat <= 18)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = Math.floor((pat - 10) / 3) + ((9 - i + pat) % 3 + 1);
                  noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
               }
               else if(pat >= 19 && pat <= 27)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = pat - 18;
                  noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
               }
               else if(pat >= 28 && pat <= 35)
               {
                  noteCount += 1;
                  if(i % 2 == 0)
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = pat - 27;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
                  else
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = pat - 26;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               else if(pat >= 36 && pat <= 43)
               {
                  noteCount += 1;
                  if(i % 2 == 0)
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = pat - 34;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
                  else
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = pat - 35;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               else if(pat >= 44 && pat <= 47)
               {
                  noteCount += 1;
                  if(i <= 8)
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = i + 1;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
                  else
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 17 - i;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               else if(pat >= 48 && pat <= 51)
               {
                  noteCount += 1;
                  if(i <= 8)
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 9 - i;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
                  else
                  {
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = i - 7;
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               else if(pat >= 52 && pat <= 55)
               {
                  if(i <= 11)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = i - Math.floor(i / 3) * 2 + (pat - 51);
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               else if(pat >= 56 && pat <= 59)
               {
                  if(i <= 11)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 10 - (i - Math.floor(i / 3) * 2 + (pat - 55));
                     noteColorArr[noteCount] = (notePositionArr[noteCount] - 1) % 3 + 1;
                  }
               }
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount] = -1;
               if(Math.random() < 0.75 && i % 4 == 0)
               {
                  if(anp != notePositionArr[noteCount])
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = anp;
                     noteColorArr[noteCount] = (anp - 1) % 3 + 1;
                     noteResultArr[noteCount] = 0;
                     noteLateArr[noteCount] = -1;
                  }
               }
            }
            else if(rhythmArr[i] == 2)
            {
               if(Math.random() < 0.5 && noteCount > 500)
               {
                  if(Math.random() < 0.1111111111111111)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 1;
                     noteColorArr[noteCount] = 1;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 4;
                     noteColorArr[noteCount] = 1;
                  }
                  else if(Math.random() < 0.125)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 1;
                     noteColorArr[noteCount] = 1;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 7;
                     noteColorArr[noteCount] = 1;
                  }
                  else if(Math.random() < 0.14285714285714285)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 4;
                     noteColorArr[noteCount] = 1;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 7;
                     noteColorArr[noteCount] = 1;
                  }
                  else if(Math.random() < 0.16666666666666666)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 2;
                     noteColorArr[noteCount] = 2;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 5;
                     noteColorArr[noteCount] = 2;
                  }
                  else if(Math.random() < 0.2)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 2;
                     noteColorArr[noteCount] = 2;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 8;
                     noteColorArr[noteCount] = 2;
                  }
                  else if(Math.random() < 0.25)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 5;
                     noteColorArr[noteCount] = 2;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 8;
                     noteColorArr[noteCount] = 2;
                  }
                  else if(Math.random() < 0.3333333333333333)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 3;
                     noteColorArr[noteCount] = 3;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 6;
                     noteColorArr[noteCount] = 3;
                  }
                  else if(Math.random() < 0.5)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 3;
                     noteColorArr[noteCount] = 3;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 9;
                     noteColorArr[noteCount] = 3;
                  }
                  else
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 6;
                     noteColorArr[noteCount] = 3;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 9;
                     noteColorArr[noteCount] = 3;
                  }
               }
               else if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 1;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 7;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 2;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 8;
                     }
                  }
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 1;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 7;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 3;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 9;
                     }
                  }
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 2;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 8;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 3;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 9;
                     }
                  }
               }
               noteResultArr[noteCount - 1] = 0;
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount - 1] = -1;
               noteLateArr[noteCount] = -1;
            }
            else if(rhythmArr[i] == 1)
            {
               if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 1;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 7;
                     }
                  }
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 2;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 8;
                     }
                  }
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.3333333333333333)
                     {
                        notePositionArr[noteCount] = 3;
                     }
                     else if(Math.random() < 0.5)
                     {
                        notePositionArr[noteCount] = 9;
                     }
                  }
               }
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount] = -1;
               if(noteCount > 3000 && Math.random() < 0.1)
               {
                  notePositionArr[noteCount] = 1 + random(9);
               }
            }
            i++;
         }
      }
      else if(_root.save.arcadeDifficulty[6] == 2)
      {
         i = 0;
         while(i <= 15)
         {
            if(rhythmArr[i] == 2)
            {
               if(Math.random() < 0.5 && noteCount > 500)
               {
                  if(Math.random() < 0.3333333333333333)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 2;
                     noteColorArr[noteCount] = 1;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 6;
                     noteColorArr[noteCount] = 1;
                  }
                  else if(Math.random() < 0.5)
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 3;
                     noteColorArr[noteCount] = 2;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 7;
                     noteColorArr[noteCount] = 2;
                  }
                  else
                  {
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 4;
                     noteColorArr[noteCount] = 3;
                     noteCount += 1;
                     noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                     notePositionArr[noteCount] = 8;
                     noteColorArr[noteCount] = 3;
                  }
               }
               else if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6 - rev;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 2 + rev;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 7 - rev;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 3 + rev;
                     }
                  }
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6 - rev;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 2 + rev;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 8 - rev;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 4 + rev;
                     }
                  }
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 7 - rev;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 3 + rev;
                     }
                  }
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 8 - rev;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 4 + rev;
                     }
                  }
               }
               noteResultArr[noteCount - 1] = 0;
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount - 1] = -1;
               noteLateArr[noteCount] = -1;
            }
            else if(rhythmArr[i] == 1)
            {
               if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6 - rev;
                  noteColorArr[noteCount] = 1;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 2 + rev;
                     }
                  }
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 7 - rev;
                  noteColorArr[noteCount] = 2;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 3 + rev;
                     }
                  }
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 8 - rev;
                  noteColorArr[noteCount] = 3;
                  if(noteCount > 200 && Math.random() < 0.2 + noteCount / 10000)
                  {
                     if(Math.random() < 0.1 || Math.random() < 0.9 && i % 2 == 0)
                     {
                        notePositionArr[noteCount] = 4 + rev;
                     }
                  }
               }
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount] = -1;
               if(noteCount > 3000 && Math.random() < 0.1)
               {
                  notePositionArr[noteCount] = 1 + random(9);
               }
            }
            i++;
         }
      }
      else if(_root.save.arcadeDifficulty[6] == 1)
      {
         i = 0;
         while(i <= 15)
         {
            if(rhythmArr[i] == 2)
            {
               if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
               }
               noteResultArr[noteCount - 1] = 0;
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount - 1] = -1;
               noteLateArr[noteCount] = -1;
            }
            else if(rhythmArr[i] == 1)
            {
               if(Math.random() < 0.3333333333333333)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 4;
                  noteColorArr[noteCount] = 1;
               }
               else if(Math.random() < 0.5)
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 5;
                  noteColorArr[noteCount] = 2;
               }
               else
               {
                  noteCount += 1;
                  noteBeatArr[noteCount] = (iter - 1) * 16 + i;
                  notePositionArr[noteCount] = 6;
                  noteColorArr[noteCount] = 3;
               }
               noteResultArr[noteCount] = 0;
               noteLateArr[noteCount] = -1;
               if(noteCount > 3000 && Math.random() < 0.1)
               {
                  notePositionArr[noteCount] = 1 + random(9);
               }
            }
            i++;
         }
      }
   }
   mmrClock = new Date();
   timestampSa = mmrClock.getTime() - savedTimestamp;
   if(timestampSa < 10)
   {
      timestampSa = 10;
   }
   if(timestampSa > 160)
   {
      timestampSa = 160;
   }
   savedTimestamp = mmrClock.getTime();
   curTimestamp += timestampSa;
   curBeat = timestampToBeat(curTimestamp);
   measLine._y = (curBeat - Math.ceil(curBeat / 8) * 8) * 35 + 250;
   i = 1;
   while(i <= 35)
   {
      j = Math.floor((noteCurrent + 25 - i) / 35) * 35 + i;
      if(j < 1 || j > noteCount)
      {
         xPos = -999;
         yPos = -999;
         frm = 1;
      }
      else if(noteResultArr[j] != 0)
      {
         xPos = -999;
         yPos = -999;
         frm = noteColorArr[j];
      }
      else
      {
         xPos = notePositionArr[j] * 50;
         yPos = (curBeat - noteBeatArr[j]) * 35 + 250;
         frm = noteColorArr[j];
         if(yPos > 250)
         {
            yPos = 250 + (yPos - 250) / 5;
            if(yPos > 270)
            {
               yPos = 270;
            }
            noteLateArr[j] += 1;
            if(curTimestamp - beatToTimestamp(noteBeatArr[j]) > 300 && noteLateArr[j] > 1)
            {
               missNote(j);
            }
         }
         noteYposArr[j] = yPos;
      }
      if(yPos > -50)
      {
         stage["mmrNote" + i]._y = yPos;
         stage["mmrNote" + i]._x = xPos;
         if(stage["mmrNote" + i]._currentframe != frm + _root.save.arcadeMmrNoteSkin * 3)
         {
            stage["mmrNote" + i].gotoAndStop(frm + _root.save.arcadeMmrNoteSkin * 3);
         }
      }
      else
      {
         stage["mmrNote" + i]._y = -999;
      }
      i++;
   }
   if(Key.isDown(_root.saveGlobal.keyMmrLeft1) && holdingLeft == false)
   {
      holdingLeft = true;
      pressKey(1);
   }
   if(Key.isDown(_root.saveGlobal.keyMmrDown1) && holdingDown == false)
   {
      holdingDown = true;
      pressKey(2);
   }
   if(Key.isDown(_root.saveGlobal.keyMmrRight1) && holdingRight == false)
   {
      holdingRight = true;
      pressKey(3);
   }
   if(Key.isDown(_root.saveGlobal.keyMmrLeft2) && holdingA == false)
   {
      holdingA = true;
      pressKey(1);
   }
   if(Key.isDown(_root.saveGlobal.keyMmrDown2) && holdingS == false)
   {
      holdingS = true;
      pressKey(2);
   }
   if(Key.isDown(_root.saveGlobal.keyMmrRight2) && holdingD == false)
   {
      holdingD = true;
      pressKey(3);
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrLeft1))
   {
      holdingLeft = false;
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrDown1))
   {
      holdingDown = false;
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrRight1))
   {
      holdingRight = false;
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrLeft2))
   {
      holdingA = false;
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrDown2))
   {
      holdingS = false;
   }
   if(!Key.isDown(_root.saveGlobal.keyMmrRight2))
   {
      holdingD = false;
   }
   if(_root.arcadeHealth > 10000)
   {
      _root.arcadeHealth = 10000;
   }
   if(_root.arcadeHealth <= 0)
   {
      _parent.gotoAndStop(36);
   }
   _root.arcadeFakeScore += Math.ceil((_root.arcadeScore - _root.arcadeFakeScore) / 1.1);
   _parent.scoreText.text = _root.withComma(_root.arcadeFakeScore);
   _parent.awesomeText.text = _root.arcadeAwesome;
   _parent.goodText.text = _root.arcadeGood;
   _parent.missText.text = _root.arcadeMiss;
};

session.root=_root;session.step=dt=>drive(session,dt,()=>{clock+=25;onEnterFrame();});session.hit=lane=>{if(!session.running||!Number.isInteger(lane)||lane<1||lane>3)return false;pressKey(lane);_root.arcadeHealth=globalThis.Math.min(10000,_root.arcadeHealth);if(_root.arcadeHealth<=0)session.running=false;return true;};session.state=()=>({timestamp:curTimestamp,beat:timestampToBeat(curTimestamp),notes:Array.from({length:35},(_,i)=>({x:stage['mmrNote'+(i+1)]._x,y:stage['mmrNote'+(i+1)]._y,color:stage['mmrNote'+(i+1)]._currentframe})),next:Array.from({length:globalThis.Math.max(0,globalThis.Math.min(noteCount,noteCurrent+25)-globalThis.Math.max(1,noteCurrent-10)+1)},(_,i)=>globalThis.Math.max(1,noteCurrent-10)+i).filter(i=>noteResultArr[i]===0).slice(0,12).map(i=>({time:beatToTimestamp(noteBeatArr[i]),color:noteColorArr[i],position:notePositionArr[i]}))});return session;}
