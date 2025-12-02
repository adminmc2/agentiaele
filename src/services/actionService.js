// ========================================
// SERVICIO DE GESTIÓN DE ACCIONES
// ========================================
// CRUD completo para acciones IA - campos en español
// Una ACCIÓN es una configuración de agente(s) para una ubicación del libro

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Obtener todas las acciones
 * @returns {Promise<Array>}
 */
export const getAllActions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones`);

    if (!response.ok) {
      throw new Error(`Error fetching acciones: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getAllActions:', error);
    throw error;
  }
};

/**
 * Obtener acciones por curso
 * @param {string} cursoId - UUID del curso
 * @returns {Promise<Array>}
 */
export const getActionsByCourse = async (cursoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones/by-curso?curso_id=${cursoId}`);

    if (!response.ok) {
      throw new Error(`Error fetching acciones by curso: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActionsByCourse:', error);
    throw error;
  }
};

/**
 * Obtener una acción por ID
 * @param {string} accionId - UUID de la acción
 * @returns {Promise<Object>}
 */
export const getActionById = async (accionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones/${accionId}`);

    if (!response.ok) {
      throw new Error(`Error fetching accion: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActionById:', error);
    throw error;
  }
};

/**
 * Crear una nueva acción
 * @param {Object} accionData - Datos de la acción en español
 * @returns {Promise<Object>}
 */
export const createAction = async (accionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating accion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createAction:', error);
    throw error;
  }
};

/**
 * Actualizar una acción existente
 * @param {string} accionId - UUID de la acción
 * @param {Object} accionData - Datos actualizados en español
 * @returns {Promise<Object>}
 */
export const updateAction = async (accionId, accionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones/${accionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating accion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateAction:', error);
    throw error;
  }
};

/**
 * Eliminar una acción
 * @param {string} accionId - UUID de la acción
 * @returns {Promise<Object>}
 */
export const deleteAction = async (accionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones/${accionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error deleting accion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteAction:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de acciones
 * @returns {Promise<Object>}
 */
export const getActionsStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/acciones/stats`);

    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getActionsStats:', error);
    throw error;
  }
};

/**
 * Validar datos de acción antes de enviar
 * @param {Object} accionData - Datos en español
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateActionData = (accionData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!accionData.curso_id) {
    errors.push('El curso es obligatorio');
  }

  if (!accionData.numero_unidad || accionData.numero_unidad < 1 || accionData.numero_unidad > 12) {
    errors.push('El número de unidad debe estar entre 1 y 12');
  }

  if (!accionData.apartado || accionData.apartado.trim() === '') {
    errors.push('El apartado es obligatorio');
  }

  if (!accionData.numero_actividad || accionData.numero_actividad < 1 || accionData.numero_actividad > 15) {
    errors.push('El número de actividad debe estar entre 1 y 15');
  }

  if (!accionData.tipo_actividad) {
    errors.push('El tipo de actividad es obligatorio');
  }

  if (!accionData.estructura_actividad) {
    errors.push('La estructura de actividad es obligatoria');
  }

  if (!accionData.instrucciones || accionData.instrucciones.trim() === '') {
    errors.push('Las instrucciones son obligatorias');
  }

  if (!accionData.nombre_chat || accionData.nombre_chat.trim() === '') {
    errors.push('El nombre del chat es obligatorio');
  }

  if (!accionData.prompt_ia || accionData.prompt_ia.trim() === '') {
    errors.push('El prompt IA es obligatorio');
  }

  // Validaciones opcionales
  if (accionData.tiempo_estimado && (accionData.tiempo_estimado < 5 || accionData.tiempo_estimado > 120)) {
    errors.push('El tiempo estimado debe estar entre 5 y 120 minutos');
  }

  // Validar que al menos un agente esté habilitado
  if (accionData.agentes_disponibles) {
    const algunAgente = Object.values(accionData.agentes_disponibles).some(v => v === true);
    if (!algunAgente) {
      errors.push('Debe habilitar al menos un agente IA');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Transformar datos del formulario (frontend) a formato de API
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Datos para la API
 */
export const transformFormToApi = (formData) => {
  return {
    curso_id: formData.curso_id,
    numero_unidad: formData.unit_number,
    apartado: formData.apartado,
    numero_actividad: formData.activity_number,
    tipo_actividad: formData.activity_type,
    estructura_actividad: formData.activity_structure,
    tiempo_estimado: formData.estimated_time,
    instrucciones: formData.instructions,
    contenido: formData.content,
    nombre_chat: formData.chat_display_name,
    agentes_disponibles: formData.available_agents,
    prompt_ia: formData.ai_prompt,
    estado: formData.estado || 'activo'
  };
};

/**
 * Transformar datos de API a formato de formulario (frontend)
 * @param {Object} apiData - Datos de la API
 * @returns {Object} - Datos para el formulario
 */
export const transformApiToForm = (apiData) => {
  return {
    curso_id: apiData.curso_id,
    unit_number: apiData.numero_unidad,
    apartado: apiData.apartado,
    activity_number: apiData.numero_actividad,
    activity_type: apiData.tipo_actividad,
    activity_structure: apiData.estructura_actividad,
    estimated_time: apiData.tiempo_estimado,
    instructions: apiData.instrucciones,
    content: apiData.contenido,
    chat_display_name: apiData.nombre_chat,
    available_agents: apiData.agentes_disponibles,
    ai_prompt: apiData.prompt_ia,
    estado: apiData.estado
  };
};
