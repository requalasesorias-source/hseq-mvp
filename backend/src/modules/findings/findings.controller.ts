/**
 * Findings Controller
 * Hallazgos de auditoría
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createFindingSchema = z.object({
    auditId: z.string().cuid(),
    checklistItemId: z.string().cuid(),
    compliant: z.boolean(),
    comment: z.string().optional(),
    evidence: z.array(z.string().url()).optional(),
});

const bulkFindingsSchema = z.object({
    auditId: z.string().cuid(),
    findings: z.array(z.object({
        checklistItemId: z.string().cuid(),
        compliant: z.boolean(),
        comment: z.string().optional(),
    })),
});

/**
 * GET /api/findings
 * List findings by audit
 */
export async function listFindings(req: Request, res: Response) {
    try {
        const { auditId, compliant } = req.query;

        const where: Record<string, unknown> = {};
        if (auditId) where.auditId = auditId;
        if (compliant !== undefined) where.compliant = compliant === 'true';

        const findings = await prisma.finding.findMany({
            where,
            include: {
                checklistItem: true,
                nonConformity: {
                    select: { id: true, code: true, severity: true, status: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(findings);
    } catch (error) {
        console.error('[FINDINGS] List error:', error);
        res.status(500).json({ error: 'Failed to list findings' });
    }
}

/**
 * POST /api/findings
 * Create single finding
 */
export async function createFinding(req: Request, res: Response) {
    try {
        const validation = createFindingSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const finding = await prisma.finding.create({
            data: validation.data,
            include: { checklistItem: true },
        });

        res.status(201).json(finding);
    } catch (error) {
        console.error('[FINDINGS] Create error:', error);
        res.status(500).json({ error: 'Failed to create finding' });
    }
}

/**
 * POST /api/findings/bulk
 * Create multiple findings at once
 */
export async function createBulkFindings(req: Request, res: Response) {
    try {
        const validation = bulkFindingsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const { auditId, findings } = validation.data;

        const result = await prisma.finding.createMany({
            data: findings.map((f) => ({
                auditId,
                checklistItemId: f.checklistItemId,
                compliant: f.compliant,
                comment: f.comment,
            })),
        });

        // Update audit status
        await prisma.audit.update({
            where: { id: auditId },
            data: { status: 'IN_PROGRESS' },
        });

        res.status(201).json({
            message: `Created ${result.count} findings`,
            count: result.count,
        });
    } catch (error) {
        console.error('[FINDINGS] Bulk create error:', error);
        res.status(500).json({ error: 'Failed to create findings' });
    }
}

/**
 * PATCH /api/findings/:id
 * Update finding
 */
export async function updateFinding(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { compliant, comment, evidence } = req.body;

        const finding = await prisma.finding.update({
            where: { id },
            data: { compliant, comment, evidence },
            include: { checklistItem: true },
        });

        res.json(finding);
    } catch (error) {
        console.error('[FINDINGS] Update error:', error);
        res.status(500).json({ error: 'Failed to update finding' });
    }
}

/**
 * DELETE /api/findings/:id
 */
export async function deleteFinding(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await prisma.finding.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error('[FINDINGS] Delete error:', error);
        res.status(500).json({ error: 'Failed to delete finding' });
    }
}

/**
 * GET /api/findings/summary/:auditId
 * Get findings summary for an audit
 */
export async function getFindingsSummary(req: Request, res: Response) {
    try {
        const { auditId } = req.params;

        const [total, compliant, nonCompliant] = await Promise.all([
            prisma.finding.count({ where: { auditId } }),
            prisma.finding.count({ where: { auditId, compliant: true } }),
            prisma.finding.count({ where: { auditId, compliant: false } }),
        ]);

        const complianceRate = total > 0 ? (compliant / total) * 100 : 0;

        res.json({
            auditId,
            total,
            compliant,
            nonCompliant,
            complianceRate: Math.round(complianceRate * 100) / 100,
        });
    } catch (error) {
        console.error('[FINDINGS] Summary error:', error);
        res.status(500).json({ error: 'Failed to get findings summary' });
    }
}
