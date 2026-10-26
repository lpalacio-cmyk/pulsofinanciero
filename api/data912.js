/* ═══════════════════════════════════════════════════════
 * PROXY: data912 — Precios en vivo de letras y bonos
 * ───────────────────────────────────────────────────────
 * PROPÓSITO: Proxy CORS para data912.com que provee precios
 *   en tiempo real de letras (LECAPs) y bonos (BONCAPs) argentinos.
 *   Sin estos precios, la tabla de rendimientos y la calculadora
 *   solo muestran metadata sin TNA/TIR.
 *
 * ENDPOINT UPSTREAM:
 *   - type=notes → https://data912.com/live/arg_notes (LECAPs)
 *   - type=bonds → https://data912.com/live/arg_bonds (BONCAPs y bonos)
 *
 * DATOS QUE DEVUELVE: Array de objetos con:
 *   - symbol: ticker del instrumento (ej: "S30A6")
 *   - c: precio de cierre/último (string numérico)
 *   - (otros campos no usados por el frontend)
 *
 * CACHE: s-maxage=20, stale-while-revalidate=40
 *   → La página pide precios cada 30 s; con 20 s de caché cada pedido
 *     trae un dato nuevo y data912 recibe a lo sumo 3 pedidos por minuto.
 * TIMEOUT: 8 segundos
 *
 * HISTORIAL:
 *   2026-03 — v1: Proxy básico con CORS y cache 2min
 *   2026-04 — v2: Agregado timeout 5s, documentación, error tipado
 *   2026-10 — v3: Caché 20 s (precios en vivo cada 30 s) y timeout 8 s
 * ═══════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');

  const { type } = req.query;
  const urls = {
    notes: 'https://data912.com/live/arg_notes',
    bonds: 'https://data912.com/live/arg_bonds',
  };

  const url = urls[type];
  if (!url) return res.status(400).json({ error: true, message: 'type debe ser "notes" o "bonds"' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PulsoFinancieroNOA/1.0)',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`data912 status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: true,
      message: isTimeout ? 'data912 no respondió en 8s' : 'No se pudo consultar data912',
      detalle: error.message
    });
  }
}
