const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  studentId: String,
  department: String,
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
