// ========================================
// NETLIFY FUNCTION: ACCIONES (CRUD)
// ========================================
// Gestión de acciones IA - campos en español
// Una ACCIÓN es una configuración de agente(s) para una ubicación del libro

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
  const { httpMethod, path, queryStringParameters } = event;

  try {
    // Extraer ID de la ruta si existe (ej: /api/acciones/uuid)
    const pathParts = path.split('/');
    const accionId = pathParts[pathParts.length - 1];
    const isIdRequest = accionId && accionId !== 'acciones' && accionId !== 'stats' && accionId !== 'by-curso';

    // GET: Obtener acciones
    if (httpMethod === 'GET') {
      // GET /api/acciones/stats - Estadísticas
      if (path.endsWith('/stats')) {
        const stats = await sql`
          SELECT
            COUNT(*)::int as "totalAcciones",
            COUNT(DISTINCT curso_id)::int as "totalCursos",
            COUNT(*) FILTER (WHERE estado = 'activo')::int as "accionesActivas",
            COUNT(*) FILTER (WHERE estado = 'inactivo')::int as "accionesInactivas",
            COUNT(*) FILTER (WHERE estado = 'borrador')::int as "accionesBorrador"
          FROM acciones
        `;

        return success(stats[0]);
      }

      // GET /api/acciones/by-curso?curso_id=uuid - Acciones por curso
      if (path.endsWith('/by-curso')) {
        const cursoId = queryStringParameters?.curso_id;

        if (!cursoId) {
          return error('Se requiere curso_id como parámetro', 400);
        }

        const acciones = await sql`
          SELECT
            a.*,
            c.codigo as curso_codigo,
            c.nombre as curso_nombre,
            c.nivel as curso_nivel
          FROM acciones a
          JOIN cursos c ON a.curso_id = c.id
          WHERE a.curso_id = ${cursoId}
          ORDER BY a.numero_unidad, a.apartado, a.numero_actividad
        `;

        return success(acciones);
      }

      // GET /api/acciones/:id - Una acción específica
      if (isIdRequest) {
        const acciones = await sql`
          SELECT
            a.*,
            c.codigo as curso_codigo,
            c.nombre as curso_nombre,
            c.nivel as curso_nivel
          FROM acciones a
          JOIN cursos c ON a.curso_id = c.id
          WHERE a.id = ${accionId}
        `;

        if (acciones.length === 0) {
          return error('Acción no encontrada', 404);
        }

        return success(acciones[0]);
      }

      // GET /api/acciones - Todas las acciones
      const acciones = await sql`
        SELECT
          a.*,
          c.codigo as curso_codigo,
          c.nombre as curso_nombre,
          c.nivel as curso_nivel
        FROM acciones a
        JOIN cursos c ON a.curso_id = c.id
        ORDER BY c.codigo, a.numero_unidad, a.apartado, a.numero_actividad
      `;
      return success(acciones);
    }

    // POST: Crear nueva acción
    if (httpMethod === 'POST') {
      const data = JSON.parse(event.body);

      // Validar campos obligatorios
      const required = ['curso_id', 'numero_unidad', 'apartado', 'numero_actividad', 'tipo_actividad', 'estructura_actividad', 'instrucciones', 'nombre_chat', 'prompt_ia'];
      for (const field of required) {
        if (!data[field]) {
          return error(`Campo obligatorio faltante: ${field}`, 400);
        }
      }

      // Validar tipo_actividad
      const tiposValidos = ['oral_expression', 'reading_comprehension', 'vocabulary', 'listening_comprehension', 'oral_interaction', 'spelling', 'pronunciation', 'grammar', 'writing', 'self_assessment'];
      if (!tiposValidos.includes(data.tipo_actividad)) {
        return error(`Tipo de actividad inválido. Valores válidos: ${tiposValidos.join(', ')}`, 400);
      }

      // Validar estructura_actividad
      const estructurasValidas = ['multiple_choice', 'fill_blank', 'true_false', 'matching', 'ordering', 'short_answer', 'open_ended', 'dialogue', 'essay'];
      if (!estructurasValidas.includes(data.estructura_actividad)) {
        return error(`Estructura de actividad inválida. Valores válidos: ${estructurasValidas.join(', ')}`, 400);
      }

      // Validar numero_unidad
      if (data.numero_unidad < 1 || data.numero_unidad > 12) {
        return error('El número de unidad debe estar entre 1 y 12', 400);
      }

      // Validar tiempo_estimado
      if (data.tiempo_estimado && (data.tiempo_estimado < 5 || data.tiempo_estimado > 120)) {
        return error('El tiempo estimado debe estar entre 5 y 120 minutos', 400);
      }

      const result = await sql`
        INSERT INTO acciones (
          curso_id,
          numero_unidad,
          apartado,
          numero_actividad,
          tipo_actividad,
          estructura_actividad,
          tiempo_estimado,
          instrucciones,
          contenido,
          nombre_chat,
          agentes_disponibles,
          prompt_ia,
          estado
        ) VALUES (
          ${data.curso_id},
          ${data.numero_unidad},
          ${data.apartado},
          ${data.numero_actividad},
          ${data.tipo_actividad},
          ${data.estructura_actividad},
          ${data.tiempo_estimado || 15},
          ${data.instrucciones},
          ${JSON.stringify(data.contenido || { blocks: [] })},
          ${data.nombre_chat},
          ${JSON.stringify(data.agentes_disponibles || { translator: true, vocabulary: true, personalizer: false, creative: false })},
          ${data.prompt_ia},
          ${data.estado || 'activo'}
        )
        RETURNING *
      `;

      return success(result[0], 201);
    }

    // PUT: Actualizar acción existente
    if (httpMethod === 'PUT' && isIdRequest) {
      const data = JSON.parse(event.body);

      // Validar tipo_actividad si se proporciona
      if (data.tipo_actividad) {
        const tiposValidos = ['oral_expression', 'reading_comprehension', 'vocabulary', 'listening_comprehension', 'oral_interaction', 'spelling', 'pronunciation', 'grammar', 'writing', 'self_assessment'];
        if (!tiposValidos.includes(data.tipo_actividad)) {
          return error(`Tipo de actividad inválido. Valores válidos: ${tiposValidos.join(', ')}`, 400);
        }
      }

      // Validar estructura_actividad si se proporciona
      if (data.estructura_actividad) {
        const estructurasValidas = ['multiple_choice', 'fill_blank', 'true_false', 'matching', 'ordering', 'short_answer', 'open_ended', 'dialogue', 'essay'];
        if (!estructurasValidas.includes(data.estructura_actividad)) {
          return error(`Estructura de actividad inválida. Valores válidos: ${estructurasValidas.join(', ')}`, 400);
        }
      }

      const result = await sql`
        UPDATE acciones SET
          curso_id = ${data.curso_id},
          numero_unidad = ${data.numero_unidad},
          apartado = ${data.apartado},
          numero_actividad = ${data.numero_actividad},
          tipo_actividad = ${data.tipo_actividad},
          estructura_actividad = ${data.estructura_actividad},
          tiempo_estimado = ${data.tiempo_estimado || 15},
          instrucciones = ${data.instrucciones},
          contenido = ${JSON.stringify(data.contenido || { blocks: [] })},
          nombre_chat = ${data.nombre_chat},
          agentes_disponibles = ${JSON.stringify(data.agentes_disponibles || {})},
          prompt_ia = ${data.prompt_ia},
          estado = ${data.estado || 'activo'}
        WHERE id = ${accionId}
        RETURNING *
      `;

      if (result.length === 0) {
        return error('Acción no encontrada', 404);
      }

      return success(result[0]);
    }

    // DELETE: Eliminar acción
    if (httpMethod === 'DELETE' && isIdRequest) {
      const result = await sql`
        DELETE FROM acciones
        WHERE id = ${accionId}
        RETURNING id
      `;

      if (result.length === 0) {
        return error('Acción no encontrada', 404);
      }

      return success({ message: 'Acción eliminada correctamente', id: accionId });
    }

    return error('Método no permitido', 405);

  } catch (err) {
    console.error('Error en function acciones:', err);
    return error(err.message, 500);
  }
}
