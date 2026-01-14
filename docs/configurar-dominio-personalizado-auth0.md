# 🔧 Configurar Dominio Personalizado en Auth0

## 📍 Ubicación Correcta

**NO** es en la pestaña "General" que estás viendo.

**SÍ** es en la pestaña **"Custom Domains"** que está visible en el menú de tabs.

---

## ✅ Pasos Exactos

### Paso 1: Ir a Custom Domains

1. En la página de **Tenant Settings** que estás viendo
2. Haz clic en la pestaña **"Custom Domains"** (está a la derecha de "General")
3. Deberías ver tu dominio `<AUTH0_DOMAIN>`

### Paso 2: Verificar Estado del Dominio

En la pestaña "Custom Domains" deberías ver:

- ✅ **Domain:** `<AUTH0_DOMAIN>`
- ✅ **Status:** "Ready" o "Active"
- ✅ **TLS:** "Valid" o "Active"

### Paso 3: Activar como Dominio Predeterminado (si aplica)

Si hay una opción para "Set as Default" o "Use as Default":
- ✅ Actívala
- ✅ Guarda cambios

### Paso 4: Verificar en Settings → General

Después de activar el dominio personalizado:

1. Vuelve a la pestaña **"General"**
2. Busca una sección que diga **"Default Domain"** o **"Custom Domain"**
3. Debería mostrar: `<AUTH0_DOMAIN>`

---

## ⚠️ Importante

El campo **"Tenant Name"** que ves en "General" (`dev-xz2zgl2c0wBgfvbic`) es:
- ❌ Solo informativo
- ❌ No se puede cambiar directamente
- ❌ Es el identificador interno del tenant

Lo que importa es:
- ✅ El dominio personalizado en "Custom Domains"
- ✅ Que esté activo y verificado
- ✅ Que se use en las URLs de login

---

## 🔍 Si el Dominio No Aparece en "Custom Domains"

Si no ves `<AUTH0_DOMAIN>` en la pestaña "Custom Domains":

1. Haz clic en **"Create Custom Domain"** o **"Add Domain"**
2. Ingresa: `<AUTH0_DOMAIN>`
3. Sigue las instrucciones para:
   - Configurar DNS (CNAME)
   - Verificar el dominio
   - Esperar a que Auth0 emita el certificado TLS

---

## ✅ Verificación Final

Después de configurar:

1. Limpia cache del navegador (Ctrl+Shift+Del)
2. Abre en modo incógnito: `http://localhost:3000/login`
3. Deberías ser redirigido a: `<AUTH0_ISSUER_BASE_URL>/authorize`
4. El login debería mostrar: "Iniciar sesión en <AUTH0_DOMAIN>"

---

## 📋 Checklist

- [ ] Ir a pestaña "Custom Domains"
- [ ] Verificar que `<AUTH0_DOMAIN>` esté listado
- [ ] Verificar que el estado sea "Ready" o "Active"
- [ ] Activar como dominio predeterminado (si hay opción)
- [ ] Limpiar cache del navegador
- [ ] Probar login en modo incógnito
- [ ] Verificar que el login muestre el dominio personalizado
