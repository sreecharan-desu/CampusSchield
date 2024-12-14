const app = require('./app');
const mongoose = require('mongoose');

// Hardcoded configuration - using MongoDB Atlas
global.JWT_SECRET = 'your-super-secret-jwt-key-here';
const PORT = 5000;
const MONGODB_URI = 'mongodb+srv://srecharandesu:k2L5MzYBaojm1AM6@cluster0.a9berin.mongodb.net/campusscheild';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
