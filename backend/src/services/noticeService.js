/**
 * 공지사항 서비스 - 비즈니스 로직
 */
const { Notice, Building } = require('../models');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, buildingId, noticeType, isImportant }) => {
  const where = {};
  if (noticeType) where.noticeType = noticeType;
  if (isImportant !== undefined) where.isImportant = isImportant === 'true' || isImportant === true;
  if (buildingId) {
    where[Op.or] = [{ buildingId }, { buildingId: null }];
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Notice.findAndCountAll({
    where,
    include: [{ model: Building, as: 'building', attributes: ['id', 'name'] }],
    limit: parseInt(limit, 10),
    offset,
    order: [['isImportant', 'DESC'], ['createdAt', 'DESC']],
  });

  return { count, rows, page, limit };
};

const getById = async (id) => {
  return Notice.findByPk(id, {
    include: [{ model: Building, as: 'building' }],
  });
};

const create = async (data) => {
  return Notice.create(data);
};

const update = async (id, data) => {
  const notice = await Notice.findByPk(id);
  if (!notice) return null;
  await notice.update(data);
  return notice;
};

const remove = async (id) => {
  const notice = await Notice.findByPk(id);
  if (!notice) return null;
  await notice.destroy();
  return true;
};

module.exports = { getAll, getById, create, update, remove };
