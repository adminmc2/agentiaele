// ========================================
// PROTECTED ROUTE - Ruta protegida
// ========================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras carga, mostrar una pantalla de carga simple
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff'
      }}>
        <div style={{
          fontFamily: 'var(--font-headings)',
          fontSize: '18px',
          color: '#2c2c2c'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

export default ProtectedRoute;
