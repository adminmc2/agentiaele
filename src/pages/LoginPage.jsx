// ========================================
// LOGIN PAGE - Página de inicio de sesión
// ========================================

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './LoginPage.css';
import { initCreatures } from './creatures.js';
import CustomSelect from '../components/CustomSelect';

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
    email_confirmacion: '',
    nivel_estudiantes: '',
    nombre_agente: '',
    descripcion_agente: '',
    objetivo: '',
    ejemplo_uso: ''
  });
  const [propuestaStatus, setPropuestaStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handlePropuestaChange = (e) => {
    const { name, value } = e.target;
    setPropuestaForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePropuestaSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPropuestaStatus({ type: '', message: '' });

    // Validar que los emails coincidan
    if (propuestaForm.email !== propuestaForm.email_confirmacion) {
      setEmailError('Los emails no coinciden');
      return;
    }

    setSubmitting(true);

    try {
      // Enviar sin email_confirmacion
      const { email_confirmacion, ...dataToSend } = propuestaForm;
      const response = await fetch('/.netlify/functions/propuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        setPropuestaStatus({ type: 'success', message: '¡Propuesta enviada con éxito! Nos pondremos en contacto contigo pronto.' });
        setPropuestaForm({
          nombre: '', apellidos: '', email: '', email_confirmacion: '', nivel_estudiantes: '',
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
        <div
          onClick={() => setShowDreamModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Boton cerrar */}
            <button
              onClick={() => setShowDreamModal(false)}
              title="Cerrar"
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <X size={20} />
            </button>

            {/* Contenido scrolleable */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* Header */}
              <div style={{
                background: '#1a1a1a',
                padding: '28px 20px',
                textAlign: 'center',
                color: 'white'
              }}>
                <h2 style={{
                  fontFamily: 'Dosis, sans-serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  margin: '0 0 6px 0'
                }}>
                  Sueña con tu agente
                </h2>
                <p style={{
                  fontFamily: 'Dosis, sans-serif',
                  fontSize: '0.95rem',
                  opacity: 0.8,
                  margin: 0
                }}>
                  Nosotros te lo creamos
                </p>
              </div>

              {/* Formulario */}
              <form
                onSubmit={handlePropuestaSubmit}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'white'
                }}
              >
                {/* Mensajes */}
                {propuestaStatus.message && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 500,
                    background: propuestaStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: propuestaStatus.type === 'success' ? '#155724' : '#721c24',
                    border: propuestaStatus.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                  }}>
                    {propuestaStatus.message}
                  </div>
                )}
                {emailError && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 500,
                    background: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb'
                  }}>
                    {emailError}
                  </div>
                )}

                {/* Fila: Nombre y Apellidos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={propuestaForm.nombre}
                      onChange={handlePropuestaChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #ffb8a0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontFamily: 'Dosis, sans-serif',
                        color: '#333',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      value={propuestaForm.apellidos}
                      onChange={handlePropuestaChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #ffb8a0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontFamily: 'Dosis, sans-serif',
                        color: '#333',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Fila: Email y Repetir email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={propuestaForm.email}
                      onChange={handlePropuestaChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #ffb8a0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontFamily: 'Dosis, sans-serif',
                        color: '#333',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Repetir email *
                    </label>
                    <input
                      type="email"
                      name="email_confirmacion"
                      value={propuestaForm.email_confirmacion}
                      onChange={handlePropuestaChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #ffb8a0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        fontSize: '0.95rem',
                        fontFamily: 'Dosis, sans-serif',
                        color: '#333',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Nivel de estudiantes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    Nivel de tus estudiantes *
                  </label>
                  <CustomSelect
                    value={propuestaForm.nivel_estudiantes}
                    onChange={(val) => setPropuestaForm(prev => ({ ...prev, nivel_estudiantes: val }))}
                    placeholder="Selecciona un nivel"
                    required
                    className="dream-modal-select"
                    options={[
                      { value: 'A1', label: 'A1 - Principiante' },
                      { value: 'A2', label: 'A2 - Elemental' },
                      { value: 'B1', label: 'B1 - Intermedio' },
                      { value: 'B2', label: 'B2 - Intermedio Alto' },
                      { value: 'C1', label: 'C1 - Avanzado' },
                      { value: 'C2', label: 'C2 - Maestría' },
                      { value: 'Mixto', label: 'Niveles mixtos' }
                    ]}
                  />
                </div>

                {/* Nombre del agente */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    Nombre del agente *
                  </label>
                  <input
                    type="text"
                    name="nombre_agente"
                    value={propuestaForm.nombre_agente}
                    onChange={handlePropuestaChange}
                    placeholder="Ej: Asistente de Gramática Interactivo"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #ffb8a0',
                      borderRadius: '10px',
                      background: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'Dosis, sans-serif',
                      color: '#333',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Descripcion del agente */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    Descripción del agente *
                  </label>
                  <textarea
                    name="descripcion_agente"
                    value={propuestaForm.descripcion_agente}
                    onChange={handlePropuestaChange}
                    placeholder="Describe cómo sería tu agente ideal..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #ffb8a0',
                      borderRadius: '10px',
                      background: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'Dosis, sans-serif',
                      color: '#333',
                      boxSizing: 'border-box',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Objetivo pedagogico */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    Objetivo pedagógico *
                  </label>
                  <textarea
                    name="objetivo"
                    value={propuestaForm.objetivo}
                    onChange={handlePropuestaChange}
                    placeholder="¿Qué objetivo educativo quieres alcanzar?"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #ffb8a0',
                      borderRadius: '10px',
                      background: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'Dosis, sans-serif',
                      color: '#333',
                      boxSizing: 'border-box',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Ejemplo de uso */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                    Ejemplo de uso *
                  </label>
                  <textarea
                    name="ejemplo_uso"
                    value={propuestaForm.ejemplo_uso}
                    onChange={handlePropuestaChange}
                    placeholder="Describe un caso concreto de uso en clase..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #ffb8a0',
                      borderRadius: '10px',
                      background: '#ffffff',
                      fontSize: '0.95rem',
                      fontFamily: 'Dosis, sans-serif',
                      color: '#333',
                      boxSizing: 'border-box',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Boton enviar */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px 20px',
                    background: '#ffb8a0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '10px',
                    fontFamily: 'Dosis, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                    marginTop: '8px'
                  }}
                >
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
