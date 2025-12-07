-- ========================================
-- MIGRACIÓN: Tabla test_conversations
-- ========================================
-- Almacena conversaciones de prueba de prompts para acciones
-- Cada conversación está vinculada a una acción específica

-- Crear tabla de conversaciones de prueba
CREATE TABLE IF NOT EXISTS test_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accion_id UUID NOT NULL REFERENCES acciones(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  prompt_used TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por acción
CREATE INDEX IF NOT EXISTS idx_test_conversations_accion_id
ON test_conversations(accion_id);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_test_conversations_created_at
ON test_conversations(created_at DESC);

-- Comentarios de documentación
COMMENT ON TABLE test_conversations IS 'Conversaciones de prueba de prompts para acciones';
COMMENT ON COLUMN test_conversations.accion_id IS 'ID de la acción a la que pertenece esta conversación';
COMMENT ON COLUMN test_conversations.title IS 'Título descriptivo de la conversación';
COMMENT ON COLUMN test_conversations.prompt_used IS 'Prompt procesado que se usó en esta conversación';
COMMENT ON COLUMN test_conversations.messages IS 'Array JSON de mensajes [{role, content, timestamp}]';

-- Verificar creación
SELECT 'Tabla test_conversations creada correctamente' AS status;
