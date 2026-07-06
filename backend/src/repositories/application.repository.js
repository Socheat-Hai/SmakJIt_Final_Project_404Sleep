const db = require('../models');
const { Application, Opportunity, Organization, User } = db;

const create = async (data) => {
  return Application.create(data);
};

const findById = async (id) => {
  return Application.findByPk(id, {
    include: [
      { model: Opportunity, as: 'opportunity' },
      { model: User, as: 'user' },
    ],
  });
};

const findByUser = async (userId) => {
  return Application.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Opportunity,
        as: 'opportunity',
        include: [{ model: Organization, as: 'organization', attributes: ['org_id', 'name'] }],
      },
    ],
    order: [['applied_at', 'DESC']],
  });
};

const findByOpportunity = async (oppId) => {
  return Application.findAll({
    where: { opp_id: oppId },
    include: [{ model: User, as: 'user', attributes: ['user_id', 'full_name', 'email'] }],
    order: [['applied_at', 'DESC']],
  });
};

const updateStatus = async (id, status) => {
  return Application.update({ status }, { where: { application_id: id } });
};

const count = async (where = {}) => {
  return Application.count({ where });
};

const findAllWithIncludes = async ({ status, include, order } = {}) => {
  const where = {};
  if (status && status !== 'all') where.status = status;
  return Application.findAll({ where, include, order });
};

module.exports = { create, findById, findByUser, findByOpportunity, updateStatus, count, findAllWithIncludes };
