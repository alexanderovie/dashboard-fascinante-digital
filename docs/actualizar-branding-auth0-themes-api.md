# Actualizar Branding de Auth0 usando Themes API

**Fecha:** 2025-01-10
**Status:** ✅ Script actualizado para usar Themes API v2

## 📋 Cambios Realizados

El script `scripts/update-auth0-branding.js` ha sido actualizado para usar la **API de Themes (Temas)** de Auth0 en lugar de la API de branding general.

### ¿Por qué este cambio?

La documentación oficial de Auth0 muestra que el endpoint correcto para actualizar branding es:
```
PATCH /v2/branding/themes/{themeId}
```

Este endpoint requiere:
- Obtener primero el tema por defecto (o el tema activo)
- Luego actualizar ese tema específico con los nuevos valores

---

## 🎨 Colores Configurados

Los colores se extrajeron de `src/app/globals.css` (modo claro) y se mapearon a los campos requeridos por Auth0:

| Campo Auth0 | Color HEX | Origen (globals.css) |
|-------------|-----------|----------------------|
| `primary_button` | `#0F172A` | `--primary: hsl(222.2 47.4% 11.2%)` |
| `primary_button_label` | `#F8FAFC` | `--primary-foreground: hsl(210 40% 98%)` |
| `page_background_color` | `#FFFFFF` | `--background: hsl(0 0% 100%)` |
| `widget_background` | `#FFFFFF` | Mismo que page_background |
| `body_text` | `#0C0E12` | `--foreground: hsl(222.2 84% 4.9%)` |
| `header` | `#0C0E12` | Mismo que body_text |
| `input_border` | `#E2E8F0` | `--border: hsl(214.3 31.8% 91.4%)` |
| `widget_border` | `#E2E8F0` | Mismo que input_border |
| `input_labels_placeholders` | `#64748B` | `--muted-foreground: hsl(215.4 16.3% 46.9%)` |
| `error` | `#EF4444` | `--destructive: hsl(0 84.2% 60.2%)` |

---

## 🔧 Configuración del Script

### Requisitos

1. **Token de Management API** con scope `update:branding`:
   ```bash
   # En .env.local
   AUTH0_MANAGEMENT_TOKEN=tu_token_jwt_aqui
   ```

2. **Dominio de Auth0** configurado:
   ```bash
   # En .env.local
   AUTH0_DOMAIN=auth.fascinantedigital.com
   ```

### Ejecutar el Script

```bash
node scripts/update-auth0-branding.js
```

---

## 📊 Flujo del Script

1. **Obtener tema por defecto** (`GET /v2/branding/themes/default`)
   - Extrae el `themeId` y valores existentes
   - Si no existe, muestra error con instrucciones

2. **Actualizar tema** (`PATCH /v2/branding/themes/{themeId}`)
   - Actualiza colores con valores del dashboard
   - Mantiene valores existentes para borders y otros campos
   - Configura fuente Inter
   - Configura logo y layout del widget

---

## 🎯 Campos Actualizados

El script actualiza los siguientes campos del tema:

### Colors (Colores)
- ✅ `primary_button` - Color del botón principal
- ✅ `primary_button_label` - Color del texto del botón
- ✅ `body_text` - Color del texto del cuerpo
- ✅ `header` - Color del encabezado
- ✅ `widget_background` - Fondo del widget
- ✅ `widget_border` - Borde del widget
- ✅ `input_background` - Fondo de inputs
- ✅ `input_border` - Borde de inputs
- ✅ `input_filled_text` - Texto cuando input tiene valor
- ✅ `input_labels_placeholders` - Texto de labels y placeholders
- ✅ `secondary_button_border` - Borde del botón secundario
- ✅ `secondary_button_label` - Texto del botón secundario
- ✅ `links_focused_components` - Color de links y componentes enfocados
- ✅ `base_focus_color` - Color de foco base
- ✅ `base_hover_color` - Color de hover base
- ✅ `icons` - Color de iconos
- ✅ `error` - Color de errores
- ✅ `success` - Color de éxito
- ✅ `read_only_background` - Fondo de campos de solo lectura

### Fonts (Fuentes)
- ✅ `font_url` - URL de la fuente Inter (.woff2)
- ✅ `reference_text_size` - Tamaño de referencia (16px)
- ✅ `body_text` - Configuración de texto del cuerpo
- ✅ `buttons_text` - Configuración de texto de botones
- ✅ `input_labels` - Configuración de labels de inputs
- ✅ `links` - Configuración de links
- ✅ `subtitle` - Configuración de subtítulos
- ✅ `title` - Configuración de títulos

### Page Background (Fondo de Página)
- ✅ `background_color` - Color de fondo
- ✅ `background_image_url` - URL de imagen de fondo (vacío)
- ✅ `page_layout` - Layout de la página (`center`)

### Widget (Widget)
- ✅ `logo_url` - URL del logo
- ✅ `logo_position` - Posición del logo (`center`)
- ✅ `logo_height` - Altura del logo (40px)
- ✅ `header_text_alignment` - Alineación del texto del encabezado (`center`)
- ✅ `social_buttons_layout` - Layout de botones sociales (`bottom`)

### Borders (Bordes)
- ✅ Mantiene valores existentes o usa valores por defecto
- ✅ `buttons_style: 'rounded'` - Botones redondeados
- ✅ `inputs_style: 'rounded'` - Inputs redondeados

---

## ✅ Verificación

Después de ejecutar el script:

1. **Verifica en Auth0 Dashboard**:
   - Ve a `Branding → Universal Login`
   - Deberías ver los colores actualizados en la vista previa

2. **Prueba el login real**:
   ```
   https://auth.fascinantedigital.com/authorize
   ```

3. **Verifica que**:
   - Los botones tengan el color `#0F172A`
   - El texto de los botones sea `#F8FAFC`
   - El fondo sea blanco (`#FFFFFF`)
   - La fuente sea Inter

---

## ⚠️ Errores Comunes

### Error 401: Invalid token
**Solución:**
- Verifica que `AUTH0_MANAGEMENT_TOKEN` sea correcto
- El token puede haber expirado (tokens M2M duran 24 horas)
- Regenera el token si es necesario

### Error 403: Insufficient scope
**Solución:**
- Verifica que el token tenga el scope `update:branding`
- Ve a Auth0 Dashboard → Applications → Tu App M2M → APIs → Management API
- Asegúrate de que `update:branding` esté autorizado

### Error 404: Theme not found
**Solución:**
- Crea un tema primero en Auth0 Dashboard
- O verifica que el `themeId` sea correcto

---

## 🔗 Referencias

- [Auth0 Management API - Update Branding Theme](https://auth0.com/docs/api/management/v2#!/Branding/patch_branding_themes_by_id)
- [Auth0 Management API - Get Default Branding Theme](https://auth0.com/docs/api/management/v2#!/Branding/get_branding_themes_default)
- [Auth0 Branding Settings](https://auth0.com/docs/customize/universal-login-pages/universal-login-page-customization)
