// ========================================
// LOGIN PAGE - Página de inicio de sesión
// ========================================

import { useState, useEffect, useRef } from 'react';
import './LoginPage.css';
import { initCreatures } from './creatures.js';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showDreamModal, setShowDreamModal] = useState(false);
  const stageRef = useRef(null);

  // Estado del formulario de propuesta
  const [propuestaForm, setPropuestaForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    nivel_estudiantes: '',
    nombre_agente: '',
    descripcion_agente: '',
    objetivo: '',
    ejemplo_uso: ''
  });
  const [propuestaStatus, setPropuestaStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handlePropuestaChange = (e) => {
    const { name, value } = e.target;
    setPropuestaForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePropuestaSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setPropuestaStatus({ type: '', message: '' });

    try {
      const response = await fetch('/.netlify/functions/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propuestaForm)
      });

      const data = await response.json();

      if (response.ok) {
        setPropuestaStatus({ type: 'success', message: '¡Propuesta enviada con éxito! Nos pondremos en contacto contigo pronto.' });
        setPropuestaForm({
          nombre: '', apellidos: '', email: '', nivel_estudiantes: '',
          nombre_agente: '', descripcion_agente: '', objetivo: '', ejemplo_uso: ''
        });
      } else {
        setPropuestaStatus({ type: 'error', message: data.error || 'Error al enviar la propuesta.' });
      }
    } catch (err) {
      setPropuestaStatus({ type: 'error', message: 'Error de conexión. Verifica tu conexión a internet.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize creatures animation
  useEffect(() => {
    if (stageRef.current) {
      const cleanup = initCreatures(stageRef.current);
      return cleanup;
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    // Validar credenciales
    const VALID_EMAIL = 'mandoc2@inmersion.io';
    const VALID_PASSWORD = '19/10.25_Acc';

    if (email !== VALID_EMAIL) {
      setError('Email no registrado');
      return;
    }

    if (password !== VALID_PASSWORD) {
      setError('Contraseña incorrecta');
      return;
    }

    // Login exitoso
    onLogin({
      email,
      name: 'Armando Cruz',
      role: 'Admin'
    });
  };

  return (
    <div className="login-page">
      {/* Columna izquierda - Formulario */}
      <div className="login-left">
        {/* Logo y título */}
        <div className="login-header">
          <img src="/logo agentiaele.svg" alt="AgentIAele Logo" className="login-logo" />
          <div className="logo-text">
            <h1 className="logo-title">AgentIAele</h1>
          </div>
        </div>

        {/* Información del equipo */}
        <div className="login-team-info">
          <h2 className="team-title">Equipo lingüístico de Agentes IA para ELE</h2>
          <p className="team-description">
            Sistema de aprendizaje asistido por inteligencia artificial para Español como Lengua Extranjera
          </p>
        </div>

        {/* Formulario de login */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="ejemplo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Remember me y Forgot password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
              <button type="button" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de login */}
            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>
        </div>
      </div>

      {/* Columna derecha - Animación interactiva */}
      <div className="login-right">
        <div className="stage" ref={stageRef}></div>
        <div className="press-text">
          <p className="press-line-1">Despierta al agente que llevas dentro<br />y únete al equipo</p>
          <p className="press-line-2">— Hay gente para todo y agentes también —</p>
          <button onClick={() => setShowDreamModal(true)} className="dream-agent-link">Sueña con tu agente</button>
        </div>
        <div className="awake-creatures-hint">
          <p className="hint-text">
            Despégalos y despiértalos,<br />
            despierta a tu agente<br />
            y despega
          </p>
          <span className="hint-arrow-down">↘</span>
        </div>
        <div className="sleeping-creature-hint">
          <p className="hint-text">
            No se despierta,<br />
            pero si la tocas<br />
            te permitirá<br />
            conocer al equipo<br />
            <span className="hint-arrow">↘</span>
          </p>
        </div>
      </div>

      {/* Modal Sueña con tu agente */}
      {showDreamModal && (
        <div className="dream-modal-overlay" onClick={() => setShowDreamModal(false)}>
          <div className="dream-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dream-modal-close" onClick={() => setShowDreamModal(false)}>×</button>
            <div className="dream-modal-content">
              <div className="dream-modal-header">
                <h2>Sueña con tu agente</h2>
                <p>Nosotros te lo creamos</p>
              </div>
              <form className="dream-form" onSubmit={handlePropuestaSubmit}>
                {propuestaStatus.message && (
                  <div className={`dream-message ${propuestaStatus.type}`}>
                    {propuestaStatus.message}
                  </div>
                )}
                <div className="dream-form-row">
                  <div className="dream-form-group">
                    <label>Nombre *</label>
                    <input type="text" name="nombre" value={propuestaForm.nombre} onChange={handlePropuestaChange} required />
                  </div>
                  <div className="dream-form-group">
                    <label>Apellidos *</label>
                    <input type="text" name="apellidos" value={propuestaForm.apellidos} onChange={handlePropuestaChange} required />
                  </div>
                </div>
                <div className="dream-form-row">
                  <div className="dream-form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={propuestaForm.email} onChange={handlePropuestaChange} required />
                  </div>
                  <div className="dream-form-group">
                    <label>Nivel de tus estudiantes *</label>
                    <select name="nivel_estudiantes" value={propuestaForm.nivel_estudiantes} onChange={handlePropuestaChange} required>
                      <option value="">Selecciona un nivel</option>
                      <option value="A1">A1 - Principiante</option>
                      <option value="A2">A2 - Elemental</option>
                      <option value="B1">B1 - Intermedio</option>
                      <option value="B2">B2 - Intermedio Alto</option>
                      <option value="C1">C1 - Avanzado</option>
                      <option value="C2">C2 - Maestría</option>
                      <option value="Mixto">Niveles mixtos</option>
                    </select>
                  </div>
                </div>
                <div className="dream-form-group">
                  <label>Nombre del agente *</label>
                  <input type="text" name="nombre_agente" value={propuestaForm.nombre_agente} onChange={handlePropuestaChange} placeholder="Ej: Asistente de Gramática Interactivo" required />
                </div>
                <div className="dream-form-group">
                  <label>Descripción del agente *</label>
                  <textarea name="descripcion_agente" value={propuestaForm.descripcion_agente} onChange={handlePropuestaChange} placeholder="Describe cómo sería tu agente ideal..." required />
                </div>
                <div className="dream-form-group">
                  <label>Objetivo pedagógico *</label>
                  <textarea name="objetivo" value={propuestaForm.objetivo} onChange={handlePropuestaChange} placeholder="¿Qué objetivo educativo quieres alcanzar?" required />
                </div>
                <div className="dream-form-group">
                  <label>Ejemplo de uso *</label>
                  <textarea name="ejemplo_uso" value={propuestaForm.ejemplo_uso} onChange={handlePropuestaChange} placeholder="Describe un caso concreto de uso en clase..." required />
                </div>
                <button type="submit" className="dream-submit-btn" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar propuesta'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
