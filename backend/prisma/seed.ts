/**
 * Prisma Database Seed - Checklist Trinorma Mejorado
 * Basado en los textos oficiales de ISO 9001:2015, 45001:2018, 14001:2015
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database con checklist trinorma mejorado...');

    // ===========================================
    // CHECKLIST ITEMS - TRINORMA PRECISO
    // Basado en textos reales de las normas ISO
    // ===========================================
    console.log('  → Seeding checklist items trinorma...');

    const checklistItems = [
        // ============================================
        // CLÁUSULA 4 - CONTEXTO DE LA ORGANIZACIÓN
        // ============================================

        // ISO 9001:2015 - 4.1
        {
            code: 'ISO9001-4.1-001',
            norm: 'ISO9001',
            clause: '4.1',
            requirement: 'Comprensión de la organización y su contexto',
            verificationQ: '¿La organización ha determinado las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos del SGC?',
            legalRef: null,
        },
        // ISO 45001:2018 - 4.1
        {
            code: 'ISO45001-4.1-001',
            norm: 'ISO45001',
            clause: '4.1',
            requirement: 'Comprensión de la organización y de su contexto',
            verificationQ: '¿La organización ha determinado las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para alcanzar los resultados previstos del sistema de gestión de la SST?',
            legalRef: 'Ley 16.744 Art. 184',
        },
        // ISO 14001:2015 - 4.1
        {
            code: 'ISO14001-4.1-001',
            norm: 'ISO14001',
            clause: '4.1',
            requirement: 'Comprensión de la organización y su contexto',
            verificationQ: '¿La organización ha determinado las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos del SGA?',
            legalRef: 'Ley 19.300',
        },

        // 4.2 - Partes Interesadas
        {
            code: 'ISO9001-4.2-001',
            norm: 'ISO9001',
            clause: '4.2',
            requirement: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            verificationQ: '¿Se han determinado las partes interesadas pertinentes al SGC y sus requisitos?',
            legalRef: null,
        },
        {
            code: 'ISO45001-4.2-001',
            norm: 'ISO45001',
            clause: '4.2',
            requirement: 'Comprensión de las necesidades y expectativas de los trabajadores y otras partes interesadas',
            verificationQ: '¿Se han determinado las partes interesadas pertinentes al SGSST y las necesidades y expectativas de los trabajadores?',
            legalRef: 'Ley 16.744 Art. 66',
        },
        {
            code: 'ISO14001-4.2-001',
            norm: 'ISO14001',
            clause: '4.2',
            requirement: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            verificationQ: '¿Se han determinado las partes interesadas pertinentes al SGA y sus necesidades y expectativas relevantes?',
            legalRef: 'Ley 19.300 Art. 4',
        },

        // 4.3 - Alcance
        {
            code: 'ISO9001-4.3-001',
            norm: 'ISO9001',
            clause: '4.3',
            requirement: 'Determinación del alcance del SGC',
            verificationQ: '¿Se ha determinado y documentado el alcance del SGC considerando cuestiones externas/internas, partes interesadas y productos/servicios?',
            legalRef: null,
        },
        {
            code: 'ISO45001-4.3-001',
            norm: 'ISO45001',
            clause: '4.3',
            requirement: 'Determinación del alcance del sistema de gestión de la SST',
            verificationQ: '¿Se ha determinado el alcance del SGSST considerando las actividades relacionadas con el trabajo, planificadas o realizadas?',
            legalRef: 'DS 40 Art. 3',
        },
        {
            code: 'ISO14001-4.3-001',
            norm: 'ISO14001',
            clause: '4.3',
            requirement: 'Determinación del alcance del SGA',
            verificationQ: '¿Se ha determinado el alcance del SGA considerando límites físicos y organizativos, actividades, productos y servicios?',
            legalRef: 'Ley 19.300',
        },

        // 4.4 - Sistema de Gestión
        {
            code: 'ISO9001-4.4-001',
            norm: 'ISO9001',
            clause: '4.4',
            requirement: 'Sistema de gestión de la calidad y sus procesos',
            verificationQ: '¿La organización ha establecido, implementado, mantenido y mejorado continuamente el SGC incluyendo los procesos necesarios y sus interacciones?',
            legalRef: null,
        },
        {
            code: 'ISO45001-4.4-001',
            norm: 'ISO45001',
            clause: '4.4',
            requirement: 'Sistema de gestión de la SST',
            verificationQ: '¿La organización ha establecido, implementado, mantenido y mejorado continuamente el SGSST, incluidos los procesos necesarios y sus interacciones?',
            legalRef: 'Ley 16.744 Art. 184',
        },
        {
            code: 'ISO14001-4.4-001',
            norm: 'ISO14001',
            clause: '4.4',
            requirement: 'Sistema de gestión ambiental',
            verificationQ: '¿La organización ha establecido, implementado, mantenido y mejorado continuamente el SGA, incluyendo los procesos necesarios y sus interacciones?',
            legalRef: 'Ley 19.300',
        },

        // ============================================
        // CLÁUSULA 5 - LIDERAZGO
        // ============================================

        {
            code: 'ISO9001-5.1-001',
            norm: 'ISO9001',
            clause: '5.1',
            requirement: 'Liderazgo y compromiso',
            verificationQ: '¿La alta dirección demuestra liderazgo y compromiso asegurando la integración del SGC en los procesos de negocio y promoviendo el enfoque a procesos y el pensamiento basado en riesgos?',
            legalRef: null,
        },
        {
            code: 'ISO45001-5.1-001',
            norm: 'ISO45001',
            clause: '5.1',
            requirement: 'Liderazgo y compromiso',
            verificationQ: '¿La alta dirección asume la total responsabilidad y rendición de cuentas para la prevención de lesiones y deterioro de la salud relacionados con el trabajo?',
            legalRef: 'Ley 16.744 Art. 184',
        },
        {
            code: 'ISO14001-5.1-001',
            norm: 'ISO14001',
            clause: '5.1',
            requirement: 'Liderazgo y compromiso',
            verificationQ: '¿La alta dirección demuestra liderazgo y compromiso asegurando que se establezca la política ambiental y los objetivos ambientales compatibles con la dirección estratégica?',
            legalRef: 'Ley 19.300',
        },

        // 5.2 - Política
        {
            code: 'ISO9001-5.2-001',
            norm: 'ISO9001',
            clause: '5.2',
            requirement: 'Política de la calidad',
            verificationQ: '¿La política de calidad es apropiada al propósito, incluye compromiso de mejora continua, proporciona marco para objetivos y está documentada, comunicada y disponible?',
            legalRef: null,
        },
        {
            code: 'ISO45001-5.2-001',
            norm: 'ISO45001',
            clause: '5.2',
            requirement: 'Política de la SST',
            verificationQ: '¿La política de SST incluye compromiso para proporcionar condiciones de trabajo seguras, eliminar peligros, reducir riesgos, y consulta y participación de los trabajadores?',
            legalRef: 'DS 40 Art. 3',
        },
        {
            code: 'ISO14001-5.2-001',
            norm: 'ISO14001',
            clause: '5.2',
            requirement: 'Política ambiental',
            verificationQ: '¿La política ambiental incluye compromiso de protección del medio ambiente, prevención de la contaminación, cumplimiento de requisitos legales y mejora continua?',
            legalRef: 'Ley 19.300 Art. 4',
        },

        // 5.3 - Roles y Responsabilidades
        {
            code: 'ISO9001-5.3-001',
            norm: 'ISO9001',
            clause: '5.3',
            requirement: 'Roles, responsabilidades y autoridades en la organización',
            verificationQ: '¿La alta dirección ha asignado, comunicado y entendido las responsabilidades y autoridades para roles pertinentes del SGC?',
            legalRef: null,
        },
        {
            code: 'ISO45001-5.3-001',
            norm: 'ISO45001',
            clause: '5.3',
            requirement: 'Roles, responsabilidades y autoridades en la organización',
            verificationQ: '¿Las responsabilidades y autoridades para roles pertinentes del SGSST están asignadas, comunicadas y mantenidas como información documentada?',
            legalRef: 'DS 40 Art. 14',
        },
        {
            code: 'ISO14001-5.3-001',
            norm: 'ISO14001',
            clause: '5.3',
            requirement: 'Roles, responsabilidades y autoridades en la organización',
            verificationQ: '¿La alta dirección ha asignado, comunicado y entendido las responsabilidades y autoridades para los roles pertinentes del SGA?',
            legalRef: 'Ley 19.300',
        },

        // 5.4 - Consulta y participación (solo ISO 45001)
        {
            code: 'ISO45001-5.4-001',
            norm: 'ISO45001',
            clause: '5.4',
            requirement: 'Consulta y participación de los trabajadores',
            verificationQ: '¿Se han establecido, implementado y mantenido procesos para la consulta y participación de los trabajadores a todos los niveles y funciones aplicables?',
            legalRef: 'Ley 16.744 Art. 66',
        },

        // ============================================
        // CLÁUSULA 6 - PLANIFICACIÓN
        // ============================================

        {
            code: 'ISO9001-6.1-001',
            norm: 'ISO9001',
            clause: '6.1',
            requirement: 'Acciones para abordar riesgos y oportunidades',
            verificationQ: '¿Se han determinado los riesgos y oportunidades relacionados con el contexto y las partes interesadas, y se han planificado acciones para abordarlos?',
            legalRef: null,
        },
        {
            code: 'ISO45001-6.1.1-001',
            norm: 'ISO45001',
            clause: '6.1.1',
            requirement: 'Generalidades de planificación',
            verificationQ: '¿Se han considerado los riesgos y oportunidades relacionados con cuestiones del contexto, partes interesadas y alcance del SGSST?',
            legalRef: 'Ley 16.744 Art. 184',
        },
        {
            code: 'ISO45001-6.1.2-001',
            norm: 'ISO45001',
            clause: '6.1.2',
            requirement: 'Identificación de peligros y evaluación de riesgos y oportunidades',
            verificationQ: '¿Existe un proceso proactivo y continuo para la identificación de peligros y evaluación de riesgos que considere actividades rutinarias y no rutinarias?',
            legalRef: 'DS 40 Art. 21',
        },
        {
            code: 'ISO45001-6.1.3-001',
            norm: 'ISO45001',
            clause: '6.1.3',
            requirement: 'Determinación de los requisitos legales y otros requisitos',
            verificationQ: '¿Se han determinado y se tiene acceso a los requisitos legales y otros requisitos aplicables a los peligros y riesgos de SST?',
            legalRef: 'Ley 16.744, DS 40, DS 594',
        },
        {
            code: 'ISO14001-6.1.2-001',
            norm: 'ISO14001',
            clause: '6.1.2',
            requirement: 'Aspectos ambientales',
            verificationQ: '¿Se han identificado los aspectos ambientales de actividades, productos y servicios, y determinado cuáles son significativos?',
            legalRef: 'Ley 19.300 Art. 10',
        },
        {
            code: 'ISO14001-6.1.3-001',
            norm: 'ISO14001',
            clause: '6.1.3',
            requirement: 'Requisitos legales y otros requisitos',
            verificationQ: '¿Se han identificado y se tiene acceso a los requisitos legales y otros requisitos ambientales aplicables?',
            legalRef: 'Ley 19.300',
        },

        // 6.2 - Objetivos
        {
            code: 'ISO9001-6.2-001',
            norm: 'ISO9001',
            clause: '6.2',
            requirement: 'Objetivos de la calidad y planificación para lograrlos',
            verificationQ: '¿Se han establecido objetivos de calidad medibles, coherentes con la política, comunicados y actualizados según corresponda?',
            legalRef: null,
        },
        {
            code: 'ISO45001-6.2-001',
            norm: 'ISO45001',
            clause: '6.2',
            requirement: 'Objetivos de la SST y planificación para lograrlos',
            verificationQ: '¿Se han establecido objetivos de SST medibles, coherentes con la política, que tengan en cuenta los requisitos legales y la consulta con los trabajadores?',
            legalRef: 'DS 40 Art. 21',
        },
        {
            code: 'ISO14001-6.2-001',
            norm: 'ISO14001',
            clause: '6.2',
            requirement: 'Objetivos ambientales y planificación para lograrlos',
            verificationQ: '¿Se han establecido objetivos ambientales medibles, coherentes con la política y aspectos ambientales significativos?',
            legalRef: 'Ley 19.300',
        },

        // ============================================
        // CLÁUSULA 7 - APOYO
        // ============================================

        {
            code: 'ISO9001-7.2-001',
            norm: 'ISO9001',
            clause: '7.2',
            requirement: 'Competencia',
            verificationQ: '¿Se ha determinado la competencia necesaria del personal que afecta el desempeño del SGC y se asegura que cuenten con educación, formación o experiencia apropiadas?',
            legalRef: null,
        },
        {
            code: 'ISO45001-7.2-001',
            norm: 'ISO45001',
            clause: '7.2',
            requirement: 'Competencia',
            verificationQ: '¿Se ha determinado la competencia necesaria de los trabajadores que afecta el desempeño de la SST, incluyendo la capacidad de identificar peligros?',
            legalRef: 'DS 40 Art. 14',
        },
        {
            code: 'ISO14001-7.2-001',
            norm: 'ISO14001',
            clause: '7.2',
            requirement: 'Competencia',
            verificationQ: '¿Se ha asegurado que las personas que realizan trabajos que afectan el desempeño ambiental son competentes basándose en educación, formación o experiencia?',
            legalRef: 'Ley 19.300',
        },

        // 7.3 - Toma de conciencia
        {
            code: 'ISO45001-7.3-001',
            norm: 'ISO45001',
            clause: '7.3',
            requirement: 'Toma de conciencia',
            verificationQ: '¿Los trabajadores son conscientes de la política de SST, los peligros y riesgos, su contribución a la eficacia del SGSST y las implicaciones de no cumplir los requisitos?',
            legalRef: 'DS 40 Art. 21',
        },

        // 7.4 - Comunicación
        {
            code: 'ISO45001-7.4-001',
            norm: 'ISO45001',
            clause: '7.4',
            requirement: 'Comunicación',
            verificationQ: '¿Se han establecido procesos para las comunicaciones internas y externas pertinentes al SGSST, incluyendo qué, cuándo, a quién y cómo comunicar?',
            legalRef: 'DS 40 Art. 21',
        },

        // ============================================
        // CLÁUSULA 8 - OPERACIÓN
        // ============================================

        {
            code: 'ISO9001-8.1-001',
            norm: 'ISO9001',
            clause: '8.1',
            requirement: 'Planificación y control operacional',
            verificationQ: '¿Se han planificado, implementado y controlado los procesos necesarios para cumplir los requisitos de los productos y servicios?',
            legalRef: null,
        },
        {
            code: 'ISO45001-8.1.2-001',
            norm: 'ISO45001',
            clause: '8.1.2',
            requirement: 'Eliminar peligros y reducir riesgos para la SST',
            verificationQ: '¿Se ha aplicado la jerarquía de controles: eliminar peligros, sustituir, controles de ingeniería, controles administrativos, EPP?',
            legalRef: 'Ley 16.744 Art. 68',
        },
        {
            code: 'ISO14001-8.1-001',
            norm: 'ISO14001',
            clause: '8.1',
            requirement: 'Planificación y control operacional',
            verificationQ: '¿Se han establecido controles operacionales para los aspectos ambientales significativos y requisitos legales?',
            legalRef: 'DS 594',
        },

        // 8.2 - Preparación y respuesta ante emergencias
        {
            code: 'ISO45001-8.2-001',
            norm: 'ISO45001',
            clause: '8.2',
            requirement: 'Preparación y respuesta ante emergencias',
            verificationQ: '¿Se han establecido, implementado y mantenido procesos para prepararse y responder ante situaciones de emergencia potenciales?',
            legalRef: 'DS 40 Art. 21',
        },
        {
            code: 'ISO14001-8.2-001',
            norm: 'ISO14001',
            clause: '8.2',
            requirement: 'Preparación y respuesta ante emergencias',
            verificationQ: '¿Se han establecido procesos para responder a situaciones de emergencia ambiental, incluyendo pruebas periódicas de los planes?',
            legalRef: 'Ley 19.300',
        },

        // ============================================
        // CLÁUSULA 9 - EVALUACIÓN DEL DESEMPEÑO  
        // ============================================

        {
            code: 'ISO9001-9.1-001',
            norm: 'ISO9001',
            clause: '9.1',
            requirement: 'Seguimiento, medición, análisis y evaluación',
            verificationQ: '¿Se ha determinado qué necesita seguimiento y medición, los métodos, cuándo y cuándo se deben analizar los resultados?',
            legalRef: null,
        },
        {
            code: 'ISO45001-9.1.1-001',
            norm: 'ISO45001',
            clause: '9.1.1',
            requirement: 'Seguimiento, medición, análisis y evaluación',
            verificationQ: '¿Se realiza seguimiento y medición del desempeño de la SST, la eficacia de los controles operacionales y el cumplimiento de requisitos legales?',
            legalRef: 'DS 40 Art. 21',
        },
        {
            code: 'ISO14001-9.1.2-001',
            norm: 'ISO14001',
            clause: '9.1.2',
            requirement: 'Evaluación del cumplimiento',
            verificationQ: '¿Se evalúa periódicamente el cumplimiento de los requisitos legales y otros requisitos ambientales?',
            legalRef: 'Ley 19.300',
        },

        // 9.2 - Auditoría Interna
        {
            code: 'ISO9001-9.2-001',
            norm: 'ISO9001',
            clause: '9.2',
            requirement: 'Auditoría interna',
            verificationQ: '¿Se realizan auditorías internas a intervalos planificados para verificar la conformidad con requisitos propios y de la norma?',
            legalRef: null,
        },
        {
            code: 'ISO45001-9.2-001',
            norm: 'ISO45001',
            clause: '9.2',
            requirement: 'Auditoría interna',
            verificationQ: '¿Se realizan auditorías internas a intervalos planificados para verificar la conformidad del SGSST con requisitos propios, de la norma y legales?',
            legalRef: 'ISO 19011',
        },
        {
            code: 'ISO14001-9.2-001',
            norm: 'ISO14001',
            clause: '9.2',
            requirement: 'Auditoría interna',
            verificationQ: '¿Se realizan auditorías internas a intervalos planificados para verificar la conformidad del SGA?',
            legalRef: null,
        },

        // ============================================
        // CLÁUSULA 10 - MEJORA
        // ============================================

        {
            code: 'ISO9001-10.2-001',
            norm: 'ISO9001',
            clause: '10.2',
            requirement: 'No conformidad y acción correctiva',
            verificationQ: '¿Existe un proceso para reaccionar ante no conformidades, evaluar la necesidad de acciones correctivas y revisar su eficacia?',
            legalRef: null,
        },
        {
            code: 'ISO45001-10.2-001',
            norm: 'ISO45001',
            clause: '10.2',
            requirement: 'Incidentes, no conformidades y acciones correctivas',
            verificationQ: '¿Se investigan los incidentes y no conformidades para determinar causas y acciones correctivas, con participación de los trabajadores?',
            legalRef: 'Ley 16.744 Art. 76',
        },
        {
            code: 'ISO14001-10.2-001',
            norm: 'ISO14001',
            clause: '10.2',
            requirement: 'No conformidad y acción correctiva',
            verificationQ: '¿Existe un proceso documentado para gestionar no conformidades ambientales y determinar acciones correctivas?',
            legalRef: 'Ley 19.300',
        },

        // 10.3 - Mejora continua
        {
            code: 'ISO9001-10.3-001',
            norm: 'ISO9001',
            clause: '10.3',
            requirement: 'Mejora continua',
            verificationQ: '¿La organización mejora continuamente la conveniencia, adecuación y eficacia del SGC?',
            legalRef: null,
        },
        {
            code: 'ISO45001-10.3-001',
            norm: 'ISO45001',
            clause: '10.3',
            requirement: 'Mejora continua',
            verificationQ: '¿La organización mejora continuamente el desempeño de la SST, promoviendo una cultura de apoyo al SGSST?',
            legalRef: 'Ley 16.744 Art. 184',
        },
        {
            code: 'ISO14001-10.3-001',
            norm: 'ISO14001',
            clause: '10.3',
            requirement: 'Mejora continua',
            verificationQ: '¿La organización mejora continuamente la conveniencia, adecuación y eficacia del SGA para mejorar el desempeño ambiental?',
            legalRef: 'Ley 19.300',
        },
    ];

    // Limpiar items anteriores y crear nuevos
    console.log('  → Limpiando checklist items anteriores...');
    await prisma.checklistItem.deleteMany({});

    for (const item of checklistItems) {
        await prisma.checklistItem.create({
            data: item as any,
        });
    }

    console.log(`  ✅ ${checklistItems.length} checklist items trinorma creados`);

    // ===========================================
    // NORM REFERENCES - Normativa Chilena
    // ===========================================
    console.log('  → Actualizando referencias normativas chilenas...');

    const normReferences = [
        // Ley 16.744 - Accidentes del Trabajo
        {
            name: 'Ley 16.744',
            article: 'Art. 184',
            title: 'Obligaciones del empleador',
            content: 'El empleador estará obligado a tomar todas las medidas necesarias para proteger eficazmente la vida y salud de los trabajadores, informándoles de los posibles riesgos y manteniendo las condiciones adecuadas de higiene y seguridad en las faenas.',
            keywords: ['empleador', 'protección', 'vida', 'salud', 'trabajadores', 'riesgos', 'higiene', 'seguridad'],
        },
        {
            name: 'Ley 16.744',
            article: 'Art. 66',
            title: 'Comités Paritarios de Higiene y Seguridad',
            content: 'En toda empresa, faena, sucursal o agencia en que trabajen más de 25 personas se organizarán Comités Paritarios de Higiene y Seguridad, compuestos por representantes patronales y representantes de los trabajadores.',
            keywords: ['comité paritario', 'trabajadores', 'representantes', '25 personas', 'higiene', 'seguridad'],
        },
        {
            name: 'Ley 16.744',
            article: 'Art. 68',
            title: 'Obligaciones de los trabajadores',
            content: 'Los trabajadores deberán cumplir con las normas e instrucciones impartidas por la autoridad y con las que les imponga el empleador sobre higiene y seguridad.',
            keywords: ['trabajadores', 'cumplir', 'normas', 'instrucciones', 'higiene', 'seguridad'],
        },
        {
            name: 'Ley 16.744',
            article: 'Art. 76',
            title: 'Denuncia de accidentes',
            content: 'La entidad empleadora deberá denunciar al organismo administrador respectivo, inmediatamente de producido, todo accidente o enfermedad profesional que pueda ocasionar incapacidad para el trabajo o la muerte de la víctima.',
            keywords: ['denuncia', 'accidente', 'enfermedad profesional', 'incapacidad', 'muerte', 'organismo administrador'],
        },
        // DS 40 - Reglamento sobre Prevención de Riesgos Profesionales
        {
            name: 'DS 40',
            article: 'Art. 3',
            title: 'Reglamento Interno de Orden, Higiene y Seguridad',
            content: 'Toda empresa o entidad estará obligada a establecer y mantener al día un Reglamento Interno de Orden, Higiene y Seguridad en el Trabajo.',
            keywords: ['reglamento interno', 'orden', 'higiene', 'seguridad', 'trabajo', 'empresa'],
        },
        {
            name: 'DS 40',
            article: 'Art. 14',
            title: 'Obligación de informar (ODI)',
            content: 'Los empleadores tienen la obligación de informar oportuna y convenientemente a todos sus trabajadores, acerca de los riesgos que entrañan sus labores, de las medidas preventivas y de los métodos de trabajo correctos.',
            keywords: ['obligación de informar', 'ODI', 'riesgos', 'labores', 'medidas preventivas', 'métodos correctos'],
        },
        {
            name: 'DS 40',
            article: 'Art. 21',
            title: 'Matriz de riesgos y procedimientos',
            content: 'El empleador deberá mantener los equipos de protección personal, los registros de capacitación, la matriz de identificación de peligros y evaluación de riesgos actualizada.',
            keywords: ['EPP', 'capacitación', 'matriz', 'peligros', 'riesgos', 'actualizada'],
        },
        // DS 594 - Condiciones Sanitarias y Ambientales Básicas
        {
            name: 'DS 594',
            article: 'Art. 3',
            title: 'Condiciones generales de construcción',
            content: 'Los lugares de trabajo deberán reunir condiciones adecuadas de construcción, seguridad y sanidad que garanticen el desempeño en condiciones ambientales seguras y saludables.',
            keywords: ['lugares de trabajo', 'construcción', 'seguridad', 'sanidad', 'condiciones ambientales'],
        },
        {
            name: 'DS 594',
            article: 'Art. 5',
            title: 'Condiciones sanitarias y de higiene',
            content: 'Los pisos de los lugares de trabajo, así como los pasillos de tránsito, se mantendrán libres de todo obstáculo que impida un fácil y seguro desplazamiento de los trabajadores.',
            keywords: ['pisos', 'pasillos', 'tránsito', 'obstáculo', 'desplazamiento seguro'],
        },
        // Ley 19.300 - Ley de Bases del Medio Ambiente
        {
            name: 'Ley 19.300',
            article: 'Art. 4',
            title: 'Principio preventivo',
            content: 'Es deber del Estado facilitar la participación ciudadana y promover campañas educativas destinadas a la protección del medio ambiente.',
            keywords: ['deber', 'Estado', 'participación ciudadana', 'campañas', 'protección', 'medio ambiente'],
        },
        {
            name: 'Ley 19.300',
            article: 'Art. 10',
            title: 'Sistema de Evaluación de Impacto Ambiental',
            content: 'Los proyectos o actividades susceptibles de causar impacto ambiental, en cualesquiera de sus fases, deberán someterse al sistema de evaluación de impacto ambiental.',
            keywords: ['proyectos', 'actividades', 'impacto ambiental', 'evaluación', 'SEIA'],
        },
        {
            name: 'Ley 19.300',
            article: 'Art. 3',
            title: 'Definición de medio ambiente',
            content: 'El sistema global constituido por elementos naturales y artificiales de naturaleza física, química o biológica, socioculturales y sus interacciones, en permanente modificación por la acción humana o natural.',
            keywords: ['medio ambiente', 'elementos naturales', 'artificiales', 'físico', 'químico', 'biológico', 'sociocultural'],
        },
    ];

    await prisma.normReference.deleteMany({});

    for (const ref of normReferences) {
        await prisma.normReference.create({
            data: ref,
        });
    }

    console.log(`  ✅ ${normReferences.length} referencias normativas actualizadas`);

    // Demo data
    console.log('  → Verificando empresa y usuario demo...');
    const existingCompany = await prisma.company.findFirst({ where: { rut: '76.123.456-7' } });
    if (!existingCompany) {
        const company = await prisma.company.create({
            data: {
                name: 'Minera Los Andes Demo',
                rut: '76.123.456-7',
                industry: 'Minería',
            },
        });
        await prisma.user.create({
            data: {
                email: 'auditor@demo.cl',
                name: 'Juan Pérez (Demo)',
                role: 'AUDITOR',
                companyId: company.id,
            },
        });
    }
    console.log('  ✅ Datos demo verificados');

    console.log('');
    console.log('🎉 ¡Checklist trinorma mejorado completado!');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
