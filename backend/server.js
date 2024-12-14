const app = require('./app');
const mongoose = require('mongoose');
const cors = require('cors');

// Allow all origins for MVP
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
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

  app.get('/', (req, res) => {
    res.send('Hello World');
  });
