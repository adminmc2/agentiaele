// ========================================
// DASHBOARD DEL SUPERADMINISTRADOR
// ========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActivitiesStats } from '../../services/activityService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getActivitiesStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Error cargando estadísticas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">{error}</div>
        <button onClick={loadStats}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Superadministrador</h1>
        <p>AgentiaELE - Gestión de Contenido</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Actividades</h3>
          <div className="stat-value">{stats?.totalActivities || 0}</div>
          <p className="stat-description">Actividades creadas en el sistema</p>
        </div>

        <div className="stat-card">
          <h3>Libros Activos</h3>
          <div className="stat-value">{stats?.activeBooks || 0}</div>
          <p className="stat-description">EM1, EM2, EM3, EM4</p>
        </div>

        <div className="stat-card">
          <h3>Unidades</h3>
          <div className="stat-value">{stats?.totalUnits || 0}</div>
          <p className="stat-description">Unidades con actividades</p>
        </div>

        <div className="stat-card">
          <h3>Tipos de Actividades</h3>
          <div className="stat-value">{stats?.activityTypes || 0}</div>
          <p className="stat-description">Diferentes tipos utilizados</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/admin/activities/new" className="action-card primary">
            <span className="action-icon">➕</span>
            <h3>Nueva Actividad</h3>
            <p>Crear una actividad de clase</p>
          </Link>

          <Link to="/admin/activities" className="action-card">
            <span className="action-icon">📚</span>
            <h3>Gestionar Actividades</h3>
            <p>Ver, editar o eliminar actividades</p>
          </Link>

          <Link to="/admin/preview" className="action-card">
            <span className="action-icon">👁️</span>
            <h3>Vista Previa</h3>
            <p>Probar actividades como estudiante</p>
          </Link>

          <Link to="/admin/import" className="action-card">
            <span className="action-icon">📥</span>
            <h3>Importar Datos</h3>
            <p>Cargar actividades desde JSON</p>
          </Link>
        </div>
      </div>

      <div className="recent-section">
        <h2>Información del Sistema</h2>
        <div className="info-grid">
          <div className="info-card">
            <h4>Base de Datos</h4>
            <p><strong>Neon.tech PostgreSQL 17</strong></p>
            <p>6 tablas - MOMENTO 1: Clase</p>
            <ul>
              <li>user_profiles</li>
              <li>class_activities</li>
              <li>class_sessions</li>
              <li>user_interactions</li>
              <li>user_achievements</li>
              <li>ai_cache</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>Agentes IA Disponibles</h4>
            <p><strong>4 agentes - MOMENTO 1</strong></p>
            <ul>
              <li>🌐 Translator - Traducciones</li>
              <li>📖 Vocabulary - Vocabulario</li>
              <li>🎯 Personalizer - Personalización</li>
              <li>✨ Creative - Creatividad</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>Tipos de Actividades</h4>
            <ul>
              <li>Expresión oral</li>
              <li>Comprensión lectora</li>
              <li>Vocabulario</li>
              <li>Comprensión auditiva</li>
              <li>Interacción oral</li>
              <li>Ortografía</li>
              <li>Pronunciación</li>
              <li>Gramática</li>
              <li>Escritura</li>
              <li>Autoevaluación</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>Estructuras Soportadas</h4>
            <ul>
              <li>Opción múltiple</li>
              <li>Rellenar huecos</li>
              <li>Verdadero/Falso</li>
              <li>Emparejar</li>
              <li>Ordenar</li>
              <li>Respuesta corta</li>
              <li>Respuesta abierta</li>
              <li>Diálogo</li>
              <li>Ensayo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
