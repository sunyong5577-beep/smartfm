/**
 * 비용(Expense) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Expense = sequelize.define('Expense', {
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
  category: {
    type: DataTypes.ENUM('관리비', '수도', '전기', '가스', '인건비', '수선비', '기타'),
    allowNull: false,
    defaultValue: '기타',
    comment: '비용 카테고리',
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: '금액(원)',
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '지출일',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '내용',
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '결제 방법',
  },
  receiptFile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '영수증 파일 경로',
  },
}, {
  tableName: 'expenses',
  timestamps: true,
});

module.exports = Expense;
