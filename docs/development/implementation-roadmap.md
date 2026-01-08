# 🗺️ ROADMAP DE IMPLEMENTACIÓN - AUTENTICACIÓN SEGURA

## Estado: 📍 Listo para Ejecutar

Este documento es la **guía paso a paso** para implementar las mejoras de seguridad de autenticación. Un desarrollador nuevo puede seguir este roadmap de principio a fin.

---

## 📅 Timeline General

| Fase | Duración | Prioridad | Dependencias |
|------|----------|-----------|--------------|
| **Fase 1** | 2 semanas | 🔴 P0 | Ninguna |
| **Fase 2** | 1 semana | 🟠 P1 | Fase 1 |
| **Fase 3** | 1 semana | 🟠 P1 | Fase 1 |
| **Fase 4** | 1 semana | 🟡 P1 | Fase 1 |
| **Fase 5** | 1 semana | 🟢 P2 | Fase 1-4 |
| **Fase 6** | 2 semanas | 🟢 P2 | Fase 1-5 |

**Total: 8 semanas** (puede paralelizar Fase 2-4 si hay múltiples devs)

---

## 🚀 FASE 1: Fundamentos de Seguridad (Semanas 1-2) 🔴 CRÍTICO

### Objetivo
Eliminar vulnerabilidades P0 y establecer protección básica de rutas.

### Pre-requisitos
- [ ] Acceso a Auth0 Dashboard
- [ ] Permisos de admin en Auth0 tenant
- [ ] Acceso al repositorio
- [ ] Variables de entorno de desarrollo configuradas

---

### 📋 Checklist de Tareas

#### ✅ Tarea 1.1: Implementar Middleware de Next.js

**Archivo**: `middleware.ts` (ya creado)

**Pasos**:
1. ✅ **HECHO**: El archivo `middleware.ts` ya fue generado en la raíz del proyecto
2. ⬜ Revisar el archivo y entender la lógica
3. ⬜ Verificar que las rutas públicas en `PUBLIC_ROUTES` son correctas para tu caso
4. ⬜ Agregar/remover rutas según necesites
5. ⬜ Commitear el archivo

**Testing manual**:
```bash
# 1. Iniciar el servidor
pnpm dev

# 2. Sin estar logueado, intentar acceder a:
# http://localhost:3000/users
# → Debe redirigir a /login

# 3. Intentar acceder a ruta pública:
# http://localhost:3000/login
# → Debe cargar sin redirect

# 4. Loguearse y acceder a:
# http://localhost:3000/users
# → Debe cargar normalmente
```

**Criterio de aceptación**:
- ✅ Rutas protegidas redirigen a `/login` si no hay sesión
- ✅ Rutas públicas son accesibles sin login
- ✅ Después de login, redirect funciona correctamente

---

#### ⬜ Tarea 1.2: Obtener Usuario Real en Dashboard Layout

**Archivos**:
- `src/app/(dashboard)/layout.tsx` (modificar)
- `src/app/(dashboard)/layout-improved.tsx.example` (referencia)

**Pasos**:

1. **Backup del layout actual**:
   ```bash
   cp src/app/\(dashboard\)/layout.tsx src/app/\(dashboard\)/layout.tsx.backup
   ```

2. **Abrir el archivo example**:
   ```bash
   code src/app/\(dashboard\)/layout-improved.tsx.example
   ```

3. **Copiar la implementación mejorada** al `layout.tsx` real:
   - Importar `getCurrentUser` de `@/lib/auth/session`
   - Reemplazar lógica de autenticación
   - Pasar usuario real a `<AppSidebar>`

4. **Actualizar `AppSidebar`** si es necesario:
   ```typescript
   // src/components/layout/app-sidebar.tsx
   // Cambiar de:
   // <NavUser user={sidebarData.user} />
   // A:
   // <NavUser user={user} /> // user viene de props
   ```

5. **Remover datos hardcoded**:
   ```bash
   # Abrir src/components/layout/data/sidebar-data.tsx
   # Remover o comentar el objeto `user`
   ```

**Testing**:
```bash
# 1. Login con tu usuario real de Auth0
# 2. Verificar que el sidebar muestra TU nombre y email
# 3. Verificar que el avatar es el correcto (si lo tienes)
```

**Criterio de aceptación**:
- ✅ Sidebar muestra nombre y email del usuario logueado
- ✅ No más datos hardcoded ("ausrobdev", "rob@shadcnblocks.com")
- ✅ Avatar del usuario se muestra correctamente

