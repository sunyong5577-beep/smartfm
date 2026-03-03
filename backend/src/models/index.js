/**
 * Sequelize 모델 로더 및 연관 관계 설정
 */
const sequelize = require('../utils/database');

const Building = require('./Building');
const Tenant = require('./Tenant');
const Contract = require('./Contract');
const Maintenance = require('./Maintenance');
const Expense = require('./Expense');
const Notice = require('./Notice');
const User = require('./User');

// 연관 관계 정의
// 건물 - 입주자 (1:N)
Building.hasMany(Tenant, { foreignKey: 'buildingId', as: 'tenants', onDelete: 'CASCADE' });
Tenant.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

// 건물 - 계약 (1:N)
Building.hasMany(Contract, { foreignKey: 'buildingId', as: 'contracts', onDelete: 'CASCADE' });
Contract.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

// 입주자 - 계약 (1:N)
Tenant.hasMany(Contract, { foreignKey: 'tenantId', as: 'contracts', onDelete: 'CASCADE' });
Contract.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// 건물 - 유지보수 (1:N)
Building.hasMany(Maintenance, { foreignKey: 'buildingId', as: 'maintenanceList', onDelete: 'CASCADE' });
Maintenance.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

// 건물 - 비용 (1:N)
Building.hasMany(Expense, { foreignKey: 'buildingId', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

// 건물 - 공지사항 (1:N, nullable)
Building.hasMany(Notice, { foreignKey: 'buildingId', as: 'notices', onDelete: 'SET NULL' });
Notice.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

module.exports = {
  sequelize,
  Building,
  Tenant,
  Contract,
  Maintenance,
  Expense,
  Notice,
  User,
};
