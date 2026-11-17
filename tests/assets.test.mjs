import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const site=new URL('../site/',import.meta.url);
const html=readFileSync(new URL('index.html',site),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){assert.ok(!m[1].startsWith('/'),'Paths must work under a repository subdirectory');assert.ok(existsSync(new URL(m[1],site)),`Missing ${m[1]}`);}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate DOM ids');
const app=readFileSync(new URL('app.mjs',site),'utf8');for(const m of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(m[1]),`Missing UI id ${m[1]}`);
const provenance=JSON.parse(readFileSync(new URL('../ASSET-PROVENANCE.json',import.meta.url),'utf8'));
for(const item of provenance.assets){const bytes=readFileSync(new URL(item.file,site));assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);assert.equal(bytes.subarray(1,4).toString(),'PNG');}
assert.ok(html.includes('viewBox="185 165 500 200"'));assert.ok(html.includes('Original Anti-Idle player character'));
console.log('PASS: relative asset URLs, DOM bindings, unique ids, source asset hashes and stage bounds.');
