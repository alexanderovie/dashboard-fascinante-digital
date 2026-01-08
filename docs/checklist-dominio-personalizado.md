# ✅ Checklist: Dominio Personalizado Auth0

**Fecha:** 2025-01-10  
**Dominio Personalizado:** `auth.fascinantedigital.com`  
**Status:** ✅ Configurado y Verificado

## 🎯 Configuración Completada

### ✅ Auth0 Dashboard
- [x] Dominio personalizado configurado: `auth.fascinantedigital.com`
- [x] DNS CNAME verificado
- [x] TLS certificado emitido y válido
- [x] Toggle "Settings → Disabled" activado (para emails/notificaciones)
- [x] Universal Login usando dominio personalizado

### ✅ Variables de Entorno - Local (.env.local)
- [x] `AUTH0_DOMAIN=auth.fascinantedigital.com`
- [x] `AUTH0_ISSUER_BASE_URL=https://auth.fascinantedigital.com`
- [x] `AUTH0_BASE_URL=http://localhost:3000` (desarrollo)
- [x] `APP_BASE_URL=http://localhost:3000` (desarrollo)

### ✅ Variables de Entorno - Vercel (Producción)
- [x] `AUTH0_DOMAIN=auth.fascinantedigital.com` (Production)
- [x] `AUTH0_ISSUER_BASE_URL=https://auth.fascinantedigital.com` (Production)
- [x] `AUTH0_BASE_URL=https://app.fascinantedigital.com` (Production)
- [x] `APP_BASE_URL=https://app.fascinantedigital.com` (Production)
- [x] Mismas variables para Preview

### ✅ Auth0 Application URLs
- [x] Application Login URI: `https://app.fascinantedigital.com/login`
- [x] Allowed Callback URLs: `https://app.fascinantedigital.com/api/auth/callback`
- [x] Allowed Logout URLs: `https://fascinantedigital.com`
- [x] Allowed Web Origins: `https://app.fascinantedigital.com`

## 🧪 Pruebas Requeridas

### 1. Login End-to-End
- [ ] Abrir: `https://app.fascinantedigital.com/login`
- [ ] Verificar redirección a: `https://auth.fascinantedigital.com/authorize`
- [ ] Completar login
- [ ] Verificar callback exitoso
- [ ] Verificar redirección al dashboard
- [ ] Sin warnings en consola
- [ ] Sin certificados raros
- [ ] Sin doble login

### 2. Logout
- [ ] Hacer logout desde el dashboard
- [ ] Verificar que usa: `auth.fascinantedigital.com/v2/logout`
- [ ] Verificar redirección a: `https://fascinantedigital.com`
- [ ] Sin errores de Auth0

### 3. Verificación de URLs
- [ ] Todos los links de Auth0 usan `auth.fascinantedigital.com`
- [ ] Ningún link usa `*.auth0.com`
- [ ] Emails de verificación usan dominio personalizado
- [ ] Links de reset password usan dominio personalizado

## 🏗️ Arquitectura Final

```
app.fascinantedigital.com   → Next.js (Vercel)
auth.fascinantedigital.com  → Auth0 Universal Login
api.fascinantedigital.com   → Fastify / Cloud Run (futuro)
```

## 📋 Próximos Pasos

1. [ ] Hacer deploy con nuevas variables
2. [ ] Probar login end-to-end
3. [ ] Verificar logout
4. [ ] Revisar callback + scopes + audience
5. [ ] Asegurar silent refresh
6. [ ] Multi-tenant (org_id / claims)
7. [ ] Documentar como runbook

## 🔗 Links Útiles

- **Auth0 Dashboard:** https://manage.auth0.com/#/applications/FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7/settings
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Producción:** https://app.fascinantedigital.com
- **Auth0 Login:** https://auth.fascinantedigital.com
