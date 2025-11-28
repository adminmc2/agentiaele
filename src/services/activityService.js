// ========================================
// SERVICIO DE GESTIÓN DE ACTIVIDADES
// ========================================
// CRUD completo para class_activities

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Obtener todas las actividades
 * @param {Object} filters - Filtros opcionales (book_code, unit_number, activity_type)
 * @returns {Promise<Array>}
 */
export const getAllActivities = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/activities${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching activities: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getAllActivities:', error);
    throw error;
  }
};

/**
 * Obtener una actividad por ID
 * @param {string} activityId - UUID de la actividad
 * @returns {Promise<Object>}
 */
export const getActivityById = async (activityId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}`);

    if (!response.ok) {
      throw new Error(`Error fetching activity: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActivityById:', error);
    throw error;
  }
};

/**
 * Crear una nueva actividad
 * @param {Object} activityData - Datos de la actividad
 * @returns {Promise<Object>}
 */
export const createActivity = async (activityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createActivity:', error);
    throw error;
  }
};

/**
 * Actualizar una actividad existente
 * @param {string} activityId - UUID de la actividad
 * @param {Object} activityData - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateActivity:', error);
    throw error;
  }
};

/**
 * Eliminar una actividad
 * @param {string} activityId - UUID de la actividad
 * @returns {Promise<Object>}
 */
export const deleteActivity = async (activityId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error deleting activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteActivity:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de actividades
 * @returns {Promise<Object>}
 */
export const getActivitiesStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities/stats`);

    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActivitiesStats:', error);
    throw error;
  }
};

/**
 * Validar datos de actividad antes de enviar
 * @param {Object} activityData
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateActivityData = (activityData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!activityData.book_code || !['EM1', 'EM2', 'EM3', 'EM4'].includes(activityData.book_code)) {
    errors.push('Código de libro inválido (debe ser EM1, EM2, EM3 o EM4)');
  }

  if (!activityData.unit_number || activityData.unit_number < 1 || activityData.unit_number > 12) {
    errors.push('Número de unidad inválido (debe ser entre 1 y 12)');
  }

  if (!activityData.activity_number || activityData.activity_number < 1) {
    errors.push('Número de actividad inválido');
  }

  if (!activityData.title || activityData.title.trim() === '') {
    errors.push('El título es obligatorio');
  }

  if (!activityData.instructions || activityData.instructions.trim() === '') {
    errors.push('Las instrucciones son obligatorias');
  }

  if (!activityData.activity_type) {
    errors.push('El tipo de actividad es obligatorio');
  }

  if (!activityData.activity_structure) {
    errors.push('La estructura de actividad es obligatoria');
  }

  if (!activityData.content || typeof activityData.content !== 'object') {
    errors.push('El contenido debe ser un objeto JSON válido');
  }

  if (!activityData.available_agents || typeof activityData.available_agents !== 'object') {
    errors.push('Los agentes disponibles deben ser un objeto JSON válido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
