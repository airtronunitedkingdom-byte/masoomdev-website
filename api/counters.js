// Vercel Function: shared public counters backed by Upstash Redis REST API.
const COOKIE = "mdv";
const COOKIE_TTL = 31536000;
const VALID_EVENTS = new Set(["download", "game"]);

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis REST environment variables are missing");
  return { url: url.replace(/\/$/, ""), token };
}

async function redis(command) {
  const { url, token } = redisEnv();
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Redis request failed");
  return data.result;
}

function getVisitorId(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)mdv=([a-zA-Z0-9-]{16,80})/);
  return match ? match[1] : null;
}

function newVisitorId() {
  return crypto.randomUUID();
}

function setVisitorCookie(res, id) {
  res.setHeader("Set-Cookie", `${COOKIE}=${id}; Path=/; Max-Age=${COOKIE_TTL}; SameSite=Lax; Secure`);
}

async function registerVisitor(id) {
  const created = await redis(["SET", `md:counters:visitor:${id}`, "1", "NX"]);
  if (created) await redis(["INCR", "md:counters:visitors"]);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let visitorId = getVisitorId(req);
    if (!visitorId) {
      visitorId = newVisitorId();
      setVisitorCookie(res, visitorId);
    }
    await registerVisitor(visitorId);

    if (req.method === "POST") {
      const event = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
      if (!event || !VALID_EVENTS.has(event.type)) return res.status(400).json({ error: "Invalid event type" });
      if (event.type === "download") await redis(["INCR", "md:counters:downloads"]);
      if (event.type === "game") await redis(["INCR", "md:counters:games"]);
      return res.status(200).json({ ok: true });
    }

    const [visitors, downloads, games] = await Promise.all([
      redis(["GET", "md:counters:visitors"]),
      redis(["GET", "md:counters:downloads"]),
      redis(["GET", "md:counters:games"]),
    ]);
    return res.status(200).json({
      visitors: Number(visitors || 0),
      downloads: Number(downloads || 0),
      games: Number(games || 0),
    });
  } catch (error) {
    console.error("Counter API error:", error);
    return res.status(503).json({ error: "Counters temporarily unavailable" });
  }
}
