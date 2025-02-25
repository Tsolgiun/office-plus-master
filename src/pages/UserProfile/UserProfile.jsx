import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <h1>Your Profile</h1>
      </div>
      
      <div className="user-profile__content">
        {/* Personal Information */}
        <section className="user-profile__section">
          <h2>Personal Information</h2>
          <div className="user-profile__info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{user.profile.firstName} {user.profile.lastName}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            {user.profile.phone && (
              <div className="info-item">
                <label>Phone</label>
                <p>{user.profile.phone}</p>
              </div>
            )}
            {user.profile.company && (
              <div className="info-item">
                <label>Company</label>
                <p>{user.profile.company}</p>
              </div>
            )}
            {user.profile.position && (
              <div className="info-item">
                <label>Position</label>
                <p>{user.profile.position}</p>
              </div>
            )}
          </div>
        </section>

        {/* Preferences */}
        <section className="user-profile__section">
          <h2>Preferences</h2>
          <div className="user-profile__info-grid">
            {user.preferences?.propertyTypes?.length > 0 && (
              <div className="info-item">
                <label>Property Types</label>
                <p>{user.preferences.propertyTypes.join(', ')}</p>
              </div>
            )}
            {user.preferences?.priceRange && (
              <div className="info-item">
                <label>Price Range</label>
                <p>
                  {user.preferences.priceRange.currency} {user.preferences.priceRange.min} - {user.preferences.priceRange.max}
                </p>
              </div>
            )}
            {user.preferences?.preferredLocations?.length > 0 && (
              <div className="info-item">
                <label>Preferred Locations</label>
                <ul className="locations-list">
                  {user.preferences.preferredLocations.map((location, index) => (
                    <li key={index}>{location.city}, {location.district}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Notification Settings */}
        <section className="user-profile__section">
          <h2>Notification Settings</h2>
          <div className="user-profile__info-grid">
            <div className="info-item">
              <label>Email Notifications</label>
              <p>{user.notifications.email ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="info-item">
              <label>Property Alerts</label>
              <p>{user.notifications.propertyAlerts ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="info-item">
              <label>Booking Updates</label>
              <p>{user.notifications.bookingUpdates ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
