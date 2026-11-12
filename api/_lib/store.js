import { put, get, list, del } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

const opts = { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' };

export async function readJSON(pathname, fallback) {
  try {
    const r = await get(pathname, { access: 'private', useCache: false });
    if (!r || r.statusCode !== 200) return fallback;
    return JSON.parse(await new Response(r.stream).text());
  } catch (e) {
    return fallback;
  }
}

export async function writeJSON(pathname, data) {
  await put(pathname, JSON.stringify(data), opts);
}

export async function listPaths(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    r.blobs.forEach(b => out.push(b.pathname));
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function remove(pathname) {
  await del(pathname);
}

export function isAdmin(req) {
  const want = process.env.ADMIN_PASSWORD || '';
  const got = String(req.headers['x-admin-key'] || '');
  if (!want || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export function day(d = new Date()) {
  // Pakistan time, so "today" matches her day
  return new Date(d.getTime() + 5 * 3600 * 1000).toISOString().slice(0, 10);
}

export const DEFAULT_SETTINGS = {
  availability: 'Open to freelance projects and research positions',
  showAvailability: true,
  banner: '',
  bannerLink: ''
};
