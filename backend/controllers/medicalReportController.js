const MedicalReport = require('../models/MedicalReport');

/**
 * Create a new medical report
 * POST /api/medical-reports
 */
exports.createMedicalReport = async (req, res) => {
    try {
        const {
            userId,
            fileName,
            fileType,
            fileSize,
            documentType,
            notes,
            uploadedAt,
            analysis
        } = req.body;

        // Validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!fileName) {
            return res.status(400).json({
                success: false,
                message: 'File name is required'
            });
        }

        if (!analysis || !analysis.summary) {
            return res.status(400).json({
                success: false,
                message: 'Analysis with summary is required'
            });
        }

        // Create new medical report
        const newReport = new MedicalReport({
            userId,
            reportMeta: {
                fileName,
                fileType,
                fileSize,
                documentType: documentType || 'other',
                notes,
                uploadedAt: uploadedAt || new Date().toISOString()
            },
            analysis: {
                report_type: analysis.report_type || 'General Report',
                findings: analysis.findings || [],
                summary: analysis.summary,
                recommendations: analysis.recommendations || [],
                concerns: analysis.concerns || [],
                disclaimer: analysis.disclaimer || ''
            },
            status: 'analyzed'
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: 'Medical report saved successfully',
            data: newReport
        });

    } catch (error) {
        console.error('Error creating medical report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save medical report',
            error: error.message
        });
    }
};

/**
 * Get all medical reports for a user
 * GET /api/medical-reports/user/:userId
 */
exports.getUserMedicalReports = async (req, res) => {
    try {
        const { userId } = req.params;
        const { documentType, limit = 50, skip = 0, includeArchived = false } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Build query
        const query = { userId };

        if (documentType) {
            query['reportMeta.documentType'] = documentType;
        }

        if (!includeArchived || includeArchived === 'false') {
            query.isArchived = false;
        }

        const reports = await MedicalReport.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .lean();

        const total = await MedicalReport.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reports.length,
            total,
            data: reports
        });

    } catch (error) {
        console.error('Error fetching user medical reports:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medical reports',
            error: error.message
        });
    }
};

/**
 * Get a single medical report by ID
 * GET /api/medical-reports/:id
 */
exports.getMedicalReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await MedicalReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Medical report not found'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('Error fetching medical report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medical report',
            error: error.message
        });
    }
};

/**
 * Update a medical report
 * PUT /api/medical-reports/:id
 */
exports.updateMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating userId
        delete updates.userId;

        const report = await MedicalReport.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Medical report not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Medical report updated successfully',
            data: report
        });

    } catch (error) {
        console.error('Error updating medical report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update medical report',
            error: error.message
        });
    }
};

/**
 * Delete a medical report
 * DELETE /api/medical-reports/:id
 */
exports.deleteMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await MedicalReport.findByIdAndDelete(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Medical report not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Medical report deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting medical report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete medical report',
            error: error.message
        });
    }
};

/**
 * Archive/Unarchive a medical report
 * PATCH /api/medical-reports/:id/archive
 */
exports.toggleArchiveMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { isArchived } = req.body;

        const report = await MedicalReport.findByIdAndUpdate(
            id,
            { $set: { isArchived: isArchived !== undefined ? isArchived : true } },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Medical report not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Medical report ${report.isArchived ? 'archived' : 'unarchived'} successfully`,
            data: report
        });

    } catch (error) {
        console.error('Error archiving medical report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to archive medical report',
            error: error.message
        });
    }
};

/**
 * Get report statistics for a user
 * GET /api/medical-reports/user/:userId/stats
 */
exports.getUserReportStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const stats = await MedicalReport.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$reportMeta.documentType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await MedicalReport.countDocuments({ userId });
        const archived = await MedicalReport.countDocuments({ userId, isArchived: true });

        res.status(200).json({
            success: true,
            data: {
                total,
                archived,
                active: total - archived,
                byType: stats
            }
        });

    } catch (error) {
        console.error('Error fetching report stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report statistics',
            error: error.message
        });
    }
};
