import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faRulerCombined, 
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  if (!property) {
    return <div className="property-card-error" role="alert">无效的物业数据</div>;
  }

  const { 
    id = '',
    rent_range = '价格待询', 
    area_range = '面积未指定', 
    commission: { value: commissionValue = '', basis: commissionBasis = '', verification = '' } = {},
    building = {}
  } = property;

  const fallbackImage = '/images/property-placeholder.jpg';

  return (
    <div className="property-card">
      <a 
        href={`/office/${id}`} 
        className="property-card-link"
        aria-label={`查看详情：${building?.name || '未命名'} - ${rent_range}`}
      >
        <div className="property-info">
          <h2 className="property-title">{building?.name || '未命名物业'}</h2>
          
          <div className="property-price">
            {rent_range ? (
              <div className="price-range">
                ¥{rent_range}/m²/月
              </div>
            ) : (
              <div className="price-enquiry">价格待询</div>
            )}
          </div>

          {building?.region && (
            <div className="property-location" aria-label="位置">
              <FontAwesomeIcon icon={faMapMarkerAlt} aria-hidden="true" /> 
              {building.region} {building.street}
            </div>
          )}

          <div className="property-features" role="list">
            <div role="listitem">
              <FontAwesomeIcon icon={faRulerCombined} aria-hidden="true" /> 
              {area_range}
            </div>
            <div role="listitem">
              <FontAwesomeIcon icon={faBuilding} aria-hidden="true" /> 
              {building?.property_type || '办公空间'}
            </div>
          </div>

          {commissionValue && (
            <div className="commission-info">
              {commissionBasis && (
                <span className="commission-badge" data-basis={commissionBasis}>
                  {commissionBasis}
                </span>
              )}
              <span className="commission-value">{commissionValue}</span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default PropertyCard;
