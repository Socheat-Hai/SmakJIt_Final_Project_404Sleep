const db = require('../models');
const applicationRepository = require('../repositories/application.repository');

const VALID_STATUSES = ['submitted', 'received', 'reviewing', 'interview', 'accepted', 'rejected'];

const create = async ({ user_id, opp_id, answers }) => {
  const transaction = await db.sequelize.transaction();
  try {
    const app = await applicationRepository.create(
      { user_id, opp_id, status: 'submitted' },
      answers || [],
      transaction,
    );
    await transaction.commit();
    return applicationRepository.findById(app.application_id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findByUser = async (userId) => {
  return applicationRepository.findByUser(userId);
};

const findByOpportunity = async (oppId) => {
  return applicationRepository.findByOpportunity(oppId);
};

const findById = async (id) => {
  return applicationRepository.findById(id);
};

const updateStatus = async (id, status, acceptanceInfo = null) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  await applicationRepository.updateStatus(id, status, acceptanceInfo);
  return applicationRepository.findById(id);
};

const findByOrganization = async (orgId) => {
  return applicationRepository.findByOrganization(orgId);
};

module.exports = { create, findByUser, findByOpportunity, findByOrganization, findById, updateStatus, VALID_STATUSES };
