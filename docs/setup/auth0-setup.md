# 🔐 SETUP AUTH0 - Guía Paso a Paso para WSL

**Fecha**: Enero 8, 2026  
**OS**: WSL (Windows Subsystem for Linux)  
**Status**: Auth0 CLI instalado ✅

---

## 📋 PASO 1: Login en Auth0 CLI

Ya tienes Auth0 CLI instalado. Ahora necesitas hacer login:

```bash
auth0 login
```

**Proceso**:
1. Ejecuta el comando
2. Selecciona "As a user"
3. Presiona Enter para abrir el navegador
4. Confirma el código en la página web
5. Autoriza la aplicación Auth0 CLI
6. Selecciona tu tenant (o créalo si es nuevo)

**Después del login**, verás:
```
▸ Successfully logged in.
▸ Tenant: <AUTH0_DOMAIN>
```

**✅ Guarda estos valores**:
- `Tenant` → Será tu `AUTH0_DOMAIN`
- Ejemplo: `<AUTH0_DOMAIN>`

---

## 📋 PASO 2: Crear Aplicación en Auth0

### Opción A: Usando CLI (RECOMENDADO)

```bash
auth0 apps create
```

**Valores a ingresar**:

1. **Name**: `Dashboard Fascinante Digital`
2. **Description**: `Next.js 16 Dashboard con Auth0`
3. **Type**: Selecciona `Regular Web Application` (NO Single Page!)
   - ⚠️ IMPORTANTE: Next.js con SSR usa "Regular Web Application"
4. **Callback URLs**: `http://localhost:3000/api/auth/callback`
5. **Allowed Logout URLs**: `http://localhost:3000`
6. **Allowed Origins (CORS)**: `http://localhost:3000`
7. **Allowed Web Origins**: `http://localhost:3000`

**Después de crear**, verás:
```
CLIENT ID            abc123xyz...
CLIENT SECRET        def456uvw...
NAME                 Dashboard Fascinante Digital
```

**✅ Guarda estos valores**:
- `CLIENT ID` → Será tu `AUTH0_CLIENT_ID`
- `CLIENT SECRET` → Será tu `AUTH0_CLIENT_SECRET`

---

## 📋 PASO 3: Crear API en Auth0 (Para JWT Audience)

Para usar RBAC y permisos, necesitas crear una **API**:

```bash
auth0 apis create
```

**Valores a ingresar**:

1. **Name**: `Fascinante Digital API`
2. **Identifier**: `<AUTH0_AUDIENCE>`
   - ⚠️ IMPORTANTE: Este será tu `AUTH0_AUDIENCE`
3. **Signing Algorithm**: `RS256` (default)

**✅ Guarda este valor**:
- `Identifier` → Será tu `AUTH0_AUDIENCE`

---

## 📋 PASO 4: Generar AUTH0_SECRET

Este secreto se usa para firmar cookies de sesión:

```bash
# Generar secreto aleatorio de 32 caracteres
openssl rand -base64 32
```

**✅ Copia el resultado** → Será tu `AUTH0_SECRET`

---

## 📋 PASO 5: Configurar Variables de Entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
cp env.example .env.local
nano .env.local
```

**Edita con tus valores reales**:

```bash
# Auth0 Configuration
AUTH0_CLIENT_ID=tu_client_id_aqui
AUTH0_CLIENT_SECRET=tu_client_secret_aqui
AUTH0_SECRET=tu_secret_generado_aqui
AUTH0_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=<AUTH0_DOMAIN>
AUTH0_ISSUER_BASE_URL=<AUTH0_ISSUER_BASE_URL>
AUTH0_AUDIENCE=<AUTH0_AUDIENCE>

# Application
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Multi-tenant (opcional por ahora)
DEFAULT_ORGANIZATION_ID=
```

**⚠️ IMPORTANTE**: `.env.local` NO debe committearse (ya está en .gitignore)

---

## 📋 PASO 6: Verificar Configuración

```bash
# Verificar que el archivo existe
cat .env.local | grep AUTH0

