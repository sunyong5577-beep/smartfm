/**
 * 건물 API 테스트
 */
const request = require('supertest');
const app = require('../app');

// 테스트용 JWT 토큰 (실제 테스트 시 유효한 토큰 필요)
const mockToken = 'Bearer test_token';

describe('건물 API 테스트', () => {
  describe('GET /api/buildings', () => {
    it('인증 없이 접근 시 401 반환', async () => {
      const res = await request(app).get('/api/buildings');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/health', () => {
    it('헬스 체크 성공', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/auth/register', () => {
    it('필수 필드 누락 시 400 반환', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('잘못된 자격 증명으로 로그인 시 401 반환', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexist@test.com', password: 'wrongpass' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('필수 필드 누락 시 400 반환', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.status).toBe(400);
    });
  });
});
