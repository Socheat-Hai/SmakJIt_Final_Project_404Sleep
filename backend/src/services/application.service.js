const db = require('../models');
const { Application, Opportunity, Organization, User } = db;

const create = async (data) => {
  return Application.create(data);
};

const findByUser = async (userId) => {
  return Application.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Opportunity,
        as: 'opportunity',
        include: [
          { model: Organization, as: 'organization', attributes: ['org_id', 'name'] },
        ],
      },
    ],
    order: [['applied_at', 'DESC']],
  });
};

const findByOpportunity = async (oppId) => {
  return Application.findAll({
    where: { opp_id: oppId },
    include: [
      { model: User, as: 'user', attributes: ['user_id', 'full_name', 'email'] },
    ],
    order: [['applied_at', 'DESC']],
  });
};

const findById = async (id) => {
  return Application.findByPk(id, {
    include: [
      { model: Opportunity, as: 'opportunity' },
      { model: User, as: 'user' },
    ],
  });
};

const updateStatus = async (id, status) => {
  await Application.update({ status }, { where: { application_id: id } });
  return Application.findByPk(id);
};

module.exports = { create, findByUser, findByOpportunity, findById, updateStatus };
