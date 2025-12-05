// ========================================
// MODAL DE CHAT CON AGENTE IA
// ========================================
// Permite chatear directamente con un agente para pruebas y mejora

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Save,
  Trash2,
  Bot,
  Loader
} from 'lucide-react';
import './AgentChatModal.css';

const AgentChatModal = ({ agent, onClose, onSaveConversation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus en el input al abrir
    inputRef.current?.focus();

    // Mensaje de bienvenida del agente
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `¡Hola! Soy ${agent.name}. ${agent.description}. ¿En qué puedo ayudarte?`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [agent]);

  useEffect(() => {
    // Auto-scroll al final cuando hay nuevos mensajes
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isSending) {
      return;
    }

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
      // TODO: Llamar al servicio de IA
      // const response = await chatWithAgent(agent.id, inputMessage, messages);

      // Simular respuesta del agente
      await new Promise(resolve => setTimeout(resolve, 1500));

      const agentResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Esta es una respuesta de prueba de ${agent.name}. En producción, aquí vendría la respuesta real del modelo de IA basada en el system prompt y parámetros configurados.`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentResponse]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSaveConversation = async () => {
    if (!conversationTitle.trim()) {
      alert('Por favor ingresa un título para la conversación');
      return;
    }

    try {
      // TODO: Guardar conversación en base de datos
      // await saveConversation(agent.id, conversationTitle, messages);

      const conversation = {
        id: Date.now(),
        agentId: agent.id,
        agentName: agent.name,
        title: conversationTitle,
        messages: messages,
        createdAt: new Date().toISOString()
      };

      if (onSaveConversation) {
        onSaveConversation(conversation);
      }

      alert('Conversación guardada correctamente');
      setShowSaveDialog(false);
      setConversationTitle('');
    } catch (error) {
      console.error('Error guardando conversación:', error);
      alert('Error al guardar la conversación');
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar toda la conversación?')) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: `¡Hola! Soy ${agent.name}. ${agent.description}. ¿En qué puedo ayudarte?`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container agent-chat-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <MessageSquare size={24} />
            <div>
              <h2>Chat con {agent.name}</h2>
              <p className="agent-subtitle">{agent.description}</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={() => setShowSaveDialog(true)}
              title="Guardar conversación"
              disabled={messages.length <= 1}
            >
              <Save size={18} />
            </button>
            <button
              className="btn-icon"
              onClick={handleClearChat}
              title="Limpiar chat"
              disabled={messages.length <= 1}
            >
              <Trash2 size={18} />
            </button>
            <button
              className="btn-close"
              onClick={onClose}
              title="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? (
                  <span className="avatar-initials">AC</span>
                ) : (
                  agent?.icon ? (
                    <img src={agent.icon} alt={agent.name} className="avatar-agent-icon" />
                  ) : (
                    <Bot size={20} />
                  )
                )}
              </div>
              <div className="message-content">
                <p className="message-text">{message.content}</p>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="message assistant typing">
              <div className="message-avatar">
                {agent?.icon ? (
                  <img src={agent.icon} alt={agent.name} className="avatar-agent-icon" />
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí... (Enter para enviar, Shift+Enter para nueva línea)"
              rows="1"
              disabled={isSending}
            />
            <button
              type="submit"
              className="btn-send"
              disabled={!inputMessage.trim() || isSending}
              title="Enviar mensaje"
            >
              {isSending ? (
                <Loader size={20} className="spinning" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
            <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
              <h3>Guardar Conversación</h3>
              <p>Asigna un título a esta conversación para poder encontrarla más tarde:</p>
              <input
                type="text"
                value={conversationTitle}
                onChange={(e) => setConversationTitle(e.target.value)}
                placeholder="Ej: Prueba de traducción con contexto"
                autoFocus
              />
              <div className="save-dialog-actions">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveConversation}
                  className="btn-save"
                  disabled={!conversationTitle.trim()}
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentChatModal;
