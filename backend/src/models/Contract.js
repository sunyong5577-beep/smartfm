/**
 * 계약(Contract) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
    comment: '입주자 ID (FK)',
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'buildings', key: 'id' },
    comment: '건물 ID (FK)',
  },
  contractType: {
    type: DataTypes.ENUM('임대', '전세', '월세'),
    allowNull: false,
    defaultValue: '월세',
    comment: '계약 유형',
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '계약 시작일',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '계약 종료일',
  },
  depositAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '보증금(원)',
  },
  monthlyRent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '월세(원)',
  },
  managementFee: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '관리비(원)',
  },
  contractFile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '계약서 파일 경로',
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'terminated'),
    allowNull: false,
    defaultValue: 'active',
    comment: '계약 상태',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '비고',
  },
}, {
  tableName: 'contracts',
  timestamps: true,
});

module.exports = Contract;
