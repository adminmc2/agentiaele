// ========================================
// GESTOR DE CURSOS
// ========================================
// ICONOS USADOS EN FORMULARIOS (NO REPETIR):
// - Key: Código del curso
// - BookMarked: Nombre del curso
// - Building2: Empresa
// - FolderTree: Unidades
// - Hash: Lecciones por unidad
// - GraduationCap: Nivel de lengua
// - CalendarDays: Período (días)
// - Timer: Horas proyectadas
// - Upload: Portada
// ========================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ArrowUpRight, Plus, X, Upload, BookMarked, Building2, FolderTree, Hash, CalendarDays, Timer, GraduationCap, Key, Search, Filter } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import './ActivitiesManager.css';

const ActivitiesManager = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    company: '',
    units: '',
    lessonsPerUnit: '',
    level: '',
    projectDays: '',
    projectHours: '',
    coverImage: null
  });

  // Opciones para el select de nivel
  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' }
  ];

  // Datos de ejemplo de cursos
  const courses = [
    {
      id: 1,
      title: 'Español en marcha 1',
      company: 'SGEL',
      hours: 20,
      lessons: 15,
      level: 'A1',
      status: 'En proceso',
      progress: 60,
      coverImage: '/portada.jpg'
    },
    {
      id: 2,
      title: 'Español en marcha 2',
      company: 'SGEL',
      hours: 30,
      lessons: 20,
      level: 'A2',
      status: 'Por empezar',
      progress: 0,
      coverImage: '/em2.jpg'
    },
    {
      id: 3,
      title: 'Español en marcha 3',
      company: 'SGEL',
      hours: 25,
      lessons: 18,
      level: 'B1',
      status: 'Finalizado',
      progress: 100,
      coverImage: '/em3.jpg'
    },
    {
      id: 4,
      title: 'Español en marcha 4',
      company: 'SGEL',
      hours: 35,
      lessons: 25,
      level: 'B2',
      status: 'Por empezar',
      progress: 0,
      coverImage: '/em4.jpeg'
    }
  ];

  // Función de filtrado de cursos
  const filteredCourses = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();

    if (!searchLower) return true;

    switch (searchFilter) {
      case 'level':
        return course.level.toLowerCase().includes(searchLower);
      case 'company':
        return course.company.toLowerCase().includes(searchLower);
      case 'en-proceso':
        return course.status.toLowerCase() === 'en proceso';
      case 'por-empezar':
        return course.status.toLowerCase() === 'por empezar';
      case 'finalizado':
        return course.status.toLowerCase() === 'finalizado';
      case 'all':
      default:
        return (
          course.title.toLowerCase().includes(searchLower) ||
          course.company.toLowerCase().includes(searchLower) ||
          course.level.toLowerCase().includes(searchLower) ||
          course.status.toLowerCase().includes(searchLower)
        );
    }
  });

  const handleNavigateToCourse = (courseId) => {
    navigate(`/activities/${courseId}`);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.code || '',
      courseName: course.title,
      company: course.company,
      units: '',
      lessonsPerUnit: '',
      level: course.level,
      projectDays: '',
      projectHours: course.hours,
      coverImage: course.coverImage
    });
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchFilter('all');
  };

  const handleAddNewCourse = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      courseName: '',
      company: '',
      units: '',
      lessonsPerUnit: '',
      level: '',
      projectDays: '',
      projectHours: '',
      coverImage: null
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    setShowModal(false);
    // Aquí iría la lógica para guardar el curso
  };

  // Generar barras de progreso
  const ProgressBars = ({ progress }) => {
    const totalBars = 20;
    const filledBars = Math.round((progress / 100) * totalBars);

    return (
      <div className="progress-bars">
        {Array.from({ length: totalBars }).map((_, index) => (
          <div
            key={index}
            className={`progress-bar ${index < filledBars ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="activities-manager">
      <div className="courses-container">
        <div className="courses-scrollable-content">
          <div className="container-header">
            <button className="add-course-btn-new" onClick={handleAddNewCourse}>
              <Plus size={20} />
              <span>Añadir curso</span>
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="search-container">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="btn-clear-filters" onClick={handleClearFilters} title="Limpiar filtros">
                <Filter size={18} />
              </button>
            </div>

            {/* Filtros de búsqueda */}
            <div className="search-filters">
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSearchFilter('all')}
              >
                Todos
              </button>
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'level' ? 'active' : ''}`}
                onClick={() => setSearchFilter('level')}
              >
                Nivel
              </button>
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'company' ? 'active' : ''}`}
                onClick={() => setSearchFilter('company')}
              >
                Empresa
              </button>
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'en-proceso' ? 'active' : ''}`}
                onClick={() => setSearchFilter('en-proceso')}
              >
                En proceso
              </button>
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'por-empezar' ? 'active' : ''}`}
                onClick={() => setSearchFilter('por-empezar')}
              >
                Por empezar
              </button>
              <button
                type="button"
                className={`filter-chip ${searchFilter === 'finalizado' ? 'active' : ''}`}
                onClick={() => setSearchFilter('finalizado')}
              >
                Finalizado
              </button>
            </div>
          </div>

          <div className="courses-grid">
          {filteredCourses.map((course) => (
            <React.Fragment key={course.id}>
            <div className="course-card">
              {/* Header de la tarjeta */}
              <div className="card-header">
                <button className="menu-btn" onClick={() => handleEditCourse(course)}>
                  <MoreVertical size={20} />
                </button>
                <button
                  className="expand-btn"
                  onClick={() => handleNavigateToCourse(course.id)}
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>

              {/* FILA 1: Imagen + Contenido (2 columnas) */}
              <div className="card-row-1">
                {/* Imagen de portada */}
                <div className="card-cover">
                  <img src={course.coverImage} alt={course.title} />
                </div>

                {/* Columna derecha con Parte 1 y Parte 2 */}
                <div className="card-info">
                  {/* PARTE 1: Título, Empresa y Nivel */}
                  <div className="card-info-top">
                    <h2 className="card-title">{course.title}</h2>
                    <p className="card-company">{course.company}</p>
                    <div className="card-level">{course.level}</div>
                  </div>

                  {/* PARTE 2: Horas y Lecciones */}
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-value">{course.hours}</span>
                      <span className="stat-label">Horas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{course.lessons}</span>
                      <span className="stat-label">Lecciones</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FILA 2: Progreso (full width) */}
              <div className="card-row-2">
                {/* PARTE 3: Barras de progreso */}
                <ProgressBars progress={course.progress} />

                {/* Estado y porcentaje */}
                <div className="card-footer">
                  <span className="status">{course.status}</span>
                  <span className="percentage">{course.progress}%</span>
                </div>
              </div>
            </div>

            </React.Fragment>
          ))}
        </div>
        </div>
      </div>

      {/* Modal de Nuevo Curso */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn-close-circular" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid-three">
                {/* COLUMNA 1: Información Básica */}
                <div className="form-column card-gradient-bg">
                  <h3 className="section-title">Información Básica</h3>

                  <div className="form-field">
                    <label className="field-label-text">
                      <BookMarked size={16} />
                      <span>Nombre del curso</span>
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="Ej: Español en marcha 1"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label-text">
                      <Key size={16} />
                      <span>Código del curso</span>
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="Ej: EM-A1-001"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label-text">
                      <Building2 size={16} />
                      <span>Empresa</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="Ej: SGEL"
                      required
                    />
                  </div>
                </div>

                {/* COLUMNA 2: Estructura del Curso */}
                <div className="form-column card-gradient-bg">
                  <h3 className="section-title">Estructura del Curso</h3>

                  <div className="form-field">
                    <label className="field-label-text">
                      <FolderTree size={16} />
                      <span>Unidades</span>
                    </label>
                    <input
                      type="number"
                      name="units"
                      value={formData.units}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label-text">
                      <Hash size={16} />
                      <span>Lecciones por unidad</span>
                    </label>
                    <input
                      type="number"
                      name="lessonsPerUnit"
                      value={formData.lessonsPerUnit}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* COLUMNA 3: Detalles del Proyecto + Imagen */}
                <div className="form-column card-gradient-bg">
                  <h3 className="section-title">Detalles del Proyecto</h3>

                  <div className="form-field">
                    <label className="field-label-text">
                      <GraduationCap size={16} />
                      <span>Nivel de lengua</span>
                    </label>
                    <CustomSelect
                      value={formData.level}
                      onChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                      options={levelOptions}
                      placeholder="Seleccionar nivel"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label-text">
                      <CalendarDays size={16} />
                      <span>Período (días)</span>
                    </label>
                    <input
                      type="number"
                      name="projectDays"
                      value={formData.projectDays}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label-text">
                      <Timer size={16} />
                      <span>Horas proyectadas</span>
                    </label>
                    <input
                      type="number"
                      name="projectHours"
                      value={formData.projectHours}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div className="image-upload-compact">
                    <label className="field-label-text">
                      <Upload size={16} />
                      <span>Portada</span>
                    </label>
                    {!formData.coverImage ? (
                      <label htmlFor="cover-image-upload" className="btn-upload">
                        Subir imagen
                      </label>
                    ) : (
                      <div className="image-preview-compact">
                        <img src={typeof formData.coverImage === 'string' ? formData.coverImage : URL.createObjectURL(formData.coverImage)} alt="Portada" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))} className="btn-close-compact remove-btn-compact">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCourse ? 'Guardar Cambios' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManager;
