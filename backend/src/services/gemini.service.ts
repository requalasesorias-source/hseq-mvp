/**
 * Gemini LLM Service
 * Análisis de auditorías con Google Gemini
 */

// Google Generative AI SDK
// npm install @google/generative-ai

interface AnalysisInput {
    findings: {
        id: string;
        requirement: string;
        compliant: boolean;
        comment?: string;
    }[];
    auditType: string;
    norms: string[];
}

export interface AnalysisResult {
    summary: string;
    riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
    nonConformities: {
        findingId: string;
        severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
        description: string;
        legalReference: string;
        suggestedCapa: string;
    }[];
    recommendations: string[];
    legalFindings: {
        norm: string;
        article: string;
        relevance: string;
    }[];
}

const SYSTEM_PROMPT = `Eres un experto auditor HSEQ especializado en normativa chilena.

Tu rol es analizar hallazgos de auditorías y:
1. Clasificar no conformidades por severidad (CRITICAL/MAJOR/MINOR)
2. Referenciar artículos específicos de Ley 16.744, DS44, DS40
3. Sugerir acciones correctivas basadas en ISO 19011

SEVERIDAD:
- CRITICAL: Riesgo inminente para la vida, incumplimiento grave Ley 16.744 Art. 184
- MAJOR: Incumplimiento significativo de requisitos ISO o normativa DS44
- MINOR: Observaciones menores, oportunidades de mejora

Responde SIEMPRE en JSON válido con la estructura solicitada.`;

export async function analyzeFindings(input: AnalysisInput): Promise<AnalysisResult> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const userPrompt = `
Analiza los siguientes hallazgos de auditoría:

TIPO DE AUDITORÍA: ${input.auditType}
NORMAS APLICABLES: ${input.norms.join(', ')}

HALLAZGOS:
${input.findings.map((f, i) => `
${i + 1}. Requisito: ${f.requirement}
   Conforme: ${f.compliant ? 'SÍ' : 'NO'}
   Comentario: ${f.comment || 'Sin comentarios'}
`).join('\n')}

Genera un análisis completo en JSON con:
{
  "summary": "Resumen ejecutivo del estado de cumplimiento",
  "riskLevel": "ALTO|MEDIO|BAJO",
  "nonConformities": [
    {
      "findingId": "id del hallazgo",
      "severity": "CRITICAL|MAJOR|MINOR",
      "description": "Descripción de la NC",
      "legalReference": "Ley/DS y artículo específico",
      "suggestedCapa": "Acción correctiva sugerida"
    }
  ],
  "recommendations": ["Lista de recomendaciones prioritarias"],
  "legalFindings": [
    {
      "norm": "Nombre de la norma",
      "article": "Artículo aplicable",
      "relevance": "Por qué aplica"
    }
  ]
}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: SYSTEM_PROMPT + '\n\n' + userPrompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
        throw new Error('No response from Gemini');
    }

    return JSON.parse(content) as AnalysisResult;
}

export async function classifyNCSeverity(
    finding: string,
    context: string
): Promise<{ severity: 'CRITICAL' | 'MAJOR' | 'MINOR'; reason: string }> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = `Clasifica la severidad de esta no conformidad HSEQ según normativa chilena.

CRITICAL: Riesgo vida/salud, Ley 16.744 Art 184
MAJOR: Incumplimiento significativo DS44/DS40
MINOR: Observación menor

Hallazgo: ${finding}
Contexto: ${context}

Responde en JSON: {"severity": "CRITICAL|MAJOR|MINOR", "reason": "explicación breve"}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 256,
                    responseMimeType: 'application/json',
                },
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Gemini API error');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
        throw new Error('No response from Gemini');
    }

    return JSON.parse(content);
}
