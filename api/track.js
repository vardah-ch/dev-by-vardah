import { readJSON, writeJSON, day } from './_lib/store.js';

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|vercel|lighthouse|headless/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (BOT.test(req.headers['user-agent'] || '')) return res.status(204).end();
  const body = typeof req.body === 'string' ? safe(req.body) : (req.body || {});
  const path = String(body.path || '/').slice(0, 80);
  let ref = 'direct';
  try {
    if (body.ref) {
      const h = new URL(body.ref).hostname.replace(/^www\./, '');
      if (h && !h.endsWith('devbyvardah.vercel.app')) ref = h;
    }
  } catch (e) {}
  const key = `stats/${day()}.json`;
  const s = await readJSON(key, { views: 0, paths: {}, refs: {} });
  s.views += 1;
  s.paths[path] = (s.paths[path] || 0) + 1;
  s.refs[ref] = (s.refs[ref] || 0) + 1;
  await writeJSON(key, s);
  res.status(204).end();
}

function safe(t) { try { return JSON.parse(t); } catch (e) { return {}; } }
