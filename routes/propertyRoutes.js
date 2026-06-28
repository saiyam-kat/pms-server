const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');


// protect ← yeh authMiddleware hai, har route ke pehle lagega
router.get('/',     protect, getProperties);
router.post('/',    protect, addProperty);
router.put('/:id',  protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;