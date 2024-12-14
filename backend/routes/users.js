const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update emergency contacts
router.post('/emergency-contacts', auth, async (req, res) => {
  try {
    const { contacts } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.emergencyContacts = contacts;
    await user.save();

    res.json({ 
      message: 'Emergency contacts updated successfully',
      emergencyContacts: user.emergencyContacts 
    });
  } catch (error) {
    console.error('Emergency contacts update error:', error);
    res.status(500).json({ error: 'Failed to update emergency contacts' });
  }
});

module.exports = router; 