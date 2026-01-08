# Fix: Auth0 Callback URL Mismatch

**Fecha:** 2025-01-10  
**Error:** Callback URL mismatch en producción  
**Status:** 🔴 Requiere acción manual

## 🔍 Problema Detectado

Al hacer curl a `https://dashboard-fascinante-digital.vercel.app/login`, Auth0 rechaza la request con:

```
HTTP 403 - Callback URL mismatch
The provided redirect_uri is not in the list of allowed callback URLs
https://dashboard-fascinante-digital.vercel.app/api/auth/callback is not in the list of allowed callback URLs
```

## 🔧 Causa

La URL de callback de producción no está configurada en Auth0 Dashboard.

## ✅ Solución

### Paso 1: Ir al Auth0 Dashboard

URL directa: https://manage.auth0.com/#/applications/FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7/settings

### Paso 2: Configurar URLs Permitidas

#### 1. Allowed Callback URLs

Agregar (o verificar que existe):
```
https://dashboard-fascinante-digital.vercel.app/api/auth/callback
http://localhost:3000/api/auth/callback
```

#### 2. Allowed Logout URLs

Agregar (o verificar que existe):
```
https://dashboard-fascinante-digital.vercel.app
http://localhost:3000
```

#### 3. Allowed Web Origins

Agregar (o verificar que existe):
```
https://dashboard-fascinante-digital.vercel.app
http://localhost:3000
```

### Paso 3: Guardar Cambios

1. Hacer clic en "Save Changes"
2. Esperar a que Auth0 procese los cambios (2-5 segundos)

### Paso 4: Verificar

Después de guardar, hacer curl nuevamente:
```bash
curl -i -L https://dashboard-fascinante-digital.vercel.app/login
```

Debería redirigir correctamente a Auth0 Universal Login sin error 403.

## 📋 URLs Completas para Copiar/Pegar

### Allowed Callback URLs
```
https://dashboard-fascinante-digital.vercel.app/api/auth/callback,http://localhost:3000/api/auth/callback
```

### Allowed Logout URLs
```
https://dashboard-fascinante-digital.vercel.app,http://localhost:3000
```

### Allowed Web Origins
```
https://dashboard-fascinante-digital.vercel.app,http://localhost:3000
```

## ⚠️ Nota Importante

- Las URLs deben estar separadas por **comas** (`,`) si hay múltiples
- No agregar espacios después de las comas
- Asegurarse de usar `https://` para producción
- Asegurarse de usar `http://` para localhost

## 🔗 Links Útiles

- **Auth0 Application Settings:** https://manage.auth0.com/#/applications/FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7/settings
- **Auth0 Logs:** https://manage.auth0.com/#/logs/
- **Deployment URL:** https://dashboard-fascinante-digital.vercel.app

## ✅ Checklist

- [ ] Ir a Auth0 Dashboard
- [ ] Agregar Callback URL de producción
- [ ] Agregar Logout URL de producción
- [ ] Agregar Web Origins de producción
- [ ] Guardar cambios
- [ ] Verificar con curl
- [ ] Probar login en producción
