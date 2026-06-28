const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  tenantId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);