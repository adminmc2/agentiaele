// ========================================
// SERVICIO DE GESTIÓN DE CONVERSACIONES DE PRUEBA
// ========================================
// CRUD completo para conversaciones de prueba de prompts
// Cada conversación está vinculada a una acción específica

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Obtener conversaciones por acción
 * @param {string} accionId - UUID de la acción
 * @returns {Promise<Array>}
 */
export const getConversationsByAction = async (accionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-conversations/by-accion?accion_id=${accionId}`);

    if (!response.ok) {
      throw new Error(`Error fetching conversations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getConversationsByAction:', error);
    throw error;
  }
};

/**
 * Obtener una conversación por ID
 * @param {string} conversationId - UUID de la conversación
 * @returns {Promise<Object>}
 */
export const getConversationById = async (conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-conversations/${conversationId}`);

    if (!response.ok) {
      throw new Error(`Error fetching conversation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getConversationById:', error);
    throw error;
  }
};

/**
 * Crear una nueva conversación
 * @param {Object} data - Datos de la conversación
 * @param {string} data.accion_id - UUID de la acción
 * @param {string} data.title - Título de la conversación
 * @param {string} data.prompt_used - Prompt procesado usado
 * @param {Array} data.messages - Array de mensajes [{role, content, timestamp}]
 * @returns {Promise<Object>}
 */
export const createConversation = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createConversation:', error);
    throw error;
  }
};

/**
 * Actualizar una conversación (agregar mensajes)
 * @param {string} conversationId - UUID de la conversación
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>}
 */
export const updateConversation = async (conversationId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-conversations/${conversationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateConversation:', error);
    throw error;
  }
};

/**
 * Eliminar una conversación
 * @param {string} conversationId - UUID de la conversación
 * @returns {Promise<Object>}
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-conversations/${conversationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error deleting conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    throw error;
  }
};

/**
 * Generar título automático para conversación
 * @param {string} firstMessage - Primer mensaje del usuario
 * @returns {string}
 */
export const generateConversationTitle = (firstMessage) => {
  if (!firstMessage) return 'Nueva conversación';

  // Tomar las primeras 50 caracteres del mensaje
  const truncated = firstMessage.slice(0, 50);
  return truncated.length < firstMessage.length ? `${truncated}...` : truncated;
};
