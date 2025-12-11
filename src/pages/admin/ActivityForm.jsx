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
  Search,
  Settings,
  FlaskConical,
  History,
  Send,
  Trash2,
  Save,
  Bot,
  User,
  Loader2,
  Check
} from 'lucide-react';
import { createAction, updateAction, getActionById, validateActionData } from '../../services/actionService';
import {
  getConversationsByAction,
  createConversation,
  deleteConversation,
  generateConversationTitle
} from '../../services/testConversationService';
import { ACTIVITY_TYPES, ACTIVITY_STRUCTURES, MOMENTO1_AGENTS, CONTENT_BLOCK_TYPES } from '../../config/database';
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

const ActivityForm = ({ activityId, courseId }) => {
  const navigate = useNavigate();
  // Usar activityId del prop (modal) o de useParams (página directa)
  const { id: urlId } = useParams();
  const id = activityId || urlId;
  const isEditMode = Boolean(id);

  // Estado de pestañas
  const [activeTab, setActiveTab] = useState('config'); // 'config', 'test', 'history'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const [agentSearchFilter, setAgentSearchFilter] = useState('all'); // 'all', 'name', 'description', 'type'

  // Estado para probar prompt (pestaña test)
  const [testPrompt, setTestPrompt] = useState(''); // Prompt editable en la pestaña de pruebas
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Estado para historial
  const [conversations, setConversations] = useState([]);
  const [expandedConversation, setExpandedConversation] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [formData, setFormData] = useState({
    curso_id: courseId || '',
    numero_unidad: 1,
    apartado: '',
    numero_actividad: 1,
    tipo_actividad: 'vocabulario',
    estructura_actividad: 'opcion_multiple',
    instrucciones: '',
    contenido: {
      blocks: []
    },
    nombre_chat: '',
    prompt_ia: '',
    agentes_disponibles: {
      translator: true,
      vocabulary: true,
      personalizer: false,
      creative: false
    },
    tiempo_estimado: 15
  });

  // Cargar actividad existente si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      loadActivity();
      loadConversations();
    }
  }, [id]);

  // Cargar conversaciones de la base de datos
  const loadConversations = async () => {
    if (!id) return;
    try {
      setLoadingConversations(true);
      const data = await getConversationsByAction(id);
      setConversations(data);
    } catch (err) {
      console.error('Error cargando conversaciones:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      const accion = await getActionById(id);
      setFormData({
        curso_id: accion.curso_id || courseId,
        numero_unidad: accion.numero_unidad,
        apartado: accion.apartado || '',
        numero_actividad: accion.numero_actividad,
        tipo_actividad: accion.tipo_actividad,
        estructura_actividad: accion.estructura_actividad,
        instrucciones: accion.instrucciones || '',
        contenido: accion.contenido || { blocks: [] },
        nombre_chat: accion.nombre_chat || '',
        prompt_ia: accion.prompt_ia || '',
        agentes_disponibles: accion.agentes_disponibles || {},
        tiempo_estimado: accion.tiempo_estimado || 15
      });
      // Cargar bloques de contenido si existen
      if (accion.contenido?.blocks) {
        setContentBlocks(accion.contenido.blocks);
      }
    } catch (err) {
      setError('Error cargando acción: ' + err.message);
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
      agentes_disponibles: {
        ...prev.agentes_disponibles,
        [agentKey]: !prev.agentes_disponibles[agentKey]
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

  // Actualizar formData.contenido cuando cambian los bloques
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      contenido: {
        blocks: contentBlocks
      }
    }));
  }, [contentBlocks]);

  // Función para procesar placeholders en el prompt
  const processPrompt = (prompt) => {
    let processed = prompt;

    // Campos del formulario
    processed = processed.replace(/\{\{tipo_actividad\}\}/g, formData.tipo_actividad || '');
    processed = processed.replace(/\{\{estructura_actividad\}\}/g, formData.estructura_actividad || '');
    processed = processed.replace(/\{\{instrucciones\}\}/g, formData.instrucciones || '');
    processed = processed.replace(/\{\{numero_unidad\}\}/g, String(formData.numero_unidad || ''));
    processed = processed.replace(/\{\{apartado\}\}/g, formData.apartado || '');
    processed = processed.replace(/\{\{numero_actividad\}\}/g, String(formData.numero_actividad || ''));
    processed = processed.replace(/\{\{tiempo_estimado\}\}/g, String(formData.tiempo_estimado || ''));
    processed = processed.replace(/\{\{nombre_chat\}\}/g, formData.nombre_chat || '');

    // Contenido completo como JSON
    processed = processed.replace(/\{\{contenido\}\}/g, JSON.stringify(formData.contenido, null, 2));

    // Agentes disponibles
    const agentesActivos = Object.entries(formData.agentes_disponibles)
      .filter(([_, activo]) => activo)
      .map(([key]) => MOMENTO1_AGENTS[key]?.name || key)
      .join(', ');
    processed = processed.replace(/\{\{agentes_disponibles\}\}/g, agentesActivos);

    // Campos de bloques de contenido
    if (formData.contenido?.blocks) {
      formData.contenido.blocks.forEach(block => {
        if (block.data) {
          Object.entries(block.data).forEach(([key, value]) => {
            const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processed = processed.replace(placeholder, typeof value === 'object' ? JSON.stringify(value) : String(value));
          });
        }
      });
    }

    return processed;
  };

  // Inicializar testPrompt cuando se cambia a la pestaña de test
  useEffect(() => {
    if (activeTab === 'test' && !testPrompt) {
      setTestPrompt(processPrompt(formData.prompt_ia));
    }
  }, [activeTab]);

  // Función para enviar mensaje en el chat de prueba
  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userMessage = {
      id: chatMessages.length + 1,
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    try {
      // TODO: Llamar al servicio de IA con testPrompt como system prompt
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: `[Respuesta simulada] El prompt procesado tiene ${testPrompt.length} caracteres. En producción, aquí vendría la respuesta real de DeepSeek usando el prompt configurado.`,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error en chat de prueba:', error);
      const errorMessage = {
        id: chatMessages.length + 2,
        role: 'assistant',
        content: 'Error al procesar el mensaje. Intenta de nuevo.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Limpiar chat de prueba
  const handleClearChat = () => {
    if (window.confirm('¿Limpiar el chat de prueba?')) {
      setChatMessages([]);
    }
  };

  // Guardar conversación en historial (base de datos)
  const handleSaveConversation = async () => {
    if (chatMessages.length === 0) return;
    if (!id) {
      alert('Debes guardar la acción primero antes de guardar conversaciones');
      return;
    }

    const defaultTitle = generateConversationTitle(chatMessages[0]?.content) || `Prueba ${new Date().toLocaleDateString()}`;
    const title = prompt('Título de la conversación:', defaultTitle);

    if (title) {
      try {
        const newConversation = await createConversation({
          accion_id: id,
          title,
          prompt_used: testPrompt,
          messages: chatMessages
        });
        setConversations(prev => [newConversation, ...prev]);
        alert('Conversación guardada');
      } catch (err) {
        console.error('Error guardando conversación:', err);
        alert('Error al guardar conversación: ' + err.message);
      }
    }
  };

  // Aplicar el prompt editado al formulario
  const handleApplyPrompt = () => {
    handleInputChange('prompt_ia', testPrompt);
    alert('Prompt aplicado al formulario. Recuerda guardar la acción.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar datos
    const validation = validateActionData(formData);
    if (!validation.valid) {
      setError('Errores de validación:\n' + validation.errors.join('\n'));
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await updateAction(id, formData);
        alert('Acción actualizada correctamente');
      } else {
        await createAction(formData);
        alert('Acción creada correctamente');
      }

      navigate('/admin/activities');
    } catch (err) {
      setError('Error guardando acción: ' + err.message);
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

      {/* Pestañas de navegación */}
      <nav className="activity-form-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={20} />
          <span>Configuración</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('test');
            if (!testPrompt) {
              setTestPrompt(processPrompt(formData.prompt_ia));
            }
          }}
        >
          <FlaskConical size={20} />
          <span>Probar Prompt</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={20} />
          <span>Histórico</span>
        </button>
      </nav>

      {error && (
        <div className="error-message">
          {error.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {/* PESTAÑA: CONFIGURACIÓN */}
      {activeTab === 'config' && (
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
                  value={formData.numero_unidad}
                  onChange={(e) => handleInputChange('numero_unidad', parseInt(e.target.value))}
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
                  value={formData.numero_actividad}
                  onChange={(value) => handleInputChange('numero_actividad', parseInt(value))}
                  options={Array.from({ length: 15 }, (_, i) => i + 1).map(num => ({ value: num, label: num.toString() }))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Tipo *</label>
                <CustomSelect
                  value={formData.tipo_actividad}
                  onChange={(value) => handleInputChange('tipo_actividad', value)}
                  options={ACTIVITY_TYPES}
                  required
                />
              </div>
              <div className="form-field">
                <label>Estructura *</label>
                <CustomSelect
                  value={formData.estructura_actividad}
                  onChange={(value) => handleInputChange('estructura_actividad', value)}
                  options={ACTIVITY_STRUCTURES}
                  required
                />
              </div>
              <div className="form-field">
                <label>Tiempo *</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={formData.tiempo_estimado}
                  onChange={(e) => handleInputChange('tiempo_estimado', parseInt(e.target.value))}
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
                value={formData.instrucciones}
                onChange={(e) => handleInputChange('instrucciones', e.target.value)}
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
                value={formData.nombre_chat}
                onChange={(e) => handleInputChange('nombre_chat', e.target.value)}
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
                    checked={formData.agentes_disponibles[key]}
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{tipo_actividad}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{estructura_actividad}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{instrucciones}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{contenido}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{codigo_libro}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{numero_unidad}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{apartado}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{numero_actividad}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{tiempo_estimado}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{agentes_disponibles}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{category}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{text}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{title}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{audio}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{transcription}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{questions_list}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{text_with_blanks}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{answers}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{column_a}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{column_b}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{items_to_order}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{correct_order}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{situations}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{image}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{alt_text}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{caption}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{phrases_list}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{words_list}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{vocab_list}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{definitions}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{points}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{labels}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{vocab_words}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{definitions_to_match}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{prompt}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{guidelines}}' + textAfter);
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
                    const textBefore = formData.prompt_ia.substring(0, cursorPos);
                    const textAfter = formData.prompt_ia.substring(cursorPos);
                    handleInputChange('prompt_ia', textBefore + '{{word_count}}' + textAfter);
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
                value={formData.prompt_ia}
                onChange={(e) => handleInputChange('prompt_ia', e.target.value)}
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
            {loading ? 'Guardando...' : (isEditMode ? 'Guardar' : 'Crear')} Acción
          </button>
        </div>
      </form>
      )}

      {/* PESTAÑA: PROBAR PROMPT */}
      {activeTab === 'test' && (
        <div className="test-prompt-container">
          {/* Prompt editable */}
          <div className="test-prompt-editor">
            <div className="editor-header">
              <h3>Prompt Procesado</h3>
              <div className="editor-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setTestPrompt(processPrompt(formData.prompt_ia))}
                  title="Recargar desde formulario"
                >
                  <Trash2 size={16} />
                  Recargar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleApplyPrompt}
                  title="Aplicar cambios al formulario"
                >
                  <Check size={16} />
                  Aplicar al formulario
                </button>
              </div>
            </div>
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="test-prompt-textarea"
              rows="10"
              placeholder="El prompt procesado aparecerá aquí..."
            />
          </div>

          {/* Chat de prueba */}
          <div className="test-chat-container">
            <div className="chat-header">
              <h3>Chat de Prueba</h3>
              <div className="chat-actions">
                <button
                  type="button"
                  className="btn-icon"
                  onClick={handleClearChat}
                  disabled={chatMessages.length === 0}
                  title="Limpiar chat"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={handleSaveConversation}
                  disabled={chatMessages.length === 0}
                  title="Guardar conversación"
                >
                  <Save size={18} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-empty">
                  <Bot size={48} />
                  <p>Escribe un mensaje para probar el prompt</p>
                </div>
              ) : (
                chatMessages.map(message => {
                  // Obtener el primer agente activo para mostrar su icono
                  const activeAgentKey = Object.entries(formData.agentes_disponibles)
                    .find(([_, activo]) => activo)?.[0];
                  const activeAgent = activeAgentKey ? MOMENTO1_AGENTS[activeAgentKey] : null;

                  return (
                    <div key={message.id} className={`message ${message.role} ${message.isError ? 'error' : ''}`}>
                      <div className="message-avatar">
                        {message.role === 'user' ? (
                          <span className="avatar-initials">AC</span>
                        ) : (
                          activeAgent?.icon ? (
                            <img src={activeAgent.icon} alt={activeAgent.name} className="avatar-agent-icon" />
                          ) : (
                            <Bot size={20} />
                          )
                        )}
                      </div>
                      <div className="message-content">
                        <p className="message-text">{message.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              {isSending && (
                <div className="message assistant typing">
                  <div className="message-avatar">
                    {(() => {
                      const activeAgentKey = Object.entries(formData.agentes_disponibles)
                        .find(([_, activo]) => activo)?.[0];
                      const activeAgent = activeAgentKey ? MOMENTO1_AGENTS[activeAgentKey] : null;
                      return activeAgent?.icon ? (
                        <img src={activeAgent.icon} alt={activeAgent.name} className="avatar-agent-icon" />
                      ) : (
                        <Bot size={20} />
                      );
                    })()}
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSendTestMessage}>
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje para probar..."
                rows="1"
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTestMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                className="btn-send"
                disabled={!chatInput.trim() || isSending}
              >
                {isSending ? <Loader2 size={20} className="spinning" /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: HISTÓRICO */}
      {activeTab === 'history' && (
        <div className="history-container">
          {loadingConversations ? (
            <div className="history-empty">
              <Loader2 size={48} className="spinning" />
              <p>Cargando conversaciones...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="history-empty">
              <History size={64} />
              <h3>No hay conversaciones guardadas</h3>
              <p>Prueba el prompt y guarda conversaciones para verlas aquí.</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map(conv => (
                <div key={conv.id} className="conversation-item">
                  <div
                    className="conversation-header"
                    onClick={() => setExpandedConversation(expandedConversation === conv.id ? null : conv.id)}
                  >
                    <div className="conversation-info">
                      <h4>{conv.title}</h4>
                      <div className="conversation-meta">
                        <span>{new Date(conv.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        <span>{(conv.messages || []).length} mensajes</span>
                      </div>
                    </div>
                    <button
                      className="btn-delete-conv"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Eliminar esta conversación?')) {
                          try {
                            await deleteConversation(conv.id);
                            setConversations(prev => prev.filter(c => c.id !== conv.id));
                          } catch (err) {
                            console.error('Error eliminando conversación:', err);
                            alert('Error al eliminar conversación');
                          }
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {expandedConversation === conv.id && (
                    <div className="conversation-messages">
                      {conv.messages.map((msg, idx) => (
                        <div key={idx} className={`history-message ${msg.role}`}>
                          <div className="history-message-avatar">
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div className="history-message-content">
                            <span className="history-message-sender">
                              {msg.role === 'user' ? 'Tú' : 'IA'}
                            </span>
                            <p className="history-message-text">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}ivv
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityForm;