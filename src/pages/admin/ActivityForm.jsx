// ========================================
// FORMULARIO DE ACTIVIDAD (CREAR/EDITAR)
// ========================================
// Formulario completo para gestionar actividades

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  ChevronDown,
  BookText,
  BookOpen,
  Headphones,
  HelpCircle,
  FileEdit,
  Link,
  ListOrdered,
  MessageCircle,
  Image as ImageIcon,
  Quote,
  Puzzle,
  Library,
  MousePointer,
  ArrowLeftRight,
  FileQuestion,
  PenTool,
  Search
} from 'lucide-react';
import { createActivity, updateActivity, getActivityById, validateActivityData } from '../../services/activityService';
import { ACTIVITY_TYPES, ACTIVITY_STRUCTURES, BOOK_CODES, MOMENTO1_AGENTS, CONTENT_BLOCK_TYPES } from '../../config/database';
import CustomSelect from '../../components/CustomSelect';
import ContentBlock from '../../components/ContentBlock';
import './ActivityForm.css';

// Mapping de nombres de iconos a componentes Lucide
const ICON_MAP = {
  BookText,
  BookOpen,
  Headphones,
  HelpCircle,
  FileEdit,
  Link,
  ListOrdered,
  MessageCircle,
  Image: ImageIcon,
  Quote,
  Puzzle,
  Library,
  MousePointer,
  ArrowLeftRight,
  FileQuestion,
  PenTool
};

const ActivityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [agentSearchFilter, setAgentSearchFilter] = useState('all'); // 'all', 'name', 'description', 'type'
  const [formData, setFormData] = useState({
    book_code: 'EM1',
    unit_number: 1,
    apartado: '',
    activity_number: 1,
    activity_type: 'vocabulary',
    activity_structure: 'multiple_choice',
    instructions: '',
    activity_text: '',
    content: {
      blocks: []
    },
    chat_display_name: '',
    ai_prompt: '',
    available_agents: {
      translator: true,
      vocabulary: true,
      personalizer: false,
      creative: false
    },
    estimated_time: 15
  });

  // Cargar actividad existente si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      loadActivity();
    }
  }, [id]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await getActivityById(id);
      setFormData({
        book_code: activity.book_code,
        unit_number: activity.unit_number,
        apartado: activity.apartado || '',
        activity_number: activity.activity_number,
        activity_type: activity.activity_type,
        activity_structure: activity.activity_structure,
        instructions: activity.instructions,
        activity_text: activity.activity_text || '',
        content: activity.content,
        ai_prompt: activity.ai_prompt || '',
        available_agents: activity.available_agents,
        estimated_time: activity.estimated_time || 15
      });
    } catch (err) {
      setError('Error cargando actividad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgentToggle = (agentKey) => {
    setFormData(prev => ({
      ...prev,
      available_agents: {
        ...prev.available_agents,
        [agentKey]: !prev.available_agents[agentKey]
      }
    }));
  };

  // Filtrar agentes según búsqueda
  const filteredAgents = Object.entries(MOMENTO1_AGENTS).filter(([key, agent]) => {
    const searchLower = agentSearchQuery.toLowerCase();

    if (!searchLower) return true;

    switch (agentSearchFilter) {
      case 'name':
        return agent.name.toLowerCase().includes(searchLower);
      case 'description':
        return agent.description.toLowerCase().includes(searchLower);
      case 'type':
        return key.toLowerCase().includes(searchLower);
      case 'all':
      default:
        return (
          agent.name.toLowerCase().includes(searchLower) ||
          agent.description.toLowerCase().includes(searchLower) ||
          key.toLowerCase().includes(searchLower)
        );
    }
  });

  // Funciones para manejar bloques de contenido
  const addContentBlock = (blockType) => {
    const newBlock = {
      type: blockType,
      data: {}
    };
    setContentBlocks(prev => [...prev, newBlock]);
    setShowBlockDropdown(false);
  };

  const updateContentBlock = (index, updatedBlock) => {
    setContentBlocks(prev => {
      const updated = [...prev];
      updated[index] = updatedBlock;
      return updated;
    });
  };

  const deleteContentBlock = (index) => {
    setContentBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Actualizar formData.content cuando cambian los bloques
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      content: {
        blocks: contentBlocks
      }
    }));
  }, [contentBlocks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar datos
    const validation = validateActivityData(formData);
    if (!validation.valid) {
      setError('Errores de validación:\n' + validation.errors.join('\n'));
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await updateActivity(id, formData);
        alert('Actividad actualizada correctamente');
      } else {
        await createActivity(formData);
        alert('Actividad creada correctamente');
      }

      navigate('/admin/activities');
    } catch (err) {
      setError('Error guardando actividad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Deseas cancelar? Se perderán los cambios no guardados.')) {
      navigate('/admin/activities');
    }
  };

  if (loading && isEditMode) {
    return <div className="activity-form loading">Cargando actividad...</div>;
  }

  return (
    <div className="activity-form">
      {isEditMode && (
        <header className="form-header">
          <h1>Editar Actividad</h1>
          <p>Completa todos los campos obligatorios</p>
        </header>
      )}

      {error && (
        <div className="error-message">
          {error.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="activity-form-content">

        {/* Top Grid: Sections 1 (Left) and 2 (Right) */}
        <div className="form-top-grid">
          {/* SECCIÓN: IDENTIFICACIÓN */}
          <section className="form-section">
            <h3 className="section-title">1. Identificación</h3>
            <div className="form-row section-1-row">
              <div className="form-field">
                <label>Unidad *</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.unit_number}
                  onChange={(e) => handleInputChange('unit_number', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Apartado *</label>
                <input
                  type="text"
                  value={formData.apartado}
                  onChange={(e) => handleInputChange('apartado', e.target.value)}
                  placeholder="Ej: 1b, 7a, Hablar"
                  required
                />
                <small className="field-hint">Ejemplo: 1b, 7a, Hablar</small>
              </div>
            </div>
          </section>

          {/* SECCIÓN: ESTRUCTURA DE LA ACTIVIDAD */}
          <section className="form-section">
            <h3 className="section-title">2. Estructura de la actividad</h3>
            <div className="form-row section-2-row">
              <div className="form-field">
                <label>Actividad *</label>
                <CustomSelect
                  value={formData.activity_number}
                  onChange={(value) => handleInputChange('activity_number', parseInt(value))}
                  options={Array.from({ length: 15 }, (_, i) => i + 1).map(num => ({ value: num, label: num.toString() }))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Tipo *</label>
                <CustomSelect
                  value={formData.activity_type}
                  onChange={(value) => handleInputChange('activity_type', value)}
                  options={ACTIVITY_TYPES.map(type => ({
                    value: type,
                    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  }))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Estructura *</label>
                <CustomSelect
                  value={formData.activity_structure}
                  onChange={(value) => handleInputChange('activity_structure', value)}
                  options={ACTIVITY_STRUCTURES.map(structure => ({
                    value: structure,
                    label: structure.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  }))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Tiempo *</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={formData.estimated_time}
                  onChange={(e) => handleInputChange('estimated_time', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </section>
        </div>

        {/* Section 3: Full Width Below */}
        <div className="form-full-width">
          {/* SECCIÓN: CONTENIDO DE LA ACTIVIDAD */}
          <section className="form-section">
            <h3 className="section-title">3. Contenido de la actividad</h3>
            <div className="form-field">
              <label>Instrucciones *</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Añade la instrucción de la actividad"
                className="textarea-instructions"
                required
              />
            </div>

            {/* Bloques de contenido modulares */}
            <div className="content-blocks-container">
              {contentBlocks.map((block, index) => (
                <ContentBlock
                  key={index}
                  block={block}
                  index={index}
                  onUpdate={updateContentBlock}
                  onDelete={deleteContentBlock}
                />
              ))}

              {/* Botón para añadir bloque */}
              <div className="block-type-dropdown">
                <button
                  type="button"
                  className="dropdown-trigger"
                  onClick={() => setShowBlockDropdown(!showBlockDropdown)}
                >
                  <Plus size={20} />
                  Añadir bloque de contenido
                  <ChevronDown size={18} />
                </button>

                {showBlockDropdown && (
                  <div className="dropdown-menu">
                    {Object.entries(CONTENT_BLOCK_TYPES).map(([key, blockType]) => {
                      const IconComponent = ICON_MAP[blockType.icon];
                      return (
                        <div
                          key={key}
                          className="dropdown-item"
                          onClick={() => addContentBlock(key)}
                        >
                          {IconComponent && <IconComponent className="dropdown-item-icon" size={20} />}
                          <span className="dropdown-item-name">{blockType.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Campo Nombre que aparece en el chat */}
            <div className="form-field" style={{ marginTop: '24px' }}>
              <label>Nombre que aparece en el chat de las actividad *</label>
              <input
                type="text"
                className="input-chat-name"
                value={formData.chat_display_name}
                onChange={(e) => handleInputChange('chat_display_name', e.target.value)}
                placeholder="Nombre visible en el chat"
                style={{ borderRadius: '24px' }}
                required
              />
            </div>
          </section>
        </div>

        {/* Section 4: AI Agents Selection */}
        <div className="form-bottom-section">
          {/* SECCIÓN: AGENTES DISPONIBLES */}
          <section className="form-section">
            <h3 className="section-title">4. Agentes IA Disponibles *</h3>
            <p className="help-text">
              Selecciona qué agentes pueden ayudar al estudiante en esta actividad (obligatorio seleccionar al menos uno)
            </p>

            {/* Barra de búsqueda */}
            <div className="agent-search-container">
              <div className="agent-search-bar">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar agentes..."
                  value={agentSearchQuery}
                  onChange={(e) => setAgentSearchQuery(e.target.value)}
                  className="agent-search-input"
                />
              </div>

              {/* Filtros de búsqueda */}
              <div className="agent-search-filters">
                <button
                  type="button"
                  className={`filter-chip ${agentSearchFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setAgentSearchFilter('all')}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={`filter-chip ${agentSearchFilter === 'name' ? 'active' : ''}`}
                  onClick={() => setAgentSearchFilter('name')}
                >
                  Nombre
                </button>
                <button
                  type="button"
                  className={`filter-chip ${agentSearchFilter === 'description' ? 'active' : ''}`}
                  onClick={() => setAgentSearchFilter('description')}
                >
                  Descripción
                </button>
                <button
                  type="button"
                  className={`filter-chip ${agentSearchFilter === 'type' ? 'active' : ''}`}
                  onClick={() => setAgentSearchFilter('type')}
                >
                  Tipo
                </button>
              </div>
            </div>

            <div className="agents-grid">
              {filteredAgents.map(([key, agent]) => (
                <label key={key} className="agent-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.available_agents[key]}
                    onChange={() => handleAgentToggle(key)}
                  />
                  <div className="agent-info">
                    <strong>{agent.name}</strong>
                    <div className="agent-icon">
                      <img src={agent.icon} alt={agent.name} className={`agent-img-${key}`} />
                    </div>
                    <span>{agent.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Section 5: Prompt Section - Full Width (Editable) */}
        <div className="form-bottom-section">
          {/* SECCIÓN: PROMPT PARA AGENTES IA */}
          <section className="form-section">
            <h3 className="section-title">5. Prompt para agentes IA *</h3>
            <p className="help-text">
              Este prompt se envía a los agentes IA. Haz clic en los campos disponibles para insertarlos en el prompt.
            </p>

            {/* Campos disponibles para insertar */}
            <div className="available-fields">
              <label className="fields-label">Campos disponibles</label>
              <div className="fields-buttons">
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{activity_type}}' + textAfter);
                  }}
                >
                  + Tipo de actividad
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{activity_structure}}' + textAfter);
                  }}
                >
                  + Estructura
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{instructions}}' + textAfter);
                  }}
                >
                  + Instrucciones
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{content}}' + textAfter);
                  }}
                >
                  + Contenido
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{book_code}}' + textAfter);
                  }}
                >
                  + Código de libro
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{unit_number}}' + textAfter);
                  }}
                >
                  + Número de unidad
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{apartado}}' + textAfter);
                  }}
                >
                  + Apartado
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{activity_number}}' + textAfter);
                  }}
                >
                  + Número de actividad
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{estimated_time}}' + textAfter);
                  }}
                >
                  + Tiempo estimado
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{available_agents}}' + textAfter);
                  }}
                >
                  + Agentes IA
                </button>
              </div>
            </div>

            {/* Campos de bloques de contenido */}
            <div className="available-fields">
              <label className="fields-label">Campos de bloques de contenido</label>
              <div className="fields-buttons">
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{category}}' + textAfter);
                  }}
                >
                  + Categoría
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{text}}' + textAfter);
                  }}
                >
                  + Texto
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{title}}' + textAfter);
                  }}
                >
                  + Título
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{audio}}' + textAfter);
                  }}
                >
                  + Audio
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{transcription}}' + textAfter);
                  }}
                >
                  + Transcripción
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{questions_list}}' + textAfter);
                  }}
                >
                  + Lista de preguntas
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{text_with_blanks}}' + textAfter);
                  }}
                >
                  + Texto con huecos
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{answers}}' + textAfter);
                  }}
                >
                  + Respuestas
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{column_a}}' + textAfter);
                  }}
                >
                  + Columna A
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{column_b}}' + textAfter);
                  }}
                >
                  + Columna B
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{items_to_order}}' + textAfter);
                  }}
                >
                  + Elementos a ordenar
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{correct_order}}' + textAfter);
                  }}
                >
                  + Orden correcto
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{situations}}' + textAfter);
                  }}
                >
                  + Situaciones
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{image}}' + textAfter);
                  }}
                >
                  + Imagen
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{alt_text}}' + textAfter);
                  }}
                >
                  + Texto alternativo
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{caption}}' + textAfter);
                  }}
                >
                  + Pie de foto
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{phrases_list}}' + textAfter);
                  }}
                >
                  + Lista de frases
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{words_list}}' + textAfter);
                  }}
                >
                  + Lista de palabras
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{vocab_list}}' + textAfter);
                  }}
                >
                  + Lista de vocabulario
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{definitions}}' + textAfter);
                  }}
                >
                  + Definiciones
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{points}}' + textAfter);
                  }}
                >
                  + Puntos
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{labels}}' + textAfter);
                  }}
                >
                  + Etiquetas
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{vocab_words}}' + textAfter);
                  }}
                >
                  + Palabras de vocabulario
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{definitions_to_match}}' + textAfter);
                  }}
                >
                  + Definiciones a relacionar
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{prompt}}' + textAfter);
                  }}
                >
                  + Prompt
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{guidelines}}' + textAfter);
                  }}
                >
                  + Guías
                </button>
                <button
                  type="button"
                  className="field-insert-btn"
                  onClick={() => {
                    const textarea = document.getElementById('ai-prompt-textarea');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.ai_prompt.substring(0, cursorPos);
                    const textAfter = formData.ai_prompt.substring(cursorPos);
                    handleInputChange('ai_prompt', textBefore + '{{word_count}}' + textAfter);
                  }}
                >
                  + Número de palabras
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Prompt personalizado *</label>
              <textarea
                id="ai-prompt-textarea"
                value={formData.ai_prompt}
                onChange={(e) => handleInputChange('ai_prompt', e.target.value)}
                placeholder="Ejemplo: Funciona como el especialista que eres en el tipo de actividad {{activity_type}} con la estructura {{activity_structure}}..."
                className="json-textarea"
                rows="15"
                required
              />
            </div>
            <small className="field-hint">
              Los campos con formato {`{{campo}}`} se reemplazarán automáticamente con los valores del formulario.
            </small>
          </section>
        </div>

        {/* BOTONES */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')} Acción
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
