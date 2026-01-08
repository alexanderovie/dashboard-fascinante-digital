#!/bin/bash

# Script para subir variables de entorno a Vercel
# Uso: bash SUBIR_VARIABLES_VERCEL.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  SUBIENDO VARIABLES DE ENTORNO A VERCEL                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local no encontrado"
    exit 1
fi

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI no está instalado"
    echo "   Instalar: npm i -g vercel"
    exit 1
fi

echo "✅ Verificando conexión a Vercel..."
vercel whoami || exit 1

echo ""
echo "📋 Variables a subir:"
echo ""

# Leer variables de .env.local y subirlas
cat .env.local | grep -E "^[A-Z_]+=" | grep -v "^#" | grep -v "^$" | while IFS='=' read -r key value; do
    # Remover comillas del valor
    value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')

    if [ -n "$key" ] && [ -n "$value" ]; then
        echo "   ➜ Subiendo: $key"
        echo "$value" | vercel env add "$key" production --yes --scope alexanderoviedo 2>&1 | grep -v "^Password:" || echo "     ⚠️ Error al subir $key"
    fi
done

echo ""
echo "✅ Variables subidas. Verificando..."
vercel env ls

echo ""
echo "🎯 NOTA: También debes subir para 'preview' y 'development':"
echo "   vercel env add <VARIABLE> preview"
echo "   vercel env add <VARIABLE> development"
