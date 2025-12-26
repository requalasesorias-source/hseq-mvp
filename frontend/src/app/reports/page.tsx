'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    FileText,
    Download,
    Calendar,
    Building2,
    Filter,
    BarChart3,
    PieChart,
    TrendingUp,
    FileSpreadsheet,
    Printer,
} from 'lucide-react';

interface Report {
    id: string;
    name: string;
    type: 'audit' | 'nc' | 'kpi' | 'compliance';
    description: string;
    lastGenerated: string;
    format: 'PDF' | 'Excel' | 'CSV';
}

const availableReports: Report[] = [
    {
        id: '1',
        name: 'Informe de Auditoría',
        type: 'audit',
        description: 'Reporte completo de hallazgos y no conformidades por auditoría',
        lastGenerated: '2024-12-20',
        format: 'PDF',
    },
    {
        id: '2',
        name: 'Estado de No Conformidades',
        type: 'nc',
        description: 'Resumen de NCs abiertas, en proceso y cerradas por período',
        lastGenerated: '2024-12-19',
        format: 'PDF',
    },
    {
        id: '3',
        name: 'Dashboard de KPIs',
        type: 'kpi',
        description: 'Indicadores clave de desempeño del sistema de gestión',
        lastGenerated: '2024-12-18',
        format: 'PDF',
    },
    {
        id: '4',
        name: 'Matriz de Cumplimiento',
        type: 'compliance',
        description: 'Estado de cumplimiento por cláusula ISO y requisito legal',
        lastGenerated: '2024-12-15',
        format: 'Excel',
    },
    {
        id: '5',
        name: 'Exportar Datos',
        type: 'audit',
        description: 'Exportar todos los datos de auditorías en formato CSV',
        lastGenerated: '2024-12-10',
        format: 'CSV',
    },
];

const recentReports = [
    { name: 'AUD-2024-021_Informe.pdf', date: '2024-12-20', size: '2.3 MB' },
    { name: 'NC_Resumen_Dic2024.pdf', date: '2024-12-19', size: '1.1 MB' },
    { name: 'KPIs_Q4_2024.pdf', date: '2024-12-18', size: '856 KB' },
];

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedCompany, setSelectedCompany] = useState('all');

    const typeIcons = {
        audit: FileText,
        nc: BarChart3,
        kpi: TrendingUp,
        compliance: PieChart,
    };

    const typeColors = {
        audit: 'bg-blue-100 text-blue-600',
        nc: 'bg-orange-100 text-orange-600',
        kpi: 'bg-green-100 text-green-600',
        compliance: 'bg-purple-100 text-purple-600',
    };

    const formatIcons = {
        PDF: FileText,
        Excel: FileSpreadsheet,
        CSV: FileSpreadsheet,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Reportes</h1>
                                <p className="text-sm text-gray-500">
                                    Genera y descarga informes del sistema
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Parámetros de Reporte</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Período
                                    </label>
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="week">Última semana</option>
                                        <option value="month">Último mes</option>
                                        <option value="quarter">Último trimestre</option>
                                        <option value="year">Último año</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Empresa
                                    </label>
                                    <select
                                        value={selectedCompany}
                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="all">Todas las empresas</option>
                                        <option value="minera">Minera Los Andes</option>
                                        <option value="constructora">Constructora Sur</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Available Reports */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Reportes Disponibles</h3>
                            <div className="space-y-4">
                                {availableReports.map((report) => {
                                    const TypeIcon = typeIcons[report.type];
                                    const FormatIcon = formatIcons[report.format];
                                    return (
                                        <div
                                            key={report.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[report.type]
                                                        }`}
                                                >
                                                    <TypeIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {report.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {report.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 border">
                                                    {report.format}
                                                </span>
                                                <button className="btn-primary flex items-center gap-2 text-sm">
                                                    <Download className="h-4 w-4" />
                                                    Generar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                                    <Printer className="h-4 w-4" />
                                    Imprimir Resumen
                                </button>
                                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Exportar Todo (Excel)
                                </button>
                            </div>
                        </div>

                        {/* Recent Reports */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Reportes Recientes</h3>
                            <div className="space-y-3">
                                {recentReports.map((report, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-red-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                    {report.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {report.date} • {report.size}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                            <Download className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <h3 className="font-semibold mb-4">Este Mes</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-primary-100">Reportes generados</span>
                                    <span className="font-bold">24</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-100">Descargas</span>
                                    <span className="font-bold">156</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-100">Usuarios activos</span>
                                    <span className="font-bold">8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
