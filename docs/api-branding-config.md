# Configurar Branding Auth0 vía API

**Fecha:** 2025-01-10
**Status:** ✅ Token verificado con permisos completos

## ✅ Confirmación de Permisos

Tu token de Auth0 Management API tiene los siguientes permisos:

- ✅ `read:branding` - Puede leer configuración de branding
- ✅ `update:branding` - Puede actualizar branding
- ✅ `delete:branding` - Puede eliminar branding

**Conclusión:** ✅ **SÍ puedes modificar colores y fuentes programáticamente**

## 🔧 Opción 1: Usar el Script (Recomendado)

### Paso 1: Configurar Token en .env.local

```bash
# Agregar a .env.local
AUTH0_MANAGEMENT_TOKEN=tu_token_jwt_aqui
AUTH0_DOMAIN=<AUTH0_DOMAIN>
```

### Paso 2: Editar Configuración

Edita `scripts/update-auth0-branding.js` y ajusta:

```javascript
const BRANDING_CONFIG = {
  colors: {
    primary: '#0066FF',        // Tu color principal
    page_background: '#FFFFFF', // Fondo de página
  },
  logo_url: 'https://app.fascinantedigital.com/logo.png',
  favicon_url: 'https://app.fascinantedigital.com/favicon.ico',
  font: {
    url: 'https://fonts.gstatic.com/s/inter/v18/...woff2'
  }
};
```

### Paso 3: Ejecutar Script

```bash
node scripts/update-auth0-branding.js
```

## 🔧 Opción 2: Usar cURL Directamente

### Obtener Configuración Actual

```bash
curl -X GET '<AUTH0_ISSUER_BASE_URL>/api/v2/branding' \
  -H 'Authorization: Bearer TU_TOKEN_AQUI' \
  -H 'Accept: application/json'
```

### Actualizar Branding

```bash
curl -X PATCH '<AUTH0_ISSUER_BASE_URL>/api/v2/branding' \
  -H 'Authorization: Bearer TU_TOKEN_AQUI' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "colors": {
      "primary": "#0066FF",
      "page_background": "#FFFFFF"
    },
    "logo_url": "https://app.fascinantedigital.com/logo.png",
    "favicon_url": "https://app.fascinantedigital.com/favicon.ico",
    "font": {
      "url": "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
    }
  }'
```

## 📋 Estructura de Colores Disponibles

Según la documentación de Auth0, puedes configurar:

```json
{
  "colors": {
    "primary": "string (hex color)",
    "page_background": "string (hex color)"
  }
}
```

**Colores comunes a configurar:**
- `primary`: Color principal (botones, links, etc.)
- `page_background`: Fondo de la página de login

## 🎨 Fuentes Disponibles

### Inter (Recomendada)
```
https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2
```

### Roboto
```
https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxP.woff2
```

### Tu propia fuente
1. Convertir a `.woff2`
2. Subir a CDN o servidor público
3. Usar URL HTTPS

## 🔗 Endpoints de la API

### GET Branding Settings
```
GET <AUTH0_ISSUER_BASE_URL>/api/v2/branding
Scope requerido: read:branding
```

### PATCH Branding Settings
```
PATCH <AUTH0_ISSUER_BASE_URL>/api/v2/branding
Scope requerido: update:branding
Content-Type: application/json
```

### Body del Request

```json
{
  "colors": {
    "primary": "#0066FF",
    "page_background": "#FFFFFF"
  },
  "logo_url": "https://app.fascinantedigital.com/logo.png",
  "favicon_url": "https://app.fascinantedigital.com/favicon.ico",
  "font": {
    "url": "https://fonts.gstatic.com/s/inter/v18/...woff2"
  }
}
```

## ⚠️ Requisitos Importantes

1. **URLs deben ser HTTPS** (no HTTP)
2. **Logo y Favicon** deben ser accesibles públicamente
3. **Fuente** debe estar en formato `.woff` o `.woff2`
4. **CORS** debe estar habilitado si las fuentes están en otro dominio
5. **Token** debe tener scope `update:branding`

## 🔍 Verificación

Después de actualizar, verifica en:

1. **Dashboard de Auth0:**
   https://manage.auth0.com/#/branding/universal-login

2. **Preview:**
   Usa "Example screens for preview" en el dashboard

3. **Login real:**
   <AUTH0_ISSUER_BASE_URL>/authorize

## 📝 Notas

- Los cambios se aplican inmediatamente
- Puede tardar 1-2 minutos en propagarse completamente
- El token expira, verifica la fecha de expiración

## 🔗 Referencias

- [Auth0 Management API - Branding](https://auth0.com/docs/api/management/v2#!/Branding/get_branding)
- [Auth0 Branding Settings](https://auth0.com/docs/customize/universal-login-pages/universal-login-page-customization)
