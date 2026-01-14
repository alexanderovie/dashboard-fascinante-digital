# 🎨 Actualizar Colores de Botones en Auth0 Universal Login

## 📋 Objetivo

Ajustar los colores de los botones de login en Auth0 Universal Login para que sean **consistentes con los botones del dashboard**.

---

## 🎨 Colores del Dashboard

### Botón Principal (`src/components/ui/button.tsx`):

```typescript
default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
```

### Valores Extraídos (`src/app/globals.css`):

- **Primary (Fondo botón):** `hsl(222.2 47.4% 11.2%)` → `#0F172A`
- **Primary Foreground (Texto botón):** `hsl(210 40% 98%)` → `#F8FAFC`
- **Hover:** `bg-primary/90` (90% opacidad)

---

## ✅ Configuración Aplicada

### Script Actualizado: `scripts/update-auth0-branding.js`

```javascript
const BRANDING_CONFIG = {
  colors: {
    // Color principal del botón (fondo)
    // Coincide con bg-primary del dashboard: #0F172A
    primary: '#0F172A', // Gris azulado oscuro

    // Fondo de página
    page_background: '#FFFFFF', // Blanco
  },
  // ... logo, favicon, font
};
```

---

## 🚀 Pasos para Aplicar

### Paso 1: Agregar Token a `.env.local`

Si aún no tienes el token:

```bash
# Agregar Management Token a .env.local
echo "AUTH0_MANAGEMENT_TOKEN=tu_token_jwt_aqui" >> .env.local
```

### Paso 2: Ejecutar Script

```bash
node scripts/update-auth0-branding.js
```

### Paso 3: Verificar Resultado

1. **Dashboard de Auth0:**
   - Ve a: **Branding** → **Universal Login**
   - Revisa "Example screens for preview"
   - El botón debería mostrar color `#0F172A`

2. **Login Real:**
   - Abre: `<AUTH0_ISSUER_BASE_URL>/authorize`
   - El botón "Iniciar sesión" debería tener el mismo color que tus botones del dashboard

---

## 📊 Comparación Visual

### Antes:
- Botón Auth0: Color por defecto (probablemente azul claro)
- Botón Dashboard: `#0F172A` (gris azulado oscuro)
- ❌ **Inconsistente**

### Después:
- Botón Auth0: `#0F172A` (gris azulado oscuro)
- Botón Dashboard: `#0F172A` (gris azulado oscuro)
- ✅ **Consistente**

---

## 🎯 Color del Texto del Botón

**Nota importante:**

Auth0 calcula automáticamente el color del texto del botón para tener buen contraste con el fondo.

- Si el fondo es oscuro (`#0F172A`), el texto será claro (blanco o casi blanco)
- Esto es **automático** y no requiere configuración adicional

Tu color `#F8FAFC` (casi blanco) será el resultado natural cuando Auth0 calcula el contraste.

---

## 🔍 Verificación

### Verificar que los colores coinciden:

1. **Botón del Dashboard:**
   - Abre cualquier página del dashboard
   - Inspecciona un botón principal (ej. "Create Task")
   - Fondo: `#0F172A`

2. **Botón de Auth0:**
   - Abre: `<AUTH0_ISSUER_BASE_URL>/authorize`
   - Inspecciona el botón "Iniciar sesión"
   - Fondo: `#0F172A`

Ambos deberían ser **idénticos**.

---

## ⚙️ Campos Disponibles en Auth0 API

Según la documentación de Auth0 Management API, puedes configurar:

```json
{
  "colors": {
    "primary": "string (hex color)",           // Color del botón
    "page_background": "string (hex color)"    // Fondo de página
  }
}
```

**Campos adicionales (si Auth0 los soporta):**
- `widget_background`: Fondo del formulario (opcional)
- `input_background`: Fondo de campos de entrada (opcional)
- `input_border`: Borde de campos (opcional)

**Nota:** Algunos campos pueden no estar disponibles en todas las versiones de la API.

---

## 🔄 Rollback (Si Necesitas Revertir)

Si quieres volver a los colores por defecto de Auth0:

```bash
# Editar script y cambiar a colores por defecto
# O usar el Dashboard visual para resetear
```

O simplemente actualiza el script con los colores anteriores.

---

## 📋 Checklist

- [x] Colores extraídos del dashboard (`globals.css`)
- [x] Colores convertidos HSL → HEX
- [x] Script actualizado con colores correctos
- [ ] Token agregado a `.env.local`
- [ ] Script ejecutado exitosamente
- [ ] Botones verificados visualmente (Dashboard vs Auth0)
- [ ] Colores coinciden

---

## 🔗 Referencias

- [Auth0 Management API - Branding](https://auth0.com/docs/api/management/v2#!/Branding/patch_branding)
- [Auth0 Universal Login Customization](https://auth0.com/docs/customize/universal-login-pages)

