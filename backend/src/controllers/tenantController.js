/**
 * 입주자 컨트롤러
 */
const tenantService = require('../services/tenantService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, buildingId, status } = req.query;
    const result = await tenantService.getAll({ page, limit, search, buildingId, status });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const tenant = await tenantService.getById(req.params.id);
    if (!tenant) return sendError(res, '입주자를 찾을 수 없습니다.', 404);
    return sendSuccess(res, tenant);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const tenant = await tenantService.create(req.body);
    return sendSuccess(res, tenant, '입주자가 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const tenant = await tenantService.update(req.params.id, req.body);
    if (!tenant) return sendError(res, '입주자를 찾을 수 없습니다.', 404);
    return sendSuccess(res, tenant, '입주자 정보가 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await tenantService.remove(req.params.id);
    if (!result) return sendError(res, '입주자를 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '입주자가 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove };
