import api from './api';

export const propertyService = {
  // Get all properties
  getAllProperties: async (page = 1, limit = 10, search = '') => {
    try {
      const params = { page, limit };
      if (search) {
        params.search = search;
      }
      const response = await api.get('/properties', { params });
      
      if (!response.data || !response.data.properties || !Array.isArray(response.data.properties)) {
        throw new Error('Invalid response format from API');
      }

      return {
        properties: response.data.properties,
        pagination: {
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          pages: response.data.pagination.pages
        }
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch properties. Please try again later.'
      );
    }
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    if (!id) {
      throw new Error('Property ID is required');
    }
    try {
      const response = await api.get(`/properties/${id}`);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid property data received');
      }
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 404 
          ? 'Property not found' 
          : error.response?.data?.message || 
            'Failed to fetch property details. Please try again later.'
      );
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    if (!propertyData || typeof propertyData !== 'object') {
      throw new Error('Valid property data is required');
    }
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to create property. Please check your data and try again.'
      );
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    if (!id) {
      throw new Error('Property ID is required');
    }
    if (!propertyData || typeof propertyData !== 'object') {
      throw new Error('Valid property data is required');
    }
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 404 
          ? 'Property not found' 
          : error.response?.data?.message || 
            'Failed to update property. Please try again later.'
      );
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    if (!id) {
      throw new Error('Property ID is required');
    }
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 404 
          ? 'Property not found' 
          : error.response?.data?.message || 
            'Failed to delete property. Please try again later.'
      );
    }
  }
};
