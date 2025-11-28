import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ActivitiesManager from './pages/admin/ActivitiesManager';
import CourseActivityPage from './pages/admin/CourseActivityPage';
import AgentsPage from './pages/admin/AgentsPage';
import './App.css';

// Componente interno que usa el contexto de autenticación
function AppRoutes() {
  const { isAuthenticated, login } = useAuth();

  return (
    <Routes>
      {/* Ruta de login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={login} />
          )
        }
      />

      {/* Redirect root to dashboard si está autenticado, sino a login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Main Layout with Sidebar - Rutas protegidas */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activities" element={<ActivitiesManager />} />
        <Route path="/activities/:courseId" element={<CourseActivityPage />} />
        <Route path="/agents" element={<AgentsPage />} />
      </Route>

      {/* Catch all - redirect según autenticación */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
