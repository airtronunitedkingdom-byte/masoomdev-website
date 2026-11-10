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

check('Canonical domain on primary pages',()=>{
  for(const p of ['index.html','apps/index.html','tools/index.html','games/index.html','extensions/index.html','about/index.html','seo-tools/index.html']){
    const route=p==='index.html'?'/':'/'+p.replace(/index.html$/,'');
    assert.ok(read(p).includes('rel="canonical" href="https://masoomdev.online'+route+'"'),p);
  }
});
check('Robots points to production sitemap',()=>assert.ok(read('robots.txt').includes('Sitemap: https://masoomdev.online/sitemap.xml')));
check('Sitemap contains public pages and excludes admin',()=>{
  const xml=read('sitemap.xml');
  assert.ok(xml.includes('<loc>https://masoomdev.online/blog/</loc>'));
  assert.ok(xml.includes('<loc>https://masoomdev.online/extensions/</loc>'));
  assert.ok(!xml.includes('tools.masoomdev.online'));
  assert.ok(!xml.includes('<loc>https://masoomdev.online/admin/</loc>'));
});
check('PWA service worker avoids admin and API caching',()=>{
  const sw=read('sw.js');
  assert.ok(sw.includes("url.pathname.startsWith('/api/')"));
  assert.ok(sw.includes("url.pathname.startsWith('/admin/')"));
  assert.ok(sw.includes("request.headers.has('authorization')"));
  assert.ok(sw.includes("const VERSION='masoomdev-offline-v9'"));
});
check('Universal navigation syntax',()=>execFileSync(process.execPath,['--check',new URL('assets/md-desktop-mobile-nav.js',root).pathname],{stdio:'pipe'}));
console.log('\n'+count+' checks passed'+(process.exitCode?' (some failed)':'')+'.');