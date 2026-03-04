const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  facility: String,
  type: { type: String, enum: ['lab', 'imaging', 'prescription', 'other'], default: 'other' },
  status: { type: String, enum: ['normal', 'review', 'critical'], default: 'normal' },
  fileUrl: String,
  fileSize: String,
  aiAnalysis: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
