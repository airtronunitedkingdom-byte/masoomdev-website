import { onRequest as adminRequest } from '../functions/api/admin/[[path]].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/admin' || url.pathname.startsWith('/api/admin/')) {
      return adminRequest({ request, env, context: ctx });
    }
    return env.ASSETS.fetch(request);
  }
};
