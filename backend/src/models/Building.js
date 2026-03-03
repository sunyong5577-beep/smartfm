/**
 * 건물(Building) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '건물명',
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '주소',
  },
  totalFloors: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '총 층수',
  },
  totalUnits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '총 호실 수',
  },
  buildingType: {
    type: DataTypes.ENUM('상업용', '주거용', '혼합'),
    allowNull: false,
    defaultValue: '상업용',
    comment: '건물 유형',
  },
  constructionYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '건축 연도',
  },
  totalArea: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '총 면적(㎡)',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '설명',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
    comment: '상태',
  },
}, {
  tableName: 'buildings',
  timestamps: true,
});

module.exports = Building;
