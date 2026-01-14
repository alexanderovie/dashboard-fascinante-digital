# 🔐 Autenticación de Auth0 CLI

## 🎯 Opciones de Autenticación

Cuando ejecutas `auth0 login`, el CLI te pregunta cómo autenticarte:

### 1. **As a user** (Como usuario)
- ✅ Autenticación con credenciales personales
- ✅ Login interactivo en navegador
- ⚠️ Requiere interacción cada vez
- ⚠️ No funciona bien en scripts automatizados
- ⚠️ No recomendado para CI/CD

**Cuándo usar:**
- Pruebas rápidas manuales
- Exploración de la API
- Desarrollo local ocasional

---

### 2. **As a machine** (Como máquina) ✅ **RECOMENDADO**

- ✅ Autenticación con aplicación M2M (Machine to Machine)
- ✅ No requiere interacción del usuario
- ✅ Funciona en scripts automatizados
- ✅ Compatible con CI/CD
- ✅ Más seguro para producción

**Cuándo usar:**
- Scripts automatizados
- CI/CD pipelines
- Integración con otros sistemas
- Tu caso actual (scripts de branding, logout URLs, etc.)

---

## 📋 Pasos para "As a machine"

### Paso 1: Seleccionar "As a machine"

```bash
auth0 login
# Selecciona: "As a machine"
```

### Paso 2: Proporcionar credenciales

El CLI te pedirá:

1. **Domain:**
   ```
   <AUTH0_DOMAIN>
   ```

2. **Client ID:**
   ```
   ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
   ```
   (De la aplicación "Fascinante API M2M (DEV)")

3. **Client Secret:**
   ```
   (tu_secret_de_la_aplicacion_m2m)
   ```
   (Obtener desde Auth0 Dashboard → Applications → Fascinante API M2M (DEV) → Settings)

---

## 🔍 Obtener Client Secret de M2M

### Opción A: Desde Auth0 Dashboard

1. Ve a **Auth0 Dashboard** → **Applications**
2. Selecciona: **"Fascinante API M2M (DEV)"**
3. Pestaña **"Settings"**
4. Busca **"Client Secret"**
5. Haz clic en **"Show"** o **"Reveal"**
6. Copia el secret

### Opción B: Desde Auth0 CLI (si ya estás autenticado)

```bash
auth0 apps show ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1 --json | jq -r '.client_secret'
```

---

## ✅ Verificación

Después de autenticarte, verifica que funciona:

```bash
# Listar aplicaciones
auth0 apps list

# Ver configuración actual
auth0 config show

# Probar un comando de API
auth0 api get /api/v2/clients
```

---

## 🔄 Alternativa: Variables de Entorno

Si prefieres no usar `auth0 login`, puedes configurar variables de entorno:

```bash
export AUTH0_DOMAIN=<AUTH0_DOMAIN>
export AUTH0_CLIENT_ID=ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
export AUTH0_CLIENT_SECRET=tu_secret_m2m
```

O agregar a `.env.local` y cargar:

```bash
# En .env.local
AUTH0_DOMAIN=<AUTH0_DOMAIN>
AUTH0_M2M_CLIENT_ID=ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1
AUTH0_M2M_CLIENT_SECRET=tu_secret_m2m
```

Luego en scripts:

```javascript
require('dotenv').config({ path: '.env.local' });
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET;
```

---

## ⚠️ Verificar Permisos M2M

Asegúrate de que la aplicación M2M tenga permisos en Management API:

1. Ve a **APIs** → **Auth0 Management API**
2. Verifica que **"Fascinante API M2M (DEV)"** esté autorizada
3. Verifica scopes necesarios:
   - `read:clients`
   - `update:clients`
   - `read:branding`
   - `update:branding`
   - `read:users`
   - etc.

---

## 📋 Checklist

- [ ] Seleccionar "As a machine" en `auth0 login`
- [ ] Proporcionar domain: `<AUTH0_DOMAIN>`
- [ ] Proporcionar Client ID: `ImAZkxhgekDXV6tqNyVMXnqJxAHkUQ1`
- [ ] Obtener Client Secret de la aplicación M2M
- [ ] Verificar permisos en Management API
- [ ] Probar comandos: `auth0 apps list`
- [ ] Verificar que scripts funcionen

---

## 🔗 Referencias

- [Auth0 CLI Login](https://auth0.github.io/auth0-cli/auth0_login.html)
- [Machine to Machine Applications](https://auth0.com/docs/applications/concepts/app-types#machine-to-machine-applications)
- [Management API](https://auth0.com/docs/api/management/v2)
