import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { propertyService } from '../../services/property';
import './Listings.css';

const PropertySkeleton = () => (
  <div className="property-card skeleton">
    <div className="property-image skeleton-image"></div>
    <div className="property-info">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line price"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-features">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  </div>
);

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadProperties();
  }, [page]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const { properties: data, pagination } = await propertyService.getAllProperties(page, itemsPerPage);
      
      const validProperties = data.filter(property => {
        const isValid = property.title && 
                     property.building && 
                     property.building.name && 
                     property.amenities;
      
        if (!isValid) {
          console.warn('Invalid property data:', property);
        }
        return isValid;
      });

      setTotalPages(pagination.pages);
      setProperties(validProperties);
      setFilteredProperties(validProperties);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to load properties. Please try again later.';
      console.error('Error loading properties:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProperties(properties);
      return;
    }

    console.log('Searching with term:', searchTerm);
    const searchLower = searchTerm.toLowerCase();
    const filtered = properties.filter(property => {
      try {
        return (
          property.location.toLowerCase().includes(searchLower) ||
          property.title.toLowerCase().includes(searchLower) ||
          property.type.toLowerCase().includes(searchLower) ||
          (property.building?.name || '').toLowerCase().includes(searchLower) ||
          property.amenities.some(amenity => 
            amenity.toLowerCase().includes(searchLower)
          )
        );
      } catch (err) {
        console.warn('Error filtering property:', property, err);
        return false;
      }
    });

    console.log('Filtered properties count:', filtered.length);
    setFilteredProperties(filtered);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="listings-page">
      <Header onSearch={handleSearch} />
      
      <main className="listings-content">
        <section className="listings-section">
          <h2>Available Office Spaces</h2>
          {loading ? (
            <div className="property-grid">
              {[...Array(itemsPerPage)].map((_, index) => (
                <PropertySkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="error">
              {error}
              <button onClick={() => loadProperties()} className="retry-button">
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="property-grid">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  <p className="no-results">No office spaces found matching your search.</p>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-number ${page === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Listings;
