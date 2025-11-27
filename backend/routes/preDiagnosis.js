const express = require('express');
const router = express.Router();
const { savePreDiagnosis } = require('../controllers/preDiagnosisController');

// POST /api/ai/save-pre-diagnosis
router.post('/save-pre-diagnosis', savePreDiagnosis);

module.exports = router;
