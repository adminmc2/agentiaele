// ========================================
// HEADER - Barra superior de navegación
// Estilo minimalista beige/crema
// ========================================

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Bot, User, ChevronDown, Settings, LogOut, UserCog, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin');

  const menuItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard'
    },
    {
      path: '/activities',
      icon: BookOpen,
      label: 'Cursos'
    },
    {
      path: '/agents',
      icon: Bot,
      label: 'Agentes IA'
    }
  ];

  const roles = ['Admin', 'Editor', 'Usuario'];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo Section */}
        <div className="header-logo">
          <img src="/logo agentiaele.svg" alt="AgentIAele Logo" className="logo-img" />
          <div className="logo-text">
            <h1 className="logo-title">AgentIAele</h1>
          </div>
          <div className="logo-divider"></div>
          <div className="logo-subtitle">
            <span>Equipo lingüístico</span>
            <span>de Agentes IA para ELE</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="header-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section - Actions & User */}
        <div className="header-actions">
          {/* Notifications */}
          <button className="action-btn" title="Notificaciones">
            <Bell size={20} />
            <span className="notification-badge">1</span>
          </button>

          {/* Role Selector */}
          <div className="role-selector-container">
            <button
              className="role-selector"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            >
              <UserCog size={18} />
              <span className="role-label">{selectedRole}</span>
              <ChevronDown size={14} className={`chevron ${roleDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {roleDropdownOpen && (
              <div className="dropdown-menu role-dropdown">
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`dropdown-item ${selectedRole === role ? 'active' : ''}`}
                    onClick={() => handleRoleChange(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu-container">
            <button
              className="user-menu-button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <User size={20} className="user-icon" />
              <div className="user-info-header">
                <span className="user-name-header">{user?.name || user?.email || 'Usuario'}</span>
                <span className="user-role-header">{selectedRole}</span>
              </div>
              <ChevronDown size={14} className={`chevron ${userDropdownOpen ? 'rotate' : ''}`} />
            </button>

            {userDropdownOpen && (
              <div className="dropdown-menu user-dropdown">
                <button className="dropdown-item">
                  <User size={16} />
                  <span>Mi perfil</span>
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Configuración</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
