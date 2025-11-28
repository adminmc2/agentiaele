// ========================================
// VISTA DETALLADA DEL AGENTE - PANTALLA COMPLETA
// ========================================
// Combina configuración, chat y histórico en una sola vista

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Settings,
  MessageSquare,
  History,
  Send,
  Trash2,
  Download,
  Bot,
  User,
  AlertCircle,
  Loader2,
  Pencil
} from 'lucide-react';
import { MOMENTO1_AGENTS } from '../../../config/database';
import CustomSelect from '../../../components/CustomSelect';
import './AgentDetailView.css';

const AgentDetailView = ({ agent, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('config'); // config, chat, history
  const isCreating = !agent; // Determinar si estamos creando un nuevo agente

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    status: 'active',
    icon: '',
    parameters: {
      model: '',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.95,
      target_level: 'A1',
      level_strictness: 0.5
    }
  });
  const [agentIcon, setAgentIcon] = useState('');
  const fileInputRef = useRef(null);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatMessagesRef = useRef(null);

  // History state
  const [conversations, setConversations] = useState([]);
  const [expandedConversation, setExpandedConversation] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        systemPrompt: agent.systemPrompt || '',
        status: agent.status || 'active',
        icon: agent.icon || '',
        parameters: {
          model: agent.parameters?.model || '',
          temperature: agent.parameters?.temperature || 0.7,
          max_tokens: agent.parameters?.max_tokens || 1000,
          top_p: agent.parameters?.top_p || 0.95,
          target_level: agent.parameters?.target_level || 'A1',
          level_strictness: agent.parameters?.level_strictness || 0.5
        }
      });

      // Cargar icono del agente
      const agentConfig = MOMENTO1_AGENTS[agent.key];
      if (agentConfig?.icon) {
        setAgentIcon(agentConfig.icon);
      }

      // Cargar historial de conversaciones
      loadConversations();
    }
  }, [agent]);

  useEffect(() => {
    // Auto-scroll al último mensaje
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    // TODO: Cargar desde BD
    const mockConversations = [
      {
        id: 1,
        title: 'Prueba de traducción contextual',
        createdAt: new Date('2025-11-20T10:30:00').toISOString(),
        messageCount: 8,
        messages: [
          {
            id: 1,
            role: 'assistant',
            content: '¡Hola! Soy Agente Traductor. ¿En qué puedo ayudarte?',
            timestamp: new Date('2025-11-20T10:30:00').toISOString()
          }
        ]
      }
    ];
    setConversations(mockConversations);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('El nombre y la descripción son obligatorios');
      return;
    }

    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSave) {
        onSave({ ...agent, ...formData });
      }
    } catch (err) {
      setError('Error guardando configuración: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      // TODO: Llamar al servicio de IA con la configuración actual
      await new Promise(resolve => setTimeout(resolve, 1500));

      const agentResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Esta es una respuesta de prueba de ${formData.name}. En producción, usaré el system prompt configurado y los parámetros del modelo.`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar el chat actual?')) {
      setMessages([]);
    }
  };

  const handleSaveConversation = () => {
    const title = prompt('Título de la conversación:', `Prueba ${new Date().toLocaleDateString()}`);
    if (title && messages.length > 0) {
      const newConversation = {
        id: Date.now(),
        title: title,
        messages: [...messages],
        messageCount: messages.length,
        createdAt: new Date().toISOString()
      };

      setConversations(prev => [newConversation, ...prev]);

      // TODO: Guardar en BD
      console.log('Guardando conversación:', newConversation);
      alert('Conversación guardada correctamente');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Crear URL temporal para previsualización
      const imageUrl = URL.createObjectURL(file);
      setAgentIcon(imageUrl);

      // TODO: Subir imagen al servidor
      console.log('Nueva imagen seleccionada:', file.name);
    }
  };

  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="agent-detail-overlay">
      <div className="agent-detail-container">
        {/* Header */}
        <header className="agent-detail-header">
          <div className="header-left">
            {isCreating ? (
              // Modo Crear: Solo título
              <div className="header-info">
                <h1>Nuevo Agente</h1>
                <p>Completa la información del nuevo agente IA</p>
              </div>
            ) : (
              // Modo Editar: Icono con botón de cambiar imagen
              <>
                <div className="agent-icon-container">
                  <img
                    src={agentIcon || '/default-agent.png'}
                    alt={agent.name}
                    className="agent-header-icon"
                  />
                  <button
                    className="btn-change-image"
                    onClick={handleChangeImageClick}
                    title="Cambiar imagen"
                  >
                    <Pencil size={12} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="header-info">
                  <h1>{agent.name}</h1>
                  <p>{agent.description}</p>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Tabs */}
        <nav className="agent-detail-tabs">
          <button
            className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings size={20} />
            <span>Configuración</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={20} />
            <span>Probar Agente</span>
          </button>
          {!isCreating && (
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={20} />
              <span>Histórico</span>
            </button>
          )}
        </nav>

        {/* Content */}
        <div className="agent-detail-content">
          {/* CONFIG TAB */}
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="config-form">
              {error && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <section className="config-section">
                <h3>Información Básica</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Nombre del agente *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Estado</label>
                    <CustomSelect
                      value={formData.status}
                      onChange={(value) => handleChange('status', value)}
                      options={[
                        { value: 'active', label: 'Activo' },
                        { value: 'inactive', label: 'En construcción' }
                      ]}
                      required
                    />
                  </div>
                </div>
                <div className="description-image-row">
                  <div className="form-field description-field">
                    <label>Descripción * <span className="hint-text">(2-3 frases breves)</span></label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="image-upload-section">
                    <label>Imagen del agente *</label>
                    <div className="image-preview-container">
                      {agentIcon ? (
                        <img src={agentIcon} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="image-placeholder">
                          <Pencil size={24} />
                          <span>Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-upload-image-inline"
                      onClick={handleChangeImageClick}
                    >
                      <Pencil size={12} />
                      <span>{agentIcon ? 'Cambiar' : 'Subir imagen'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </section>

              <section className="config-section">
                <h3>System Prompt *</h3>
                <p className="section-description">
                  Define el comportamiento y personalidad del agente. Este prompt se envía en cada interacción.
                </p>
                <div className="form-field">
                  <textarea
                    value={formData.systemPrompt}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    placeholder="Eres un agente especializado en..."
                    rows="8"
                    className="code-textarea"
                  />
                </div>
              </section>

              <section className="config-section">
                <h3>Parámetros del Modelo IA</h3>
                <div className="params-grid">
                  <div className="form-field">
                    <label>Modelo *</label>
                    <CustomSelect
                      value={formData.parameters.model}
                      onChange={(value) => handleChange('parameters.model', value)}
                      options={[
                        { value: '', label: 'Seleccionar modelo...' },
                        { value: 'deepseek-chat', label: 'DeepSeek Chat' },
                        { value: 'gpt-4', label: 'GPT-4 (futuro)' },
                        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (futuro)' }
                      ]}
                      placeholder="Seleccionar modelo..."
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      Temperature *
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
                      0 = Más determinista | 2 = Más creativo
                    </small>
                  </div>
                  <div className="form-field">
                    <label>Max Tokens *</label>
                    <input
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={formData.parameters.max_tokens}
                      onChange={(e) => handleChange('parameters.max_tokens', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      Top P *
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
                      0.1 = Muy enfocado | 1.0 = Máxima diversidad
                    </small>
                  </div>
                  <div className="form-field">
                    <label>Nivel MCER *</label>
                    <CustomSelect
                      value={formData.parameters.target_level}
                      onChange={(value) => handleChange('parameters.target_level', value)}
                      options={[
                        { value: 'A1', label: 'A1 - Acceso' },
                        { value: 'A2', label: 'A2 - Plataforma' },
                        { value: 'B1', label: 'B1 - Umbral' },
                        { value: 'B2', label: 'B2 - Avanzado' },
                        { value: 'C1', label: 'C1 - Dominio Operativo Eficaz' },
                        { value: 'C2', label: 'C2 - Maestría' }
                      ]}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>
                      Adherencia al Nivel *
                      <span className="param-value">{formData.parameters.level_strictness}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={formData.parameters.level_strictness}
                      onChange={(e) => handleChange('parameters.level_strictness', parseFloat(e.target.value))}
                    />
                    <small className="field-hint">
                      0 = Flexible | 1 = Estricto al nivel
                    </small>
                  </div>
                </div>
              </section>

              <div className="config-actions">
                <button type="submit" className="btn-save" disabled={saving}>
                  <Save size={18} />
                  {saving
                    ? (isCreating ? 'Creando...' : 'Guardando...')
                    : (isCreating ? 'Crear agente' : 'Guardar Cambios')
                  }
                </button>
              </div>
            </form>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="chat-container">
              <div className="chat-actions-bar">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleClearChat}
                  disabled={messages.length === 0}
                >
                  <Trash2 size={18} />
                  Limpiar
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleSaveConversation}
                  disabled={messages.length === 0}
                >
                  <Download size={18} />
                  Guardar conversación
                </button>
              </div>

              <div className="chat-messages" ref={chatMessagesRef}>
                {messages.length === 0 ? (
                  <div className="chat-empty">
                    <Bot size={64} />
                    <p>Comienza a probar el agente escribiendo un mensaje</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className={`message ${message.role}`}>
                      <div className="message-avatar">
                        {message.role === 'user' ? (
                          <User size={20} />
                        ) : agentIcon ? (
                          <img src={agentIcon} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <Bot size={20} />
                        )}
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-sender">
                            {message.role === 'user' ? 'Tú' : formData.name}
                          </span>
                          <span className="message-time">
                            {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="message-text">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="message assistant typing">
                    <div className="message-avatar">
                      {agentIcon ? (
                        <img src={agentIcon} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <Bot size={20} />
                      )}
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

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe un mensaje para probar el agente..."
                  rows="1"
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  className="btn-send"
                  disabled={!inputMessage.trim() || isSending}
                >
                  {isSending ? <Loader2 size={20} className="spinning" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="history-container">
              {conversations.length === 0 ? (
                <div className="history-empty">
                  <History size={64} />
                  <h3>No hay conversaciones guardadas</h3>
                  <p>Prueba el agente y guarda conversaciones para verlas aquí.</p>
                </div>
              ) : (
                <div className="conversations-list">
                  {conversations.map(conv => (
                    <div key={conv.id} className="conversation-item">
                      <div className="conversation-header" onClick={() => setExpandedConversation(expandedConversation === conv.id ? null : conv.id)}>
                        <div className="conversation-info">
                          <h4>{conv.title}</h4>
                          <div className="conversation-meta">
                            <span>{new Date(conv.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            <span>{conv.messageCount} mensajes</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn-delete-conv"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Eliminar esta conversación?')) {
                                setConversations(prev => prev.filter(c => c.id !== conv.id));
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {expandedConversation === conv.id && (
                        <div className="conversation-messages">
                          {conv.messages.map((msg, idx) => (
                            <div key={idx} className={`history-message ${msg.role}`}>
                              <div className="history-message-avatar">
                                {msg.role === 'user' ? (
                                  <User size={16} />
                                ) : agentIcon ? (
                                  <img src={agentIcon} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                  <Bot size={16} />
                                )}
                              </div>
                              <div className="history-message-content">
                                <span className="history-message-sender">
                                  {msg.role === 'user' ? 'Tú' : formData.name}
                                </span>
                                <p className="history-message-text">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailView;
