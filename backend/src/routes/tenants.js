/**
 * 입주자 라우트
 */
const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const { authenticate } = require('../utils/auth');

router.use(authenticate);

router.get('/', tenantController.getAll);
router.get('/:id', tenantController.getById);
router.post('/', tenantController.create);
router.put('/:id', tenantController.update);
router.delete('/:id', tenantController.remove);

module.exports = router;
