# Firebase — medición BDM (mismo método que Virus VSR)

## 1. Crear proyecto

1. Entrá a https://console.firebase.google.com/
2. **Agregar proyecto** → nombre sugerido: `bastademeningitis-medicion`
3. Desactivá Analytics de Google si no lo necesitás (opcional)
4. En el proyecto: **Compilar → Authentication → Sign-in method → Google → Habilitar**
5. **Compilar → Firestore Database → Crear base** (modo producción)
6. **Configuración del proyecto → Tus apps → Web** → registrar app `bdm-web`
7. Copiá el objeto `firebaseConfig`

## 2. Variables de entorno

Creá un archivo `.env.local` (no se sube a git) con:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

En el **servidor de deploy** (Hostinger / VPS / panel de ellos): las mismas keys en el `.env` o variables de entorno del proceso Node **antes del `next build`**. Las `NEXT_PUBLIC_*` se incrustan en el build; si faltan al compilar, el sitio sale sin medición.

## 3. Reglas de seguridad

En Firestore → Reglas, pegá el contenido de `firestore.rules` de este repo y publicá.

## 4. Allowlist del dashboard

En Firestore → Datos → colección `allowedViewers`:

- ID del documento = **email exacto** (ej. `gauchodigital.agencia@gmail.com`)
- Campos: opcional `{ "name": "Gaucho" }` (puede quedar vacío)

Sin ese documento, al loguearse con Google verán “Sin acceso”.

## 5. Dominios Auth

Authentication → Settings → Authorized domains: agregá `localhost` y `bastademeningitis.com.ar` (y cualquier preview/staging que usen).

## 6. Probar (checklist end-to-end)

1. `npm run dev` con `.env.local` completo
2. Autotest → en Firestore deberían aparecer docs en `autotest`:
   - `start` al abrir
   - `age` al enviar fecha
   - `checklist` + `complete` al ver resultados
   - `share` / `calendar` al descargar o agendar
   - `abandon` si cerrás en paso 1 o 2
3. Mapa (vacunación) → docs en `map`:
   - `results` al filtrar provincia
   - `marker` al click marcador/card
   - `como_llegar` al click Cómo llegar
4. `/equipo/datos` → Google (email en `allowedViewers`) → KPIs y charts
5. Sin allowlist → pantalla “Sin acceso”

## 7. Deploy (servidor propio)

El sitio **no** va por Vercel: lo suben a git y ellos lo despliegan en su servidor.

1. En el servidor / CI: archivo `.env` (o vars del panel) con:
   - `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
   - las 6 `NEXT_PUBLIC_FIREBASE_*` cuando tengan el proyecto listo
2. **No** commitear `.env` / `.env.local` (están en `.gitignore`).
3. Correr `npm run build` **después** de tener las env (las `NEXT_PUBLIC_*` quedan en el bundle).
4. Reiniciar el proceso (`next start` o el service que usen).

Referencia de keys: `env.example` en el repo.

## 8. Checklist de eventos (equipo)

| Fuente | status/type | Cuándo |
|--------|-------------|--------|
| Autotest | start | Abre el quiz |
| Autotest | age | Envía fecha |
| Autotest | checklist | Pasa a resultados |
| Autotest | complete | Vio resultados |
| Autotest | abandon | Sale en step1/step2 |
| Autotest | share | Descarga/comparte imagen |
| Autotest | calendar | Agendar recordatorio |
| Mapa | results | Filtro con resultados |
| Mapa | marker | Click marcador/card |
| Mapa | como_llegar | Click cómo llegar |
| Popup campaña | view | Se abre el quiz |
| Popup campaña | answer | Eligió A/B/C (+ correct) |
| Popup campaña | cta | Click al CTA |
| Popup campaña | close | Cerró sin CTA |
| Popup pediatra | view | Se muestra la pregunta |
| Popup pediatra | answer | Sí / No |
| Popup pediatra | close | Cerró sin responder |
