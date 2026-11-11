import { onRequest as adminRequest } from '../functions/api/admin/[[path]].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/admin' || url.pathname.startsWith('/api/admin/')) {
      return adminRequest({ request, env, context: ctx });
    }

    // Cloudflare Workers static assets do not always resolve nested
    // directory URLs in the same way as a traditional static host.
    // Try the normal asset first, then explicitly resolve index.html
    // for directory routes without changing assets or API behavior.
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || (request.method !== 'GET' && request.method !== 'HEAD')) {
      return response;
    }

    const path = url.pathname;
    if (path === '/' || /\.[^/]+$/.test(path)) return response;

    const fallbackUrl = new URL(url);
    fallbackUrl.pathname = path.endsWith('/') ? path + 'index.html' : path + '/index.html';
    const fallback = await env.ASSETS.fetch(new Request(fallbackUrl, request));
    return fallback.status === 404 ? response : fallback;
  }
};
