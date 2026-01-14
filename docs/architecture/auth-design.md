# 🔐 Implementación de Autenticación - Dashboard Fascinante Digital

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura](#arquitectura)
3. [Instalación y Setup](#instalación-y-setup)
4. [Uso](#uso)
5. [Testing](#testing)
6. [Despliegue](#despliegue)
7. [Troubleshooting](#troubleshooting)
8. [Referencias](#referencias)

---

## 📊 Resumen Ejecutivo

Este documento describe la implementación de autenticación y autorización del Dashboard Fascinante Digital, basada en:

- **Provider**: Auth0 con soporte para organizaciones (multi-tenant)
- **Framework**: Next.js 15 App Router con React 19
- **Estrategia**: JWT con validación estricta + RBAC
- **Deployment**: Google Cloud Run

### Estado Actual (Post-Implementación)

✅ **Middleware de Next.js** - Protección de rutas antes de SSR
✅ **Obtención de usuario real** - No más datos hardcoded
✅ **RBAC completo** - Roles y permisos granulares
✅ **Multi-tenant enforcement** - Validación de org_id
✅ **Security headers** - HSTS, X-Frame-Options, etc.
✅ **Tests unitarios** - Coverage > 80% en módulos críticos

---

## 🏗️ Arquitectura

### Flujo de Autenticación

```
┌─────────────┐
│   Browser   │ 1. User clicks "Login"
└──────┬──────┘
       │
       ↓
┌─────────────────────────┐
│ middleware.ts           │ 2. Check session
│ ✓ Validates session     │    → If no session: redirect /login
│ ✓ Validates org access  │    → If session: continue
└──────┬──────────────────┘
       │
       ↓ 3. Protected route accessed
┌─────────────────────────┐
│ /api/auth/login         │ 4. Redirect to Auth0
│ (Auth0 SDK)             │
└──────┬──────────────────┘
       │
       ↓ 5. User authenticates
┌─────────────────────────┐
│ Auth0 Universal Login   │ 6. User logs in
│ - Email/Password        │    - Selects organization
│ - Social (Google, etc.) │    - MFA if enabled
└──────┬──────────────────┘
       │
       ↓ 7. Callback with code
┌─────────────────────────┐
│ /api/auth/callback      │ 8. Exchange code → tokens
│ - Gets access_token     │    - Creates session cookie
│ - Gets id_token         │    - Sets org_id cookie
│ - Gets refresh_token    │
└──────┬──────────────────┘
       │
       ↓ 9. Redirect to app
┌─────────────────────────┐
│ Dashboard (Protected)   │ 10. Render with user data
│ - getCurrentUser()      │     - Real user from Auth0
│ - Validate org access   │     - Permissions from JWT
└──────┬──────────────────┘
       │
       ↓ 11. API calls
┌─────────────────────────┐
│ authenticatedFetch()    │ 12. Add Bearer token
│ + X-Organization-Id     │     + Org header
└──────┬──────────────────┘
       │
       ↓ 13. Validate JWT
┌─────────────────────────┐
│ External Backend API    │ 14. Validate claims
│ - Validate aud/iss/exp  │     - Check org_id match
│ - Validate org_id       │     - Check permissions
│ - RLS in queries        │     - Return data
└─────────────────────────┘
```

### Estructura de Archivos

```
src/
├── lib/
│   └── auth/
│       ├── auth0-client.ts          # Configuración Auth0
│       ├── session.ts                # Helpers de sesión
│       ├── permissions.ts            # Sistema RBAC
│       └── __tests__/                # Tests unitarios
│           ├── session.test.ts
│           └── permissions.test.ts
│
├── components/
│   └── auth/
│       └── permission-guard.tsx      # Componentes de autorización
│
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...auth0]/
│   │           └── route.ts          # Rutas de Auth0
│   │
│   ├── (auth)/                       # Páginas públicas
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   └── (dashboard)/                  # Páginas protegidas
│       ├── layout.tsx                # Layout con auth
│       ├── users/
│       ├── settings/
│       └── ...
│
└── middleware.ts                     # Middleware global
```

---

## 🚀 Instalación y Setup

### 1. Instalar Dependencias

```bash
pnpm install @auth0/nextjs-auth0
```

### 2. Configurar Variables de Entorno

Crear `.env.local`:

```bash
# Auth0 Configuration
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_SECRET=use_openssl_rand_hex_32_to_generate
AUTH0_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=<AUTH0_DOMAIN>
AUTH0_ISSUER_BASE_URL=<AUTH0_ISSUER_BASE_URL>
AUTH0_AUDIENCE=<AUTH0_AUDIENCE>

# Application
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=<AUTH0_AUDIENCE>

# Multi-tenant (opcional)
DEFAULT_ORGANIZATION_ID=org_abc123
```

**Generar AUTH0_SECRET**:
```bash
openssl rand -hex 32
```

### 3. Configurar Auth0 Dashboard

1. Ir a [Auth0 Dashboard](https://manage.auth0.com)
2. Crear una **Application** (Regular Web Application)
3. Configurar **Allowed Callback URLs**:
   ```
   http://localhost:3000/api/auth/callback,
   https://your-domain.com/api/auth/callback
   ```
4. Configurar **Allowed Logout URLs**:
   ```
   http://localhost:3000,
   https://your-domain.com
   ```
5. En **Settings** → **Advanced** → **OAuth**:
   - ✅ OIDC Conformant: Enabled
   - ✅ PKCE: Enabled
6. Crear **API** en Auth0:
   - Identifier: `<AUTH0_AUDIENCE>`
   - ✅ Enable RBAC
   - ✅ Add Permissions in the Access Token
7. Crear **Roles** y **Permissions**:
   ```
   Roles:
   - super_admin
   - admin
   - editor
   - member
   - viewer

   Permissions:
   - users:read
   - users:write
   - users:delete
   - projects:read
   - projects:write
   - ... (ver permissions.ts)
   ```

8. **Actions** (opcional pero recomendado):

   Crear Action "Add Claims to Token":

   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = 'https://fascinante.com';

     // Add org_id
     if (event.organization) {
       api.idToken.setCustomClaim(`${namespace}/org_id`, event.organization.id);
       api.idToken.setCustomClaim(`${namespace}/org_name`, event.organization.name);
       api.accessToken.setCustomClaim(`${namespace}/org_id`, event.organization.id);
     }

     // Add roles
     if (event.authorization) {
       api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
       api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
     }

     // Add permissions
     if (event.authorization) {
       const permissions = event.authorization.permissions || [];
       api.accessToken.setCustomClaim(`${namespace}/permissions`, permissions);
     }
   };
   ```

### 4. Ejecutar el Proyecto

```bash
pnpm dev
```

Visitar: http://localhost:3000

---

## 📘 Uso

### Server Components

#### Obtener Usuario Actual

```typescript
// src/app/(dashboard)/page.tsx
import { getCurrentUser } from '@/lib/auth/session'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

#### Validar Permisos en Server Component

```typescript
// src/app/(dashboard)/users/page.tsx
import { getCurrentUser } from '@/lib/auth/session'
import { hasPermission, PERMISSIONS } from '@/lib/auth/permissions'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!hasPermission(user, PERMISSIONS.USERS_READ)) {
    redirect('/403')
  }

  return <UsersList />
}
```

### Client Components

#### Usar Hook de Usuario

```typescript
'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export function UserProfile() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <Spinner />
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

#### Proteger UI con Permisos

```typescript
'use client'

import { PermissionGuard } from '@/components/auth/permission-guard'
import { PERMISSIONS } from '@/lib/auth/permissions'
import { Button } from '@/components/ui/button'

export function UserActions({ userId }: { userId: string }) {
  return (
    <div className="flex gap-2">
      {/* Botón visible solo con permiso users:write */}
      <PermissionGuard permission={PERMISSIONS.USERS_WRITE} fallback={null}>
        <Button onClick={() => editUser(userId)}>Edit</Button>
      </PermissionGuard>

      {/* Botón visible solo con permiso users:delete */}
      <PermissionGuard permission={PERMISSIONS.USERS_DELETE} fallback={null}>
        <Button variant="destructive" onClick={() => deleteUser(userId)}>
          Delete
        </Button>
      </PermissionGuard>
    </div>
  )
}
```

#### Validar Múltiples Permisos

```typescript
import { PermissionGuard } from '@/components/auth/permission-guard'
import { PERMISSIONS } from '@/lib/auth/permissions'

export function DangerZone() {
  return (
    // Requiere AMBOS permisos (AND)
    <PermissionGuard
      permissions={[PERMISSIONS.USERS_DELETE, PERMISSIONS.ORGS_DELETE]}
      requireAll={true}
      fallback={<p>You don't have access to this section</p>}
    >
      <div className="border-red-500 border p-4">
        <h3>Danger Zone</h3>
        <Button variant="destructive">Delete Everything</Button>
      </div>
    </PermissionGuard>
  )
}
```

#### Usar Hooks de Permisos

```typescript
'use client'

import { usePermissions, useRoles } from '@/components/auth/permission-guard'
import { PERMISSIONS } from '@/lib/auth/permissions'

export function UserMenu() {
  const { hasPermission } = usePermissions()
  const { isAdmin } = useRoles()

  return (
    <DropdownMenu>
      <DropdownMenuItem>Profile</DropdownMenuItem>

      {hasPermission(PERMISSIONS.SETTINGS_WRITE) && (
        <DropdownMenuItem>Settings</DropdownMenuItem>
      )}

      {isAdmin() && (
        <DropdownMenuItem>Admin Panel</DropdownMenuItem>
      )}

      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
    </DropdownMenu>
  )
}
```

### API Routes (Server Actions)

#### Llamar API Externa con Token

```typescript
// src/app/actions/users.ts
'use server'

import { authenticatedFetch } from '@/lib/api-client'
import { getCurrentOrgId } from '@/lib/auth/session'

export async function getUsers() {
  const orgId = await getCurrentOrgId()

  const users = await authenticatedFetch('/v1/users', {
    organizationId: orgId,
  })

  return users
}
```

#### Proteger Server Action con Permisos

```typescript
'use server'

import { requireAuth } from '@/lib/auth/session'
import { requirePermission, PERMISSIONS } from '@/lib/auth/permissions'

export async function deleteUser(userId: string) {
  // Validar autenticación
  const user = await requireAuth()

  // Validar permiso
  requirePermission(user, PERMISSIONS.USERS_DELETE)

  // Ejecutar acción
  await authenticatedFetch(`/v1/users/${userId}`, {
    method: 'DELETE',
  })
}
```

---

## 🧪 Testing

### Setup de Vitest

Instalar dependencias:

```bash
pnpm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react
```

Crear `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/lib/auth/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Escribir Tests

Ver ejemplos en:
- `src/lib/auth/__tests__/permissions.test.ts`
- `src/lib/auth/__tests__/session.test.ts`

---

## 🚢 Despliegue

### Cloud Run (Google Cloud Platform)

#### 1. Configurar Variables de Entorno

En Cloud Run Console → Service → Edit → Variables:

```bash
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=... # Secret Manager recomendado
AUTH0_SECRET=... # Secret Manager recomendado
AUTH0_BASE_URL=https://your-app.run.app
AUTH0_DOMAIN=<AUTH0_DOMAIN>
AUTH0_ISSUER_BASE_URL=<AUTH0_ISSUER_BASE_URL>
AUTH0_AUDIENCE=<AUTH0_AUDIENCE>
NEXT_PUBLIC_API_BASE_URL=<AUTH0_AUDIENCE>
DEFAULT_ORGANIZATION_ID=org_abc123
NODE_ENV=production
```

#### 2. Actualizar Auth0 Callbacks

En Auth0 Dashboard → Application → Settings:

```
Allowed Callback URLs:
https://your-app.run.app/api/auth/callback

Allowed Logout URLs:
https://your-app.run.app
```

#### 3. Deploy

```bash
# Build
pnpm build

# Deploy (con gcloud CLI)
gcloud run deploy dashboard-fascinante \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Vercel

```bash
# Instalar Vercel CLI
pnpm install -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel Dashboard
```

---

## 🔧 Troubleshooting

### Error: "Invalid state parameter"

**Causa**: Cookie de sesión no persiste (problema de CORS o SameSite)

**Solución**:
1. Verificar que `AUTH0_BASE_URL` coincide con la URL real
2. Verificar cookies en DevTools
3. En producción, asegurar HTTPS

### Error: "Audience validation failed"

**Causa**: `audience` del token no coincide con `AUTH0_AUDIENCE`

**Solución**:
1. Verificar que `AUTH0_AUDIENCE` está configurado
2. En Auth0 Login, pasar `authorizationParameters.audience`
3. Verificar que el API en Auth0 tiene el Identifier correcto

### Usuario no tiene roles/permisos en el token

**Causa**: Claims custom no están configurados en Auth0

**Solución**:
1. Crear Action "Add Claims to Token" (ver sección Setup)
2. Activar "Add Permissions in the Access Token" en API Settings
3. Asignar roles a usuarios en Auth0 Dashboard

### Middleware redirige en loop infinito

**Causa**: Ruta `/login` está protegida por el middleware

**Solución**:
1. Verificar que `/login` está en `PUBLIC_ROUTES` en `middleware.ts`
2. Verificar `matcher` config del middleware

### Tests fallan con "Cannot find module '@auth0/nextjs-auth0'"

**Causa**: Vitest no puede resolver módulos de Next.js

**Solución**:
1. Agregar `alias` en `vitest.config.ts`
2. Usar `vi.mock()` para mockear Auth0

---

## 📚 Referencias

### Documentación Oficial

- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Auth0 Organizations](https://auth0.com/docs/manage-users/organizations)
- [Auth0 RBAC](https://auth0.com/docs/manage-users/access-control/rbac)

### Security Best Practices

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

### Tools

- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens
- [Auth0 Debugger](https://auth0.com/docs/troubleshoot/authentication-issues/debug-authentication) - Debug Auth0 flows
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing

---

## 📞 Soporte

Para preguntas o issues:

1. Revisar este documento y el código en `src/lib/auth/`
2. Consultar [Auth0 Community](https://community.auth0.com/)
3. Abrir issue en el repositorio del proyecto

---

**Última actualización**: Enero 2026
**Versión**: 1.0.0
**Autor**: Dashboard Fascinante Digital Team
