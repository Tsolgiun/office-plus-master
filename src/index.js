import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './assets/fonts.css';
import { 
  faWifi, 
  faClock, 
  faCoffee, 
  faShieldAlt,
  faPhone,
  faEnvelope,
  faSearch,
  faCheck,
  faMapMarkerAlt,
  faRulerCombined,
  faUsers,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

// Add icons to the library
library.add(
  faWifi,
  faClock,
  faCoffee,
  faShieldAlt,
  faPhone,
  faEnvelope,
  faSearch,
  faCheck,
  faMapMarkerAlt,
  faRulerCombined,
  faUsers,
  faBuilding,
  faFacebook,
  faTwitter,
  faLinkedin
);

// Add Poppins font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
