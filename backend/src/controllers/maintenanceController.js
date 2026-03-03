/**
 * 유지보수 컨트롤러
 */
const maintenanceService = require('../services/maintenanceService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, buildingId, status, category, priority } = req.query;
    const result = await maintenanceService.getAll({ page, limit, buildingId, status, category, priority });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const item = await maintenanceService.getById(req.params.id);
    if (!item) return sendError(res, '유지보수 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, item);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const item = await maintenanceService.create(req.body);
    return sendSuccess(res, item, '유지보수 요청이 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const item = await maintenanceService.update(req.params.id, req.body);
    if (!item) return sendError(res, '유지보수 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, item, '유지보수 정보가 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await maintenanceService.remove(req.params.id);
    if (!result) return sendError(res, '유지보수 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '유지보수 항목이 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await maintenanceService.getStatsByCategory(req.query.buildingId);
    return sendSuccess(res, stats);
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove, getStats };
