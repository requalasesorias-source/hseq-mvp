/**
 * Make.com Webhook Service
 * Notificaciones automáticas para NCs críticas
 */

export interface WebhookPayload {
    event: 'NC_CRITICAL' | 'AUDIT_COMPLETED' | 'CAPA_OVERDUE';
    data: Record<string, unknown>;
    timestamp: string;
}

export interface NCCriticalPayload {
    ncCode: string;
    severity: 'CRITICAL';
    description: string;
    legalReference: string;
    auditCode: string;
    company: string;
    auditor: {
        name: string;
        email: string;
        phone?: string;
    };
    dueDate: string;
    suggestedAction: string;
}

export interface AuditCompletedPayload {
    auditCode: string;
    company: string;
    auditor: string;
    norms: string[];
    totalFindings: number;
    nonConformities: {
        critical: number;
        major: number;
        minor: number;
    };
    riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
    pdfUrl?: string;
}

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

/**
 * Enviar webhook a Make.com
 */
async function sendWebhook(payload: WebhookPayload): Promise<boolean> {
    if (!MAKE_WEBHOOK_URL) {
        console.warn('[MAKE] Webhook URL not configured, skipping notification');
        return false;
    }

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('[MAKE] Webhook failed:', response.status, response.statusText);
            return false;
        }

        console.log(`[MAKE] Webhook sent successfully: ${payload.event}`);
        return true;
    } catch (error) {
        console.error('[MAKE] Webhook error:', error);
        return false;
    }
}

/**
 * Notificar NC Crítica
 * Dispara: WhatsApp al auditor + Email al gerente
 */
export async function notifyNCCritical(data: NCCriticalPayload): Promise<boolean> {
    return sendWebhook({
        event: 'NC_CRITICAL',
        data: {
            ...data,
            alertLevel: '🚨 CRÍTICO',
            message: `NC Crítica detectada: ${data.ncCode}`,
            channels: ['whatsapp', 'email', 'slack'],
        },
        timestamp: new Date().toISOString(),
    });
}

/**
 * Notificar Auditoría Completada
 * Dispara: Slack notificación al equipo
 */
export async function notifyAuditCompleted(data: AuditCompletedPayload): Promise<boolean> {
    return sendWebhook({
        event: 'AUDIT_COMPLETED',
        data: {
            ...data,
            message: `Auditoría ${data.auditCode} completada`,
            summary: `${data.totalFindings} hallazgos | ${data.nonConformities.critical} críticas`,
            channels: ['slack'],
        },
        timestamp: new Date().toISOString(),
    });
}

/**
 * Notificar CAPA Vencida
 */
export async function notifyCAPAOverdue(data: {
    capaId: string;
    ncCode: string;
    description: string;
    responsible: string;
    dueDate: string;
    daysOverdue: number;
}): Promise<boolean> {
    return sendWebhook({
        event: 'CAPA_OVERDUE',
        data: {
            ...data,
            alertLevel: '⚠️ VENCIDA',
            message: `Acción correctiva vencida: ${data.ncCode}`,
            channels: ['email', 'slack'],
        },
        timestamp: new Date().toISOString(),
    });
}
