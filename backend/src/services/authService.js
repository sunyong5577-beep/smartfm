/**
 * 인증 서비스 - JWT 및 bcrypt 인증
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const register = async ({ username, email, password, role = 'viewer' }) => {
  // 이메일 중복 확인
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('이미 사용 중인 이메일입니다.');

  const usernameExists = await User.findOne({ where: { username } });
  if (usernameExists) throw new Error('이미 사용 중인 사용자명입니다.');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, passwordHash, role });
  return sanitizeUser(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');

  // 마지막 로그인 시각 갱신
  await user.update({ lastLoginAt: new Date() });

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: sanitizeUser(user) };
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

module.exports = { register, login, verifyToken, sanitizeUser };
