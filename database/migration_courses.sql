-- ========================================
-- MIGRACIÓN: Crear tabla COURSES
-- ========================================
-- Fecha: 2024-11-29
-- Propósito: Almacenar información de cursos (EM1, EM2, EM3, EM4)

-- 1. CREAR TABLA COURSES
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_code VARCHAR(50) UNIQUE NOT NULL,  -- EM1, EM2, EM3, EM4
    title VARCHAR(255) NOT NULL,            -- "Español en marcha 1"
    company VARCHAR(100),                   -- "SGEL"
    level VARCHAR(10) CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    units INTEGER,                          -- Número de unidades (12)
    lessons_per_unit INTEGER,               -- Lecciones por unidad
    project_days INTEGER,                   -- Días estimados del proyecto
    project_hours INTEGER,                  -- Horas proyectadas
    cover_image TEXT,                       -- URL de la portada
    status VARCHAR(50) DEFAULT 'Por empezar', -- "En proceso", "Por empezar", "Finalizado"
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_courses_book_code ON courses(book_code);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

-- 3. TRIGGER PARA UPDATED_AT
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. AGREGAR FOREIGN KEY A CLASS_ACTIVITIES
-- (Relacionar actividades con cursos)
ALTER TABLE class_activities
    ADD CONSTRAINT fk_class_activities_book_code
    FOREIGN KEY (book_code) REFERENCES courses(book_code)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- 5. INSERTAR DATOS INICIALES (Cursos hardcodeados del frontend)
INSERT INTO courses (book_code, title, company, level, units, lessons_per_unit, project_days, project_hours, cover_image, status, progress)
VALUES
    ('EM1', 'Español en marcha 1', 'SGEL', 'A1', 12, 15, 20, 20, '/portada.jpg', 'En proceso', 60),
    ('EM2', 'Español en marcha 2', 'SGEL', 'A2', 12, 20, 30, 30, '/em2.jpg', 'Por empezar', 0),
    ('EM3', 'Español en marcha 3', 'SGEL', 'B1', 12, 18, 25, 25, '/em3.jpg', 'Finalizado', 100),
    ('EM4', 'Español en marcha 4', 'SGEL', 'B2', 12, 25, 35, 35, '/em4.jpeg', 'Por empezar', 0)
ON CONFLICT (book_code) DO NOTHING;

-- 6. VERIFICACIÓN
DO $$
DECLARE
    course_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO course_count FROM courses;
    RAISE NOTICE '✅ Tabla courses creada con % cursos', course_count;
END $$;

-- 7. MOSTRAR CURSOS INSERTADOS
SELECT book_code, title, level, status, progress
FROM courses
ORDER BY book_code;
