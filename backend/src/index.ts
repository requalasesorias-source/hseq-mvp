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

        // Add pgbouncer=true to disable prepared statements (Render free tier uses pgBouncer)
        const dbUrl = process.env.DATABASE_URL || '';
        const urlWithPgBouncer = dbUrl.includes('?')
            ? `${dbUrl}&pgbouncer=true&connection_limit=1`
            : `${dbUrl}?pgbouncer=true&connection_limit=1`;

        const prisma = new PrismaClient({
            datasources: { db: { url: urlWithPgBouncer } },
        });

        console.log('🌱 Running database seed with pgbouncer mode...');

        // DS44 + ISO Checklist Items - Use $queryRawUnsafe with fully inline SQL to avoid pgBouncer prepared statement issues
        const items = [
            // DS44 - TÍTULO I
            ["DS44-ART4-001", "ISO45001", "DS44-Art.4", "Obligaciones entidad empleadora", "¿Gestiona preventivamente los riesgos laborales?", "DS 44 Art. 4"],
            ["DS44-ART5-001", "ISO45001", "DS44-Art.5", "Obligaciones trabajadores", "¿Cumplen las normas de prevención?", "DS 44 Art. 5"],
            // DS44 - TÍTULO II
            ["DS44-ART7-001", "ISO45001", "DS44-Art.7", "Matriz IPER", "¿Existe Matriz IPER actualizada?", "DS 44 Art. 7"],
            ["DS44-ART8-001", "ISO45001", "DS44-Art.8", "Programa preventivo", "¿Existe programa con objetivos y plazos?", "DS 44 Art. 8"],
            ["DS44-ART9-001", "ISO45001", "DS44-Art.9", "Jerarquía de controles", "¿Se aplica la jerarquía de controles?", "DS 44 Art. 9"],
            ["DS44-ART13-001", "ISO45001", "DS44-Art.13", "Uso de EPP", "¿Se entregan EPP sin costo?", "DS 44 Art. 13"],
            ["DS44-ART15-001", "ISO45001", "DS44-Art.15", "ODI", "¿Se informa sobre riesgos?", "DS 44 Art. 15"],
            ["DS44-ART19-001", "ISO45001", "DS44-Art.19", "Plan emergencias", "¿Existe plan de emergencias?", "DS 44 Art. 19"],
            // DS44 - TÍTULO III
            ["DS44-ART22-001", "ISO45001", "DS44-Art.22", "Sistema Gestión SST", "¿Existe un SGSST?", "DS 44 Art. 22"],
            ["DS44-ART23-001", "ISO45001", "DS44-Art.23", "CPHS", "¿Existe CPHS (25+ trabajadores)?", "DS 44 Art. 23"],
            ["DS44-ART50-001", "ISO45001", "DS44-Art.50", "Dept Prevención", "¿Existe Departamento (100+ trabaj)?", "DS 44 Art. 50"],
            ["DS44-ART56-001", "ISO45001", "DS44-Art.56", "RIOHS", "¿Existe Reglamento Interno?", "DS 44 Art. 56"],
            ["DS44-ART62-001", "ISO45001", "DS44-Art.62", "Mapas riesgo", "¿Existen mapas de riesgo?", "DS 44 Art. 62"],
            // DS44 - TÍTULO IV PYMES
            ["DS44-ART66-001", "ISO45001", "DS44-Art.66", "Delegado SST", "¿Existe Delegado SST?", "DS 44 Art. 66"],
            // DS44 - TÍTULO V
            ["DS44-ART71-001", "ISO45001", "DS44-Art.71", "Investigación accidentes", "¿Se investigan accidentes?", "DS 44 Art. 71"],
            ["DS44-ART73-001", "ISO45001", "DS44-Art.73", "Estadísticas", "¿Se llevan estadísticas?", "DS 44 Art. 73"],
            // ISO 9001
            ["ISO9001-4.1-001", "ISO9001", "4.1", "Contexto organización", "¿Se determinó contexto del SGC?", ""],
            ["ISO9001-5.2-001", "ISO9001", "5.2", "Política calidad", "¿Existe política de calidad?", ""],
            ["ISO9001-9.2-001", "ISO9001", "9.2", "Auditoría interna", "¿Se realizan auditorías internas?", ""],
            // ISO 14001
            ["ISO14001-6.1.2-001", "ISO14001", "6.1.2", "Aspectos ambientales", "¿Se identificaron aspectos ambientales?", "Ley 19.300"],
            ["ISO14001-8.2-001", "ISO14001", "8.2", "Emergencias ambientales", "¿Existe plan emergencia ambiental?", "Ley 19.300"],
            // ISO 45001
            ["ISO45001-4.1-001", "ISO45001", "4.1", "Contexto organización", "¿Se determinó contexto del SGSST?", "Ley 16.744"],
            ["ISO45001-5.1-001", "ISO45001", "5.1", "Liderazgo", "¿Alta dirección asume responsabilidad?", "Ley 16.744"],
            ["ISO45001-6.1.2-001", "ISO45001", "6.1.2", "Identificación peligros", "¿Existe proceso para identificar peligros?", "DS 44 Art. 7"],
            ["ISO45001-8.2-001", "ISO45001", "8.2", "Emergencias", "¿Existen procesos de emergencia?", "DS 44 Art. 19"],
            ["ISO45001-10.2-001", "ISO45001", "10.2", "Acciones correctivas", "¿Se investigan incidentes?", "DS 44 Art. 71"],
        ];

        // Delete all existing items
        await prisma.$queryRawUnsafe('DELETE FROM "ChecklistItem"');

        // Build and execute a single INSERT with all values
        const values = items.map(item => {
            const [code, norm, clause, req, verQ, legalRef] = item;
            const escape = (s: string) => s.replace(/'/g, "''");
            return `(gen_random_uuid(), '${escape(code)}', '${escape(norm)}', '${escape(clause)}', '${escape(req)}', '${escape(verQ)}', '${escape(legalRef || '')}', NOW(), NOW())`;
        }).join(',\n');

        const insertSQL = `INSERT INTO "ChecklistItem" (id, code, norm, clause, requirement, "verificationQ", "legalRef", "createdAt", "updatedAt") VALUES ${values}`;
        await prisma.$queryRawUnsafe(insertSQL);

        await prisma.$disconnect();

        res.json({
            success: true,
            message: `✅ Seeded ${items.length} checklist items (DS44 + ISO) - DS40 DEROGADO`,
            count: items.length,
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
