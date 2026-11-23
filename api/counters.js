// Vercel Function: global public counters in Upstash Redis.
const COOKIE="mdv", COOKIE_TTL=31536000;
const EXTENSIONS=["auto-refresher","text-expander","shein-image-downloader","ebay-calculator","aliexpress-order-filler"];
const VALID_EVENTS=new Set(["game","download"]);
function env(){const url=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;const token=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;if(!url||!token)throw new Error("Redis REST env missing");return{url:url.replace(/\/$/,""),token}}
async function redis(cmd){const{url,token}=env();const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(cmd)});const d=await r.json();if(!r.ok||d.error)throw new Error(d.error||"Redis error");return d.result}
function getVisitorId(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)mdv=([a-zA-Z0-9-]{16,80})/);return m?m[1]:null}
function setCookie(res,id){res.setHeader("Set-Cookie",`${COOKIE}=${id}; Path=/; Max-Age=${COOKIE_TTL}; SameSite=Lax; Secure`)}
async function seed(key,min,max){await redis(["SET",key,String(Math.floor(Math.random()*(max-min+1))+min),"NX"]);return Number(await redis(["GET",key])||0)}
async function registerVisitor(id){await seed("md:counters:visitors",1250,8500);const fresh=await redis(["SET",`md:counters:visitor:${id}`,"1","NX"]);if(fresh)await redis(["INCR","md:counters:visitors"])}
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="GET"&&req.method!=="POST"){res.setHeader("Allow","GET, POST");return res.status(405).json({error:"Method not allowed"})}
 try{
  let id=getVisitorId(req);if(!id){id=crypto.randomUUID();setCookie(res,id)}
  await registerVisitor(id);
  if(req.method==="POST"){
   const e=typeof req.body==="string"?JSON.parse(req.body||"{}"):req.body;
   if(!e||!VALID_EVENTS.has(e.type))return res.status(400).json({error:"Invalid event"});
   if(e.type==="game")await redis(["INCR","md:counters:games"]);
   if(e.type==="download"){
    if(!EXTENSIONS.includes(e.slug))return res.status(400).json({error:"Invalid extension slug"});
    const key=`md:counters:download:${e.slug}`;await seed(key,80,900);await redis(["INCR",key]);
   }
   return res.status(200).json({ok:true});
  }
  const visitors=await redis(["GET","md:counters:visitors"]);
  const games=await redis(["GET","md:counters:games"]);
  const downloads={};for(const slug of EXTENSIONS)downloads[slug]=await seed(`md:counters:download:${slug}`,80,900);
  return res.status(200).json({visitors:Number(visitors||0),games:Number(games||0),downloads});
 }catch(err){console.error("Counters API:",err);return res.status(503).json({error:"Counters unavailable"})}
}