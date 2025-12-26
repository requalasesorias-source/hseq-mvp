/**
 * HSEQ MVP Chile - Backend Entry Point
 * Express server with modular architecture
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import { auditRoutes } from './modules/audits/audits.routes.js';
import { findingRoutes } from './modules/findings/findings.routes.js';
import { ncRoutes } from './modules/nonconformities/nc.routes.js';
import { analysisRoutes } from './modules/analysis/analysis.routes.js';
import { checklistRoutes } from './modules/checklist/checklist.routes.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://frontend-mocha-two-66.vercel.app',
        /\.vercel\.app$/,
    ],
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        service: 'HSEQ MVP API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/audits', auditRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/nonconformities', ncRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/checklist', checklistRoutes);

// Admin endpoint to seed database (no shell required)
app.post('/api/admin/seed', async (_req: Request, res: Response) => {
    try {
        // Dynamic import of Prisma
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        console.log('🌱 Running database seed...');

        // DS44 + ISO Checklist Items
        const checklistItems = [
            // ISO 45001 Base Items
            { code: 'ISO45001-4.1-001', norm: 'ISO45001', clause: '4.1', requirement: 'Comprensión de la organización', verificationQ: '¿Se han determinado las cuestiones externas e internas pertinentes?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-5.1-001', norm: 'ISO45001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección asume responsabilidad para la prevención?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-6.1.2-001', norm: 'ISO45001', clause: '6.1.2', requirement: 'Identificación de peligros', verificationQ: '¿Existe proceso para identificar peligros y evaluar riesgos?', legalRef: 'DS 40 Art. 21' },

            // DS44 Items - Organización Preventiva
            { code: 'DS44-ART4-001', norm: 'ISO45001', clause: 'DS44-Art.4', requirement: 'Departamento de Prevención', verificationQ: '¿Existe Departamento de Prevención con experto a cargo?', legalRef: 'DS 44 Art. 4' },
            { code: 'DS44-ART7-001', norm: 'ISO45001', clause: 'DS44-Art.7', requirement: 'Delegado de SST', verificationQ: '¿Hay Delegado de SST elegido por trabajadores?', legalRef: 'DS 44 Art. 7' },
            { code: 'DS44-ART10-001', norm: 'ISO45001', clause: 'DS44-Art.10', requirement: 'Constitución CPHS', verificationQ: '¿Se ha constituido CPHS según ley?', legalRef: 'DS 44 Art. 10, Ley 16.744 Art. 66' },

            // DS44 Items - Sistema de Gestión
            { code: 'DS44-ART13-001', norm: 'ISO45001', clause: 'DS44-Art.13', requirement: 'Política SST documentada', verificationQ: '¿Existe Política de SST documentada?', legalRef: 'DS 44 Art. 13' },
            { code: 'DS44-ART16-001', norm: 'ISO45001', clause: 'DS44-Art.16', requirement: 'Proceso IPER', verificationQ: '¿Existe matriz IPER actualizada?', legalRef: 'DS 44 Art. 16' },
            { code: 'DS44-ART19-001', norm: 'ISO45001', clause: 'DS44-Art.19', requirement: 'Jerarquía de controles', verificationQ: '¿Se aplica jerarquía de controles?', legalRef: 'DS 44 Art. 19' },
            { code: 'DS44-ART20-001', norm: 'ISO45001', clause: 'DS44-Art.20', requirement: 'Programa Anual PRL', verificationQ: '¿Existe Programa Anual de Prevención?', legalRef: 'DS 44 Art. 20' },

            // DS44 Items - Gestión Preventiva
            { code: 'DS44-ART31-001', norm: 'ISO45001', clause: 'DS44-Art.31', requirement: 'Obligación de Informar', verificationQ: '¿Se realiza ODI a todos los trabajadores?', legalRef: 'DS 44 Art. 31, DS 40 Art. 21' },
            { code: 'DS44-ART41-001', norm: 'ISO45001', clause: 'DS44-Art.41', requirement: 'Entrega de EPP', verificationQ: '¿Se entregan EPP sin costo?', legalRef: 'DS 44 Art. 41' },
            { code: 'DS44-ART46-001', norm: 'ISO45001', clause: 'DS44-Art.46', requirement: 'Investigación accidentes', verificationQ: '¿Se investigan todos los accidentes?', legalRef: 'DS 44 Art. 46' },
            { code: 'DS44-ART51-001', norm: 'ISO45001', clause: 'DS44-Art.51', requirement: 'Plan de Emergencias', verificationQ: '¿Existe Plan de Emergencias?', legalRef: 'DS 44 Art. 51' },
            { code: 'DS44-ART53-001', norm: 'ISO45001', clause: 'DS44-Art.53', requirement: 'Simulacros', verificationQ: '¿Se realizan simulacros anuales?', legalRef: 'DS 44 Art. 53' },
            { code: 'DS44-ART56-001', norm: 'ISO45001', clause: 'DS44-Art.56', requirement: 'Mapa de Riesgos', verificationQ: '¿Existe Mapa de Riesgos?', legalRef: 'DS 44 Art. 56' },

            // ISO 9001 Items
            { code: 'ISO9001-4.1-001', norm: 'ISO9001', clause: '4.1', requirement: 'Contexto de la organización', verificationQ: '¿Se han determinado cuestiones externas e internas para el SGC?', legalRef: null },
            { code: 'ISO9001-5.2-001', norm: 'ISO9001', clause: '5.2', requirement: 'Política de calidad', verificationQ: '¿La política de calidad está documentada y comunicada?', legalRef: null },

            // ISO 14001 Items
            { code: 'ISO14001-6.1.2-001', norm: 'ISO14001', clause: '6.1.2', requirement: 'Aspectos ambientales', verificationQ: '¿Se han identificado aspectos ambientales significativos?', legalRef: 'Ley 19.300' },
            { code: 'ISO14001-8.2-001', norm: 'ISO14001', clause: '8.2', requirement: 'Preparación emergencias', verificationQ: '¿Existe plan de emergencia ambiental?', legalRef: 'Ley 19.300' },
        ];

        // Upsert checklist items
        for (const item of checklistItems) {
            await prisma.checklistItem.upsert({
                where: { code: item.code },
                update: item as any,
                create: item as any,
            });
        }

        await prisma.$disconnect();

        res.json({
            success: true,
            message: `✅ Seeded ${checklistItems.length} checklist items (ISO + DS44)`,
            count: checklistItems.length,
        });
    } catch (error: any) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Seed failed', details: error.message });
    }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist',
    });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║       HSEQ MVP Chile - API Server             ║
║───────────────────────────────────────────────║
║  🚀 Server running on port ${PORT}              ║
║  📋 Endpoints:                                ║
║     - GET  /health                            ║
║     - POST /api/audits                        ║
║     - POST /api/findings                      ║
║     - POST /api/nonconformities               ║
║     - POST /api/analysis                      ║
║  📜 Compliance: Ley16.744, DS44, ISO19011     ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
