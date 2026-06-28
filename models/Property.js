const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyName: { type: String, required: true },
  address:      { type: String, required: true },
  propertyType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);