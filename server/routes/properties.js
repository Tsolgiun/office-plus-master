const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get model references
const Property = mongoose.model('Property');
const Building = mongoose.model('Building');
const Amenity = mongoose.model('Amenity');

// GET all properties
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready');
    }

    // Build search query
    const searchQuery = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      searchQuery.$or = [
        { title: searchRegex },
        { 'specifications.type': searchRegex },
        { 'location.address': searchRegex }
      ];
    }

    // Get total count for pagination
    const total = await Property.countDocuments(searchQuery);
    
    // Get paginated properties with populated data
    const properties = await Property.find(searchQuery)
      .populate({
        path: 'buildingId',
        model: Building,
        select: '_id name parkingAvailable security'
      })
      .populate({
        path: 'amenities',
        model: Amenity,
        select: 'name'
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!properties) {
      throw new Error('Failed to fetch properties');
    }
    
    // Transform the response to match the frontend needs
    const transformedProperties = properties.map(property => ({
      id: property._id,
      title: property.buildingId?.name || '未命名楼宇',
      description: property.description,
      price: property.rent_range || '价格待询',
      location: property.location?.address || '',
      image: property.media?.mainImage || '',
      size: property.area_range || '面积未指定',
      type: property.specifications?.type || '办公空间',
      capacity: property.specifications?.capacity || 0,
      amenities: property.amenities?.map(amenity => amenity.name) || [],
      communication: {
        date: property.communication?.date,
        method: property.communication?.method,
        follow_up_result: property.communication?.follow_up_result
      },
      commission: property.commission ? {
        value: property.commission,
        basis: property.commission_basis,
        verification: property.commission_verification
      } : null,
      notes: property.notes_and_control,
      building: property.buildingId ? {
        id: property.buildingId._id,
        name: property.buildingId.name || '未命名楼宇',
        parkingAvailable: property.buildingId.parkingAvailable,
        security: property.buildingId.security
      } : null
    }));

    // Return paginated response
    res.json({
      properties: transformedProperties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single property
router.get('/:id', async (req, res) => {
  try {
    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready');
    }

    const property = await Property.findById(req.params.id)
      .populate({
        path: 'buildingId',
        model: Building,
        select: '_id name parkingAvailable security'
      })
      .populate({
        path: 'amenities',
        model: Amenity,
        select: 'name'
      });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const transformedProperty = {
      id: property._id,
      title: property.buildingId?.name || '未命名楼宇',
      description: property.description,
      price: property.rent_range || '价格待询',
      location: property.location?.address || '',
      image: property.media?.mainImage || '',
      size: property.area_range || '面积未指定',
      type: property.specifications?.type || '办公空间',
      capacity: property.specifications?.capacity || 0,
      amenities: property.amenities?.map(amenity => amenity.name) || [],
      communication: {
        date: property.communication?.date,
        method: property.communication?.method,
        follow_up_result: property.communication?.follow_up_result
      },
      commission: property.commission ? {
        value: property.commission,
        basis: property.commission_basis,
        verification: property.commission_verification
      } : null,
      notes: property.notes_and_control,
      building: property.buildingId ? {
        id: property.buildingId._id,
        name: property.buildingId.name || '未命名楼宇',
        parkingAvailable: property.buildingId.parkingAvailable,
        security: property.buildingId.security
      } : null
    };

    res.json(transformedProperty);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      details: error.response?.data?.message || 'An unexpected error occurred'
    });
  }
});

// POST new property
router.post('/', async (req, res) => {
  const property = new Property(req.body);
  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
