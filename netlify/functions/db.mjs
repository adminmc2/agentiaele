// ========================================
// HELPER DE CONEXIÓN A BASE DE DATOS
// ========================================
// Neon.tech PostgreSQL 17 - Serverless

import { neon } from '@neondatabase/serverless';

let sql;

/**
 * Obtener cliente SQL de Neon
 * Reutiliza la conexión en llamadas subsecuentes
 */
export function getDB() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL no está configurada en las variables de entorno');
    }

    sql = neon(connectionString);
  }

  return sql;
}

/**
 * Headers CORS para respuestas
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Respuesta exitosa
 */
export function success(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify(data),
  };
}

/**
 * Respuesta de error
 */
export function error(message, statusCode = 500) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    body: JSON.stringify({ error: message }),
  };
}
