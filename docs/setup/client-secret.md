# 🔐 Obtener CLIENT SECRET de Auth0

**Aplicación**: Dashboard Fascinante Digital
**CLIENT ID**: `FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7`

---

## 📋 OPCIÓN 1: Desde Auth0 Dashboard (RECOMENDADO)

### Pasos:

1. **Abrir Dashboard**:
   ```
   https://manage.auth0.com
   ```

2. **Navegar a Applications**:
   - Sidebar izquierdo → **Applications**
   - Buscar: **"Dashboard Fascinante Digital"**
   - Click en la aplicación

3. **Ir a Settings**:
   - Tab: **Settings** (si no estás ahí)

4. **Copiar Client Secret**:
   - Buscar sección: **"Client Secret"**
   - Click en el ícono del ojo 👁️ para revelar
   - Click en **"Copy"** o **"Reveal"**

5. **Actualizar .env.local**:
   ```bash
   nano .env.local
   # O usar tu editor favorito
   # Reemplazar: AUTH0_CLIENT_SECRET=OBTENER_DESDE_DASHBOARD_AUTH0
   # Con: AUTH0_CLIENT_SECRET=tu_secret_real_aqui
   ```

---

## 📋 OPCIÓN 2: Desde CLI (Si está disponible)

```bash
# Intentar obtener secret (puede no funcionar por seguridad)
auth0 apps show FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7 --json | jq -r '.client_secret'
```

**⚠️ Nota**: Auth0 CLI normalmente NO muestra el Client Secret por seguridad después de la creación inicial.

---

## 📋 OPCIÓN 3: Generar Nuevo Client Secret

Si perdiste el secret original, puedes generar uno nuevo:

### Desde Dashboard:
1. Applications → Dashboard Fascinante Digital → Settings
2. Scroll hasta "Client Secret"
3. Click en **"Rotate"** o **"Regenerate"**
4. Copiar el nuevo secret

### Desde CLI:
```bash
# Rotar el secret (genera uno nuevo)
auth0 apps secret rotate FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7
```

**⚠️ Importante**: Si rotas el secret, todas las sesiones activas se invalidarán.

---

## ✅ DESPUÉS DE OBTENER EL SECRET

1. **Actualizar .env.local**:
   ```bash
   # Editar .env.local
   nano .env.local

   # Cambiar esta línea:
   AUTH0_CLIENT_SECRET=OBTENER_DESDE_DASHBOARD_AUTH0

   # Por:
   AUTH0_CLIENT_SECRET=tu_secret_real_aqui
   ```

2. **Verificar que funciona**:
   ```bash
   # Iniciar dev server
   pnpm dev

   # Visitar http://localhost:3000/users
   # Debe redirigir a /login (si no estás autenticado)
   ```

3. **Test login**:
   ```bash
   # Test con Auth0 CLI
   auth0 test login FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7
   ```

---

## 🔗 ENLACES ÚTILES

- **Dashboard Directo**: https://manage.auth0.com/dashboard/us/dev-xz2zgl2c0w6gfvbk/applications/FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7/settings
- **Auth0 CLI Docs**: https://auth0.github.io/auth0-cli
- **Documentación Auth0**: https://auth0.com/docs

---

## 📊 RESUMEN DE VALORES

Ya configurado en `.env.local`:
- ✅ **AUTH0_CLIENT_ID**: `FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7`
- ✅ **AUTH0_SECRET**: `xxZSPtN7fYvxURRqgazY29O4i2rxoFlM6ITk+zs/VfQ=`
- ✅ **AUTH0_DOMAIN**: `dev-xz2zgl2c0w6gfvbk.us.auth0.com`
- ✅ **AUTH0_ISSUER_BASE_URL**: `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com`
- ✅ **AUTH0_AUDIENCE**: `https://api.fascinantedigital.com`
- ⏳ **AUTH0_CLIENT_SECRET**: Obtener desde Dashboard ← **PENDIENTE**

---

**Siguiente paso**: Obtener Client Secret y actualizar `.env.local` 🚀
