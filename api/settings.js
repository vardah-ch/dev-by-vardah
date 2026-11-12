import { readJSON, DEFAULT_SETTINGS } from './_lib/store.js';

export default async function handler(req, res) {
  const s = await readJSON('settings.json', DEFAULT_SETTINGS);
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).json({ ...DEFAULT_SETTINGS, ...s });
}
