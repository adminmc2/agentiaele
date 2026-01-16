// Script para ejecutar la migración de tablas de autenticación directamente
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración de tablas de autenticación...\n');

    // 1. Tabla de usuarios
    console.log('📦 Creando tabla usuarios...');
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
    console.log('✅ Tabla usuarios creada\n');

    // 2. Tabla de códigos de invitación
    console.log('📦 Creando tabla codigos_invitacion...');
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
    console.log('✅ Tabla codigos_invitacion creada\n');

    // 3. Tabla de credenciales WebAuthn (biometría)
    console.log('📦 Creando tabla credenciales_webauthn...');
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
    console.log('✅ Tabla credenciales_webauthn creada\n');

    // 4. Crear índices
    console.log('📦 Creando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_codigos_codigo ON codigos_invitacion(codigo)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webauthn_usuario ON credenciales_webauthn(usuario_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_webauthn_credential ON credenciales_webauthn(credential_id)`;
    console.log('✅ Índices creados\n');

    // 5. Insertar códigos de invitación iniciales
    console.log('📦 Insertando códigos de invitación iniciales...');
    const codigosIniciales = ['ELIAS2026', 'PROFE2026', 'DEMO2026'];

    for (const codigo of codigosIniciales) {
      await sql`
        INSERT INTO codigos_invitacion (codigo)
        VALUES (${codigo})
        ON CONFLICT (codigo) DO NOTHING
      `;
    }
    console.log('✅ Códigos creados:', codigosIniciales.join(', '), '\n');

    // 6. Migrar usuario admin existente
    console.log('📦 Migrando usuario admin...');
    const adminPasswordHash = await bcrypt.hash('19/10.25_Acc', 10);

    await sql`
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES ('Armando Cruz', 'mandoc2@inmersion.io', ${adminPasswordHash}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('✅ Usuario admin migrado\n');

    // 7. Verificar tablas creadas
    console.log('📋 Verificando tablas creadas...');
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('usuarios', 'codigos_invitacion', 'credenciales_webauthn')
    `;
    console.log('Tablas encontradas:', tables.map(t => t.table_name).join(', '));

    console.log('\n🎉 ¡Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    process.exit(1);
  }
}

runMigration();
