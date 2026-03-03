/**
 * Sequelize CLI 설정 (마이그레이션용)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartfm',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    dialectOptions: { charset: 'utf8mb4' },
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_TEST || 'smartfm_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mariadb',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mariadb',
    dialectOptions: { charset: 'utf8mb4' },
    logging: false,
  },
};
