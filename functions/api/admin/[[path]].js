const REPO='airtronunitedkingdom-byte/masoomdev-website';
const BRANCH='main';
const enc=new TextEncoder(),dec=new TextDecoder();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const cookie=(name,value,age=0)=>name+'='+encodeURIComponent(value)+'; Path=/; HttpOnly; Secure; SameSite=Lax; '+(age?'Max-Age='+age:'Max-Age=0');
const parseCookies=req=>Object.fromEntries((req.headers.get('cookie')||'').split(';').map(x=>x.trim().split('=').map(decodeURIComponent)).filter(x=>x.length===2));
const base64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unbase64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),x=>x.charCodeAt(0));
async function key(secret){return crypto.subtle.importKey('raw',await crypto.subtle.digest('SHA-256',enc.encode(secret)),{name:'AES-GCM'},false,['encrypt','decrypt'])}
async function seal(obj,secret){let iv=crypto.getRandomValues(new Uint8Array(12));let encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(secret),enc.encode(JSON.stringify(obj)));return base64(iv)+'.'+base64(encrypted)}
async function unseal(value,secret){try{let [a,b]=value.split('.');return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(a)},await key(secret),unbase64(b))))}catch{return null}}
async function github(token,path,options={}){return fetch('https://api.github.com/'+path,{...options,headers:{'accept':'application/vnd.github+json','authorization':'Bearer '+token,'x-github-api-version':'2022-11-28','user-agent':'MasoomDev-Admin',...(options.headers||{})}})}
const routePath=req=>new URL(req.url).pathname.replace(/^\/api\/admin\/?/,'');
export async function onRequest({request,env}){
 const url=new URL(request.url),route=routePath(request),cookies=parseCookies(request);
 if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.ADMIN_GITHUB_ID||!env.ADMIN_SESSION_SECRET)return json({error:'Admin is not configured. Set the four Cloudflare secrets.'},503);
 const origin=url.origin,redirect=origin+'/api/admin/callback';
 if(route==='login'&&request.method==='GET'){
  const state=base64(crypto.getRandomValues(new Uint8Array(32)));
  return new Response(null,{status:302,headers:{location:'https://github.com/login/oauth/authorize?'+new URLSearchParams({client_id:env.GITHUB_CLIENT_ID,redirect_uri:redirect,scope:'repo',state}), 'set-cookie':cookie('md_oauth_state',await seal({state,exp:Date.now()+600000},env.ADMIN_SESSION_SECRET),600),'cache-control':'no-store'}});
 }
 if(route==='callback'&&request.method==='GET'){
  const state=await unseal(cookies.md_oauth_state||'',env.ADMIN_SESSION_SECRET);
  if(!state||state.exp<Date.now()||state.state!==url.searchParams.get('state'))return json({error:'Invalid or expired OAuth state'},403);
  const code=url.searchParams.get('code');if(!code)return json({error:'OAuth code missing'},400);
  const exchange=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:redirect})});
  const data=await exchange.json();if(!data.access_token)return json({error:'GitHub login failed'},401);
  const profile=await github(data.access_token,'user');if(!profile.ok)return json({error:'Cannot verify GitHub identity'},401);
  const user=await profile.json();if(String(user.id)!==String(env.ADMIN_GITHUB_ID))return json({error:'This GitHub account is not authorized'},403,{'set-cookie':cookie('md_oauth_state','')});
  const session=await seal({token:data.access_token,id:user.id,login:user.login,exp:Date.now()+21600000},env.ADMIN_SESSION_SECRET);
  const headers=new Headers({location:'/admin/','cache-control':'no-store'});headers.append('set-cookie',cookie('md_admin_session',session,21600));headers.append('set-cookie',cookie('md_oauth_state',''));return new Response(null,{status:302,headers});
 }
 if(route==='logout'&&request.method==='POST')return json({ok:true},200,{'set-cookie':cookie('md_admin_session','')});
 const session=await unseal(cookies.md_admin_session||'',env.ADMIN_SESSION_SECRET);
 if(!session||session.exp<Date.now()||String(session.id)!==String(env.ADMIN_GITHUB_ID))return json({error:'Sign in with your authorized GitHub account'},401);
 if(route==='me'&&request.method==='GET')return json({login:session.login,branch:BRANCH,repo:REPO});
 if(route==='posts'&&request.method==='GET'){
  const res=await github(session.token,'repos/'+REPO+'/git/trees/'+BRANCH+'?recursive=1');
  if(!res.ok)return json({error:'Unable to read repository',status:res.status},502);
  const data=await res.json();return json({posts:data.tree.filter(x=>x.type==='blob'&&/^blog\/[a-z0-9-]+\/index\.html$/.test(x.path)).map(x=>({path:x.path,slug:x.path.split('/')[1]}))});
 }
 if(route==='post'&&request.method==='GET'){
  const slug=url.searchParams.get('slug');if(!/^[a-z0-9-]{1,90}$/.test(slug||''))return json({error:'Invalid slug'},400);
  const res=await github(session.token,'repos/'+REPO+'/contents/blog/'+slug+'/index.html?ref='+BRANCH);
  if(!res.ok)return json({error:'Cannot load article',status:res.status},res.status===404?404:502);
  const data=await res.json();return json({slug,sha:data.sha,content:dec.decode(unbase64(data.content.replace(/\s/g,'')))});
 }
 if(route==='delete'&&request.method==='POST'){
  if(request.headers.get('origin')!==origin)return json({error:'Invalid request origin'},403);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400)}
  const slug=body.slug;
  if(typeof slug!=='string'||!/^[a-z0-9-]{1,90}$/.test(slug)||typeof body.sha!=='string'||!/^[0-9a-f]{40}$/.test(body.sha)||body.confirm!==slug)return json({error:'Invalid deletion confirmation'},400);
  const path='blog/'+slug+'/index.html';
  const res=await github(session.token,'repos/'+REPO+'/contents/'+path,{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({message:'Admin: delete blog/'+slug,sha:body.sha,branch:BRANCH})});
  const data=await res.json();if(!res.ok)return json({error:data.message||'Deletion failed',status:res.status},res.status===404?404:res.status===409?409:502);
  return json({ok:true,commit:data.commit?.sha,slug});
 }
 if(route==='publish'&&request.method==='POST'){
  if(request.headers.get('origin')!==origin)return json({error:'Invalid request origin'},403);
  if(Number(request.headers.get('content-length')||0)>180000)return json({error:'Article too large'},413);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400)}
  if(!/^[a-z0-9-]{1,90}$/.test(body.slug||'')||typeof body.content!=='string'||body.content.length>120000||!body.content.includes('<article')||!body.content.includes('</article>'))return json({error:'Invalid article HTML or slug'},400);
  if(body.sha&&!/^[0-9a-f]{40}$/.test(body.sha))return json({error:'Invalid version'},400);
  const path='blog/'+body.slug+'/index.html';
  const payload={message:'Admin: update blog/'+body.slug,content:btoa(Array.from(enc.encode(body.content),x=>String.fromCharCode(x)).join('')),branch:BRANCH};if(body.sha)payload.sha=body.sha;
  const res=await github(session.token,'repos/'+REPO+'/contents/'+path,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const data=await res.json();if(!res.ok)return json({error:data.message||'Publishing failed',status:res.status},res.status===409?409:502);
  return json({ok:true,commit:data.commit?.sha,url:'/blog/'+body.slug+'/'});
 }
 return json({error:'Not found'},404);
}
