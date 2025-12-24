/**
 * Groq LLM Service
 * Análisis de auditorías con Llama 3.1
 */

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisInput {
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

    const completion = await groq.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from Groq LLM');
    }

    return JSON.parse(content) as AnalysisResult;
}

export async function classifyNCSeverity(
    finding: string,
    context: string
): Promise<{ severity: 'CRITICAL' | 'MAJOR' | 'MINOR'; reason: string }> {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `Clasifica la severidad de no conformidades HSEQ según normativa chilena.
CRITICAL: Riesgo vida/salud, Ley 16.744 Art 184
MAJOR: Incumplimiento significativo DS44/DS40
MINOR: Observación menor
Responde en JSON: {"severity": "...", "reason": "..."}`,
            },
            {
                role: 'user',
                content: `Hallazgo: ${finding}\nContexto: ${context}`,
            },
        ],
        temperature: 0.1,
        max_tokens: 256,
        response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No response from Groq LLM');
    }

    return JSON.parse(content);
}
