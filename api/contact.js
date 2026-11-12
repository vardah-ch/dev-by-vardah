import { writeJSON } from './_lib/store.js';
import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const name = String(b.name || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().slice(0, 160);
  const message = String(b.message || '').trim().slice(0, 4000);
  const topic = String(b.topic || '').trim().slice(0, 60);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return res.status(400).json({ error: 'Please add your name, a valid email and a short message.' });
  }
  const id = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  await writeJSON(`leads/${id}.json`, { id, name, email, topic, message, createdAt: new Date().toISOString(), read: false });
  res.status(200).json({ ok: true });
}
