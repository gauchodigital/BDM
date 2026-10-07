# Eventos de medición · BastaDeMeningitis

Catálogo al estilo Virus VSR (`vsr_*` → aquí `bdm_*`).

Cada evento de producto se escribe en **Firestore** (dashboard `/equipo/datos`) y se dispara a **GA4/GTM** (`G-L0Y9DF136T` / `GTM-NNSKLXPR`).

HTML presentable: [`Eventos-medicion-BDM.html`](./Eventos-medicion-BDM.html)

## Autotest

| Nombre (GA4) | Qué mide | Activación | Params | Firestore |
|--------------|----------|------------|--------|-----------|
| `bdm_autotest_start` | Inicio | Entra al quiz | `autotest_session_id` | `status: start` |
| `bdm_autotest_age` | Edad | Envía fecha | `autotest_session_id`, `age_months`, `age_label` | `status: age` |
| `bdm_autotest_checklist` | Checklist → resultado | Continuar | `autotest_session_id`, `pending_count` | `status: checklist` |
| `bdm_autotest_complete` | Vio resultado | Mismo momento | `autotest_session_id`, `pending_count` | `status: complete` |
| `bdm_autotest_abandon` | Abandono | Sale en paso 1/2 | `autotest_session_id`, `last_screen` | `status: abandon` |
| `bdm_autotest_share` | Share / descarga | Descargar imagen | `autotest_session_id` | `status: share` |
| `bdm_autotest_calendar` | Recordatorio | Agendar | `autotest_session_id` | `status: calendar` |

## Mapa

| Nombre (GA4) | Qué mide | Activación | Params | Firestore |
|--------------|----------|------------|--------|-----------|
| `bdm_map_results` | Búsqueda con resultados | Filtros | `provincia`, `localidad`, `barrio`, `tipo`, `count` | `type: results` |
| `bdm_map_marker` | Click centro | Marcador / card | — | `type: marker` |
| `bdm_map_como_llegar` | Cómo llegar | Click Cómo llegar | — | `type: como_llegar` |

## Popup campaña

| Nombre (GA4) | Qué mide | Activación | Params | Firestore |
|--------------|----------|------------|--------|-----------|
| `bdm_popup_campaign_view` | Vio popup | Se abre | — | `popup: campaign`, `type: view` |
| `bdm_popup_campaign_answer` | Respondió | A/B/C | `answer`, `correct` | `type: answer` |
| `bdm_popup_campaign_cta` | CTA | Click CTA | — | `type: cta` |
| `bdm_popup_campaign_close` | Cierre | X sin CTA | — | `type: close` |

## Popup pediatra

| Nombre (GA4) | Qué mide | Activación | Params | Firestore |
|--------------|----------|------------|--------|-----------|
| `bdm_popup_pediatra_view` | Vio popup | Aparece pregunta | — | `popup: pediatra`, `type: view` |
| `bdm_popup_pediatra_answer` | Sí / No | Click Sí o No | `answer` (yes/no) | `type: answer` |
| `bdm_popup_pediatra_close` | Cierre sin responder | X antes de responder | — | `type: close` |

## CTAs de sitio (solo GA4)

| Nombre (GA4) | Activación |
|--------------|------------|
| `bdm_vacunarse_click` | CTA vacunación |
| `bdm_video_click` | Video home |

## Top eventos Meta Ads

Eventos custom para **Meta Events Manager / campañas** (además del catálogo granular).
Son los **únicos** eventos custom que se envían al Pixel de Meta; el resto (`bdm_autotest_*`, `bdm_map_*`, `bdm_popup_*`, CTAs) va solo a GA4/GTM y Firestore. `bdm_meta_form_vc` envía solo `count` (sin provincia/localidad/barrio/tipo). También espejo a GA4/GTM. Código: [`src/lib/metaAds.ts`](../src/lib/metaAds.ts).

| Nombre (Meta custom) | Estándar Meta | Activación |
|----------------------|---------------|------------|
| `bdm_meta_popup_campaign` | `Lead` | Popup campaña — responde A/B/C |
| `bdm_meta_popup_consult` | `Schedule` (Sí) / `Lead` (No) | Popup consulta — responde Sí/No |
| `bdm_meta_form_vc` | `Lead` | Mapa: búsqueda de centros con resultados |
| `bdm_meta_pdf_vc` | `Lead` | Click “Descargar calendario” (PDF) |
| `bdm_meta_pdf_locations` | — | Definido; sin botón/PDF en el sitio |

**Importante (política Meta):** no usar en el *nombre* del evento palabras de salud (vacuna, meningitis, etc.). “vc” es abreviatura interna. Meta bloquea custom events con términos de salud.

En Meta Ads → Events Manager → crear conversión personalizada / usar estos nombres para optimizar.

**Renombres (Oct 2026):** `bdm_meta_form_vacunas` → `bdm_meta_form_vc`; `bdm_meta_pdf_vacunacion` → `bdm_meta_pdf_vc`; `bdm_meta_popup_pediatra` → `bdm_meta_popup_consult`.

## Implementación

- Dual-write: [`src/lib/bdmTrack.ts`](../src/lib/bdmTrack.ts)
- Meta Ads top: [`src/lib/metaAds.ts`](../src/lib/metaAds.ts)
- dataLayer/gtag/fbq: [`src/lib/analytics.ts`](../src/lib/analytics.ts)
- Firebase setup: [`FIREBASE-SETUP.md`](./FIREBASE-SETUP.md)
