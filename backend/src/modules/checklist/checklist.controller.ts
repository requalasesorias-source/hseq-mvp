/**
 * Checklist Controller
 * Gestión de items de verificación trinorma
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createChecklistItemSchema = z.object({
    norm: z.enum(['ISO9001', 'ISO45001', 'ISO14001']),
    clause: z.string(), // "6.1.2"
    requirement: z.string(),
    verificationQ: z.string(),
    legalRef: z.string().optional(),
});

/**
 * GET /api/checklist
 * List checklist items by norm
 */
export async function listChecklistItems(req: Request, res: Response) {
    try {
        const { norm, clause } = req.query;

        const where: Record<string, unknown> = {};
        if (norm) where.norm = norm;
        if (clause) where.clause = { startsWith: clause as string };

        const items = await prisma.checklistItem.findMany({
            where,
            orderBy: [{ norm: 'asc' }, { clause: 'asc' }],
        });

        res.json(items);
    } catch (error) {
        console.error('[CHECKLIST] List error:', error);
        res.status(500).json({ error: 'Failed to list checklist items' });
    }
}

/**
 * GET /api/checklist/trinorma
 * Get complete trinorma checklist grouped by norm
 */
export async function getTrinormaChecklist(req: Request, res: Response) {
    try {
        const items = await prisma.checklistItem.findMany({
            orderBy: [{ norm: 'asc' }, { clause: 'asc' }],
        });

        const grouped = {
            ISO9001: items.filter((i) => i.norm === 'ISO9001'),
            ISO45001: items.filter((i) => i.norm === 'ISO45001'),
            ISO14001: items.filter((i) => i.norm === 'ISO14001'),
        };

        res.json(grouped);
    } catch (error) {
        console.error('[CHECKLIST] Trinorma error:', error);
        res.status(500).json({ error: 'Failed to get trinorma checklist' });
    }
}

/**
 * POST /api/checklist
 * Create checklist item
 */
