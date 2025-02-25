const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Property = require('./models/Property');

async function importData() {
  try {
    // Read the properties file directly
    console.log('Reading properties file...');
    const propertiesFile = await fs.readFile(path.join(__dirname, '../src/data/properties.js'), 'utf-8');
    
    // Use eval in a controlled way to parse the properties array
    // This is safe here since we're reading our own known file
    const propertiesContent = propertiesFile
      .replace('export const properties =', 'module.exports =')
      .replace(/\r\n/g, '\n');
    
    // Create a temporary file to require
    const tempFile = path.join(__dirname, 'temp-properties.js');
    await fs.writeFile(tempFile, propertiesContent);
    
    // Require the temporary file
    const properties = require('./temp-properties.js');
    
    // Clean up temp file
    await fs.unlink(tempFile);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/office-plus');
    console.log('Connected to MongoDB successfully');

    // Clear existing properties
    console.log('Clearing existing properties...');
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Import new properties
    console.log('Importing properties...');
    const importedProperties = await Property.insertMany(properties);
    console.log(`Successfully imported ${importedProperties.length} properties`);

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    // Clean up temp file if it exists
    try {
      await fs.access(path.join(__dirname, 'temp-properties.js'));
      await fs.unlink(path.join(__dirname, 'temp-properties.js'));
    } catch (e) {
      // File doesn't exist, ignore
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Closed MongoDB connection');
    }
    process.exit();
  }
}

importData();
