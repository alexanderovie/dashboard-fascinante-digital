# Fix: Error de Logout "Oops!, something went wrong"

**Fecha:** 2025-01-10
**Problema:** Error de Auth0 al hacer logout
**Causa:** `post_logout_redirect_uri` no está en Allowed Logout URLs

## 🔍 Diagnóstico

### Error observado:
```
"Oops!, something went wrong"
Tenant: <AUTH0_DOMAIN>
```

### URL de logout generada:
```
<AUTH0_ISSUER_BASE_URL>/oidc/logout?
  client_id=FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7&
  post_logout_redirect_uri=https%3A%2F%2Ffascinantedigital.com
```

### Análisis del curl:
```bash
GET /api/auth/logout?returnTo=https%3A%2F%2Ffascinantedigital.com
→ 307 Redirect
→ Location: <AUTH0_ISSUER_BASE_URL>/oidc/logout?...
```

✅ El SDK está construyendo correctamente la URL
❌ Auth0 rechaza el `post_logout_redirect_uri` porque NO está en Allowed Logout URLs

## 🔴 Causa Raíz

**El problema:** `https://fascinantedigital.com` NO está registrado en **Allowed Logout URLs** de tu aplicación Auth0.

Auth0 valida que el `post_logout_redirect_uri` esté en la lista permitida antes de procesar el logout. Si no está, muestra el error genérico "Oops!, something went wrong".

## ✅ Solución

### Paso 1: Agregar URL a Allowed Logout URLs

1. Ve a **Auth0 Dashboard**
2. **Applications** → **Dashboard Fascinante Digital**
3. Scroll hasta **Application URIs**
4. En **Allowed Logout URLs**, agrega:
   ```
   https://fascinantedigital.com
   ```
5. **Click en "Save Changes"**

### Paso 2: Verificar otras URLs necesarias

Asegúrate de tener también:
```
https://fascinantedigital.com
https://app.fascinantedigital.com
https://dashboard-fascinante-digital.vercel.app
```

### Paso 3: Probar logout

1. Inicia sesión
2. Haz logout
3. Debe redirigir a `https://fascinantedigital.com` sin error

## 🔧 Alternativa: Cambiar returnTo a dominio de la app

Si prefieres redirigir a tu app en lugar del dominio raíz:

```typescript
// En nav-user.tsx, cambiar:
const returnTo = encodeURIComponent('https://app.fascinantedigital.com')
// o
const returnTo = encodeURIComponent('http://localhost:3000') // para desarrollo
```

Y asegúrate de que esa URL esté en **Allowed Logout URLs**.

## ⚠️ Verificación Adicional

### Verificar que el logout funciona:

```bash
# Verificar que redirige correctamente
curl -v "http://localhost:3000/api/auth/logout?returnTo=https%3A%2F%2Ffascinantedigital.com"

# Debe mostrar:
# Location: <AUTH0_ISSUER_BASE_URL>/oidc/logout?...
```

### Verificar cookies después del logout:

Después del logout, las cookies deben estar limpias:
```bash
curl -I "http://localhost:3000/"
# No debe mostrar cookie __session
```

## 📋 Checklist

- [ ] Agregar `https://fascinantedigital.com` a Allowed Logout URLs
- [ ] Guardar cambios en Auth0 Dashboard
- [ ] Probar logout desde la app
- [ ] Verificar que redirige sin error
- [ ] Verificar que las cookies se limpian

## 🎯 Resumen

**Problema:** `post_logout_redirect_uri` no permitido
**Solución:** Agregar URL a Allowed Logout URLs en Auth0 Dashboard
**Tiempo estimado:** 2 minutos
