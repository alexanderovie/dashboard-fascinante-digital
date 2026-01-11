# 🔍 ¿Qué es este Access Token (Management API)?

## 📋 Análisis del Token

Este es un **Access Token para Auth0 Management API** obtenido mediante **Client Credentials Grant (M2M)**.

---

## 🔍 Información del Token

### Datos Decodificados:

- **Issuer (iss)**: `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/`
  - Tu tenant de Auth0

- **Subject (sub)**: `ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1@clients`
  - Client ID de "Fascinante API M2M (DEV)"
  - Indica que es un token M2M

- **Audience (aud)**: `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/api/v2/`
  - ✅ **Auth0 Management API**
  - Este token es para usar Management API (no para tu API custom)

- **Grant Type (gty)**: `client-credentials`
  - Obtenido mediante Client Credentials Grant
  - No requiere usuario

- **Authorized Party (azp)**: `ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1`
  - La aplicación que obtuvo este token (Fascinante API M2M)

- **Scope**: Lista MUY extensa de permisos (200+ scopes)
  - ✅ `read:branding`, `update:branding`
  - ✅ `read:clients`, `update:clients`
  - ✅ `read:users`, `update:users`
  - ✅ Y muchos más...

- **Issued At / Expires At**: Válido por ~24 horas

---

## 🎯 ¿Para qué sirve?

### ✅ USOS CORRECTOS:

1. **Llamar a Auth0 Management API**
   ```javascript
   fetch('https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/api/v2/clients', {
     headers: {
       'Authorization': `Bearer ${managementToken}`
     }
   })
   ```

2. **Ejecutar tus scripts**
   - ✅ `scripts/update-auth0-branding.js`
   - ✅ `scripts/check-logout-urls.js`
   - ✅ `scripts/test-api-access.js`

3. **Usar Auth0 CLI**
   - ✅ Este es el token que Auth0 CLI usa internamente
   - ✅ Ya funciona con `auth0 login` si lo guardaste

4. **Administrar tu tenant de Auth0**
   - Crear/actualizar aplicaciones
   - Gestionar usuarios
   - Actualizar branding
   - Configurar conexiones
   - etc.

---

## 🔄 Diferencia con el Token Anterior

| Característica | Token #1 (Anterior) | Token #2 (Este) |
|----------------|---------------------|-----------------|
| **Audience** | `https://api.fascinantedigital.com` | `https://...auth0.com/api/v2/` |
| **Para** | Tu API backend (Fascinante API) | Auth0 Management API |
| **Scopes** | No tiene (o pocos) | 200+ scopes |
| **Uso** | Llamar a tu API | Administrar Auth0 |

---

## ✅ Ejemplo de Código (Correcto)

```javascript
// ✅ CORRECTO: Llamar a Management API
async function updateBranding() {
  try {
    const response = await fetch(
      'https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/api/v2/branding',
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          colors: {
            primary: '#0F172A'
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 📋 Usar en tus Scripts

Este token es exactamente lo que necesitas para tus scripts. Puedes usarlo así:

```bash
# En .env.local
AUTH0_MANAGEMENT_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNSOWJQWlRickd6NXAyYnl2eTM5WSJ9...

# Luego ejecutar scripts:
node scripts/update-auth0-branding.js
node scripts/check-logout-urls.js
```

---

## ⚠️ Importante

### Seguridad:

1. **Este token tiene MUCHOS permisos**
   - Puede modificar casi todo en tu tenant
   - Mantenerlo SÚPER seguro
   - NO compartir públicamente

2. **Token expira** (~24 horas)
   - Renovarlo cuando expire
   - O configurar refresh automático

3. **Usar solo en backend/scripts**
   - NO exponer en frontend
   - NO en código público

### Scopes:

Este token tiene **200+ scopes**, incluyendo:
- ✅ `read:branding`, `update:branding` (para branding)
- ✅ `read:clients`, `update:clients` (para aplicaciones)
- ✅ `read:users`, `update:users` (para usuarios)
- ✅ Y muchos más...

**Esto es BUENO** porque significa que la aplicación M2M está bien autorizada.

---

## 🎯 Conclusión

Este token:
- ✅ Es un **Access Token para Auth0 Management API**
- ✅ Obtenido con "Fascinante API M2M (DEV)"
- ✅ Tiene **200+ scopes** (muy completo)
- ✅ Válido para usar en tus scripts
- ✅ Válido para Auth0 CLI
- ✅ Válido por ~24 horas

**Este es el token correcto para:**
- Scripts de automatización (branding, config, etc.)
- Auth0 CLI
- Llamadas a Management API
- Administración del tenant

**El ejemplo de código que mostraste necesita ajustarse:**
- URL: Cambiar a `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com/api/v2/...`
- Endpoint: Depende de qué quieras hacer (branding, clients, users, etc.)

---

## 🔗 Referencias

- [Auth0 Management API](https://auth0.com/docs/api/management/v2)
- [Management API Endpoints](https://auth0.com/docs/api/management/v2/get-access-tokens-for-production)
