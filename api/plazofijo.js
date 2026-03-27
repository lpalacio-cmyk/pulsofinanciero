export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const { codigoEntidad } = req.query;
  let url = 'https://api.bcra.gob.ar/transparencia/v1.0/PlazosFijos';
  if (codigoEntidad) url += '?codigoEntidad=' + codigoEntidad;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)', 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`BCRA Transparencia status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo consultar BCRA Transparencia', detalle: error.message });
  }
}
