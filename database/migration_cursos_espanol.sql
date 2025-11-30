-- ========================================
-- MIGRACIÓN: TABLA CURSOS EN ESPAÑOL
-- ========================================
-- Elimina la tabla courses (inglés) y crea cursos (español)

-- 1. Eliminar tabla anterior
DROP TABLE IF EXISTS courses;

-- 2. Crear tabla cursos con campos en español
CREATE TABLE IF NOT EXISTS cursos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    empresa VARCHAR(100),
    unidades INTEGER,
    lecciones_por_unidad INTEGER,
    nivel VARCHAR(10) CHECK (nivel IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    periodo_dias INTEGER,
    horas_proyectadas INTEGER,
    portada TEXT,
    estado VARCHAR(50) DEFAULT 'Por empezar',
    progreso INTEGER DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices
CREATE INDEX IF NOT EXISTS idx_cursos_codigo ON cursos(codigo);
CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON cursos(nivel);
CREATE INDEX IF NOT EXISTS idx_cursos_estado ON cursos(estado);

-- 4. Crear trigger para updated_at
CREATE OR REPLACE FUNCTION update_cursos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cursos_updated_at ON cursos;
CREATE TRIGGER update_cursos_updated_at
    BEFORE UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION update_cursos_updated_at();

-- 5. Insertar los 4 cursos iniciales
INSERT INTO cursos (codigo, nombre, empresa, unidades, lecciones_por_unidad, nivel, periodo_dias, horas_proyectadas, portada, estado, progreso)
VALUES
    ('EM1', 'Español en marcha 1', 'SGEL', 12, 15, 'A1', NULL, 20, '/portada.jpg', 'En proceso', 60),
    ('EM2', 'Español en marcha 2', 'SGEL', 12, 20, 'A2', NULL, 30, '/em2.jpg', 'Por empezar', 0),
    ('EM3', 'Español en marcha 3', 'SGEL', 12, 18, 'B1', NULL, 25, '/em3.jpg', 'Finalizado', 100),
    ('EM4', 'Español en marcha 4', 'SGEL', 12, 25, 'B2', NULL, 35, '/em4.jpeg', 'Por empezar', 0);
