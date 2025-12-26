
/**
 * Dashboard Controller
 * Aggregated stats for the main dashboard
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardStats(req: Request, res: Response) {
    try {
        // 1. Basic Counters
        const totalAudits = await prisma.audit.count();
        const completedAudits = await prisma.audit.count({ where: { status: 'COMPLETED' } });
        const pendingAudits = await prisma.audit.count({
            where: { status: { in: ['IN_PROGRESS', 'PENDING_REVIEW'] } }
        });

        // 2. Findings Stats (NCs)
        const openNCs = await prisma.nonConformity.count({
            where: { status: { not: 'CLOSED' } }
        });

        const criticalNCsCount = await prisma.nonConformity.count({
            where: { status: { not: 'CLOSED' }, severity: 'CRITICAL' }
        });

        // 3. Calculate Global Compliance Rate
        // Get all findings that are either compliant or non-compliant (ignore skipped/null)
        const allFindings = await prisma.finding.findMany({
            where: {
                OR: [
                    { compliant: true },
                    { compliant: false }
                ]
            },
            select: { compliant: true }
        });

        let complianceRate = 0;
        if (allFindings.length > 0) {
            const compliantCount = allFindings.filter(f => f.compliant === true).length;
            complianceRate = Math.round((compliantCount / allFindings.length) * 100);
        }

        // 4. Recent Audits
        const recentAudits = await prisma.audit.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
            include: {
                company: { select: { name: true } },
                _count: {
                    select: {
                        findings: true,
                    }
                }
            }
        });

        // Get NCs count per audit manualy or via raw query if performant, 
        // but for MVP doing a quick map is fine or include it above.
        // Let's enhance recentAudits with NC counts
        const recentAuditsWithStats = await Promise.all(recentAudits.map(async (audit) => {
            const ncCount = await prisma.nonConformity.count({
                where: { finding: { auditId: audit.id } }
            });
            return {
                ...audit,
                ncsCount: ncCount
            };
        }));

        // 5. Critical NCs for the list
        const criticalNCs = await prisma.nonConformity.findMany({
            where: {
                severity: 'CRITICAL',
                status: { not: 'CLOSED' }
            },
            take: 5,
            include: {
                finding: {
                    include: {
                        audit: {
                            include: { company: true }
                        },
                        checklistItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 6. Additional Chart Data: Compliance per Norm
        const findingsWithNorm = await prisma.finding.findMany({
            where: {
                OR: [
                    { compliant: true },
                    { compliant: false }
                ]
            },
            include: { checklistItem: { select: { norm: true } } }
        });

        const normStats: Record<string, { total: number, compliant: number }> = {};

        findingsWithNorm.forEach(f => {
            // @ts-ignore - checklistItem is included above but TS might complain if type is not perfectly inferred
            const norm = f.checklistItem.norm;
            if (!normStats[norm]) normStats[norm] = { total: 0, compliant: 0 };

            normStats[norm].total++;
            if (f.compliant) normStats[norm].compliant++;
        });

        const complianceByNorm = Object.entries(normStats).map(([norm, stats]) => ({
            norm,
            rate: Math.round((stats.compliant / stats.total) * 100)
        }));


        res.json({
            stats: {
                totalAudits,
                pendingAudits,
                openNCs,
                criticalNCs: criticalNCsCount,
                complianceRate,
                completedThisMonth: completedAudits // Simplified for MVP
            },
            recentAudits: recentAuditsWithStats.map(a => ({
                id: a.id,
                code: a.code,
                company: a.company.name,
                norms: a.norms,
                status: a.status,
                date: a.scheduledAt,
                findings: a._count.findings,
                ncsCount: a.ncsCount
            })),
            criticalNCs: criticalNCs.map(nc => ({
                id: nc.id,
                code: nc.id.substring(0, 8).toUpperCase(), // Mock code if ID is UUID
                description: nc.finding.comment || 'Sin descripción',
                severity: nc.severity,
                company: nc.finding.audit.company.name,
                dueDate: nc.dueDate,
                legalRef: nc.finding.checklistItem.legalRef || 'N/A'
            })),
            charts: {
                complianceByNorm
            }
        });

    } catch (error) {
        console.error('[DASHBOARD] Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
