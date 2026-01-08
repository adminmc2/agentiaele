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
            <iframe
              src="/suena-con-tu-agente.html"
              title="Sueña con tu agente"
              className="dream-modal-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
