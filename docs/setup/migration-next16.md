# 🚀 MIGRACIÓN A NEXT.JS 16 - Guía de Actualización

**Fecha**: Enero 2026
**Versión anterior**: Next.js 15.1.7
**Versión nueva**: Next.js 16.1.1
**Stack**: Node.js 24 LTS + React 19.2 + TypeScript 5.7

---

## ✅ CAMBIOS APLICADOS

### 1. **Dependencias Actualizadas**

```json
{
  "dependencies": {
    "next": "16.1.1",           // ⬆️ 15.1.7 → 16.1.1
    "react": "19.2.0",          // ⬆️ 19.0.0 → 19.2.0
    "react-dom": "19.2.0"       // ⬆️ 19.0.0 → 19.2.0
  },
  "devDependencies": {
    "@types/node": "^24.0.0",   // ⬆️ 20 → 24 (Node LTS)
    "@types/react": "^19.0.8",  // ⬆️ Actualizado
    "eslint-config-next": "16.1.1", // ⬆️ 15.1.7 → 16.1.1
    "vitest": "^2.1.8",         // 🆕 Agregado
    "@vitest/ui": "^2.1.8",     // 🆕 Agregado
    "@vitejs/plugin-react": "^4.3.4", // 🆕 Agregado
    "@testing-library/react": "^16.1.0", // 🆕 Agregado
    "@testing-library/jest-dom": "^6.6.3" // 🆕 Agregado
  },
  "engines": {
    "node": ">=24.0.0",         // 🆕 Node 24 LTS requerido
    "pnpm": ">=9.0.0"           // 🆕 pnpm moderno
  }
}
```

### 2. **middleware.ts → proxy.ts** ⚠️ CRÍTICO

**ANTES (Next.js 15)**:
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // ...
}
```

**AHORA (Next.js 16)**:
```typescript
// proxy.ts
export default async function proxy(req: NextRequest) {
  // ...
}
```

**Cambios**:
- ✅ Archivo renombrado: `middleware.ts` → `proxy.ts`
- ✅ Export cambiado: `export async function` → `export default async function`
- ✅ Nombre de función: `middleware()` → `proxy()`
- ✅ Todo lo demás IGUAL (lógica, config, etc.)

### 3. **Scripts actualizados**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",  // 🆕 Turbopack habilitado
    "build": "next build",
    "start": "next start",
    "test": "vitest",               // 🆕 Testing con Vitest
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### 4. **TypeScript actualizado**

```json
{
  "compilerOptions": {
    "target": "ES2022",             // ⬆️ ES2017 → ES2022
    "types": ["vitest/globals"]     // 🆕 Soporte Vitest
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "proxy.ts"                      // 🆕 Incluir proxy.ts
  ]
}
```

### 5. **Node.js 24 LTS**

Creado `.nvmrc`:
```
24
```

---

## 📋 PASOS DE MIGRACIÓN (Ya completados)

- [x] 1. Actualizar `package.json` con versiones modernas
- [x] 2. Renombrar `middleware.ts` → `proxy.ts`
- [x] 3. Cambiar export de función a `export default`
- [x] 4. Actualizar `tsconfig.json` a ES2022
- [x] 5. Agregar `.nvmrc` para Node 24
- [x] 6. Agregar dependencias de testing (Vitest)

---

## 🚀 CÓMO ACTUALIZAR (Para desarrolladores)

### Paso 1: Cambiar a Node 24 LTS

```bash
# Usando nvm
nvm install 24
nvm use 24

# Verificar versión
node -v  # Debe mostrar v24.x.x
```

### Paso 2: Limpiar e instalar dependencias

```bash
# Limpiar
rm -rf node_modules .next pnpm-lock.yaml

# Instalar con versiones actualizadas
pnpm install
```

### Paso 3: Verificar build

```bash
# Dev con Turbopack
pnpm dev

# Build de producción
pnpm build
```

### Paso 4: Ejecutar tests

```bash
# Tests unitarios
pnpm test

# Tests con UI
pnpm test:ui

# Coverage
pnpm test:coverage
```

---

## ⚠️ BREAKING CHANGES EN NEXT.JS 16

### 1. **Proxy en lugar de Middleware**
- **Qué cambió**: Archivo y nombre de función
- **Acción requerida**: Ya aplicado (proxy.ts existe)

### 2. **Turbopack por defecto**
- **Qué cambió**: Bundler predeterminado es Turbopack (no Webpack)
- **Acción requerida**: Ninguna (compatible)

### 3. **React 19.2 requerido**
- **Qué cambió**: Nuevas APIs como View Transitions
- **Acción requerida**: Ya actualizado

### 4. **@types/node 24**
- **Qué cambió**: Tipos actualizados para Node 24
- **Acción requerida**: Ya actualizado

---

## 🔍 VERIFICACIÓN POST-MIGRACIÓN

### Checklist de validación:

```bash
# 1. Verificar Node.js
node -v  # → v24.x.x ✅

# 2. Verificar Next.js
pnpm list next  # → 16.1.1 ✅

# 3. Verificar React
pnpm list react  # → 19.2.0 ✅

# 4. Build exitoso
pnpm build  # → Sin errores ✅

# 5. Tests pasan
pnpm test  # → Tests OK ✅

# 6. Proxy funciona
pnpm dev
# Visitar http://localhost:3000/users sin login
# → Debe redirigir a /login ✅
```

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module 'middleware'"
**Causa**: Código importa middleware.ts antiguo
**Solución**: Buscar imports y cambiar a proxy.ts

```bash
# Buscar referencias
grep -r "from.*middleware" src/
grep -r "middleware" src/
```

### Error: "proxy is not a function"
**Causa**: Export incorrecto
**Solución**: Verificar que proxy.ts tiene `export default`

### Error: "Node version not supported"
**Causa**: Node.js < 24
**Solución**:
```bash
nvm use 24
# o
nvm install 24
```

### Error de tipos: "Property 'proxy' does not exist"
**Causa**: tsconfig.json no incluye proxy.ts
**Solución**: Ya está incluido en `tsconfig.json`

---

## 📚 REFERENCIAS

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Next.js Proxy Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [React 19.2 Changelog](https://react.dev/blog)
- [Node.js 24 LTS Release](https://nodejs.org/en/blog/release/)
- [Vitest Documentation](https://vitest.dev)

---

## ✅ ESTADO FINAL

| Componente | Versión Anterior | Versión Nueva | Status |
|------------|------------------|---------------|--------|
| Next.js | 15.1.7 | 16.1.1 | ✅ Actualizado |
| React | 19.0.0 | 19.2.0 | ✅ Actualizado |
| Node.js | 20.x | 24.x LTS | ✅ Actualizado |
| TypeScript | 5.7.3 | 5.7.3 | ✅ OK |
| Middleware | middleware.ts | proxy.ts | ✅ Migrado |
| Bundler | Webpack | Turbopack | ✅ Actualizado |
| Testing | Sin tests | Vitest 2.1.8 | ✅ Agregado |

---

**Migración completada exitosamente** ✅

**Próximos pasos**: Ver `ROADMAP_IMPLEMENTACION.md` para implementar mejoras de seguridad (RBAC, multi-tenant, etc.)
