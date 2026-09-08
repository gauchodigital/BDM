# BastaDeMeningitis
<!-- deploy 2026-09-08 -->

Sitio de concientización sobre meningitis (Next.js 16 + React 19 + Tailwind v4).
Misma arquitectura que EAAM (JSON + admin + App Router), con diseño propio (Design System v4).

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start    # producción (Hostinger: next build + next start)
```

## Variables de entorno

Copiá `.env.example` a `.env.local`:

| Variable | Uso |
|----------|-----|
| `ADMIN_TOKEN` | Contraseña del panel `/admin` (obligatoria para editar) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (`G-XXXXXXXX`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (`GTM-XXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |

## Sitemap

- `/` — Home (secciones)
- `/sintomas`
- `/causas` + `/causas/[slug]`
- `/vacunacion`
- `/faq`
- `/glosario`
- `/contacto`
- `/privacidad`, `/terminos`
- `/admin/*` — panel (auth por cookie + `ADMIN_TOKEN`)

## Contenido editable (JSON en la raíz)

| Archivo | Admin |
|---------|--------|
| `causas-data.json` | `/admin/causas` |
| `sintomas-data.json` | `/admin/sintomas` |
| `faq-data.json` | `/admin/faq` |
| `testimonios-data.json` | `/admin/testimonios` |
| `glosario-data.json` | `/admin/glosario` |

Helpers en `src/lib/*Data.ts`. Links globales (WhatsApp, vacunación, redes) en `src/lib/siteLinks.ts`.

## Deploy (Hostinger)

1. Node.js compatible con Next 16.
2. `npm ci` → `npm run build` → `npm run start` (o process manager).
3. Asegurate de que el proceso pueda **escribir** los JSON en la raíz si vas a usar el admin en producción.
4. Configurá las env vars del hosting.

## Diseño

Tokens en `src/app/globals.css` (`@theme`): primary `#503C77`, secondary `#6D6AAE`, dark `#44274B`, light `#A6C0D6`, accent `#D9876E`. Tipografías: **Syne** (títulos) + **Inter** (cuerpo).

## Pendiente de completar

- Números/URLs reales en `src/lib/siteLinks.ts`
- Logo / favicon / imágenes en `public/`
- Videos de testimonios y video de concientización
- Textos legales definitivos en `/privacidad` y `/terminos`
