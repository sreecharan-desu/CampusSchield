const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
// require('dotenv').config();

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://srecharandesu:k2L5MzYBaojm1AM6@cluster0.a9berin.mongodb.net/campusscheild';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for admin creation'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'sreecharan309@gmail.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('1234567890', 10);

    // Create admin user
    const admin = new Admin({
      email: 'sreecharan309@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      department: 'Administration'
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdminUser(); 