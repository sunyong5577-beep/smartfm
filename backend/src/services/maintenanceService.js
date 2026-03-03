/**
 * 유지보수 서비스 - 비즈니스 로직
 */
const { Maintenance, Building } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, buildingId, status, category, priority }) => {
  const where = {};
  if (buildingId) where.buildingId = buildingId;
  if (status) where.status = status;
  if (category) where.category = category;
  if (priority) where.priority = priority;

  const offset = (page - 1) * limit;
  const { count, rows } = await Maintenance.findAndCountAll({
    where,
    include: [{ model: Building, as: 'building', attributes: ['id', 'name'] }],
    limit: parseInt(limit, 10),
    offset,
    order: [
      [literal(`FIELD(priority, '긴급', '보통', '낮음')`)],
      ['requestDate', 'DESC'],
    ],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  return Maintenance.findByPk(id, {
    include: [{ model: Building, as: 'building' }],
  });
};

const create = async (data) => {
  return Maintenance.create(data);
};

const update = async (id, data) => {
  const item = await Maintenance.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

const remove = async (id) => {
  const item = await Maintenance.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return true;
};

const getStatsByCategory = async (buildingId) => {
  const where = buildingId ? { buildingId } : {};
  const stats = await Maintenance.findAll({
    where,
    attributes: [
      'category',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('cost')), 'totalCost'],
    ],
    group: ['category'],
    raw: true,
  });
  return stats;
};

module.exports = { getAll, getById, create, update, remove, getStatsByCategory };
