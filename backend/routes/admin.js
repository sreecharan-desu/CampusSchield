const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Report = require('../models/Report');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Use the JWT_SECRET from server.js
    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      'your-super-secret-jwt-key-here',
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        department: admin.department
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all reports (admin only)
router.get('/reports', auth, async (req, res) => {
  try {
    // Check if token exists and is valid
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const admin = await Admin.findById(req.user.userId);
    if (!admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const reports = await Report.find()
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update report status (admin only)
router.patch('/reports/:id/status', auth, async (req, res) => {
  try {
    // Check if token exists and is valid
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const admin = await Admin.findById(req.user.userId);
    if (!admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(report);
  } catch (error) {
    console.error('Failed to update report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

module.exports = router; 