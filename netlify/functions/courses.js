// ========================================
// NETLIFY FUNCTION: CURSOS (CRUD)
// ========================================
// Gestión completa de cursos - campos en español

import { getDB, success, error, corsHeaders } from './db.js';

export async function handler(event) {
  // Manejar OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  const sql = getDB();
  const { httpMethod, path } = event;

  try {
    // Extraer ID de la ruta si existe (ej: /api/courses/123)
    const pathParts = path.split('/');
    const cursoId = pathParts[pathParts.length - 1];
    const isIdRequest = cursoId && cursoId !== 'courses' && cursoId !== 'stats';

    // GET: Obtener cursos o un curso específico
    if (httpMethod === 'GET') {
      // GET /api/courses/stats - Estadísticas
      if (path.endsWith('/stats')) {
        const stats = await sql`
          SELECT
            COUNT(*)::int as "totalCursos",
            COUNT(DISTINCT nivel)::int as "totalNiveles",
            COUNT(*) FILTER (WHERE estado = 'En proceso')::int as "cursosEnProceso",
            COUNT(*) FILTER (WHERE estado = 'Finalizado')::int as "cursosFinalizados",
            COUNT(*) FILTER (WHERE estado = 'Por empezar')::int as "cursosPorEmpezar",
            ROUND(AVG(progreso))::int as "progresoPromedio"
          FROM cursos
        `;

        return success(stats[0]);
      }

      // GET /api/courses/:id - Un curso específico
      if (isIdRequest) {
        const cursos = await sql`
          SELECT * FROM cursos
          WHERE id = ${cursoId}
        `;

        if (cursos.length === 0) {
          return error('Curso no encontrado', 404);
        }

        return success(cursos[0]);
      }

      // GET /api/courses - Todos los cursos
      const cursos = await sql`SELECT * FROM cursos ORDER BY codigo`;
      return success(cursos);
    }

    // POST: Crear nuevo curso
    if (httpMethod === 'POST') {
      const data = JSON.parse(event.body);

      // Validar campos obligatorios
      const required = ['codigo', 'nombre'];
      for (const field of required) {
        if (!data[field]) {
          return error(`Campo obligatorio faltante: ${field}`, 400);
        }
      }

      // Validar nivel si se proporciona
      if (data.nivel) {
        const nivelesValidos = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        if (!nivelesValidos.includes(data.nivel)) {
          return error('Nivel inválido. Debe ser: A1, A2, B1, B2, C1, o C2', 400);
        }
      }

      // Validar progreso si se proporciona
      if (data.progreso !== undefined && (data.progreso < 0 || data.progreso > 100)) {
        return error('El progreso debe estar entre 0 y 100', 400);
      }

      const result = await sql`
        INSERT INTO cursos (
          codigo,
          nombre,
          empresa,
          unidades,
          lecciones_por_unidad,
          nivel,
          periodo_dias,
          horas_proyectadas,
          portada,
          estado,
          progreso
        ) VALUES (
          ${data.codigo},
          ${data.nombre},
          ${data.empresa || null},
          ${data.unidades || null},
          ${data.lecciones_por_unidad || null},
          ${data.nivel || null},
          ${data.periodo_dias || null},
          ${data.horas_proyectadas || null},
          ${data.portada || null},
          ${data.estado || 'Por empezar'},
          ${data.progreso || 0}
        )
        RETURNING *
      `;

      return success(result[0], 201);
    }

    // PUT: Actualizar curso existente
    if (httpMethod === 'PUT' && isIdRequest) {
      const data = JSON.parse(event.body);

      // Validar nivel si se proporciona
      if (data.nivel) {
        const nivelesValidos = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        if (!nivelesValidos.includes(data.nivel)) {
          return error('Nivel inválido. Debe ser: A1, A2, B1, B2, C1, o C2', 400);
        }
      }

      // Validar progreso si se proporciona
      if (data.progreso !== undefined && (data.progreso < 0 || data.progreso > 100)) {
        return error('El progreso debe estar entre 0 y 100', 400);
      }

      const result = await sql`
        UPDATE cursos SET
          codigo = ${data.codigo},
          nombre = ${data.nombre},
          empresa = ${data.empresa || null},
          unidades = ${data.unidades || null},
          lecciones_por_unidad = ${data.lecciones_por_unidad || null},
          nivel = ${data.nivel || null},
          periodo_dias = ${data.periodo_dias || null},
          horas_proyectadas = ${data.horas_proyectadas || null},
          portada = ${data.portada || null},
          estado = ${data.estado || 'Por empezar'},
          progreso = ${data.progreso || 0}
        WHERE id = ${cursoId}
        RETURNING *
      `;

      if (result.length === 0) {
        return error('Curso no encontrado', 404);
      }

      return success(result[0]);
    }

    // DELETE: Eliminar curso
    if (httpMethod === 'DELETE' && isIdRequest) {
      const result = await sql`
        DELETE FROM cursos
        WHERE id = ${cursoId}
        RETURNING id
      `;

      if (result.length === 0) {
        return error('Curso no encontrado', 404);
      }

      return success({ message: 'Curso eliminado correctamente', id: cursoId });
    }

    return error('Método no permitido', 405);

  } catch (err) {
    console.error('Error en function courses:', err);
    return error(err.message, 500);
  }
}
