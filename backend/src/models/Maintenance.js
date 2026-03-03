/**
 * 유지보수(Maintenance) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Maintenance = sequelize.define('Maintenance', {
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
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '제목',
  },
  category: {
    type: DataTypes.ENUM('전기', '수도', '소방', '엘리베이터', '냉난방', '기타'),
    allowNull: false,
    defaultValue: '기타',
    comment: '카테고리',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '상세 내용',
  },
  requestDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '요청일',
  },
  completionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: '완료일',
  },
  cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '비용(원)',
  },
  contractor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '시공업체',
  },
  status: {
    type: DataTypes.ENUM('접수', '진행중', '완료', '취소'),
    allowNull: false,
    defaultValue: '접수',
    comment: '상태',
  },
  priority: {
    type: DataTypes.ENUM('긴급', '보통', '낮음'),
    allowNull: false,
    defaultValue: '보통',
    comment: '우선순위',
  },
}, {
  tableName: 'maintenance',
  timestamps: true,
});

module.exports = Maintenance;
