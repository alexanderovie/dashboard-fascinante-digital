#!/usr/bin/env node

/**
 * Script para verificar y actualizar Allowed Logout URLs usando Auth0 Management API
 *
 * Uso:
 *   node scripts/check-logout-urls.js
 *
 * Requiere:
 *   - AUTH0_MANAGEMENT_TOKEN en .env.local
 *   - AUTH0_DOMAIN configurado
 */

const https = require('https');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

// Configuración
const AUTH0_DOMAIN = requireEnv('AUTH0_DOMAIN');
const AUTH0_MANAGEMENT_TOKEN = requireEnv('AUTH0_MANAGEMENT_TOKEN');
const CLIENT_ID = requireEnv('AUTH0_CLIENT_ID');

function getClient() {
  return new Promise((resolve, reject) => {
    const domain = AUTH0_DOMAIN.startsWith('http')
      ? new URL(AUTH0_DOMAIN).hostname
      : AUTH0_DOMAIN;

    const apiUrl = `https://${domain}/api/v2/clients/${CLIENT_ID}`;

    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH0_MANAGEMENT_TOKEN}`,
        'Accept': 'application/json',
      },
    };

    const req = https.request(apiUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Error parsing response: ' + e.message));
          }
        } else {
          reject(new Error(`Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function updateLogoutUrls(currentUrls, newUrl) {
  return new Promise((resolve, reject) => {
    const domain = AUTH0_DOMAIN.startsWith('http')
      ? new URL(AUTH0_DOMAIN).hostname
      : AUTH0_DOMAIN;

    const apiUrl = `https://${domain}/api/v2/clients/${CLIENT_ID}`;

    // Agregar nueva URL si no existe
    const urls = currentUrls || [];
    if (!urls.includes(newUrl)) {
      urls.push(newUrl);
    }

    const payload = JSON.stringify({
      allowed_logout_urls: urls
    });

    const options = {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AUTH0_MANAGEMENT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(apiUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Error parsing response: ' + e.message));
          }
        } else {
          reject(new Error(`Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const REQUIRED_URL = 'https://fascinantedigital.com';

  console.log('🔍 Verificando Allowed Logout URLs...');
  console.log(`📡 Domain: ${AUTH0_DOMAIN}`);
  console.log(`🔑 Client ID: ${CLIENT_ID}`);
  console.log('');

  try {
    // Obtener configuración actual
    const client = await getClient();
    const currentUrls = client.allowed_logout_urls || [];

    console.log('✅ Configuración actual de Allowed Logout URLs:');
    if (currentUrls.length === 0) {
      console.log('   ⚠️  No hay URLs configuradas');
    } else {
      currentUrls.forEach((url, index) => {
        const isRequired = url === REQUIRED_URL;
        console.log(`   ${index + 1}. ${url} ${isRequired ? '✅' : ''}`);
      });
    }
    console.log('');

    // Verificar si la URL requerida está presente
    const hasRequiredUrl = currentUrls.includes(REQUIRED_URL);

    if (hasRequiredUrl) {
      console.log(`✅ ${REQUIRED_URL} ya está en Allowed Logout URLs`);
      console.log('');
      console.log('🎯 El logout debería funcionar correctamente.');
    } else {
      console.log(`❌ ${REQUIRED_URL} NO está en Allowed Logout URLs`);
      console.log('');

      // Preguntar si quiere actualizar
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('¿Quieres agregar esta URL automáticamente? (s/n): ', async (answer) => {
        if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          try {
            console.log('');
            console.log('🔄 Actualizando Allowed Logout URLs...');
            const updated = await updateLogoutUrls(currentUrls, REQUIRED_URL);

            console.log('✅ URL agregada exitosamente!');
            console.log('');
            console.log('📋 URLs actualizadas:');
            (updated.allowed_logout_urls || []).forEach((url, index) => {
              console.log(`   ${index + 1}. ${url}`);
            });
            console.log('');
            console.log('🎯 Ahora el logout debería funcionar correctamente.');
          } catch (error) {
            console.error('❌ Error al actualizar:', error.message);
            if (error.message.includes('403')) {
              console.error('');
              console.error('💡 El token no tiene permisos update:clients');
              console.error('   Verifica que el token tenga el scope: update:clients');
            }
          }
        } else {
          console.log('');
          console.log('⏭️  Actualización cancelada.');
          console.log('');
          console.log('Para agregar manualmente:');
          console.log('1. Auth0 Dashboard → Applications → Dashboard Fascinante Digital');
          console.log('2. Settings → Application URIs → Allowed Logout URLs');
          console.log(`3. Agregar: ${REQUIRED_URL}`);
        }
        readline.close();
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('401')) {
      console.error('');
      console.error('💡 El token puede haber expirado o ser inválido');
      console.error('   Genera un nuevo token de Management API');
    } else if (error.message.includes('403')) {
      console.error('');
      console.error('💡 El token no tiene permisos read:clients');
      console.error('   Verifica que el token tenga el scope: read:clients');
    }
    process.exit(1);
  }
}

main();
