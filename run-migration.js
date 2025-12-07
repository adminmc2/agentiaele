import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL no configurada');
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigration() {
  try {
    console.log('🚀 Ejecutando migración: propuestas_agentes table\n');

    // 1. Crear tabla propuestas_agentes
    console.log('📝 Creando tabla propuestas_agentes...');
    await sql`
      CREATE TABLE IF NOT EXISTS propuestas_agentes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        nivel_estudiantes VARCHAR(50) NOT NULL,
        nombre_agente VARCHAR(150) NOT NULL,
        descripcion_agente TEXT NOT NULL,
        objetivo TEXT NOT NULL,
        ejemplo_uso TEXT NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'aprobado', 'rechazado', 'completado')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla propuestas_agentes creada');

    // 2. Crear índices
    console.log('📝 Creando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_email ON propuestas_agentes(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON propuestas_agentes(estado)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_created_at ON propuestas_agentes(created_at DESC)`;
    console.log('✅ Índices creados');

    // 3. Crear función para trigger
    console.log('📝 Creando función update_propuestas_updated_at...');
    await sql`
      CREATE OR REPLACE FUNCTION update_propuestas_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `;
    console.log('✅ Función creada');

    // 4. Crear trigger
    console.log('📝 Creando trigger...');
    await sql`DROP TRIGGER IF EXISTS propuestas_updated_at_trigger ON propuestas_agentes`;
    await sql`
      CREATE TRIGGER propuestas_updated_at_trigger
        BEFORE UPDATE ON propuestas_agentes
        FOR EACH ROW
        EXECUTE FUNCTION update_propuestas_updated_at()
    `;
    console.log('✅ Trigger creado');

    // 5. Verificar
    const propuestas = await sql`SELECT COUNT(*) as count FROM propuestas_agentes`;
    console.log(`\n✅ Migración completada! ${propuestas[0].count} propuestas en la base de datos`);

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
