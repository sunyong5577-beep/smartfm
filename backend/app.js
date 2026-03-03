/**
 * 스마트 빌딩 관리 시스템 - Express 메인 서버
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// 미들웨어 설정
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 정적 파일 제공 (업로드 파일)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// 라우트 설정
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/buildings', require('./src/routes/buildings'));
app.use('/api/tenants', require('./src/routes/tenants'));
app.use('/api/contracts', require('./src/routes/contracts'));
app.use('/api/maintenance', require('./src/routes/maintenance'));
app.use('/api/expenses', require('./src/routes/expenses'));
app.use('/api/notices', require('./src/routes/notices'));

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '서버가 정상 동작 중입니다.' });
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ success: false, message: '요청한 리소스를 찾을 수 없습니다.' });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다.',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;
