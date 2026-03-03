/**
 * 공지사항(Notice) 모델
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'buildings', key: 'id' },
    comment: '건물 ID (FK, 전체 공지 시 null)',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '제목',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '내용',
  },
  noticeType: {
    type: DataTypes.ENUM('일반', '긴급', '공사'),
    allowNull: false,
    defaultValue: '일반',
    comment: '공지 유형',
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '중요 공지 여부',
  },
  attachmentFile: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '첨부 파일 경로',
  },
}, {
  tableName: 'notices',
  timestamps: true,
});

module.exports = Notice;
