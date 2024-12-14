const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const EmergencyContact = require('../models/EmergencyContact');

// Get all emergency contacts for the user
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user.userId });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ error: 'Failed to fetch emergency contacts' });
  }
});

// Add a new emergency contact
router.post('/', auth, async (req, res) => {
  try {
    const contact = new EmergencyContact({
      ...req.body,
      userId: req.user.userId
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ error: 'Failed to add emergency contact' });
  }
});

// Delete an emergency contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ error: 'Failed to delete emergency contact' });
  }
});

module.exports = router; 