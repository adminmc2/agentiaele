// Función temporal para crear la tabla propuestas_agentes
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  try {
    console.log('Creando tabla propuestas_agentes...');

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

    await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_email ON propuestas_agentes(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON propuestas_agentes(estado)`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Tabla propuestas_agentes creada exitosamente'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}
