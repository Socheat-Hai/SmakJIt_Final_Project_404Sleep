const applicationRepository = require('../repositories/application.repository');

const create = async (data) => {
  return applicationRepository.create(data);
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

const updateStatus = async (id, status) => {
  await applicationRepository.updateStatus(id, status);
  return applicationRepository.findById(id);
};

module.exports = { create, findByUser, findByOpportunity, findById, updateStatus };
