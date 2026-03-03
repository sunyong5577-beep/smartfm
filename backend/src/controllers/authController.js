/**
 * 인증 컨트롤러
 */
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return sendError(res, '사용자명, 이메일, 비밀번호는 필수 입력 항목입니다.', 400);
    }
    const user = await authService.register({ username, email, password, role });
    return sendSuccess(res, user, '회원가입이 완료되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, '이메일과 비밀번호를 입력해주세요.', 400);
    }
    const result = await authService.login({ email, password });
    return sendSuccess(res, result, '로그인에 성공했습니다.');
  } catch (err) {
    return sendError(res, err.message, 401);
  }
};

const logout = async (req, res) => {
  // JWT는 stateless이므로 클라이언트 측에서 토큰 삭제
  return sendSuccess(res, null, '로그아웃되었습니다.');
};

const getMe = async (req, res) => {
  try {
    return sendSuccess(res, req.user);
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { register, login, logout, getMe };
