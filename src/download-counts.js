import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const downloads = pgTable('extension_download_counts', {
  extensionSlug: text('extension_slug').primaryKey(),
  downloadCount: bigint('download_count', { mode: 'number' }).notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const allowedSlugs = new Set([
  'masoom-text-expander',
  'shein-image-downloader',
  'ebay-fee-profit-calculator',
  'aliexpress-order-filler',
]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });

export async function handleDownloadCounts(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/download-counts') return null;
  if (!env.DATABASE_URL) return json({ error: 'Download counts are not configured.' }, 503);

  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return json({ error: 'Invalid request origin.' }, 403);

  try {
    const client = neon(env.DATABASE_URL);
    const db = drizzle({ client, schema: { downloads } });

    if (request.method === 'GET') {
      const rows = await db
        .select({ slug: downloads.extensionSlug, count: downloads.downloadCount })
        .from(downloads);
      return json({ counts: Object.fromEntries(rows.map(({ slug, count }) => [slug, count])) });
    }

    if (request.method === 'POST') {
      const contentLength = Number(request.headers.get('content-length') || 0);
      if (contentLength > 1024) return json({ error: 'Request too large.' }, 413);
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
        return json({ error: 'Expected JSON.' }, 415);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'Invalid JSON.' }, 400);
      }

      if (!allowedSlugs.has(body?.slug)) return json({ error: 'Unknown extension.' }, 400);

      const [row] = await db
        .insert(downloads)
        .values({ extensionSlug: body.slug, downloadCount: 1 })
        .onConflictDoUpdate({
          target: downloads.extensionSlug,
          set: {
            downloadCount: sql`${downloads.downloadCount} + 1`,
            updatedAt: new Date(),
          },
        })
        .returning({ slug: downloads.extensionSlug, count: downloads.downloadCount });

      return json(row);
    }

    return json({ error: 'Method not allowed.' }, 405);
  } catch {
    return json({ error: 'Unable to load download counts.' }, 503);
  }
}
