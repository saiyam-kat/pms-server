const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  propertyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenantName:  { type: String, required: true },
  phone:       { type: String, required: true },
  rentAmount:  { type: Number, required: true },
  dueDate:     { type: Number, required: true },
  joiningDate: { type: Date,   required: true }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);