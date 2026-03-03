'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      buildingId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'buildings', key: 'id' },
        onDelete: 'CASCADE',
      },
      unitNumber: { type: Sequelize.STRING(20), allowNull: false },
      tenantType: { type: Sequelize.ENUM('개인', '법인'), allowNull: false, defaultValue: '개인' },
      name: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      email: { type: Sequelize.STRING(100), allowNull: true },
      businessNumber: { type: Sequelize.STRING(20), allowNull: true },
      representativeName: { type: Sequelize.STRING(100), allowNull: true },
      moveInDate: { type: Sequelize.DATEONLY, allowNull: true },
      moveOutDate: { type: Sequelize.DATEONLY, allowNull: true },
      status: { type: Sequelize.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('tenants');
  },
};
