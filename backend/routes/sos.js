const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { location, timestamp } = req.body;

    // In a real application, you would:
    // 1. Send notifications to emergency contacts
    // 2. Alert campus security
    // 3. Store the SOS alert in database
    // 4. Trigger immediate response protocols

    // For MVP, we'll just send a success response
    res.status(200).json({
      message: 'SOS alert received',
      details: {
        user: user.name,
        studentId: user.studentId,
        location,
        timestamp
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process SOS alert' });
  }
});

module.exports = router; 