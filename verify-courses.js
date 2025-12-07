import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  console.log('📊 Verificando tabla courses...\n');

  const courses = await sql`SELECT * FROM courses ORDER BY book_code`;

  console.log(`✅ ${courses.length} cursos encontrados:\n`);

  courses.forEach(c => {
    console.log(`  ${c.book_code} - ${c.title}`);
    console.log(`    Nivel: ${c.level} | Status: ${c.status} | Progreso: ${c.progress}%`);
    console.log(`    Unidades: ${c.units} | Portada: ${c.cover_image}\n`);
  });
}

verify();
