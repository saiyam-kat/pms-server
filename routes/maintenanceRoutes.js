const router  = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  getMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');

router.get('/',      protect, getMaintenance);
router.post('/',     protect, addMaintenance);
router.put('/:id',   protect, updateMaintenance);
router.delete('/:id',protect, deleteMaintenance);

module.exports = router;