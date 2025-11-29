const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authMiddleware: protect } = require('../middleware/auth');

router.post('/', protect, consultationController.saveConsultation);
router.get('/:id', protect, consultationController.getConsultation);
router.patch('/:id/prescription', protect, consultationController.updatePrescription);

module.exports = router;
