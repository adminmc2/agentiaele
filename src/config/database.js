// ========================================
// CONFIGURACIÓN DE BASE DE DATOS
// ========================================
// Neon.tech PostgreSQL 17 - Serverless

export const DB_CONFIG = {
  // Obtener de variables de entorno en producción
  connectionString: import.meta.env.VITE_DATABASE_URL || '',

  // Configuración para @neondatabase/serverless
  ssl: true,

  // Pool de conexiones (para Netlify Functions)
  poolConfig: {
    max: 10, // Máximo de conexiones
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

// Tablas del sistema MOMENTO 1
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  CLASS_ACTIVITIES: 'class_activities',
  CLASS_SESSIONS: 'class_sessions',
  USER_INTERACTIONS: 'user_interactions',
  USER_ACHIEVEMENTS: 'user_achievements',
  AI_CACHE: 'ai_cache'
};

// Tipos de actividades permitidos (con etiquetas en español)
export const ACTIVITY_TYPES = [
  { value: 'expresion_oral', label: 'Expresión oral' },
  { value: 'comprension_lectora', label: 'Comprensión lectora' },
  { value: 'vocabulario', label: 'Vocabulario' },
  { value: 'comprension_auditiva', label: 'Comprensión auditiva' },
  { value: 'interaccion_oral', label: 'Interacción oral' },
  { value: 'ortografia', label: 'Ortografía' },
  { value: 'pronunciacion', label: 'Pronunciación' },
  { value: 'gramatica', label: 'Gramática' },
  { value: 'escritura', label: 'Escritura' },
  { value: 'autoevaluacion', label: 'Autoevaluación' }
];

// Estructuras de actividades permitidas (con etiquetas en español)
export const ACTIVITY_STRUCTURES = [
  { value: 'opcion_multiple', label: 'Opción múltiple' },
  { value: 'completar_huecos', label: 'Completar huecos' },
  { value: 'verdadero_falso', label: 'Verdadero/Falso' },
  { value: 'relacionar', label: 'Relacionar' },
  { value: 'ordenar', label: 'Ordenar' },
  { value: 'respuesta_corta', label: 'Respuesta corta' },
  { value: 'respuesta_abierta', label: 'Respuesta abierta' },
  { value: 'dialogo', label: 'Diálogo' },
  { value: 'redaccion', label: 'Redacción' }
];

// Códigos de libros soportados
export const BOOK_CODES = ['EM1', 'EM2', 'EM3', 'EM4'];

// Agentes IA disponibles para MOMENTO 1
export const MOMENTO1_AGENTS = {
  translator: {
    name: 'Ag. Traducción',
    description: 'Traduce del español a otra lengua según el contexto y nivel',
    icon: '/traduccion.png'
  },
  vocabulary: {
    name: 'Ag. Expansor',
    description: 'Amplia el vocabulario según el nivel y el campo semántico',
    icon: '/expansor.png'
  },
  personalizer: {
    name: 'Ag. Enfocado',
    description: 'Traduce o adapta al español una expresión específica del estudiante',
    icon: '/enfocado.png'
  },
  creative: {
    name: 'Ag. Improvisador',
    description: 'Responde de forma creativa y abierta a la actividad',
    icon: '/improvisador.png'
  },
  placeholder1: {
    name: '',
    description: 'En construcción',
    icon: '/under constr1.png'
  },
  placeholder2: {
    name: '',
    description: 'En construcción',
    icon: '/underconstr2.png'
  },
  placeholder3: {
    name: '',
    description: 'En construcción',
    icon: '/under construct3.png'
  }
};

// Tipos de bloques de contenido para actividades
export const CONTENT_BLOCK_TYPES = {
  vocabulary_words: {
    name: 'Palabras de vocabulario',
    icon: 'BookText',
    fields: ['words', 'category']
  },
  reading_text: {
    name: 'Texto de comprensión lectora',
    icon: 'BookOpen',
    fields: ['text', 'title']
  },
  audio_transcribed: {
    name: 'Audio transcrito',
    icon: 'Headphones',
    fields: ['audio_url', 'transcription']
  },
  closed_questions: {
    name: 'Preguntas cerradas',
    icon: 'HelpCircle',
    fields: ['questions_list']
  },
  fill_blank_text: {
    name: 'Texto para completar',
    icon: 'FileEdit',
    fields: ['text_with_blanks', 'answers']
  },
  matching_text: {
    name: 'Texto para relacionar',
    icon: 'Link',
    fields: ['column_a', 'column_b']
  },
  ordering_text: {
    name: 'Texto para ordenar',
    icon: 'ListOrdered',
    fields: ['items_to_order', 'correct_order']
  },
  speaking_situations: {
    name: 'Texto situaciones para hablar',
    icon: 'MessageCircle',
    fields: ['situations', 'prompts']
  },
  image: {
    name: 'Imagen',
    icon: 'Image',
    fields: ['image_url', 'alt_text', 'caption']
  },
  phrases: {
    name: 'Frases',
    icon: 'Quote',
    fields: ['phrases_list', 'context']
  },
  words_to_create_phrases: {
    name: 'Palabras para crear frases',
    icon: 'Puzzle',
    fields: ['words_list', 'instructions']
  },
  vocabulary: {
    name: 'Vocabulario',
    icon: 'Library',
    fields: ['vocab_list', 'definitions']
  },
  image_to_point: {
    name: 'Imagen para señalar',
    icon: 'MousePointer',
    fields: ['image_url', 'points', 'labels']
  },
  vocabulary_matching: {
    name: 'Vocabulario para relacionar',
    icon: 'ArrowLeftRight',
    fields: ['vocab_words', 'definitions_to_match']
  },
  open_questions_text: {
    name: 'Texto preguntas abiertas',
    icon: 'FileQuestion',
    fields: ['text', 'questions_list']
  },
  writing_text: {
    name: 'Texto escribir',
    icon: 'PenTool',
    fields: ['prompt', 'guidelines', 'word_count']
  }
};
