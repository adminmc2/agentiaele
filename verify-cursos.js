import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  console.log('📊 Verificando tabla cursos (español)...\n');

  try {
    // Verificar estructura de la tabla
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'cursos'
      ORDER BY ordinal_position
    `;

    console.log('📋 Estructura de la tabla cursos:');
    console.log('─'.repeat(40));
    columns.forEach(col => {
      console.log(`  ${col.column_name.padEnd(25)} ${col.data_type}`);
    });

    // Verificar datos
    const cursos = await sql`SELECT * FROM cursos ORDER BY codigo`;

    console.log(`\n✅ ${cursos.length} cursos encontrados:\n`);

    cursos.forEach(c => {
      console.log(`  ${c.codigo} - ${c.nombre}`);
      console.log(`    empresa: ${c.empresa}`);
      console.log(`    nivel: ${c.nivel}`);
      console.log(`    unidades: ${c.unidades}`);
      console.log(`    lecciones_por_unidad: ${c.lecciones_por_unidad}`);
      console.log(`    horas_proyectadas: ${c.horas_proyectadas}`);
      console.log(`    periodo_dias: ${c.periodo_dias}`);
      console.log(`    portada: ${c.portada}`);
      console.log(`    estado: ${c.estado}`);
      console.log(`    progreso: ${c.progreso}%`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verify();
