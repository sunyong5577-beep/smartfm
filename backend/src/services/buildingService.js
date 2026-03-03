/**
 * 건물 서비스 - 비즈니스 로직
 */
const { Building, Tenant } = require('../models');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, search, status, buildingType }) => {
  const where = {};
  if (status) where.status = status;
  if (buildingType) where.buildingType = buildingType;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Building.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  const building = await Building.findByPk(id, {
    include: [{ model: require('../models/Tenant'), as: 'tenants' }],
  });
  return building;
};

const create = async (data) => {
  const building = await Building.create(data);
  return building;
};

const update = async (id, data) => {
  const building = await Building.findByPk(id);
  if (!building) return null;
  await building.update(data);
  return building;
};

const remove = async (id) => {
  const building = await Building.findByPk(id);
  if (!building) return null;
  await building.destroy();
  return true;
};

const getStats = async () => {
  const total = await Building.count();
  const active = await Building.count({ where: { status: 'active' } });
  const byType = await Building.findAll({
    attributes: ['buildingType', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
    group: ['buildingType'],
    raw: true,
  });
  return { total, active, byType };
};

module.exports = { getAll, getById, create, update, remove, getStats };
