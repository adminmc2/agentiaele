import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log('🔄 Iniciando migración a tabla cursos en español...\n');

  try {
    // 1. Eliminar tabla courses anterior
    console.log('📝 Eliminando tabla courses (inglés)...');
    await sql`DROP TABLE IF EXISTS courses`;
    console.log('✅ Tabla courses eliminada\n');

    // 2. Crear tabla cursos con campos en español
    console.log('📝 Creando tabla cursos (español)...');
    await sql`
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
      )
    `;
    console.log('✅ Tabla cursos creada\n');

    // 3. Crear índices
    console.log('📝 Creando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_cursos_codigo ON cursos(codigo)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON cursos(nivel)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cursos_estado ON cursos(estado)`;
    console.log('✅ Índices creados\n');

    // 4. Crear función y trigger para updated_at
    console.log('📝 Creando trigger para updated_at...');
    await sql`
      CREATE OR REPLACE FUNCTION update_cursos_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `;
    await sql`DROP TRIGGER IF EXISTS update_cursos_updated_at ON cursos`;
    await sql`
      CREATE TRIGGER update_cursos_updated_at
        BEFORE UPDATE ON cursos
        FOR EACH ROW
        EXECUTE FUNCTION update_cursos_updated_at()
    `;
    console.log('✅ Trigger creado\n');

    // 5. Insertar los 4 cursos iniciales
    console.log('📝 Insertando cursos iniciales...');

    await sql`
      INSERT INTO cursos (codigo, nombre, empresa, unidades, lecciones_por_unidad, nivel, periodo_dias, horas_proyectadas, portada, estado, progreso)
      VALUES ('EM1', 'Español en marcha 1', 'SGEL', 12, 15, 'A1', NULL, 20, '/portada.jpg', 'En proceso', 60)
    `;

    await sql`
      INSERT INTO cursos (codigo, nombre, empresa, unidades, lecciones_por_unidad, nivel, periodo_dias, horas_proyectadas, portada, estado, progreso)
      VALUES ('EM2', 'Español en marcha 2', 'SGEL', 12, 20, 'A2', NULL, 30, '/em2.jpg', 'Por empezar', 0)
    `;

    await sql`
      INSERT INTO cursos (codigo, nombre, empresa, unidades, lecciones_por_unidad, nivel, periodo_dias, horas_proyectadas, portada, estado, progreso)
      VALUES ('EM3', 'Español en marcha 3', 'SGEL', 12, 18, 'B1', NULL, 25, '/em3.jpg', 'Finalizado', 100)
    `;

    await sql`
      INSERT INTO cursos (codigo, nombre, empresa, unidades, lecciones_por_unidad, nivel, periodo_dias, horas_proyectadas, portada, estado, progreso)
      VALUES ('EM4', 'Español en marcha 4', 'SGEL', 12, 25, 'B2', NULL, 35, '/em4.jpeg', 'Por empezar', 0)
    `;

    console.log('✅ 4 cursos insertados\n');

    // 6. Verificar
    const count = await sql`SELECT COUNT(*) as total FROM cursos`;
    console.log(`\n✅ MIGRACIÓN COMPLETADA! ${count[0].total} cursos en la base de datos`);

    // Mostrar los cursos
    const cursos = await sql`SELECT codigo, nombre, empresa, nivel, horas_proyectadas, lecciones_por_unidad, estado, progreso, portada FROM cursos ORDER BY codigo`;
    console.log('\n📊 Cursos en la base de datos:\n');
    cursos.forEach(c => {
      console.log(`  ${c.codigo} - ${c.nombre}`);
      console.log(`    Empresa: ${c.empresa} | Nivel: ${c.nivel}`);
      console.log(`    Horas: ${c.horas_proyectadas} | Lecciones: ${c.lecciones_por_unidad}`);
      console.log(`    Estado: ${c.estado} | Progreso: ${c.progreso}%`);
      console.log(`    Portada: ${c.portada}\n`);
    });

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    process.exit(1);
  }
}

runMigration();
