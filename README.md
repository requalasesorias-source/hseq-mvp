# 🎯 HSEQ MVP Chile

Sistema de auditorías trinorma (ISO 9001/45001/14001) con análisis LLM y cumplimiento de normativa chilena.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Express%20%7C%20Prisma-green.svg)
![Cost](https://img.shields.io/badge/cost-%240%2Fmes-brightgreen.svg)

## 📋 Características

- ✅ **Auditorías Trinorma**: Checklist interactivo ISO 9001, 45001, 14001
- ✅ **Compliance Chileno**: Referencias automáticas a Ley 16.744, DS44, DS40
- ✅ **Análisis LLM**: Clasificación automática de NCs con Groq Llama 3.1
- ✅ **RAG Normativo**: Búsqueda vectorial en Pinecone para contexto legal
- ✅ **Notificaciones**: Webhooks automáticos para NCs críticas
- ✅ **Reportes PDF**: Exportación con firma digital

## 🏗️ Stack Tecnológico

| Componente | Tecnología | Costo |
|------------|------------|-------|
| Frontend | Next.js 15 + Tailwind | Vercel Free |
| Backend | Express + TypeScript | Render Free |
| Database | PostgreSQL | Supabase Free |
| ORM | Prisma | - |
| LLM | Groq Llama 3.1 | Free Tier |
| Vector DB | Pinecone | Free Tier |
| Webhooks | Make.com | Free Tier |

**Costo total: $0/mes** 💰

## 🚀 Instalación Rápida

### Prerrequisitos

- Node.js 18+
- Git
- Cuenta en Supabase, Groq, Pinecone (todos free)

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/hseq-mvp.git
cd hseq-mvp
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

### 3. Instalar dependencias

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push

# Frontend
cd ../frontend
npm install
```

### 4. Ejecutar en desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Abre http://localhost:3000 🎉

## 📁 Estructura del Proyecto

```
hseq-mvp/
├── .antigravity/
│   └── hseq-config.json      # Configuración AntiGravity
├── backend/
│   ├── src/
│   │   ├── modules/          # Módulos API
│   │   │   ├── audits/       # CRUD auditorías
│   │   │   ├── findings/     # Hallazgos
│   │   │   ├── nonconformities/ # NCs + CAPA
│   │   │   ├── analysis/     # Análisis LLM
│   │   │   └── checklist/    # Items trinorma
│   │   ├── services/         # Integraciones
│   │   │   ├── groq.service.ts
│   │   │   ├── pinecone.service.ts
│   │   │   └── make.service.ts
│   │   └── index.ts          # Entry point
│   └── prisma/
│       └── schema.prisma     # Modelos de datos
├── frontend/
│   ├── src/
│   │   ├── app/              # Páginas Next.js
│   │   │   ├── page.tsx      # Landing
│   │   │   ├── login/        # Autenticación
│   │   │   ├── dashboard/    # Dashboard KPIs
│   │   │   └── audit/        # Checklist auditoría
│   │   ├── components/       # Componentes UI
│   │   └── lib/              # Utilidades
│   │       ├── api-client.ts # Cliente HTTP
│   │       └── auth.ts       # Helpers auth
├── .env.example              # Template variables
├── deploy.sh                 # Script deploy
└── README.md                 # Este archivo
```

## 🔌 API Endpoints

### Auditorías
```
GET    /api/audits           # Listar auditorías
POST   /api/audits           # Crear auditoría
GET    /api/audits/:id       # Obtener auditoría
PATCH  /api/audits/:id       # Actualizar auditoría
POST   /api/audits/:id/complete  # Completar auditoría
```

### Hallazgos
```
GET    /api/findings         # Listar hallazgos
POST   /api/findings         # Crear hallazgo
POST   /api/findings/bulk    # Crear múltiples
GET    /api/findings/summary/:auditId  # Resumen
```

### No Conformidades
```
GET    /api/nonconformities       # Listar NCs
POST   /api/nonconformities       # Crear NC
POST   /api/nonconformities/:id/capa  # Agregar CAPA
PATCH  /api/nonconformities/:id/close # Cerrar NC
GET    /api/nonconformities/stats     # Estadísticas
```

### Análisis
```
POST   /api/analysis         # Analizar auditoría con LLM
GET    /api/analysis/:auditId # Obtener análisis
```

### Checklist
```
GET    /api/checklist        # Listar items
GET    /api/checklist/trinorma  # Checklist completo
POST   /api/checklist/seed   # Seed inicial
```

## 📜 Cumplimiento Normativo

### Ley 16.744 - Seguridad Laboral
- Art. 184: Obligaciones del empleador
- Art. 68: Prevención de riesgos

### DS 40 - Reglamento de Prevención
- Art. 14: Competencia del personal
- Art. 21: Identificación de peligros

### DS 44 - Higiene Industrial
- Límites permisibles
- Vigilancia ambiental

### Normas ISO
- ISO 9001:2015 - Calidad
- ISO 45001:2018 - SST
- ISO 14001:2015 - Medio Ambiente
- ISO 19011:2018 - Auditorías

## 🚀 Deploy a Producción

```bash
chmod +x deploy.sh
./deploy.sh
```

El script:
1. Instala dependencias
2. Configura base de datos
3. Deploya frontend a Vercel
4. Genera instrucciones para Render

## 🔒 Seguridad

- ✅ JWT authentication
- ✅ Rate limiting 100 req/min
- ✅ CORS configurado
- ✅ Input validation con Zod
- ✅ Prepared for Supabase RLS

## 📞 Soporte

¿Problemas? Abre un issue en GitHub.

---

**Desarrollado con AntiGravity + Claude** 🤖

Cumplimiento: Ley 16.744 • DS44 • ISO 9001/45001/14001
