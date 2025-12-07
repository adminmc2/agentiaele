// ========================================
// HELPERS PARA MANEJO DE IMÁGENES
// ========================================

/**
 * Convierte la ruta de portada a la URL correcta según el entorno
 * @param {string} portada - Ruta de la portada desde la BD
 * @returns {string} - URL completa para mostrar la imagen
 */
export const getPortadaUrl = (portada) => {
  if (!portada) {
    return '/portada.jpg'; // Imagen por defecto
  }

  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (portada.startsWith('http://') || portada.startsWith('https://')) {
    return portada;
  }

  // Si viene de desarrollo local (/uploads/...), convertir según entorno
  if (portada.startsWith('/uploads/')) {
    // Extraer solo el nombre del archivo
    const filename = portada.replace('/uploads/', '');

    // En producción, usar la ruta de la API
    if (import.meta.env.PROD) {
      return `/api/upload/${filename}`;
    }

    // En desarrollo, usar la ruta local
    return portada;
  }

  // Si es una ruta simple (/em1.jpg, /em2.jpg, etc), devolverla tal cual
  return portada;
};
