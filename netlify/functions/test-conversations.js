// ========================================
// NETLIFY FUNCTION: TEST_CONVERSATIONS (CRUD)
// ========================================
// Gestión de conversaciones de prueba de prompts para acciones
// Cada conversación está vinculada a una acción específica

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
    // Extraer ID de la ruta si existe (ej: /api/test-conversations/uuid)
    const pathParts = path.split('/');
    const conversationId = pathParts[pathParts.length - 1];
    const isIdRequest = conversationId && conversationId !== 'test-conversations' && conversationId !== 'by-accion';

    // GET: Obtener conversaciones
    if (httpMethod === 'GET') {
      // GET /api/test-conversations/by-accion?accion_id=uuid - Conversaciones por acción
      if (path.endsWith('/by-accion')) {
        const accionId = queryStringParameters?.accion_id;

        if (!accionId) {
          return error('Se requiere accion_id como parámetro', 400);
        }

        const conversations = await sql`
          SELECT *
          FROM test_conversations
          WHERE accion_id = ${accionId}
          ORDER BY created_at DESC
        `;

        return success(conversations);
      }

      // GET /api/test-conversations/:id - Una conversación específica
      if (isIdRequest) {
        const conversations = await sql`
          SELECT *
          FROM test_conversations
          WHERE id = ${conversationId}
        `;

        if (conversations.length === 0) {
          return error('Conversación no encontrada', 404);
        }

        return success(conversations[0]);
      }

      // GET /api/test-conversations - Todas las conversaciones
      const conversations = await sql`
        SELECT
          tc.*,
          a.nombre_chat as accion_nombre
        FROM test_conversations tc
        JOIN acciones a ON tc.accion_id = a.id
        ORDER BY tc.created_at DESC
        LIMIT 100
      `;
      return success(conversations);
    }

    // POST: Crear nueva conversación
    if (httpMethod === 'POST') {
      const data = JSON.parse(event.body);

      // Validar campos obligatorios
      if (!data.accion_id) {
        return error('Campo obligatorio faltante: accion_id', 400);
      }
      if (!data.title) {
        return error('Campo obligatorio faltante: title', 400);
      }

      const result = await sql`
        INSERT INTO test_conversations (
          accion_id,
          title,
          prompt_used,
          messages
        ) VALUES (
          ${data.accion_id},
          ${data.title},
          ${data.prompt_used || null},
          ${JSON.stringify(data.messages || [])}
        )
        RETURNING *
      `;

      return success(result[0], 201);
    }

    // PUT: Actualizar conversación existente (agregar mensajes)
    if (httpMethod === 'PUT' && isIdRequest) {
      const data = JSON.parse(event.body);

      const result = await sql`
        UPDATE test_conversations SET
          title = COALESCE(${data.title}, title),
          prompt_used = COALESCE(${data.prompt_used}, prompt_used),
          messages = ${JSON.stringify(data.messages || [])},
          updated_at = NOW()
        WHERE id = ${conversationId}
        RETURNING *
      `;

      if (result.length === 0) {
        return error('Conversación no encontrada', 404);
      }

      return success(result[0]);
    }

    // DELETE: Eliminar conversación
    if (httpMethod === 'DELETE' && isIdRequest) {
      const result = await sql`
        DELETE FROM test_conversations
        WHERE id = ${conversationId}
        RETURNING id
      `;

      if (result.length === 0) {
        return error('Conversación no encontrada', 404);
      }

      return success({ message: 'Conversación eliminada correctamente', id: conversationId });
    }

    return error('Método no permitido', 405);

  } catch (err) {
    console.error('Error en function test-conversations:', err);
    return error(err.message, 500);
  }
}
