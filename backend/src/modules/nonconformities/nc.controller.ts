/**
 * Non-Conformities Controller
 * Gestión de NCs con clasificación y CAPA
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { classifyNCSeverity } from '../../services/gemini.service.js';
import { notifyNCCritical } from '../../services/make.service.js';

const prisma = new PrismaClient();

const createNCSchema = z.object({
    findingId: z.string().cuid(),
    description: z.string().min(10),
    rootCause: z.string().optional(),
    legalReference: z.string(), // "Ley16.744 Art.184"
    dueDate: z.string().datetime(),
});

const createCAPASchema = z.object({
    type: z.enum(['CORRECTIVE', 'PREVENTIVE', 'IMPROVEMENT']),
    description: z.string().min(10),
    responsible: z.string(),
    dueDate: z.string().datetime(),
});

/**
 * GET /api/nonconformities
 * List NCs with filters
 */
export async function listNCs(req: Request, res: Response) {
    try {
        const { auditId, severity, status } = req.query;

        const where: Record<string, unknown> = {};
        if (severity) where.severity = severity;
        if (status) where.status = status;
        if (auditId) {
            where.finding = { auditId };
        }

        const ncs = await prisma.nonConformity.findMany({
            where,
            include: {
                finding: {
                    include: {
                        checklistItem: true,
                        audit: { select: { code: true, company: { select: { name: true } } } },
                    },
                },
                capaActions: true,
            },
            orderBy: [
                { severity: 'asc' }, // CRITICAL first
                { dueDate: 'asc' },
            ],
        });

        res.json(ncs);
    } catch (error) {
        console.error('[NC] List error:', error);
        res.status(500).json({ error: 'Failed to list non-conformities' });
    }
}

/**
 * GET /api/nonconformities/:id
 */
export async function getNC(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const nc = await prisma.nonConformity.findUnique({
            where: { id },
            include: {
                finding: {
                    include: {
                        checklistItem: true,
                        audit: {
                            include: {
                                company: true,
                                auditor: true,
                            },
                        },
                    },
                },
                capaActions: true,
            },
        });

        if (!nc) {
            return res.status(404).json({ error: 'Non-conformity not found' });
        }

        res.json(nc);
    } catch (error) {
        console.error('[NC] Get error:', error);
        res.status(500).json({ error: 'Failed to get non-conformity' });
    }
}

/**
 * POST /api/nonconformities
 * Create NC with auto-classification
 */
export async function createNC(req: Request, res: Response) {
    try {
        const validation = createNCSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const { findingId, description, rootCause, legalReference, dueDate } = validation.data;

        // Get finding context
        const finding = await prisma.finding.findUnique({
            where: { id: findingId },
            include: {
                checklistItem: true,
                audit: {
                    include: {
                        company: true,
                        auditor: true,
                    },
                },
            },
        });

        if (!finding) {
            return res.status(404).json({ error: 'Finding not found' });
        }

        // Auto-classify severity using LLM
        const context = `${finding.checklistItem.requirement} - ${finding.comment || ''}`;
        const classification = await classifyNCSeverity(description, context);

        // Generate NC code
        const year = new Date().getFullYear();
        const count = await prisma.nonConformity.count({
            where: { code: { startsWith: `NC-${year}` } },
        });
        const code = `NC-${year}-${String(count + 1).padStart(3, '0')}`;

        const nc = await prisma.nonConformity.create({
            data: {
                code,
                findingId,
                severity: classification.severity,
                description,
                rootCause,
                legalReference,
                dueDate: new Date(dueDate),
            },
            include: {
                finding: {
                    include: {
                        audit: { select: { code: true } },
                    },
                },
            },
        });

        // Notify if CRITICAL
        if (nc.severity === 'CRITICAL') {
            await notifyNCCritical({
                ncCode: nc.code,
                severity: 'CRITICAL',
                description: nc.description,
                legalReference: nc.legalReference,
                auditCode: finding.audit.code,
                company: finding.audit.company.name,
                auditor: {
                    name: finding.audit.auditor.name,
                    email: finding.audit.auditor.email,
                },
                dueDate: nc.dueDate.toISOString(),
                suggestedAction: classification.reason,
            });
        }

        res.status(201).json({
            ...nc,
            classificationReason: classification.reason,
        });
    } catch (error) {
        console.error('[NC] Create error:', error);
        res.status(500).json({ error: 'Failed to create non-conformity' });
    }
}

/**
 * POST /api/nonconformities/:id/capa
 * Add CAPA action to NC
 */
export async function addCAPAAction(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const validation = createCAPASchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const capa = await prisma.cAPAAction.create({
            data: {
                nonConformityId: id,
                ...validation.data,
                dueDate: new Date(validation.data.dueDate),
            },
        });

        // Update NC status
        await prisma.nonConformity.update({
            where: { id },
            data: { status: 'IN_PROGRESS' },
        });

        res.status(201).json(capa);
    } catch (error) {
        console.error('[NC] Add CAPA error:', error);
        res.status(500).json({ error: 'Failed to add CAPA action' });
    }
}

/**
 * PATCH /api/nonconformities/:id/close
 * Close NC after verification
 */
export async function closeNC(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Verify all CAPAs are completed
        const openCAPAs = await prisma.cAPAAction.count({
            where: {
                nonConformityId: id,
                status: { notIn: ['COMPLETED', 'VERIFIED'] },
            },
        });

        if (openCAPAs > 0) {
            return res.status(400).json({
                error: 'Cannot close NC with open CAPA actions',
                openCAPAs,
            });
        }

        const nc = await prisma.nonConformity.update({
            where: { id },
            data: {
                status: 'CLOSED',
                closedAt: new Date(),
            },
        });

        res.json(nc);
    } catch (error) {
        console.error('[NC] Close error:', error);
        res.status(500).json({ error: 'Failed to close non-conformity' });
    }
}

/**
 * GET /api/nonconformities/stats
 * NC statistics dashboard
 */
export async function getNCStats(req: Request, res: Response) {
    try {
        const { companyId } = req.query;

        const whereBase: Record<string, unknown> = {};
        if (companyId) {
            whereBase.finding = { audit: { companyId } };
        }

        const [total, bySeverity, byStatus, overdue] = await Promise.all([
            prisma.nonConformity.count({ where: whereBase }),
            prisma.nonConformity.groupBy({
                by: ['severity'],
                _count: true,
                where: whereBase,
            }),
            prisma.nonConformity.groupBy({
                by: ['status'],
                _count: true,
                where: whereBase,
            }),
            prisma.nonConformity.count({
                where: {
                    ...whereBase,
                    status: { notIn: ['CLOSED'] },
                    dueDate: { lt: new Date() },
                },
            }),
        ]);

        res.json({
            total,
            overdue,
            bySeverity: Object.fromEntries(bySeverity.map((s) => [s.severity, s._count])),
            byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        });
    } catch (error) {
        console.error('[NC] Stats error:', error);
        res.status(500).json({ error: 'Failed to get NC stats' });
    }
}
