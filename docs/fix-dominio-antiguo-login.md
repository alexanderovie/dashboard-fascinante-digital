# 🔧 Solución: Dominio Antiguo Aparece en Login

## ✅ Estado Actual

- **Custom Domain configurado:** `auth.fascinantedigital.com` → Status: Ready ✅
- **Problema:** Login muestra `dev-xz2zgl2c0w6gfvbk` en lugar del dominio personalizado

---

## 🔍 Causas Posibles

### 1. Variables de Entorno en Vercel No Actualizadas

**Problema:**
Las variables de entorno en Vercel pueden estar usando el dominio antiguo.

**Solución:**
1. Ve a **Vercel Dashboard** → Tu proyecto → **Settings** → **Environment Variables**
2. Verifica que estas variables usen el dominio personalizado:
   ```env
   AUTH0_DOMAIN=auth.fascinantedigital.com
   AUTH0_ISSUER_BASE_URL=https://auth.fascinantedigital.com
   ```
3. Si están incorrectas, actualízalas y haz un nuevo deploy

---

### 2. Application URLs en Auth0 Dashboard

**Problema:**
Las URLs de la aplicación en Auth0 Dashboard pueden estar usando el dominio antiguo.

**Solución:**
1. Ve a **Auth0 Dashboard** → **Applications** → **Dashboard Fascinante Digital**
2. Ve a la pestaña **"Settings"**
3. Verifica estas URLs (deben usar el dominio personalizado):
   - **Allowed Callback URLs:**
     ```
     https://app.fascinantedigital.com/api/auth/callback
     https://dashboard-fascinante-digital.vercel.app/api/auth/callback
     ```
   - **Allowed Logout URLs:**
     ```
     https://fascinantedigital.com
     https://app.fascinantedigital.com
     ```
   - **Allowed Web Origins:**
     ```
     https://app.fascinantedigital.com
     https://dashboard-fascinante-digital.vercel.app
     ```
4. **IMPORTANTE:** Si alguna URL usa `dev-xz2zgl2c0w6gfvbk.us.auth0.com`, cámbiala

---

### 3. Cache del Navegador/Auth0

**Problema:**
El navegador o Auth0 puede estar cacheando el dominio antiguo.

**Solución:**
1. **Navegador:**
   - Limpia cache y cookies (Ctrl+Shift+Del)
   - O usa modo incógnito

2. **Next.js local:**
   ```bash
   rm -rf .next
   pnpm dev
   ```

3. **Vercel:**
   - Haz un nuevo deploy:
   ```bash
   vercel --prod
   ```

---

### 4. SDK de Auth0 Usando Dominio Antiguo

**Problema:**
El SDK puede estar leyendo el dominio antiguo de alguna variable de entorno.

**Verificación:**
1. Revisa `.env.local` (ya está correcto según verificamos)
2. Revisa variables de entorno en Vercel
3. Verifica que `src/lib/auth/auth0-client.ts` esté usando las variables correctas

---

## ✅ Checklist de Verificación

### Paso 1: Verificar Variables de Entorno en Vercel

```bash
# Ver variables actuales en Vercel
vercel env ls
```

O manualmente en Vercel Dashboard:
- Settings → Environment Variables
- Verifica `AUTH0_DOMAIN` y `AUTH0_ISSUER_BASE_URL`

### Paso 2: Verificar Application URLs en Auth0

1. Auth0 Dashboard → Applications → Dashboard Fascinante Digital → Settings
2. Revisa:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
3. Asegúrate de que **NO** contengan `dev-xz2zgl2c0w6gfvbk.us.auth0.com`

### Paso 3: Limpiar Cache

```bash
# Local
rm -rf .next
pnpm dev

# Vercel (si aplica)
vercel --prod
```

### Paso 4: Probar en Modo Incógnito

1. Abre navegador en modo incógnito
2. Ve a: `http://localhost:3000/login` (local) o `https://app.fascinantedigital.com/login` (producción)
3. Deberías ser redirigido a: `https://auth.fascinantedigital.com/authorize`
4. El login debería mostrar: "Iniciar sesión en auth.fascinantedigital.com"

---

## 🚨 Si el Problema Persiste

### Verificar en Network Tab

1. Abre DevTools (F12) → Network tab
2. Haz login
3. Busca la request a `/api/auth/login`
4. Verifica la URL de redirect:
   - ✅ Debe ser: `https://auth.fascinantedigital.com/authorize?...`
   - ❌ NO debe ser: `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/authorize?...`

### Verificar en Console

1. Abre DevTools (F12) → Console
2. Busca errores o warnings relacionados con Auth0
3. Verifica que no haya referencias al dominio antiguo

---

## 📋 Resumen

El dominio personalizado está configurado correctamente en Auth0, pero el login puede estar usando el dominio antiguo por:

1. ❌ Variables de entorno en Vercel incorrectas
2. ❌ Application URLs en Auth0 usando dominio antiguo
3. ❌ Cache del navegador/Auth0
4. ❌ SDK leyendo variables incorrectas

**Solución más probable:** Application URLs en Auth0 Dashboard necesitan actualización.

---

## 🔗 Referencias

- [Auth0: Custom Domains](https://auth0.com/docs/customize/custom-domains)
- [Auth0: Application Settings](https://auth0.com/docs/get-started/applications/application-settings)
