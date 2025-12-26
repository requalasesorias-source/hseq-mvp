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
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        console.log('🌱 Running database seed with raw SQL...');

        // DS44 + ISO Checklist Items (DS40 DEROGADO por DS44)
        const checklistItems = [
            // TÍTULO I - DISPOSICIONES GENERALES
            { code: 'DS44-ART4-001', norm: 'ISO45001', clause: 'DS44-Art.4', requirement: 'Obligaciones de la entidad empleadora', verificationQ: '¿La entidad empleadora gestiona preventivamente los riesgos laborales?', legalRef: 'DS 44 Art. 4, Ley 16.744' },
            { code: 'DS44-ART5-001', norm: 'ISO45001', clause: 'DS44-Art.5', requirement: 'Obligaciones de las personas trabajadoras', verificationQ: '¿Las personas trabajadoras cumplen con las normas de prevención?', legalRef: 'DS 44 Art. 5' },
            // TÍTULO II - GESTIÓN PREVENTIVA
            { code: 'DS44-ART7-001', norm: 'ISO45001', clause: 'DS44-Art.7', requirement: 'Matriz IPER', verificationQ: '¿Existe una Matriz IPER actualizada?', legalRef: 'DS 44 Art. 7' },
            { code: 'DS44-ART8-001', norm: 'ISO45001', clause: 'DS44-Art.8', requirement: 'Programa de trabajo preventivo', verificationQ: '¿Existe programa preventivo con objetivos y plazos?', legalRef: 'DS 44 Art. 8' },
            { code: 'DS44-ART9-001', norm: 'ISO45001', clause: 'DS44-Art.9', requirement: 'Jerarquía de controles', verificationQ: '¿Se aplica la jerarquía de controles?', legalRef: 'DS 44 Art. 9' },
            { code: 'DS44-ART13-001', norm: 'ISO45001', clause: 'DS44-Art.13', requirement: 'Uso de EPP', verificationQ: '¿Se entregan EPP certificados sin costo?', legalRef: 'DS 44 Art. 13' },
            { code: 'DS44-ART15-001', norm: 'ISO45001', clause: 'DS44-Art.15', requirement: 'Obligación de Informar (ODI)', verificationQ: '¿Se informa a cada trabajador sobre riesgos?', legalRef: 'DS 44 Art. 15' },
            { code: 'DS44-ART16-001', norm: 'ISO45001', clause: 'DS44-Art.16', requirement: 'Capacitación en prevención', verificationQ: '¿Se capacita en prevención de riesgos?', legalRef: 'DS 44 Art. 16' },
            { code: 'DS44-ART19-001', norm: 'ISO45001', clause: 'DS44-Art.19', requirement: 'Plan de emergencias', verificationQ: '¿Existe plan de emergencias?', legalRef: 'DS 44 Art. 19' },
            // TÍTULO III - ORGANIZACIÓN PREVENTIVA
            { code: 'DS44-ART22-001', norm: 'ISO45001', clause: 'DS44-Art.22', requirement: 'Sistema de Gestión SST', verificationQ: '¿Existe un Sistema de Gestión de SST?', legalRef: 'DS 44 Art. 22' },
            { code: 'DS44-ART23-001', norm: 'ISO45001', clause: 'DS44-Art.23', requirement: 'Comité Paritario (CPHS)', verificationQ: '¿Se ha constituido el CPHS (25+ trabajadores)?', legalRef: 'DS 44 Art. 23, Ley 16.744 Art. 66' },
            { code: 'DS44-ART50-001', norm: 'ISO45001', clause: 'DS44-Art.50', requirement: 'Departamento de Prevención', verificationQ: '¿Existe Departamento de Prevención (100+ trabajadores)?', legalRef: 'DS 44 Art. 50' },
            { code: 'DS44-ART56-001', norm: 'ISO45001', clause: 'DS44-Art.56', requirement: 'Reglamento Interno (RIOHS)', verificationQ: '¿Existe Reglamento Interno de Orden, Higiene y Seguridad?', legalRef: 'DS 44 Art. 56' },
            { code: 'DS44-ART62-001', norm: 'ISO45001', clause: 'DS44-Art.62', requirement: 'Mapas de riesgo', verificationQ: '¿Existen mapas de riesgo visibles?', legalRef: 'DS 44 Art. 62' },
            // TÍTULO IV - PYMES
            { code: 'DS44-ART66-001', norm: 'ISO45001', clause: 'DS44-Art.66', requirement: 'Delegado de SST', verificationQ: '¿Existe Delegado de SST en empresas sin CPHS?', legalRef: 'DS 44 Art. 66' },
            // TÍTULO V - VIGILANCIA Y REGISTROS
            { code: 'DS44-ART71-001', norm: 'ISO45001', clause: 'DS44-Art.71', requirement: 'Investigación de accidentes', verificationQ: '¿Se investigan los accidentes?', legalRef: 'DS 44 Art. 71' },
            { code: 'DS44-ART73-001', norm: 'ISO45001', clause: 'DS44-Art.73', requirement: 'Estadísticas de accidentabilidad', verificationQ: '¿Se llevan estadísticas (IF, IG)?', legalRef: 'DS 44 Art. 73' },
            // ISO 9001 - CALIDAD
            { code: 'ISO9001-4.1-001', norm: 'ISO9001', clause: '4.1', requirement: 'Contexto de la organización', verificationQ: '¿Se han determinado cuestiones pertinentes al SGC?', legalRef: null },
            { code: 'ISO9001-5.2-001', norm: 'ISO9001', clause: '5.2', requirement: 'Política de calidad', verificationQ: '¿Está documentada la política de calidad?', legalRef: null },
            { code: 'ISO9001-9.2-001', norm: 'ISO9001', clause: '9.2', requirement: 'Auditoría interna', verificationQ: '¿Se realizan auditorías internas?', legalRef: null },
            // ISO 14001 - MEDIO AMBIENTE
            { code: 'ISO14001-6.1.2-001', norm: 'ISO14001', clause: '6.1.2', requirement: 'Aspectos ambientales', verificationQ: '¿Se han identificado aspectos ambientales significativos?', legalRef: 'Ley 19.300' },
            { code: 'ISO14001-8.2-001', norm: 'ISO14001', clause: '8.2', requirement: 'Preparación emergencias ambientales', verificationQ: '¿Existe plan de emergencia ambiental?', legalRef: 'Ley 19.300' },
            // ISO 45001 - SST
            { code: 'ISO45001-4.1-001', norm: 'ISO45001', clause: '4.1', requirement: 'Contexto de la organización', verificationQ: '¿Se determinaron cuestiones pertinentes al SGSST?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-5.1-001', norm: 'ISO45001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección asume responsabilidad en SST?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-6.1.2-001', norm: 'ISO45001', clause: '6.1.2', requirement: 'Identificación de peligros', verificationQ: '¿Existe proceso para identificar peligros y riesgos?', legalRef: 'DS 44 Art. 7' },
            { code: 'ISO45001-8.2-001', norm: 'ISO45001', clause: '8.2', requirement: 'Emergencias', verificationQ: '¿Existen procesos para responder ante emergencias?', legalRef: 'DS 44 Art. 19' },
            { code: 'ISO45001-10.2-001', norm: 'ISO45001', clause: '10.2', requirement: 'Incidentes y acciones correctivas', verificationQ: '¿Se investigan incidentes y acciones correctivas?', legalRef: 'DS 44 Art. 71' },
        ];

        // Use raw SQL to avoid prepared statement issues
        await prisma.$executeRaw`DELETE FROM "ChecklistItem"`;

        let createdCount = 0;
        for (const item of checklistItems) {
            const legalRefValue = item.legalRef || '';
            await prisma.$executeRaw`
                INSERT INTO "ChecklistItem" (id, code, norm, clause, requirement, "verificationQ", "legalRef", "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), ${item.code}, ${item.norm}, ${item.clause}, ${item.requirement}, ${item.verificationQ}, ${legalRefValue}, NOW(), NOW())
            `;
            createdCount++;
        }

        await prisma.$disconnect();

        res.json({
            success: true,
            message: `✅ Seeded ${createdCount} checklist items (DS44 + ISO) - DS40 DEROGADO`,
            count: createdCount,
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