---

#### ⬜ Tarea 1.3: Configurar Auth0 para Claims Custom

**Pasos**:

1. **Ir a Auth0 Dashboard** → Actions → Library → Build Custom

2. **Crear nuevo Action**:
   - **Name**: `Add Custom Claims`
   - **Trigger**: `Login / Post Login`
   - **Runtime**: Node 18

3. **Código del Action**:
   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = 'https://fascinante.com';

     // Add organization info
     if (event.organization) {
       api.idToken.setCustomClaim(`${namespace}/org_id`, event.organization.id);
       api.idToken.setCustomClaim(`${namespace}/org_name`, event.organization.name);
       api.accessToken.setCustomClaim(`${namespace}/org_id`, event.organization.id);
     }

     // Add roles
     const roles = event.authorization?.roles || [];
     api.idToken.setCustomClaim(`${namespace}/roles`, roles);
     api.accessToken.setCustomClaim(`${namespace}/roles`, roles);

     // Add permissions
     const permissions = event.authorization?.permissions || [];
     api.accessToken.setCustomClaim(`${namespace}/permissions`, permissions);
   };
   ```

4. **Deploy** el Action

5. **Añadir al Flow**:
   - Actions → Flows → Login
   - Drag el Action "Add Custom Claims" al flow
   - Apply

6. **Verificar que funciona**:
   - Logout y login nuevamente
   - Ir a https://jwt.io
   - Copiar tu `id_token` (desde DevTools → Application → Cookies → `appSession`)
   - Decodificar y verificar que tiene los claims `https://fascinante.com/org_id`, etc.

**Criterio de aceptación**:
- ✅ JWT contiene claims custom bajo namespace `https://fascinante.com/`
- ✅ `org_id`, `roles`, `permissions` están presentes

---

#### ⬜ Tarea 1.4: Crear Roles y Permisos en Auth0

**Pasos**:

1. **Ir a Auth0 Dashboard** → User Management → Roles

2. **Crear Roles**:
   - Click "Create Role"
   - Name: `super_admin`, Description: Full access
   - Name: `admin`, Description: Organization admin
   - Name: `editor`, Description: Can edit resources
   - Name: `member`, Description: Standard member
   - Name: `viewer`, Description: Read-only access

3. **Ir a Applications** → APIs → (tu API) → Permissions

4. **Crear Permisos** (según `src/lib/auth/permissions.ts`):
   ```
   users:read
   users:write
   users:delete
   projects:read
   projects:write
   projects:delete
   settings:read
   settings:write
   organizations:read
   organizations:write
   organizations:delete
   organizations:invite
   billing:read
   billing:write
   api_keys:read
   api_keys:write
   webhooks:read
   webhooks:write
   ```

5. **Asignar Permisos a Roles**:
   - User Management → Roles → `admin` → Permissions
   - Add permissions: `users:read`, `users:write`, etc.
   - Repetir para cada rol

6. **Asignar Rol a tu usuario**:
   - User Management → Users → [tu usuario]
   - Roles → Assign Roles → `admin`

7. **Verificar**:
   - Logout y login
   - Decodificar JWT en jwt.io
   - Verificar que tiene `permissions: ["users:read", "users:write", ...]`

**Criterio de aceptación**:
- ✅ Roles creados en Auth0
- ✅ Permisos creados en Auth0 API
- ✅ Permisos asignados a roles
- ✅ Tu usuario tiene rol `admin` o `super_admin`
- ✅ JWT contiene array de permisos

---

#### ⬜ Tarea 1.5: Validar Organization Membership (Backend)

**Nota**: Esta tarea requiere un endpoint en tu **backend externo** (`https://api.fascinantedigital.com`).

**Backend (API externa - Express/Fastify)**:

Crear endpoint:
```typescript
// GET /v1/organizations/:orgId/members/:userId
// Retorna: { isMember: true/false }

router.get('/organizations/:orgId/members/:userId', async (req, res) => {
  const { orgId, userId } = req.params;

  // Validar JWT (aud, iss, exp)
  // ...

  // Query DB
  const isMember = await db.query(
    'SELECT 1 FROM organization_members WHERE org_id = $1 AND user_id = $2',
    [orgId, userId]
  );

  if (!isMember) {
    return res.status(403).json({ error: 'Not a member of this organization' });
  }

  res.json({ isMember: true });
});
```

**Next.js (Frontend)**:

