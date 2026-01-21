// ========================================
// NETLIFY FUNCTION: ACTIVIDADES (CRUD)
// ========================================
// Gestión completa de class_activities

import { getDB, success, error, corsHeaders } from './db.mjs';

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
    // Extraer ID de la ruta si existe (ej: /api/activities/123)
    const pathParts = path.split('/');
    const activityId = pathParts[pathParts.length - 1];
    const isIdRequest = activityId && activityId !== 'activities' && activityId !== 'stats';

    // GET: Obtener actividades o una actividad específica
    if (httpMethod === 'GET') {
      // GET /api/activities/stats - Estadísticas
      if (path.endsWith('/stats')) {
        const stats = await sql`
          SELECT
            COUNT(*)::int as "totalActivities",
            COUNT(DISTINCT book_code)::int as "activeBooks",
            COUNT(DISTINCT unit_number)::int as "totalUnits",
            COUNT(DISTINCT activity_type)::int as "activityTypes"
          FROM class_activities
        `;

        return success(stats[0]);
      }

      // GET /api/activities/:id - Una actividad específica
      if (isIdRequest) {
        const activities = await sql`
          SELECT * FROM class_activities
          WHERE id = ${activityId}
        `;

        if (activities.length === 0) {
          return error('Actividad no encontrada', 404);
        }

        return success(activities[0]);
      }

      // GET /api/activities - Todas las actividades con filtros opcionales
      const params = event.queryStringParameters || {};
      const { book_code, unit_number, activity_type } = params;

      let query = 'SELECT * FROM class_activities WHERE 1=1';
      const values = [];

      if (book_code) {
        values.push(book_code);
        query += ` AND book_code = $${values.length}`;
      }

      if (unit_number) {
        values.push(parseInt(unit_number));
        query += ` AND unit_number = $${values.length}`;
      }

      if (activity_type) {
        values.push(activity_type);
        query += ` AND activity_type = $${values.length}`;
      }

      query += ' ORDER BY book_code, unit_number, activity_number';

      const activities = await sql(query, values);
      return success(activities);
    }

    // POST: Crear nueva actividad
    if (httpMethod === 'POST') {
      const data = JSON.parse(event.body);

      // Validar campos obligatorios
      const required = ['book_code', 'unit_number', 'activity_number', 'title', 'instructions', 'activity_type', 'activity_structure', 'content', 'available_agents'];
      for (const field of required) {
        if (!data[field]) {
          return error(`Campo obligatorio faltante: ${field}`, 400);
        }
      }

      const result = await sql`
        INSERT INTO class_activities (
          book_code,
          unit_number,
          activity_number,
          activity_type,
          activity_structure,
          title,
          instructions,
          content,
          available_agents,
          estimated_time
        ) VALUES (
          ${data.book_code},
          ${data.unit_number},
          ${data.activity_number},
          ${data.activity_type},
          ${data.activity_structure},
          ${data.title},
          ${data.instructions},
          ${JSON.stringify(data.content)},
          ${JSON.stringify(data.available_agents)},
          ${data.estimated_time || null}
        )
        RETURNING *
      `;

      return success(result[0], 201);
    }

    // PUT: Actualizar actividad existente
    if (httpMethod === 'PUT' && isIdRequest) {
      const data = JSON.parse(event.body);

      const result = await sql`
        UPDATE class_activities SET
          book_code = ${data.book_code},
          unit_number = ${data.unit_number},
          activity_number = ${data.activity_number},
          activity_type = ${data.activity_type},
          activity_structure = ${data.activity_structure},
          title = ${data.title},
          instructions = ${data.instructions},
          content = ${JSON.stringify(data.content)},
          available_agents = ${JSON.stringify(data.available_agents)},
          estimated_time = ${data.estimated_time || null}
        WHERE id = ${activityId}
        RETURNING *
      `;

      if (result.length === 0) {
        return error('Actividad no encontrada', 404);
      }

      return success(result[0]);
    }

    // DELETE: Eliminar actividad
    if (httpMethod === 'DELETE' && isIdRequest) {
      const result = await sql`
        DELETE FROM class_activities
        WHERE id = ${activityId}
        RETURNING id
      `;

      if (result.length === 0) {
        return error('Actividad no encontrada', 404);
      }

      return success({ message: 'Actividad eliminada correctamente', id: activityId });
    }

    return error('Método no permitido', 405);

  } catch (err) {
    console.error('Error en function activities:', err);
    return error(err.message, 500);
  }
}
