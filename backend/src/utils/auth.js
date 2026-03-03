/**
 * JWT 인증 미들웨어
 */
const { verifyToken } = require('../services/authService');
const { sendError } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, '인증 토큰이 필요합니다.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, '유효하지 않은 토큰입니다.', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, '권한이 없습니다.', 403);
  }
  next();
};

module.exports = { authenticate, authorize };
