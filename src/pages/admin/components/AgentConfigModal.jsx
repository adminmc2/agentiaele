// ========================================
// MODAL DE CONFIGURACIÓN DE AGENTE
// ========================================
// Permite editar la configuración técnica de un agente IA

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Settings } from 'lucide-react';
import './AgentConfigModal.css';

const AgentConfigModal = ({ agent, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    status: 'active',
    parameters: {
      model: 'deepseek-chat',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.95
    }
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activitiesUsingAgent, setActivitiesUsingAgent] = useState([]);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        systemPrompt: agent.systemPrompt || '',
        status: agent.status || 'active',
        parameters: {
          model: agent.parameters?.model || 'deepseek-chat',
          temperature: agent.parameters?.temperature || 0.7,
          max_tokens: agent.parameters?.max_tokens || 1000,
          top_p: agent.parameters?.top_p || 0.95
        }
      });

      // TODO: Cargar actividades que usan este agente desde la BD
      loadActivitiesUsingAgent();
    }
  }, [agent]);

  const loadActivitiesUsingAgent = async () => {
    try {
      // TODO: Implementar llamada al servicio
      // const activities = await getActivitiesByAgent(agent.id);
      // setActivitiesUsingAgent(activities);
      setActivitiesUsingAgent([
        { id: 1, title: 'Vocabulario Unidad 1', book: 'EM1' },
        { id: 2, title: 'Comprensión lectora Unidad 2', book: 'EM1' }
      ]);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith('parameters.')) {
      const paramField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [paramField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del agente es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción del agente es obligatoria');
      return;
    }

    if (formData.parameters.temperature < 0 || formData.parameters.temperature > 2) {
      setError('La temperatura debe estar entre 0 y 2');
      return;
    }

    if (formData.parameters.max_tokens < 100 || formData.parameters.max_tokens > 4000) {
      setError('Los max_tokens deben estar entre 100 y 4000');
      return;
    }

    try {
      setSaving(true);

      // TODO: Implementar guardado en base de datos
      // await updateAgentConfig(agent.id, formData);

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSave) {
        onSave({ ...agent, ...formData });
      }

      onClose();
    } catch (err) {
      setError('Error guardando configuración: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container agent-config-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={24} />
            <h2>Configuración del Agente</h2>
          </div>
          <button
            className="btn-close"
            onClick={onClose}
            type="button"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-banner">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            {/* Información básica */}
            <section className="config-section">
              <h3>Información Básica</h3>

              <div className="form-field">
                <label>Nombre del agente *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: Agente Traductor"
                  required
                />
              </div>

              <div className="form-field">
                <label>Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe la función del agente..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-field">
                <label>Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </section>

            {/* Prompt del sistema */}
            <section className="config-section">
              <h3>Prompt del Sistema</h3>
              <p className="section-description">
                Define el comportamiento y personalidad del agente mediante un prompt del sistema.
                Este prompt se envía en cada interacción.
              </p>

              <div className="form-field">
                <label>System Prompt</label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => handleChange('systemPrompt', e.target.value)}
                  placeholder="Eres un agente especializado en..."
                  rows="6"
                  className="code-textarea"
                />
                <small className="field-hint">
                  Define la personalidad, tono y capacidades del agente. Esto afectará todas sus respuestas.
                </small>
              </div>
            </section>

            {/* Parámetros del modelo */}
            <section className="config-section">
              <h3>Parámetros del Modelo IA</h3>
              <p className="section-description">
                Configura los parámetros técnicos que controlan el comportamiento del modelo de IA.
              </p>

              <div className="params-grid">
                <div className="form-field">
                  <label>Modelo</label>
                  <select
                    value={formData.parameters.model}
                    onChange={(e) => handleChange('parameters.model', e.target.value)}
                  >
                    <option value="deepseek-chat">DeepSeek Chat</option>
                    <option value="gpt-4">GPT-4 (futuro)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (futuro)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Temperature
                    <span className="param-value">{formData.parameters.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.parameters.temperature}
                    onChange={(e) => handleChange('parameters.temperature', parseFloat(e.target.value))}
                  />
                  <small className="field-hint">
                    0 = Más determinista y preciso | 2 = Más creativo y variado
                  </small>
                </div>

                <div className="form-field">
                  <label>Max Tokens</label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={formData.parameters.max_tokens}
                    onChange={(e) => handleChange('parameters.max_tokens', parseInt(e.target.value))}
                  />
                  <small className="field-hint">
                    Número máximo de tokens en la respuesta (100-4000)
                  </small>
                </div>

                <div className="form-field">
                  <label>
                    Top P
                    <span className="param-value">{formData.parameters.top_p}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.parameters.top_p}
                    onChange={(e) => handleChange('parameters.top_p', parseFloat(e.target.value))}
                  />
                  <small className="field-hint">
                    Controla la diversidad de respuestas (0.0-1.0)
                  </small>
                </div>
              </div>
            </section>

            {/* Actividades usando este agente */}
            <section className="config-section">
              <h3>Actividades que usan este agente</h3>
              {activitiesUsingAgent.length === 0 ? (
                <p className="no-activities">
                  No hay actividades que usen este agente actualmente.
                </p>
              ) : (
                <ul className="activities-list">
                  {activitiesUsingAgent.map(activity => (
                    <li key={activity.id} className="activity-item">
                      <span className="activity-book">{activity.book}</span>
                      <span className="activity-title">{activity.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentConfigModal;
