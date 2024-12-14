const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');

// Get all reports for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Create a new report
router.post('/', auth, async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      userId: req.user.userId,
      status: 'pending'
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Get a specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.exports = router; 