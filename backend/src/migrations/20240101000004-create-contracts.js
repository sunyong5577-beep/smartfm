'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tenantId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onDelete: 'CASCADE',
      },
      buildingId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'buildings', key: 'id' },
        onDelete: 'CASCADE',
      },
      contractType: { type: Sequelize.ENUM('임대', '전세', '월세'), allowNull: false, defaultValue: '월세' },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY, allowNull: false },
      depositAmount: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      monthlyRent: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      managementFee: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      contractFile: { type: Sequelize.STRING(255), allowNull: true },
      status: { type: Sequelize.ENUM('active', 'expired', 'terminated'), allowNull: false, defaultValue: 'active' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('contracts');
  },
};
