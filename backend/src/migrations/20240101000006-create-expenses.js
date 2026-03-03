'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      buildingId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'buildings', key: 'id' },
        onDelete: 'CASCADE',
      },
      category: {
        type: Sequelize.ENUM('관리비', '수도', '전기', '가스', '인건비', '수선비', '기타'),
        allowNull: false, defaultValue: '기타',
      },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      expenseDate: { type: Sequelize.DATEONLY, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      paymentMethod: { type: Sequelize.STRING(50), allowNull: true },
      receiptFile: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('expenses');
  },
};
