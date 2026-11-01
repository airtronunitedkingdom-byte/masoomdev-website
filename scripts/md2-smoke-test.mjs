/* Run with: node scripts/md2-smoke-test.mjs
   Static checks only. Browser interaction and responsive visual QA remain manual. */
import {readFileSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const pages=['index.html','apps/index.html','tools/index.html','games/index.html','extensions/index.html','about/index.html'];
const assets=['assets/md2-discovery.js','assets/md2-home-motion.js','assets/md2-buddy.js','assets/md2-quests.js','assets/md2-achievements.js','assets/md2-share-card.js'];
let count=0;
function check(name,fn){try{fn();console.log('PASS',name);count++}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}}
for(const p of pages){check('Page exists: '+p,()=>assert.ok(existsSync(new URL(p,root))));check('Buddy integrated: '+p,()=>assert.ok(read(p).includes('/assets/md2-buddy.js')))}
for(const p of assets){check('JavaScript syntax: '+p,()=>{execFileSync(process.execPath,['--check',new URL(p,root).pathname],{stdio:'pipe'})})}
for(const p of ['index.html','games/index.html','tools/index.html'])check('Quest script: '+p,()=>assert.ok(read(p).includes('/assets/md2-quests.js')));
for(const p of ['index.html','games/index.html','tools/index.html','apps/index.html'])check('Achievements script: '+p,()=>assert.ok(read(p).includes('/assets/md2-achievements.js')));
for(const asset of ['md2-discovery.js','md2-home-motion.js','md2-share-card.js'])check('Homepage asset: '+asset,()=>assert.ok(read('index.html').includes('/assets/'+asset)));
check('No remote tracking in new assets',()=>{for(const p of assets){const src=read(p);assert.ok(!/fetch\s*\(|XMLHttpRequest|sendBeacon/.test(src),p)}});
console.log('\n'+count+' checks passed'+(process.exitCode?' (some failed)':'')+'.');