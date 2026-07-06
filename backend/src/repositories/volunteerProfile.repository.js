const db = require('../models');
const { VolunteerProfile } = db;

const findByUserId = async (userId) => {
  return VolunteerProfile.findOne({ where: { user_id: userId } });
};

const create = async (data) => {
  return VolunteerProfile.create(data);
};

const update = async (userId, data) => {
  return VolunteerProfile.update(data, { where: { user_id: userId } });
};

module.exports = { findByUserId, create, update };
