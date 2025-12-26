'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Building2,
    Users,
    Bell,
    Shield,
    Palette,
    Globe,
    Mail,
    Key,
    Save,
    CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('company');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'company', label: 'Empresa', icon: Building2 },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'notifications', label: 'Notificaciones', icon: Bell },
        { id: 'security', label: 'Seguridad', icon: Shield },
    ];

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
                                <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
                                <p className="text-sm text-gray-500">
                                    Administra tu cuenta y preferencias del sistema
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className="btn-primary flex items-center gap-2"
                        >
                            {saved ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Guardado
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'company' && (
                            <div className="card">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Información de la Empresa
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre de la Empresa
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Minera Los Andes S.A."
                                                className="input w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                RUT
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="76.123.456-7"
                                                className="input w-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="Av. Providencia 1234, Santiago"
                                            className="input w-full"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Industria
                                            </label>
                                            <select className="input w-full" defaultValue="mineria">
                                                <option value="mineria">Minería</option>
                                                <option value="construccion">Construcción</option>
                                                <option value="manufactura">Manufactura</option>
                                                <option value="energia">Energía</option>
                                                <option value="otros">Otros</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tamaño
                                            </label>
                                            <select className="input w-full" defaultValue="grande">
                                                <option value="micro">Micro (1-9)</option>
                                                <option value="pequena">Pequeña (10-49)</option>
                                                <option value="mediana">Mediana (50-199)</option>
                                                <option value="grande">Grande (200+)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Normas Certificadas
                                        </label>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {['ISO 9001:2015', 'ISO 45001:2018', 'ISO 14001:2015'].map(
                                                (norm) => (
                                                    <label
                                                        key={norm}
                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked
                                                            className="rounded border-gray-300 text-primary-600"
                                                        />
                                                        <span className="text-sm">{norm}</span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="card">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Gestión de Usuarios
                                    </h2>
                                    <button className="btn-primary text-sm">+ Agregar Usuario</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                                    Nombre
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                                    Email
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                                    Rol
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                                    Estado
                                                </th>
                                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                {
                                                    name: 'Juan Pérez',
                                                    email: 'juan@empresa.cl',
                                                    role: 'Admin',
                                                    status: 'Activo',
                                                },
                                                {
                                                    name: 'María González',
                                                    email: 'maria@empresa.cl',
                                                    role: 'Auditor',
                                                    status: 'Activo',
                                                },
                                                {
                                                    name: 'Carlos López',
                                                    email: 'carlos@empresa.cl',
                                                    role: 'Visualizador',
                                                    status: 'Inactivo',
                                                },
                                            ].map((user, idx) => (
                                                <tr key={idx} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-sm">
                                                                {user.name[0]}
                                                            </div>
                                                            <span className="font-medium text-gray-900">
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-sm ${user.status === 'Activo'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-500'
                                                                }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button className="text-sm text-primary-600 hover:underline">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="card">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Preferencias de Notificaciones
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            title: 'NC Críticas',
                                            desc: 'Recibir alertas inmediatas cuando se detecte una NC crítica',
                                            enabled: true,
                                        },
                                        {
                                            title: 'Auditorías Completadas',
                                            desc: 'Notificación cuando una auditoría finaliza su análisis',
                                            enabled: true,
                                        },
                                        {
                                            title: 'Vencimiento de CAPA',
                                            desc: 'Recordatorio cuando una acción correctiva esté por vencer',
                                            enabled: true,
                                        },
                                        {
                                            title: 'Reportes Semanales',
                                            desc: 'Resumen semanal del estado del sistema de gestión',
                                            enabled: false,
                                        },
                                        {
                                            title: 'Actualizaciones del Sistema',
                                            desc: 'Novedades y mejoras de la plataforma HSEQ',
                                            enabled: false,
                                        },
                                    ].map((notification, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">{notification.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={notification.enabled}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="card">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                        Cambiar Contraseña
                                    </h2>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña Actual
                                            </label>
                                            <input type="password" className="input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nueva Contraseña
                                            </label>
                                            <input type="password" className="input w-full" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmar Nueva Contraseña
                                            </label>
                                            <input type="password" className="input w-full" />
                                        </div>
                                        <button className="btn-primary mt-2">Actualizar Contraseña</button>
                                    </div>
                                </div>

                                <div className="card">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                        Sesiones Activas
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    MacBook Pro - Chrome
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Santiago, Chile • Activa ahora
                                                </p>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                Actual
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">iPhone 14 - Safari</p>
                                                <p className="text-sm text-gray-500">
                                                    Santiago, Chile • Hace 2 horas
                                                </p>
                                            </div>
                                            <button className="text-sm text-red-600 hover:underline">
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
