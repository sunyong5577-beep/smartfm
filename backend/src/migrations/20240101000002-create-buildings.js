'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buildings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: false },
      totalFloors: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      totalUnits: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      buildingType: { type: Sequelize.ENUM('상업용', '주거용', '혼합'), allowNull: false, defaultValue: '상업용' },
      constructionYear: { type: Sequelize.INTEGER, allowNull: true },
      totalArea: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('buildings');
  },
};
