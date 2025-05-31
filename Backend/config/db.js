const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URL || 'mongodb://localhost:27017/facetrace';

// Establish connection
mongoose.connect(mongoURI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
