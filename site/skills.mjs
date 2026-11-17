import {arenaRank} from './equipment.mjs';
// Original passive definitions: sprite 5444 frames 2 and 7; costs: sprite 5420.
export const SKILLS=[
 {id:54,name:'Basic Attack',rank:1,max:20,effect:'Basic / Auto power +5%'},
 {id:1,name:'Quick Attack',rank:10,max:30,effect:'Three hits; power +1%, delay -2'},
 {id:2,name:'Power Attack',rank:30,max:30,effect:'Power +10%, delay -2'},
 {id:5,name:'Heal',rank:10,max:10,effect:'Heal +4% MaxHP; Defense buff'},
 {id:9,name:'Strength Enhancement',rank:10,max:10,effect:'Attack / Defense +1%'},
 {id:16,name:'Weapon Booster',rank:80,max:20,effect:'Attack Speed +2%'},
 {id:18,name:'Critical Force',rank:90,max:30,effect:'Critical Damage +2%'},
 {id:19,name:'Critical Chance',rank:100,max:10,effect:'Critical Chance +1%'}
];
export function skillLevel(r,id){return r.skills?.[id]??0;}
export function skillCost(r,id){return Math.min(10,skillLevel(r,id)+1);}
export function raiseSkill(r,id){const s=SKILLS.find(s=>s.id===id),level=skillLevel(r,id);if(!s||!r.arena||arenaRank(r).rank<s.rank||level>=s.max||r.arena.skillPoints<skillCost(r,id))return false;r.arena.skillPoints-=skillCost(r,id);r.skills??={};r.skills[id]=level+1;return true;}
export function lowerSkill(r,id){const s=SKILLS.find(s=>s.id===id),level=skillLevel(r,id);if(!s||!r.arena||level<=0)return false;r.arena.skillPoints+=Math.min(10,level);r.skills[id]=level-1;return true;}
export function validSkills(skills,r){return skills&&typeof skills==='object'&&!Array.isArray(skills)&&Object.entries(skills).every(([id,n])=>{const s=SKILLS.find(s=>String(s.id)===id);return s&&Number.isInteger(n)&&n>=0&&n<=s.max&&(n===0||arenaRank(r).rank>=s.rank);});}

export const ACTIVE_SKILLS=[{id:'basic',name:'Basic Attack',rank:1,key:'G'},{id:'quick',name:'Quick Attack',rank:10,key:'Q'},{id:'power',name:'Power Attack',rank:30,key:'W'},{id:'heal',name:'Heal',rank:10,key:'H'}];
export function activeSkill(r,id){const n=skillLevel(r,{basic:54,quick:1,power:2,heal:5}[id]);switch(id){case 'basic':return {id,mp:0,power:100+n*5,delay:175,hits:1};case 'quick':return {id,mp:70+n,power:45+n,delay:160-2*n,hits:3};case 'power':return {id,mp:700+10*n,power:390+10*n,delay:210-2*n,hits:1};case 'heal':return {id,mp:200+10*n,power:750+25*n,heal:10+4*n,delay:350-5*n,hits:1,duration:Math.floor(3+n/10)};default:return null;}}
