// ========================================
// SIDEBAR - Barra lateral de navegación
// Estilo Minimalista Oscuro
// ========================================

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Bot, User, ChevronDown, Settings, LogOut, UserCog } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin');

  const menuItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'INICIO'
    },
    {
      path: '/activities',
      icon: BookOpen,
      label: 'ACTIVIDADES'
    },
    {
      path: '/agents',
      icon: Bot,
      label: 'AGENTES IA'
    }
  ];

  const roles = ['Admin', 'Editor', 'Usuario'];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <div className="logo-container">
            <img src="/logo agentiaele.svg" alt="AgentIAele Logo" className="logo-image" />
            <h1 className="logo-title">AgentIAele</h1>
          </div>
          <p className="logo-subtitle">
            Equipo lingüístico de <strong>Agent</strong>es <strong>IA</strong> para <strong>e</strong>spañol <strong>l</strong>engua <strong>e</strong>xtranjera
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Section - User Menu */}
      <div className="sidebar-footer">
        {/* Role Selector */}
        <div className="role-selector-sidebar">
          <button
            className="role-button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          >
            <UserCog size={18} className="role-icon" />
            <span className="role-text">{selectedRole}</span>
            <ChevronDown size={14} className={`chevron-icon ${roleDropdownOpen ? 'rotate' : ''}`} />
          </button>

          {roleDropdownOpen && (
            <div className="role-dropdown-menu">
              {roles.map((role) => (
                <button
                  key={role}
                  className={`role-option ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => handleRoleChange(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-sidebar">
          <button
            className="user-button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">Armando Cruz</span>
            </div>
            <ChevronDown size={14} className={`chevron-icon ${userDropdownOpen ? 'rotate' : ''}`} />
          </button>

          {userDropdownOpen && (
            <div className="user-dropdown-menu">
              <button className="user-menu-item">
                <User size={16} />
                <span>Mi perfil</span>
              </button>
              <button className="user-menu-item">
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <div className="menu-divider"></div>
              <button className="user-menu-item logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
