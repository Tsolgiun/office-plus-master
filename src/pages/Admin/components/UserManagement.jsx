import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/auth/users/${userId}/status`, { status: newStatus });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/auth/users/${userId}/role`, { role: newRole });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">User Management</h1>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="value">{users.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="value">
            {users.filter(user => user.status === 'active').length}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={tableRowStyle}>
                <td style={tableCellStyle}>
                  {user.profile.firstName} {user.profile.lastName}
                </td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={tableCellStyle}>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                    style={{
                      ...selectStyle,
                      color: user.status === 'active' ? '#28a745' : '#dc3545'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => {/* View user details */}}
                    style={buttonStyle}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '2px solid #e0e0e0',
  color: '#666'
};

const tableRowStyle = {
  borderBottom: '1px solid #e0e0e0'
};

const tableCellStyle = {
  padding: '12px'
};

const selectStyle = {
  padding: '6px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  backgroundColor: 'white'
};

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default UserManagement;
