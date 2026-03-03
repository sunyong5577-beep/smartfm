'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('maintenance', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      buildingId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'buildings', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      category: {
        type: Sequelize.ENUM('전기', '수도', '소방', '엘리베이터', '냉난방', '기타'),
        allowNull: false, defaultValue: '기타',
      },
      description: { type: Sequelize.TEXT, allowNull: true },
      requestDate: { type: Sequelize.DATEONLY, allowNull: false },
      completionDate: { type: Sequelize.DATEONLY, allowNull: true },
      cost: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      contractor: { type: Sequelize.STRING(100), allowNull: true },
      status: { type: Sequelize.ENUM('접수', '진행중', '완료', '취소'), allowNull: false, defaultValue: '접수' },
      priority: { type: Sequelize.ENUM('긴급', '보통', '낮음'), allowNull: false, defaultValue: '보통' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('maintenance');
  },
};
