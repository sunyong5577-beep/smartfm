/**
 * 데이터베이스 연결 유틸리티 (Sequelize + MariaDB)
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'smartfm',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    dialectModule: require('mysql2'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      underscored: false,
      timestamps: true,
    },
  }
);

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결에 성공했습니다.');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
  }
};

testConnection();

module.exports = sequelize;
