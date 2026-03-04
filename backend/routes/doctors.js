const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, lat, lng, radius = 5 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }
    
    let doctors;
    if (lat && lng) {
      doctors = await Doctor.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: radius * 1000
          }
        }
      });
    } else {
      doctors = await Doctor.find(query);
    }
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update doctor availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const { available } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true }
    );
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
