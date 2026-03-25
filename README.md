# Pulso Financiero NOA

Dashboard financiero en vivo para **WL HNOS & ASOC**.

## Fuentes de datos

| Variable | API | Endpoint |
|---|---|---|
| Dólar Oficial | DolarAPI | `GET /v1/dolares/oficial` |
| Dólar MEP | DolarAPI | `GET /v1/dolares/bolsa` |
| Riesgo País | ArgentinaDatos | `GET /v1/finanzas/indices/riesgo-pais/ultimo` |
| BADLAR (TNA) | BCRA v4 | `GET /estadisticas/v4.0/Monetarias/7` (via proxy) |

## Estructura

```
pulso-financiero/
├── public/
│   └── index.html          ← Página principal
├── api/
│   └── bcra.js             ← Proxy serverless para BCRA
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
