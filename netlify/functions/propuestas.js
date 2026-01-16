// ========================================
// FUNCIÓN NETLIFY: Gestión de Propuestas de Agentes
// ========================================
// API para crear y gestionar propuestas desde "Sueña con tu agente"

import { neon } from '@neondatabase/serverless';

// Configurar conexión a Neon
const sql = neon(process.env.DATABASE_URL);

// Headers CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event) {
  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/propuestas', '');
    const method = event.httpMethod;

    // ========================================
    // POST /propuestas - Crear nueva propuesta
    // ========================================
    if (method === 'POST' && !path) {
      const data = JSON.parse(event.body);

      // Validar campos obligatorios
      const requiredFields = [
        'nombre',
        'apellidos',
        'email',
        'nivel_estudiantes',
        'nombre_agente',
        'descripcion_agente',
        'objetivo',
        'ejemplo_uso'
      ];

      for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: `El campo ${field} es obligatorio`
            })
          };
        }
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email inválido' })
        };
      }

      // Insertar en base de datos
      const query = `
        INSERT INTO propuestas_agentes (
          nombre,
          apellidos,
          email,
          nivel_estudiantes,
          nombre_agente,
          descripcion_agente,
          objetivo,
          ejemplo_uso,
          estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pendiente')
        RETURNING *
      `;

      const values = [
        data.nombre.trim(),
        data.apellidos.trim(),
        data.email.trim().toLowerCase(),
        data.nivel_estudiantes.trim(),
        data.nombre_agente.trim(),
        data.descripcion_agente.trim(),
        data.objetivo.trim(),
        data.ejemplo_uso.trim()
      ];

      const result = await sql.query(query, values);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Propuesta creada exitosamente',
          data: result[0]
        })
      };
    }

    // ========================================
    // GET /propuestas - Listar todas las propuestas (admin)
    // ========================================
    if (method === 'GET' && !path) {
      const { estado } = event.queryStringParameters || {};

      let query = 'SELECT * FROM propuestas_agentes';
      const values = [];

      if (estado) {
        query += ' WHERE estado = $1';
        values.push(estado);
      }

      query += ' ORDER BY created_at DESC';

      const result = await sql.query(query, values);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    }

    // ========================================
    // GET /propuestas/:id - Obtener propuesta por ID
    // ========================================
    if (method === 'GET' && path.startsWith('/')) {
      const id = path.substring(1);

      const result = await sql.query(
        'SELECT * FROM propuestas_agentes WHERE id = $1',
        [id]
      );

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Propuesta no encontrada' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result[0])
      };
    }

    // ========================================
    // PUT /propuestas/:id - Actualizar estado de propuesta (admin)
    // ========================================
    if (method === 'PUT' && path.startsWith('/')) {
      const id = path.substring(1);
      const data = JSON.parse(event.body);

      // Validar estado
      const estadosValidos = ['pendiente', 'en_revision', 'aprobado', 'rechazado', 'completado'];
      if (data.estado && !estadosValidos.includes(data.estado)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`
          })
        };
      }

      const result = await sql.query(
        'UPDATE propuestas_agentes SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [data.estado, id]
      );

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Propuesta no encontrada' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Propuesta actualizada',
          data: result[0]
        })
      };
    }

    // ========================================
    // DELETE /propuestas/:id - Eliminar propuesta (admin)
    // ========================================
    if (method === 'DELETE' && path.startsWith('/')) {
      const id = path.substring(1);

      const result = await sql.query(
        'DELETE FROM propuestas_agentes WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Propuesta no encontrada' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Propuesta eliminada'
        })
      };
    }

    // Ruta no encontrada
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Ruta no encontrada' })
    };

  } catch (error) {
    console.error('Error en propuestas function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
}
