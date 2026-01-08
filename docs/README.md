# 📚 Documentación del Proyecto

**Dashboard Fascinante Digital** - Documentación completa del proyecto

---

## 🚀 Inicio Rápido

Si eres nuevo en el proyecto, comienza aquí:

1. [README.md](../README.md) - Visión general del proyecto
2. [Getting Started](guides/getting-started.md) - Guía de inicio completo
3. [Setup de Auth0](setup/auth0-setup.md) - Configuración inicial de autenticación

---

## 📚 Índice de Documentación

### 🔵 Configuración (`/setup`)

Guías para configurar el proyecto desde cero:

- [Configurar Auth0](setup/auth0-setup.md) - Setup completo de Auth0
- [Configurar Vercel](setup/vercel-setup.md) - Deploy en Vercel
- [Configurar Logout](setup/logout-configuration.md) - Configuración de logout
- [Obtener Client Secret](setup/client-secret.md) - Cómo obtener credenciales
- [Migración a Next.js 16](setup/migration-next16.md) - Guía de migración
- [Comandos de Actualización](setup/update-commands.md) - Comandos útiles

---

### 📖 Guías (`/guides`)

Guías paso a paso para funcionalidades específicas:

- [Getting Started](guides/getting-started.md) - Guía de inicio completo
- [Redirect Automático de Login](guides/auto-login-redirect.md) - Flujo de login automático
- [Mejores Prácticas de Logout](guides/logout-best-practices.md) - Cómo manejar logout correctamente
- [Validación Exitosa](guides/validation-success.md) - Verificación de implementación

---

### 🏗️ Arquitectura (`/architecture`)

Documentación de arquitectura y decisiones de diseño:

- [Diseño de Autenticación](architecture/auth-design.md) - Arquitectura completa de auth
- [Tipos de Aplicación Auth0](architecture/auth0-app-types.md) - Qué tipo usar y por qué
- [Auth Propia vs Auth0](architecture/custom-vs-auth0.md) - Comparación y recomendaciones
- [Arquitectura Visual](architecture/visual-architecture.md) - Diagramas y flujos

---

### 🔧 Troubleshooting (`/troubleshooting`)

Soluciones a problemas comunes:

- [Fix: Redirect en Login](troubleshooting/login-redirect-fix.md) - Solución a problemas de redirect
- [Fix: Error de Hydration](troubleshooting/hydration-error-fix.md) - Solución a errores de hydration
- [Fix: Configuración de Imágenes](troubleshooting/images-config-fix.md) - Configuración de Next.js Images
- [Fix: Error de Access Token](troubleshooting/access-token-fix.md) - Problemas con tokens
- [Verificación de Build](troubleshooting/build-verification.md) - Cómo verificar build exitoso

---

### 👨‍💻 Desarrollo (`/development`)

Guías para desarrolladores:

- [Roadmap de Implementación](development/implementation-roadmap.md) - Plan completo de implementación
- [Implementación Opción A](development/implementation-option-a.md) - Detalles de implementación

---

### 🔐 Seguridad (`/security`)

Documentación de seguridad y auditorías:

- [Resumen de Auditoría](security/audit-summary.md) - Auditoría completa de seguridad
- [Validación de Patrones Auth0](security/auth0-patterns-validation.md) - Validación con mejores prácticas

---

## 🔍 Búsqueda Rápida

### Por Tema

**Auth0**:
- [Setup Auth0](setup/auth0-setup.md)
- [Tipos de Aplicación](architecture/auth0-app-types.md)
- [Patrones Validados](security/auth0-patterns-validation.md)

**Login/Logout**:
- [Redirect Automático](guides/auto-login-redirect.md)
- [Mejores Prácticas Logout](guides/logout-best-practices.md)
- [Fix Redirect](troubleshooting/login-redirect-fix.md)

**Configuración**:
- [Vercel](setup/vercel-setup.md)
- [Client Secret](setup/client-secret.md)
- [Migración Next.js 16](setup/migration-next16.md)

**Errores Comunes**:
- [Hydration Error](troubleshooting/hydration-error-fix.md)
- [Access Token](troubleshooting/access-token-fix.md)
- [Images Config](troubleshooting/images-config-fix.md)

---

## 📋 Convenciones

### Nomenclatura

- ✅ Todos los archivos usan `kebab-case`
- ✅ Nombres descriptivos y claros
- ✅ Organizados por categorías

### Estructura

```
docs/
├── setup/          # Configuración inicial
├── guides/         # Guías paso a paso
├── architecture/    # Diseño y decisiones
├── troubleshooting/ # Soluciones a problemas
├── development/    # Desarrollo y roadmap
└── security/       # Seguridad y auditorías
```

---

## 🔄 Actualización

Esta documentación se actualiza continuamente. Si encuentras información desactualizada:

1. Abre un issue
2. O crea un PR con la corrección

---

## 📚 Referencias Externas

- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Última actualización**: Enero 8, 2026
