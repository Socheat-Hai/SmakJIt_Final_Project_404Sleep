const { Op } = require('sequelize');
const oppRepository = require('../repositories/opportunity.repository');
const oppSkillRepository = require('../repositories/opportunitySkill.repository');

const findAll = async ({ search, skill, location, orgId, categoryId, page = 1, limit = 20 }) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (location) where.location = { [Op.iLike]: `%${location}%` };
  if (orgId) where.org_id = orgId;
  if (categoryId) where.category_id = parseInt(categoryId);
  if (skill) {
    const matchingOpps = await oppSkillRepository.findBySkillName(skill);
    const oppIds = [...new Set(matchingOpps.map((o) => o.opp_id))];
    if (!oppIds.length) {
      return { data: [], total: 0, page, pages: 0 };
    }
    where.opp_id = { [Op.in]: oppIds };
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await oppRepository.findAll(where, { offset, limit });
  return { data: rows, total: count, page, pages: Math.ceil(count / limit) };
};

const findById = async (id) => {
  return oppRepository.findById(id);
};

const create = async (data) => {
  return oppRepository.create(data);
};

const findRecommended = async (skillIds, catNames = []) => {
  return oppRepository.findRecommended(skillIds, catNames);
};

const update = async (id, data) => {
  await oppRepository.update(id, data);
  return oppRepository.findById(id);
};

const remove = async (id) => {
  return oppRepository.remove(id);
};

module.exports = { findAll, findById, create, update, remove, findRecommended };
