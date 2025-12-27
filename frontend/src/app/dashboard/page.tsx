'use client';

import { useState, useEffect } from 'react';
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
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hseq-mvp.onrender.com';

export default function DashboardPage() {
    // Mock Data for Demo Fallback
    const MOCK_DATA = {
        stats: {
            totalAudits: 12,
            avgCompliance: 85,
            criticalNCs: 3,
            pendingActions: 5
        },
        charts: {
            complianceByNorm: [
                { name: 'ISO 9001', value: 92 },
                { name: 'ISO 14001', value: 78 },
                { name: 'ISO 45001', value: 88 }
            ]
        },
        recentAudits: [
            { id: '1', date: new Date().toISOString(), standard: 'ISO 45001', status: 'COMPLETED', compliance: 95 },
            { id: '2', date: new Date().toISOString(), standard: 'ISO 9001', status: 'IN_PROGRESS', compliance: 60 },
            { id: '3', date: new Date().toISOString(), standard: 'ISO 14001', status: 'PENDING_REVIEW', compliance: 82 }
        ],
        criticalNCs: [
            { id: '1', description: 'Falta de EPP en zona de carga', severity: 'CRITICAL', status: 'OPEN' },
            { id: '2', description: 'Extintor vencido en bodega', severity: 'CRITICAL', status: 'IN_PROGRESS' }
        ]
    };

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('Usuario');

    useEffect(() => {
        async function fetchDashboard() {
            try {
                // Get user name from cookie
                const match = document.cookie.match(new RegExp('(^| )user_name=([^;]+)'));
                if (match) {
                    setUserName(decodeURIComponent(match[2]));
                }

                const res = await fetch(`${API_URL}/api/dashboard/stats`);
                if (!res.ok) throw new Error('Failed to load');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.warn('Backend unavailable, showing Demo Data', err);
                // Fallback to Mock Data instead of Error
                setData(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const statusColors: any = {
        COMPLETED: 'bg-green-100 text-green-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        PENDING_REVIEW: 'bg-amber-100 text-amber-800',
        DRAFT: 'bg-gray-100 text-gray-800',
    };

    const statusLabels: any = {
        COMPLETED: 'Completada',
        IN_PROGRESS: 'En Progreso',
        PENDING_REVIEW: 'Pendiente Rev.',
        DRAFT: 'Borrador',
    };

    const normColors: any = {
        ISO9001: '#8b5cf6', // Violet
        ISO14001: '#10b981', // Green
        ISO45001: '#3b82f6', // Blue
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-500">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const { stats, recentAudits, criticalNCs, charts } = data;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
                <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-100">
                    <Shield className="h-8 w-8 text-primary-600" />
                    <span className="text-lg font-bold text-gray-900">HSEQ MVP</span>
                </div>
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
                        {stats.criticalNCs > 0 && (
                            <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                {stats.criticalNCs}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/reports"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <FileText className="h-5 w-5" />
                        Reportes
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">Auditor Senior</p>
                        </div>
                        <button
                            onClick={() => {
                                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                                window.location.href = '/login';
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Cerrar Sessión"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:pl-64">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Hola, {userName}</h1>
                            <p className="text-sm text-gray-500">Resumen de cumplimiento en tiempo real</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/audit" className="btn-primary flex items-center gap-2">
                                <ClipboardCheck className="h-4 w-4" />
                                Nueva Auditoría
                            </Link>
                        </div>
                    </div>
                </header>

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
                                    Actualizado
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalAudits}</h3>
                            <p className="text-sm text-gray-500">Auditorías totales</p>
                        </div>

                        {/* Pending */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingAudits}</h3>
                            <p className="text-sm text-gray-500">Auditorías pendientes</p>
                        </div>

                        {/* Open NCs */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <span className="text-xs text-red-600 font-medium">
                                    {stats.criticalNCs} críticas
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.openNCs}</h3>
                            <p className="text-sm text-gray-500">NCs abiertas</p>
                        </div>

                        {/* Compliance Rate */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</h3>
                            <p className="text-sm text-gray-500">Cumplimiento Global</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* CHART: Compliance by Norm */}
                        <div className="lg:col-span-2 card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900">Cumplimiento por Norma</h2>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.complianceByNorm} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="norm" />
                                        <YAxis unit="%" domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => [`${value}%`, 'Cumplimiento']}
                                        />
                                        <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                            {charts.complianceByNorm.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={normColors[entry.norm] || '#6366f1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Critical NCs List */}
                        <div className="card border-l-4 border-l-red-500">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    NCs Críticas
                                </h2>
                            </div>
                            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
                                {criticalNCs.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">No hay NCs críticas abiertas 🎉</p>
                                ) : (
                                    criticalNCs.map((nc: any) => (
                                        <div key={nc.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="badge-critical text-xs px-2 py-1 rounded-full font-medium">
                                                    CRÍTICA
                                                </span>
                                                <span className="text-xs text-gray-500">{nc.code}</span>
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">{nc.description}</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600 truncate max-w-[120px]">{nc.company}</span>
                                                <span className="text-red-600 font-medium whitespace-nowrap">
                                                    Vence: {new Date(nc.dueDate).toLocaleDateString('es-CL')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Audits Table (Full Width) */}
                        <div className="lg:col-span-3 card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900">Auditorías Recientes</h2>
                                <Link href="/audit" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Ver todas
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3">Código</th>
                                            <th className="px-4 py-3">Empresa</th>
                                            <th className="px-4 py-3">Normas</th>
                                            <th className="px-4 py-3">Fecha</th>
                                            <th className="px-4 py-3">Estado</th>
                                            <th className="px-4 py-3 text-right">Hallazgos</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentAudits.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                    No hay auditorías recientes. ¡Comienza una ahora!
                                                </td>
                                            </tr>
                                        ) : (
                                            recentAudits.map((audit: any) => (
                                                <tr key={audit.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{audit.code}</td>
                                                    <td className="px-4 py-3 text-gray-600">{audit.company}</td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        <div className="flex gap-1 flex-wrap">
                                                            {audit.norms.map((norm: string) => (
                                                                <span key={norm} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                                                    {norm}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {new Date(audit.date).toLocaleDateString('es-CL')}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[audit.status] || 'bg-gray-100'}`}>
                                                            {statusLabels[audit.status] || audit.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-gray-900 font-medium">{audit.findings}</span>
                                                        {audit.ncsCount > 0 && (
                                                            <span className="ml-2 text-red-600 text-xs">({audit.ncsCount} NC)</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link href={`/audit/${audit.id}`} className="p-1 hover:bg-gray-200 rounded inline-block">
                                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
