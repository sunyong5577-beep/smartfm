/**
 * 계약 컨트롤러
 */
const contractService = require('../services/contractService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, buildingId, tenantId, status, contractType } = req.query;
    const result = await contractService.getAll({ page, limit, buildingId, tenantId, status, contractType });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const contract = await contractService.getById(req.params.id);
    if (!contract) return sendError(res, '계약을 찾을 수 없습니다.', 404);
    return sendSuccess(res, contract);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const contract = await contractService.create(req.body);
    return sendSuccess(res, contract, '계약이 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const contract = await contractService.update(req.params.id, req.body);
    if (!contract) return sendError(res, '계약을 찾을 수 없습니다.', 404);
    return sendSuccess(res, contract, '계약 정보가 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await contractService.remove(req.params.id);
    if (!result) return sendError(res, '계약을 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '계약이 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove };
