export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Falta parámetro "id"' });

  try {
    const response = await fetch(`https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)', 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`BCRA status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo consultar BCRA', detalle: error.message });
  }
}
