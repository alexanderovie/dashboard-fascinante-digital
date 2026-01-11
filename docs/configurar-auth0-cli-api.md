# 🔧 Configurar Variables de Entorno para Auth0 CLI/Management API

## 📊 Estado Actual

### ✅ Variables que TIENES:

```bash
AUTH0_DOMAIN=auth.fascinantedigital.com
AUTH0_CLIENT_ID=FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7
AUTH0_CLIENT_SECRET=*** (configurado)
AUTH0_ISSUER_BASE_URL=https://auth.fascinantedigital.com
```

### ❌ Variables que FALTAN:

```bash
AUTH0_MANAGEMENT_TOKEN=*** (no configurado)
# O alternativamente:
# AUTH0_M2M_CLIENT_ID=*** (aplicación M2M)
# AUTH0_M2M_CLIENT_SECRET=*** (aplicación M2M)
```

---

## ⚠️ Problema

Las credenciales que tienes son de:
- **"Dashboard Fascinante Digital"** (Regular Web Application)
- Esta aplicación **NO es para Management API**
- Management API requiere **aplicación M2M** (Machine to Machine)

---

## ✅ Soluciones

### Opción A: Obtener Management Token (Recomendado para scripts)

**Paso 1: Obtener token temporal**

Usa Auth0 Dashboard o API para generar un token con scopes necesarios:

```bash
# Opción 1: Usar Auth0 CLI
auth0 api get --scope "read:clients read:users update:branding"

# Opción 2: Usar curl (necesitas credenciales M2M)
curl -X POST https://auth.fascinantedigital.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "TU_M2M_CLIENT_ID",
    "client_secret": "TU_M2M_CLIENT_SECRET",
    "audience": "https://auth.fascinantedigital.com/api/v2/",
    "grant_type": "client_credentials"
  }'
```

**Paso 2: Agregar a `.env.local`**

```bash
AUTH0_MANAGEMENT_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNSOWJQWlRickd6NXAyYnl2eTM5WSJ9...
```

---

### Opción B: Usar Aplicación M2M Existente

Tienes una aplicación M2M: **"Fascinante API M2M (DEV)"**

**Paso 1: Obtener credenciales M2M**

1. Ve a **Auth0 Dashboard** → **Applications** → **Fascinante API M2M (DEV)**
2. Pestaña **"Settings"**
3. Copia:
   - **Client ID**: `ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1`
   - **Client Secret**: (copia desde Settings)

**Paso 2: Agregar a `.env.local`**

```bash
# Variables para Management API (M2M)
AUTH0_M2M_CLIENT_ID=ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
AUTH0_M2M_CLIENT_SECRET=tu_secret_aqui
```

**Paso 3: Verificar que tenga permisos**

1. Ve a **APIs** → **Auth0 Management API**
2. Verifica que **"Fascinante API M2M (DEV)"** esté autorizada
3. Verifica que tenga los scopes necesarios:
   - `read:clients`
   - `update:clients`
   - `read:branding`
   - `update:branding`
   - etc.

---

## 🎯 Para Auth0 CLI

Auth0 CLI necesita estas variables:

```bash
export AUTH0_DOMAIN=auth.fascinantedigital.com
export AUTH0_CLIENT_ID=TU_M2M_CLIENT_ID
export AUTH0_CLIENT_SECRET=TU_M2M_CLIENT_SECRET
```

O usar el comando de login interactivo:

```bash
auth0 login
```

---

## 📋 Scripts que Necesitan Estas Variables

Los siguientes scripts requieren `AUTH0_MANAGEMENT_TOKEN`:

1. ✅ `scripts/update-auth0-branding.js`
2. ✅ `scripts/check-logout-urls.js`
3. ✅ `scripts/test-api-access.js`

---

## 🚀 Configuración Rápida

### Para scripts (Management API directo):

```bash
# Agregar a .env.local
echo "AUTH0_MANAGEMENT_TOKEN=tu_token_aqui" >> .env.local
```

### Para Auth0 CLI:

```bash
# Opción 1: Login interactivo
auth0 login

# Opción 2: Variables de entorno
export AUTH0_DOMAIN=auth.fascinantedigital.com
export AUTH0_CLIENT_ID=ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
export AUTH0_CLIENT_SECRET=tu_secret
```

---

## ✅ Verificación

### Verificar Management Token:

```bash
# Probar script que usa Management API
node scripts/test-api-access.js
```

### Verificar Auth0 CLI:

```bash
# Listar aplicaciones
auth0 apps list

# Ver configuración actual
auth0 config show
```

---

## 📋 Checklist

- [ ] Obtener Management Token o credenciales M2M
- [ ] Agregar `AUTH0_MANAGEMENT_TOKEN` a `.env.local`
- [ ] O agregar `AUTH0_M2M_CLIENT_ID` y `AUTH0_M2M_CLIENT_SECRET`
- [ ] Verificar permisos en Management API
- [ ] Probar scripts que usan Management API
- [ ] Configurar Auth0 CLI (si necesario)

---

## 🔗 Referencias

- [Auth0 Management API](https://auth0.com/docs/api/management/v2)
- [Auth0 CLI](https://auth0.com/docs/cli)
- [Machine to Machine Applications](https://auth0.com/docs/applications/concepts/app-types#machine-to-machine-applications)
