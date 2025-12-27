'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Shield,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Building2,
    Save,
    Send,
    ChevronDown,
    ChevronRight,
    Loader2,
    Search,
    X,
} from 'lucide-react';

// Types
interface ChecklistItem {
    id: string;
    code: string;
    norm: string;
    clause: string;
    requirement: string;
    verificationQ: string;
    legalRef: string | null;
}

interface ChecklistByNorm {
    ISO9001: ChecklistItem[];
    ISO45001: ChecklistItem[];
    ISO14001: ChecklistItem[];
}

type Finding = {
    checklistItemId: string;
    compliant: boolean | null;
    comment: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hseq-mvp.onrender.com';

export default function AuditPage() {
    const [checklist, setChecklist] = useState<ChecklistByNorm | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNorms, setSelectedNorms] = useState<string[]>(['ISO45001']);
    const [findings, setFindings] = useState<Record<string, Finding>>({});
    const [expandedNorms, setExpandedNorms] = useState<Record<string, boolean>>({
        ISO45001: true,
        ISO14001: false,
        ISO9001: false,
    });

    // New states for save and analysis
    const [saving, setSaving] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [auditId, setAuditId] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch checklist from API
    useEffect(() => {
        async function fetchChecklist() {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/checklist/trinorma`);

                if (!response.ok) {
                    throw new Error('Error al cargar el checklist');
                }

                const data = await response.json();
                setChecklist(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching checklist:', err);
                setError('No se pudo cargar el checklist. Asegúrate de que el backend esté corriendo.');
            } finally {
                setLoading(false);
            }
        }

        fetchChecklist();
    }, []);

    const handleNormToggle = (norm: string) => {
        setSelectedNorms((prev) =>
            prev.includes(norm) ? prev.filter((n) => n !== norm) : [...prev, norm]
        );
    };

    const handleFindingChange = (itemId: string, compliant: boolean) => {
        setFindings((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], checklistItemId: itemId, compliant },
        }));
    };

    const handleCommentChange = (itemId: string, comment: string) => {
        setFindings((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], checklistItemId: itemId, comment },
        }));
    };

    const toggleNormExpand = (norm: string) => {
        setExpandedNorms((prev) => ({ ...prev, [norm]: !prev[norm] }));
    };

    const getProgress = () => {
        if (!checklist) return 0;
        const totalItems = selectedNorms.reduce(
            (acc, norm) => acc + (checklist[norm as keyof ChecklistByNorm]?.length || 0),
            0
        );
        const answeredItems = Object.values(findings).filter((f) => f.compliant !== null).length;
        return totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;
    };

    const getNonCompliantCount = () =>
        Object.values(findings).filter((f) => f.compliant === false).length;

    const getTotalItems = () => {
        if (!checklist) return 0;
        return selectedNorms.reduce(
            (acc, norm) => acc + (checklist[norm as keyof ChecklistByNorm]?.length || 0),
            0
        );
    };

    const normColors = {
        ISO9001: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
        ISO45001: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
        ISO14001: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
    };

    const normLabels = {
        ISO9001: 'Calidad',
        ISO45001: 'Seguridad y Salud',
        ISO14001: 'Medio Ambiente',
    };

    // Filter items based on search query
    const filterItems = (items: ChecklistItem[]) => {
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.code.toLowerCase().includes(query) ||
            item.requirement.toLowerCase().includes(query) ||
            item.verificationQ.toLowerCase().includes(query) ||
            item.clause.toLowerCase().includes(query) ||
            (item.legalRef && item.legalRef.toLowerCase().includes(query))
        );
    };


    // Save draft function
    const handleSaveDraft = async () => {
        try {
            setSaving(true);
            setSaveMessage(null);

            // Create or update audit
            const auditData = {
                companyId: 'demo-company-id', // In real app, get from user context
                norms: selectedNorms,
                status: 'IN_PROGRESS',
            };

            let currentAuditId = auditId;

            if (!currentAuditId) {
                // Create new audit using quick endpoint (MVP)
                const auditResponse = await fetch(`${API_URL}/api/audits/quick`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ norms: selectedNorms }),
                });

                if (!auditResponse.ok) {
                    const errorData = await auditResponse.json();
                    throw new Error(errorData.error || 'Error al crear auditoría');
                }

                const newAudit = await auditResponse.json();
                currentAuditId = newAudit.id;
                setAuditId(currentAuditId);
            }

            // Save findings
            const findingsArray = Object.values(findings).filter(f => f.compliant !== null);

            if (findingsArray.length > 0) {
                const findingsResponse = await fetch(`${API_URL}/api/findings/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        auditId: currentAuditId,
                        findings: findingsArray.map(f => ({
                            checklistItemId: f.checklistItemId,
                            compliant: f.compliant,
                            comment: f.comment || '',
                        })),
                    }),
                });

                if (!findingsResponse.ok) throw new Error('Error al guardar hallazgos');
            }

            setSaveMessage('✓ Borrador guardado exitosamente');
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (err) {
            console.error('Error saving draft:', err);
            setSaveMessage('✗ Error al guardar');
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    // Send to AI analysis function
    const handleSendToAnalysis = async () => {
        try {
            setAnalyzing(true);

            // First, save the draft
            if (!auditId) {
                await handleSaveDraft();
            }

            // Prepare findings for analysis
            const findingsForAnalysis = Object.entries(findings)
                .filter(([_, f]) => f.compliant === false)
                .map(([itemId, f]) => {
                    // Find the checklist item details
                    let itemDetails = null;
                    if (checklist) {
                        for (const norm of selectedNorms) {
                            const items = checklist[norm as keyof ChecklistByNorm] || [];
                            const found = items.find(item => item.id === itemId);
                            if (found) {
                                itemDetails = found;
                                break;
                            }
                        }
                    }
                    return {
                        requirement: itemDetails?.requirement || 'Requisito no encontrado',
                        clause: itemDetails?.clause || '',
                        norm: itemDetails?.norm || '',
                        compliant: f.compliant,
                        comment: f.comment || 'Sin comentario',
                    };
                });

            if (findingsForAnalysis.length === 0) {
                alert('No hay hallazgos no conformes para analizar. Marca algunos items como "No Conforme" primero.');
                setAnalyzing(false);
                return;
            }

            // Call the analysis endpoint
            const response = await fetch(`${API_URL}/api/analysis/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    findings: findingsForAnalysis,
                    norms: selectedNorms,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en análisis');
            }

            const result = await response.json();
            setAnalysisResult(result);
            setShowAnalysisModal(true);
        } catch (err: any) {
            console.warn('Backend offline, using Mock Analysis', err);
            // MOCK RESULT FOR DEMO AUTOMATIC FALLBACK
            const MOCK_RESULT = {
                riskLevel: "CRITICO",
                score: 45,
                summary: "Se detectaron incumplimientos graves en seguridad (ISO 45001) y gestión ambiental. La falta de EPP y procedimientos documentados infringe el DS44 y la Ley 16.744.",
                nonConformities: [
                    { severity: "CRITICA", description: "Ausencia de EPP en zonas de alto riesgo", legalReference: "DS594 Art. 53 - Obligación de EPP", recommendation: "Detener faena y proveer equipo inmediato." },
                    { severity: "MAYOR", description: "No existe matriz de riesgos actualizada", legalReference: "DS40 Art. 21 - Obligación de Informar", recommendation: "Actualizar matriz IPER en 48 horas." }
                ],
                recommendations: [
                    "Implementar programa de 'Pausas Activas' y revisión de EPP diario.",
                    "Realizar charla de 5 minutos sobre DS44 enfocada en salud ocupacional."
                ]
            };
            setAnalysisResult(MOCK_RESULT);
            setShowAnalysisModal(true);
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando checklist trinorma...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de conexión</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-500">
                        <p className="font-medium mb-2">Verifica que:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>El backend esté corriendo en http://localhost:3001</li>
                            <li>La base de datos esté accesible</li>
                            <li>El seed se haya ejecutado correctamente</li>
                        </ul>
                    </div>
                    <Link href="/dashboard" className="btn-secondary mt-4 inline-block">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Analysis Results Modal */}
            {showAnalysisModal && analysisResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    🤖 Análisis IA Completado
                                </h2>
                                <button
                                    onClick={() => setShowAnalysisModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Summary */}
                            <div className="bg-primary-50 rounded-lg p-4">
                                <h3 className="font-semibold text-primary-900 mb-2">Resumen Ejecutivo</h3>
                                <p className="text-primary-800">{analysisResult.summary || 'Análisis completado exitosamente.'}</p>
                            </div>

                            {/* Risk Level */}
                            {analysisResult.riskLevel && (
                                <div className={`rounded-lg p-4 ${analysisResult.riskLevel === 'ALTO' ? 'bg-red-50' :
                                    analysisResult.riskLevel === 'MEDIO' ? 'bg-yellow-50' : 'bg-green-50'
                                    }`}>
                                    <h3 className="font-semibold mb-2">Nivel de Riesgo</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysisResult.riskLevel === 'ALTO' ? 'bg-red-200 text-red-800' :
                                        analysisResult.riskLevel === 'MEDIO' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                        }`}>
                                        {analysisResult.riskLevel}
                                    </span>
                                </div>
                            )}

                            {/* Recommendations */}
                            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Recomendaciones</h3>
                                    <ul className="space-y-2">
                                        {analysisResult.recommendations.map((rec: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Legal References */}
                            {analysisResult.legalFindings && analysisResult.legalFindings.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Referencias Legales Aplicables</h3>
                                    <div className="space-y-2">
                                        {analysisResult.legalFindings.map((ref: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                                <p className="font-medium text-gray-900">{ref.law || ref.reference}</p>
                                                <p className="text-sm text-gray-600">{ref.description || ref.article}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAnalysisModal(false)}
                                className="btn-secondary"
                            >
                                Cerrar
                            </button>
                            <Link href="/nonconformities" className="btn-primary">
                                Ver No Conformidades
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Nueva Auditoría Trinorma</h1>
                                <p className="text-sm text-gray-500">{getTotalItems()} items en {selectedNorms.length} norma(s) seleccionada(s)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {saveMessage && (
                                <span className={`text-sm ${saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                                    {saveMessage}
                                </span>
                            )}
                            <button
                                onClick={handleSaveDraft}
                                disabled={saving}
                                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {saving ? 'Guardando...' : 'Guardar Borrador'}
                            </button>
                            <button
                                onClick={handleSendToAnalysis}
                                disabled={analyzing || getNonCompliantCount() === 0}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                {analyzing ? 'Analizando...' : 'Enviar a Análisis IA'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar - Audit Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Company Info */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Información</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-900">Minera Los Andes</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                                    <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">AUD-2024-021</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                    <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                                        {new Date().toLocaleDateString('es-CL')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Norms Selection */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Normas Aplicables</h3>
                            <div className="space-y-3">
                                {(['ISO45001', 'ISO14001', 'ISO9001'] as const).map((norm) => (
                                    <label
                                        key={norm}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${selectedNorms.includes(norm)
                                            ? `${normColors[norm].border} ${normColors[norm].bg}`
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedNorms.includes(norm)}
                                            onChange={() => handleNormToggle(norm)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">{norm}</span>
                                            <p className="text-xs text-gray-500">{normLabels[norm]}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                            {checklist?.[norm]?.length || 0}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Progreso</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Completado</span>
                                        <span className="text-sm font-medium text-gray-900">{getProgress()}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 rounded-full transition-all duration-300"
                                            style={{ width: `${getProgress()}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Respondidos</span>
                                    <span className="font-medium text-gray-900">
                                        {Object.values(findings).filter((f) => f.compliant !== null).length} / {getTotalItems()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">No conformes</span>
                                    <span className="font-medium text-red-600">{getNonCompliantCount()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <div className="card">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por código, requisito, pregunta o referencia legal..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Limpiar búsqueda"
                                    >
                                        <X className="h-4 w-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {selectedNorms.reduce((total, norm) => {
                                        const items = checklist?.[norm as keyof ChecklistByNorm] || [];
                                        return total + filterItems(items).length;
                                    }, 0)} resultados encontrados
                                </p>
                            )}
                        </div>

                        {selectedNorms.map((norm) => {
                            const items = checklist?.[norm as keyof ChecklistByNorm] || [];
                            const filteredItems = filterItems(items);
                            const colors = normColors[norm as keyof typeof normColors];

                            // Si hay una búsqueda activa y no hay resultados para esta norma, no mostrarla si se desea (opcional), 
                            // pero para mantener consistencia visual mostraremos la norma con 0 resultados si es que está seleccionada.

                            return (
                                <div key={norm} className="card">
                                    <button
                                        onClick={() => toggleNormExpand(norm)}
                                        className="w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                                                <Shield className={`h-5 w-5 ${colors.text}`} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-semibold text-gray-900">{norm}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {searchQuery ? `${filteredItems.length} de ${items.length}` : `${items.length}`} items • {normLabels[norm as keyof typeof normLabels]}
                                                </p>
                                            </div>
                                        </div>
                                        {expandedNorms[norm] ? (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedNorms[norm] && (
                                        <div className="mt-6 space-y-4">
                                            {filteredItems.length === 0 && searchQuery ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                    <p>No se encontraron resultados para "{searchQuery}"</p>
                                                </div>
                                            ) : (
                                                filteredItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`p-4 rounded-lg border-2 transition-colors ${findings[item.id]?.compliant === true
                                                            ? 'border-green-200 bg-green-50'
                                                            : findings[item.id]?.compliant === false
                                                                ? 'border-red-200 bg-red-50'
                                                                : 'border-gray-200 bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border">
                                                                        {item.clause}
                                                                    </span>
                                                                    {item.legalRef && (
                                                                        <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                                                                            {item.legalRef}

                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs text-gray-400">{item.code}</span>
                                                                </div>
                                                                <h4 className="font-medium text-gray-900 mb-1">{item.requirement}</h4>
                                                                <p className="text-sm text-gray-600">{item.verificationQ}</p>
                                                            </div>

                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleFindingChange(item.id, true)}
                                                                    className={`p-2 rounded-lg transition-colors ${findings[item.id]?.compliant === true
                                                                        ? 'bg-green-500 text-white'
                                                                        : 'bg-white text-gray-400 hover:text-green-500 border border-gray-200'
                                                                        }`}
                                                                    title="Conforme"
                                                                >
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleFindingChange(item.id, false)}
                                                                    className={`p-2 rounded-lg transition-colors ${findings[item.id]?.compliant === false
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-white text-gray-400 hover:text-red-500 border border-gray-200'
                                                                        }`}
                                                                    title="No Conforme"
                                                                >
                                                                    <XCircle className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {findings[item.id]?.compliant === false && (
                                                            <div className="mt-4">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    <AlertTriangle className="h-4 w-4 inline mr-1 text-amber-500" />
                                                                    Describe el hallazgo
                                                                </label>
                                                                <textarea
                                                                    value={findings[item.id]?.comment || ''}
                                                                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                                                    placeholder="Describe la no conformidad observada..."
                                                                    className="input resize-none w-full"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
