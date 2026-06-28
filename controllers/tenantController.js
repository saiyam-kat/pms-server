const Tenant = require('../models/Tenant');
const Property = require('../models/Property');

const isOwner = async (propertyId, userId) => {
  const prop = await Property.findOne({ _id: propertyId, ownerId: userId });
  return !!prop;
};

exports.getTenants = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const tenants = await Tenant.find({ propertyId: { $in: propertyIds } });
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addTenant = async (req, res) => {
  try {
    const { propertyId, tenantName, phone, rentAmount, dueDate, joiningDate } = req.body;
    const owner = await isOwner(propertyId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });
    const tenant = await Tenant.create({ propertyId, tenantName, phone, rentAmount, dueDate, joiningDate });
    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ msg: 'Tenant not found' });
    const owner = await isOwner(tenant.propertyId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ msg: 'Tenant not found' });
    const owner = await isOwner(tenant.propertyId, req.user.id);
    if (!owner) return res.status(403).json({ msg: 'Not authorized' });
    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Tenant deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};