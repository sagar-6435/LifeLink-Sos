const express = require('express');
const router = express.Router();
const MedicalReport = require('../models/MedicalReport');

// Get reports by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { type } = req.query;
    let query = { patientId: req.params.patientId };
    
    if (type) {
      query.type = type;
    }
    
    const reports = await MedicalReport.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload new report
router.post('/', async (req, res) => {
  try {
    const report = new MedicalReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    await MedicalReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
