# 🔧 Configurar Variables de Entorno en Vercel

**Proyecto**: `dashboard-fascinante-digital`
**Owner**: `alexanderoviedo`
**Status**: ✅ Proyecto vinculado, ⏳ Variables pendientes

---

## 📊 ESTADO ACTUAL

### ✅ Proyecto Vinculado:
- **Nombre**: `dashboard-fascinante-digital`
- **Project ID**: `prj_GbyMdzUfeWReF7YFY8rHBB4qigHl`
- **Org ID**: `team_rxLsn7qcMub2A8BjHFd5V3zZ`
- **Owner**: `alexanderoviedo`

### ❌ Variables de Entorno:
- **Status**: Ninguna variable configurada en Vercel
- **Acción**: Subir todas las variables de `.env.local`

---

## 📋 VARIABLES A SUBIR

### Variables Críticas de Auth0:

1. **AUTH0_CLIENT_ID** ⚠️
   - Valor: `FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7`
   - Tipo: Público
   - Ambiente: `production`, `preview`, `development`

2. **AUTH0_CLIENT_SECRET** 🔒 **SENSIBLE**
   - Valor: (desde .env.local)
   - Tipo: Secreto
   - Ambiente: `production`, `preview`, `development`

3. **AUTH0_SECRET** 🔒 **SENSIBLE**
   - Valor: (desde .env.local)
   - Tipo: Secreto (para firmar cookies)
   - Ambiente: `production`, `preview`, `development`

4. **AUTH0_DOMAIN**
   - Valor: `dev-xz2zgl2c0w6gfvbk.us.auth0.com`
   - Tipo: Público
   - Ambiente: `production`, `preview`, `development`

5. **AUTH0_ISSUER_BASE_URL**
   - Valor: `https://dev-xz2zgl2c0w6gfvbk.us.auth0.com`
   - Tipo: Público
   - Ambiente: `production`, `preview`, `development`

6. **AUTH0_AUDIENCE**
   - Valor: `https://api.fascinantedigital.com`
   - Tipo: Público
   - Ambiente: `production`, `preview`, `development`

### Variables de Aplicación:

7. **AUTH0_BASE_URL**
   - Production: `https://dashboard-fascinante-digital.vercel.app`
   - Preview: `https://dashboard-fascinante-digital-git-*.vercel.app`
   - Development: `http://localhost:3000`

8. **APP_BASE_URL**
   - Production: `https://dashboard-fascinante-digital.vercel.app`
   - Preview: `https://dashboard-fascinante-digital-git-*.vercel.app`
   - Development: `http://localhost:3000`

9. **NEXT_PUBLIC_API_BASE_URL**
   - Production: `https://api.fascinantedigital.com`
   - Preview: `https://api.fascinantedigital.com`
   - Development: `http://localhost:4000`

10. **DEFAULT_ORGANIZATION_ID** (Opcional)
    - Valor: (vacío o ID de organización)
    - Tipo: Público
    - Ambiente: `production`, `preview`, `development`

---

## 🚀 MÉTODO 1: Subir Variables Manualmente

### Para cada variable, ejecuta:

```bash
# 1. Variable para PRODUCTION
vercel env add AUTH0_CLIENT_ID production

# 2. Variable para PREVIEW
vercel env add AUTH0_CLIENT_ID preview

# 3. Variable para DEVELOPMENT
vercel env add AUTH0_CLIENT_ID development
```

**Nota**: Te pedirá el valor, pégalo desde `.env.local`

### Ejemplo completo para todas las variables:

```bash
# Auth0 Configuration
echo "FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7" | vercel env add AUTH0_CLIENT_ID production
echo "FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7" | vercel env add AUTH0_CLIENT_ID preview
echo "FVcaHC6WkzqZLMdiSWvISUMmqWuzRtE7" | vercel env add AUTH0_CLIENT_ID development

# AUTH0_CLIENT_SECRET (desde .env.local)
cat .env.local | grep "^AUTH0_CLIENT_SECRET=" | cut -d'=' -f2 | vercel env add AUTH0_CLIENT_SECRET production
cat .env.local | grep "^AUTH0_CLIENT_SECRET=" | cut -d'=' -f2 | vercel env add AUTH0_CLIENT_SECRET preview
cat .env.local | grep "^AUTH0_CLIENT_SECRET=" | cut -d'=' -f2 | vercel env add AUTH0_CLIENT_SECRET development

# ... repetir para cada variable
```

