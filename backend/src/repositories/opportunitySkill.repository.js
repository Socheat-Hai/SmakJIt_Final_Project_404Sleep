const db = require('../models');
const { OpportunitySkill, Skill } = db;

const findBySkillName = async (skillName) => {
  return OpportunitySkill.findAll({
    include: [{
      model: Skill,
      as: 'skill',
      where: { skill_name: { [db.Sequelize.Op.iLike]: `%${skillName}%` } },
      attributes: [],
    }],
    attributes: ['opp_id'],
  });
};

module.exports = { findBySkillName };
