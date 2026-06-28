const router  = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  getPayments,
  getTenantPayments,
  addPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');

router.get('/',                        protect, getPayments);
router.get('/tenant/:tenantId',        protect, getTenantPayments);
router.post('/',                       protect, addPayment);
router.put('/:id',                     protect, updatePayment);
router.delete('/:id',                  protect, deletePayment);

module.exports = router;