---

## 🚀 MÉTODO 2: Subir Variables con Script

### Usar el script interactivo:

```bash
bash SUBIR_VARIABLES_VERCEL.sh
```

Este script:
1. Lee `.env.local`
2. Sube cada variable a los 3 ambientes
3. Verifica que se subieron correctamente

---

## 🚀 MÉTODO 3: Usar `vercel env pull` (NO RECOMENDADO)

⚠️ **Este método sobrescribe tu `.env.local`**, no sube variables.

```bash
# NO HACER - Esto BAJA variables, no las sube
vercel env pull
```

---

## 🎯 MÉTODO 4: Subir desde Dashboard de Vercel (RECOMENDADO)

1. Ir a: https://vercel.com/alexanderoviedo/dashboard-fascinante-digital/settings/environment-variables

2. Agregar cada variable:
   - Click en "Add New"
   - Nombre: `AUTH0_CLIENT_ID`
   - Valor: (pegar desde .env.local)
   - Seleccionar ambientes: ✅ Production, ✅ Preview, ✅ Development

3. Repetir para todas las variables

---

## ✅ VERIFICAR VARIABLES SUBIDAS

```bash
# Listar todas las variables
vercel env ls

# Ver una variable específica
vercel env ls | grep AUTH0_CLIENT_ID
```

---

## 🔒 VARIABLES SENSIBLES

Estas variables deben marcarse como **Secret** en Vercel:

- ✅ `AUTH0_CLIENT_SECRET`
- ✅ `AUTH0_SECRET`

**Nota**: En Vercel Dashboard, marca estas como "Encrypted" para mayor seguridad.

---

## 🌍 CONFIGURACIÓN POR AMBIENTE

### Production:
```bash
AUTH0_BASE_URL=https://dashboard-fascinante-digital.vercel.app
APP_BASE_URL=https://dashboard-fascinante-digital.vercel.app
```

### Preview:
```bash
AUTH0_BASE_URL=https://dashboard-fascinante-digital-git-*.vercel.app
APP_BASE_URL=https://dashboard-fascinante-digital-git-*.vercel.app
```

### Development:
```bash
AUTH0_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
```

**Nota**: Para Preview, Vercel genera URLs dinámicas. Puedes usar:
```bash
AUTH0_BASE_URL=${VERCEL_URL}
APP_BASE_URL=${VERCEL_URL}
```

---

## 🧪 PROBAR DESPUÉS DE SUBIR

1. **Desplegar a Preview**:
   ```bash
   vercel
   ```

2. **Verificar variables**:
   ```bash
   vercel env ls
   ```

3. **Probar login**:
   - Visitar preview URL
   - Intentar login
   - Verificar que Auth0 funciona

---

## 📚 REFERENCIAS

- [Vercel Docs - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI - env add](https://vercel.com/docs/cli/env/add)

---

## ✅ CHECKLIST

- [ ] AUTH0_CLIENT_ID subida (production, preview, development)
- [ ] AUTH0_CLIENT_SECRET subida (production, preview, development) 🔒
- [ ] AUTH0_SECRET subida (production, preview, development) 🔒
- [ ] AUTH0_DOMAIN subida
- [ ] AUTH0_ISSUER_BASE_URL subida
- [ ] AUTH0_AUDIENCE subida
- [ ] AUTH0_BASE_URL subida (con valores correctos por ambiente)
- [ ] APP_BASE_URL subida (con valores correctos por ambiente)
- [ ] NEXT_PUBLIC_API_BASE_URL subida
- [ ] DEFAULT_ORGANIZATION_ID subida (si aplica)
- [ ] Variables verificadas con `vercel env ls`
- [ ] Preview deployment probado

---

**Última actualización**: Enero 8, 2026
**Status**: ⏳ Pendiente de configurar variables
