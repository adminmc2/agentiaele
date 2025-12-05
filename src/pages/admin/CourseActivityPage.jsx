// ========================================
// PÁGINA DE GESTIÓN DE ACCIONES DEL CURSO
// ========================================
// Conectado a API - datos reales de BD

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Search, Filter, Loader2 } from 'lucide-react';
import ActivityForm from './ActivityForm';
import { getCourseById } from '../../services/courseService';
import { getActionsByCourse, deleteAction } from '../../services/actionService';
import './CourseActivityPage.css';

const CourseActivityPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Estados para datos
  const [course, setCourse] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para UI
  const [showModal, setShowModal] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Cargar datos del curso y acciones
  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar curso y acciones en paralelo
      const [courseData, actionsData] = await Promise.all([
        getCourseById(courseId),
        getActionsByCourse(courseId)
      ]);

      setCourse(courseData);
      setActions(actionsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/activities');
  };

  const handleAddAction = () => {
    setSelectedActionId(null);
    setShowModal(true);
  };

  const handleEditAction = (actionId) => {
    setSelectedActionId(actionId);
    setShowModal(true);
  };

  const handleDeleteAction = async (actionId, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta acción?')) {
      try {
        await deleteAction(actionId);
        // Recargar acciones
        const actionsData = await getActionsByCourse(courseId);
        setActions(actionsData);
      } catch (err) {
        alert('Error eliminando acción: ' + err.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActionId(null);
    // Recargar acciones después de cerrar el modal
    loadData();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  // Filtrar acciones según el tipo de filtro y búsqueda
  const getFilteredActions = () => {
    if (!searchQuery.trim()) {
      return actions;
    }

    const query = searchQuery.toLowerCase();

    switch (filterType) {
      case 'unidad':
        return actions.filter(act =>
          act.numero_unidad.toString().includes(query)
        );
      case 'seccion':
        return actions.filter(act =>
          act.apartado.toLowerCase().includes(query)
        );
      case 'actividad':
        return actions.filter(act =>
          act.numero_actividad.toString().includes(query)
        );
      case 'agente':
        return actions.filter(act =>
          act.nombre_chat.toLowerCase().includes(query)
        );
      case 'all':
      default:
        return actions.filter(act =>
          act.numero_unidad.toString().includes(query) ||
          act.apartado.toLowerCase().includes(query) ||
          act.numero_actividad.toString().includes(query) ||
          act.nombre_chat.toLowerCase().includes(query) ||
          act.tipo_actividad.toLowerCase().includes(query)
        );
    }
  };

  const filteredActions = getFilteredActions();

  // Estado de carga
  if (loading) {
    return (
      <div className="course-activity-page">
        <div className="page-loading">
          <Loader2 size={40} className="spinner" />
          <p>Cargando datos del curso...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="course-activity-page">
        <div className="page-error">
          <h2>Error cargando datos</h2>
          <p>{error}</p>
          <button onClick={handleGoBack} className="btn-primary">
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  // Curso no encontrado
  if (!course) {
    return (
      <div className="course-activity-page">
        <div className="page-error">
          <h2>Curso no encontrado</h2>
          <button onClick={handleGoBack} className="btn-primary">
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-activity-page">
      {/* Header con botón de volver */}
      <div className="page-header-nav">
        <button onClick={handleGoBack} className="btn-back">
          <ArrowLeft size={20} />
          <span>Volver a Cursos</span>
        </button>

        <div className="course-info-header">
          <h1 className="course-title-main">{course.nombre}</h1>
          <div className="course-meta">
            <span className="course-code-display">{course.codigo}</span>
            <span className="course-company">{course.empresa}</span>
            <span className="course-level-badge">{course.nivel}</span>
          </div>
        </div>
      </div>

      {/* Contenedor de acciones con scroll */}
      <div className="activities-container">
        {/* Header del contenedor con botón añadir */}
        <div className="container-header">
          <button className="add-activity-btn" onClick={handleAddAction}>
            <Plus size={20} />
            <span>Añadir acción</span>
          </button>
        </div>

        {/* Contenedor scrollable con barra de búsqueda y lista de acciones */}
        <div className="activities-scrollable-content">
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
                Todas
              </button>
              <button
                className={`filter-chip ${filterType === 'unidad' ? 'active' : ''}`}
                onClick={() => setFilterType('unidad')}
              >
                Unidad
              </button>
              <button
                className={`filter-chip ${filterType === 'seccion' ? 'active' : ''}`}
                onClick={() => setFilterType('seccion')}
              >
                Sección
              </button>
              <button
                className={`filter-chip ${filterType === 'actividad' ? 'active' : ''}`}
                onClick={() => setFilterType('actividad')}
              >
                Actividad
              </button>
              <button
                className={`filter-chip ${filterType === 'agente' ? 'active' : ''}`}
                onClick={() => setFilterType('agente')}
              >
                Agente
              </button>
            </div>
          </div>

          <div className="activities-list">
            {filteredActions.length === 0 ? (
              <div className="no-actions-message">
                <p>📚 Próximamente disponible</p>
                <p>Este curso estará listo pronto. Mientras tanto, puedes añadir acciones haciendo clic en "Añadir acción".</p>
              </div>
            ) : (
              filteredActions.map((action) => (
                <div
                  key={action.id}
                  className="activity-card"
                  onClick={() => handleEditAction(action.id)}
                >
                  <div className="activity-main-info">
                    <div className="activity-unit-header">UNIDAD {action.numero_unidad}</div>
                    <div className="activity-section-header">SECCIÓN {action.apartado}</div>
                    <div className="activity-number-header">ACTIVIDAD {action.numero_actividad}</div>
                  </div>
                  <div className="activity-secondary-info">
                    <div className="activity-agent-name">{action.nombre_chat}</div>
                    <div className="activity-action-name">{action.tipo_actividad.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal del formulario de acción */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn-close-circular" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-scrollable">
              <ActivityForm
                courseId={courseId}
                activityId={selectedActionId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseActivityPage;
