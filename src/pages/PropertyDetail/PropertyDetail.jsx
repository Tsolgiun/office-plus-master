import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/property';
import Header from '../../components/Header/Header';
import './PropertyDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faUsers, 
  faBuilding,
  faParking,
  faShieldAlt,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
        document.title = `${data.title} | 办公室详情`;
      } catch (err) {
        setError(err.message || '获取物业详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="property-detail-container" aria-live="polite">
        <div className="loading-spinner" role="status">
          正在加载物业详情...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-container" role="alert">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-container" role="alert">
        <div className="error-message">
          未找到物业
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="property-detail-container">
      <div className="property-detail-header">
        <h1>{property.title}</h1>
        <div className="property-price">{property.price}</div>
      </div>

      <div className="property-detail-image">
        <img 
          src={property.image || 'https://via.placeholder.com/800x400?text=暂无图片'} 
          alt={property.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=暂无图片';
          }}
        />
      </div>

      <div className="property-detail-info">
        <div className="info-section">
          <h2>位置</h2>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.location}
          </p>
        </div>

        <div className="info-section specifications">
          <h2>规格</h2>
          <div className="specs-grid">
            <div>
              <FontAwesomeIcon icon={faRulerCombined} /> {property.size}
            </div>
            <div>
              <FontAwesomeIcon icon={faUsers} /> 最多容纳 {property.capacity} 人
            </div>
            <div>
              <FontAwesomeIcon icon={faBuilding} /> {property.type}
            </div>
          </div>
        </div>

        {property.building && (
          <div className="info-section">
            <h2>楼宇信息</h2>
            <h3>{property.building.name}</h3>
            <div className="building-features">
              {property.building.parkingAvailable && (
                <div className="feature">
                  <FontAwesomeIcon icon={faParking} /> 提供停车位
                </div>
              )}
              {property.building.security?.type === '24/7' && (
                <div className="feature">
                  <FontAwesomeIcon icon={faShieldAlt} /> 24小时安保
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h2>设施</h2>
          <div className="amenities-grid">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="amenity">
                <FontAwesomeIcon icon={faCheck} /> {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2>可用性</h2>
          <p className={`availability ${property.availability.toLowerCase().includes('immediate') ? 'immediate' : ''}`}>
            {property.availability}
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default PropertyDetail;
