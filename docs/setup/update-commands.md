# 🚀 COMANDOS DE ACTUALIZACIÓN - Stack Moderno 2026

## 📋 PASO A PASO (Ejecutar en orden)

### 1️⃣ PREPARACIÓN (5 min)

```bash
# Verificar Node.js actual
node -v

# Si NO es v24.x, instalar Node 24 LTS
nvm install 24
nvm use 24

# Verificar que ahora es 24
node -v  # → v24.x.x ✅
```

---

### 2️⃣ BACKUP (2 min)

```bash
# Crear backup del proyecto
cd ..
cp -r dashboard-fascinante-digital dashboard-fascinante-digital-backup

# Volver al proyecto
cd dashboard-fascinante-digital
```

---

### 3️⃣ LIMPIEZA COMPLETA (3 min)

```bash
# Eliminar node_modules y lockfile
rm -rf node_modules
rm -rf .next
rm pnpm-lock.yaml

# Limpiar cache de pnpm (opcional)
pnpm store prune
```

---

### 4️⃣ INSTALACIÓN FRESCA (5-10 min)

```bash
# Instalar dependencias con versiones actualizadas
pnpm install

# Si hay conflictos de peer dependencies
pnpm install --force
```

**Verificar que se instalaron las versiones correctas**:
```bash
pnpm list next       # → 16.1.1 ✅
pnpm list react      # → 19.2.0 ✅
pnpm list @types/node # → 24.x ✅
pnpm list vitest     # → 2.1.8 ✅
```

---

### 5️⃣ VERIFICACIÓN DE BUILD (3 min)

```bash
# Build de producción
pnpm build

# Si todo OK, debe completar sin errores ✅
```

---

### 6️⃣ TESTING (2 min)

```bash
# Ejecutar tests unitarios
pnpm test

# Si hay tests, deben pasar ✅
```

---

### 7️⃣ DESARROLLO LOCAL (1 min)

```bash
# Iniciar servidor de desarrollo con Turbopack
pnpm dev

# Abrir http://localhost:3000
# Verificar que la app carga correctamente ✅
```

---

### 8️⃣ VALIDACIÓN DE AUTH (5 min)

#### Test 1: Ruta protegida sin login
```bash
# Con el servidor corriendo (pnpm dev)
# Abrir en navegador: http://localhost:3000/users

# ✅ ESPERADO: Redirige a /login
```

#### Test 2: Ruta pública
```bash
# Abrir: http://localhost:3000/login

# ✅ ESPERADO: Carga la página de login
```

#### Test 3: Login y acceso
```bash
# 1. Hacer login con Auth0
# 2. Intentar acceder a: http://localhost:3000/users

# ✅ ESPERADO: Muestra la página (si estás autenticado)
```

---

## 🔍 VERIFICACIÓN COMPLETA

### Checklist final:

```bash
# 1. Node.js
node -v  # → v24.x.x ✅

# 2. Next.js
pnpm list next  # → 16.1.1 ✅

# 3. React
pnpm list react  # → 19.2.0 ✅

# 4. Proxy existe
ls -la proxy.ts  # → Archivo existe ✅

# 5. Middleware NO existe
ls -la middleware.ts  # → No existe (eliminado) ✅

# 6. Build exitoso
pnpm build  # → Sin errores ✅

# 7. Dev server funciona
pnpm dev  # → Inicia en http://localhost:3000 ✅
```

---

## ⚠️ SI HAY ERRORES

### Error: "Module not found: 'middleware'"
```bash
# Buscar referencias antiguas
grep -r "middleware" src/
grep -r "from.*middleware" src/

# Cambiar imports de middleware a proxy (si los hay)
```

### Error: "Node version not supported"
```bash
# Instalar Node 24
nvm install 24
nvm use 24

# Verificar
node -v
```

### Error: "Cannot find module '@vitejs/plugin-react'"
```bash
# Reinstalar dependencias de dev
pnpm install -D @vitejs/plugin-react @vitest/ui vitest
```

### Error: "Type error: Property 'proxy' does not exist"
```bash
# Limpiar cache de TypeScript
rm -rf .next
rm -rf node_modules/.cache

# Reiniciar TypeScript server en VSCode
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Error de peer dependencies
```bash
# Forzar instalación
pnpm install --force

# O con legacy peer deps
pnpm install --legacy-peer-deps
```

---

## 🎯 RESUMEN DE COMANDOS (One-liner)

```bash
# Todo en uno (usar solo si confías en tu setup)
nvm use 24 && \
rm -rf node_modules .next pnpm-lock.yaml && \
pnpm install && \
pnpm build && \
pnpm dev
```

---

## 📊 TIEMPOS ESTIMADOS

| Paso | Tiempo | Descripción |
|------|--------|-------------|
| 1. Node.js | 2-5 min | Instalar/cambiar a v24 |
| 2. Backup | 2 min | Copiar proyecto |
| 3. Limpieza | 1 min | rm node_modules |
| 4. Instalación | 5-10 min | pnpm install |
| 5. Build | 2-3 min | pnpm build |
| 6. Testing | 1-2 min | pnpm test |
| 7. Dev | 1 min | pnpm dev |
| 8. Validación | 5 min | Tests manuales |
| **TOTAL** | **20-30 min** | Todo el proceso |

---

## ✅ ÉXITO SI VES

1. ✅ `pnpm install` termina sin errores
2. ✅ `pnpm build` completa exitosamente
3. ✅ `pnpm dev` inicia en http://localhost:3000
4. ✅ Rutas protegidas redirigen a /login
5. ✅ Login con Auth0 funciona
6. ✅ Sidebar muestra datos (aunque sean hardcoded por ahora)

---

## 📞 SIGUIENTE PASO

Una vez que TODO funcione:

```bash
# Ver roadmap de implementación
cat ROADMAP_IMPLEMENTACION.md

# Implementar Fase 1 (seguridad crítica)
# Ver START_HERE.md para instrucciones
```

---

**¡Listo! Stack actualizado a 2026 con Node 24 LTS + Next.js 16 + React 19.2** 🚀
