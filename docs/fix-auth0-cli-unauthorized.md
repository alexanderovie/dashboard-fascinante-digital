# 🔧 Solución: Error "Unauthorized" en Auth0 CLI

## ❌ Error

```
error: oauth2: "access_denied" "Unauthorized".
Failed to start secret machine login: failed to fetch access token using client credentials.
```

---

## 🔍 Causas Posibles

### 1. ❌ Aplicación M2M NO autorizada en Management API

**Problema más común**: La aplicación M2M existe pero no está autorizada para usar Management API.

**Solución:**
1. Ve a **Auth0 Dashboard** → **APIs** → **Auth0 Management API**
2. Busca **"Authorized Applications"** o **"Machine to Machine Applications"**
3. Verifica que **"Fascinante API M2M (DEV)"** esté listada
4. Si NO está, haz clic en **"Authorize"** o **"Grant Access"**
5. Selecciona los scopes necesarios:
   - `read:clients`
   - `update:clients`
   - `read:branding`
   - `update:branding`
   - `read:users`
   - etc.

---

### 2. ❌ Client Secret Incorrecto

**Verificación:**
1. Ve a **Auth0 Dashboard** → **Applications** → **Fascinante API M2M (DEV)**
2. Pestaña **"Settings"**
3. Busca **"Client Secret"**
4. Haz clic en **"Show"** o **"Reveal"**
5. Copia el secret completo (sin espacios)
6. Intenta autenticarte de nuevo

**Si el secret no funciona:**
- Puedes rotarlo (generar uno nuevo):
  1. En Settings, haz clic en **"Rotate"** o **"Regenerate"**
  2. Copia el nuevo secret
  3. Intenta autenticarte de nuevo

---

### 3. ❌ Dominio Personalizado Puede Causar Problemas

El CLI puede tener problemas con dominios personalizados. Prueba usar el dominio original:

**Opción A: Usar dominio original**

```bash
auth0 login
# Cuando pida Domain, usa:
dev-xz2zgl2c0w6gfvbk.us.auth0.com
```

**Opción B: Configurar dominio personalizado en CLI**

Algunas versiones del CLI no soportan bien dominios personalizados. Verifica la versión:

```bash
auth0 --version
```

---

### 4. ❌ Scopes Insuficientes

Asegúrate de que la aplicación M2M tenga los scopes necesarios:

**Scopes mínimos requeridos:**
- `read:clients`
- `read:applications`
- `read:users` (si necesitas leer usuarios)
- `update:branding` (si necesitas actualizar branding)
- etc.

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar Autorización en Management API

1. **Auth0 Dashboard** → **APIs**
2. Busca **"Auth0 Management API"** (debe estar en la lista)
3. Haz clic en **"Auth0 Management API"**
4. Ve a la pestaña **"Machine to Machine Applications"** o **"Authorized Applications"**
5. Verifica que **"Fascinante API M2M (DEV)"** esté listada
6. Si NO está:
   - Haz clic en **"Authorize"** o **"Grant Access"**
   - Selecciona la aplicación: **"Fascinante API M2M (DEV)"**
   - Selecciona los scopes necesarios
   - Haz clic en **"Authorize"**

---

### Paso 2: Verificar Client Secret

1. **Auth0 Dashboard** → **Applications** → **Fascinante API M2M (DEV)**
2. Pestaña **"Settings"**
3. Busca **"Client Secret"**
4. Haz clic en **"Show"** o **"Reveal"**
5. Copia el secret completo
6. Verifica que no tenga espacios al inicio/final

---

### Paso 3: Intentar con Dominio Original

Si el dominio personalizado causa problemas:

```bash
auth0 login
# Selecciona: "As a machine"
# Domain: dev-xz2zgl2c0w6gfvbk.us.auth0.com (dominio original)
# Client ID: ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
# Client Secret: (tu_secret)
```

---

### Paso 4: Verificar Credenciales con curl

Prueba obtener un token directamente:

```bash
curl -X POST https://auth.fascinantedigital.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1",
    "client_secret": "TU_CLIENT_SECRET_AQUI",
    "audience": "https://auth.fascinantedigital.com/api/v2/",
    "grant_type": "client_credentials"
  }'
```

**O con dominio original:**

```bash
curl -X POST https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1",
    "client_secret": "TU_CLIENT_SECRET_AQUI",
    "audience": "https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/api/v2/",
    "grant_type": "client_credentials"
  }'
```

Si esto funciona, recibirás un `access_token`. Si no, el problema está en las credenciales o autorización.

---

## 🔍 Verificación en Dashboard

### Verificar que la aplicación M2M esté autorizada:

1. **APIs** → **Auth0 Management API**
2. Pestaña **"Machine to Machine Applications"**
3. Busca: **"Fascinante API M2M (DEV)"**
4. Debe mostrar: ✅ **"Authorized"**
5. Haz clic para ver los scopes otorgados

---

## ⚠️ Problema Común: Application Type

Asegúrate de que la aplicación sea realmente **"Machine to Machine"**:

1. **Applications** → **Fascinante API M2M (DEV)**
2. Pestaña **"Settings"**
3. Verifica que **"Application Type"** sea: **"Machine to Machine"**
4. Si es otro tipo (Regular Web, SPA, etc.), esa es la causa del problema

---

## 📋 Checklist

- [ ] Verificar que la aplicación M2M esté autorizada en Management API
- [ ] Verificar que tenga los scopes necesarios
- [ ] Verificar que el Client Secret sea correcto
- [ ] Intentar con dominio original (no personalizado)
- [ ] Verificar que el Application Type sea "Machine to Machine"
- [ ] Probar con curl para verificar credenciales

---

## 🔗 Referencias

- [Auth0: Machine to Machine Applications](https://auth0.com/docs/applications/concepts/app-types#machine-to-machine-applications)
- [Auth0: Management API Authorization](https://auth0.com/docs/api/management/v2/tokens)
- [Auth0 CLI Troubleshooting](https://auth0.github.io/auth0-cli/auth0_cli.html)
