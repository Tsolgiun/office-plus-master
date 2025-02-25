import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    propertyTypes: [],
    amenities: [],
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      bookingNotifications: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      passwordExpiration: 90,
      sessionTimeout: 30
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleSettingChange = async (category, setting, value) => {
    try {
      setError(null);
      setSuccess(null);
      
      await api.patch('/settings', {
        category,
        setting,
        value
      });
      
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }));
      
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const handleAddPropertyType = async (type) => {
    try {
      setError(null);
      setSuccess(null);
      
      await api.post('/settings/property-types', { type });
      fetchSettings();
      setSuccess('Property type added successfully');
    } catch (err) {
      setError('Failed to add property type');
    }
  };

  const handleAddAmenity = async (amenity) => {
    try {
      setError(null);
      setSuccess(null);
      
      await api.post('/settings/amenities', { amenity });
      fetchSettings();
      setSuccess('Amenity added successfully');
    } catch (err) {
      setError('Failed to add amenity');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">System Settings</h1>
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}

      <div className="admin-stats">
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Property Settings</h2>
          <div style={formGroupStyle}>
            <label>Property Types</label>
            <div style={chipContainerStyle}>
              {settings.propertyTypes.map((type, index) => (
                <span key={index} style={chipStyle}>{type}</span>
              ))}
              <button
                onClick={() => {
                  const type = prompt('Enter new property type:');
                  if (type) handleAddPropertyType(type);
                }}
                style={addButtonStyle}
              >
                + Add Type
              </button>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label>Amenities</label>
            <div style={chipContainerStyle}>
              {settings.amenities.map((amenity, index) => (
                <span key={index} style={chipStyle}>{amenity}</span>
              ))}
              <button
                onClick={() => {
                  const amenity = prompt('Enter new amenity:');
                  if (amenity) handleAddAmenity(amenity);
                }}
                style={addButtonStyle}
              >
                + Add Amenity
              </button>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Notification Settings</h2>
          <div style={formGroupStyle}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.emailEnabled}
                onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
              />
              Email Notifications
            </label>
          </div>
          <div style={formGroupStyle}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.smsEnabled}
                onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
              />
              SMS Notifications
            </label>
          </div>
          <div style={formGroupStyle}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.bookingNotifications}
                onChange={(e) => handleSettingChange('notifications', 'bookingNotifications', e.target.checked)}
              />
              Booking Notifications
            </label>
          </div>
          <div style={formGroupStyle}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.marketingEmails}
                onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
              />
              Marketing Emails
            </label>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Security Settings</h2>
          <div style={formGroupStyle}>
            <label>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              />
              Two-Factor Authentication
            </label>
          </div>
          <div style={formGroupStyle}>
            <label>Password Expiration (days)</label>
            <input
              type="number"
              value={settings.security.passwordExpiration}
              onChange={(e) => handleSettingChange('security', 'passwordExpiration', parseInt(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
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

const formGroupStyle = {
  marginBottom: '15px'
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  width: '100px'
};

const chipContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px'
};

const chipStyle = {
  backgroundColor: '#e0e0e0',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '14px'
};

const addButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 12px',
  cursor: 'pointer'
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '20px'
};

const successStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '20px'
};

export default Settings;
