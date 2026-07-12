const savedRepo = require('../repositories/savedOpportunity.repository');

const findByUser = async (userId) => {
  return savedRepo.findByUser(userId);
};

const create = async (userId, oppId) => {
  return savedRepo.create({ user_id: userId, opp_id: oppId });
};

const remove = async (userId, oppId) => {
  return savedRepo.remove(userId, oppId);
};

module.exports = { findByUser, create, remove };