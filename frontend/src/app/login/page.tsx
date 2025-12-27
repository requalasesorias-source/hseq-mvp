'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, BarChart2, Building2, User, Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [accountType, setAccountType] = useState<'personal' | 'empresa'>('empresa');
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            // Set mock auth cookie
            document.cookie = "auth_token=mock_token_secure_enterprise; path=/; max-age=86400; SameSite=Strict";
            // Set mock user cookie (get name from email or default)
            const userName = email ? email.split('@')[0] : 'Admin Usuario';
            document.cookie = `user_name=${userName}; path=/; max-age=86400; SameSite=Strict`;

            router.push('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#05050A] text-white flex overflow-hidden">
            {/* Split Layout: Left Side (Branding & Info Carousel) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A0A15] items-center justify-center p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-xl w-full">
                    {/* Header Logo & Tag */}
                    <div className="flex items-center gap-3 mb-10 absolute top-0 pt-12">
                        <div className="flex gap-1">
                            <div className="w-3 h-8 bg-emerald-500 rounded-full"></div>
                            <div className="w-3 h-8 bg-blue-600 rounded-full"></div>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Requal IA Manager</h1>
                    </div>

                    {/* Carousel Content */}
                    <div className="mt-20 h-[400px] flex flex-col justify-center relative">
                        {/* Slide 1: Intro */}
                        <div className={`transition-all duration-700 absolute inset-0 ${currentSlide === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
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
                            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-md">
                                Gestiona riesgos, cumplimiento y operaciones con la potencia de la Inteligencia Artificial. La plataforma definitiva para equipos de alto rendimiento.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-2xl font-bold text-white">119</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Puntos de Control</p>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-2xl font-bold text-white">ISO</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trinorma Integrada</p>
                                </div>
                            </div>
                        </div>

                        {/* Slide 2: Compliance Trinorma */}
                        <div className={`transition-all duration-700 absolute inset-0 ${currentSlide === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider mb-8">
                                <Shield className="w-3 h-3" />
                                ESTÁNDARES INTERNACIONALES
                            </div>
                            <h2 className="text-4xl font-bold leading-tight mb-6 text-white">
                                Auditoría Trinorma <br />
                                <span className="text-emerald-400">Totalmente Integrada</span>
                            </h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">45</div>
                                    <div>
                                        <h4 className="text-white font-semibold">ISO 45001:2018</h4>
                                        <p className="text-xs text-gray-400">Seguridad (Ley 16.744 / DS44)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">14</div>
                                    <div>
                                        <h4 className="text-white font-semibold">ISO 14001:2015</h4>
                                        <p className="text-xs text-gray-400">Gestión Ambiental (Ley 19.300)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">90</div>
                                    <div>
                                        <h4 className="text-white font-semibold">ISO 9001:2015</h4>
                                        <p className="text-xs text-gray-400">Calidad y Procesos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slide 3: AI Power */}
                        <div className={`transition-all duration-700 absolute inset-0 ${currentSlide === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wider mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                                GEMINI AI ENGINE
                            </div>
                            <h2 className="text-4xl font-bold leading-tight mb-6 text-white">
                                Inteligencia Artificial <br />
                                <span className="text-purple-400">Aplicada a Compliance</span>
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed mb-8">
                                Nuestro motor IA analiza hallazgos en tiempo real, sugiere clasificaciones de riesgo y genera planes de acción basados en normativa chilena (DS44, DS594).
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h5 className="text-white font-bold mb-1">Clasificación</h5>
                                    <p className="text-xs text-gray-400">Auto-detecta severidad Crítica/Mayor</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h5 className="text-white font-bold mb-1">Legal Tech</h5>
                                    <p className="text-xs text-gray-400">Cita artículos de leyes específicas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex gap-2 mt-12">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
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
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-slate-300 shadow-sm"
                        >
                            {/* Google Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google Workspace
                        </button>
                        <button
                            onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-slate-300 shadow-sm"
                        >
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
                            <span className="w-full border-t border-slate-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500 font-medium">O usa tu email</span>
                        </div>
                    </div>

                    {/* Traditional Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#0A0A15] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-3 pl-11 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A0A15]/20 focus:border-[#0A0A15] transition-all font-medium"
                                    placeholder="nombre@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                                <a href="#" className="text-xs font-semibold text-blue-700 hover:text-[#0A0A15]">¿Olvidaste tu clave?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#0A0A15] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-3 pl-11 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A0A15]/20 focus:border-[#0A0A15] transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0A0A15] hover:bg-[#151525] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-6"
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
