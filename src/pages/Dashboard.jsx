// ========================================
// DASHBOARD - Página de inicio
// ========================================

import { useState, useRef, useEffect } from 'react';
import { BookOpen, FolderTree, Bot, Zap, Plus, Edit2, Trash2, Save, X, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  // Estado para las tabs
  const [activeTab, setActiveTab] = useState('estadisticas'); // 'estadisticas' | 'gestion'

  // Estados para el tablero Kanban
  const [kanbanTasks, setKanbanTasks] = useState({
    porHacer: [
      { id: 1, title: 'Completar Unidad 5', description: 'Curso EM2', priority: 'high', date: '2025-12-01', responsable: 'María García' },
      { id: 2, title: 'Revisar vocabulario', description: 'Tema: Animales', priority: 'medium', date: '2025-12-03', responsable: 'Carlos López' },
      { id: 3, title: 'Practicar pronunciación', description: 'Lección 12', priority: 'low', date: '2025-12-05', responsable: 'Ana Martínez' }
    ],
    enProceso: [
      { id: 4, title: 'Ejercicio de gramática', description: 'Presente continuo', priority: 'high', date: '2025-11-28', responsable: 'Pedro Sánchez' },
      { id: 5, title: 'Lectura comprensiva', description: 'Página 45-50', priority: 'medium', date: '2025-11-29', responsable: 'Laura Torres' }
    ],
    terminado: [
      { id: 6, title: 'Test Unidad 4', description: 'Nota: 95%', priority: 'high', date: '2025-11-25', responsable: 'María García' },
      { id: 7, title: 'Actividad oral', description: 'Conversación guiada', priority: 'medium', date: '2025-11-24', responsable: 'Carlos López' },
      { id: 8, title: 'Tarea de escritura', description: 'Ensayo corto', priority: 'low', date: '2025-11-23', responsable: 'Ana Martínez' }
    ]
  });

  const [editingCard, setEditingCard] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState(null);
  const [newCardData, setNewCardData] = useState({ title: '', description: '', priority: 'medium', date: '', responsable: '' });

  // Estados para drag and drop
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState(null);

  // Estados para menús desplegables de estadísticas
  const [openMenuId, setOpenMenuId] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('anual'); // 'semanal', 'mensual', 'anual'
  const [chartView, setChartView] = useState('barras'); // 'barras', 'lineas', 'area'
  const menuRef = useRef(null);

  // TODO: Obtener nombre del usuario desde el estado/API
  const userName = 'Mando'; // Ejemplo: 'Alex', 'Masud A.', etc.

  // Obtener fecha actual
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];
  const dayOfWeek = dayNames[currentDate.getDay()];

  // Datos de ejemplo para MVP - TODO: Conectar con API real
  const statsData = [
    {
      id: 1,
      icon: BookOpen,
      label: 'Cursos',
      value: 4,
      total: 4,
      percentage: 100,
      color: 'orange' // Naranja destacado - Todos los cursos activos
    },
    {
      id: 2,
      icon: FolderTree,
      label: 'Unidades',
      value: 43,
      total: 48,
      percentage: 90,
      color: 'yellow' // Amarillo/lima - Casi todas las unidades trabajadas
    },
    {
      id: 3,
      icon: Bot,
      label: 'Agentes',
      value: 6,
      total: 10,
      percentage: 60,
      color: 'red' // Rojo - 6 de 10 agentes desarrollados
    },
    {
      id: 4,
      icon: Zap,
      label: 'Acciones',
      value: 892,
      total: 1200,
      percentage: 74,
      color: 'black' // Negro - 892 acciones realizadas
    }
  ];

  // Datos para el gráfico de barras de actividad mensual
  const monthlyActivityData = [
    { month: 'Ene', activities: 85, lessons: 25 },
    { month: 'Feb', activities: 70, lessons: 20 },
    { month: 'Mar', activities: 105, lessons: 35 },
    { month: 'Abr', activities: 90, lessons: 28 },
    { month: 'May', activities: 120, lessons: 42 },
    { month: 'Jun', activities: 95, lessons: 30 },
    { month: 'Jul', activities: 82, lessons: 26 },
    { month: 'Ago', activities: 68, lessons: 22 },
    { month: 'Sep', activities: 100, lessons: 34 },
    { month: 'Oct', activities: 93, lessons: 29 },
    { month: 'Nov', activities: 112, lessons: 38 },
    { month: 'Dic', activities: 65, lessons: 18 }
  ];

  const maxValue = 140; // Valor máximo del eje Y

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para toggle del menú
  const toggleMenu = (menuId) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  // Funciones para gestionar las tarjetas del Kanban
  const handleAddCard = (column) => {
    if (!newCardData.title.trim()) return;

    const newCard = {
      id: Date.now(),
      title: newCardData.title,
      description: newCardData.description,
      priority: newCardData.priority,
      date: newCardData.date,
      responsable: newCardData.responsable
    };

    setKanbanTasks(prev => ({
      ...prev,
      [column]: [...prev[column], newCard]
    }));

    setNewCardData({ title: '', description: '', priority: 'medium', date: '', responsable: '' });
    setShowNewCardForm(null);
  };

  const handleEditCard = (column, cardId, updatedData) => {
    setKanbanTasks(prev => ({
      ...prev,
      [column]: prev[column].map(card =>
        card.id === cardId ? { ...card, ...updatedData } : card
      )
    }));
    setEditingCard(null);
  };

  const handleDeleteCard = (column, cardId) => {
    setKanbanTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(card => card.id !== cardId)
    }));
  };

  // Funciones para drag and drop
  const handleDragStart = (e, card, column) => {
    setDraggedCard(card);
    setDraggedFromColumn(column);
    e.dataTransfer.effectAllowed = 'move';
    // Añadir un efecto visual al elemento que se está arrastrando
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Añadir clase visual a la columna
    const column = e.currentTarget;
    if (column.classList.contains('kanban-column')) {
      column.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    // Remover clase visual cuando sale de la columna
    const column = e.currentTarget;
    if (column.classList.contains('kanban-column')) {
      column.classList.remove('drag-over');
    }
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();

    // Remover clase visual
    const column = e.currentTarget;
    if (column.classList.contains('kanban-column')) {
      column.classList.remove('drag-over');
    }

    if (!draggedCard || !draggedFromColumn) return;

    // Si se suelta en la misma columna, no hacer nada
    if (draggedFromColumn === targetColumn) {
      setDraggedCard(null);
      setDraggedFromColumn(null);
      return;
    }

    // Mover la tarjeta de una columna a otra
    setKanbanTasks(prev => ({
      ...prev,
      [draggedFromColumn]: prev[draggedFromColumn].filter(card => card.id !== draggedCard.id),
      [targetColumn]: [...prev[targetColumn], draggedCard]
    }));

    setDraggedCard(null);
    setDraggedFromColumn(null);
  };

  const handleDragEnd = (e) => {
    // Restaurar opacidad
    e.currentTarget.style.opacity = '1';
    setDraggedCard(null);
    setDraggedFromColumn(null);
  };

  return (
    <div className="dashboard">
      {/* Contenedor principal */}
      <div className="dashboard-container">
        {/* Header con saludo y fecha */}
        <div className="dashboard-header-section">
          <div className="dashboard-welcome-header">
            <h1 className="welcome-title">
              Bienvenido, {userName}
            </h1>
            <p className="welcome-message">
              ¡Vamos a triunfar hoy!
            </p>
          </div>

          <div className="dashboard-date-card">
            <div className="date-circle">{day}</div>
            <div className="date-info">
              <div className="date-day">{dayOfWeek}</div>
              <div className="date-month">{month}</div>
            </div>
          </div>

        </div>

        {/* Tabs de navegación */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estadisticas')}
          >
            Estadísticas
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'gestion' ? 'active' : ''}`}
            onClick={() => setActiveTab('gestion')}
          >
            Gestión del tiempo
          </button>
        </div>

        {/* Contenedor scrollable con tarjetas */}
        <div className="dashboard-scrollable-content">
          {/* Vista de Estadísticas */}
          {activeTab === 'estadisticas' && (
            <>
              {/* Grid de estadísticas */}
              <div className="dashboard-stats-grid">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="dashboard-stat-card">
                  {/* Header con icono y label */}
                  <div className="stat-card-header">
                    <span className="stat-card-label">{stat.label}</span>
                    <div className="stat-menu-container" ref={openMenuId === `stat-${stat.id}` ? menuRef : null}>
                      <button
                        className="stat-card-menu"
                        onClick={() => toggleMenu(`stat-${stat.id}`)}
                      >
                        ⋮
                      </button>
                      {openMenuId === `stat-${stat.id}` && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item">
                            <Calendar size={16} />
                            <span>Ver semanal</span>
                          </button>
                          <button className="dropdown-item">
                            <TrendingUp size={16} />
                            <span>Ver progreso</span>
                          </button>
                          <button className="dropdown-item">
                            <BarChart3 size={16} />
                            <span>Detalles</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="stat-card-content">
                    {/* Valor numérico */}
                    <div className="stat-card-value-section">
                      <div className="stat-card-value">{stat.value}</div>
                      <div className="stat-card-unit">{stat.label.toLowerCase()}</div>
                    </div>

                    {/* Icono */}
                    <div className="stat-card-icon">
                      <Icon size={32} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Gráfico circular de progreso */}
                  <div className="stat-card-progress">
                    <svg className="progress-ring" width="120" height="120" viewBox="0 0 120 120">
                      {/* Círculo de fondo (gris claro) */}
                      <circle
                        className="progress-ring-bg"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="12"
                      />
                      {/* Círculo de progreso con color */}
                      <circle
                        className={`progress-ring-fill progress-ring-${stat.color}`}
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="12"
                        strokeDasharray={`${(stat.percentage / 100) * 326.73} 326.73`}
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                      />
                      {/* Texto central con porcentaje */}
                      <text
                        x="60"
                        y="60"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="progress-text"
                        fill="#2c2c2c"
                        fontSize="24"
                        fontWeight="700"
                      >
                        {stat.percentage}%
                      </text>
                    </svg>
                    <div className="progress-subtitle">Basado en actividad</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tarjeta de gráfico de actividad mensual - Ocupa todo el ancho */}
          <div className="activity-chart-card">
            {/* Header del gráfico con título y botón de menú */}
            <div className="activity-chart-header">
              <h3 className="chart-title">Actividad Mensual</h3>
              <div className="chart-menu-container" ref={openMenuId === 'chart-menu' ? menuRef : null}>
                <button
                  className="stat-card-menu"
                  onClick={() => toggleMenu('chart-menu')}
                >
                  ⋮
                </button>
                {openMenuId === 'chart-menu' && (
                  <div className="dropdown-menu">
                    <div className="dropdown-section">
                      <div className="dropdown-section-title">Período</div>
                      <button
                        className={`dropdown-item ${chartPeriod === 'semanal' ? 'active' : ''}`}
                        onClick={() => { setChartPeriod('semanal'); setOpenMenuId(null); }}
                      >
                        <Calendar size={16} />
                        <span>Semanal</span>
                      </button>
                      <button
                        className={`dropdown-item ${chartPeriod === 'mensual' ? 'active' : ''}`}
                        onClick={() => { setChartPeriod('mensual'); setOpenMenuId(null); }}
                      >
                        <Calendar size={16} />
                        <span>Mensual</span>
                      </button>
                      <button
                        className={`dropdown-item ${chartPeriod === 'anual' ? 'active' : ''}`}
                        onClick={() => { setChartPeriod('anual'); setOpenMenuId(null); }}
                      >
                        <Calendar size={16} />
                        <span>Anual</span>
                      </button>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section">
                      <div className="dropdown-section-title">Tipo de gráfico</div>
                      <button
                        className={`dropdown-item ${chartView === 'barras' ? 'active' : ''}`}
                        onClick={() => { setChartView('barras'); setOpenMenuId(null); }}
                      >
                        <BarChart3 size={16} />
                        <span>Barras</span>
                      </button>
                      <button
                        className={`dropdown-item ${chartView === 'lineas' ? 'active' : ''}`}
                        onClick={() => { setChartView('lineas'); setOpenMenuId(null); }}
                      >
                        <TrendingUp size={16} />
                        <span>Líneas</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de barras */}
            <div className="activity-chart-content">
              {/* Eje Y con valores */}
              <div className="chart-y-axis">
                <span className="y-axis-label">140</span>
                <span className="y-axis-label">120</span>
                <span className="y-axis-label">100</span>
                <span className="y-axis-label">80</span>
                <span className="y-axis-label">60</span>
                <span className="y-axis-label">40</span>
                <span className="y-axis-label">20</span>
                <span className="y-axis-label">0</span>
              </div>

              {/* Área de barras */}
              <div className="chart-bars-area">
                {/* Líneas de grid horizontales */}
                <div className="chart-grid">
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                </div>

                {/* Barras */}
                <div className="chart-bars">
                  {monthlyActivityData.map((data, index) => {
                    const activitiesHeight = (data.activities / maxValue) * 100;
                    const lessonsHeight = (data.lessons / maxValue) * 100;
                    return (
                      <div key={index} className="bar-group">
                        <div className="bar-stack">
                          <div
                            className="bar bar-secondary"
                            style={{ height: `${lessonsHeight}%` }}
                          ></div>
                          <div
                            className="bar bar-primary"
                            style={{ height: `${activitiesHeight}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Vista de Gestión del tiempo (Tablero Kanban) */}
          {activeTab === 'gestion' && (
            <div className="kanban-board">
              {['porHacer', 'enProceso', 'terminado'].map((columnKey) => {
                const columnTitles = {
                  porHacer: 'Por hacer',
                  enProceso: 'En proceso',
                  terminado: 'Terminado'
                };
                const columnColors = {
                  porHacer: 'red',
                  enProceso: 'orange',
                  terminado: 'green'
                };

                return (
                  <div
                    key={columnKey}
                    className={`kanban-column column-${columnColors[columnKey]}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, columnKey)}
                  >
                    <div className="kanban-column-header">
                      <h3 className="kanban-column-title">{columnTitles[columnKey]}</h3>
                      <div className="kanban-header-actions">
                        <span className="kanban-count">{kanbanTasks[columnKey].length}</span>
                        <button
                          className="btn-add-card"
                          onClick={() => setShowNewCardForm(columnKey)}
                          title="Añadir tarjeta"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="kanban-cards">
                      {kanbanTasks[columnKey].map((card) => (
                        <div
                          key={card.id}
                          className="kanban-card"
                          draggable={!editingCard}
                          onDragStart={(e) => handleDragStart(e, card, columnKey)}
                          onDragEnd={handleDragEnd}
                        >
                          {editingCard?.id === card.id && editingCard?.column === columnKey ? (
                            // Modo edición
                            <div className="kanban-card-edit">
                              <input
                                type="text"
                                className="edit-input"
                                value={editingCard.title}
                                onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                                placeholder="Título"
                              />
                              <textarea
                                className="edit-textarea"
                                value={editingCard.description}
                                onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                                placeholder="Descripción"
                              />
                              <div className="edit-row">
                                <div className="edit-field">
                                  <label className="edit-label">Fecha</label>
                                  <input
                                    type="date"
                                    className="edit-input"
                                    value={editingCard.date || ''}
                                    onChange={(e) => setEditingCard({ ...editingCard, date: e.target.value })}
                                  />
                                </div>
                                <div className="edit-field">
                                  <label className="edit-label">Responsable</label>
                                  <input
                                    type="text"
                                    className="edit-input"
                                    value={editingCard.responsable || ''}
                                    onChange={(e) => setEditingCard({ ...editingCard, responsable: e.target.value })}
                                    placeholder="Nombre"
                                  />
                                </div>
                              </div>
                              <div className="edit-actions">
                                <select
                                  className="priority-select"
                                  value={editingCard.priority}
                                  onChange={(e) => setEditingCard({ ...editingCard, priority: e.target.value })}
                                >
                                  <option value="high">Alta</option>
                                  <option value="medium">Media</option>
                                  <option value="low">Baja</option>
                                </select>
                                <div className="edit-buttons">
                                  <button
                                    className="btn-save"
                                    onClick={() => handleEditCard(columnKey, card.id, {
                                      title: editingCard.title,
                                      description: editingCard.description,
                                      priority: editingCard.priority,
                                      date: editingCard.date,
                                      responsable: editingCard.responsable
                                    })}
                                  >
                                    <Save size={14} />
                                  </button>
                                  <button
                                    className="btn-cancel"
                                    onClick={() => setEditingCard(null)}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Modo vista
                            <>
                              <div className="kanban-card-header">
                                <h4 className="kanban-card-title">{card.title}</h4>
                                <div className="kanban-card-actions">
                                  <span className={`kanban-priority priority-${card.priority}`}></span>
                                  <button
                                    className="btn-edit-card"
                                    onClick={() => setEditingCard({ ...card, column: columnKey })}
                                    title="Editar"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    className="btn-delete-card"
                                    onClick={() => handleDeleteCard(columnKey, card.id)}
                                    title="Eliminar"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <p className="kanban-card-description">{card.description}</p>
                              <div className="kanban-card-meta">
                                {card.date && (
                                  <div className="kanban-card-date">
                                    <span className="meta-label">Fecha:</span>
                                    <span className="meta-value">{new Date(card.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                  </div>
                                )}
                                {card.responsable && (
                                  <div className="kanban-card-responsable">
                                    <span className="meta-label">Responsable:</span>
                                    <span className="meta-value">{card.responsable}</span>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {/* Formulario para nueva tarjeta */}
                      {showNewCardForm === columnKey && (
                        <div className="kanban-card new-card-form">
                          <input
                            type="text"
                            className="edit-input"
                            value={newCardData.title}
                            onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                            placeholder="Título de la tarjeta"
                            autoFocus
                          />
                          <textarea
                            className="edit-textarea"
                            value={newCardData.description}
                            onChange={(e) => setNewCardData({ ...newCardData, description: e.target.value })}
                            placeholder="Descripción (opcional)"
                          />
                          <div className="edit-row">
                            <div className="edit-field">
                              <label className="edit-label">Fecha</label>
                              <input
                                type="date"
                                className="edit-input"
                                value={newCardData.date}
                                onChange={(e) => setNewCardData({ ...newCardData, date: e.target.value })}
                              />
                            </div>
                            <div className="edit-field">
                              <label className="edit-label">Responsable</label>
                              <input
                                type="text"
                                className="edit-input"
                                value={newCardData.responsable}
                                onChange={(e) => setNewCardData({ ...newCardData, responsable: e.target.value })}
                                placeholder="Nombre"
                              />
                            </div>
                          </div>
                          <div className="edit-actions">
                            <select
                              className="priority-select"
                              value={newCardData.priority}
                              onChange={(e) => setNewCardData({ ...newCardData, priority: e.target.value })}
                            >
                              <option value="high">Alta</option>
                              <option value="medium">Media</option>
                              <option value="low">Baja</option>
                            </select>
                            <div className="edit-buttons">
                              <button
                                className="btn-save"
                                onClick={() => handleAddCard(columnKey)}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => {
                                  setShowNewCardForm(null);
                                  setNewCardData({ title: '', description: '', priority: 'medium', date: '', responsable: '' });
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
