# 🔧 Solución: Alertas de Auth0

## 📋 Problemas Detectados

### 1. ❌ "Credenciales de prueba" (Test Credentials)

**Síntoma:**
```
Alertas
Credenciales de prueba
Una de tus conexiones o más están usando credenciales de desarrollo
de Auth0 que no deben usarse en producción.
```

**Causa:**
Una o más conexiones en Auth0 están usando credenciales de desarrollo/prueba que Auth0 proporciona por defecto. Estas credenciales:
- Son públicas y conocidas
- No son seguras para producción
- Pueden ser compartidas entre múltiples tenants

**Conexiones que comúnmente usan credenciales de prueba:**
- ✅ **Database Connection** (Username-Password-Authentication)
- ✅ **Social Connections** (Google, Facebook, Apple, etc.)
- ✅ **Email Provider** (SendGrid, Mailgun, etc.)

---

### 2. ❌ "Iniciar sesión en <AUTH0_DOMAIN>"

**Síntoma:**
El login muestra el dominio antiguo de Auth0 en lugar del dominio personalizado:
```
Bienvenido
Iniciar sesión en <AUTH0_DOMAIN> para continuar hacia Dashboard Fascinante Digital
```

**Debería mostrar:**
```
Bienvenido
Iniciar sesión en <AUTH0_DOMAIN> para continuar hacia Dashboard Fascinante Digital
```

**Causa:**
- Variables de entorno no actualizadas
- Dominio personalizado no activado en Auth0 Dashboard
- Cache del navegador

---

## ✅ Soluciones

### SOLUCIÓN 1: Eliminar Credenciales de Prueba

#### Paso 1: Identificar conexiones con credenciales de prueba

1. Ve a **Auth0 Dashboard** → **Authentication** → **Database**
2. Revisa cada conexión activa
3. Busca conexiones que muestren "Test Credentials" o "Development Credentials"

#### Paso 2: Actualizar Database Connection (si aplica)

Si usas **Username-Password-Authentication**:

1. Ve a **Authentication** → **Database** → **Username-Password-Authentication**
2. Si ves "Test Credentials", necesitas:
   - ✅ Configurar un email provider real (SendGrid, Mailgun, etc.)
   - ✅ O deshabilitar la conexión si no la usas

#### Paso 3: Actualizar Social Connections (si aplica)

Para cada conexión social (Google, Facebook, Apple):

1. Ve a **Authentication** → **Social**
2. Selecciona la conexión (ej. "Google")
3. Si muestra "Test Credentials":
   - ✅ Crea una aplicación en el proveedor (Google Cloud Console, Facebook Developers, etc.)
   - ✅ Obtén **Client ID** y **Client Secret** reales
   - ✅ Actualiza la conexión en Auth0 con las credenciales reales
   - ✅ O deshabilita la conexión si no la usas

#### Paso 4: Verificar Email Provider

1. Ve a **Branding** → **Email Provider**
2. Si está usando "Auth0 Email Provider" (gratis):
   - ✅ Esto es aceptable para desarrollo
   - ⚠️ Para producción, configura un proveedor real (SendGrid, Mailgun, etc.)

---

### SOLUCIÓN 2: Activar Dominio Personalizado

#### Paso 1: Verificar configuración en Auth0 Dashboard

1. Ve a **Branding** → **Custom Domains**
2. Verifica que `<AUTH0_DOMAIN>` esté:
   - ✅ Verificado
   - ✅ Activo
   - ✅ Con TLS válido

#### Paso 2: Activar dominio personalizado en Settings

1. Ve a **Settings** → **General**
2. Busca la sección **"Custom Domain"** o **"Domain Settings"**
3. Asegúrate de que:
   - ✅ El dominio personalizado esté seleccionado como predeterminado
   - ✅ "Use Custom Domain in Emails" esté activado (si aplica)

#### Paso 3: Verificar variables de entorno

En tu `.env.local` y **Vercel**:

```env
# ✅ CORRECTO (dominio personalizado)
AUTH0_DOMAIN=<AUTH0_DOMAIN>
AUTH0_ISSUER_BASE_URL=<AUTH0_ISSUER_BASE_URL>

# ❌ INCORRECTO (dominio antiguo)
# AUTH0_DOMAIN=<AUTH0_DOMAIN>
# AUTH0_ISSUER_BASE_URL=<AUTH0_ISSUER_BASE_URL>
```

#### Paso 4: Limpiar cache

1. **Navegador:**
   - Limpia cache y cookies
   - O usa modo incógnito

2. **Next.js:**
   ```bash
   # Detener servidor
   # Eliminar .next
   rm -rf .next

   # Reiniciar
   pnpm dev
   ```

3. **Vercel:**
   - Si está desplegado, haz un nuevo deploy:
   ```bash
   vercel --prod
   ```

---

## 🔍 Verificación

### Verificar que el dominio personalizado funciona

1. Abre en modo incógnito:
   ```
   http://localhost:3000/login
   ```

2. Deberías ser redirigido a:
   ```
   <AUTH0_ISSUER_BASE_URL>/authorize
   ```
   **NO** a:
   ```
   <AUTH0_ISSUER_BASE_URL>/authorize
   ```

3. El login debería mostrar:
   ```
   Iniciar sesión en <AUTH0_DOMAIN>
   ```

### Verificar que no hay credenciales de prueba

1. Ve a **Auth0 Dashboard** → **Monitoring** → **Logs**
2. Busca eventos de login
3. No deberías ver warnings sobre "Test Credentials"

---

## 📋 Checklist Final

- [ ] Database Connection actualizada (si usas username/password)
- [ ] Social Connections actualizadas con credenciales reales (si las usas)
- [ ] Email Provider configurado (si usas emails)
- [ ] Dominio personalizado activado en Auth0 Dashboard
- [ ] Variables de entorno actualizadas (`.env.local` y Vercel)
- [ ] Cache limpiado (navegador y Next.js)
- [ ] Login muestra dominio personalizado
- [ ] No hay alertas de "Credenciales de prueba"

---

## 🚨 Importante

**Las credenciales de prueba NO deben usarse en producción** porque:
- Son públicas y conocidas
- Pueden ser compartidas entre múltiples tenants
- No cumplen con estándares de seguridad enterprise
- Pueden causar problemas de compliance (GDPR, SOC2, etc.)

**El dominio personalizado es importante porque:**
- Mejora la confianza del usuario
- Evita bloqueos de navegadores/corporativos
- Mejora SEO y branding
- Es requerido para algunos compliance (ej. bancos)

---

## 📚 Referencias

- [Auth0: Custom Domains](https://auth0.com/docs/customize/custom-domains)
- [Auth0: Social Connections](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers)
- [Auth0: Email Providers](https://auth0.com/docs/customize/email-providers)
