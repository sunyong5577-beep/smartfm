/**
 * 입주자(Tenant) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'buildings', key: 'id' },
    comment: '건물 ID (FK)',
  },
  unitNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '호실 번호',
  },
  tenantType: {
    type: DataTypes.ENUM('개인', '법인'),
    allowNull: false,
    defaultValue: '개인',
    comment: '입주자 유형',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '이름 / 법인명',
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '연락처',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '이메일',
  },
  businessNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '사업자등록번호 (법인)',
  },
  representativeName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '대표자명 (법인)',
  },
  moveInDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: '입주일',
  },
  moveOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: '퇴실일',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
    comment: '상태',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '비고',
  },
}, {
  tableName: 'tenants',
  timestamps: true,
});

module.exports = Tenant;
