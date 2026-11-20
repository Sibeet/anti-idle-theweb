import {GARDEN_ART} from '../site/garden-art.mjs';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {ENEMY_DATA,REGIONS} from '../site/regions.mjs';
import {GEAR} from '../site/gear-data.mjs';
import {ART} from '../site/art-data.mjs';
assert.equal(new Set(ENEMY_DATA.map(e=>e.id)).size,99);assert.equal(ENEMY_DATA.filter(e=>e.id<=34&&e.boss).length,4);
assert.equal(GEAR.filter(g=>g.slot==='weapon').length,10);assert.equal(GEAR.filter(g=>g.slot!=='weapon').length,25);
for(const e of ENEMY_DATA){const art=ART['enemy'+e.id];assert.ok(art,e.name);const bytes=readFileSync(new URL('../site/'+art.src,import.meta.url));assert.equal(bytes.readUInt32BE(16),art.width);assert.equal(bytes.readUInt32BE(20),art.height);const [x,y,w,h]=art.crop.split(' ').map(Number);assert.ok(w>0&&h>0&&x>=0&&y>=0&&x+w<=art.width&&y+h<=art.height);}
for(const g of GEAR)if(g.slot==='weapon')assert.ok(existsSync(new URL('../site/'+ART['weapon'+g.id].src,import.meta.url)),g.name);
for(const z of REGIONS){assert.ok(z.pool.every(i=>ENEMY_DATA[i]));assert.ok(existsSync(new URL('../site/assets/'+z.background,import.meta.url)));}
console.log('PASS: original early roster/recipe counts, complete original art coverage, real PNG dimensions and source-stage crops.');

assert.equal(Object.keys(GARDEN_ART).length,16);for(const art of Object.values(GARDEN_ART)){const bytes=readFileSync(new URL('../site/'+art.src,import.meta.url));assert.equal(bytes.readUInt32BE(16),art.width);assert.equal(bytes.readUInt32BE(20),art.height);}
