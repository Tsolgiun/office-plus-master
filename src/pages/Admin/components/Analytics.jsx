import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Analytics = () => {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      byRole: { client: 0, agent: 0, admin: 0 }
    },
    properties: {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0
    },
    bookings: {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Dashboard Analytics</h1>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>User Statistics</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="value">{stats.users.total}</div>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <div className="value">{stats.users.active}</div>
          </div>
          <div className="stat-card">
            <h3>Clients</h3>
            <div className="value">{stats.users.byRole.client}</div>
          </div>
          <div className="stat-card">
            <h3>Agents</h3>
            <div className="value">{stats.users.byRole.agent}</div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Property Statistics</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Properties</h3>
            <div className="value">{stats.properties.total}</div>
          </div>
          <div className="stat-card">
            <h3>Available</h3>
            <div className="value">{stats.properties.available}</div>
          </div>
          <div className="stat-card">
            <h3>Rented</h3>
            <div className="value">{stats.properties.rented}</div>
          </div>
          <div className="stat-card">
            <h3>Under Maintenance</h3>
            <div className="value">{stats.properties.maintenance}</div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Booking Statistics</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <div className="value">{stats.bookings.total}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="value">{stats.bookings.pending}</div>
          </div>
          <div className="stat-card">
            <h3>Confirmed</h3>
            <div className="value">{stats.bookings.confirmed}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="value">{stats.bookings.completed}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sectionStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px'
};

const sectionTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '18px',
  color: '#333'
};

export default Analytics;
