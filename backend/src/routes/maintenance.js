/**
 * 유지보수 라우트
 */
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticate } = require('../utils/auth');

router.use(authenticate);

router.get('/stats', maintenanceController.getStats);
router.get('/', maintenanceController.getAll);
router.get('/:id', maintenanceController.getById);
router.post('/', maintenanceController.create);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

module.exports = router;
