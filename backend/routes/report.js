const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// POST /api/reports - Save one report for a user
// POST /api/reports - Save one report for a user (userId must be present)
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/reports/user/:userId - List all reports for a user
// GET /api/reports/user/:userId - List all reports for a user (only that user's reports)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/reports/:id - Get single report
// GET /api/reports/:id?userId=xxx - Get single report only if it belongs to user
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const report = await Report.findOne({ _id: req.params.id, userId });
    if (!report) return res.status(404).json({ error: 'Report not found or access denied' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
