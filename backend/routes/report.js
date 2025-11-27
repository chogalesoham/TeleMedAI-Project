const express = require('express');
const router = express.Router();
const { createReport, getUserReports, getReportById } = require('../controllers/reportController');

// POST /api/reports/create
router.post('/create', createReport);

// GET /api/reports/user/:userId
router.get('/user/:userId', getUserReports);

// GET /api/reports/:id
router.get('/:id', getReportById);

module.exports = router;
