#!/usr/bin/env node

/**
 * Script para probar acceso a Fascinante API
 *
 * Este script simula lo que hace tu app Next.js cuando llama a getAccessToken()
 *
 * Requiere estar logueado en la app primero
 */

const https = require('https');
const http = require('http');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'auth.fascinantedigital.com';
const AUDIENCE = 'https://api.fascinantedigital.com';

async function testAccessToken() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 PRUEBA: ACCESO A FASCINANTE API                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📋 Configuración:');
  console.log(`   Domain: ${AUTH0_DOMAIN}`);
  console.log(`   Audience: ${AUDIENCE}`);
  console.log('');

  // Probar obtener token desde el endpoint de Next.js
  console.log('🔍 PRUEBA 1: Obtener access token desde Next.js endpoint');
  console.log('─'.repeat(60));

  return new Promise((resolve) => {
    const req = http.request('http://localhost:3000/api/auth/access-token?audience=' + encodeURIComponent(AUDIENCE), {
      method: 'GET',
      headers: {
        'Cookie': process.env.SESSION_COOKIE || '', // Necesitarías pasar la cookie
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log('✅ Access token obtenido exitosamente!');
            console.log('');

            // Decodificar el token para ver scopes
            const parts = result.accessToken?.split('.');
            if (parts && parts.length === 3) {
              try {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                console.log('📊 Información del token:');
                console.log(`   Audience: ${payload.aud || 'N/A'}`);
                console.log(`   Scopes: ${payload.scope || 'N/A'}`);
                console.log(`   Expires: ${new Date(payload.exp * 1000).toISOString()}`);
                console.log('');

                if (payload.scope) {
                  const scopes = payload.scope.split(' ');
                  console.log(`✅ Token tiene ${scopes.length} scope(s):`);
                  scopes.forEach((scope, i) => {
                    console.log(`   ${i + 1}. ${scope}`);
                  });
                } else {
                  console.log('⚠️  Token NO tiene scopes definidos');
                  console.log('   Esto es normal si la API no tiene scopes configurados aún');
                }
              } catch (e) {
                console.log('⚠️  No se pudo decodificar el token JWT');
              }
            }

            console.log('');
            console.log('✅ CONCLUSIÓN: Puedes obtener access tokens para Fascinante API');
          } catch (e) {
            console.log('❌ Error al parsear respuesta:', e.message);
            console.log('Respuesta:', data);
          }
        } else {
          console.log(`❌ Error ${res.statusCode}`);
          try {
            const error = JSON.parse(data);
            console.log(`   Mensaje: ${error.error || error.message || 'Unknown error'}`);
            if (error.error === 'missing_session') {
              console.log('');
              console.log('💡 Necesitas estar logueado para probar');
              console.log('   1. Abre http://localhost:3000/login en tu navegador');
              console.log('   2. Inicia sesión');
              console.log('   3. Luego ejecuta este script de nuevo');
            }
          } catch (e) {
            console.log('   Respuesta:', data.substring(0, 200));
          }
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      console.log('');
      console.log('💡 Asegúrate de que el servidor Next.js esté corriendo:');
      console.log('   pnpm dev');
      resolve();
    });

    req.end();
  });
}

testAccessToken();
