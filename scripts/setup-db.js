/**
 * 데이터베이스 초기 설정 스크립트
 * 사용법: node scripts/setup-db.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'smartfm',
  DB_USER = 'root',
  DB_PASSWORD = '',
} = process.env;

async function setupDatabase() {
  let connection;
  try {
    // root 연결 (데이터베이스 없이)
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('✅ MariaDB 연결 성공');

    // 데이터베이스 생성
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ 데이터베이스 '${DB_NAME}' 생성(또는 이미 존재) 완료`);

    await connection.execute(`USE \`${DB_NAME}\``);

    console.log('\n✅ 데이터베이스 설정 완료!');
    console.log(`\n다음 명령어로 마이그레이션을 실행하세요:`);
    console.log('  cd backend && npx sequelize-cli db:migrate');
  } catch (err) {
    console.error('❌ 데이터베이스 설정 실패:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
