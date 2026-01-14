# 🔍 ¿Qué es este Access Token (M2M)?

## 📋 Análisis del Token

Este es un **Access Token** de tipo **Machine to Machine (M2M)** obtenido mediante **Client Credentials Grant**.

---

## 🔍 Información del Token

### Datos Decodificados:

- **Issuer (iss)**: `<AUTH0_ISSUER_BASE_URL>/`
  - Tu tenant de Auth0

- **Subject (sub)**: `ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1@clients`
  - Client ID de "Fascinante API M2M (DEV)"
  - Indica que es un token para aplicación M2M (no para usuario)

- **Audience (aud)**: `<AUTH0_AUDIENCE>`
  - Tu API backend (Fascinante API)
  - Este token es válido para llamar a esta API

- **Grant Type (gty)**: `client-credentials`
  - Indica que se obtuvo mediante Client Credentials Grant
  - No requiere usuario, solo credenciales de aplicación

- **Authorized Party (azp)**: `ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1`
  - La aplicación que obtuvo este token (Fascinante API M2M)

- **Issued At (iat)**: Timestamp de cuando se emitió
- **Expires At (exp)**: Timestamp de cuando expira (típicamente 24 horas)

---

## 🎯 ¿Para qué sirve?

### ✅ USOS CORRECTOS:

1. **Llamar a tu API Backend** (Fascinante API)
   ```javascript
   fetch('<AUTH0_AUDIENCE>/v1/users', {
     headers: {
       'Authorization': `Bearer ${accessToken}`
     }
   })
   ```

2. **Autenticación Machine-to-Machine**
   - Servidor a servidor
   - Scripts automatizados
   - CI/CD pipelines
   - Microservicios internos

3. **NO requiere usuario**
   - No es para un usuario logueado
   - Es para tu aplicación/servicio

---

## ❌ NO es para:

1. **❌ Autenticación de usuarios**
   - Este token NO representa un usuario
   - Es para comunicación servidor-servidor

2. **❌ Frontend/Dashboard**
   - NO se usa en el navegador
   - NO se usa en tu dashboard Next.js

3. **❌ Management API directamente**
   - Este token es para "Fascinante API", no para Management API
   - Para Management API necesitas otro token (o autorizar esta M2M en Management API)

---

## 📋 Ejemplo de Código (Correcto)

```javascript
// ✅ CORRECTO: Llamar a tu API backend
async function fetchData() {
  try {
    const response = await fetch('<AUTH0_AUDIENCE>/v1/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

---

## 🔄 Cómo Obtener Este Token

### Opción 1: Con curl

```bash
curl -X POST <AUTH0_ISSUER_BASE_URL>/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1",
    "client_secret": "TU_CLIENT_SECRET",
    "audience": "<AUTH0_AUDIENCE>",
    "grant_type": "client_credentials"
  }'
```

### Opción 2: Con Auth0 SDK (Node.js)

```javascript
const { ManagementClient } = require('auth0');

// O para obtener token para tu API custom:
const axios = require('axios');

async function getAccessToken() {
  const response = await axios.post(
    '<AUTH0_ISSUER_BASE_URL>/oauth/token',
    {
      client_id: 'ImAZkxhgekDXzV6tqNyVMXnqJxAHkUQ1',
      client_secret: 'TU_CLIENT_SECRET',
      audience: '<AUTH0_AUDIENCE>',
      grant_type: 'client_credentials'
    }
  );

  return response.data.access_token;
}
```

---

## ⚠️ Importante

### Seguridad:

1. **NO compartir el token públicamente**
   - Este token te da acceso a tu API
   - Mantenerlo seguro

2. **Token expira** (típicamente 24 horas)
   - Necesitas obtener uno nuevo cuando expire
   - Implementar refresh automático

3. **Usar solo en backend**
   - NO exponer en frontend
   - NO en código público

### Uso en tu Proyecto:

Este token es **diferente** del que usa tu dashboard Next.js:

- **Dashboard Next.js**: Usa tokens de usuario (ID Token + Access Token para usuarios)
- **Este token**: Es para comunicación M2M (servidor a servidor)

---

## 📊 Comparación

| Tipo | Este Token (M2M) | Token de Usuario (Dashboard) |
|------|------------------|------------------------------|
| **Para** | Servidor → API | Usuario → Dashboard → API |
| **Grant Type** | client_credentials | authorization_code |
| **Requiere usuario** | ❌ NO | ✅ SÍ |
| **Uso** | Backend scripts | Frontend/Backend con usuario |
| **Audience** | <AUTH0_AUDIENCE> | <AUTH0_AUDIENCE> |

---

## 🎯 Conclusión

Este token:
- ✅ Es un **Access Token M2M** válido
- ✅ Es para llamar a **Fascinante API** (`<AUTH0_AUDIENCE>`)
- ✅ Obtenido con "Fascinante API M2M (DEV)"
- ✅ Válido por ~24 horas
- ✅ Para uso en backend/servidor (no frontend)

**El ejemplo de código que mostraste es correcto** para usar este token, solo cambia la URL a tu API real.

---

## 🔗 Referencias

- [Auth0: Client Credentials Grant](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)
- [Auth0: Machine to Machine Tokens](https://auth0.com/docs/get-started/applications/machine-to-machine-applications)
