const Property = require('../models/Property');

// GET — sari properties fetch karo (sirf is user ki)
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// POST — nayi property add karo
exports.addProperty = async (req, res) => {
  try {
    const { propertyName, address, propertyType } = req.body;
    const property = await Property.create({
      ownerId: req.user.id,
      propertyName,
      address,
      propertyType
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT — property update karo
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!property) return res.status(404).json({ msg: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE — property delete karo
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id
    });
    if (!property) return res.status(404).json({ msg: 'Property not found' });
    res.json({ msg: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};