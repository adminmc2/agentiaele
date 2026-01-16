// ========================================
// FUNCIÓN NETLIFY: Setup de tablas de autenticación
// ========================================
// Migración para crear tablas: usuarios, codigos_invitacion, credenciales_webauthn

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  try {
    console.log('Creando tablas de autenticación...');

    // 1. Tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'usuario',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('Tabla usuarios creada');

    // 2. Tabla de códigos de invitación
    await sql`
      CREATE TABLE IF NOT EXISTS codigos_invitacion (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo VARCHAR(20) UNIQUE NOT NULL,
        usado BOOLEAN DEFAULT FALSE,
        usado_por UUID REFERENCES usuarios(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE
      )
    `;
    console.log('Tabla codigos_invitacion creada');

    // 3. Tabla de credenciales WebAuthn (biometría)
    await sql`
      CREATE TABLE IF NOT EXISTS credenciales_webauthn (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        credential_id TEXT UNIQUE NOT NULL,
        public_key TEXT NOT NULL,
        counter INTEGER DEFAULT 0,
        device_name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('Tabla credenciales_webauthn creada');

    // 4. Crear índices
    await sql`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_codigos_codigo ON codigos_invitacion(codigo)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webauthn_usuario ON credenciales_webauthn(usuario_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webauthn_credential ON credenciales_webauthn(credential_id)`;

    // 5. Insertar códigos de invitación iniciales (si no existen)
    const codigosIniciales = ['ELIAS2026', 'PROFE2026', 'DEMO2026'];

    for (const codigo of codigosIniciales) {
      await sql`
        INSERT INTO codigos_invitacion (codigo)
        VALUES (${codigo})
        ON CONFLICT (codigo) DO NOTHING
      `;
    }
    console.log('Códigos de invitación iniciales creados');

    // 6. Migrar usuario admin existente (hardcodeado) a la base de datos
    // Contraseña: 19/10.25_Acc hasheada con bcrypt
    const bcrypt = await import('bcryptjs');
    const adminPasswordHash = await bcrypt.hash('19/10.25_Acc', 10);

    await sql`
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES ('Armando Cruz', 'mandoc2@inmersion.io', ${adminPasswordHash}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('Usuario admin migrado');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Tablas de autenticación creadas exitosamente',
        tablas: ['usuarios', 'codigos_invitacion', 'credenciales_webauthn'],
        codigos_creados: codigosIniciales
      })
    };
  } catch (error) {
    console.error('Error en setup-auth-tables:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}
