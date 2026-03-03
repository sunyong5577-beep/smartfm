/**
 * 계약 서비스 - 비즈니스 로직
 */
const { Contract, Tenant, Building } = require('../models');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, buildingId, tenantId, status, contractType }) => {
  const where = {};
  if (status) where.status = status;
  if (buildingId) where.buildingId = buildingId;
  if (tenantId) where.tenantId = tenantId;
  if (contractType) where.contractType = contractType;

  const offset = (page - 1) * limit;
  const { count, rows } = await Contract.findAndCountAll({
    where,
    include: [
      { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'unitNumber', 'tenantType'] },
      { model: Building, as: 'building', attributes: ['id', 'name', 'address'] },
    ],
    limit: parseInt(limit, 10),
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  return Contract.findByPk(id, {
    include: [
      { model: Tenant, as: 'tenant' },
      { model: Building, as: 'building' },
    ],
  });
};

const create = async (data) => {
  // 해당 입주자의 활성 계약이 이미 있는지 확인
  const existing = await Contract.findOne({
    where: { tenantId: data.tenantId, status: 'active' },
  });
  if (existing) {
    throw new Error('해당 입주자에게 이미 활성 계약이 존재합니다.');
  }
  return Contract.create(data);
};

const update = async (id, data) => {
  const contract = await Contract.findByPk(id);
  if (!contract) return null;
  await contract.update(data);
  return contract;
};

const remove = async (id) => {
  const contract = await Contract.findByPk(id);
  if (!contract) return null;
  await contract.destroy();
  return true;
};

module.exports = { getAll, getById, create, update, remove };
