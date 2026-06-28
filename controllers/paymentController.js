const Payment  = require('../models/Payment');
const Tenant   = require('../models/Tenant');
const Property = require('../models/Property');

// Verify karo ki tenant is user ka hai
const isTenantOwner = async (tenantId, userId) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) return false;
  const property = await Property.findOne({
    _id: tenant.propertyId,
    ownerId: userId
  });
  return !!property;
};

// GET — is user ke sab payments
exports.getPayments = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const tenants = await Tenant.find({ propertyId: { $in: propertyIds } }).select('_id');
    const tenantIds = tenants.map(t => t._id);

    const payments = await Payment.find({ tenantId: { $in: tenantIds } })
      .populate('tenantId', 'tenantName rentAmount')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET — ek tenant ke payments
exports.getTenantPayments = async (req, res) => {
  try {
    const owner = await isTenantOwner(req.params.tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    const payments = await Payment.find({ tenantId: req.params.tenantId })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST — payment add karo
exports.addPayment = async (req, res) => {
  try {
    const { tenantId, amount, status, month } = req.body;

    // Security — verify ownership
    const owner = await isTenantOwner(tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    // Amount negative nahi hona chahiye
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    const payment = await Payment.create({
      tenantId,
      amount,
      status,
      month,
      paymentDate: new Date()
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT — payment status update karo
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });

    // Security — verify ownership
    const owner = await isTenantOwner(payment.tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE — payment delete karo
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });

    const owner = await isTenantOwner(payment.tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};