Modificar `src/lib/api-client.ts`:
```typescript
// Agregar validación de org antes de cada request
export async function authenticatedFetch(path, options) {
  const orgId = options.organizationId;
  const user = await getCurrentUser();

  // Validar que el usuario pertenece a la org
  if (orgId && user) {
    const validateUrl = `${API_URL}/v1/organizations/${orgId}/members/${user.sub}`;
    const validateRes = await fetch(validateUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!validateRes.ok) {
      throw new ApiClientError('Not a member of this organization', 403);
    }
  }

  // Continuar con request original...
}
```

**Testing**:
1. Crear 2 organizaciones en Auth0
2. Asignar tu usuario a Org A
3. Intentar acceder con `X-Organization-Id: org_b_id`
4. Debe retornar 403

**Criterio de aceptación**:
- ✅ Endpoint de validación funciona
- ✅ Intento de acceso cross-tenant retorna 403
- ✅ Acceso válido funciona normalmente

---

### 📊 Definition of Done - Fase 1

Al finalizar la Fase 1, debes poder marcar **TODAS** estas casillas:

- [ ] Middleware de Next.js está activo y funcionando
- [ ] Rutas protegidas requieren autenticación
- [ ] Rutas públicas son accesibles sin login
- [ ] Sidebar muestra usuario REAL (no hardcoded)
- [ ] JWT contiene claims custom (org_id, roles, permissions)
- [ ] Roles y permisos creados en Auth0
- [ ] Usuario de prueba tiene rol asignado
- [ ] Validación de org membership implementada
- [ ] Tests manuales pasan (login, logout, redirect, 403)
- [ ] Code review aprobado
- [ ] Merged a `develop` branch

**🎯 Riesgos P0 eliminados**: P0-1, P0-2, P0-3, P0-4

---

## 🔐 FASE 2: RBAC y Autorización (Semana 3)

### Objetivo
Implementar control de acceso basado en roles y permisos.

### Pre-requisitos
- ✅ Fase 1 completada
- ✅ Roles y permisos en Auth0
- ✅ JWT con claims de permisos

---

### 📋 Checklist de Tareas

#### ⬜ Tarea 2.1: Proteger Páginas por Permisos

**Ejemplo: Página de Users**

```typescript
// src/app/(dashboard)/users/page.tsx
import { getCurrentUser } from '@/lib/auth/session'
import { hasPermission, PERMISSIONS } from '@/lib/auth/permissions'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const user = await getCurrentUser()

  // Validar permiso
  if (!hasPermission(user, PERMISSIONS.USERS_READ)) {
    redirect('/403?reason=missing_permission&required=users:read')
  }

  // Rest of the page...
  return <UsersList />
}
```

**Aplicar a todas las páginas protegidas**:
- `/users` → `PERMISSIONS.USERS_READ`
- `/users/[id]` → `PERMISSIONS.USERS_READ`
- `/settings` → `PERMISSIONS.SETTINGS_READ`
- `/developers/*` → Permisos correspondientes

**Testing**:
1. Login con usuario `viewer` (solo lectura)
2. Intentar acceder a `/users` → debe funcionar
3. Intentar editar usuario → botón "Edit" no debe aparecer
4. Login con usuario `admin`
5. Botón "Edit" debe aparecer

---

#### ⬜ Tarea 2.2: Proteger UI con PermissionGuard

**Ejemplo: Botones de acciones**

```typescript
// src/app/(dashboard)/users/components/user-actions.tsx
import { PermissionGuard } from '@/components/auth/permission-guard'
import { PERMISSIONS } from '@/lib/auth/permissions'

export function UserActions({ userId }) {
  return (
    <div className="flex gap-2">
      {/* Solo visible con users:write */}
      <PermissionGuard permission={PERMISSIONS.USERS_WRITE} fallback={null}>
        <Button onClick={() => editUser(userId)}>Edit</Button>
      </PermissionGuard>

      {/* Solo visible con users:delete */}
      <PermissionGuard permission={PERMISSIONS.USERS_DELETE} fallback={null}>
        <Button variant="destructive" onClick={() => deleteUser(userId)}>
          Delete
        </Button>
      </PermissionGuard>
    </div>
  )
}
```

**Aplicar a**:
- Items de sidebar (ocultar si no tiene permiso)
- Botones de acciones
- Tabs/secciones de páginas
- Formularios

---

#### ⬜ Tarea 2.3: Proteger Server Actions

