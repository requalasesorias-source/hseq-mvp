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

        // DS44 + ISO Checklist Items - Completo con descripciones explicativas
        const items = [
            // ===========================================
            // DECRETO SUPREMO 44 - TÍTULO I: DISPOSICIONES GENERALES
            // ===========================================
            ["DS44-ART4-001", "ISO45001", "DS44-Art.4", "Obligaciones de la entidad empleadora", "¿La entidad empleadora gestiona preventivamente los riesgos laborales conforme al Art. 184 del Código del Trabajo?", "DS 44 Art. 4, Ley 16.744"],
            ["DS44-ART5-001", "ISO45001", "DS44-Art.5", "Obligaciones de las personas trabajadoras", "¿Las personas trabajadoras cumplen con las normas de prevención establecidas por la entidad empleadora?", "DS 44 Art. 5"],

            // ===========================================
            // DECRETO SUPREMO 44 - TÍTULO II: GESTIÓN PREVENTIVA
            // ===========================================
            // Párrafo 1: Matriz IPER
            ["DS44-ART7-001", "ISO45001", "DS44-Art.7", "Matriz de identificación de peligros y evaluación de riesgos (IPER)", "¿Existe una Matriz IPER actualizada que contemple todos los peligros y riesgos laborales de la organización?", "DS 44 Art. 7"],

            // Párrafo 2: Programa de trabajo preventivo
            ["DS44-ART8-001", "ISO45001", "DS44-Art.8", "Programa de trabajo preventivo", "¿Existe un programa de trabajo preventivo con objetivos, plazos, responsables y recursos asignados?", "DS 44 Art. 8"],
            ["DS44-ART9-001", "ISO45001", "DS44-Art.9", "Prelación de medidas preventivas (Jerarquía de controles)", "¿Se aplica la jerarquía de controles: eliminación, sustitución, controles de ingeniería, controles administrativos y EPP?", "DS 44 Art. 9"],
            ["DS44-ART10-001", "ISO45001", "DS44-Art.10", "Gestión de máquinas, equipos y elementos de trabajo", "¿Los equipos, máquinas y herramientas cuentan con las medidas de seguridad adecuadas y están en buen estado?", "DS 44 Art. 10"],
            ["DS44-ART11-001", "ISO45001", "DS44-Art.11", "Protección de trabajadores especialmente sensibles", "¿Se protege a trabajadores con condiciones especiales (embarazo, discapacidad, menores, adultos mayores)?", "DS 44 Art. 11"],
            ["DS44-ART12-001", "ISO45001", "DS44-Art.12", "Protección colectiva de los riesgos laborales", "¿Se priorizan las medidas de protección colectiva sobre las medidas de protección individual?", "DS 44 Art. 12"],
            ["DS44-ART13-001", "ISO45001", "DS44-Art.13", "Uso de elementos de protección personal (EPP)", "¿Se entregan EPP certificados y sin costo a los trabajadores cuando no se puede eliminar el riesgo?", "DS 44 Art. 13"],

            // Párrafo 3: Evaluación del programa
            ["DS44-ART14-001", "ISO45001", "DS44-Art.14", "Evaluación del cumplimiento del programa de trabajo preventivo", "¿Se evalúa periódicamente el cumplimiento del programa de trabajo preventivo y se documentan los resultados?", "DS 44 Art. 14"],

            // Párrafo 4: Información y capacitación
            ["DS44-ART15-001", "ISO45001", "DS44-Art.15", "Información de los riesgos laborales (Obligación de Informar - ODI)", "¿Se informa a cada trabajador sobre los riesgos de su puesto, medidas preventivas y métodos de trabajo correctos antes de iniciar labores?", "DS 44 Art. 15"],
            ["DS44-ART16-001", "ISO45001", "DS44-Art.16", "Capacitación de las personas trabajadoras en prevención de riesgos", "¿Se capacita a los trabajadores en materias de prevención de riesgos con programas de inducción y formación continua?", "DS 44 Art. 16"],

            // Párrafo 5: Consulta y participación
            ["DS44-ART17-001", "ISO45001", "DS44-Art.17", "Consulta y participación de los representantes de personas trabajadoras", "¿Existen mecanismos de consulta y participación efectiva para los representantes de los trabajadores en materias de SST?", "DS 44 Art. 17"],

            // Párrafo 6: Emergencias
            ["DS44-ART18-001", "ISO45001", "DS44-Art.18", "Situaciones sobrevenidas de riesgo grave e inminente", "¿Existe protocolo documentado para actuar ante situaciones de riesgo grave e inminente?", "DS 44 Art. 18"],
            ["DS44-ART19-001", "ISO45001", "DS44-Art.19", "Plan de gestión, reducción y respuesta de riesgos en caso de emergencia", "¿Existe plan de emergencias para incendio, evacuación, sismos y otras emergencias con procedimientos claros?", "DS 44 Art. 19"],

            // Párrafo 7: Coordinación
            ["DS44-ART20-001", "ISO45001", "DS44-Art.20", "Coordinación de la actividad preventiva", "¿Existe coordinación preventiva cuando hay múltiples empresas o contratistas en un mismo lugar de trabajo?", "DS 44 Art. 20"],

            // ===========================================
            // DECRETO SUPREMO 44 - TÍTULO III: ORGANIZACIÓN Y ESTRUCTURA PREVENTIVA
            // ===========================================
            // Párrafo 2: Sistema de gestión
            ["DS44-ART22-001", "ISO45001", "DS44-Art.22", "Elementos del Sistema de Gestión de Seguridad y Salud en el Trabajo", "¿Existe un Sistema de Gestión de SST implementado con política, objetivos, planificación y control?", "DS 44 Art. 22"],

            // Párrafo 3: Comité Paritario
            ["DS44-ART23-001", "ISO45001", "DS44-Art.23", "Exigibilidad del Comité Paritario de Higiene y Seguridad (CPHS)", "¿Se ha constituido el Comité Paritario de Higiene y Seguridad donde corresponde (empresas con 25 o más trabajadores)?", "DS 44 Art. 23, Ley 16.744 Art. 66"],
            ["DS44-ART47-001", "ISO45001", "DS44-Art.47", "Funciones del Comité Paritario de Higiene y Seguridad", "¿El CPHS cumple sus funciones de vigilancia, investigación de accidentes y promoción de la prevención?", "DS 44 Art. 47"],

            // Párrafo 4: Departamento de Prevención
            ["DS44-ART50-001", "ISO45001", "DS44-Art.50", "Exigibilidad del Departamento de Prevención de Riesgos", "¿Existe Departamento de Prevención de Riesgos donde corresponde (empresas con 100+ trabajadores en actividades peligrosas)?", "DS 44 Art. 50"],
            ["DS44-ART52-001", "ISO45001", "DS44-Art.52", "Funciones del Departamento de Prevención de Riesgos", "¿El Departamento de Prevención cumple con reconocer, evaluar y controlar los riesgos laborales?", "DS 44 Art. 52"],
            ["DS44-ART53-001", "ISO45001", "DS44-Art.53", "Categorías de los expertos en prevención de riesgos", "¿El experto en prevención de riesgos tiene la categoría profesional adecuada según el nivel de riesgo de la empresa?", "DS 44 Art. 53"],

            // Párrafo 5: Reglamento Interno
            ["DS44-ART56-001", "ISO45001", "DS44-Art.56", "Reglamento Interno de Orden, Higiene y Seguridad (RIOHS)", "¿Existe Reglamento Interno de Orden, Higiene y Seguridad aprobado por la autoridad y difundido a los trabajadores?", "DS 44 Art. 56"],
            ["DS44-ART58-001", "ISO45001", "DS44-Art.58", "Contenido del Reglamento Interno", "¿El Reglamento Interno contiene todas las materias requeridas (obligaciones, prohibiciones, sanciones, procedimientos)?", "DS 44 Art. 58"],

            // Párrafo 6: Mapas de riesgo
            ["DS44-ART62-001", "ISO45001", "DS44-Art.62", "Mapas de riesgo", "¿Existen mapas de riesgo visibles en los lugares de trabajo que identifiquen los peligros principales?", "DS 44 Art. 62"],

            // ===========================================
            // DECRETO SUPREMO 44 - TÍTULO IV: SISTEMA DE GESTIÓN PARA PYMES
            // ===========================================
            ["DS44-ART64-001", "ISO45001", "DS44-Art.64", "Sistema de Gestión para entidades empleadoras de hasta 25 trabajadores", "¿Las empresas pequeñas (hasta 25 trabajadores) tienen un sistema de gestión simplificado adaptado a su tamaño?", "DS 44 Art. 64"],
            ["DS44-ART65-001", "ISO45001", "DS44-Art.65", "Encargado de la prevención de riesgos laborales (10-25 trabajadores)", "¿Existe un encargado de prevención capacitado en empresas de 10 a 25 trabajadores?", "DS 44 Art. 65"],
            ["DS44-ART66-001", "ISO45001", "DS44-Art.66", "Delegado de seguridad y salud en el trabajo (menos de 25 trabajadores)", "¿Existe Delegado de Seguridad y Salud en el Trabajo elegido por los trabajadores en empresas sin CPHS?", "DS 44 Art. 66"],

            // ===========================================
            // DECRETO SUPREMO 44 - TÍTULO V: VIGILANCIA Y REGISTROS
            // ===========================================
            ["DS44-ART67-001", "ISO45001", "DS44-Art.67", "Vigilancia del ambiente de trabajo y de la salud de las personas trabajadoras", "¿Se realiza vigilancia del ambiente de trabajo y vigilancia de la salud de los trabajadores según protocolos MINSAL?", "DS 44 Art. 67"],
            ["DS44-ART71-001", "ISO45001", "DS44-Art.71", "Investigación de las causas de los siniestros laborales", "¿Se investigan todos los accidentes del trabajo y enfermedades profesionales para determinar sus causas raíz?", "DS 44 Art. 71"],
            ["DS44-ART72-001", "ISO45001", "DS44-Art.72", "Registro documental de la actividad preventiva", "¿Se mantienen registros documentales de la actividad preventiva por al menos 5 años (capacitaciones, inspecciones, investigaciones)?", "DS 44 Art. 72"],
            ["DS44-ART73-001", "ISO45001", "DS44-Art.73", "Registro y estadísticas de seguridad y salud", "¿Se llevan estadísticas de accidentabilidad (Índice de Frecuencia, Índice de Gravedad, Tasa de Accidentabilidad)?", "DS 44 Art. 73"],

            // ===========================================
            // ISO 9001:2015 - SISTEMA DE GESTIÓN DE LA CALIDAD
            // ===========================================
            ["ISO9001-4.1-001", "ISO9001", "4.1", "Comprensión de la organización y de su contexto", "¿Se han determinado las cuestiones externas e internas pertinentes al propósito y dirección estratégica del SGC?", ""],
            ["ISO9001-4.2-001", "ISO9001", "4.2", "Comprensión de las necesidades y expectativas de las partes interesadas", "¿Se han determinado las partes interesadas relevantes y sus requisitos para el SGC?", ""],
            ["ISO9001-5.1-001", "ISO9001", "5.1", "Liderazgo y compromiso", "¿La alta dirección demuestra liderazgo y compromiso con el SGC?", ""],
            ["ISO9001-5.2-001", "ISO9001", "5.2", "Política de la calidad", "¿La política de calidad está documentada, es apropiada al propósito, está comunicada y disponible?", ""],
            ["ISO9001-6.1-001", "ISO9001", "6.1", "Acciones para abordar riesgos y oportunidades", "¿Se han determinado los riesgos y oportunidades que pueden afectar la conformidad de productos/servicios?", ""],
            ["ISO9001-7.2-001", "ISO9001", "7.2", "Competencia", "¿Se ha determinado la competencia necesaria y se asegura que el personal sea competente?", ""],
            ["ISO9001-8.1-001", "ISO9001", "8.1", "Planificación y control operacional", "¿Se han planificado, implementado y controlado los procesos necesarios para cumplir requisitos?", ""],
            ["ISO9001-8.5-001", "ISO9001", "8.5", "Producción y provisión del servicio", "¿La producción y provisión del servicio se lleva a cabo bajo condiciones controladas?", ""],
            ["ISO9001-9.1-001", "ISO9001", "9.1", "Seguimiento, medición, análisis y evaluación", "¿Se determina qué necesita seguimiento y medición, y se analizan y evalúan los resultados?", ""],
            ["ISO9001-9.2-001", "ISO9001", "9.2", "Auditoría interna", "¿Se realizan auditorías internas a intervalos planificados para verificar la conformidad del SGC?", ""],
            ["ISO9001-9.3-001", "ISO9001", "9.3", "Revisión por la dirección", "¿La alta dirección revisa el SGC a intervalos planificados para asegurar su conveniencia, adecuación y eficacia?", ""],
            ["ISO9001-10.2-001", "ISO9001", "10.2", "No conformidad y acción correctiva", "¿Existe un proceso documentado para gestionar no conformidades y tomar acciones correctivas?", ""],

            // ===========================================
            // ISO 14001:2015 - SISTEMA DE GESTIÓN AMBIENTAL
            // ===========================================
            ["ISO14001-4.1-001", "ISO14001", "4.1", "Comprensión de la organización y de su contexto", "¿Se han determinado las cuestiones externas e internas pertinentes al propósito del SGA?", "Ley 19.300"],
            ["ISO14001-4.2-001", "ISO14001", "4.2", "Comprensión de las necesidades y expectativas de las partes interesadas", "¿Se han determinado las partes interesadas y sus requisitos ambientales pertinentes?", "Ley 19.300"],
            ["ISO14001-5.1-001", "ISO14001", "5.1", "Liderazgo y compromiso", "¿La alta dirección demuestra liderazgo y compromiso con el SGA?", "Ley 19.300"],
            ["ISO14001-5.2-001", "ISO14001", "5.2", "Política ambiental", "¿La política ambiental es apropiada al propósito, incluye compromisos y está documentada?", "Ley 19.300"],
            ["ISO14001-6.1.2-001", "ISO14001", "6.1.2", "Aspectos ambientales", "¿Se han identificado los aspectos ambientales de actividades, productos y servicios que la organización puede controlar?", "Ley 19.300 Art. 10"],
            ["ISO14001-6.1.3-001", "ISO14001", "6.1.3", "Requisitos legales y otros requisitos", "¿Se han identificado y se tiene acceso a los requisitos legales ambientales aplicables?", "Ley 19.300"],
            ["ISO14001-7.2-001", "ISO14001", "7.2", "Competencia", "¿Se ha determinado la competencia necesaria en aspectos ambientales y se asegura que el personal sea competente?", ""],
            ["ISO14001-8.1-001", "ISO14001", "8.1", "Planificación y control operacional", "¿Se han establecido controles operacionales para los aspectos ambientales significativos?", "DS 594"],
            ["ISO14001-8.2-001", "ISO14001", "8.2", "Preparación y respuesta ante emergencias", "¿Existe un plan de preparación y respuesta ante emergencias ambientales potenciales?", "Ley 19.300"],
            ["ISO14001-9.1-001", "ISO14001", "9.1", "Seguimiento, medición, análisis y evaluación", "¿Se realiza seguimiento y medición de las características clave del desempeño ambiental?", ""],
            ["ISO14001-9.2-001", "ISO14001", "9.2", "Auditoría interna", "¿Se realizan auditorías internas del SGA a intervalos planificados?", ""],
            ["ISO14001-10.2-001", "ISO14001", "10.2", "No conformidad y acción correctiva", "¿Existe proceso para gestionar no conformidades ambientales y acciones correctivas?", ""],

            // ===========================================
            // ISO 45001:2018 - SISTEMA DE GESTIÓN DE SST (relacionados con DS44)
            // ===========================================
            ["ISO45001-4.1-001", "ISO45001", "4.1", "Comprensión de la organización y de su contexto", "¿Se han determinado las cuestiones externas e internas pertinentes para el propósito del SGSST?", "Ley 16.744 Art. 184"],
            ["ISO45001-4.2-001", "ISO45001", "4.2", "Comprensión de las necesidades y expectativas de los trabajadores y otras partes interesadas", "¿Se han determinado las partes interesadas y sus requisitos de SST?", "Ley 16.744"],
            ["ISO45001-5.1-001", "ISO45001", "5.1", "Liderazgo y compromiso", "¿La alta dirección demuestra liderazgo asumiendo responsabilidad y rendición de cuentas en SST?", "Ley 16.744 Art. 184"],
            ["ISO45001-5.2-001", "ISO45001", "5.2", "Política de SST", "¿La política de SST incluye compromiso de mejora continua, cumplimiento legal y consulta a trabajadores?", "DS 44 Art. 13-14"],
            ["ISO45001-5.4-001", "ISO45001", "5.4", "Consulta y participación de los trabajadores", "¿Existen procesos para la consulta y participación de los trabajadores en el desarrollo del SGSST?", "DS 44 Art. 17"],
            ["ISO45001-6.1.2-001", "ISO45001", "6.1.2", "Identificación de peligros y evaluación de riesgos y oportunidades", "¿Existe un proceso proactivo y continuo para identificar peligros y evaluar riesgos de SST?", "DS 44 Art. 7"],
            ["ISO45001-8.1.2-001", "ISO45001", "8.1.2", "Eliminar peligros y reducir riesgos para la SST", "¿Se aplica la jerarquía de controles para eliminar peligros y reducir riesgos de SST?", "DS 44 Art. 9"],
            ["ISO45001-8.2-001", "ISO45001", "8.2", "Preparación y respuesta ante emergencias", "¿Existen procesos para prepararse y responder ante situaciones de emergencia potenciales?", "DS 44 Art. 19"],
            ["ISO45001-9.1.2-001", "ISO45001", "9.1.2", "Evaluación del cumplimiento", "¿Se evalúa el cumplimiento de los requisitos legales y otros requisitos de SST?", "DS 44 Art. 14"],
            ["ISO45001-9.2-001", "ISO45001", "9.2", "Auditoría interna", "¿Se realizan auditorías internas del SGSST a intervalos planificados?", ""],
            ["ISO45001-10.2-001", "ISO45001", "10.2", "Incidente, no conformidad y acción correctiva", "¿Se investigan los incidentes, se determinan las causas raíz y se toman acciones correctivas?", "DS 44 Art. 71"],
        ];

        // Delete findings first (foreign key), then checklist items
        await prisma.$queryRawUnsafe('DELETE FROM "Finding"');
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
