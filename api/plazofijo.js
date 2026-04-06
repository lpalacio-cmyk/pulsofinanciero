/* ═══════════════════════════════════════════════════════
 * PROXY: BCRA Transparencia — Plazos Fijos
 * ───────────────────────────────────────────────────────
 * PROPÓSITO: Proxy CORS para la API de transparencia del BCRA.
 *   Devuelve tasas de plazo fijo por entidad bancaria.
 *   Usado por el comparador LECAP vs Plazo Fijo.
 *
 * ENDPOINT UPSTREAM: https://api.bcra.gob.ar/transparencia/v1.0/PlazosFijos
 *
 * PARÁMETROS QUERY:
 *   - codigoEntidad (opcional): Código BCRA del banco
 *     Principales: 11=Nación, 285=Macro, 191=Credicoop,
 *     72=Santander, 7=Galicia, 17=BBVA, 15=ICBC
 *
 * FILTRO FRONTEND: El frontend filtra por:
 *   - PF intransferible en pesos (excluye dólar y UVA)
 *   - Canal Home Banking (fallback: cualquier canal)
 *   - Ordena por TEA descendente (toma la mejor tasa)
 *
 * CACHE: s-maxage=3600 (1 hora), stale-while-revalidate=7200 (2 hs)
 *   → Las tasas de PF cambian máximo 1 vez al día
 * TIMEOUT: 5 segundos
 *
 * HISTORIAL:
 *   2026-03 — v1: Proxy básico con CORS y cache 1h
 *   2026-04 — v2: Agregado timeout 5s, documentación, error tipado
 * ═══════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const { codigoEntidad } = req.query;
  let url = 'https://api.bcra.gob.ar/transparencia/v1.0/PlazosFijos';
  if (codigoEntidad) url += '?codigoEntidad=' + codigoEntidad;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error(`BCRA Transparencia status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: true,
      message: isTimeout ? 'BCRA Transparencia no respondió en 5s' : 'No se pudo consultar BCRA Transparencia',
      detalle: error.message
    });
  }
}
