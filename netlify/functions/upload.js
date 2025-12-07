// ========================================
// NETLIFY FUNCTION: UPLOAD (Blobs)
// ========================================
// Gestión de subida de imágenes usando Netlify Blobs
// En desarrollo local, guarda en el sistema de archivos

import { getStore } from '@netlify/blobs';
import fs from 'fs';
import path from 'path';
import process from 'process';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

// Detectar si estamos en desarrollo local
// En producción, CONTEXT.deployId existe
const isLocal = () => process.env.NETLIFY_DEV === 'true';

// Directorio local para desarrollo
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function handler(event) {
  // Manejar OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  try {
    // POST: Subir imagen
    if (event.httpMethod === 'POST') {
      const contentType = event.headers['content-type'] || '';

      // Verificar que es una imagen
      if (!contentType.startsWith('image/')) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Solo se permiten imágenes' }),
        };
      }

      // El body viene en base64 cuando es binario
      const imageBuffer = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body);

      // Generar nombre único para la imagen
      const extension = contentType.split('/')[1] || 'png';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

      if (isLocal()) {
        // En desarrollo: guardar en el sistema de archivos
        if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
          fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
        }
        const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
        fs.writeFileSync(filePath, imageBuffer);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            filename: filename,
            url: `/uploads/${filename}`,
          }),
        };
      } else {
        // En producción: usar Netlify Blobs
        const store = getStore({
          name: 'portadas',
          siteID: process.env.SITE_ID,
          token: process.env.NETLIFY_BLOBS_CONTEXT,
        });
        await store.set(filename, imageBuffer, {
          metadata: {
            contentType: contentType,
            uploadedAt: new Date().toISOString(),
          },
        });

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            filename: filename,
            url: `/api/upload/${filename}`,
          }),
        };
      }
    }

    // GET: Obtener imagen
    if (event.httpMethod === 'GET') {
      const pathParts = event.path.split('/');
      const filename = pathParts[pathParts.length - 1];

      if (!filename || filename === 'upload') {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Nombre de archivo requerido' }),
        };
      }

      if (isLocal()) {
        // En desarrollo: leer del sistema de archivos
        const filePath = path.join(LOCAL_UPLOAD_DIR, filename);

        if (!fs.existsSync(filePath)) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Imagen no encontrada' }),
          };
        }

        const imageBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filename).slice(1);
        const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
        };

        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': mimeTypes[ext] || 'image/png',
            'Cache-Control': 'public, max-age=31536000',
          },
          body: imageBuffer.toString('base64'),
          isBase64Encoded: true,
        };
      } else {
        // En producción: usar Netlify Blobs
        const store = getStore({
          name: 'portadas',
          siteID: process.env.SITE_ID,
          token: process.env.NETLIFY_BLOBS_CONTEXT,
        });
        const blob = await store.get(filename, { type: 'arrayBuffer' });

        if (!blob) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Imagen no encontrada' }),
          };
        }

        const metadata = await store.getMetadata(filename);

        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': metadata?.metadata?.contentType || 'image/png',
            'Cache-Control': 'public, max-age=31536000',
          },
          body: Buffer.from(blob).toString('base64'),
          isBase64Encoded: true,
        };
      }
    }

    // DELETE: Eliminar imagen
    if (event.httpMethod === 'DELETE') {
      const pathParts = event.path.split('/');
      const filename = pathParts[pathParts.length - 1];

      if (!filename || filename === 'upload') {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Nombre de archivo requerido' }),
        };
      }

      if (isLocal()) {
        // En desarrollo: eliminar del sistema de archivos
        const filePath = path.join(LOCAL_UPLOAD_DIR, filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ success: true, message: 'Imagen eliminada' }),
        };
      } else {
        // En producción: usar Netlify Blobs
        const store = getStore({
          name: 'portadas',
          siteID: process.env.SITE_ID,
          token: process.env.NETLIFY_BLOBS_CONTEXT,
        });
        await store.delete(filename);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ success: true, message: 'Imagen eliminada' }),
        };
      }
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };

  } catch (error) {
    console.error('Error en upload:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
