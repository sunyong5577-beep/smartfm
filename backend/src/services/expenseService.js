/**
 * 비용 서비스 - 비즈니스 로직
 */
const { Expense, Building } = require('../models');
const { fn, col } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, buildingId, category, year, month }) => {
  const where = {};
  if (buildingId) where.buildingId = buildingId;
  if (category) where.category = category;
  if (year && month) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0).toISOString().slice(0, 10);
    where.expenseDate = { [Op.gte]: start, [Op.lte]: end };
  } else if (year) {
    where.expenseDate = {
      [Op.gte]: `${year}-01-01`,
      [Op.lte]: `${year}-12-31`,
    };
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Expense.findAndCountAll({
    where,
    include: [{ model: Building, as: 'building', attributes: ['id', 'name'] }],
    limit: parseInt(limit, 10),
    offset,
    order: [['expenseDate', 'DESC']],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  return Expense.findByPk(id, {
    include: [{ model: Building, as: 'building' }],
  });
};

const create = async (data) => {
  return Expense.create(data);
};

const update = async (id, data) => {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  await expense.update(data);
  return expense;
};

const remove = async (id) => {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  await expense.destroy();
  return true;
};

const getMonthlySummary = async (buildingId, year) => {
  const where = buildingId ? { buildingId } : {};
  const summary = await Expense.findAll({
    where,
    attributes: [
      [fn('YEAR', col('expenseDate')), 'year'],
      [fn('MONTH', col('expenseDate')), 'month'],
      [fn('SUM', col('amount')), 'totalAmount'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: [fn('YEAR', col('expenseDate')), fn('MONTH', col('expenseDate'))],
    order: [[fn('YEAR', col('expenseDate')), 'DESC'], [fn('MONTH', col('expenseDate')), 'DESC']],
    raw: true,
  });
  return summary;
};

module.exports = { getAll, getById, create, update, remove, getMonthlySummary };
