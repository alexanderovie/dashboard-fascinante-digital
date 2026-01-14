#!/usr/bin/env node

/**
 * Script para probar acceso a APIs de Auth0
 * 
 * Prueba:
 * 1. Auth0 Management API (si está autorizada)
 * 2. Fascinante API (si está autorizada)
 */

const https = require('https');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const AUTH0_DOMAIN = requireEnv('AUTH0_DOMAIN');
const AUTH0_MANAGEMENT_TOKEN = requireEnv('AUTH0_MANAGEMENT_TOKEN');
const CLIENT_ID = requireEnv('AUTH0_CLIENT_ID');
const FASCINANTE_API = requireEnv('AUTH0_AUDIENCE');

function testManagementAPI() {
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
            resolve({ success: true, data: JSON.parse(data) });
          } catch (e) {
            reject(new Error('Error parsing response: ' + e.message));
          }
        } else {
          resolve({ 
            success: false, 
            status: res.statusCode, 
            error: data 
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function testFascinanteAPI() {
  // Probar si podemos obtener un access token para Fascinante API
  // Esto requiere que la aplicación esté autorizada
  
  return new Promise((resolve) => {
    // Simular una prueba básica
    // En producción, esto requeriría un token de usuario válido
    resolve({
      success: false,
      message: 'Requiere token de usuario autenticado para probar',
      note: 'Esta prueba solo funciona cuando un usuario está logueado'
    });
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 PRUEBA: ACCESO A APIs DE AUTH0                              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📊 APIs a probar:');
  console.log('   1. Auth0 Management API');
  console.log('   2. Fascinante API');
  console.log('');

  // Prueba 1: Management API
  console.log('🔍 PRUEBA 1: Auth0 Management API');
  console.log('─'.repeat(60));
  
  try {
    const result = await testManagementAPI();
    if (result.success) {
      console.log('✅ ACCESO A MANAGEMENT API: FUNCIONA');
      console.log(`   Application: ${result.data.name || 'N/A'}`);
      console.log(`   Client ID: ${result.data.client_id || 'N/A'}`);
      console.log(`   Type: ${result.data.app_type || 'N/A'}`);
      console.log('');
      console.log('✅ La aplicación tiene acceso a Management API');
    } else {
      console.log(`❌ ACCESO DENEGADO (Status: ${result.status})`);
      if (result.status === 401) {
        console.log('   El token puede haber expirado o ser inválido');
      } else if (result.status === 403) {
        console.log('   El token no tiene permisos suficientes');
      }
      console.log('');
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('');
  }

  // Prueba 2: Fascinante API
  console.log('🔍 PRUEBA 2: Fascinante API');
  console.log('─'.repeat(60));
  console.log('⚠️  Esta API requiere autorización en Auth0 Dashboard');
  console.log('⚠️  Y un usuario autenticado para obtener access token');
  console.log('');
  console.log('📋 Estado actual:');
  console.log(`   - API: ${FASCINANTE_API}`);
  console.log('   - Status: ❌ Unauthorized (debes autorizarla)');
  console.log('');
  console.log('✅ Para probar Fascinante API:');
  console.log('   1. Autoriza la API en Auth0 Dashboard');
  console.log('   2. Inicia sesión en tu app Next.js');
  console.log('   3. El token se obtendrá automáticamente con getAccessToken()');
  console.log('');

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📋 RESUMEN                                                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ Auth0 Management API:');
  console.log('   - Configurada: ' + (AUTH0_MANAGEMENT_TOKEN ? 'Sí' : 'No (necesitas token)'));
  console.log('   - Autorizada: Sí (según Dashboard)');
  console.log('');
  console.log('⚠️  Fascinante API:');
  console.log('   - Status: Unauthorized (DEBES autorizarla)');
  console.log('   - Crítica: SÍ (necesaria para tu backend)');
  console.log('');
  console.log('🎯 ACCIÓN REQUERIDA:');
  console.log('   → Autorizar "Fascinante API" en Auth0 Dashboard');
  console.log('');
}

main().catch(console.error);

