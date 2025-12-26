/**
 * Prisma Database Seed - Checklist Trinorma Completo
 * DS44 (Decreto Supremo 44 - Chile) + ISO 9001:2015 + ISO 14001:2015 + ISO 45001:2018
 * NOTA: DS40 ha sido DEROGADO por el DS44 (27-Jul-2024)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with complete trinorma checklist...');
    console.log('  → DS44 (33 items) + ISO 9001 (44 items) + ISO 14001 (30 items) + ISO 45001 (12 items)');
    console.log('  → Total: 119 items');

    // Delete existing data
    console.log('  → Cleaning existing data...');
    await prisma.finding.deleteMany({});
    await prisma.checklistItem.deleteMany({});

    // DS44 + ISO Checklist Items - Completo con descripciones explicativas
    const items = [
        // ===========================================
        // DECRETO SUPREMO 44 - TÍTULO I: DISPOSICIONES GENERALES
        // ===========================================
        { code: 'DS44-ART4-001', norm: 'ISO45001', clause: 'DS44-Art.4', requirement: 'Obligaciones de la entidad empleadora', verificationQ: '¿La entidad empleadora gestiona preventivamente los riesgos laborales conforme al Art. 184 del Código del Trabajo?', legalRef: 'DS 44 Art. 4, Ley 16.744' },
        { code: 'DS44-ART5-001', norm: 'ISO45001', clause: 'DS44-Art.5', requirement: 'Obligaciones de las personas trabajadoras', verificationQ: '¿Las personas trabajadoras cumplen con las normas de prevención establecidas por la entidad empleadora?', legalRef: 'DS 44 Art. 5' },

        // ===========================================
        // DECRETO SUPREMO 44 - TÍTULO II: GESTIÓN PREVENTIVA
        // ===========================================
        // Párrafo 1: Matriz IPER
        { code: 'DS44-ART7-001', norm: 'ISO45001', clause: 'DS44-Art.7', requirement: 'Matriz de identificación de peligros y evaluación de riesgos (IPER)', verificationQ: '¿Existe una Matriz IPER actualizada que contemple todos los peligros y riesgos laborales de la organización?', legalRef: 'DS 44 Art. 7' },

        // Párrafo 2: Programa de trabajo preventivo
        { code: 'DS44-ART8-001', norm: 'ISO45001', clause: 'DS44-Art.8', requirement: 'Programa de trabajo preventivo', verificationQ: '¿Existe un programa de trabajo preventivo con objetivos, plazos, responsables y recursos asignados?', legalRef: 'DS 44 Art. 8' },
        { code: 'DS44-ART9-001', norm: 'ISO45001', clause: 'DS44-Art.9', requirement: 'Prelación de medidas preventivas (Jerarquía de controles)', verificationQ: '¿Se aplica la jerarquía de controles: eliminación, sustitución, controles de ingeniería, controles administrativos y EPP?', legalRef: 'DS 44 Art. 9' },
        { code: 'DS44-ART10-001', norm: 'ISO45001', clause: 'DS44-Art.10', requirement: 'Gestión de máquinas, equipos y elementos de trabajo', verificationQ: '¿Los equipos, máquinas y herramientas cuentan con las medidas de seguridad adecuadas y están en buen estado?', legalRef: 'DS 44 Art. 10' },
        { code: 'DS44-ART11-001', norm: 'ISO45001', clause: 'DS44-Art.11', requirement: 'Protección de trabajadores especialmente sensibles', verificationQ: '¿Se protege a trabajadores con condiciones especiales (embarazo, discapacidad, menores, adultos mayores)?', legalRef: 'DS 44 Art. 11' },
        { code: 'DS44-ART12-001', norm: 'ISO45001', clause: 'DS44-Art.12', requirement: 'Protección colectiva de los riesgos laborales', verificationQ: '¿Se priorizan las medidas de protección colectiva sobre las medidas de protección individual?', legalRef: 'DS 44 Art. 12' },
        { code: 'DS44-ART13-001', norm: 'ISO45001', clause: 'DS44-Art.13', requirement: 'Uso de elementos de protección personal (EPP)', verificationQ: '¿Se entregan EPP certificados y sin costo a los trabajadores cuando no se puede eliminar el riesgo?', legalRef: 'DS 44 Art. 13' },

        // Párrafo 3: Evaluación del programa
        { code: 'DS44-ART14-001', norm: 'ISO45001', clause: 'DS44-Art.14', requirement: 'Evaluación del cumplimiento del programa de trabajo preventivo', verificationQ: '¿Se evalúa periódicamente el cumplimiento del programa de trabajo preventivo y se documentan los resultados?', legalRef: 'DS 44 Art. 14' },

        // Párrafo 4: Información y capacitación
        { code: 'DS44-ART15-001', norm: 'ISO45001', clause: 'DS44-Art.15', requirement: 'Información de los riesgos laborales (Obligación de Informar - ODI)', verificationQ: '¿Se informa a cada trabajador sobre los riesgos de su puesto, medidas preventivas y métodos de trabajo correctos antes de iniciar labores?', legalRef: 'DS 44 Art. 15' },
        { code: 'DS44-ART16-001', norm: 'ISO45001', clause: 'DS44-Art.16', requirement: 'Capacitación de las personas trabajadoras en prevención de riesgos', verificationQ: '¿Se capacita a los trabajadores en materias de prevención de riesgos con programas de inducción y formación continua?', legalRef: 'DS 44 Art. 16' },

        // Párrafo 5: Consulta y participación
        { code: 'DS44-ART17-001', norm: 'ISO45001', clause: 'DS44-Art.17', requirement: 'Consulta y participación de los representantes de personas trabajadoras', verificationQ: '¿Existen mecanismos de consulta y participación efectiva para los representantes de los trabajadores en materias de SST?', legalRef: 'DS 44 Art. 17' },

        // Párrafo 6: Emergencias
        { code: 'DS44-ART18-001', norm: 'ISO45001', clause: 'DS44-Art.18', requirement: 'Situaciones sobrevenidas de riesgo grave e inminente', verificationQ: '¿Existe protocolo documentado para actuar ante situaciones de riesgo grave e inminente?', legalRef: 'DS 44 Art. 18' },
        { code: 'DS44-ART19-001', norm: 'ISO45001', clause: 'DS44-Art.19', requirement: 'Plan de gestión, reducción y respuesta de riesgos en caso de emergencia', verificationQ: '¿Existe plan de emergencias para incendio, evacuación, sismos y otras emergencias con procedimientos claros?', legalRef: 'DS 44 Art. 19' },

        // Párrafo 7: Coordinación
        { code: 'DS44-ART20-001', norm: 'ISO45001', clause: 'DS44-Art.20', requirement: 'Coordinación de la actividad preventiva', verificationQ: '¿Existe coordinación preventiva cuando hay múltiples empresas o contratistas en un mismo lugar de trabajo?', legalRef: 'DS 44 Art. 20' },

        // ===========================================
        // DECRETO SUPREMO 44 - TÍTULO III: ORGANIZACIÓN Y ESTRUCTURA PREVENTIVA
        // ===========================================
        // Párrafo 2: Sistema de gestión
        { code: 'DS44-ART22-001', norm: 'ISO45001', clause: 'DS44-Art.22', requirement: 'Elementos del Sistema de Gestión de Seguridad y Salud en el Trabajo', verificationQ: '¿Existe un Sistema de Gestión de SST implementado con política, objetivos, planificación y control?', legalRef: 'DS 44 Art. 22' },

        // Párrafo 3: Comité Paritario
        { code: 'DS44-ART23-001', norm: 'ISO45001', clause: 'DS44-Art.23', requirement: 'Exigibilidad del Comité Paritario de Higiene y Seguridad (CPHS)', verificationQ: '¿Se ha constituido el Comité Paritario de Higiene y Seguridad donde corresponde (empresas con 25 o más trabajadores)?', legalRef: 'DS 44 Art. 23, Ley 16.744 Art. 66' },
        { code: 'DS44-ART47-001', norm: 'ISO45001', clause: 'DS44-Art.47', requirement: 'Funciones del Comité Paritario de Higiene y Seguridad', verificationQ: '¿El CPHS cumple sus funciones de vigilancia, investigación de accidentes y promoción de la prevención?', legalRef: 'DS 44 Art. 47' },

        // Párrafo 4: Departamento de Prevención
        { code: 'DS44-ART50-001', norm: 'ISO45001', clause: 'DS44-Art.50', requirement: 'Exigibilidad del Departamento de Prevención de Riesgos', verificationQ: '¿Existe Departamento de Prevención de Riesgos donde corresponde (empresas con 100+ trabajadores en actividades peligrosas)?', legalRef: 'DS 44 Art. 50' },
        { code: 'DS44-ART52-001', norm: 'ISO45001', clause: 'DS44-Art.52', requirement: 'Funciones del Departamento de Prevención de Riesgos', verificationQ: '¿El Departamento de Prevención cumple con reconocer, evaluar y controlar los riesgos laborales?', legalRef: 'DS 44 Art. 52' },
        { code: 'DS44-ART53-001', norm: 'ISO45001', clause: 'DS44-Art.53', requirement: 'Categorías de los expertos en prevención de riesgos', verificationQ: '¿El experto en prevención de riesgos tiene la categoría profesional adecuada según el nivel de riesgo de la empresa?', legalRef: 'DS 44 Art. 53' },

        // Párrafo 5: Reglamento Interno
        { code: 'DS44-ART56-001', norm: 'ISO45001', clause: 'DS44-Art.56', requirement: 'Reglamento Interno de Orden, Higiene y Seguridad (RIOHS)', verificationQ: '¿Existe Reglamento Interno de Orden, Higiene y Seguridad aprobado por la autoridad y difundido a los trabajadores?', legalRef: 'DS 44 Art. 56' },
        { code: 'DS44-ART58-001', norm: 'ISO45001', clause: 'DS44-Art.58', requirement: 'Contenido del Reglamento Interno', verificationQ: '¿El Reglamento Interno contiene todas las materias requeridas (obligaciones, prohibiciones, sanciones, procedimientos)?', legalRef: 'DS 44 Art. 58' },

        // Párrafo 6: Mapas de riesgo
        { code: 'DS44-ART62-001', norm: 'ISO45001', clause: 'DS44-Art.62', requirement: 'Mapas de riesgo', verificationQ: '¿Existen mapas de riesgo visibles en los lugares de trabajo que identifiquen los peligros principales?', legalRef: 'DS 44 Art. 62' },

        // ===========================================
        // DECRETO SUPREMO 44 - TÍTULO IV: SISTEMA DE GESTIÓN PARA PYMES
        // ===========================================
        { code: 'DS44-ART64-001', norm: 'ISO45001', clause: 'DS44-Art.64', requirement: 'Sistema de Gestión para entidades empleadoras de hasta 25 trabajadores', verificationQ: '¿Las empresas pequeñas (hasta 25 trabajadores) tienen un sistema de gestión simplificado adaptado a su tamaño?', legalRef: 'DS 44 Art. 64' },
        { code: 'DS44-ART65-001', norm: 'ISO45001', clause: 'DS44-Art.65', requirement: 'Encargado de la prevención de riesgos laborales (10-25 trabajadores)', verificationQ: '¿Existe un encargado de prevención capacitado en empresas de 10 a 25 trabajadores?', legalRef: 'DS 44 Art. 65' },
        { code: 'DS44-ART66-001', norm: 'ISO45001', clause: 'DS44-Art.66', requirement: 'Delegado de seguridad y salud en el trabajo (menos de 25 trabajadores)', verificationQ: '¿Existe Delegado de Seguridad y Salud en el Trabajo elegido por los trabajadores en empresas sin CPHS?', legalRef: 'DS 44 Art. 66' },

        // ===========================================
        // DECRETO SUPREMO 44 - TÍTULO V: VIGILANCIA Y REGISTROS
        // ===========================================
        { code: 'DS44-ART67-001', norm: 'ISO45001', clause: 'DS44-Art.67', requirement: 'Vigilancia del ambiente de trabajo y de la salud de las personas trabajadoras', verificationQ: '¿Se realiza vigilancia del ambiente de trabajo y vigilancia de la salud de los trabajadores según protocolos MINSAL?', legalRef: 'DS 44 Art. 67' },
        { code: 'DS44-ART71-001', norm: 'ISO45001', clause: 'DS44-Art.71', requirement: 'Investigación de las causas de los siniestros laborales', verificationQ: '¿Se investigan todos los accidentes del trabajo y enfermedades profesionales para determinar sus causas raíz?', legalRef: 'DS 44 Art. 71' },
        { code: 'DS44-ART72-001', norm: 'ISO45001', clause: 'DS44-Art.72', requirement: 'Registro documental de la actividad preventiva', verificationQ: '¿Se mantienen registros documentales de la actividad preventiva por al menos 5 años (capacitaciones, inspecciones, investigaciones)?', legalRef: 'DS 44 Art. 72' },
        { code: 'DS44-ART73-001', norm: 'ISO45001', clause: 'DS44-Art.73', requirement: 'Registro y estadísticas de seguridad y salud', verificationQ: '¿Se llevan estadísticas de accidentabilidad (Índice de Frecuencia, Índice de Gravedad, Tasa de Accidentabilidad)?', legalRef: 'DS 44 Art. 73' },

        // ===========================================
        // ISO 9001:2015 - SISTEMA DE GESTIÓN DE LA CALIDAD (COMPLETO)
        // ===========================================

        // Cláusula 4: Contexto de la organización
        { code: 'ISO9001-4.1-001', norm: 'ISO9001', clause: '4.1', requirement: 'Comprensión de la organización y de su contexto', verificationQ: '¿Se han determinado las cuestiones externas e internas pertinentes al propósito y dirección estratégica del SGC?', legalRef: null },
        { code: 'ISO9001-4.2-001', norm: 'ISO9001', clause: '4.2', requirement: 'Comprensión de las necesidades y expectativas de las partes interesadas', verificationQ: '¿Se han determinado las partes interesadas relevantes y sus requisitos para el SGC?', legalRef: null },
        { code: 'ISO9001-4.3-001', norm: 'ISO9001', clause: '4.3', requirement: 'Determinación del alcance del SGC', verificationQ: '¿Se ha determinado el alcance del SGC considerando cuestiones internas/externas y requisitos de partes interesadas?', legalRef: null },
        { code: 'ISO9001-4.4-001', norm: 'ISO9001', clause: '4.4', requirement: 'Sistema de gestión de la calidad y sus procesos', verificationQ: '¿Se han determinado los procesos necesarios para el SGC y sus interacciones?', legalRef: null },

        // Cláusula 5: Liderazgo
        { code: 'ISO9001-5.1-001', norm: 'ISO9001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección demuestra liderazgo y compromiso con el SGC asumiendo responsabilidad por su eficacia?', legalRef: null },
        { code: 'ISO9001-5.1.2-001', norm: 'ISO9001', clause: '5.1.2', requirement: 'Enfoque al cliente', verificationQ: '¿La alta dirección asegura que se determinan y cumplen los requisitos del cliente y legales aplicables?', legalRef: null },
        { code: 'ISO9001-5.2-001', norm: 'ISO9001', clause: '5.2', requirement: 'Política de la calidad', verificationQ: '¿La política de calidad está documentada, es apropiada al propósito, está comunicada y disponible?', legalRef: null },
        { code: 'ISO9001-5.3-001', norm: 'ISO9001', clause: '5.3', requirement: 'Roles, responsabilidades y autoridades', verificationQ: '¿Se han asignado y comunicado las responsabilidades y autoridades para roles pertinentes?', legalRef: null },

        // Cláusula 6: Planificación
        { code: 'ISO9001-6.1-001', norm: 'ISO9001', clause: '6.1', requirement: 'Acciones para abordar riesgos y oportunidades', verificationQ: '¿Se han determinado los riesgos y oportunidades que pueden afectar la conformidad de productos/servicios?', legalRef: null },
        { code: 'ISO9001-6.2-001', norm: 'ISO9001', clause: '6.2', requirement: 'Objetivos de la calidad y planificación', verificationQ: '¿Se han establecido objetivos de calidad medibles, coherentes con la política y se planifica cómo alcanzarlos?', legalRef: null },
        { code: 'ISO9001-6.3-001', norm: 'ISO9001', clause: '6.3', requirement: 'Planificación de los cambios', verificationQ: '¿Los cambios en el SGC se planifican de manera sistemática considerando su propósito y consecuencias?', legalRef: null },

        // Cláusula 7: Apoyo
        { code: 'ISO9001-7.1.1-001', norm: 'ISO9001', clause: '7.1.1', requirement: 'Recursos - Generalidades', verificationQ: '¿Se determinan y proporcionan los recursos necesarios para el establecimiento, implementación y mejora del SGC?', legalRef: null },
        { code: 'ISO9001-7.1.2-001', norm: 'ISO9001', clause: '7.1.2', requirement: 'Personas', verificationQ: '¿Se determina y proporciona el personal necesario para la implementación eficaz del SGC?', legalRef: null },
        { code: 'ISO9001-7.1.3-001', norm: 'ISO9001', clause: '7.1.3', requirement: 'Infraestructura', verificationQ: '¿Se determina, proporciona y mantiene la infraestructura necesaria para la operación de procesos?', legalRef: null },
        { code: 'ISO9001-7.1.4-001', norm: 'ISO9001', clause: '7.1.4', requirement: 'Ambiente para la operación de los procesos', verificationQ: '¿Se determina, proporciona y mantiene el ambiente necesario para la operación de procesos?', legalRef: null },
        { code: 'ISO9001-7.1.5-001', norm: 'ISO9001', clause: '7.1.5', requirement: 'Recursos de seguimiento y medición', verificationQ: '¿Se determinan y proporcionan los recursos para asegurar resultados válidos del seguimiento y medición?', legalRef: null },
        { code: 'ISO9001-7.1.6-001', norm: 'ISO9001', clause: '7.1.6', requirement: 'Conocimientos de la organización', verificationQ: '¿Se determinan los conocimientos necesarios para la operación de procesos y conformidad de productos/servicios?', legalRef: null },
        { code: 'ISO9001-7.2-001', norm: 'ISO9001', clause: '7.2', requirement: 'Competencia', verificationQ: '¿Se ha determinado la competencia necesaria, se asegura que el personal sea competente y se conservan registros?', legalRef: null },
        { code: 'ISO9001-7.3-001', norm: 'ISO9001', clause: '7.3', requirement: 'Toma de conciencia', verificationQ: '¿El personal es consciente de la política de calidad, objetivos pertinentes y su contribución a la eficacia del SGC?', legalRef: null },
        { code: 'ISO9001-7.4-001', norm: 'ISO9001', clause: '7.4', requirement: 'Comunicación', verificationQ: '¿Se han determinado las comunicaciones internas y externas pertinentes al SGC (qué, cuándo, a quién, cómo)?', legalRef: null },
        { code: 'ISO9001-7.5.1-001', norm: 'ISO9001', clause: '7.5.1', requirement: 'Información documentada - Generalidades', verificationQ: '¿El SGC incluye la información documentada requerida por la norma y determinada como necesaria?', legalRef: null },
        { code: 'ISO9001-7.5.2-001', norm: 'ISO9001', clause: '7.5.2', requirement: 'Creación y actualización de información documentada', verificationQ: '¿Se asegura la identificación, descripción, formato, revisión y aprobación de la información documentada?', legalRef: null },
        { code: 'ISO9001-7.5.3-001', norm: 'ISO9001', clause: '7.5.3', requirement: 'Control de la información documentada', verificationQ: '¿La información documentada está disponible, protegida y controlada (distribución, acceso, recuperación, uso)?', legalRef: null },

        // Cláusula 8: Operación
        { code: 'ISO9001-8.1-001', norm: 'ISO9001', clause: '8.1', requirement: 'Planificación y control operacional', verificationQ: '¿Se han planificado, implementado y controlado los procesos necesarios para cumplir requisitos?', legalRef: null },
        { code: 'ISO9001-8.2.1-001', norm: 'ISO9001', clause: '8.2.1', requirement: 'Comunicación con el cliente', verificationQ: '¿Se comunica con los clientes sobre información de productos/servicios, consultas, contratos y retroalimentación?', legalRef: null },
        { code: 'ISO9001-8.2.2-001', norm: 'ISO9001', clause: '8.2.2', requirement: 'Determinación de requisitos para productos y servicios', verificationQ: '¿Se determinan los requisitos del cliente, legales, reglamentarios y los propios de la organización?', legalRef: null },
        { code: 'ISO9001-8.2.3-001', norm: 'ISO9001', clause: '8.2.3', requirement: 'Revisión de requisitos para productos y servicios', verificationQ: '¿Se revisa la capacidad de cumplir los requisitos antes de comprometerse a suministrar productos/servicios?', legalRef: null },
        { code: 'ISO9001-8.3-001', norm: 'ISO9001', clause: '8.3', requirement: 'Diseño y desarrollo de productos y servicios', verificationQ: '¿Existe un proceso de diseño y desarrollo planificado, controlado y documentado cuando aplica?', legalRef: null },
        { code: 'ISO9001-8.4-001', norm: 'ISO9001', clause: '8.4', requirement: 'Control de procesos, productos y servicios suministrados externamente', verificationQ: '¿Se asegura que los procesos, productos y servicios suministrados externamente son conformes a los requisitos?', legalRef: null },
        { code: 'ISO9001-8.5.1-001', norm: 'ISO9001', clause: '8.5.1', requirement: 'Control de la producción y provisión del servicio', verificationQ: '¿La producción y provisión del servicio se lleva a cabo bajo condiciones controladas?', legalRef: null },
        { code: 'ISO9001-8.5.2-001', norm: 'ISO9001', clause: '8.5.2', requirement: 'Identificación y trazabilidad', verificationQ: '¿Se identifican las salidas de los procesos y se mantiene trazabilidad cuando es un requisito?', legalRef: null },
        { code: 'ISO9001-8.5.3-001', norm: 'ISO9001', clause: '8.5.3', requirement: 'Propiedad perteneciente a clientes o proveedores externos', verificationQ: '¿Se cuida la propiedad del cliente o proveedor externo mientras está bajo control de la organización?', legalRef: null },
        { code: 'ISO9001-8.5.4-001', norm: 'ISO9001', clause: '8.5.4', requirement: 'Preservación', verificationQ: '¿Se preservan las salidas durante la producción y prestación del servicio para asegurar conformidad?', legalRef: null },
        { code: 'ISO9001-8.5.5-001', norm: 'ISO9001', clause: '8.5.5', requirement: 'Actividades posteriores a la entrega', verificationQ: '¿Se cumplen los requisitos de actividades posteriores a la entrega (garantía, mantenimiento, servicios)?', legalRef: null },
        { code: 'ISO9001-8.5.6-001', norm: 'ISO9001', clause: '8.5.6', requirement: 'Control de cambios', verificationQ: '¿Se revisan y controlan los cambios en la producción o provisión del servicio para asegurar conformidad?', legalRef: null },
        { code: 'ISO9001-8.6-001', norm: 'ISO9001', clause: '8.6', requirement: 'Liberación de productos y servicios', verificationQ: '¿Se verifican los requisitos antes de la entrega y se conserva evidencia de la conformidad?', legalRef: null },
        { code: 'ISO9001-8.7-001', norm: 'ISO9001', clause: '8.7', requirement: 'Control de salidas no conformes', verificationQ: '¿Se identifican y controlan las salidas no conformes para prevenir su uso o entrega no intencionada?', legalRef: null },

        // Cláusula 9: Evaluación del desempeño
        { code: 'ISO9001-9.1.1-001', norm: 'ISO9001', clause: '9.1.1', requirement: 'Seguimiento, medición, análisis y evaluación - Generalidades', verificationQ: '¿Se determina qué necesita seguimiento y medición, los métodos y cuándo se realizan?', legalRef: null },
        { code: 'ISO9001-9.1.2-001', norm: 'ISO9001', clause: '9.1.2', requirement: 'Satisfacción del cliente', verificationQ: '¿Se realiza seguimiento de las percepciones del cliente sobre el grado de satisfacción de sus necesidades?', legalRef: null },
        { code: 'ISO9001-9.1.3-001', norm: 'ISO9001', clause: '9.1.3', requirement: 'Análisis y evaluación', verificationQ: '¿Se analizan y evalúan los datos del seguimiento y medición para evaluar desempeño y eficacia del SGC?', legalRef: null },
        { code: 'ISO9001-9.2-001', norm: 'ISO9001', clause: '9.2', requirement: 'Auditoría interna', verificationQ: '¿Se realizan auditorías internas a intervalos planificados para verificar la conformidad del SGC?', legalRef: null },
        { code: 'ISO9001-9.3-001', norm: 'ISO9001', clause: '9.3', requirement: 'Revisión por la dirección', verificationQ: '¿La alta dirección revisa el SGC a intervalos planificados para asegurar su conveniencia, adecuación y eficacia?', legalRef: null },

        // Cláusula 10: Mejora
        { code: 'ISO9001-10.1-001', norm: 'ISO9001', clause: '10.1', requirement: 'Mejora - Generalidades', verificationQ: '¿Se determinan y seleccionan oportunidades de mejora para cumplir requisitos del cliente y aumentar satisfacción?', legalRef: null },
        { code: 'ISO9001-10.2-001', norm: 'ISO9001', clause: '10.2', requirement: 'No conformidad y acción correctiva', verificationQ: '¿Se reacciona ante no conformidades, se evalúan acciones, se implementan y se revisa su eficacia?', legalRef: null },
        { code: 'ISO9001-10.3-001', norm: 'ISO9001', clause: '10.3', requirement: 'Mejora continua', verificationQ: '¿Se mejora continuamente la conveniencia, adecuación y eficacia del SGC?', legalRef: null },

        // ===========================================
        // ISO 14001:2015 - SISTEMA DE GESTIÓN AMBIENTAL (COMPLETO)
        // ===========================================

        // Cláusula 4: Contexto de la organización
        { code: 'ISO14001-4.1-001', norm: 'ISO14001', clause: '4.1', requirement: 'Comprensión de la organización y de su contexto', verificationQ: '¿Se han determinado las cuestiones externas e internas pertinentes al propósito del SGA?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-4.2-001', norm: 'ISO14001', clause: '4.2', requirement: 'Comprensión de las necesidades y expectativas de las partes interesadas', verificationQ: '¿Se han determinado las partes interesadas y sus requisitos ambientales pertinentes?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-4.3-001', norm: 'ISO14001', clause: '4.3', requirement: 'Determinación del alcance del SGA', verificationQ: '¿Se ha determinado el alcance del SGA considerando cuestiones internas/externas, requisitos y actividades?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-4.4-001', norm: 'ISO14001', clause: '4.4', requirement: 'Sistema de gestión ambiental', verificationQ: '¿Se ha establecido, implementado, mantenido y mejorado continuamente el SGA?', legalRef: 'Ley 19.300' },

        // Cláusula 5: Liderazgo
        { code: 'ISO14001-5.1-001', norm: 'ISO14001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección demuestra liderazgo y compromiso asumiendo responsabilidad por la eficacia del SGA?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-5.2-001', norm: 'ISO14001', clause: '5.2', requirement: 'Política ambiental', verificationQ: '¿La política ambiental es apropiada, incluye compromisos de protección ambiental, cumplimiento y mejora continua?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-5.3-001', norm: 'ISO14001', clause: '5.3', requirement: 'Roles, responsabilidades y autoridades', verificationQ: '¿Se han asignado y comunicado las responsabilidades y autoridades para roles pertinentes del SGA?', legalRef: null },

        // Cláusula 6: Planificación
        { code: 'ISO14001-6.1.1-001', norm: 'ISO14001', clause: '6.1.1', requirement: 'Acciones para abordar riesgos y oportunidades - Generalidades', verificationQ: '¿Se determinan riesgos y oportunidades relacionados con aspectos ambientales, requisitos y otras cuestiones?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-6.1.2-001', norm: 'ISO14001', clause: '6.1.2', requirement: 'Aspectos ambientales', verificationQ: '¿Se identifican aspectos ambientales de actividades, productos y servicios que la organización puede controlar?', legalRef: 'Ley 19.300 Art. 10' },
        { code: 'ISO14001-6.1.3-001', norm: 'ISO14001', clause: '6.1.3', requirement: 'Requisitos legales y otros requisitos', verificationQ: '¿Se identifican, tienen acceso y comprenden los requisitos legales ambientales aplicables?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-6.1.4-001', norm: 'ISO14001', clause: '6.1.4', requirement: 'Planificación de acciones', verificationQ: '¿Se planifican acciones para abordar aspectos ambientales significativos, requisitos legales y riesgos/oportunidades?', legalRef: null },
        { code: 'ISO14001-6.2.1-001', norm: 'ISO14001', clause: '6.2.1', requirement: 'Objetivos ambientales', verificationQ: '¿Se establecen objetivos ambientales medibles, coherentes con la política y considerando aspectos significativos?', legalRef: null },
        { code: 'ISO14001-6.2.2-001', norm: 'ISO14001', clause: '6.2.2', requirement: 'Planificación de acciones para lograr objetivos ambientales', verificationQ: '¿Se planifica qué, quién, cuándo y cómo se lograrán los objetivos ambientales y se evaluarán resultados?', legalRef: null },

        // Cláusula 7: Apoyo
        { code: 'ISO14001-7.1-001', norm: 'ISO14001', clause: '7.1', requirement: 'Recursos', verificationQ: '¿Se determinan y proporcionan los recursos necesarios para el establecimiento, implementación y mejora del SGA?', legalRef: null },
        { code: 'ISO14001-7.2-001', norm: 'ISO14001', clause: '7.2', requirement: 'Competencia', verificationQ: '¿Se determina la competencia necesaria, se asegura que el personal sea competente y se conservan registros?', legalRef: null },
        { code: 'ISO14001-7.3-001', norm: 'ISO14001', clause: '7.3', requirement: 'Toma de conciencia', verificationQ: '¿El personal es consciente de la política ambiental, aspectos significativos y su contribución a la eficacia del SGA?', legalRef: null },
        { code: 'ISO14001-7.4.1-001', norm: 'ISO14001', clause: '7.4.1', requirement: 'Comunicación - Generalidades', verificationQ: '¿Se establecen comunicaciones internas y externas pertinentes al SGA (qué, cuándo, a quién, cómo)?', legalRef: null },
        { code: 'ISO14001-7.4.2-001', norm: 'ISO14001', clause: '7.4.2', requirement: 'Comunicación interna', verificationQ: '¿Se comunica internamente la información pertinente al SGA entre niveles y funciones?', legalRef: null },
        { code: 'ISO14001-7.4.3-001', norm: 'ISO14001', clause: '7.4.3', requirement: 'Comunicación externa', verificationQ: '¿Se comunica externamente información pertinente al SGA según requisitos legales y compromisos?', legalRef: null },
        { code: 'ISO14001-7.5.1-001', norm: 'ISO14001', clause: '7.5.1', requirement: 'Información documentada - Generalidades', verificationQ: '¿El SGA incluye la información documentada requerida por la norma y determinada como necesaria?', legalRef: null },
        { code: 'ISO14001-7.5.2-001', norm: 'ISO14001', clause: '7.5.2', requirement: 'Creación y actualización', verificationQ: '¿Se asegura la identificación, formato, revisión y aprobación de la información documentada?', legalRef: null },
        { code: 'ISO14001-7.5.3-001', norm: 'ISO14001', clause: '7.5.3', requirement: 'Control de la información documentada', verificationQ: '¿La información documentada está disponible, protegida y controlada adecuadamente?', legalRef: null },

        // Cláusula 8: Operación
        { code: 'ISO14001-8.1-001', norm: 'ISO14001', clause: '8.1', requirement: 'Planificación y control operacional', verificationQ: '¿Se establecen controles operacionales para aspectos ambientales significativos y cumplimiento de requisitos?', legalRef: 'DS 594' },
        { code: 'ISO14001-8.2-001', norm: 'ISO14001', clause: '8.2', requirement: 'Preparación y respuesta ante emergencias', verificationQ: '¿Se prepara y responde ante emergencias ambientales potenciales identificadas?', legalRef: 'Ley 19.300' },

        // Cláusula 9: Evaluación del desempeño
        { code: 'ISO14001-9.1.1-001', norm: 'ISO14001', clause: '9.1.1', requirement: 'Seguimiento, medición, análisis y evaluación - Generalidades', verificationQ: '¿Se determina qué necesita seguimiento y medición ambiental, los métodos y cuándo se realizan?', legalRef: null },
        { code: 'ISO14001-9.1.2-001', norm: 'ISO14001', clause: '9.1.2', requirement: 'Evaluación del cumplimiento', verificationQ: '¿Se evalúa el cumplimiento de los requisitos legales y otros requisitos ambientales?', legalRef: 'Ley 19.300' },
        { code: 'ISO14001-9.2-001', norm: 'ISO14001', clause: '9.2', requirement: 'Auditoría interna', verificationQ: '¿Se realizan auditorías internas del SGA a intervalos planificados para verificar conformidad?', legalRef: null },
        { code: 'ISO14001-9.3-001', norm: 'ISO14001', clause: '9.3', requirement: 'Revisión por la dirección', verificationQ: '¿La alta dirección revisa el SGA a intervalos planificados para asegurar conveniencia, adecuación y eficacia?', legalRef: null },

        // Cláusula 10: Mejora
        { code: 'ISO14001-10.1-001', norm: 'ISO14001', clause: '10.1', requirement: 'Mejora - Generalidades', verificationQ: '¿Se determinan oportunidades de mejora para alcanzar resultados previstos del SGA?', legalRef: null },
        { code: 'ISO14001-10.2-001', norm: 'ISO14001', clause: '10.2', requirement: 'No conformidad y acción correctiva', verificationQ: '¿Se reacciona ante no conformidades ambientales, se evalúan acciones y se revisa su eficacia?', legalRef: null },
        { code: 'ISO14001-10.3-001', norm: 'ISO14001', clause: '10.3', requirement: 'Mejora continua', verificationQ: '¿Se mejora continuamente la conveniencia, adecuación y eficacia del SGA?', legalRef: null },

        // ===========================================
        // ISO 45001:2018 - SISTEMA DE GESTIÓN DE SST (relacionados con DS44)
        // ===========================================
        { code: 'ISO45001-4.1-001', norm: 'ISO45001', clause: '4.1', requirement: 'Comprensión de la organización y de su contexto', verificationQ: '¿Se han determinado las cuestiones externas e internas pertinentes para el propósito del SGSST?', legalRef: 'Ley 16.744 Art. 184' },
        { code: 'ISO45001-4.2-001', norm: 'ISO45001', clause: '4.2', requirement: 'Comprensión de las necesidades y expectativas de los trabajadores y otras partes interesadas', verificationQ: '¿Se han determinado las partes interesadas y sus requisitos de SST?', legalRef: 'Ley 16.744' },
        { code: 'ISO45001-5.1-001', norm: 'ISO45001', clause: '5.1', requirement: 'Liderazgo y compromiso', verificationQ: '¿La alta dirección demuestra liderazgo asumiendo responsabilidad y rendición de cuentas en SST?', legalRef: 'Ley 16.744 Art. 184' },
        { code: 'ISO45001-5.2-001', norm: 'ISO45001', clause: '5.2', requirement: 'Política de SST', verificationQ: '¿La política de SST incluye compromiso de mejora continua, cumplimiento legal y consulta a trabajadores?', legalRef: 'DS 44 Art. 13-14' },
        { code: 'ISO45001-5.4-001', norm: 'ISO45001', clause: '5.4', requirement: 'Consulta y participación de los trabajadores', verificationQ: '¿Existen procesos para la consulta y participación de los trabajadores en el desarrollo del SGSST?', legalRef: 'DS 44 Art. 17' },
        { code: 'ISO45001-6.1.2-001', norm: 'ISO45001', clause: '6.1.2', requirement: 'Identificación de peligros y evaluación de riesgos y oportunidades', verificationQ: '¿Existe un proceso proactivo y continuo para identificar peligros y evaluar riesgos de SST?', legalRef: 'DS 44 Art. 7' },
        { code: 'ISO45001-8.1.2-001', norm: 'ISO45001', clause: '8.1.2', requirement: 'Eliminar peligros y reducir riesgos para la SST', verificationQ: '¿Se aplica la jerarquía de controles para eliminar peligros y reducir riesgos de SST?', legalRef: 'DS 44 Art. 9' },
        { code: 'ISO45001-8.2-001', norm: 'ISO45001', clause: '8.2', requirement: 'Preparación y respuesta ante emergencias', verificationQ: '¿Existen procesos para prepararse y responder ante situaciones de emergencia potenciales?', legalRef: 'DS 44 Art. 19' },
        { code: 'ISO45001-9.1.2-001', norm: 'ISO45001', clause: '9.1.2', requirement: 'Evaluación del cumplimiento', verificationQ: '¿Se evalúa el cumplimiento de los requisitos legales y otros requisitos de SST?', legalRef: 'DS 44 Art. 14' },
        { code: 'ISO45001-9.2-001', norm: 'ISO45001', clause: '9.2', requirement: 'Auditoría interna', verificationQ: '¿Se realizan auditorías internas del SGSST a intervalos planificados?', legalRef: null },
        { code: 'ISO45001-10.2-001', norm: 'ISO45001', clause: '10.2', requirement: 'Incidente, no conformidad y acción correctiva', verificationQ: '¿Se investigan los incidentes, se determinan las causas raíz y se toman acciones correctivas?', legalRef: 'DS 44 Art. 71' },
    ];

    console.log(`  → Creating ${items.length} checklist items...`);

    for (const item of items) {
        await prisma.checklistItem.create({
            data: item,
        });
    }

    console.log(`✅ Successfully seeded ${items.length} checklist items!`);
    console.log('   - DS44: 33 items');
    console.log('   - ISO 9001: 44 items');
    console.log('   - ISO 14001: 30 items');
    console.log('   - ISO 45001: 12 items');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
