const Maintenance = require('../models/Maintenance');
const Tenant      = require('../models/Tenant');
const Property    = require('../models/Property');

const isTenantOwner = async (tenantId, userId) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) return false;
  const property = await Property.findOne({
    _id: tenant.propertyId,
    ownerId: userId
  });
  return !!property;
};

exports.getMaintenance = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const tenants = await Tenant.find({ propertyId: { $in: propertyIds } }).select('_id');
    const tenantIds = tenants.map(t => t._id);

    const issues = await Maintenance.find({ tenantId: { $in: tenantIds } })
      .populate('tenantId', 'tenantName')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addMaintenance = async (req, res) => {
  try {
    const { tenantId, title, description } = req.body;

    const owner = await isTenantOwner(tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    const issue = await Maintenance.create({
      tenantId,
      title,
      description,
      status: 'Pending'
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    const owner = await isTenantOwner(issue.tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    const updated = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    const owner = await isTenantOwner(issue.tenantId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });

    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};