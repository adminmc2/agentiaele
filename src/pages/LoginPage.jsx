// ========================================
// LOGIN PAGE - Página de inicio de sesión
// ========================================

import { useState, useEffect, useRef } from 'react';
import { X, Fingerprint, UserPlus, ScanFace } from 'lucide-react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import './LoginPage.css';
import { initCreatures } from './creatures.js';
import CustomSelect from '../components/CustomSelect';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDreamModal, setShowDreamModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [canRegisterBiometric, setCanRegisterBiometric] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const stageRef = useRef(null);

  // Estado del formulario de registro
  const [registerForm, setRegisterForm] = useState({
    codigo: '',
    nombre: '',
    institucion: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerStep, setRegisterStep] = useState(1); // 1: código, 2: formulario
  const [registerStatus, setRegisterStatus] = useState({ type: '', message: '' });
  const [registerLoading, setRegisterLoading] = useState(false);

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

  // Verificar si el email tiene biometría registrada
  useEffect(() => {
    const savedEmail = localStorage.getItem('agentia_biometric_email');
    if (savedEmail) {
      setEmail(savedEmail);
      checkBiometric(savedEmail);
    }
  }, []);

  const checkBiometric = async (emailToCheck) => {
    try {
      const response = await fetch(`/.netlify/functions/auth/check-biometric?email=${encodeURIComponent(emailToCheck)}`);
      const data = await response.json();
      setHasBiometric(data.hasBiometric);
    } catch {
      setHasBiometric(false);
    }
  };

  // Cuando cambia el email, verificar biometría
  useEffect(() => {
    if (email && email.includes('@')) {
      const timer = setTimeout(() => checkBiometric(email), 500);
      return () => clearTimeout(timer);
    }
  }, [email]);

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

  // ========================================
  // LOGIN con email/contraseña
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      // Login exitoso
      localStorage.setItem('agentia_biometric_email', email);

      // Verificar si puede registrar biometría
      if (!data.hasBiometric && window.PublicKeyCredential) {
        setLoggedInUser(data.user);
        setCanRegisterBiometric(true);
        // No hacer login todavía, mostrar opción de activar biometría
        return;
      }

      onLogin(data.user);
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // LOGIN con biometría
  // ========================================
  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Obtener opciones de autenticación
      const optionsResponse = await fetch('/.netlify/functions/auth/webauthn/login-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        setError(errorData.error || 'Error al obtener opciones de autenticación');
        setIsLoading(false);
        return;
      }

      const { options, challenge } = await optionsResponse.json();

      // Iniciar autenticación biométrica
      const credential = await startAuthentication(options);

      // Verificar en el servidor
      const verifyResponse = await fetch('/.netlify/functions/auth/webauthn/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, challenge, email })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.error || 'Error en la verificación biométrica');
        setIsLoading(false);
        return;
      }

      // Login exitoso
      onLogin(verifyData.user);
    } catch (err) {
      console.error('Error biométrico:', err);
      setError('Error en la autenticación biométrica. Intenta con tu contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // REGISTRAR biometría
  // ========================================
  const registerBiometric = async (user) => {
    try {
      // Obtener opciones de registro
      const optionsResponse = await fetch('/.netlify/functions/auth/webauthn/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });

      if (!optionsResponse.ok) return;

      const { options, challenge } = await optionsResponse.json();

      // Iniciar registro biométrico
      const credential = await startRegistration(options);

      // Guardar en el servidor
      const registerResponse = await fetch('/.netlify/functions/auth/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          credential,
          challenge,
          deviceName: navigator.platform || 'Dispositivo'
        })
      });

      if (registerResponse.ok) {
        // Guardar email para futuras autenticaciones biométricas
        localStorage.setItem('agentia_biometric_email', user.email);
        setHasBiometric(true);
      }
    } catch (err) {
      console.error('Error registrando biometría:', err);
    }
  };

  // ========================================
  // REGISTRO de nuevo usuario
  // ========================================
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const validateInvitationCode = async () => {
    setRegisterStatus({ type: '', message: '' });
    setRegisterLoading(true);

    try {
      const response = await fetch('/.netlify/functions/auth/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: registerForm.codigo })
      });

      const data = await response.json();

      if (data.valid) {
        setRegisterStep(2);
      } else {
        setRegisterStatus({ type: 'error', message: data.error || 'Código inválido' });
      }
    } catch {
      setRegisterStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterStatus({ type: '', message: '' });

    // Validar contraseñas
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterStatus({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await fetch('/.netlify/functions/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: registerForm.codigo,
          nombre: registerForm.nombre,
          institucion: registerForm.institucion,
          email: registerForm.email,
          password: registerForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterStatus({ type: 'success', message: '¡Cuenta creada! Iniciando sesión...' });

        // Auto-login después de registro
        setTimeout(() => {
          localStorage.setItem('agentia_biometric_email', registerForm.email);
          onLogin(data.user);
        }, 1500);
      } else {
        setRegisterStatus({ type: 'error', message: data.error || 'Error al crear la cuenta' });
      }
    } catch {
      setRegisterStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setRegisterLoading(false);
    }
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterStep(1);
    setRegisterForm({ codigo: '', nombre: '', institucion: '', email: '', password: '', confirmPassword: '' });
    setRegisterStatus({ type: '', message: '' });
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

            {/* Botones de login */}
            <div className="login-buttons">
              <button type="submit" className="btn-login" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

            </div>

            {/* Botón de acceso biométrico */}
            {hasBiometric && (
              <button
                type="button"
                className="btn-biometric-full"
                onClick={handleBiometricLogin}
                disabled={isLoading}
              >
                <Fingerprint size={20} />
                <span>Acceder con huella o Face ID</span>
              </button>
            )}

            {/* Enlace para crear cuenta */}
            <div className="register-link">
              <span>¿No tienes cuenta?</span>
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="btn-create-account"
              >
                <UserPlus size={16} />
                Crear cuenta
              </button>
            </div>
          </form>

          {/* Panel de activación de biometría */}
          {canRegisterBiometric && loggedInUser && (
            <div className="biometric-activation-panel">
              <div className="biometric-icons">
                <div className="biometric-icon">
                  <Fingerprint size={32} />
                </div>
                <div className="biometric-icon">
                  <ScanFace size={32} />
                </div>
              </div>
              <h3>Bienvenido</h3>
              <p>Activa el acceso rápido con huella o Face ID para próximas sesiones</p>
              <div className="biometric-buttons">
                <button
                  className="btn-activate-biometric"
                  onClick={async () => {
                    setIsLoading(true);
                    await registerBiometric(loggedInUser);
                    onLogin(loggedInUser);
                  }}
                  disabled={isLoading}
                >
                  <Fingerprint size={18} />
                  {isLoading ? 'Activando...' : 'Activar acceso biométrico'}
                </button>
                <button
                  className="btn-skip-biometric"
                  onClick={() => onLogin(loggedInUser)}
                >
                  Ahora no, gracias
                </button>
              </div>
            </div>
          )}
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

      {/* Modal de Registro */}
      {showRegisterModal && (
        <div
          onClick={closeRegisterModal}
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
              maxWidth: '450px',
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeRegisterModal}
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
                margin: '0 0 6px 0',
                color: '#ffffff'
              }}>
                Crear cuenta
              </h2>
              <p style={{
                fontFamily: 'Dosis, sans-serif',
                fontSize: '0.95rem',
                opacity: 0.9,
                margin: 0,
                color: '#ffffff'
              }}>
                {registerStep === 1 ? 'Ingresa tu código de invitación' : 'Completa tus datos'}
              </p>
            </div>

            {/* Contenido */}
            <div style={{ padding: '24px' }}>
              {registerStatus.message && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  marginBottom: '16px',
                  background: registerStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: registerStatus.type === 'success' ? '#155724' : '#721c24',
                  border: registerStatus.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                }}>
                  {registerStatus.message}
                </div>
              )}

              {registerStep === 1 ? (
                /* Paso 1: Código de invitación */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Código de invitación
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={registerForm.codigo}
                      onChange={handleRegisterChange}
                      placeholder="Ej: ELIAS2026"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #ffb8a0',
                        borderRadius: '10px',
                        background: '#ffffff',
                        fontSize: '1rem',
                        fontFamily: 'Dosis, sans-serif',
                        color: '#333',
                        boxSizing: 'border-box',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={validateInvitationCode}
                    disabled={registerLoading || !registerForm.codigo}
                    style={{
                      padding: '14px 20px',
                      background: '#ffb8a0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '10px',
                      fontFamily: 'Dosis, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: registerLoading || !registerForm.codigo ? 'not-allowed' : 'pointer',
                      opacity: registerLoading || !registerForm.codigo ? 0.6 : 1
                    }}
                  >
                    {registerLoading ? 'Validando...' : 'Continuar'}
                  </button>
                </div>
              ) : (
                /* Paso 2: Formulario de registro */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontFamily: 'Dosis, sans-serif', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={registerForm.nombre}
                      onChange={handleRegisterChange}
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
                      Institución *
                    </label>
                    <input
                      type="text"
                      name="institucion"
                      value={registerForm.institucion}
                      onChange={handleRegisterChange}
                      placeholder="Ej: Universidad de Salamanca"
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
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
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
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                      minLength={6}
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
                      Confirmar contraseña *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
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

                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: '#f0f0f0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: 'Dosis, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={registerLoading}
                      style={{
                        flex: 2,
                        padding: '14px 20px',
                        background: '#ffb8a0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: 'Dosis, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: registerLoading ? 'not-allowed' : 'pointer',
                        opacity: registerLoading ? 0.6 : 1
                      }}
                    >
                      {registerLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

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
                  margin: '0 0 6px 0',
                  color: '#ffffff'
                }}>
                  Sueña con tu agente
                </h2>
                <p style={{
                  fontFamily: 'Dosis, sans-serif',
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  margin: 0,
                  color: '#ffffff'
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
                    placeholder="Ej: Un asistente que ayude a practicar la conjugación de verbos irregulares en presente. Debería corregir errores de forma amable, dar pistas cuando el estudiante se equivoque y proponer ejercicios de dificultad progresiva."
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
                    placeholder="Ej: En una clase de B1, después de explicar el pretérito indefinido, los estudiantes interactúan con el agente para practicar. El agente les propone completar frases como 'Ayer yo (comer) paella' y les da feedback inmediato."
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
