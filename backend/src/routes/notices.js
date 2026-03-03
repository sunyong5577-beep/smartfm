/**
 * 공지사항 라우트
 */
const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authenticate } = require('../utils/auth');

router.use(authenticate);

router.get('/', noticeController.getAll);
router.get('/:id', noticeController.getById);
router.post('/', noticeController.create);
router.put('/:id', noticeController.update);
router.delete('/:id', noticeController.remove);

module.exports = router;
