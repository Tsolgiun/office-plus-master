const mongoose = require('mongoose');
const Property = require('./models/Property');
const Building = require('./models/Building');
const Amenity = require('./models/Amenity');
const Facility = require('./models/Facility');
const User = require('./models/User');
const Booking = require('./models/Booking');

// Sample data
const amenitiesData = [
  {
    name: 'High-speed Internet',
    category: 'technology',
    icon: 'wifi',
    description: 'Enterprise-grade fiber optic internet connection'
  },
  {
    name: '24/7 Access',
    category: 'security',
    icon: 'clock',
    description: 'Secure around-the-clock building access'
  },
  {
    name: 'Meeting Room',
    category: 'facility',
    icon: 'users',
    description: 'Professional meeting spaces'
  },
  {
    name: 'Reception Service',
    category: 'service',
    icon: 'concierge-bell',
    description: 'Professional reception and guest management'
  },
  {
    name: 'Parking',
    category: 'facility',
    icon: 'parking',
    description: 'Secure on-site parking'
  },
  {
    name: 'Kitchen',
    category: 'comfort',
    icon: 'utensils',
    description: 'Fully equipped kitchen facilities'
  }
];

const buildingsData = [
  {
    name: 'Downtown Business Center',
    address: {
      street: '123 Business District',
      city: 'San Francisco',
      district: 'Financial District',
      zipCode: '94111',
      coordinates: {
        latitude: 37.7937,
        longitude: -122.3965
      }
    },
    yearBuilt: 2015,
    totalFloors: 20,
    parkingAvailable: true,
    security: {
      type: '24/7',
      hours: '24/7'
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
    ],
    description: 'Premium downtown business center with state-of-the-art facilities',
    status: 'active'
  },
  {
    name: 'Tech Hub Tower',
    address: {
      street: '456 Innovation Avenue',
      city: 'San Francisco',
      district: 'SoMa',
      zipCode: '94103',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    yearBuilt: 2018,
    totalFloors: 15,
    parkingAvailable: true,
    security: {
      type: '24/7',
      hours: '24/7'
    },
    images: [
      'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24'
    ],
    description: 'Modern tech-focused office building in the heart of SoMa',
    status: 'active'
  }
];

const facilitiesData = [
  {
    name: 'Grand Conference Room',
    type: 'conference-room',
    description: 'Large conference room with video conferencing capabilities',
    capacity: 20,
    bookingRequired: true,
    availability: {
      schedule: 'business-hours',
      customHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' }
      }
    },
    pricing: {
      type: 'paid',
      rate: {
        amount: 50,
        period: 'hour'
      }
    },
    metadata: {
      floor: 1,
      size: {
        value: 400,
        unit: 'sq.ft'
      },
      maxDuration: 4
    },
    status: 'active'
  },
  {
    name: 'Executive Lounge',
    type: 'lounge',
    description: 'Exclusive lounge area for relaxation and informal meetings',
    capacity: 30,
    bookingRequired: false,
    availability: {
      schedule: 'business-hours'
    },
    pricing: {
      type: 'membership'
    },
    metadata: {
      floor: 20,
      size: {
        value: 600,
        unit: 'sq.ft'
      }
    },
    status: 'active'
  },
  {
    name: 'Innovation Lab',
    type: 'event-space',
    description: 'Flexible space for workshops and innovation sessions',
    capacity: 40,
    bookingRequired: true,
    availability: {
      schedule: 'business-hours'
    },
    pricing: {
      type: 'paid',
      rate: {
        amount: 100,
        period: 'hour'
      }
    },
    metadata: {
      floor: 2,
      size: {
        value: 800,
        unit: 'sq.ft'
      },
      maxDuration: 8
    },
    status: 'active'
  }
];

const usersData = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890'
    },
    status: 'active'
  },
  {
    email: 'agent@example.com',
    password: 'agent123',
    role: 'agent',
    profile: {
      firstName: 'Agent',
      lastName: 'Smith',
      phone: '+1234567891',
      company: 'Property Plus'
    },
    status: 'active'
  }
];

