/**
 * Audits Controller
 * CRUD operations for audits
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createAuditSchema = z.object({
    companyId: z.string().cuid(),
    auditorId: z.string().cuid(),
    type: z.enum(['INTERNAL', 'EXTERNAL', 'SURVEILLANCE', 'CERTIFICATION']),
    norms: z.array(z.enum(['ISO9001', 'ISO45001', 'ISO14001'])).min(1),
    scheduledAt: z.string().datetime(),
});

const updateAuditSchema = z.object({
    status: z.enum(['DRAFT', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'CANCELLED']).optional(),
    completedAt: z.string().datetime().optional(),
    signature: z.string().optional(),
});

/**
 * GET /api/audits
 * List all audits with filters
 */
export async function listAudits(req: Request, res: Response) {
    try {
        const { companyId, status, norm, page = '1', limit = '10' } = req.query;

        const where: Record<string, unknown> = {};
        if (companyId) where.companyId = companyId;
        if (status) where.status = status;
        if (norm) where.norms = { has: norm as string };

        const audits = await prisma.audit.findMany({
            where,
            include: {
                company: { select: { name: true } },
                auditor: { select: { name: true, email: true } },
                _count: { select: { findings: true } },
            },
            orderBy: { scheduledAt: 'desc' },
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
        });

        const total = await prisma.audit.count({ where });

        res.json({
            data: audits,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('[AUDITS] List error:', error);
        res.status(500).json({ error: 'Failed to list audits' });
    }
}

/**
 * GET /api/audits/:id
 * Get audit by ID with full details
 */
export async function getAudit(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const audit = await prisma.audit.findUnique({
            where: { id },
            include: {
                company: true,
                auditor: true,
                findings: {
                    include: {
                        checklistItem: true,
                        nonConformity: {
                            include: { capaActions: true },
                        },
                    },
                },
                analysis: true,
            },
        });

        if (!audit) {
            return res.status(404).json({ error: 'Audit not found' });
        }

        res.json(audit);
    } catch (error) {
        console.error('[AUDITS] Get error:', error);
        res.status(500).json({ error: 'Failed to get audit' });
    }
}

/**
 * POST /api/audits
 * Create new audit
 */
export async function createAudit(req: Request, res: Response) {
    try {
        const validation = createAuditSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors
            });
        }

        const { companyId, auditorId, type, norms, scheduledAt } = validation.data;

        // Generate audit code
        const year = new Date().getFullYear();
        const count = await prisma.audit.count({
            where: {
                code: { startsWith: `AUD-${year}` },
            },
        });
        const code = `AUD-${year}-${String(count + 1).padStart(3, '0')}`;

        const audit = await prisma.audit.create({
            data: {
                code,
                companyId,
                auditorId,
                type,
                norms,
                scheduledAt: new Date(scheduledAt),
            },
            include: {
                company: { select: { name: true } },
                auditor: { select: { name: true } },
            },
        });

        res.status(201).json(audit);
    } catch (error) {
        console.error('[AUDITS] Create error:', error);
        res.status(500).json({ error: 'Failed to create audit' });
    }
}

/**
 * PATCH /api/audits/:id
 * Update audit status
 */
export async function updateAudit(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const validation = updateAuditSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors
            });
        }

        const audit = await prisma.audit.update({
            where: { id },
            data: {
                ...validation.data,
                completedAt: validation.data.completedAt
                    ? new Date(validation.data.completedAt)
                    : undefined,
            },
        });

        res.json(audit);
    } catch (error) {
        console.error('[AUDITS] Update error:', error);
        res.status(500).json({ error: 'Failed to update audit' });
    }
}

/**
 * DELETE /api/audits/:id
 * Delete audit (soft delete recommended in production)
 */
export async function deleteAudit(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await prisma.audit.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        console.error('[AUDITS] Delete error:', error);
        res.status(500).json({ error: 'Failed to delete audit' });
    }
}

/**
 * POST /api/audits/:id/complete
 * Mark audit as completed and trigger analysis
 */
export async function completeAudit(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { signature } = req.body;

        const audit = await prisma.audit.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                signature,
            },
            include: {
                company: { select: { name: true } },
                auditor: { select: { name: true, email: true } },
                findings: {
                    include: {
                        checklistItem: true,
                        nonConformity: true,
                    },
                },
            },
        });

        // TODO: Trigger LLM analysis
        // TODO: Generate PDF report
        // TODO: Send webhook notification

        res.json({
            message: 'Audit completed successfully',
            audit,
        });
    } catch (error) {
        console.error('[AUDITS] Complete error:', error);
        res.status(500).json({ error: 'Failed to complete audit' });
    }
}
