/**
 * 건물 라우트
 */
const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const { authenticate } = require('../utils/auth');

router.use(authenticate);

router.get('/stats', buildingController.getStats);
router.get('/', buildingController.getAll);
router.get('/:id', buildingController.getById);
router.post('/', buildingController.create);
router.put('/:id', buildingController.update);
router.delete('/:id', buildingController.remove);

module.exports = router;