// Helper function to clear all collections
const clearCollections = async () => {
  console.log('Clearing existing data...');
  await Promise.all([
    Amenity.deleteMany({}),
    Building.deleteMany({}),
    Property.deleteMany({}),
    User.deleteMany({}),
    Facility.deleteMany({}),
    Booking.deleteMany({})
  ]);
};

// Connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/office-plus', mongooseOptions);
        console.log('Connected to MongoDB');
        break;
      } catch (err) {
        console.log(`Connection attempt failed. Retries left: ${retries - 1}`);
        retries--;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }

    // Clear existing data with error handling
    await clearCollections();

    // 1. Create Amenities
    console.log('Creating amenities...');
    const amenities = await Amenity.create(amenitiesData);
    const amenityMap = amenities.reduce((map, amenity) => {
      map[amenity.name] = amenity._id;
      return map;
    }, {});

    // 2. Create Buildings
    console.log('Creating buildings...');
    const buildings = await Building.create(buildingsData.map(building => ({
      ...building,
      buildingAmenities: [
        amenityMap['24/7 Access'],
        amenityMap['Reception Service'],
        amenityMap['Parking']
      ]
    })));

    // 3. Create Users
    console.log('Creating users...');
    await User.create(usersData);

    // 4. Create Facilities
    console.log('Creating facilities...');
    const facilitiesWithAmenities = facilitiesData.map(facility => ({
      ...facility,
      amenities: [
        amenityMap['High-speed Internet'],
        amenityMap['Meeting Room']
      ]
    }));
    
    const facilities = await Facility.create(facilitiesWithAmenities);

    // Assign facilities to buildings
    await Promise.all(buildings.map(async (building, index) => {
      const buildingFacilities = facilities.slice(index % facilities.length);
      await Building.findByIdAndUpdate(building._id, {
        facilities: buildingFacilities.map(f => f._id)
      });
    }));

    // 5. Create Properties (using existing data from properties.js)
    console.log('Creating properties...');
    const { properties: existingProperties } = require('../src/data/properties');
    
    const propertiesToCreate = existingProperties.map((prop, index) => {
      const building = buildings[index % buildings.length];
      return {
        title: prop.title,
        description: prop.title,
        price: {
          amount: parseInt(prop.price.replace(/[^0-9]/g, '')),
          currency: 'USD',
          period: 'monthly'
        },
        location: {
          address: prop.location,
          city: building.address.city,
          district: building.address.district,
          zipCode: building.address.zipCode
        },
        specifications: {
          size: {
            value: parseInt(prop.size),
            unit: 'sq.ft'
          },
          capacity: prop.capacity,
          type: prop.type,
          floor: Math.floor(Math.random() * building.totalFloors) + 1
        },
        amenities: prop.amenities.map(amenityName => {
          const matchedAmenity = amenities.find(a => 
            a.name.toLowerCase().includes(amenityName.toLowerCase())
          );
          return matchedAmenity ? matchedAmenity._id : amenities[0]._id;
        }),
        media: {
          mainImage: prop.image,
          images: [prop.image]
        },
        availability: {
          status: prop.availability.toLowerCase().includes('immediate') ? 'immediate' : 'from-date',
          availableFrom: prop.availability.toLowerCase().includes('immediate') 
            ? new Date() 
            : (() => {
                // Parse date strings like "From March 1st" or "From April 15th"
                const dateStr = prop.availability.replace('From ', '');
                const months = {
                  'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                  'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
                };
                const match = dateStr.match(/(\w+)\s+(\d+)/);
                if (match) {
                  const month = months[match[1]];
                  const day = parseInt(match[2]);
                  const year = new Date().getFullYear();
                  return new Date(year, month, day);
                }
                return new Date(); // Fallback to current date if parsing fails
              })(),
          minimumLeaseTerm: 1
        },
        buildingId: building._id,
        status: 'active'
      };
    });

    await Property.create(propertiesToCreate);

    console.log('Database seeding completed successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB. Please check if:');
      console.error('1. MongoDB is running');
      console.error('2. MongoDB is accessible at mongodb://127.0.0.1:27017');
      console.error('3. No firewall is blocking the connection');
    }
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
  }
  process.exit(0);
});

// Run the seeding function
seedDatabase();
