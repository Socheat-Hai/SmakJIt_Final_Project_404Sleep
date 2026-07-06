const db = require('../models');
const { Skill } = db;

const findAll = async () => {
  return Skill.findAll({ order: [['skill_name', 'ASC']] });
};

module.exports = { findAll };
