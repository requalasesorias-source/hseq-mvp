import Link from 'next/link';
import {
    ClipboardCheck,
    Shield,
    Leaf,
    Award,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    FileText
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">HSEQ MVP</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/login" className="btn-primary flex items-center gap-2">
                                Iniciar Sesión
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Award className="h-4 w-4" />
                        Cumplimiento Ley 16.744 • DS44 • ISO 19011
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Sistema de Auditorías
                        <span className="text-primary-600"> Trinorma</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Gestiona auditorías ISO 9001, ISO 45001 e ISO 14001 con análisis LLM inteligente
                        y cumplimiento automático de normativa chilena.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/audit" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5" />
                            Nueva Auditoría
                        </Link>
                        <Link href="/dashboard" className="btn-secondary text-lg px-8 py-3">
                            Ver Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* ISO 45001 */}
                    <div className="card hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">ISO 45001</h3>
                        <p className="text-gray-600 mb-4">
                            Seguridad y salud en el trabajo con referencias a Ley 16.744 y DS40.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Identificación de peligros
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Evaluación de riesgos
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Controles operacionales
                            </li>
                        </ul>
                    </div>

                    {/* ISO 14001 */}
                    <div className="card hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <Leaf className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">ISO 14001</h3>
                        <p className="text-gray-600 mb-4">
                            Gestión ambiental con cumplimiento Ley 19.300 y DS594.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Aspectos ambientales
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Requisitos legales
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Preparación emergencias
                            </li>
                        </ul>
                    </div>

                    {/* ISO 9001 */}
                    <div className="card hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">ISO 9001</h3>
                        <p className="text-gray-600 mb-4">
                            Sistema de gestión de calidad con mejora continua.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Control de procesos
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Satisfacción cliente
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                No conformidades
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* AI Analysis Section */}
            <section className="bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-primary-900/50 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                🤖 Powered by AI
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Análisis Inteligente con LLM
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Nuestro sistema analiza automáticamente los hallazgos de auditoría,
                                clasifica no conformidades y sugiere acciones correctivas basadas en
                                normativa chilena.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Clasificación Automática</h4>
                                        <p className="text-gray-400 text-sm">
                                            NCs clasificadas como CRÍTICA, MAYOR o MENOR según severidad
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Citación Legal</h4>
                                        <p className="text-gray-400 text-sm">
                                            Referencias precisas a Ley 16.744, DS44 y artículos específicos
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">CAPA Sugerido</h4>
                                        <p className="text-gray-400 text-sm">
                                            Acciones correctivas y preventivas recomendadas por IA
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                                {`{
  "analysis": {
    "riskLevel": "ALTO",
    "nonConformities": [
      {
        "severity": "CRITICAL",
        "description": "Falta EPP en zona de trabajo",
        "legalRef": "Ley 16.744 Art. 184",
        "suggestedCapa": "Proveer EPP 
          inmediatamente"
      }
    ],
    "recommendations": [
      "Capacitar personal en uso EPP",
      "Implementar supervisión diaria"
    ]
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary-600" />
                            <span className="font-semibold text-gray-900">HSEQ MVP Chile</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2024 Cumplimiento: Ley 16.744 • DS44 • ISO 9001/45001/14001
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