export async function createChecklistItem(req: Request, res: Response) {
    try {
        const validation = createChecklistItemSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const { norm, clause, requirement, verificationQ, legalRef } = validation.data;

        // Generate code
        const count = await prisma.checklistItem.count({
            where: { norm, clause: { startsWith: clause.split('.')[0] } },
        });
        const code = `${norm}-${clause}-${String(count + 1).padStart(3, '0')}`;

        const item = await prisma.checklistItem.create({
            data: {
                code,
                norm,
                clause,
                requirement,
                verificationQ,
                legalRef,
            },
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('[CHECKLIST] Create error:', error);
        res.status(500).json({ error: 'Failed to create checklist item' });
    }
}

/**
 * POST /api/checklist/seed
 * Seed initial checklist items + Demo Company + Demo User
 */
export async function seedChecklistItems(_req: Request, res: Response) {
    try {
        // 1. Create Demo Company
        const company = await prisma.company.upsert({
            where: { rut: '99.999.999-9' },
            update: {},
            create: {
                name: 'Requal Demo Corp',
                rut: '99.999.999-9',
                industry: 'Minería',
            }
        });

        // 2. Create Demo Auditor
        const auditor = await prisma.user.upsert({
            where: { email: 'demo@requal.cl' },
            update: {},
            create: {
                email: 'demo@requal.cl',
                name: 'Auditor Demo',
                role: 'AUDITOR',
                companyId: company.id
            }
        });

        const seedData = [
            // ISO 45001 - Seguridad y Salud en el Trabajo
            {
                code: 'ISO45001-4.1-001',
                norm: 'ISO45001' as const,
                clause: '4.1',
                requirement: 'Comprensión de la organización y su contexto',
                verificationQ: '¿La organización ha determinado las cuestiones externas e internas pertinentes para su SST?',
                legalRef: 'Ley 16.744 Art. 184',
            },
            {
                code: 'ISO45001-5.1-001',
                norm: 'ISO45001' as const,
                clause: '5.1',
                requirement: 'Liderazgo y compromiso',
                verificationQ: '¿La alta dirección demuestra liderazgo y compromiso con el sistema de gestión SST?',
                legalRef: 'Ley 16.744 Art. 184',
            },
            {
                code: 'ISO45001-6.1.2-001',
                norm: 'ISO45001' as const,
                clause: '6.1.2',
                requirement: 'Identificación de peligros y evaluación de riesgos',
                verificationQ: '¿Existe un proceso continuo de identificación de peligros y evaluación de riesgos?',
                legalRef: 'DS 40 Art. 21',
            },
            {
                code: 'ISO45001-7.2-001',
                norm: 'ISO45001' as const,
                clause: '7.2',
                requirement: 'Competencia del personal',
                verificationQ: '¿El personal tiene la competencia necesaria basada en educación, formación o experiencia?',
                legalRef: 'DS 40 Art. 14',
            },
            {
                code: 'ISO45001-8.1.2-001',
                norm: 'ISO45001' as const,
                clause: '8.1.2',
                requirement: 'Eliminar peligros y reducir riesgos',
                verificationQ: '¿Se aplica la jerarquía de controles para eliminar peligros y reducir riesgos?',
                legalRef: 'Ley 16.744 Art. 68',
            },
            // ISO 14001 - Medio Ambiente
            {
                code: 'ISO14001-6.1.2-001',
                norm: 'ISO14001' as const,
                clause: '6.1.2',
                requirement: 'Aspectos ambientales',
                verificationQ: '¿Se han identificado los aspectos ambientales significativos de las actividades?',
                legalRef: 'Ley 19.300 Art. 10',
            },
            {
                code: 'ISO14001-6.1.3-001',
                norm: 'ISO14001' as const,
                clause: '6.1.3',
                requirement: 'Requisitos legales',
                verificationQ: '¿Se han identificado y se tiene acceso a los requisitos legales ambientales aplicables?',
                legalRef: 'Ley 19.300',
            },
            {
                code: 'ISO14001-8.1-001',
                norm: 'ISO14001' as const,
                clause: '8.1',
                requirement: 'Planificación y control operacional',
                verificationQ: '¿Se han establecido controles operacionales para los aspectos ambientales significativos?',
                legalRef: 'DS 594 Art. 5',
            },
            // ISO 9001 - Calidad
            {
                code: 'ISO9001-7.1.5-001',
                norm: 'ISO9001' as const,
                clause: '7.1.5',
                requirement: 'Recursos de seguimiento y medición',
                verificationQ: '¿Los equipos de medición están calibrados y se mantienen registros?',
                legalRef: null,
            },
            {
                code: 'ISO9001-8.5.1-001',
                norm: 'ISO9001' as const,
                clause: '8.5.1',
                requirement: 'Control de la producción y provisión del servicio',
                verificationQ: '¿Se controlan las condiciones para la producción y provisión del servicio?',
                legalRef: null,
            },
            {
                code: 'ISO9001-10.2-001',
                norm: 'ISO9001' as const,
                clause: '10.2',
                requirement: 'No conformidad y acción correctiva',
                verificationQ: '¿Existe un proceso documentado para gestionar no conformidades?',
                legalRef: null,
            },
        ];

        // Upsert to avoid duplicates
        for (const item of seedData) {
            await prisma.checklistItem.upsert({
                where: { code: item.code },
                update: item,
                create: item,
            });
        }

        res.json({
            message: `Seeded Config & ${seedData.length} items`,
            items: seedData.length,
            demoConfig: {
                companyId: company.id,
                auditorId: auditor.id
            }
        });
    } catch (error) {
        console.error('[CHECKLIST] Seed error:', error);
        res.status(500).json({ error: 'Failed to seed checklist items' });
    }
}

/**
 * GET /api/checklist/demo-config
 * Get IDs for demo usage (public)
 */
export async function getDemoConfig(req: Request, res: Response) {
    try {
        const company = await prisma.company.findFirst({ where: { rut: '99.999.999-9' } });
        const auditor = await prisma.user.findFirst({ where: { email: 'demo@requal.cl' } });

        if (!company || !auditor) {
            return res.status(404).json({ error: 'Demo data not seeded. Run POST /api/checklist/seed first.' });
        }

        res.json({
            companyId: company.id,
            auditorId: auditor.id
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get demo config' });
    }
}
