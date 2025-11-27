const PreDiagnosis = require('../models/PreDiagnosis');

exports.savePreDiagnosis = async (req, res) => {
    try {
        const {
            userId,
            patientInfo,
            initialProblem,
            conversationHistory,
            allEntities,
            finalSummary
        } = req.body;

        // Validate required fields
        if (!userId || !finalSummary) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const newPreDiagnosis = new PreDiagnosis({
            userId,
            patientInfo,
            initialProblem,
            conversationHistory,
            allEntities,
            finalSummary
        });

        await newPreDiagnosis.save();

        res.status(201).json({
            success: true,
            message: 'Pre-diagnosis data saved successfully',
            data: newPreDiagnosis
        });

    } catch (error) {
        console.error('Error saving pre-diagnosis:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
