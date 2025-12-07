import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_OIwZh4Y3iRPg@ep-wandering-art-ad5wg4v6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

console.log('🚀 Creando tabla propuestas_agentes...\n');

try {
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
      estado VARCHAR(50) DEFAULT 'pendiente',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log('✅ Tabla creada');

  await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_email ON propuestas_agentes(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON propuestas_agentes(estado)`;
  console.log('✅ Índices creados');

  console.log('\n✅ Migración completada!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
