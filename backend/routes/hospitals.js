const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// Get nearby hospitals
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    
    let hospitals;
    if (lat && lng) {
      hospitals = await Hospital.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: radius * 1000
          }
        }
      });
    } else {
      hospitals = await Hospital.find();
    }
    
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blood bank inventory
router.patch('/:id/blood-bank', async (req, res) => {
  try {
    const { bloodBank } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { bloodBank },
      { new: true }
    );
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
