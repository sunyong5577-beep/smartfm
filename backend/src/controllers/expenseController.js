/**
 * 비용 컨트롤러
 */
const expenseService = require('../services/expenseService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, buildingId, category, year, month } = req.query;
    const result = await expenseService.getAll({ page, limit, buildingId, category, year, month });
    return sendPaginated(res, result.rows, result.count, result.page, result.limit);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const expense = await expenseService.getById(req.params.id);
    if (!expense) return sendError(res, '비용 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, expense);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const expense = await expenseService.create(req.body);
    return sendSuccess(res, expense, '비용이 등록되었습니다.', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const expense = await expenseService.update(req.params.id, req.body);
    if (!expense) return sendError(res, '비용 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, expense, '비용 정보가 수정되었습니다.');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await expenseService.remove(req.params.id);
    if (!result) return sendError(res, '비용 항목을 찾을 수 없습니다.', 404);
    return sendSuccess(res, null, '비용 항목이 삭제되었습니다.');
  } catch (err) {
    return sendError(res, err.message);
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const summary = await expenseService.getMonthlySummary(req.query.buildingId, req.query.year);
    return sendSuccess(res, summary);
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove, getMonthlySummary };
