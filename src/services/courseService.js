// ========================================
// SERVICIO DE GESTIÓN DE CURSOS
// ========================================
// CRUD completo para cursos - campos en español

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Obtener todos los cursos
 * @param {Object} filters - Filtros opcionales (nivel, estado, empresa)
 * @returns {Promise<Array>}
 */
export const getAllCourses = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/courses${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching courses: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    throw error;
  }
};

/**
 * Obtener un curso por ID
 * @param {string} cursoId - UUID del curso
 * @returns {Promise<Object>}
 */
export const getCourseById = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${cursoId}`);

    if (!response.ok) {
      throw new Error(`Error fetching course: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getCourseById:', error);
    throw error;
  }
};

/**
 * Crear un nuevo curso
 * @param {Object} cursoData - Datos del curso en español
 * @returns {Promise<Object>}
 */
export const createCourse = async (cursoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cursoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating course');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
};

/**
 * Actualizar un curso existente
 * @param {string} cursoId - UUID del curso
 * @param {Object} cursoData - Datos actualizados en español
 * @returns {Promise<Object>}
 */
export const updateCourse = async (cursoId, cursoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${cursoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cursoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating course');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
};

/**
 * Eliminar un curso
 * @param {string} cursoId - UUID del curso
 * @returns {Promise<Object>}
 */
export const deleteCourse = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${cursoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error deleting course');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de cursos
 * @returns {Promise<Object>}
 */
export const getCoursesStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/stats`);

    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getCoursesStats:', error);
    throw error;
  }
};

/**
 * Subir imagen de portada a Netlify Blobs
 * @param {File} file - Archivo de imagen
 * @returns {Promise<Object>} - { success, filename, url }
 */
export const uploadPortada = async (file) => {
  try {
    console.log('Uploading file:', file.name, file.type, file.size);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || `Error subiendo imagen (${response.status})`);
      } catch (parseError) {
        throw new Error(`Error subiendo imagen: ${response.status} - ${errorText.substring(0, 100)}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadPortada:', error);
    throw error;
  }
};

/**
 * Eliminar imagen de portada de Netlify Blobs
 * @param {string} filename - Nombre del archivo
 * @returns {Promise<Object>}
 */
export const deletePortada = async (filename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error eliminando imagen');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deletePortada:', error);
    throw error;
  }
};

/**
 * Validar datos de curso antes de enviar
 * @param {Object} cursoData - Datos en español
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateCourseData = (cursoData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!cursoData.codigo || cursoData.codigo.trim() === '') {
    errors.push('El código del curso es obligatorio');
  }

  if (!cursoData.nombre || cursoData.nombre.trim() === '') {
    errors.push('El nombre del curso es obligatorio');
  }

  // Validaciones opcionales pero con formato específico
  if (cursoData.nivel) {
    const nivelesValidos = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!nivelesValidos.includes(cursoData.nivel)) {
      errors.push('El nivel debe ser: A1, A2, B1, B2, C1, o C2');
    }
  }

  if (cursoData.progreso !== undefined && (cursoData.progreso < 0 || cursoData.progreso > 100)) {
    errors.push('El progreso debe estar entre 0 y 100');
  }

  if (cursoData.unidades && (cursoData.unidades < 1 || cursoData.unidades > 20)) {
    errors.push('El número de unidades debe estar entre 1 y 20');
  }

  if (cursoData.lecciones_por_unidad && cursoData.lecciones_por_unidad < 1) {
    errors.push('El número de lecciones por unidad debe ser mayor a 0');
  }

  if (cursoData.periodo_dias && cursoData.periodo_dias < 1) {
    errors.push('Los días del período deben ser mayores a 0');
  }

  if (cursoData.horas_proyectadas && cursoData.horas_proyectadas < 1) {
    errors.push('Las horas proyectadas deben ser mayores a 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
