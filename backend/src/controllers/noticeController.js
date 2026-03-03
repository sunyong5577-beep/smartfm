/**
 * 공지사항 컨트롤러
 */
const noticeService = require('../services/noticeService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, buildingId, noticeType, isImportant } = req.query;
    const result = await noticeService.getAll({ page, limit, buildingId, noticeType, isImportant });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const notice = await noticeService.getById(req.params.id);
    if (!notice) return sendError(res, '공지사항을 찾을 수 없습니다.', 404);
    return sendSuccess(res, notice);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const notice = await noticeService.create(req.body);
    return sendSuccess(res, notice, '공지사항이 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const notice = await noticeService.update(req.params.id, req.body);
    if (!notice) return sendError(res, '공지사항을 찾을 수 없습니다.', 404);
    return sendSuccess(res, notice, '공지사항이 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await noticeService.remove(req.params.id);
    if (!result) return sendError(res, '공지사항을 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '공지사항이 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove };
