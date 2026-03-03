/**
 * 표준 JSON 응답 헬퍼 유틸리티
 */

/**
 * 성공 응답 전송
 * @param {Object} res - Express 응답 객체
 * @param {*} data - 응답 데이터
 * @param {string} message - 성공 메시지
 * @param {number} statusCode - HTTP 상태 코드 (기본값: 200)
 */
const sendSuccess = (res, data = null, message = '요청이 성공적으로 처리되었습니다.', statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * 에러 응답 전송
 * @param {Object} res - Express 응답 객체
 * @param {string} message - 에러 메시지
 * @param {number} statusCode - HTTP 상태 코드 (기본값: 500)
 * @param {*} errors - 상세 에러 정보 (선택)
 */
const sendError = (res, message = '서버 오류가 발생했습니다.', statusCode = 500, errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * 페이지네이션 응답 전송
 * @param {Object} res - Express 응답 객체
 * @param {Array} rows - 데이터 배열
 * @param {number} count - 전체 개수
 * @param {number} page - 현재 페이지
 * @param {number} limit - 페이지당 항목 수
 */
const sendPaginated = (res, rows, count, page, limit) => {
  return res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(count / limit),
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