# Verificar que tiene todos los valores
# Debe mostrar:
# AUTH0_CLIENT_ID=...
# AUTH0_CLIENT_SECRET=...
# AUTH0_SECRET=...
# AUTH0_DOMAIN=...
# AUTH0_ISSUER_BASE_URL=...
# AUTH0_AUDIENCE=...
```

---

## 📋 PASO 7: Crear Usuario de Prueba

```bash
auth0 users create
```

**Valores a ingresar**:

1. **Connection**: `Username-Password-Authentication` (default)
2. **Name**: `Dev User`
3. **Email**: `dev@fascinante.local` (o cualquier email)
4. **Password**: Al menos 16 caracteres, con números, letras y símbolos

**Ejemplo de password válido**: `DevPassword123!@#`

---

## 📋 PASO 8: Probar Login

```bash
# Test login con tu aplicación
auth0 test login TU_CLIENT_ID
```

**Proceso**:
1. Se abrirá el navegador
2. Inicia sesión con el usuario que creaste
3. Verás tokens en el terminal

---

## 📋 PASO 9: Verificar en Next.js

```bash
# Iniciar dev server
pnpm dev

# Abrir http://localhost:3000
# Intentar acceder a /users
# → Debe redirigir a /login

# Hacer login con el usuario de prueba
# → Debe redirigir a /users correctamente
```

---

## 🎯 COMANDOS RÁPIDOS DE AUTH0 CLI

```bash
# Ver todos los comandos
auth0 --help

# Listar aplicaciones
auth0 apps list

# Ver detalles de una app
auth0 apps show TU_CLIENT_ID

# Actualizar aplicación
auth0 apps update TU_CLIENT_ID

# Listar usuarios
auth0 users list

# Ver logs en tiempo real
auth0 logs tail

# Ver tenant actual
auth0 tenants ls
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Not logged in"
```bash
# Hacer login nuevamente
auth0 login
```

### Error: "Invalid client_id"
```bash
# Verificar CLIENT_ID en .env.local
cat .env.local | grep CLIENT_ID

# Ver aplicaciones disponibles
auth0 apps list
```

### Error: "Invalid callback URL"
```bash
# Actualizar callback URLs
auth0 apps update TU_CLIENT_ID

# O desde Dashboard: Applications → Settings → Callback URLs
# Agregar: http://localhost:3000/api/auth/callback
```

### Error: "Password too weak"
```bash
# Password debe tener:
# - Mínimo 16 caracteres
# - Al menos 1 número
# - Al menos 1 letra
# - Al menos 1 símbolo especial
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] Auth0 CLI instalado ✅
- [ ] Login exitoso (`auth0 login`)
- [ ] Aplicación creada (`auth0 apps create`)
- [ ] API creada (`auth0 apis create`)
- [ ] AUTH0_SECRET generado
- [ ] `.env.local` creado y configurado
- [ ] Usuario de prueba creado
- [ ] Login test exitoso
- [ ] Next.js dev funciona con auth

---

## 📚 RECURSOS

- **Auth0 CLI Docs**: https://auth0.github.io/auth0-cli
- **Next.js Auth0 SDK**: https://auth0.com/docs/quickstart/webapp/nextjs
- **Auth0 Dashboard**: https://manage.auth0.com

---

## 🚀 PRÓXIMOS PASOS

Una vez configurado Auth0:

1. **Implementar Fase 1** del roadmap (ver `ROADMAP_IMPLEMENTACION.md`)
   - Obtener usuario real en layouts
   - Configurar claims custom
   - Validar org membership

2. **Configurar Actions** en Auth0 Dashboard:
   - Action "Add Custom Claims"
   - Ver `AUTH_IMPLEMENTATION.md` línea 124

3. **Crear Roles y Permisos**:
   - Ver `src/lib/auth/permissions.ts` para lista completa
   - Roles: super_admin, admin, editor, member, viewer
   - Permisos: users:read, users:write, etc.

---

**¿Listo para empezar? Ejecuta**: `auth0 login` 🚀

