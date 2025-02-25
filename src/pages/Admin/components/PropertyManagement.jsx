import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch properties');
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await api.patch(`/properties/${propertyId}/status`, { status: newStatus });
      fetchProperties(); // Refresh property list
    } catch (err) {
      setError('Failed to update property status');
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${propertyId}`);
        fetchProperties(); // Refresh property list
      } catch (err) {
        setError('Failed to delete property');
      }
    }
  };

  const handleFeatured = async (propertyId, featured) => {
    try {
      await api.patch(`/properties/${propertyId}/featured`, { featured });
      fetchProperties(); // Refresh property list
    } catch (err) {
      setError('Failed to update property featured status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Property Management</h1>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: '#28a745'
          }}
          onClick={() => {/* Add new property */}}
        >
          Add New Property
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <div className="value">{properties.length}</div>
        </div>
        <div className="stat-card">
          <h3>Featured Properties</h3>
          <div className="value">
            {properties.filter(property => property.featured).length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Available Properties</h3>
          <div className="value">
            {properties.filter(property => property.status === 'available').length}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Property Name</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Featured</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property._id} style={tableRowStyle}>
                <td style={tableCellStyle}>{property.name}</td>
                <td style={tableCellStyle}>
                  {property.location.city}, {property.location.district}
                </td>
                <td style={tableCellStyle}>
                  ${property.price.toLocaleString()}
                </td>
                <td style={tableCellStyle}>
                  <select
                    value={property.status}
                    onChange={(e) => handleStatusChange(property._id, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="checkbox"
                    checked={property.featured}
                    onChange={(e) => handleFeatured(property._id, e.target.checked)}
                  />
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {/* Edit property */}}
                      style={buttonStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                    >
                      Delete
                    </button>
                  </div>
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

export default PropertyManagement;
