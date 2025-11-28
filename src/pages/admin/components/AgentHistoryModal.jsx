// ========================================
// MODAL DE HISTÓRICO DE CONVERSACIONES
// ========================================
// Muestra todas las conversaciones guardadas con un agente

import { useState, useEffect } from 'react';
import {
  X,
  History,
  Calendar,
  MessageSquare,
  Trash2,
  Search,
  User,
  Bot,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './AgentHistoryModal.css';

const AgentHistoryModal = ({ agent, onClose, onDeleteConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedConversation, setExpandedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, [agent]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // TODO: Cargar conversaciones desde la base de datos
      // const data = await getConversationsByAgent(agent.id);

      // Datos de ejemplo
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
              content: '¡Hola! Soy Agente Traductor. Traduzco entre inglés y español con contexto. ¿En qué puedo ayudarte?',
              timestamp: new Date('2025-11-20T10:30:00').toISOString()
            },
            {
              id: 2,
              role: 'user',
              content: '¿Cómo traducirías "I\'m looking forward to seeing you" al español?',
              timestamp: new Date('2025-11-20T10:30:30').toISOString()
            },
            {
              id: 3,
              role: 'assistant',
              content: 'La traducción más natural sería "Tengo muchas ganas de verte" o "Estoy deseando verte". Ambas expresiones capturan el sentimiento de anticipación positiva del original en inglés.',
              timestamp: new Date('2025-11-20T10:31:00').toISOString()
            }
          ]
        },
        {
          id: 2,
          title: 'Test de expresiones idiomáticas',
          createdAt: new Date('2025-11-19T15:45:00').toISOString(),
          messageCount: 12,
          messages: [
            {
              id: 1,
              role: 'assistant',
              content: '¡Hola! Soy Agente Traductor. ¿En qué puedo ayudarte?',
              timestamp: new Date('2025-11-19T15:45:00').toISOString()
            },
            {
              id: 2,
              role: 'user',
              content: '¿Cómo se dice "break a leg" en español?',
              timestamp: new Date('2025-11-19T15:45:30').toISOString()
            }
          ]
        },
        {
          id: 3,
          title: 'Vocabulario técnico de programación',
          createdAt: new Date('2025-11-18T09:15:00').toISOString(),
          messageCount: 15,
          messages: []
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      return;
    }

    try {
      // TODO: Eliminar desde la base de datos
      // await deleteConversation(conversationId);

      setConversations(prev => prev.filter(c => c.id !== conversationId));

      if (onDeleteConversation) {
        onDeleteConversation(conversationId);
      }
    } catch (error) {
      console.error('Error eliminando conversación:', error);
      alert('Error al eliminar la conversación');
    }
  };

  const toggleConversation = (conversationId) => {
    setExpandedConversation(prev => prev === conversationId ? null : conversationId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container agent-history-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <History size={24} />
            <div>
              <h2>Histórico de Conversaciones</h2>
              <p className="agent-subtitle">{agent.name}</p>
            </div>
          </div>
          <button
            className="btn-close"
            onClick={onClose}
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="history-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar conversaciones por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <History size={48} className="spinning" />
              <p>Cargando conversaciones...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={64} />
              <h3>No hay conversaciones guardadas</h3>
              <p>
                {searchTerm
                  ? 'No se encontraron conversaciones con ese término de búsqueda.'
                  : 'Comienza a chatear con el agente y guarda conversaciones para verlas aquí.'}
              </p>
            </div>
          ) : (
            <div className="conversations-list">
              {filteredConversations.map(conversation => (
                <div key={conversation.id} className="conversation-item">
                  {/* Conversation Header */}
                  <div className="conversation-header">
                    <button
                      className="expand-btn"
                      onClick={() => toggleConversation(conversation.id)}
                    >
                      {expandedConversation === conversation.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    <div className="conversation-info">
                      <h3>{conversation.title}</h3>
                      <div className="conversation-meta">
                        <span className="meta-item">
                          <Calendar size={14} />
                          {new Date(conversation.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="meta-item">
                          <MessageSquare size={14} />
                          {conversation.messageCount} mensajes
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteConversation(conversation.id)}
                      title="Eliminar conversación"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Conversation Messages (Expanded) */}
                  {expandedConversation === conversation.id && (
                    <div className="conversation-messages">
                      {conversation.messages.length === 0 ? (
                        <p className="no-messages">No hay mensajes disponibles en esta conversación.</p>
                      ) : (
                        conversation.messages.map(message => (
                          <div
                            key={message.id}
                            className={`history-message ${message.role}`}
                          >
                            <div className="message-avatar-small">
                              {message.role === 'user' ? (
                                <User size={16} />
                              ) : (
                                <Bot size={16} />
                              )}
                            </div>
                            <div className="message-content-small">
                              <div className="message-header-small">
                                <span className="message-sender-small">
                                  {message.role === 'user' ? 'Administrador' : agent.name}
                                </span>
                                <span className="message-time-small">
                                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="message-text-small">{message.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <span>{filteredConversations.length} conversación(es)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-close-footer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentHistoryModal;
