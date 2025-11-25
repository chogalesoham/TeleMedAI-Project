const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    documentType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    notes: { type: String },
    uploadedAt: { type: Date, required: true },
    analysis: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);