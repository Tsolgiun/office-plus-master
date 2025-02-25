import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chatbot from '../../components/Chatbot/Chatbot';
import { 
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { propertyService } from '../../services/property';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import Header from '../../components/Header/Header';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const observerTarget = useRef(null);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000); // 5万

  const [maxSquare,setMaxSquare] = useState(Infinity);
  const [minSquare,setMinSquare] = useState(0);

  const fetchProperties = async (page, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await propertyService.getAllProperties(page, 10, search);
      
      if (!data || !data.properties) {
        throw new Error('服务器响应无效');
      }

      setProperties(prev => page === 1 ? data.properties : [...prev, ...data.properties]);
      setTotalPages(data.pagination.pages);
      setError(null);
    } catch (err) {
      setError('加载物业失败，请稍后重试。');
      console.error('获取物业出错:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, '');
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setProperties([]);
    fetchProperties(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (loading || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProperties(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSquareChange = (event) => {
    const val = Number(event.target.value);
    if (val == 0) {
      setMaxSquare(Infinity);
      setMinSquare(0);
    } else if (val == 100) {
      setMaxSquare(200);
      setMinSquare(100);
    } else if (val == 200) {
      setMaxSquare(300);
      setMinSquare(200);
    } else if (val == 300) {
      setMaxSquare(500);
      setMinSquare(300);
    } else if (val == 500) {
      setMaxSquare(1000);
      setMinSquare(500);
    }
  };

  const handlePriceChange = (event) => {
    const val = Number(event.target.value);
    if (val == 0) {
      setMaxPrice(Infinity);
      setMinPrice(0);
    } else if (val == 50000) {
      setMaxPrice(50000);
      setMinPrice(0);
    } else if (val == 100000) {
      setMaxPrice(100000);
      setMinPrice(50000);
    } else if (val == 100001) {
      setMaxPrice(Infinity);
      setMinPrice(100000);
    }
  };

  const extractPriceAmount = (priceString) => {
    const match = priceString.match(/(\d+\.?\d*)万/);
    if (match) {
      return parseFloat(match[1]) * 10000;
    }
    return 0;
  };

  const extractSquareAmount = (sizeString) => {
    const match = sizeString.match(/(\d+,?\d*)/);
    if (match) {
      return parseFloat(match[1].replace(',', ''));
    }
    return 0;
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">找到您理想的办公空间</h1>
          <p className="hero-subtitle">发现为提高生产力和成功而设计的优质办公空间</p>
        </div>
      </div>

      <Header onSearch={handleSearch} searchValue={searchTerm} />
      
      <main className={searchTerm ? 'with-search' : ''}>
        <section className="office-listings">
          <h2>可用办公室</h2>
          <div className="filters-container">
            <div className="price-filter">
              <label htmlFor="priceSelect">价格</label>
              <select id="priceSelect" onChange={handlePriceChange}>
                <option value="0">不限</option>
                <option value="50000">5万以下</option>
                <option value="100000">5万-10万</option>
                <option value="100001">10万以上</option>
              </select>
            </div>

            <div className="area-filter">
              <label htmlFor="squareSelect">面积</label>
              <select id="squareSelect" onChange={handleSquareChange}>
                <option value="0">不限</option>
                <option value="100">100-200m²</option>
                <option value="200">200-300m²</option>
                <option value="300">300-500m²</option>
                <option value="500">500-1000m²</option>
              </select>
            </div>
          </div>
          <div className="property-grid">
            {error ? (
              <div className="error-message" role="alert">{error}</div>
            ) : properties.length === 0 && loading ? (
              <div className="loading-message" role="status">正在加载物业...</div>
            ) : properties.length === 0 ? (
              <div className="no-results" role="status">
                {searchTerm ? `未找到"${searchTerm}"相关的物业` : '未找到物业'}
              </div>
            ) : (
              <>
                {properties
                  .filter(property =>
                    (minPrice === 0 || extractPriceAmount(property.price) >= minPrice) &&
                    (maxPrice === Infinity || extractPriceAmount(property.price) <= maxPrice)
                  )
                  .filter(property =>
                    (minSquare === 0 || extractSquareAmount(property.size) >= minSquare) &&
                    (maxSquare === Infinity || extractSquareAmount(property.size) <= maxSquare)
                  )
                  .map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                {currentPage < totalPages && (
                  <div ref={observerTarget} className="loading-indicator" role="status">
                    {loading ? '正在加载更多办公室...' : '滚动加载更多'}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Chatbot />
      
      <footer className="sticky-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>办公空间 Plus</h3>
            <p>您的优质办公空间解决方案</p>
          </div>
          <div className="footer-section contact-info">
            <p><FontAwesomeIcon icon={faPhone} /> (123) 456-7890</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> info@officeplus.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 办公空间 Plus. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
