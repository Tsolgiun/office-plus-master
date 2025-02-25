import React from 'react';
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
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  if (!property) {
    return <div className="property-card-error" role="alert">无效的物业数据</div>;
  }

  const { 
    id = '',
    title = '未命名物业', 
    price = '价格待询', 
    location = '位置未指定', 
    image = '', 
    size = '面积未指定', 
    capacity = 0, 
    type = '办公空间', 
    amenities = [], 
    availability = '联系了解可用性',
    building = {}
  } = property;

  const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="property-card">
      <a 
        href={`/office/${id}`} 
        className="property-card-link"
        aria-label={`查看详情：${title} - ${price}`}
        onClick={(e) => {
          if (!id) {
            e.preventDefault();
          }
        }}
      >
        <div className="property-image">
          <img 
            src={image || fallbackImage}
            alt={title}
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.alt = '物业图片不可用';
            }}
          />
          <div 
            className={`property-availability ${availability.toLowerCase().includes('immediate') ? 'immediate' : ''}`}
            role="status"
          >
            {availability}
          </div>
        </div>
        <div className="property-info">
          <h2 className="property-title">{title}</h2>
          <div className="property-price">{price}</div>
          <div className="property-location" aria-label="位置">
            <FontAwesomeIcon icon={faMapMarkerAlt} aria-hidden="true" /> {location}
          </div>
          <div className="property-features" role="list">
            <div role="listitem">
              <FontAwesomeIcon icon={faRulerCombined} aria-hidden="true" /> {size.replace('sq.ft', 'm²')}
            </div>
            <div role="listitem">
              <FontAwesomeIcon icon={faUsers} aria-hidden="true" /> 最多容纳 {capacity} 人
            </div>
            <div role="listitem">
              <FontAwesomeIcon icon={faBuilding} aria-hidden="true" /> {type}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default PropertyCard;
