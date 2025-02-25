import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

// Import admin components
import UserManagement from './components/UserManagement';
import PropertyManagement from './components/PropertyManagement';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            Users
          </NavLink>
          <NavLink 
            to="/admin/properties" 
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            Properties
          </NavLink>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            Settings
          </NavLink>
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px 0' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>
            Logged in as: {user?.email}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route index element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
