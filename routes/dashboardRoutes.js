const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const properties = await Property.find({ ownerId: userId });
    const propertyIds = properties.map(p => p._id);

    const tenants = await Tenant.find({ propertyId: { $in: propertyIds } });
    const tenantIds = tenants.map(t => t._id);

    const payments = await Payment.find({ tenantId: { $in: tenantIds } });

    const collectedRent = payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRent = payments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const overdueRent = payments
      .filter(p => p.status === 'Overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    const openMaintenance = await Maintenance.countDocuments({
      tenantId: { $in: tenantIds },
      status: 'Pending'
    });

    res.json({
      totalProperties: properties.length,
      totalTenants:    tenants.length,
      collectedRent,
      pendingRent,
      overdueRent,
      openMaintenance
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;