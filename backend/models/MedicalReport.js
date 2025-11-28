const mongoose = require('mongoose');

const MedicalReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reportMeta: {
        fileName: {
            type: String,
            required: true
        },
        fileType: String,
        fileSize: Number,
        documentType: {
            type: String,
            enum: ['lab-report', 'prescription', 'imaging', 'consultation', 'other'],
            default: 'other'
        },
        notes: String,
        uploadedAt: {
            type: String,
            default: () => new Date().toISOString()
        }
    },
    analysis: {
        report_type: String,
        findings: [{
            parameter: String,
            value: String,
            normal_range: String,
            status: {
                type: String,
                enum: ['Normal', 'High', 'Low', 'Critical', 'Unknown'],
                default: 'Unknown'
            }
        }],
        summary: {
            type: String,
            required: true
        },
        recommendations: [String],
        concerns: [String],
        disclaimer: String
    },
    status: {
        type: String,
        enum: ['uploaded', 'analyzed', 'reviewed', 'archived'],
        default: 'analyzed'
    },
    tags: [String],
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
MedicalReportSchema.index({ userId: 1, createdAt: -1 });
MedicalReportSchema.index({ 'reportMeta.documentType': 1 });

// Virtual for report name (alias)
MedicalReportSchema.virtual('reportName').get(function () {
    return this.reportMeta?.fileName || 'Untitled Report';
});

// Virtual for summary (alias)
MedicalReportSchema.virtual('reportSummary').get(function () {
    return this.analysis?.summary || 'No summary available';
});

// Ensure virtuals are included in JSON
MedicalReportSchema.set('toJSON', { virtuals: true });
MedicalReportSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MedicalReport', MedicalReportSchema);
