import { readJSON, writeJSON, listPaths, remove, isAdmin, day, DEFAULT_SETTINGS } from './_lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Wrong password' });
  const b = req.body || {};

  if (b.action === 'overview') {
    const days = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) days.push(day(new Date(now - i * 86400000)));
    const stats = await Promise.all(days.map(d => readJSON(`stats/${d}.json`, { views: 0, paths: {}, refs: {} })));
    const leadPaths = (await listPaths('leads/')).sort().reverse().slice(0, 100);
    const leads = (await Promise.all(leadPaths.map(p => readJSON(p, null)))).filter(Boolean);
    const settings = { ...DEFAULT_SETTINGS, ...(await readJSON('settings.json', {})) };
    return res.status(200).json({ days: days.map((d, i) => ({ day: d, ...stats[i] })), leads, settings });
  }

  if (b.action === 'saveSettings') {
    const s = b.settings || {};
    const clean = {
      availability: String(s.availability || '').slice(0, 120),
      showAvailability: !!s.showAvailability,
      banner: String(s.banner || '').slice(0, 160),
      bannerLink: /^https?:\/\//.test(s.bannerLink || '') ? String(s.bannerLink).slice(0, 300) : ''
    };
    await writeJSON('settings.json', clean);
    return res.status(200).json({ ok: true, settings: clean });
  }

  if (b.action === 'markLead' || b.action === 'deleteLead') {
    const id = String(b.id || '');
    if (!/^[\w-]+$/.test(id)) return res.status(400).json({ error: 'Bad id' });
    const p = `leads/${id}.json`;
    if (b.action === 'deleteLead') { await remove(p); return res.status(200).json({ ok: true }); }
    const lead = await readJSON(p, null);
    if (!lead) return res.status(404).json({ error: 'Not found' });
    lead.read = !!b.read;
    await writeJSON(p, lead);
    return res.status(200).json({ ok: true });
  }

  res.status(400).json({ error: 'Unknown action' });
}
