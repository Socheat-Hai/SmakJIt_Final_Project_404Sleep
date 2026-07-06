const db = require('../models');
const { Organization, User } = db;

const create = async (data) => {
  return Organization.create(data);
};

const findById = async (id) => {
  return Organization.findByPk(id, {
    include: [{ model: User, as: 'owner', attributes: ['user_id', 'full_name', 'email'] }],
  });
};

const findByOwnerId = async (ownerId) => {
  return Organization.findOne({ where: { owner_id: ownerId } });
};

const findAll = async (where = {}) => {
  return Organization.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['full_name', 'email', 'created_at'] }],
    order: [['created_at', 'DESC']],
  });
};

const update = async (id, data) => {
  return Organization.update(data, { where: { org_id: id } });
};

const remove = async (id) => {
  return Organization.destroy({ where: { org_id: id } });
};

const count = async (where = {}) => {
  return Organization.count({ where });
};

const updateByOwnerId = async (ownerId, data) => {
  return Organization.update(data, { where: { owner_id: ownerId } });
};

const updateById = async (id, data) => {
  const [, [org]] = await Organization.update(data, {
    where: { org_id: id },
    returning: true,
  });
  return org;
};

module.exports = { create, findById, findByOwnerId, findAll, update, remove, count, updateByOwnerId, updateById };
