'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    ArrowLeft,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    Filter,
    Search,
    ChevronDown,
    FileText,
    Calendar,
    Building2,
} from 'lucide-react';

interface NonConformity {
    id: string;
    code: string;
    title: string;
    description: string;
    severity: 'MENOR' | 'MAYOR' | 'CRITICA';
    status: 'ABIERTA' | 'EN_PROCESO' | 'CERRADA';
    auditCode: string;
    company: string;
    norm: string;
    clause: string;
    createdAt: string;
    dueDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hseq-mvp.onrender.com';

// Mock data for demonstration
const mockNonConformities: NonConformity[] = [
    {
        id: '1',
        code: 'NC-2024-001',
        title: 'Falta de señalización en área de riesgo',
        description: 'No existe señalética de seguridad en zona de excavación',
        severity: 'MAYOR',
        status: 'ABIERTA',
        auditCode: 'AUD-2024-021',
        company: 'Minera Los Andes',
        norm: 'ISO45001',
        clause: '8.1.2',
        createdAt: '2024-12-20',
        dueDate: '2025-01-20',
    },
    {
        id: '2',
        code: 'NC-2024-002',
        title: 'Documentación de capacitación incompleta',
        description: 'Registros de capacitación sin firmas de asistencia',
        severity: 'MENOR',
        status: 'EN_PROCESO',
        auditCode: 'AUD-2024-021',
        company: 'Minera Los Andes',
        norm: 'ISO9001',
        clause: '7.2',
        createdAt: '2024-12-18',
        dueDate: '2025-01-15',
    },
    {
        id: '3',
        code: 'NC-2024-003',
        title: 'Residuos peligrosos sin clasificar',
        description: 'Contenedores de residuos sin identificación según DS148',
        severity: 'CRITICA',
        status: 'ABIERTA',
        auditCode: 'AUD-2024-019',
        company: 'Constructora Sur',
        norm: 'ISO14001',
        clause: '8.1',
        createdAt: '2024-12-15',
        dueDate: '2024-12-30',
    },
];

export default function NonConformitiesPage() {
    const [nonConformities, setNonConformities] = useState<NonConformity[]>(mockNonConformities);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const severityColors = {
        MENOR: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
        MAYOR: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
        CRITICA: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    };

    const statusColors = {
        ABIERTA: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
        EN_PROCESO: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
        CERRADA: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
    };

    const filteredNCs = nonConformities.filter((nc) => {
        const matchesStatus = filterStatus === 'all' || nc.status === filterStatus;
        const matchesSeverity = filterSeverity === 'all' || nc.severity === filterSeverity;
        const matchesSearch =
            searchTerm === '' ||
            nc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nc.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSeverity && matchesSearch;
    });

    const stats = {
        total: nonConformities.length,
        abiertas: nonConformities.filter((nc) => nc.status === 'ABIERTA').length,
        enProceso: nonConformities.filter((nc) => nc.status === 'EN_PROCESO').length,
        cerradas: nonConformities.filter((nc) => nc.status === 'CERRADA').length,
        criticas: nonConformities.filter((nc) => nc.severity === 'CRITICA').length,
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
                                <h1 className="text-xl font-semibold text-gray-900">No Conformidades</h1>
                                <p className="text-sm text-gray-500">
                                    {stats.total} registradas • {stats.abiertas} abiertas
                                </p>
                            </div>
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva NC
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="card text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <div className="card text-center border-l-4 border-red-500">
                        <p className="text-3xl font-bold text-red-600">{stats.abiertas}</p>
                        <p className="text-sm text-gray-500">Abiertas</p>
                    </div>
                    <div className="card text-center border-l-4 border-blue-500">
                        <p className="text-3xl font-bold text-blue-600">{stats.enProceso}</p>
                        <p className="text-sm text-gray-500">En Proceso</p>
                    </div>
                    <div className="card text-center border-l-4 border-green-500">
                        <p className="text-3xl font-bold text-green-600">{stats.cerradas}</p>
                        <p className="text-sm text-gray-500">Cerradas</p>
                    </div>
                    <div className="card text-center border-l-4 border-purple-500">
                        <p className="text-3xl font-bold text-purple-600">{stats.criticas}</p>
                        <p className="text-sm text-gray-500">Críticas</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por código o título..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input pl-10 w-full"
                                />
                            </div>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="ABIERTA">Abierta</option>
                            <option value="EN_PROCESO">En Proceso</option>
                            <option value="CERRADA">Cerrada</option>
                        </select>
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="input"
                        >
                            <option value="all">Todas las severidades</option>
                            <option value="MENOR">Menor</option>
                            <option value="MAYOR">Mayor</option>
                            <option value="CRITICA">Crítica</option>
                        </select>
                    </div>
                </div>

                {/* NC List */}
                <div className="space-y-4">
                    {filteredNCs.map((nc) => {
                        const StatusIcon = statusColors[nc.status].icon;
                        return (
                            <div
                                key={nc.id}
                                className={`card hover:shadow-md transition-shadow cursor-pointer border-l-4 ${nc.severity === 'CRITICA'
                                        ? 'border-l-red-500'
                                        : nc.severity === 'MAYOR'
                                            ? 'border-l-orange-500'
                                            : 'border-l-yellow-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm font-medium text-gray-900">
                                                {nc.code}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[nc.severity].bg
                                                    } ${severityColors[nc.severity].text}`}
                                            >
                                                {nc.severity}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[nc.status].bg
                                                    } ${statusColors[nc.status].text}`}
                                            >
                                                <StatusIcon className="h-3 w-3" />
                                                {nc.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1">{nc.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{nc.description}</p>
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                {nc.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                {nc.norm} - {nc.clause}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Vence: {nc.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-5 w-5 text-gray-400 rotate-[-90deg]" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredNCs.length === 0 && (
                    <div className="card text-center py-12">
                        <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados</h3>
                        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
}
