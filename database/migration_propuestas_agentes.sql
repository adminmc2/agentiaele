-- ========================================
-- MIGRACIÓN: Tabla de Propuestas de Agentes
-- ========================================
-- Tabla para almacenar las propuestas de los profesores
-- desde el formulario "Sueña con tu agente"

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS propuestas_agentes (
  -- Identificador único
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Datos del profesor
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- Datos del contexto educativo
  nivel_estudiantes VARCHAR(50) NOT NULL,

  -- Datos de la propuesta del agente
  nombre_agente VARCHAR(150) NOT NULL,
  descripcion_agente TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  ejemplo_uso TEXT NOT NULL,

  -- Estado de la propuesta
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'aprobado', 'rechazado', 'completado')),

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_propuestas_email ON propuestas_agentes(email);
CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON propuestas_agentes(estado);
CREATE INDEX IF NOT EXISTS idx_propuestas_created_at ON propuestas_agentes(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_propuestas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS propuestas_updated_at_trigger ON propuestas_agentes;
CREATE TRIGGER propuestas_updated_at_trigger
  BEFORE UPDATE ON propuestas_agentes
  FOR EACH ROW
  EXECUTE FUNCTION update_propuestas_updated_at();

-- Comentarios de documentación
COMMENT ON TABLE propuestas_agentes IS 'Almacena las propuestas de agentes IA enviadas por profesores';
COMMENT ON COLUMN propuestas_agentes.nivel_estudiantes IS 'Nivel MCER de los estudiantes (A1, A2, B1, B2, C1, C2) o descripción general';
COMMENT ON COLUMN propuestas_agentes.estado IS 'Estado de la propuesta: pendiente, en_revision, aprobado, rechazado, completado';
