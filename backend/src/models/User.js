/**
 * 사용자(User) 모델 - 인증용
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '사용자명',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '이메일',
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '비밀번호 해시',
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer',
    comment: '권한 역할',
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '최종 로그인 시각',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: '활성 여부',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
