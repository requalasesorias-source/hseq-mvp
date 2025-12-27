/**
 * API Client for HSEQ Backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ===========================================
// AUDITS API
// ===========================================

export interface Audit {
    id: string;
    code: string;
    companyId: string;
    company?: { name: string };
    auditorId: string;
    auditor?: { name: string; email: string };
    type: 'INTERNAL' | 'EXTERNAL' | 'SURVEILLANCE' | 'CERTIFICATION';
    norms: ('ISO9001' | 'ISO45001' | 'ISO14001')[];
    status: 'DRAFT' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'CANCELLED';
    scheduledAt: string;
    completedAt?: string;
    findings?: Finding[];
    _count?: { findings: number };
}

export interface CreateAuditInput {
    companyId: string;
    auditorId: string;
    type: Audit['type'];
    norms: Audit['norms'];
    scheduledAt: string;
}

export const auditsApi = {
    list: async (params?: { companyId?: string; status?: string; page?: number; limit?: number }) => {
        const response = await apiClient.get<{ data: Audit[]; pagination: unknown }>('/audits', { params });
        return response.data;
    },

    get: async (id: string) => {
        const response = await apiClient.get<Audit>(`/audits/${id}`);
        return response.data;
    },

    create: async (data: CreateAuditInput) => {
        const response = await apiClient.post<Audit>('/audits', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Audit>) => {
        const response = await apiClient.patch<Audit>(`/audits/${id}`, data);
        return response.data;
    },

    complete: async (id: string, signature?: string) => {
        const response = await apiClient.post<Audit>(`/audits/${id}/complete`, { signature });
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/audits/${id}`);
    },
};

// ===========================================
// FINDINGS API
// ===========================================

export interface Finding {
    id: string;
    auditId: string;
    checklistItemId: string;
    checklistItem?: ChecklistItem;
    compliant: boolean;
    comment?: string;
    evidence?: string[];
    nonConformity?: NonConformity;
}

export interface CreateFindingInput {
    auditId: string;
    checklistItemId: string;
    compliant: boolean;
    comment?: string;
}

export interface BulkFindingsInput {
    auditId: string;
    findings: {
        checklistItemId: string;
        compliant: boolean;
        comment?: string;
    }[];
}

export const findingsApi = {
    list: async (auditId: string) => {
        const response = await apiClient.get<Finding[]>('/findings', { params: { auditId } });
        return response.data;
    },

    create: async (data: CreateFindingInput) => {
        const response = await apiClient.post<Finding>('/findings', data);
        return response.data;
    },

    createBulk: async (data: BulkFindingsInput) => {
        const response = await apiClient.post<{ count: number }>('/findings/bulk', data);
        return response.data;
    },

    getSummary: async (auditId: string) => {
        const response = await apiClient.get<{
            total: number;
            compliant: number;
            nonCompliant: number;
            complianceRate: number;
        }>(`/findings/summary/${auditId}`);
        return response.data;
    },
};

// ===========================================
// NON-CONFORMITIES API
// ===========================================

export interface NonConformity {
    id: string;
    code: string;
    findingId: string;
    finding?: Finding;
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
    description: string;
    rootCause?: string;
    legalReference: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'CLOSED' | 'OVERDUE';
    dueDate: string;
    capaActions?: CAPAAction[];
}

export interface CAPAAction {
    id: string;
    nonConformityId: string;
    type: 'CORRECTIVE' | 'PREVENTIVE' | 'IMPROVEMENT';
    description: string;
    responsible: string;
    dueDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'INEFFECTIVE';
}

export const nonConformitiesApi = {
    list: async (params?: { auditId?: string; severity?: string; status?: string }) => {
        const response = await apiClient.get<NonConformity[]>('/nonconformities', { params });
        return response.data;
    },

    get: async (id: string) => {
        const response = await apiClient.get<NonConformity>(`/nonconformities/${id}`);
        return response.data;
    },

    create: async (data: {
        findingId: string;
        description: string;
        legalReference: string;
        dueDate: string;
        rootCause?: string;
    }) => {
        const response = await apiClient.post<NonConformity>('/nonconformities', data);
        return response.data;
    },

    addCapa: async (ncId: string, data: Omit<CAPAAction, 'id' | 'nonConformityId' | 'status'>) => {
        const response = await apiClient.post<CAPAAction>(`/nonconformities/${ncId}/capa`, data);
        return response.data;
    },

    close: async (id: string) => {
        const response = await apiClient.patch<NonConformity>(`/nonconformities/${id}/close`);
        return response.data;
    },

    getStats: async (companyId?: string) => {
        const response = await apiClient.get<{
            total: number;
            overdue: number;
            bySeverity: Record<string, number>;
            byStatus: Record<string, number>;
        }>('/nonconformities/stats', { params: { companyId } });
        return response.data;
    },
};

// ===========================================
// ANALYSIS API
// ===========================================

export interface Analysis {
    id: string;
    auditId: string;
    summary: string;
    riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
    recommendations: string[];
    legalFindings: unknown;
    processedAt: string;
}

export const analysisApi = {
    analyze: async (auditId: string) => {
        const response = await apiClient.post<{
            analysis: Analysis;
            nonConformitiesCreated: number;
        }>('/analysis', { auditId });
        return response.data;
    },

    get: async (auditId: string) => {
        const response = await apiClient.get<Analysis>(`/analysis/${auditId}`);
        return response.data;
    },
};

// ===========================================
// CHECKLIST API
// ===========================================

export interface ChecklistItem {
    id: string;
    code: string;
    norm: 'ISO9001' | 'ISO45001' | 'ISO14001';
    clause: string;
    requirement: string;
    verificationQ: string;
    legalRef?: string;
}

export const checklistApi = {
    list: async (params?: { norm?: string; clause?: string }) => {
        const response = await apiClient.get<ChecklistItem[]>('/checklist', { params });
        return response.data;
    },

    getTrinorma: async () => {
        const response = await apiClient.get<{
            ISO9001: ChecklistItem[];
            ISO45001: ChecklistItem[];
            ISO14001: ChecklistItem[];
        }>('/checklist/trinorma');
        return response.data;
    },

    seed: async () => {
        const response = await apiClient.post<{ message: string; items: number }>('/checklist/seed');
        return response.data;
    },

    getDemoConfig: async () => {
        const response = await apiClient.get<{ companyId: string; auditorId: string }>('/checklist/demo-config');
        return response.data;
    },
};

export default apiClient;
