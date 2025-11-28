-- ========================================
-- AgentiaELE MVP - Schema PostgreSQL 17
-- Base de Datos: Neon.tech
-- MOMENTO 1: CLASE (Aprendizaje Guiado con IA)
-- 6 Tablas para 100 usuarios beta
-- ========================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- 1. USER_PROFILES
-- ========================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id VARCHAR(255) UNIQUE NOT NULL, -- ID de Auth0/Clerk
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    level VARCHAR(10) DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    send_chat_emails BOOLEAN DEFAULT TRUE, -- Preferencia: enviar chats por email
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- ========================================
-- 2. CLASS_ACTIVITIES
-- ========================================
CREATE TABLE IF NOT EXISTS class_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_code VARCHAR(50) NOT NULL CHECK (book_code IN ('EM1', 'EM2', 'EM3', 'EM4')), -- Español en Marcha 1, 2, 3, 4
    unit_number INTEGER NOT NULL CHECK (unit_number BETWEEN 1 AND 12),
    activity_number INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
        'oral_expression', 'reading_comprehension', 'vocabulary', 'listening_comprehension',
        'oral_interaction', 'spelling', 'pronunciation', 'grammar',
        'writing', 'self_assessment'
    )),
    activity_structure VARCHAR(50) NOT NULL CHECK (activity_structure IN (
        'multiple_choice', 'fill_blank', 'true_false', 'matching',
        'ordering', 'short_answer', 'open_ended', 'dialogue', 'essay'
    )),
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    content JSONB NOT NULL, -- Contenido flexible (preguntas, opciones, textos, etc.)
    available_agents JSONB NOT NULL, -- Agentes IA disponibles para esta actividad
    estimated_time INTEGER, -- minutos estimados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas por libro y unidad
CREATE INDEX IF NOT EXISTS idx_class_activities_book_unit ON class_activities(book_code, unit_number);
CREATE INDEX IF NOT EXISTS idx_class_activities_type ON class_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_class_activities_structure ON class_activities(activity_structure);

-- ========================================
-- 3. CLASS_SESSIONS
-- ========================================
CREATE TABLE IF NOT EXISTS class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES class_activities(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Para detectar inactividad
    chat_messages JSONB DEFAULT '[]'::jsonb, -- Historial completo del chat para UI/email [{"role": "user/assistant", "agent": "translator", "content": "...", "timestamp": "..."}]
    ai_agents_used JSONB DEFAULT '[]'::jsonb, -- Lista de agentes usados ["translator", "vocabulary", "creative"]
    total_interactions INTEGER DEFAULT 0, -- Cuántas preguntas/respuestas
    time_spent_seconds INTEGER DEFAULT 0, -- Segundos dedicados
    email_sent BOOLEAN DEFAULT FALSE, -- Si ya se envió el resumen por email
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_class_sessions_user_id ON class_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_activity_id ON class_sessions(activity_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_created_at ON class_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_sessions_email_sent ON class_sessions(email_sent) WHERE email_sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_class_sessions_last_active ON class_sessions(last_active_at DESC);

-- ========================================
-- 4. USER_INTERACTIONS
-- ========================================
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES class_activities(id) ON DELETE CASCADE,

    -- Pregunta del estudiante
    user_question TEXT NOT NULL,
    user_question_topic VARCHAR(100), -- Topic detectado: 'presente_indicativo', 'vocabulario', etc.

    -- Respuesta de IA
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN (
        'translator', 'vocabulary', 'personalizer', 'creative',
        'corrector', 'evaluator', 'teacher', 'tutor'
    )),
    agent_response TEXT NOT NULL,

    -- Metadata para analytics y ML
    interaction_index INTEGER NOT NULL, -- Orden en el chat (1, 2, 3...)
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5), -- Feedback opcional del estudiante

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para analytics y ML
CREATE INDEX IF NOT EXISTS idx_user_interactions_session ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_activity ON user_interactions(activity_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_agent ON user_interactions(agent_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_topic ON user_interactions(user_question_topic) WHERE user_question_topic IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_interactions_date ON user_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_interactions_rating ON user_interactions(user_rating) WHERE user_rating IS NOT NULL;

-- ========================================
-- 5. USER_ACHIEVEMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL, -- 'first_question', 'time_10min', 'used_translator', 'completed_unit_1', etc.
    achievement_category VARCHAR(50) NOT NULL CHECK (achievement_category IN (
        'usage', 'time', 'exploration', 'consistency', 'milestone'
    )),
    achievement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB, -- Info adicional (ej: {"time_spent": 600, "unit": 1, "agent": "translator"})
    points INTEGER DEFAULT 0, -- Puntos otorgados por este logro
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas y rankings
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_user_achievements_category ON user_achievements(achievement_category);
CREATE INDEX IF NOT EXISTS idx_user_achievements_date ON user_achievements(achievement_date DESC);

-- ========================================
-- 6. AI_CACHE
-- ========================================
CREATE TABLE IF NOT EXISTS ai_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL, -- Hash del prompt + parámetros
    prompt_hash VARCHAR(64) NOT NULL, -- SHA-256 del prompt
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN (
        'translator', 'vocabulary', 'personalizer', 'creative',
        'corrector', 'evaluator', 'teacher', 'tutor'
    )),
    response JSONB NOT NULL, -- Respuesta del agente en JSON
    hit_count INTEGER DEFAULT 1, -- Contador de usos
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- TTL opcional
);

