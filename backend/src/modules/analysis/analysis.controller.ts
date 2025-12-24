/**
 * Analysis Controller
 * LLM analysis of audit findings
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { analyzeFindings, AnalysisResult } from '../../services/gemini.service.js';
import { getLegalContext } from '../../services/pinecone.service.js';
import { notifyAuditCompleted } from '../../services/make.service.js';

const prisma = new PrismaClient();

const analyzeAuditSchema = z.object({
    auditId: z.string().cuid(),
});

/**
 * POST /api/analysis
 * Analyze audit findings with LLM + RAG
 */
export async function analyzeAudit(req: Request, res: Response) {
    try {
        const validation = analyzeAuditSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const { auditId } = validation.data;

        // Get audit with findings
        const audit = await prisma.audit.findUnique({
            where: { id: auditId },
            include: {
                company: true,
                auditor: true,
                findings: {
                    include: { checklistItem: true },
                },
            },
        });

        if (!audit) {
            return res.status(404).json({ error: 'Audit not found' });
        }

        // Get non-compliant findings
        const nonCompliantFindings = audit.findings.filter((f) => !f.compliant);

        if (nonCompliantFindings.length === 0) {
            // All compliant - create simple analysis
            const analysis = await prisma.analysis.create({
                data: {
                    auditId,
                    summary: 'Auditoría completada sin hallazgos de no conformidad. Todos los requisitos evaluados cumplen con la normativa aplicable.',
                    riskLevel: 'BAJO',
                    recommendations: [
                        'Mantener las buenas prácticas actuales',
                        'Continuar con el programa de auditorías internas',
                        'Documentar lecciones aprendidas',
                    ],
                    legalFindings: {},
                    rawResponse: {},
                },
            });

            return res.json(analysis);
        }

        // Get RAG context for each finding
        const findingsWithContext = await Promise.all(
            nonCompliantFindings.map(async (f) => {
                const legalContext = await getLegalContext(
                    `${f.checklistItem.requirement} ${f.comment || ''}`
                );
                return {
                    id: f.id,
                    requirement: f.checklistItem.requirement,
                    compliant: f.compliant,
                    comment: f.comment || undefined,
                    legalContext,
                };
            })
        );

        // Analyze with LLM
        const analysisResult: AnalysisResult = await analyzeFindings({
            findings: nonCompliantFindings.map((f) => ({
                id: f.id,
                requirement: f.checklistItem.requirement,
                compliant: f.compliant,
                comment: f.comment || undefined,
            })),
            auditType: audit.type,
            norms: audit.norms,
        });

        // Save analysis
        const analysis = await prisma.analysis.create({
            data: {
                auditId,
                summary: analysisResult.summary,
                riskLevel: analysisResult.riskLevel,
                recommendations: analysisResult.recommendations,
                legalFindings: JSON.parse(JSON.stringify(analysisResult.legalFindings)),
                rawResponse: JSON.parse(JSON.stringify(analysisResult)),
            },
        });

        // Create NCs from analysis
        for (const nc of analysisResult.nonConformities) {
            const year = new Date().getFullYear();
            const count = await prisma.nonConformity.count({
                where: { code: { startsWith: `NC-${year}` } },
            });
            const code = `NC-${year}-${String(count + 1).padStart(3, '0')}`;

            await prisma.nonConformity.create({
                data: {
                    code,
                    findingId: nc.findingId,
                    severity: nc.severity,
                    description: nc.description,
                    legalReference: nc.legalReference,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                },
            });
        }

        // Update audit status
        await prisma.audit.update({
            where: { id: auditId },
            data: { status: 'PENDING_REVIEW' },
        });

        // Send notification
        const criticalCount = analysisResult.nonConformities.filter(
            (nc) => nc.severity === 'CRITICAL'
        ).length;
        const majorCount = analysisResult.nonConformities.filter(
            (nc) => nc.severity === 'MAJOR'
        ).length;
        const minorCount = analysisResult.nonConformities.filter(
            (nc) => nc.severity === 'MINOR'
        ).length;

        await notifyAuditCompleted({
            auditCode: audit.code,
            company: audit.company.name,
            auditor: audit.auditor.name,
            norms: audit.norms,
            totalFindings: audit.findings.length,
            nonConformities: {
                critical: criticalCount,
                major: majorCount,
                minor: minorCount,
            },
            riskLevel: analysisResult.riskLevel,
        });

        res.json({
            analysis,
            nonConformitiesCreated: analysisResult.nonConformities.length,
            findingsWithContext,
        });
    } catch (error) {
        console.error('[ANALYSIS] Error:', error);
        res.status(500).json({ error: 'Failed to analyze audit' });
    }
}

/**
 * GET /api/analysis/:auditId
 * Get analysis for an audit
 */
export async function getAnalysis(req: Request, res: Response) {
    try {
        const { auditId } = req.params;

        const analysis = await prisma.analysis.findUnique({
            where: { auditId },
            include: {
                audit: {
                    include: {
                        company: { select: { name: true } },
                        auditor: { select: { name: true } },
                    },
                },
            },
        });

        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.json(analysis);
    } catch (error) {
        console.error('[ANALYSIS] Get error:', error);
        res.status(500).json({ error: 'Failed to get analysis' });
    }
}

/**
 * POST /api/analysis/test
 * Test LLM analysis without requiring a real audit
 */
export async function testAnalysis(req: Request, res: Response) {
    try {
        const { findings, auditType = 'INTERNAL', norms = ['ISO45001'] } = req.body;

        if (!findings || !Array.isArray(findings) || findings.length === 0) {
            return res.status(400).json({
                error: 'Se requiere un array de findings',
                example: {
                    findings: [
                        { requirement: 'Identificación de peligros', compliant: false, comment: 'No existe matriz de riesgos' },
                        { requirement: 'Uso de EPP', compliant: false, comment: 'Trabajadores sin casco' },
                    ],
                    auditType: 'INTERNAL',
                    norms: ['ISO45001', 'ISO14001'],
                },
            });
        }

        console.log('[ANALYSIS TEST] Starting LLM analysis with Gemini...');
        console.log('[ANALYSIS TEST] Findings:', findings.length);
        console.log('[ANALYSIS TEST] Norms:', norms);

        // Get legal context for findings
        const nonCompliantFindings = findings.filter((f: any) => !f.compliant);

        // Call Gemini for analysis
        const analysisResult = await analyzeFindings({
            findings: findings.map((f: any, idx: number) => ({
                id: `test-${idx}`,
                requirement: f.requirement,
                compliant: f.compliant,
                comment: f.comment,
            })),
            auditType,
            norms,
        });

        console.log('[ANALYSIS TEST] ✅ Gemini analysis completed');
        console.log('[ANALYSIS TEST] Risk Level:', analysisResult.riskLevel);
        console.log('[ANALYSIS TEST] NCs identified:', analysisResult.nonConformities.length);

        res.json({
            success: true,
            message: '¡Análisis con Gemini completado exitosamente!',
            analysis: analysisResult,
            meta: {
                totalFindings: findings.length,
                nonCompliantFindings: nonCompliantFindings.length,
                ncsIdentified: analysisResult.nonConformities.length,
                model: 'gemini-1.5-flash',
            },
        });
    } catch (error) {
        console.error('[ANALYSIS TEST] Error:', error);
        res.status(500).json({
            error: 'Error al analizar con Gemini',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

