/**
 * Pinecone Vector DB Service
 * RAG para normativa chilena (Ley16.744, DS44, DS40)
 * NOTA: Este servicio es OPCIONAL - funciona sin API key
 */

// Lazy initialization - solo se inicializa si hay API key
let pineconeClient: any = null;

const INDEX_NAME = 'hseq-normativa-chile';

function getPineconeClient() {
    if (!process.env.PINECONE_API_KEY) {
        console.warn('[PINECONE] API key not configured - RAG features disabled');
        return null;
    }

    if (!pineconeClient) {
        const { Pinecone } = require('@pinecone-database/pinecone');
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }

    return pineconeClient;
}

export interface NormChunk {
    id: string;
    norm: string;
    article: string;
    content: string;
    keywords: string[];
}

export interface SearchResult {
    id: string;
    score: number;
    norm: string;
    article: string;
    content: string;
}

/**
 * Buscar normativa relevante para un hallazgo
 */
export async function searchNormativa(
    query: string,
    topK: number = 5
): Promise<SearchResult[]> {
    const client = getPineconeClient();

    if (!client) {
        // Return mock data when Pinecone is not configured
        return getMockNormativaResults(query);
    }

    const index = client.index(INDEX_NAME);
    const queryEmbedding = await generateEmbedding(query);

    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
    });

    return results.matches.map((match: any) => ({
        id: match.id,
        score: match.score || 0,
        norm: (match.metadata?.norm as string) || '',
        article: (match.metadata?.article as string) || '',
        content: (match.metadata?.content as string) || '',
    }));
}

/**
 * Mock results when Pinecone is not configured
 */
function getMockNormativaResults(query: string): SearchResult[] {
    const mockData: SearchResult[] = [
        {
            id: 'ley16744-art184',
            score: 0.95,
            norm: 'Ley 16.744',
            article: 'Art. 184',
            content: 'El empleador estará obligado a tomar todas las medidas necesarias para proteger eficazmente la vida y salud de los trabajadores.',
        },
        {
            id: 'ds40-art21',
            score: 0.88,
            norm: 'DS 40',
            article: 'Art. 21',
            content: 'Los empleadores tienen la obligación de informar oportuna y convenientemente a todos sus trabajadores acerca de los riesgos que entrañan sus labores.',
        },
        {
            id: 'ds44-art5',
            score: 0.82,
            norm: 'DS 594',
            article: 'Art. 5',
            content: 'Los locales de trabajo deberán mantenerse en buen estado de limpieza, higiene y señalizados.',
        },
    ];

    return mockData;
}

/**
 * Generar embedding (placeholder)
 */
async function generateEmbedding(text: string): Promise<number[]> {
    const dimension = 1536;
    const embedding = new Array(dimension).fill(0);

    const words = text.toLowerCase().split(/\s+/);
    words.forEach((word, idx) => {
        const hash = simpleHash(word);
        embedding[hash % dimension] += 1 / (idx + 1);
    });

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map((val) => val / (magnitude || 1));
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Obtener contexto legal para prompt LLM
 */
export async function getLegalContext(query: string): Promise<string> {
    const results = await searchNormativa(query, 3);

    if (results.length === 0) {
        return 'No se encontró normativa específica aplicable.';
    }

    return results
        .map((r) => `${r.norm} ${r.article}: ${r.content}`)
        .join('\n\n');
}

/**
 * Buscar artículos relevantes por contexto de auditoría
 */
export async function findRelevantArticles(
    findingDescription: string,
    norm: 'LEY16744' | 'DS44' | 'DS40' | 'ALL',
    minScore: number = 0.7
): Promise<SearchResult[]> {
    const results = await searchNormativa(findingDescription, 10);

    return results
        .filter((r) => r.score >= minScore)
        .filter((r) => norm === 'ALL' || r.norm.includes(norm.replace(/[^A-Z0-9]/g, '')));
}
