import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL no configurada');
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigration() {
  try {
    console.log('🚀 Ejecutando migración: courses table\n');

    // 1. Crear tabla courses
    console.log('📝 Creando tabla courses...');
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        book_code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(100),
        level VARCHAR(10) CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
        units INTEGER,
        lessons_per_unit INTEGER,
        project_days INTEGER,
        project_hours INTEGER,
        cover_image TEXT,
        status VARCHAR(50) DEFAULT 'Por empezar',
        progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla courses creada');

    // 2. Crear índices
    console.log('📝 Creando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_courses_book_code ON courses(book_code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status)`;
    console.log('✅ Índices creados');

    // 3. Crear trigger
    console.log('📝 Creando trigger...');
    await sql`
      CREATE TRIGGER update_courses_updated_at
        BEFORE UPDATE ON courses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log('✅ Trigger creado');

    // 4. Insertar datos iniciales
    console.log('📝 Insertando cursos iniciales...');
    await sql`
      INSERT INTO courses (book_code, title, company, level, units, lessons_per_unit, project_days, project_hours, cover_image, status, progress)
      VALUES
        ('EM1', 'Español en marcha 1', 'SGEL', 'A1', 12, 15, 20, 20, '/portada.jpg', 'En proceso', 60),
        ('EM2', 'Español en marcha 2', 'SGEL', 'A2', 12, 20, 30, 30, '/em2.jpg', 'Por empezar', 0),
        ('EM3', 'Español en marcha 3', 'SGEL', 'B1', 12, 18, 25, 25, '/em3.jpg', 'Finalizado', 100),
        ('EM4', 'Español en marcha 4', 'SGEL', 'B2', 12, 25, 35, 35, '/em4.jpeg', 'Por empezar', 0)
      ON CONFLICT (book_code) DO NOTHING
    `;
    console.log('✅ Cursos insertados');

    // 5. Verificar
    const courses = await sql`SELECT COUNT(*) as count FROM courses`;
    console.log(`\n✅ Migración completada! ${courses[0].count} cursos en la base de datos`);

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
