const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  tenantId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount:      { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  month:       { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);