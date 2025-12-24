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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
