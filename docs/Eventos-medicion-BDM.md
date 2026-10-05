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
| `bdm_whatsapp_click` | WhatsApp |
| `bdm_video_click` | Video home |

## Implementación

- Dual-write: [`src/lib/bdmTrack.ts`](../src/lib/bdmTrack.ts)
- dataLayer/gtag: [`src/lib/analytics.ts`](../src/lib/analytics.ts)
- Firebase setup: [`FIREBASE-SETUP.md`](./FIREBASE-SETUP.md)
