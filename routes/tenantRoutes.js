const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  getTenants,
  addTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantController');

router.get('/',       protect, getTenants);
router.post('/',      protect, addTenant);
router.put('/:id',    protect, updateTenant);
router.delete('/:id', protect, deleteTenant);

module.exports = router;