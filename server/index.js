const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb://127.0.0.1:27017/office-plus', {
}).then(() => {
  console.log('Successfully connected to MongoDB');
  console.log('Database name: office-plus');
  console.log('Connection state:', mongoose.connection.readyState);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  console.error('Connection state:', mongoose.connection.readyState);
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Environment variables
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required!');
  process.exit(1);
}

// Import models (in order of dependencies)
require('./models/Facility');
require('./models/Amenity');
require('./models/Building');
require('./models/Property');
require('./models/User');
require('./models/Booking');

// Routes
const propertiesRoutes = require('./routes/properties');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
console.log('Models registered, setting up routes...');
app.use('/api/properties', propertiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
