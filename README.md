# Pulso Financiero NOA

Dashboard financiero en vivo para **WL HNOS & ASOC**.

## Fuentes de datos

| Variable | API | Endpoint |
|---|---|---|
| Dólar Oficial | DolarAPI | `GET /v1/dolares/oficial` |
| Dólar MEP | DolarAPI | `GET /v1/dolares/bolsa` |
| Riesgo País | ArgentinaDatos | `GET /v1/finanzas/indices/riesgo-pais/ultimo` |
| BADLAR (TNA) | BCRA v4 | `GET /estadisticas/v4.0/Monetarias/7` (via proxy) |
| Dólar CCL | DolarAPI | `GET /v1/dolares/contadoconliqui` |
| LECAPs y BONCAPs: listado y vencimientos | ArgentinaDatos | `GET /v1/finanzas/letras` (devuelve `{ letras: [...] }`, sin VPV) |
| LECAPs y BONCAPs: precios en vivo | data912 | `GET /live/arg_notes` y `/live/arg_bonds` (via proxy `/api/data912`, caché 20 s) |

El VPV (pago al vencimiento cada 100 VN) está en `VPV_OFICIAL`, dentro de `public/index.html`. Una letra nueva que no
esté ahí se calcula sola con el cierre de ArgentinaDatos: `VPV = precio × (1 + TEA)^(días / 365)`.

## Estructura

```
pulso-financiero/
├── public/
│   └── index.html          ← Página principal
├── api/
│   ├── bcra.js             ← Proxy serverless para BCRA (BADLAR)
│   ├── data912.js          ← Proxy serverless para data912 (precios)
│   └── plazofijo.js        ← Proxy serverless para BCRA Transparencia
├── vercel.json             ← Config de Vercel
├── package.json
└── README.md
```

## Deploy en Vercel

1. Subir este repo a GitHub
2. Conectar con Vercel (vercel.com)
3. Deploy automático

## Licencia

Uso interno — WL HNOS & ASOC