-- Índices para búsqueda rápida de caché
CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hash_agent ON ai_cache(prompt_hash, agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires_at ON ai_cache(expires_at) WHERE expires_at IS NOT NULL;

-- ========================================
-- FUNCIONES DE UTILIDAD
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar last_active_at automáticamente
CREATE OR REPLACE FUNCTION update_last_active_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_sessions_updated_at
    BEFORE UPDATE ON class_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para last_active_at
CREATE TRIGGER update_class_sessions_last_active
    BEFORE UPDATE ON class_sessions
    FOR EACH ROW
    WHEN (NEW.chat_messages IS DISTINCT FROM OLD.chat_messages)
    EXECUTE FUNCTION update_last_active_at_column();

-- ========================================
-- DATOS DE PRUEBA
-- ========================================

-- Insertar una actividad de clase de ejemplo
INSERT INTO class_activities (
    book_code,
    unit_number,
    activity_number,
    activity_type,
    activity_structure,
    title,
    instructions,
    content,
    available_agents,
    estimated_time
) VALUES (
    'EM1',
    1,
    1,
    'grammar',
    'open_ended',
    'Presente de indicativo - Exploración con IA',
    'Explora el presente de indicativo con ayuda de los agentes IA. Puedes hacer preguntas, pedir traducciones, o solicitar ejemplos creativos.',
    '{
        "topic": "presente_indicativo",
        "grammar_points": [
            "Verbos regulares -ar, -er, -ir",
            "Primera, segunda y tercera persona",
            "Uso del presente en contextos cotidianos"
        ],
        "examples": [
            {"verb": "hablar", "conjugation": "yo hablo, tú hablas, él/ella habla"},
            {"verb": "comer", "conjugation": "yo como, tú comes, él/ella come"},
            {"verb": "vivir", "conjugation": "yo vivo, tú vives, él/ella vive"}
        ],
        "prompts": [
            "¿Cómo se dice ''I speak Spanish'' en español?",
            "Dame 5 ejemplos de verbos regulares en -ar",
            "Crea una historia corta usando el presente de indicativo"
        ]
    }',
    '{
        "translator": {
            "name": "Agente Traductor",
            "description": "Traduce entre inglés y español con contexto"
        },
        "vocabulary": {
            "name": "Agente Vocabulario",
            "description": "Explica palabras y da sinónimos/antónimos"
        },
        "personalizer": {
            "name": "Agente Personalizador",
            "description": "Adapta ejemplos a tus intereses personales"
        },
        "creative": {
            "name": "Agente Creativo",
            "description": "Genera historias, diálogos y ejemplos creativos"
        }
    }',
    15
) ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Mostrar resumen de tablas creadas
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name IN ('user_profiles', 'class_activities', 'class_sessions', 'user_interactions', 'user_achievements', 'ai_cache');

    RAISE NOTICE '✅ Tablas creadas: % de 6', table_count;
    RAISE NOTICE '📚 Tablas: user_profiles, class_activities, class_sessions, user_interactions, user_achievements, ai_cache';
END $$;

-- Mostrar actividades de ejemplo insertadas
DO $$
DECLARE
    activity_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO activity_count FROM class_activities;
    RAISE NOTICE '📝 Actividades de ejemplo: %', activity_count;
END $$;
