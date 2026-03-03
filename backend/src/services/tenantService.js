/**
 * 입주자 서비스 - 비즈니스 로직
 */
const { Tenant, Building } = require('../models');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, search, buildingId, status }) => {
  const where = {};
  if (status) where.status = status;
  if (buildingId) where.buildingId = buildingId;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { unitNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Tenant.findAndCountAll({
    where,
    include: [{ model: Building, as: 'building', attributes: ['id', 'name', 'address'] }],
    limit: parseInt(limit, 10),
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  return Tenant.findByPk(id, {
    include: [{ model: Building, as: 'building' }],
  });
};

const create = async (data) => {
  return Tenant.create(data);
};

const update = async (id, data) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) return null;
  await tenant.update(data);
  return tenant;
};

const remove = async (id) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) return null;
  await tenant.destroy();
  return true;
};

module.exports = { getAll, getById, create, update, remove };
