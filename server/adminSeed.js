const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/office-plus');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@officeplus.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@officeplus.com',
      password: 'Admin123!@#',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      },
      status: 'active'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
