-- ========================================
-- MIGRACIÓN: TABLA ACCIONES
-- ========================================
-- Elimina class_activities (inglés) y crea acciones (español)
-- Una ACCIÓN es una configuración de agente(s) IA para una ubicación del libro

-- 1. Eliminar tabla anterior
DROP TABLE IF EXISTS class_activities CASCADE;

-- 2. Crear tabla acciones con campos en español
CREATE TABLE IF NOT EXISTS acciones (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    numero_unidad INTEGER NOT NULL CHECK (numero_unidad >= 1 AND numero_unidad <= 12),
    apartado VARCHAR(50) NOT NULL,
    numero_actividad INTEGER NOT NULL CHECK (numero_actividad >= 1 AND numero_actividad <= 15),

    -- Estructura de la actividad
    tipo_actividad VARCHAR(50) NOT NULL CHECK (tipo_actividad IN (
        'oral_expression', 'reading_comprehension', 'vocabulary', 'listening_comprehension',
        'oral_interaction', 'spelling', 'pronunciation', 'grammar',
        'writing', 'self_assessment'
    )),
    estructura_actividad VARCHAR(50) NOT NULL CHECK (estructura_actividad IN (
        'multiple_choice', 'fill_blank', 'true_false', 'matching',
        'ordering', 'short_answer', 'open_ended', 'dialogue', 'essay'
    )),
    tiempo_estimado INTEGER NOT NULL DEFAULT 15 CHECK (tiempo_estimado >= 5 AND tiempo_estimado <= 120),

    -- Contenido
    instrucciones TEXT NOT NULL,
    contenido JSONB DEFAULT '{"blocks": []}',
    nombre_chat VARCHAR(100) NOT NULL,

    -- Configuración IA
    agentes_disponibles JSONB NOT NULL DEFAULT '{"translator": true, "vocabulary": true, "personalizer": false, "creative": false}',
    prompt_ia TEXT NOT NULL,

    -- Metadatos
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'borrador')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices
CREATE INDEX IF NOT EXISTS idx_acciones_curso ON acciones(curso_id);
CREATE INDEX IF NOT EXISTS idx_acciones_unidad ON acciones(numero_unidad);
CREATE INDEX IF NOT EXISTS idx_acciones_ubicacion ON acciones(curso_id, numero_unidad, apartado, numero_actividad);
CREATE INDEX IF NOT EXISTS idx_acciones_tipo ON acciones(tipo_actividad);
CREATE INDEX IF NOT EXISTS idx_acciones_estado ON acciones(estado);

-- 4. Crear trigger para updated_at
CREATE OR REPLACE FUNCTION update_acciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_acciones_updated_at ON acciones;
CREATE TRIGGER trigger_acciones_updated_at
    BEFORE UPDATE ON acciones
    FOR EACH ROW
    EXECUTE FUNCTION update_acciones_updated_at();

-- 5. Insertar acción de ejemplo (para el curso EM1)
INSERT INTO acciones (
    curso_id,
    numero_unidad,
    apartado,
    numero_actividad,
    tipo_actividad,
    estructura_actividad,
    tiempo_estimado,
    instrucciones,
    contenido,
    nombre_chat,
    agentes_disponibles,
    prompt_ia,
    estado
)
SELECT
    c.id,
    1,
    '1b',
    1,
    'vocabulary',
    'open_ended',
    15,
    'Aprende el vocabulario de la unidad 1 con ayuda de los agentes IA.',
    '{"blocks": [{"type": "vocabulary_words", "data": {"words": ["hola", "adiós", "buenos días", "buenas tardes"], "category": "saludos"}}]}',
    'Traducir vocabulario',
    '{"translator": true, "vocabulary": true, "personalizer": false, "creative": false}',
    'Eres un asistente especializado en enseñanza de español nivel {{nivel}}.
El estudiante está trabajando con vocabulario de {{tipo_actividad}}.
Instrucciones de la actividad: {{instrucciones}}
Contenido: {{contenido}}

Traduce el vocabulario al idioma del estudiante de forma clara y con ejemplos de uso.',
    'activo'
FROM cursos c
WHERE c.codigo = 'EM1'
LIMIT 1;

-- 6. Verificación
DO $$
DECLARE
    accion_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO accion_count FROM acciones;
    RAISE NOTICE '✅ Tabla acciones creada correctamente';
    RAISE NOTICE '📝 Acciones de ejemplo: %', accion_count;
END $$;
