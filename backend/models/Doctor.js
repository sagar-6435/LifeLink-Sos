const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  category: String,
  rating: { type: Number, default: 4.5 },
  available: { type: Boolean, default: true },
  consultationFee: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  experience: Number,
  qualifications: [String],
  createdAt: { type: Date, default: Date.now }
});

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);
