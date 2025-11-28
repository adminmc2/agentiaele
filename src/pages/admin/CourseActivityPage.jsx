// ========================================
// PÁGINA DE GESTIÓN DE ACTIVIDADES DEL CURSO
// ========================================
// Modo 4: Navegación a página completa

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Search, Filter } from 'lucide-react';
import ActivityForm from './ActivityForm';
import './CourseActivityPage.css';

const CourseActivityPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'unidad', 'seccion', 'actividad', 'agente'

  // Datos de ejemplo de cursos (en producción, esto vendría de un servicio/API)
  const courses = [
    {
      id: 1,
      title: 'Español en marcha 1',
      code: 'EM1',
      company: 'SGEL',
      level: 'A1'
    },
    {
      id: 2,
      title: 'Español en marcha 2',
      code: 'EM2',
      company: 'SGEL',
      level: 'A2'
    },
    {
      id: 3,
      title: 'Español en marcha 3',
      code: 'EM3',
      company: 'SGEL',
      level: 'B1'
    },
    {
      id: 4,
      title: 'Español en marcha 4',
      code: 'EM4',
      company: 'SGEL',
      level: 'B2'
    }
  ];

  const course = courses.find(c => c.id === parseInt(courseId));

  // Datos de ejemplo de actividades creadas
  const activities = [
    {
      id: 1,
      book_code: 'EM1',
      unit_number: 1,
      apartado: 'Gramática',
      activity_number: 1,
      activity_type: 'vocabulary',
      chat_display_name: 'Ag. Expansor'
    },
    {
      id: 2,
      book_code: 'EM1',
      unit_number: 1,
      apartado: 'Lectura',
      activity_number: 2,
      activity_type: 'reading_comprehension',
      chat_display_name: 'Ag. Traducción'
    }
  ];

  const handleGoBack = () => {
    navigate('/activities');
  };

  const handleAddActivity = () => {
    setSelectedActivityId(null);
    setShowModal(true);
  };

  const handleEditActivity = (activityId) => {
    setSelectedActivityId(activityId);
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  // Filtrar actividades según el tipo de filtro y búsqueda
  const getFilteredActivities = () => {
    if (!searchQuery.trim()) {
      return activities;
    }

    const query = searchQuery.toLowerCase();

    switch (filterType) {
      case 'unidad':
        return activities.filter(act =>
          act.unit_number.toString().includes(query)
        );
      case 'seccion':
        return activities.filter(act =>
          act.apartado.toLowerCase().includes(query)
        );
      case 'actividad':
        return activities.filter(act =>
          act.activity_number.toString().includes(query)
        );
      case 'agente':
        return activities.filter(act =>
          act.chat_display_name.toLowerCase().includes(query)
        );
      case 'all':
      default:
        return activities.filter(act =>
          act.unit_number.toString().includes(query) ||
          act.apartado.toLowerCase().includes(query) ||
          act.activity_number.toString().includes(query) ||
          act.chat_display_name.toLowerCase().includes(query) ||
          act.activity_type.toLowerCase().includes(query)
        );
    }
  };

  const filteredActivities = getFilteredActivities();

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
          <h1 className="course-title-main">{course.title}</h1>
          <div className="course-meta">
            <span className="course-code-display">{course.code}</span>
            <span className="course-company">{course.company}</span>
            <span className="course-level-badge">{course.level}</span>
          </div>
        </div>
      </div>

      {/* Contenedor de actividades con scroll */}
      <div className="activities-container">
        {/* Header del contenedor con botón añadir */}
        <div className="container-header">
          <button className="add-activity-btn" onClick={handleAddActivity}>
            <Plus size={20} />
            <span>Añadir acción</span>
          </button>
        </div>

        {/* Contenedor scrollable con barra de búsqueda y lista de actividades */}
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
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="activity-card"
                onClick={() => handleEditActivity(activity.id)}
              >
                <div className="activity-main-info">
                  <div className="activity-unit-header">UNIDAD {activity.unit_number}</div>
                  <div className="activity-section-header">SECCIÓN {activity.apartado}</div>
                  <div className="activity-number-header">ACTIVIDAD {activity.activity_number}</div>
                </div>
                <div className="activity-secondary-info">
                  <div className="activity-agent-name">{activity.chat_display_name}</div>
                  <div className="activity-action-name">{activity.activity_type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal del formulario de actividad */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn-close-circular" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-scrollable">
              <ActivityForm
                courseId={parseInt(courseId)}
                activityId={selectedActivityId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseActivityPage;
