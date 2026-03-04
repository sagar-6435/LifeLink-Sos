const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  category: String,
  dosage: String,
  prices: [{
    shop: String,
    price: Number,
    available: Boolean
  }],
  description: String,
  sideEffects: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);
