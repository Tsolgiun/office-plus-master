import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { propertyService } from '../../services/property';
import Header from '../../components/Header/Header';
import './PropertyDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faBuilding,
  faFileContract,
  faComments,
  faCalendar,
  faUser,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
        document.title = `${data.building?.name || '未命名物业'} | 详情`;
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
          <h1>{property.building?.name || '未命名物业'}</h1>
          <div className="property-price">
            {property.rent_range ? (
              <>
                ¥{property.rent_range}/m²/月
              </>
            ) : (
              '价格待询'
            )}
          </div>
        </div>

        <div className="property-detail-grid">
          <div className="info-section">
            <h2>基本信息</h2>
            <div className="info-grid">
              {property.building?.region && (
                <div>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> 
                  {property.building.region} {property.building.street}
                </div>
              )}
              <div>
                <FontAwesomeIcon icon={faRulerCombined} /> 
                {property.area_range}
              </div>
              <div>
                <FontAwesomeIcon icon={faBuilding} /> 
                {property.building?.property_type || '办公空间'}
              </div>
            </div>
          </div>

          {property.commission?.value && (
            <div className="info-section">
              <h2>佣金信息</h2>
              <div className="commission-details">
                {property.commission.basis && (
                  <div className="commission-badge" data-basis={property.commission.basis}>
                    {property.commission.basis}
                  </div>
                )}
                <div className="commission-value">
                  <FontAwesomeIcon icon={faFileContract} />
                  {property.commission.value}
                </div>
                {property.commission.verification && (
                  <div className="verification-info">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    已上传佣金依据
                  </div>
                )}
              </div>
            </div>
          )}

          {property.communication && (
            <div className="info-section">
              <h2>沟通记录</h2>
              <div className="communication-details">
                {property.communication.date && (
                  <div>
                    <FontAwesomeIcon icon={faCalendar} />
                    {new Date(property.communication.date).toLocaleDateString()}
                  </div>
                )}
                {property.communication.method && (
                  <div>
                    <FontAwesomeIcon icon={faComments} />
                    {property.communication.method}
                  </div>
                )}
                {property.communication.follow_up_result && (
                  <div>
                    <FontAwesomeIcon icon={faUser} />
                    {property.communication.follow_up_result}
                  </div>
                )}
              </div>
            </div>
          )}

          {property.notes_and_control && (
            <div className="info-section">
              <h2>备注与控制</h2>
              <div className="notes-content">
                {property.notes_and_control}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
