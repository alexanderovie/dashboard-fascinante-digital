#!/usr/bin/env node

/**
 * Script para actualizar branding de Auth0 Universal Login usando Themes API
 * Usa Auth0 Management API v2 para modificar colores y fuentes del tema
 *
 * Uso:
 *   node scripts/update-auth0-branding.js
 *
 * Requiere:
 *   - AUTH0_MANAGEMENT_TOKEN en .env.local (con scope update:branding)
 *   - AUTH0_DOMAIN o AUTH0_ISSUER_BASE_URL configurado
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local manualmente
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key.trim()] = value.trim();
        }
      }
    });
  }
}

loadEnvFile();

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const normalizeDomain = (value) => {
  if (value.startsWith('http')) {
    return new URL(value).hostname;
  }
  return value;
};

// Configuración
const AUTH0_DOMAIN = requireEnv('AUTH0_DOMAIN');
const AUTH0_MANAGEMENT_TOKEN = requireEnv('AUTH0_MANAGEMENT_TOKEN');

// Colores extraídos de src/app/globals.css (modo claro)
// Mapeados a los campos requeridos por Auth0 Themes API
const DASHBOARD_COLORS = {
  // Primary (Botón principal)
  primary_button: '#0F172A',           // hsl(222.2 47.4% 11.2%) - bg-primary
  primary_button_label: '#F8FAFC',     // hsl(210 40% 98%) - primary-foreground

  // Backgrounds
  page_background_color: '#FFFFFF',    // hsl(0 0% 100%) - background
  widget_background: '#FFFFFF',        // Mismo que page_background
  input_background: '#FFFFFF',         // Inputs blancos

  // Text & Headers
  body_text: '#0C0E12',                // hsl(222.2 84% 4.9%) - foreground
  header: '#0C0E12',                   // Mismo que body_text

  // Borders & Inputs
  input_border: '#E2E8F0',             // hsl(214.3 31.8% 91.4%) - border
  widget_border: '#E2E8F0',            // Mismo que input_border
  secondary_button_border: '#E2E8F0',  // Mismo que border
  input_filled_text: '#0C0E12',        // Texto cuando input tiene valor
  input_labels_placeholders: '#64748B', // hsl(215.4 16.3% 46.9%) - muted-foreground
  secondary_button_label: '#64748B',   // Texto del botón secundario

  // Links & Focus
  links_focused_components: '#0F172A', // Primary para links
  base_focus_color: '#0F172A',         // Color de foco
  base_hover_color: '#1E293B',         // Hover más claro que primary

  // Icons
  icons: '#64748B',                    // Iconos en muted-foreground

  // Status colors
  error: '#EF4444',                    // hsl(0 84.2% 60.2%) - destructive
  success: '#22C55E',                  // Verde estándar (no está en globals.css)

  // Read-only (opcional)
  read_only_background: '#F8FAFC',     // hsl(210 40% 96.1%) - secondary
};

// Fuente: Inter (similar a Arial pero más moderna)
const FONT_URL = 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';

// Helper para hacer requests HTTPS
function makeRequest(url, options, payload = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`Error ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', (error) => reject(error));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// Obtener el tema por defecto
async function getDefaultTheme() {
  const domain = normalizeDomain(AUTH0_DOMAIN);

  const apiUrl = `https://${domain}/api/v2/branding/themes/default`;

  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AUTH0_MANAGEMENT_TOKEN}`,
      'Accept': 'application/json',
    },
  };

  console.log('🔍 Obteniendo tema por defecto...');
  console.log(`📡 GET ${apiUrl}`);
  console.log('');

  try {
    const theme = await makeRequest(apiUrl, options);
    return theme;
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error('Tema por defecto no encontrado. Puede que necesites crear un tema primero en Auth0 Dashboard.');
    }
    throw error;
  }
}

// Actualizar el tema con nuestros colores
async function updateTheme(themeId, existingTheme) {
  const domain = normalizeDomain(AUTH0_DOMAIN);

  const apiUrl = `https://${domain}/api/v2/branding/themes/${themeId}`;

  // Construir el payload completo manteniendo valores existentes donde sea necesario
  const themePayload = {
    displayName: existingTheme.displayName || 'Dashboard Fascinante Digital',

    // Borders (mantener valores existentes o usar valores por defecto)
    borders: existingTheme.borders || {
      button_border_radius: 6,      // 0.6rem = 6px aprox
      button_border_weight: 0,
      buttons_style: 'rounded',     // Rounded como en el dashboard
      input_border_radius: 6,
      input_border_weight: 1,
      inputs_style: 'rounded',
      show_widget_shadow: true,
      widget_border_weight: 1,
      widget_corner_radius: 8,
    },

    // Colors (nuestros colores del dashboard)
    colors: {
      primary_button: DASHBOARD_COLORS.primary_button,
      primary_button_label: DASHBOARD_COLORS.primary_button_label,
      body_text: DASHBOARD_COLORS.body_text,
      header: DASHBOARD_COLORS.header,
      widget_background: DASHBOARD_COLORS.widget_background,
      widget_border: DASHBOARD_COLORS.widget_border,
      input_background: DASHBOARD_COLORS.input_background,
      input_border: DASHBOARD_COLORS.input_border,
      input_filled_text: DASHBOARD_COLORS.input_filled_text,
      input_labels_placeholders: DASHBOARD_COLORS.input_labels_placeholders,
      secondary_button_border: DASHBOARD_COLORS.secondary_button_border,
      secondary_button_label: DASHBOARD_COLORS.secondary_button_label,
      links_focused_components: DASHBOARD_COLORS.links_focused_components,
      base_focus_color: DASHBOARD_COLORS.base_focus_color,
      base_hover_color: DASHBOARD_COLORS.base_hover_color,
      icons: DASHBOARD_COLORS.icons,
      error: DASHBOARD_COLORS.error,
      success: DASHBOARD_COLORS.success,
      read_only_background: DASHBOARD_COLORS.read_only_background,
      captcha_widget_theme: 'auto', // Auto (light/dark según preferencias del usuario)
    },

    // Fonts (Inter, similar a Arial)
    fonts: {
      font_url: FONT_URL,
      reference_text_size: 16, // 16px base
      body_text: {
        size: 16,
        bold: false,
      },
      buttons_text: {
        size: 14,
        bold: true,
      },
      input_labels: {
        size: 14,
        bold: false,
      },
      links: {
        size: 14,
        bold: false,
      },
      links_style: 'normal', // 'normal' o 'underlined'
      subtitle: {
        size: 14,
        bold: false,
      },
      title: {
        size: 24,
        bold: true,
      },
    },

    // Page Background
    page_background: {
      background_color: DASHBOARD_COLORS.page_background_color,
      background_image_url: '', // Sin imagen de fondo
      page_layout: 'center', // 'center', 'left', o 'right'
    },

    // Widget (Logo y layout)
    widget: {
      logo_url: 'https://app.fascinantedigital.com/shadcnblocks-admin-logo.svg',
      logo_position: 'center', // 'center', 'left', 'right', o 'none'
      logo_height: 40, // Altura del logo en px
      header_text_alignment: 'center', // 'center', 'left', o 'right'
      social_buttons_layout: 'bottom', // 'bottom' o 'top'
    },
  };

  const options = {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AUTH0_MANAGEMENT_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  console.log('🚀 Actualizando tema...');
  console.log(`📡 PATCH ${apiUrl}`);
  console.log(`📋 Theme ID: ${themeId}`);
  console.log('');

  try {
    const response = await makeRequest(apiUrl, options, JSON.stringify(themePayload));
    return response;
  } catch (error) {
    throw error;
  }
}

// Función principal
async function main() {
  if (!AUTH0_MANAGEMENT_TOKEN) {
    console.error('❌ Error: AUTH0_MANAGEMENT_TOKEN no configurado');
    console.error('   Agrega AUTH0_MANAGEMENT_TOKEN a .env.local');
    console.error('   El token debe tener el scope: update:branding');
    process.exit(1);
  }

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨 ACTUALIZAR BRANDING DE AUTH0 UNIVERSAL LOGIN              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📋 Dominio: ${AUTH0_DOMAIN}`);
  console.log('');

  try {
    // 1. Obtener tema por defecto
    const defaultTheme = await getDefaultTheme();
    console.log('✅ Tema por defecto obtenido');
    console.log(`   Theme ID: ${defaultTheme.themeId || 'default'}`);
    console.log(`   Display Name: ${defaultTheme.displayName || 'N/A'}`);
    console.log('');

    // 2. Actualizar tema
    const themeId = defaultTheme.themeId || 'default';
    const updatedTheme = await updateTheme(themeId, defaultTheme);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ BRANDING ACTUALIZADO EXITOSAMENTE                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('🎯 Cambios aplicados:');
    console.log(`   • Primary Button: ${DASHBOARD_COLORS.primary_button}`);
    console.log(`   • Primary Button Label: ${DASHBOARD_COLORS.primary_button_label}`);
    console.log(`   • Page Background: ${DASHBOARD_COLORS.page_background_color}`);
    console.log(`   • Font: Inter (${FONT_URL.substring(0, 60)}...)`);
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Ve a Auth0 Dashboard → Branding → Universal Login');
    console.log('   2. Verifica que los colores se vean correctos');
    console.log(`   3. Prueba el login: https://${normalizeDomain(AUTH0_DOMAIN)}/authorize`);
    console.log('');

  } catch (error) {
    console.error('╔════════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ ERROR AL ACTUALIZAR BRANDING                                ║');
    console.error('╚════════════════════════════════════════════════════════════════╝');
    console.error('');
    console.error(`❌ ${error.message}`);
    console.error('');

    if (error.message.includes('401')) {
      console.error('💡 Solución:');
      console.error('   • El token puede haber expirado');
      console.error('   • Verifica que AUTH0_MANAGEMENT_TOKEN sea correcto');
      console.error('   • El token debe tener el scope: update:branding');
    } else if (error.message.includes('403')) {
      console.error('💡 Solución:');
      console.error('   • El token no tiene permisos update:branding');
      console.error('   • Verifica los scopes de tu aplicación M2M en Auth0 Dashboard');
    } else if (error.message.includes('404')) {
      console.error('💡 Solución:');
      console.error('   • El tema no existe. Crea un tema primero en Auth0 Dashboard');
      console.error('   • O verifica que el themeId sea correcto');
    }

    process.exit(1);
  }
}

// Ejecutar
main();
