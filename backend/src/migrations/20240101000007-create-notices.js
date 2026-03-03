'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notices', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      buildingId: {
        type: Sequelize.INTEGER, allowNull: true,
        references: { model: 'buildings', key: 'id' },
        onDelete: 'SET NULL',
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      noticeType: { type: Sequelize.ENUM('일반', '긴급', '공사'), allowNull: false, defaultValue: '일반' },
      isImportant: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      attachmentFile: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notices');
  },
};
