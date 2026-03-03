/**
 * 계약 라우트
 */
const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authenticate } = require('../utils/auth');

router.use(authenticate);

router.get('/', contractController.getAll);
router.get('/:id', contractController.getById);
router.post('/', contractController.create);
router.put('/:id', contractController.update);
router.delete('/:id', contractController.remove);

module.exports = router;
