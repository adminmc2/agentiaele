// Script para ejecutar migración de test_conversations
import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('=== Ejecutando migración: test_conversations ===\n');

  try {
    // Leer archivo SQL
    const sql = fs.readFileSync('./database/migration_test_conversations.sql', 'utf8');

    // Ejecutar migración
    const result = await pool.query(sql);
    console.log('✓ Migración ejecutada correctamente');

    // Verificar tabla
    const check = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'test_conversations'
      ORDER BY ordinal_position
    `);

    console.log('\n=== Estructura de test_conversations ===');
    check.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

  } catch (error) {
    console.error('Error en migración:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
