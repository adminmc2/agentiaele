// ========================================
// GESTIÓN DE AGENTES IA (ADMINISTRADOR)
// ========================================
// Panel técnico para configurar y administrar agentes IA del sistema

import { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  X,
  Search,
  Filter
} from 'lucide-react';
import { MOMENTO1_AGENTS } from '../../config/database';
import AgentDetailView from './components/AgentDetailView';
import './AgentsPage.css';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'nombre', 'descripcion', 'tipo'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // TODO: Llamar al servicio para obtener agentes desde la base de datos
      // Por ahora usamos datos estáticos de configuración
      const agentsData = Object.entries(MOMENTO1_AGENTS).map(([key, agent]) => ({
        id: key,
        key: key,
        name: agent.name,
        description: agent.description,
        status: 'active', // TODO: obtener desde BD
        activitiesCount: 0, // TODO: contar actividades que usan este agente
        lastModified: new Date().toISOString(), // TODO: obtener desde BD
        systemPrompt: '', // TODO: obtener desde BD
        parameters: {
          model: '',
          temperature: 0.7,
          max_tokens: 1000
        }
      }));

      setAgents(agentsData);
    } catch (error) {
      console.error('Error cargando agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar agentes según el tipo de filtro, estado y búsqueda
  const getFilteredAgents = () => {
    let filtered = agents;

    // Filtrar por estado (Activo/Inactivo)
    if (filterStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === filterStatus);
    }

    // Filtrar por búsqueda y tipo
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      switch (filterType) {
        case 'nombre':
          filtered = filtered.filter(agent =>
            agent.name.toLowerCase().includes(query)
          );
          break;
        case 'descripcion':
          filtered = filtered.filter(agent =>
            agent.description.toLowerCase().includes(query)
          );
          break;
        case 'tipo':
          filtered = filtered.filter(agent =>
            agent.key.toLowerCase().includes(query)
          );
          break;
        case 'all':
        default:
          filtered = filtered.filter(agent =>
            agent.name.toLowerCase().includes(query) ||
            agent.description.toLowerCase().includes(query) ||
            agent.key.toLowerCase().includes(query)
          );
          break;
      }
    }

    return filtered;
  };

  const filteredAgents = getFilteredAgents();

  const handleCardClick = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
  };

  if (loading) {
    return (
      <div className="agents-page loading">
        <div className="loading-spinner">
          <Bot size={48} />
          <p>Cargando agentes IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-page">
      {/* Contenedor de agentes con scroll */}
      <div className="agents-container">
        {/* Header del contenedor con botón añadir */}
        <div className="container-header">
          <button className="add-agent-btn" onClick={handleAddAgent}>
            <Plus size={20} />
            <span>Añadir agente</span>
          </button>
        </div>

        {/* Contenedor scrollable con barra de búsqueda y lista de agentes */}
        <div className="agents-scrollable-content">
          {/* Barra de búsqueda y filtros */}
          <div className="search-container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn-clear-filters" onClick={handleClearFilters} title="Limpiar filtros">
                <Filter size={18} />
              </button>
            </div>
            <div className="search-filters">
              <button
                className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                Todos
              </button>
              <button
                className={`filter-chip ${filterType === 'nombre' ? 'active' : ''}`}
                onClick={() => setFilterType('nombre')}
              >
                Nombre
              </button>
              <button
                className={`filter-chip ${filterType === 'descripcion' ? 'active' : ''}`}
                onClick={() => setFilterType('descripcion')}
              >
                Descripción
              </button>
              <button
                className={`filter-chip ${filterType === 'tipo' ? 'active' : ''}`}
                onClick={() => setFilterType('tipo')}
              >
                Tipo
              </button>
              <button
                className={`filter-chip ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                Activo
              </button>
              <button
                className={`filter-chip ${filterStatus === 'inactive' ? 'active' : ''}`}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactivo
              </button>
            </div>
          </div>

          <div className="agents-grid">
            {filteredAgents.length === 0 ? (
              <div className="no-agents">
                <Bot size={64} />
                <p>No se encontraron agentes</p>
              </div>
            ) : (
              filteredAgents.map(agent => {
                const agentConfig = MOMENTO1_AGENTS[agent.key];

                return (
                  <article
                    key={agent.id}
                    className="agent-card"
                    onClick={() => handleCardClick(agent)}
                  >
                    {/* Agent Name */}
                    <h3>{agent.name}</h3>

                    {/* Agent Icon */}
                    <div className="agent-icon-wrapper">
                      <img
                        src={agentConfig?.icon || '/default-agent.png'}
                        alt={agent.name}
                        className="agent-icon-img"
                      />
                    </div>

                    {/* Agent Description */}
                    <p className="agent-description">{agent.description}</p>

                    {/* Status Badge */}
                    <span className="agent-status-badge">
                      {agent.status === 'active' ? 'Activo' : 'En construcción'}
                    </span>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal del detalle del agente */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn-close-circular" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-scrollable">
              <AgentDetailView
                agent={selectedAgent}
                onClose={() => setShowModal(false)}
                onSave={(updatedAgent) => {
                  setAgents(prevAgents =>
                    prevAgents.map(agent =>
                      agent.id === updatedAgent.id ? updatedAgent : agent
                    )
                  );
                  setShowModal(false);
                  console.log('Agente actualizado:', updatedAgent);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;
