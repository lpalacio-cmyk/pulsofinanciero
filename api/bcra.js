/* ═══════════════════════════════════════════════════════
 * PROXY: BCRA — Estadísticas Monetarias
 * ───────────────────────────────────────────────────────
 * PROPÓSITO: Proxy CORS para la API de estadísticas del BCRA.
 *   Usado por el frontend para obtener BADLAR (id=7) y
 *   otras variables monetarias.
 *
 * ENDPOINT UPSTREAM: https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/{id}
 *
 * PARÁMETROS QUERY:
 *   - id (requerido): ID de variable monetaria BCRA
 *     Principales: 5=Dólar Oficial, 7=BADLAR priv, 145=Adelanto CC
 *
 * CACHE: s-maxage=300 (5 min), stale-while-revalidate=600 (10 min)
 * TIMEOUT: 5 segundos
 *
 * HISTORIAL:
 *   2026-03 — v1: Proxy básico con CORS
 *   2026-04 — v2: Agregado timeout 5s, documentación, error tipado
 * ═══════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: true, message: 'Falta parámetro "id"' });

  try {
    const response = await fetch(`https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error(`BCRA status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: true,
      message: isTimeout ? 'BCRA no respondió en 5s' : 'No se pudo consultar BCRA',
      detalle: error.message
    });
  }
}
