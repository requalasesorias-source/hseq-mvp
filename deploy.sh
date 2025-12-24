#!/bin/bash

# ===========================================
# HSEQ MVP Chile - Deploy Script
# Deploy to Vercel + Render + Supabase
# ===========================================

set -e

echo "🚀 HSEQ MVP Chile - Iniciando deploy..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

# ===========================================
# 1. INSTALL DEPENDENCIES
# ===========================================
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"

# Backend
echo "  → Backend dependencies..."
cd backend
npm install
cd ..

# Frontend
echo "  → Frontend dependencies..."
cd frontend
npm install
cd ..

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# ===========================================
# 2. DATABASE SETUP (Prisma)
# ===========================================
echo -e "${YELLOW}🗄️ Configurando base de datos...${NC}"

cd backend

# Generate Prisma client
echo "  → Generando Prisma client..."
npx prisma generate

# Push schema to database
echo "  → Aplicando schema a Supabase..."
npx prisma db push

# Seed checklist data
echo "  → Seeding checklist items..."
# Run seed if exists
if [ -f "prisma/seed.ts" ]; then
    npm run db:seed
fi

cd ..

echo -e "${GREEN}✅ Base de datos configurada${NC}"
echo ""

# ===========================================
# 3. BUILD PROJECTS
# ===========================================
echo -e "${YELLOW}🔨 Building projects...${NC}"

# Backend build
echo "  → Building backend..."
cd backend
npm run build
cd ..

# Frontend build
echo "  → Building frontend..."
cd frontend
npm run build
cd ..

echo -e "${GREEN}✅ Builds completados${NC}"
echo ""

# ===========================================
# 4. DEPLOY TO VERCEL (Frontend)
# ===========================================
echo -e "${YELLOW}▲ Deploying frontend to Vercel...${NC}"

cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "  → Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy
echo "  → Deploying..."
vercel --prod --yes

cd ..

echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
echo ""

# ===========================================
# 5. DEPLOY TO RENDER (Backend)
# ===========================================
echo -e "${YELLOW}🚂 Backend ready for Render deployment${NC}"
echo ""
echo "Para deploy del backend en Render:"
echo "1. Conecta tu repo a https://render.com"
echo "2. Create New → Web Service"
echo "3. Root Directory: backend"
echo "4. Build Command: npm install && npm run build"
echo "5. Start Command: npm start"
echo "6. Add environment variables from .env"
echo ""

# ===========================================
# 6. SUMMARY
# ===========================================
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Deploy completado!${NC}"
echo "=========================================="
echo ""
echo "📱 Frontend: https://hseq-mvp.vercel.app"
echo "🔧 Backend:  Deploy manual en Render.com"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Configura variables de entorno en Vercel"
echo "  2. Deploy backend en Render"
echo "  3. Actualiza FRONTEND_URL en backend .env"
echo "  4. Configura Make.com webhooks"
echo ""
echo "📚 Documentación: README.md"
echo ""
