// Source: sprite5992/frame1/PlaceObject2_4653_2720 enterFrame, lines340-362.
export function resetEnemyEffects(a){a.enemyRampage=false;a.enemyEffectClock=0;}
export function effectiveEnemy(a,enemy){if(!a.enemyRampage)return enemy;const result={...enemy,speed:enemy.speed*1.2};for(const key of ['attack','defense','accuracy','evasion'])result[key]=Math.floor(enemy[key]*1.5);return result;}
export function enemyEffects(a,enemy,dt,rng=Math.random){
 const events=[];if(a.zone===0||!a.enemyAlive||a.enemyHp<=0)return events;
 a.enemyEffectClock=(a.enemyEffectClock??0)+dt;
 while(a.enemyEffectClock>=.025-1e-10){a.enemyEffectClock=Math.max(0,a.enemyEffectClock-.025);
  if(enemy.heal>0&&a.enemyHp<enemy.hp&&rng()<.01){const amount=Math.min(enemy.hp-a.enemyHp,Math.floor((.8+rng())*enemy.heal));a.enemyHp+=amount;events.push({type:'enemyHeal',amount,name:enemy.name});}
  if(!a.enemyRampage&&enemy.rampagePct>0&&a.enemyHp/enemy.hp*100<enemy.rampagePct){a.enemyRampage=true;events.push({type:'enemyRampage',name:enemy.name});}
 }
 return events;
}
