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

        // DS44 + ISO Checklist Items (DS40 DEROGADO por DS44)
        const checklistItems = [
            // ===========================================
            // TÍTULO I - DISPOSICIONES GENERALES (Art. 1-6)
            // ===========================================
            { code: 'DS44-ART4-001', norm: 'ISO45001', clause: 'DS44-Art.4', requirement: 'Obligaciones de la entidad empleadora', verificationQ: '¿La entidad empleadora gestiona preventivamente los riesgos laborales conforme al Art. 184 del Código del Trabajo?', legalRef: 'DS 44 Art. 4, Ley 16.744' },
            { code: 'DS44-ART5-001', norm: 'ISO45001', clause: 'DS44-Art.5', requirement: 'Obligaciones de las personas trabajadoras', verificationQ: '¿Las personas trabajadoras cumplen con las normas de prevención establecidas?', legalRef: 'DS 44 Art. 5' },

            // ===========================================
            // TÍTULO II - GESTIÓN PREVENTIVA (Art. 7-20)
            // ===========================================
            // Párrafo 1: Matriz IPER
            { code: 'DS44-ART7-001', norm: 'ISO45001', clause: 'DS44-Art.7', requirement: 'Matriz de identificación de peligros y evaluación de riesgos (IPER)', verificationQ: '¿Existe una Matriz IPER actualizada que contemple todos los peligros y riesgos laborales?', legalRef: 'DS 44 Art. 7' },

            // Párrafo 2: Programa de trabajo preventivo
            { code: 'DS44-ART8-001', norm: 'ISO45001', clause: 'DS44-Art.8', requirement: 'Programa de trabajo preventivo', verificationQ: '¿Existe un programa de trabajo preventivo con objetivos, plazos y responsables?', legalRef: 'DS 44 Art. 8' },
            { code: 'DS44-ART9-001', norm: 'ISO45001', clause: 'DS44-Art.9', requirement: 'Prelación de medidas preventivas', verificationQ: '¿Se aplica la jerarquía de controles: eliminar, sustituir, controles ingeniería, administrativos, EPP?', legalRef: 'DS 44 Art. 9' },
            { code: 'DS44-ART10-001', norm: 'ISO45001', clause: 'DS44-Art.10', requirement: 'Gestión de máquinas, equipos y elementos de trabajo', verificationQ: '¿Los equipos y máquinas cuentan con medidas de seguridad adecuadas?', legalRef: 'DS 44 Art. 10' },
            { code: 'DS44-ART11-001', norm: 'ISO45001', clause: 'DS44-Art.11', requirement: 'Protección de trabajadores especialmente sensibles', verificationQ: '¿Se protege a trabajadores con condiciones especiales (embarazo, discapacidad, etc.)?', legalRef: 'DS 44 Art. 11' },
            { code: 'DS44-ART12-001', norm: 'ISO45001', clause: 'DS44-Art.12', requirement: 'Protección colectiva', verificationQ: '¿Se priorizan las medidas de protección colectiva sobre las individuales?', legalRef: 'DS 44 Art. 12' },
            { code: 'DS44-ART13-001', norm: 'ISO45001', clause: 'DS44-Art.13', requirement: 'Uso de EPP', verificationQ: '¿Se entregan EPP certificados y sin costo a los trabajadores cuando corresponde?', legalRef: 'DS 44 Art. 13' },

            // Párrafo 3: Evaluación del programa
            { code: 'DS44-ART14-001', norm: 'ISO45001', clause: 'DS44-Art.14', requirement: 'Evaluación del programa preventivo', verificationQ: '¿Se evalúa periódicamente el cumplimiento del programa de trabajo preventivo?', legalRef: 'DS 44 Art. 14' },

            // Párrafo 4: Información y capacitación
            { code: 'DS44-ART15-001', norm: 'ISO45001', clause: 'DS44-Art.15', requirement: 'Información de riesgos laborales (ODI)', verificationQ: '¿Se informa a cada trabajador sobre los riesgos de su puesto, medidas preventivas y métodos de trabajo correctos?', legalRef: 'DS 44 Art. 15' },
            { code: 'DS44-ART16-001', norm: 'ISO45001', clause: 'DS44-Art.16', requirement: 'Capacitación en prevención de riesgos', verificationQ: '¿Se capacita a los trabajadores en materias de prevención de riesgos?', legalRef: 'DS 44 Art. 16' },

            // Párrafo 5: Consulta y participación
            { code: 'DS44-ART17-001', norm: 'ISO45001', clause: 'DS44-Art.17', requirement: 'Consulta y participación de trabajadores', verificationQ: '¿Existen mecanismos de consulta y participación para los representantes de los trabajadores?', legalRef: 'DS 44 Art. 17' },

            // Párrafo 6: Emergencias
            { code: 'DS44-ART18-001', norm: 'ISO45001', clause: 'DS44-Art.18', requirement: 'Riesgo grave e inminente', verificationQ: '¿Existe protocolo para situaciones de riesgo grave e inminente?', legalRef: 'DS 44 Art. 18' },
            { code: 'DS44-ART19-001', norm: 'ISO45001', clause: 'DS44-Art.19', requirement: 'Plan de emergencias', verificationQ: '¿Existe plan de gestión, reducción y respuesta de riesgos para emergencias?', legalRef: 'DS 44 Art. 19' },

            // Párrafo 7: Coordinación
            { code: 'DS44-ART20-001', norm: 'ISO45001', clause: 'DS44-Art.20', requirement: 'Coordinación de actividad preventiva', verificationQ: '¿Existe coordinación preventiva cuando hay múltiples empresas en un lugar de trabajo?', legalRef: 'DS 44 Art. 20' },

            // ===========================================
            // TÍTULO III - ORGANIZACIÓN PREVENTIVA (Art. 21-63)
            // ===========================================
            // Párrafo 2: Sistema de gestión
            { code: 'DS44-ART22-001', norm: 'ISO45001', clause: 'DS44-Art.22', requirement: 'Elementos del Sistema de Gestión SST', verificationQ: '¿Existe un Sistema de Gestión de SST con los elementos requeridos?', legalRef: 'DS 44 Art. 22' },

            // Párrafo 3: Comité Paritario
            { code: 'DS44-ART23-001', norm: 'ISO45001', clause: 'DS44-Art.23', requirement: 'Exigibilidad del CPHS', verificationQ: '¿Se ha constituido el Comité Paritario de Higiene y Seguridad donde corresponde (25+ trabajadores)?', legalRef: 'DS 44 Art. 23, Ley 16.744 Art. 66' },
            { code: 'DS44-ART47-001', norm: 'ISO45001', clause: 'DS44-Art.47', requirement: 'Funciones del CPHS', verificationQ: '¿El CPHS cumple sus funciones de vigilancia, investigación y promoción de la prevención?', legalRef: 'DS 44 Art. 47' },

            // Párrafo 4: Departamento de Prevención
            { code: 'DS44-ART50-001', norm: 'ISO45001', clause: 'DS44-Art.50', requirement: 'Exigibilidad Departamento de Prevención', verificationQ: '¿Existe Departamento de Prevención donde corresponde (100+ trabajadores actividades peligrosas)?', legalRef: 'DS 44 Art. 50' },
            { code: 'DS44-ART52-001', norm: 'ISO45001', clause: 'DS44-Art.52', requirement: 'Funciones del Departamento de Prevención', verificationQ: '¿El Departamento cumple con reconocer, evaluar y controlar riesgos?', legalRef: 'DS 44 Art. 52' },
            { code: 'DS44-ART53-001', norm: 'ISO45001', clause: 'DS44-Art.53', requirement: 'Categoría del experto en prevención', verificationQ: '¿El experto en prevención tiene la categoría adecuada según el riesgo de la empresa?', legalRef: 'DS 44 Art. 53' },

            // Párrafo 5: Reglamento Interno
            { code: 'DS44-ART56-001', norm: 'ISO45001', clause: 'DS44-Art.56', requirement: 'Reglamento Interno de Orden, Higiene y Seguridad', verificationQ: '¿Existe Reglamento Interno de Orden, Higiene y Seguridad?', legalRef: 'DS 44 Art. 56' },
            { code: 'DS44-ART58-001', norm: 'ISO45001', clause: 'DS44-Art.58', requirement: 'Contenido del Reglamento Interno', verificationQ: '¿El Reglamento Interno contiene todas las materias requeridas?', legalRef: 'DS 44 Art. 58' },

            // Párrafo 6: Mapas de riesgo
            { code: 'DS44-ART62-001', norm: 'ISO45001', clause: 'DS44-Art.62', requirement: 'Mapas de riesgo', verificationQ: '¿Existen mapas de riesgo visibles en los lugares de trabajo?', legalRef: 'DS 44 Art. 62' },

            // ===========================================
            // TÍTULO IV - PYMES (Art. 64-66)
            // ===========================================
            { code: 'DS44-ART64-001', norm: 'ISO45001', clause: 'DS44-Art.64', requirement: 'Sistema de Gestión PYMES (hasta 25 trabajadores)', verificationQ: '¿Las empresas pequeñas tienen sistema de gestión simplificado?', legalRef: 'DS 44 Art. 64' },
            { code: 'DS44-ART65-001', norm: 'ISO45001', clause: 'DS44-Art.65', requirement: 'Encargado de prevención (10-25 trabajadores)', verificationQ: '¿Existe encargado de prevención capacitado en empresas de 10-25 trabajadores?', legalRef: 'DS 44 Art. 65' },
            { code: 'DS44-ART66-001', norm: 'ISO45001', clause: 'DS44-Art.66', requirement: 'Delegado de SST (menos de 25 trabajadores)', verificationQ: '¿Existe Delegado de Seguridad y Salud en el Trabajo en empresas sin CPHS?', legalRef: 'DS 44 Art. 66' },

            // ===========================================
            // TÍTULO V - VIGILANCIA Y REGISTROS (Art. 67-75)
            // ===========================================
            { code: 'DS44-ART67-001', norm: 'ISO45001', clause: 'DS44-Art.67', requirement: 'Vigilancia del ambiente y salud', verificationQ: '¿Se realiza vigilancia del ambiente de trabajo y salud de los trabajadores?', legalRef: 'DS 44 Art. 67' },
            { code: 'DS44-ART71-001', norm: 'ISO45001', clause: 'DS44-Art.71', requirement: 'Investigación de siniestros laborales', verificationQ: '¿Se investigan los accidentes y enfermedades profesionales para determinar causas?', legalRef: 'DS 44 Art. 71' },
            { code: 'DS44-ART72-001', norm: 'ISO45001', clause: 'DS44-Art.72', requirement: 'Registro documental de la actividad preventiva', verificationQ: '¿Se mantienen registros de la actividad preventiva por al menos 5 años?', legalRef: 'DS 44 Art. 72' },
            { code: 'DS44-ART73-001', norm: 'ISO45001', clause: 'DS44-Art.73', requirement: 'Estadísticas de seguridad y salud', verificationQ: '¿Se llevan estadísticas de accidentabilidad (IF, IG, tasa de accidentabilidad)?', legalRef: 'DS 44 Art. 73' },

            // ===========================================
            // ISO 9001 - CALIDAD
            // ===========================================
            { code: 'ISO9001-4.1-001', norm: 'ISO9001', clause: '4.1', requirement: 'Contexto de la organización', verificationQ: '¿Se han determinado cuestiones externas e internas pertinentes al SGC?', legalRef: null },
            { code: 'ISO9001-5.2-001', norm: 'ISO9001', clause: '5.2', requirement: 'Política de calidad', verificationQ: '¿La política de calidad está documentada, comunicada y disponible?', legalRef: null },
            { code: 'ISO9001-6.1-001', norm: 'ISO9001', clause: '6.1', requirement: 'Acciones para abordar riesgos y oportunidades', verificationQ: '¿Se han determinado riesgos y oportunidades que afectan al SGC?', legalRef: null },
            { code: 'ISO9001-8.1-001', norm: 'ISO9001', clause: '8.1', requirement: 'Planificación y control operacional', verificationQ: '¿Se han planificado y controlado los procesos operacionales?', legalRef: null },
            { code: 'ISO9001-9.2-001', norm: 'ISO9001', clause: '9.2', requirement: 'Auditoría interna', verificationQ: '¿Se realizan auditorías internas a intervalos planificados?', legalRef: null },
            { code: 'ISO9001-10.2-001', norm: 'ISO9001', clause: '10.2', requirement: 'No conformidad y acción correctiva', verificationQ: '¿Existe proceso para gestionar no conformidades y acciones correctivas?', legalRef: null },

            // ===========================================
            // ISO 14001 - MEDIO AMBIENTE
            // ===========================================
            { code: 'ISO14001-4.1-001', norm: 'ISO14001', clause: '4.1', requirement: 'Contexto de la organización', verificationQ: '¿Se han determinado cuestiones externas e internas pertinentes al SGA?', legalRef: 'Ley 19.300' },
            { code: 'ISO14001-6.1.2-001', norm: 'ISO14001', clause: '6.1.2', requirement: 'Aspectos ambientales', verificationQ: '¿Se han identificado los aspectos ambientales significativos?', legalRef: 'Ley 19.300 Art. 10' },
            { code: 'ISO14001-6.1.3-001', norm: 'ISO14001', clause: '6.1.3', requirement: 'Requisitos legales ambientales', verificationQ: '¿Se han identificado los requisitos legales ambientales aplicables?', legalRef: 'Ley 19.300' },
            { code: 'ISO14001-8.1-001', norm: 'ISO14001', clause: '8.1', requirement: 'Planificación y control operacional ambiental', verificationQ: '¿Se han establecido controles para los aspectos ambientales significativos?', legalRef: 'DS 594' },
            { code: 'ISO14001-8.2-001', norm: 'ISO14001', clause: '8.2', requirement: 'Preparación y respuesta de emergencias ambientales', verificationQ: '¿Existe plan de respuesta ante emergencias ambientales?', legalRef: 'Ley 19.300' },

            // ===========================================
            // ISO 45001 - SST (relacionados con DS44)
            // ===========================================
            { code: 'ISO45001-4.1-001', norm: 'ISO45001', clause: '4.1', requirement: 'Comprensión de la organización y su contexto', verificationQ: '¿Se han determinado las cuestiones externas e internas pertinentes para el SGSST?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-5.1-001', norm: 'ISO45001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección demuestra liderazgo asumiendo responsabilidad en SST?', legalRef: 'Ley 16.744 Art. 184' },
            { code: 'ISO45001-5.4-001', norm: 'ISO45001', clause: '5.4', requirement: 'Consulta y participación de los trabajadores', verificationQ: '¿Existen procesos para la consulta y participación de los trabajadores?', legalRef: 'DS 44 Art. 17' },
            { code: 'ISO45001-6.1.2-001', norm: 'ISO45001', clause: '6.1.2', requirement: 'Identificación de peligros y evaluación de riesgos', verificationQ: '¿Existe proceso proactivo para identificar peligros y evaluar riesgos?', legalRef: 'DS 44 Art. 7' },
            { code: 'ISO45001-8.1.2-001', norm: 'ISO45001', clause: '8.1.2', requirement: 'Eliminar peligros y reducir riesgos', verificationQ: '¿Se aplica la jerarquía de controles para eliminar peligros y reducir riesgos?', legalRef: 'DS 44 Art. 9' },
            { code: 'ISO45001-8.2-001', norm: 'ISO45001', clause: '8.2', requirement: 'Preparación y respuesta ante emergencias', verificationQ: '¿Existen procesos para prepararse y responder ante emergencias?', legalRef: 'DS 44 Art. 19' },
            { code: 'ISO45001-9.1.2-001', norm: 'ISO45001', clause: '9.1.2', requirement: 'Evaluación del cumplimiento legal', verificationQ: '¿Se evalúa el cumplimiento de los requisitos legales en SST?', legalRef: 'DS 44 Art. 14' },
            { code: 'ISO45001-10.2-001', norm: 'ISO45001', clause: '10.2', requirement: 'Incidentes, no conformidades y acciones correctivas', verificationQ: '¿Se investigan incidentes y se determinan acciones correctivas?', legalRef: 'DS 44 Art. 71' },
        ];

        // Delete all existing and create new (avoid prepared statement conflicts)
        await prisma.checklistItem.deleteMany({});
        await prisma.checklistItem.createMany({
            data: checklistItems as any[],
        });

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
