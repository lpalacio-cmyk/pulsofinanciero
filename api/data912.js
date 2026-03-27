export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  const { type } = req.query;
  const urls = {
    notes: 'https://data912.com/live/arg_notes',
    bonds: 'https://data912.com/live/arg_bonds',
  };

  const url = urls[type];
  if (!url) return res.status(400).json({ error: 'type debe ser "notes" o "bonds"' });

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)', 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`data912 status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo consultar data912', detalle: error.message });
  }
}
