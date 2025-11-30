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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ArrowUpRight, Plus, X, Upload, BookMarked, Building2, FolderTree, Hash, CalendarDays, Timer, GraduationCap, Key, Search, Filter } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import { getAllCourses, createCourse, updateCourse, validateCourseData, uploadPortada } from '../../services/courseService';
import './ActivitiesManager.css';

const ActivitiesManager = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    empresa: '',
    unidades: '',
    lecciones_por_unidad: '',
    nivel: '',
    periodo_dias: '',
    horas_proyectadas: '',
    portada: null
  });
  const [portadaFile, setPortadaFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Opciones para el select de nivel
  const levelOptions = [
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'B1', label: 'B1' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1' },
    { value: 'C2', label: 'C2' }
  ];

  // Cargar cursos desde la API al montar el componente
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCourses();
      setCursos(data);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setError(err.message || 'Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  // Función de filtrado de cursos
  const filteredCourses = cursos.filter((curso) => {
    const searchLower = searchQuery.toLowerCase();

    if (!searchLower) return true;

    switch (searchFilter) {
      case 'level':
        return curso.nivel?.toLowerCase().includes(searchLower);
      case 'company':
        return curso.empresa?.toLowerCase().includes(searchLower);
      case 'en-proceso':
        return curso.estado?.toLowerCase() === 'en proceso';
      case 'por-empezar':
        return curso.estado?.toLowerCase() === 'por empezar';
      case 'finalizado':
        return curso.estado?.toLowerCase() === 'finalizado';
      case 'all':
      default:
        return (
          curso.nombre?.toLowerCase().includes(searchLower) ||
          curso.empresa?.toLowerCase().includes(searchLower) ||
          curso.nivel?.toLowerCase().includes(searchLower) ||
          curso.estado?.toLowerCase().includes(searchLower)
        );
    }
  });

  const handleNavigateToCourse = (cursoId) => {
    navigate(`/activities/${cursoId}`);
  };

  const handleEditCourse = (curso) => {
    setEditingCourse(curso);
    setPortadaFile(null);
    setFormData({
      codigo: curso.codigo || '',
      nombre: curso.nombre || '',
      empresa: curso.empresa || '',
      unidades: curso.unidades || '',
      lecciones_por_unidad: curso.lecciones_por_unidad || '',
      nivel: curso.nivel || '',
      periodo_dias: curso.periodo_dias || '',
      horas_proyectadas: curso.horas_proyectadas || '',
      portada: curso.portada
    });
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchFilter('all');
  };

  const handleAddNewCourse = () => {
    setEditingCourse(null);
    setPortadaFile(null);
    setFormData({
      codigo: '',
      nombre: '',
      empresa: '',
      unidades: '',
      lecciones_por_unidad: '',
      nivel: '',
      periodo_dias: '',
      horas_proyectadas: '',
      portada: null
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
      setPortadaFile(file);
      setFormData(prev => ({
        ...prev,
        portada: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Los datos ya están en español, enviar directamente
    let portadaUrl = formData.portada;

    // Si hay un archivo nuevo de portada, subirlo a Netlify Blobs
    if (portadaFile) {
      try {
        setUploading(true);
        const uploadResult = await uploadPortada(portadaFile);
        portadaUrl = uploadResult.url;
      } catch (err) {
        console.error('Error subiendo imagen:', err);
        alert('Error al subir la imagen: ' + err.message);
        setUploading(false);
        return;
      }
    }

    const cursoData = {
      codigo: formData.codigo,
      nombre: formData.nombre,
      empresa: formData.empresa || null,
      nivel: formData.nivel || null,
      unidades: formData.unidades ? parseInt(formData.unidades) : null,
      lecciones_por_unidad: formData.lecciones_por_unidad ? parseInt(formData.lecciones_por_unidad) : null,
      periodo_dias: formData.periodo_dias ? parseInt(formData.periodo_dias) : null,
      horas_proyectadas: formData.horas_proyectadas ? parseInt(formData.horas_proyectadas) : null,
      portada: portadaUrl || null
    };

    // Validar datos
    const validation = validateCourseData(cursoData);
    if (!validation.valid) {
      alert('Errores de validación:\n' + validation.errors.join('\n'));
      setUploading(false);
      return;
    }

    try {
      if (editingCourse) {
        // Actualizar curso existente
        await updateCourse(editingCourse.id, cursoData);
        console.log('Curso actualizado exitosamente');
      } else {
        // Crear nuevo curso
        await createCourse(cursoData);
        console.log('Curso creado exitosamente');
      }

      // Recargar cursos y cerrar modal
      await fetchCourses();
      setShowModal(false);
      setEditingCourse(null);
      setPortadaFile(null);
    } catch (err) {
      console.error('Error guardando curso:', err);
      alert('Error al guardar el curso: ' + err.message);
    } finally {
      setUploading(false);
    }
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

          {/* Mostrar error si existe */}
          {error && (
            <div style={{
              padding: '1rem',
              margin: '1rem 0',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c00'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Mostrar loading */}
          {loading && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              fontSize: '18px',
              color: '#666'
            }}>
              Cargando cursos...
            </div>
          )}

          {/* Barra de búsqueda */}
          {!loading && !error && (
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
          )}

          {/* Grid de cursos */}
          {!loading && !error && (
          <div className="courses-grid">
          {filteredCourses.map((curso) => (
            <React.Fragment key={curso.id}>
            <div className="course-card">
              {/* Header de la tarjeta */}
              <div className="card-header">
                <button className="menu-btn" onClick={() => handleEditCourse(curso)}>
                  <MoreVertical size={20} />
                </button>
                <button
                  className="expand-btn"
                  onClick={() => handleNavigateToCourse(curso.id)}
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>

              {/* FILA 1: Imagen + Contenido (2 columnas) */}
              <div className="card-row-1">
                {/* Imagen de portada */}
                <div className="card-cover">
                  <img src={curso.portada || '/portada.jpg'} alt={curso.nombre} />
                </div>

                {/* Columna derecha con Parte 1 y Parte 2 */}
                <div className="card-info">
                  {/* PARTE 1: Título, Empresa y Nivel */}
                  <div className="card-info-top">
                    <h2 className="card-title">{curso.nombre}</h2>
                    <p className="card-company">{curso.empresa}</p>
                    <div className="card-level">{curso.nivel}</div>
                  </div>

                  {/* PARTE 2: Horas y Lecciones */}
                  <div className="card-stats">
                    <div className="stat">
                      <span className="stat-value">{curso.horas_proyectadas || 0}</span>
                      <span className="stat-label">Horas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{curso.lecciones_por_unidad || 0}</span>
                      <span className="stat-label">Lecciones</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FILA 2: Progreso (full width) */}
              <div className="card-row-2">
                {/* PARTE 3: Barras de progreso */}
                <ProgressBars progress={curso.progreso || 0} />

                {/* Estado y porcentaje */}
                <div className="card-footer">
                  <span className="status">{curso.estado}</span>
                  <span className="percentage">{curso.progreso || 0}%</span>
                </div>
              </div>
            </div>

            </React.Fragment>
          ))}
        </div>
        )}
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
                      name="nombre"
                      value={formData.nombre}
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
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      className="input-text"
                      placeholder="Ej: EM1"
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
                      name="empresa"
                      value={formData.empresa}
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
                      name="unidades"
                      value={formData.unidades}
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
                      name="lecciones_por_unidad"
                      value={formData.lecciones_por_unidad}
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
                      value={formData.nivel}
                      onChange={(value) => setFormData(prev => ({ ...prev, nivel: value }))}
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
                      name="periodo_dias"
                      value={formData.periodo_dias}
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
                      name="horas_proyectadas"
                      value={formData.horas_proyectadas}
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
                    {!formData.portada ? (
                      <label htmlFor="cover-image-upload" className="btn-upload">
                        Subir imagen
                      </label>
                    ) : (
                      <div className="image-preview-compact">
                        <img src={typeof formData.portada === 'string' ? formData.portada : URL.createObjectURL(formData.portada)} alt="Portada" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, portada: null }))} className="btn-close-compact remove-btn-compact">
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
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={uploading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Subiendo imagen...' : (editingCourse ? 'Guardar Cambios' : 'Crear Curso')}
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
