import React from 'react';
import './Logo.css';

// Import all logo variants
import logoDefault from '../../assets/images/OfficesPlus_logo中英.png';
import logoMonochrome from '../../assets/images/OfficesPlus_logo中英（單色）.png';
import logoDark from '../../assets/images/OfficesPlus_logo中英（黑底）.png';
import logoHorizontal from '../../assets/images/OfficesPlus_logo横式.png';
import logoHorizontalMono from '../../assets/images/OfficesPlus_logo横式（單色）.png';
import logoHorizontalDark from '../../assets/images/OfficesPlus_logo横式（黑底）.png';

const Logo = ({ variant = 'default', className = '', ...props }) => {
  const getLogoSrc = () => {
    switch (variant) {
      case 'monochrome':
        return logoMonochrome;
      case 'dark':
        return logoDark;
      case 'horizontal':
        return logoHorizontal;
      case 'horizontal-mono':
        return logoHorizontalMono;
      case 'horizontal-dark':
        return logoHorizontalDark;
      default:
        return logoDefault;
    }
  };

  return (
    <img
      src={getLogoSrc()}
      alt="OfficesPlus Logo"
      className={`logo ${className}`}
      {...props}
    />
  );
};

export default Logo;