```typescript
// src/app/actions/users.ts
'use server'

import { requireAuth } from '@/lib/auth/session'
import { requirePermission, PERMISSIONS } from '@/lib/auth/permissions'

export async function deleteUser(userId: string) {
  const user = await requireAuth()
  requirePermission(user, PERMISSIONS.USERS_DELETE)

  // Execute action
  await authenticatedFetch(`/v1/users/${userId}`, {
    method: 'DELETE',
  })

  revalidatePath('/users')
}
```

---

### 📊 Definition of Done - Fase 2

- [ ] Todas las páginas protegidas validan permisos
- [ ] UI adaptativa según permisos del usuario
- [ ] Server actions validan permisos
- [ ] Tests: viewer NO puede editar/eliminar
- [ ] Tests: admin PUEDE editar/eliminar
- [ ] Code review aprobado

**🎯 Riesgos eliminados**: P1-2 (Sin RBAC)

---

## 🏢 FASE 3: Multi-Tenant Robusto (Semana 4)

### Objetivo
Asegurar aislamiento total entre organizaciones.

### Tareas principales:
1. Implementar `OrganizationProvider` (Context API)
2. Selector de organizaciones funcional
3. Validación estricta de `org_id` en queries
4. Tests de cross-tenant access

**Detalles completos**: Ver sección "FASE 3" en el documento de auditoría principal.

---

## 🛡️ FASE 4: Seguridad Avanzada (Semana 5)

### Objetivo
Rate limiting, audit logging, token revocation.

### Tareas principales:
1. Instalar y configurar Upstash Redis
2. Implementar rate limiting con `@upstash/ratelimit`
3. Structured logging con `pino`
4. Token blacklist en Redis
5. Backchannel logout

---

## ⚡ FASE 5: Performance y Caching (Semana 6)

### Objetivo
Optimizar latencia y reducir llamadas a Auth0.

### Tareas principales:
1. JWKS caching local
2. Session caching extendido
3. Org membership caching
4. Lazy load de permisos

---

## 🧪 FASE 6: Testing y Hardening (Semanas 7-8)

### Objetivo
Cobertura de tests + hardening final.

### Tareas principales:

#### Tests Unitarios
```bash
pnpm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react

# Ejecutar tests
pnpm test

# Coverage
pnpm test:coverage
```

#### Tests de Integración
- Flujo completo: login → dashboard → API → logout
- Multi-tenant: user A no ve datos de org B
- RBAC: viewer no puede delete

#### Security Headers
- Validar que todos los headers están en `middleware.ts`

#### Penetration Testing
- Ejecutar OWASP ZAP
- Manual testing de IDOR, CSRF, XSS

---

## 📝 Tracking de Progreso

Copia esta tabla a un issue de GitHub o Notion:

| Fase | Status | Fecha Inicio | Fecha Fin | Notas |
|------|--------|--------------|-----------|-------|
| Fase 1 | ⬜ Not Started | | | |
| Fase 2 | ⬜ Not Started | | | |
| Fase 3 | ⬜ Not Started | | | |
| Fase 4 | ⬜ Not Started | | | |
| Fase 5 | ⬜ Not Started | | | |
| Fase 6 | ⬜ Not Started | | | |

**Estados**: ⬜ Not Started | 🟡 In Progress | ✅ Done | 🔴 Blocked

---

## 🆘 Puntos de Contacto

Si te bloqueas en alguna fase:

1. **Auth0 Issues**: https://community.auth0.com
2. **Next.js Issues**: https://github.com/vercel/next.js/discussions
3. **Security Questions**: Revisar `SECURITY.md` y `AUTH_IMPLEMENTATION.md`
4. **Code Review**: Solicitar en PR con tag `security-review`

---

## ✅ Checklist Final (Post-Implementación)

Antes de ir a producción, verificar:

- [ ] Todas las 6 fases completadas
- [ ] Tests unitarios > 80% coverage
- [ ] Tests de integración pasan
- [ ] Security headers configurados
- [ ] Rate limiting activo
- [ ] Audit logging funcionando
- [ ] Secrets en Secret Manager (no en .env)
- [ ] Auth0 callbacks actualizados para prod
- [ ] Documentación actualizada
- [ ] Runbook de incident response creado
- [ ] Monitoring y alertas configuradas
- [ ] Backup de configuración de Auth0
- [ ] Pentest ejecutado (sin findings críticos)
- [ ] Code freeze comunicado
- [ ] Rollback plan documentado

---

**¡Éxito en la implementación! 🚀**

Si completas las 6 fases, tu sistema de autenticación estará al nivel de startups enterprise 2026-2028.
