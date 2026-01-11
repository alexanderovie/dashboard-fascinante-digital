# Configurar Scopes para Fascinante API

**Fecha:** 2025-01-10
**Status:** ✅ API autorizada, ⚠️ Scopes pendientes

## 📊 Estado Actual

✅ **Fascinante API**: Autorizada
⚠️ **Scopes**: "There are no permissions (scopes) defined yet"

## 🎯 ¿Por qué necesitas scopes?

Los **scopes** (permisos) definen qué puede hacer tu aplicación con la API:

- Sin scopes: Puedes obtener tokens, pero pueden no tener permisos
- Con scopes: Defines exactamente qué operaciones están permitidas

## 📋 Scopes Recomendados (basados en tu código)

Según tu sistema de permisos en `src/lib/auth/permissions.ts`, estos son los scopes que probablemente necesites:

### Para Usuarios:
```
read:users      - Leer usuarios
write:users     - Crear/actualizar usuarios
delete:users    - Eliminar usuarios
```

### Para Organizaciones (Multi-tenant):
```
read:organizations    - Leer organizaciones
write:organizations   - Crear/actualizar organizaciones
delete:organizations  - Eliminar organizaciones
read:members          - Leer miembros de organización
write:members         - Invitar/actualizar miembros
```

### Para Proyectos/Tareas:
```
read:projects    - Leer proyectos
write:projects   - Crear/actualizar proyectos
delete:projects  - Eliminar proyectos
read:tasks       - Leer tareas
write:tasks      - Crear/actualizar tareas
```

### Para Configuración:
```
read:settings    - Leer configuración
write:settings   - Actualizar configuración
```

### Para API Keys y Webhooks:
```
read:api_keys    - Leer API keys
write:api_keys   - Crear/actualizar API keys
read:webhooks    - Leer webhooks
write:webhooks   - Crear/actualizar webhooks
```

## 🔧 Cómo Configurar

### Paso 1: Definir Scopes en la API

1. Ve a **APIs** → **Fascinante API**
2. Tab **Permissions**
3. Agrega cada scope (uno por uno):
   - Click en **"+ Add Permission"**
   - **Name**: `read:users`
   - **Description**: `Read user information`
   - Click **Add**
   - Repite para cada scope

### Paso 2: Otorgar Scopes a la Aplicación

1. Ve a **Applications** → **Dashboard Fascinante Digital**
2. Tab **APIs**
3. En **Fascinante API**, selecciona los scopes que necesitas
4. Click **Update**

## 🎯 Scopes Mínimos Recomendados (para empezar)

Si tu backend aún no está implementado completamente, puedes empezar con estos mínimos:

```
read:profile       - Leer perfil del usuario autenticado
write:profile      - Actualizar perfil del usuario
read:organizations - Leer organizaciones del usuario
```

## ⚠️ Importante

### Para Authorization Code Flow (tu caso):

Los scopes se solicitan automáticamente cuando llamas a `getAccessToken({ audience })`.

**Pero** tu backend debe validar que el token tenga los scopes necesarios para cada endpoint.

### Ejemplo en tu Backend (Fastify):

```typescript
// Tu backend debe verificar scopes
fastify.get('/v1/users', {
  preHandler: [requireScope('read:users')]
}, async (req, reply) => {
  // ...
})
```

## 📋 Checklist

- [ ] Definir scopes en Fascinante API → Permissions tab
- [ ] Otorgar scopes a Dashboard Fascinante Digital → APIs tab
- [ ] Configurar validación de scopes en tu backend Fastify
- [ ] Probar que `getAccessToken()` devuelve token con scopes
- [ ] Verificar que las llamadas al backend funcionan

## 🔍 Cómo Verificar que Funciona

Después de configurar, puedes verificar en tu app:

```typescript
// En una Server Component o Route Handler
import { getAccessToken } from "@auth0/nextjs-auth0"

const tokenResponse = await getAccessToken({
  audience: "https://api.fascinantedigital.com"
})

// El token debería incluir los scopes en el claim 'scope'
```

## 🎯 Próximos Pasos

1. **Ahora**: Definir scopes básicos en la API
2. **Luego**: Cuando implementes el backend, agrega más scopes según necesidad
3. **Backend**: Implementa validación de scopes en cada endpoint
