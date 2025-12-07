-- ========================================
-- VERIFICAR BASE DE DATOS EXISTENTE
-- ========================================

-- 1. Listar todas las tablas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Contar registros en cada tabla (si existen)
DO $$
DECLARE
    r RECORD;
    count_result INTEGER;
BEGIN
    FOR r IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', r.table_name) INTO count_result;
        RAISE NOTICE 'Tabla %: % registros', r.table_name, count_result;
    END LOOP;
END $$;

-- 3. Verificar extensiones instaladas
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pg_trgm')
ORDER BY extname;
