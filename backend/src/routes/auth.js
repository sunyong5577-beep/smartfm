/**
 * 인증 라우트
 */
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../utils/auth');

// 인증 엔드포인트 요청 제한 (무차별 대입 공격 방지)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' },
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
