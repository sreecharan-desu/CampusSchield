const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const EmergencyContact = require('../models/EmergencyContact');

// Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Create emergency notification
router.post('/emergency', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const contacts = await EmergencyContact.find({ userId: req.user.userId });
    
    // Create notification for each emergency contact
    const notifications = await Promise.all(contacts.map(contact => {
      return Notification.create({
        userId: contact.userId,
        title: 'Emergency Alert',
        message: `${user.name} has triggered an emergency alert.`,
        type: 'emergency'
      });
    }));

    // You could add SMS/email notifications here

    res.json({ message: 'Emergency contacts notified', notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create emergency notification' });
  }
});

module.exports = router; 