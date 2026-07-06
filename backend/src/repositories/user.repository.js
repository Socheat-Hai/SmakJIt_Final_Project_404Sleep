const db = require('../models');
const { User, Organization, VolunteerProfile } = db;

const findAll = async () => {
  return User.findAll({ order: [['created_at', 'DESC']] });
};

const findById = async (id) => {
  return User.findByPk(id, {
    include: [
      { model: Organization, as: 'organization', attributes: ['name', 'website', 'contact_email', 'contact_phone', 'location', 'description', 'logo', 'status'] },
      { model: VolunteerProfile, as: 'profile', attributes: ['profile_id', 'phone_num', 'profile_picture', 'date_of_birth', 'location', 'gender', 'bio'] },
    ],
  });
};

const findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const create = async (data) => {
  return User.create(data);
};

const update = async (id, data) => {
  return User.update(data, { where: { user_id: id } });
};

const remove = async (id) => {
  return User.destroy({ where: { user_id: id } });
};

const count = async (where = {}) => {
  return User.count({ where });
};

const findAllWithFilters = async ({ search, role, status, attributes, include, order } = {}) => {
  const where = {};
  if (role && role !== 'all') where.role = role;
  if (status && status !== 'all') where.status = status;
  if (search) {
    where[db.Sequelize.Op.or] = [
      { full_name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
      { email: { [db.Sequelize.Op.iLike]: `%${search}%` } },
    ];
  }
  return User.findAll({ where, attributes, include, order });
};

module.exports = { findAll, findById, findByEmail, create, update, remove, count, findAllWithFilters };
