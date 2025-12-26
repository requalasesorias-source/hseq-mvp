'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, BarChart2, Building2, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [accountType, setAccountType] = useState<'personal' | 'empresa'>('empresa');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            // Set mock auth cookie
            document.cookie = "auth_token=mock_token_secure_enterprise; path=/; max-age=86400; SameSite=Strict";
            router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#05050A] text-white flex overflow-hidden">
            {/* Split Layout: Left Side (Branding) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A0A15] items-center justify-center p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-xl">
                    {/* Header Logo & Tag */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex gap-1">
                            <div className="w-3 h-8 bg-emerald-500 rounded-full"></div>
                            <div className="w-3 h-6 bg-blue-500 rounded-full mt-2"></div>
                            <div className="w-3 h-8 bg-emerald-500 rounded-full"></div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Requal IA Manager</h1>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        NUEVA VERSIÓN 2.0
                    </div>

                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Tus Aliados en <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                            Transformación Digital HSEQ
                        </span>
                    </h2>

                    <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-md">
                        Gestiona riesgos, cumplimiento y operaciones con la potencia de la Inteligencia Artificial. La plataforma definitiva para auditorías de alto rendimiento.
                    </p>

                    {/* Stats or Proof */}
                    <div className="flex items-center gap-8 border-t border-white/10 pt-8">
                        <div>
                            <p className="text-3xl font-bold text-white">119</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Puntos de Control</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">3</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Normas ISO Integra.</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">AI</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Análisis Predictivo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Layout: Right Side (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
                <div className="w-full max-w-md space-y-8">

                    {/* Welcome Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h2>
                        <p className="text-slate-500">Ingresa tus credenciales para acceder al panel.</p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        <button
                            onClick={() => setAccountType('personal')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${accountType === 'personal' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <User className="w-4 h-4" />
                            Personal
                        </button>
                        <button
                            onClick={() => setAccountType('empresa')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${accountType === 'empresa' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Building2 className="w-4 h-4" />
                            Empresa
                        </button>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-slate-200 shadow-sm">
                            {/* Google Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google Workspace
                        </button>
                        <button className="w-full bg-[#1E1E2D] hover:bg-[#27273A] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm">
                            {/* Microsoft Icon (Simplified) */}
                            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                <div className="bg-[#F35325]"></div>
                                <div className="bg-[#81BC06]"></div>
                                <div className="bg-[#05A6F0]"></div>
                                <div className="bg-[#FFBA08]"></div>
                            </div>
                            Microsoft 365 / Outlook
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400">O usa tu email</span>
                        </div>
                    </div>

                    {/* Traditional Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 pl-11 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="nombre@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">¿Olvidaste tu clave?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 pl-11 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
