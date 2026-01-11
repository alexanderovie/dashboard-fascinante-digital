# Configurar Fuentes en Auth0 Universal Login

**Ubicación:** Auth0 Dashboard → Branding → Universal Login → Fonts  
**Fecha:** 2025-01-10

## 📋 Formato de Configuración de Fuentes

### ✅ URLs de Fuentes Requeridas

Auth0 requiere URLs directas a archivos de fuente `.woff` o `.woff2`.

**Formato de URL:**
```
https://ejemplo.com/fonts/fuente-regular.woff2
https://ejemplo.com/fonts/fuente-bold.woff2
```

### 📝 Campos de Configuración

#### 1. **Font URL (URL de Fuente)**

```
https://ejemplo.com/fonts/tu-fuente.woff2
```

**Requisitos:**
- ✅ Debe apuntar directamente a un archivo `.woff` o `.woff2`
- ✅ Debe ser HTTPS (recomendado) o HTTP
- ✅ El archivo debe ser accesible públicamente
- ✅ CORS debe estar habilitado si la fuente está en otro dominio

**Ejemplos válidos:**
```
https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2
https://cdn.example.com/fonts/custom-font.woff2
```

#### 2. **Font Size (Tamaño de Fuente)**

Valor en píxeles (px).

**Valores recomendados:**
- **16px** (base/default)
- **14px** (pequeño)
- **18px** (grande)
- **24px** (títulos)

#### 3. **Line Height (Altura de Línea)**

Valor en porcentaje (%) o número.

**Valores recomendados:**
- **150%** (1.5) - legibilidad estándar
- **140%** (1.4) - compacto
- **160%** (1.6) - espacioso

### 🎨 Configuración por Elemento

Auth0 permite configurar diferentes tamaños de fuente para diferentes elementos:

#### **Base Font (Fuente Base)**
- Tamaño: 16px (recomendado)
- Line Height: 150%

#### **Small Text (Texto Pequeño)**
- Tamaño: 87.5% (14px si base es 16px)
- Line Height: 150%

#### **Large Text (Texto Grande)**
- Tamaño: 100% o mayor
- Line Height: 150%

## 📦 Fuentes Recomendadas (CDNs Públicos)

### Google Fonts

**Inter (Recomendada para dashboards):**
```
https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2
```

**Roboto:**
```
https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxP.woff2
```

**Open Sans:**
```
https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVIUwaEQbjB_mQ.woff2
```

### Font Awesome / Icon Fonts

Si necesitas iconos:
```
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2
```

## 🔧 Configuración Paso a Paso

### Paso 1: Obtener URL de Fuente

**Opción A: Usar Google Fonts**
1. Ir a: https://fonts.google.com
2. Seleccionar fuente (ej: Inter)
3. Hacer clic en "Get font"
4. Copiar URL del archivo `.woff2` de la sección "@font-face"

**Opción B: Subir tu propia fuente**
1. Convertir fuente a `.woff2` usando: https://convertio.co/ttf-woff2/
2. Subir a CDN o servidor público
3. Obtener URL pública del archivo

### Paso 2: Configurar en Auth0 Dashboard

1. Ir a: **Branding → Universal Login → Fonts**
2. En el campo **"Font URL"**:
   ```
   https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2
   ```
3. Configurar **Font Size**: `16px` (o el tamaño deseado)
4. Configurar **Line Height**: `150%`
5. Repetir para diferentes variantes (regular, bold, etc.) si es necesario

### Paso 3: Configurar Elementos Específicos

**Small Text:**
- Font Size: `87.5%` (relativo a base)
- Line Height: `150%`

**Large Text:**
- Font Size: `100%` o mayor
- Line Height: `150%`

### Paso 4: Opciones Avanzadas

Si necesitas configuración avanzada:
1. Click en **"Go to advanced options"**
2. Editar CSS personalizado si es necesario

## ⚙️ Configuración CSS Avanzada (Opcional)

Si usas opciones avanzadas, puedes agregar:

```css
@font-face {
  font-family: 'Custom Font';
  src: url('https://ejemplo.com/fonts/fuente.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Custom Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## ✅ Checklist de Configuración

- [ ] URL de fuente es accesible públicamente
- [ ] Formato es `.woff` o `.woff2`
- [ ] URL usa HTTPS (recomendado)
- [ ] CORS habilitado si fuente está en otro dominio
- [ ] Tamaño de fuente configurado (16px base)
- [ ] Line height configurado (150% recomendado)
- [ ] Variantes configuradas (bold, italic) si es necesario
- [ ] Preview en Auth0 muestra fuente correctamente
- [ ] Probar en diferentes navegadores

## 🔍 Verificación

1. Ir a: **Branding → Universal Login**
2. Usar **"Example screens for preview"**
3. Verificar que la fuente se carga correctamente
4. Probar en: **Focus**, **Hover**, y estados normales

## 📝 Notas Importantes

- **CORS**: Si subes la fuente a tu propio servidor, asegúrate de que CORS esté habilitado
- **Performance**: Usa `.woff2` en lugar de `.woff` (mejor compresión)
- **Fallback**: Auth0 usa fuentes de fallback automáticamente
- **Cache**: Los cambios pueden tardar unos minutos en propagarse

## 🔗 Links Útiles

- **Auth0 Dashboard (Branding):** https://manage.auth0.com/#/branding/universal-login
- **Google Fonts:** https://fonts.google.com
- **Font Converter:** https://convertio.co/ttf-woff2/
- **WOFF2 Spec:** https://www.w3.org/TR/WOFF2/

## 💡 Recomendaciones

1. **Usa Inter o Roboto** para dashboards (legibilidad)
2. **Tamaño base 16px** para mejor accesibilidad
3. **Line height 150%** para mejor legibilidad
4. **Una sola fuente** para consistencia (evita múltiples fuentes)
5. **Font-display: swap** para mejor performance

