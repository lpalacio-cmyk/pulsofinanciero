// /api/bcra.js
// Serverless function que actúa como proxy para la API del BCRA
// Resuelve problemas de CORS y SSL que impiden llamar directo desde el navegador

export default async function handler(req, res) {
  // Permitir CORS desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Falta el parámetro "id" de la variable BCRA' });
  }

  try {
    const url = `https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/${id}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`BCRA respondió con status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error consultando BCRA:', error.message);
    return res.status(500).json({
      error: 'No se pudo consultar la API del BCRA',
      detalle: error.message
    });
  }
}
