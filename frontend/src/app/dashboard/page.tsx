'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Shield,
    ClipboardCheck,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Calendar,
    Building2,
    ChevronRight,
    Bell,
    User,
    BarChart3,
    FileText,
    Settings,
    LogOut,
} from 'lucide-react';

// Mock data for dashboard
const mockStats = {
    totalAudits: 24,
    pendingAudits: 3,
    openNCs: 12,
    criticalNCs: 2,
    complianceRate: 87.5,
    completedThisMonth: 5,
};

const mockRecentAudits = [
    {
        id: '1',
        code: 'AUD-2024-018',
        company: 'Minera Los Andes',
        norms: ['ISO45001', 'ISO14001'],
        status: 'COMPLETED',
        date: '2024-12-20',
        findings: 8,
        ncsCount: 2,
    },
    {
        id: '2',
        code: 'AUD-2024-019',
        company: 'Constructora Pacific',
        norms: ['ISO9001', 'ISO45001'],
        status: 'IN_PROGRESS',
        date: '2024-12-22',
        findings: 5,
        ncsCount: 1,
    },
    {
        id: '3',
        code: 'AUD-2024-020',
        company: 'Industria Química Norte',
        norms: ['ISO14001'],
        status: 'PENDING_REVIEW',
        date: '2024-12-23',
        findings: 10,
        ncsCount: 4,
    },
];

const mockCriticalNCs = [
    {
        id: '1',
        code: 'NC-2024-045',
        description: 'Falta de EPP en zona de soldadura',
        severity: 'CRITICAL',
        company: 'Constructora Pacific',
        dueDate: '2024-12-25',
        legalRef: 'Ley 16.744 Art. 184',
    },
    {
        id: '2',
        code: 'NC-2024-046',
        description: 'Ausencia de plan de emergencia actualizado',
        severity: 'CRITICAL',
        company: 'Minera Los Andes',
        dueDate: '2024-12-28',
        legalRef: 'DS 40 Art. 21',
    },
];

const statusColors = {
    COMPLETED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    PENDING_REVIEW: 'bg-amber-100 text-amber-800',
    DRAFT: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
    COMPLETED: 'Completada',
    IN_PROGRESS: 'En Progreso',
    PENDING_REVIEW: 'Pendiente Revisión',
    DRAFT: 'Borrador',
};

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
                {/* Logo */}
                <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-100">
                    <Shield className="h-8 w-8 text-primary-600" />
                    <span className="text-lg font-bold text-gray-900">HSEQ MVP</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium"
                    >
                        <BarChart3 className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/audit"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <ClipboardCheck className="h-5 w-5" />
                        Auditorías
                    </Link>
                    <Link
                        href="/nonconformities"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <AlertTriangle className="h-5 w-5" />
                        No Conformidades
                        <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            {mockStats.criticalNCs}
                        </span>
                    </Link>
                    <Link
                        href="/reports"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <FileText className="h-5 w-5" />
                        Reportes
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <Settings className="h-5 w-5" />
                        Configuración
                    </Link>
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
                            <p className="text-xs text-gray-500 truncate">Auditor Senior</p>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:pl-64">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-500">Resumen de auditorías y cumplimiento</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <Link href="/audit" className="btn-primary flex items-center gap-2">
                                <ClipboardCheck className="h-4 w-4" />
                                Nueva Auditoría
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard content */}
                <div className="p-6">
                    {/* Stats grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Audits */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +12%
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{mockStats.totalAudits}</h3>
                            <p className="text-sm text-gray-500">Auditorías totales</p>
                        </div>

                        {/* Pending */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{mockStats.pendingAudits}</h3>
                            <p className="text-sm text-gray-500">Auditorías pendientes</p>
                        </div>

                        {/* Open NCs */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <span className="text-xs text-red-600 font-medium">
                                    {mockStats.criticalNCs} críticas
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{mockStats.openNCs}</h3>
                            <p className="text-sm text-gray-500">NCs abiertas</p>
                        </div>

                        {/* Compliance Rate */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{mockStats.complianceRate}%</h3>
                            <p className="text-sm text-gray-500">Tasa de cumplimiento</p>
                        </div>
                    </div>

                    {/* Content grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recent Audits */}
                        <div className="lg:col-span-2 card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900">Auditorías Recientes</h2>
                                <Link href="/audit" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Ver todas
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {mockRecentAudits.map((audit) => (
                                    <div
                                        key={audit.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                                <Building2 className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{audit.company}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">{audit.code}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {audit.norms.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[audit.status as keyof typeof statusColors]
                                                        }`}
                                                >
                                                    {statusLabels[audit.status as keyof typeof statusLabels]}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {audit.findings} hallazgos • {audit.ncsCount} NCs
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Critical NCs */}
                        <div className="card border-l-4 border-l-red-500">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    NCs Críticas
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {mockCriticalNCs.map((nc) => (
                                    <div key={nc.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="badge-critical text-xs px-2 py-1 rounded-full font-medium">
                                                CRÍTICA
                                            </span>
                                            <span className="text-xs text-gray-500">{nc.code}</span>
                                        </div>
                                        <p className="text-sm text-gray-900 font-medium mb-2">{nc.description}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">{nc.company}</span>
                                            <span className="text-red-600 font-medium">
                                                Vence: {new Date(nc.dueDate).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">{nc.legalRef}</p>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/nonconformities"
                                className="btn-secondary w-full mt-4 flex items-center justify-center gap-2"
                            >
                                Ver todas las NCs
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
