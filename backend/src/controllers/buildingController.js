/**
 * 건물 컨트롤러
 */
const buildingService = require('../services/buildingService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, buildingType } = req.query;
    const result = await buildingService.getAll({ page, limit, search, status, buildingType });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const building = await buildingService.getById(req.params.id);
    if (!building) return sendError(res, '건물을 찾을 수 없습니다.', 404);
    return sendSuccess(res, building);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const building = await buildingService.create(req.body);
    return sendSuccess(res, building, '건물이 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const building = await buildingService.update(req.params.id, req.body);
    if (!building) return sendError(res, '건물을 찾을 수 없습니다.', 404);
    return sendSuccess(res, building, '건물 정보가 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await buildingService.remove(req.params.id);
    if (!result) return sendError(res, '건물을 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '건물이 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await buildingService.getStats();
    return sendSuccess(res, stats);
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove, getStats };
