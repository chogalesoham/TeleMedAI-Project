const Report = require('../models/Report');

exports.createReport = async (req, res) => {
    try {
        const {
            userId,
            patientInfo,
            conversationHistory,
            symptoms,
            differentialDiagnoses,
            tests,
            urgency,
            redFlags,
            medications,
            lifestyleAdvice,
            dietPlan,
            followUpRecommendation,
            summary
        } = req.body;

        // Basic validation
        if (!userId || !summary) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields (userId, summary)'
            });
        }

        const newReport = new Report({
            userId,
            patientInfo,
            conversationHistory,
            symptoms,
            differentialDiagnoses,
            tests,
            urgency,
            redFlags,
            medications,
            lifestyleAdvice,
            dietPlan,
            followUpRecommendation,
            summary
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: newReport
        });

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.getUserReports = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const reports = await Report.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {
        console.error('Error fetching user reports:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
