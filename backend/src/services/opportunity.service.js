const { Op } = require('sequelize');
const db = require('../models');
const { Opportunity, Organization, Category, OpportunitySkill, Skill } = db;

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

  const skillWhere = skill ? { skill_name: { [Op.iLike]: `%${skill}%` } } : undefined;

  const offset = (page - 1) * limit;

  const { count, rows } = await Opportunity.findAndCountAll({
    where,
    include: [
      {
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name', 'contact_email', 'logo'],
      },
      { model: Category, as: 'category' },
      {
        model: OpportunitySkill,
        as: 'skills',
        required: !!skill,
        include: skillWhere
          ? [{ model: Skill, as: 'skill', where: skillWhere }]
          : [{ model: Skill, as: 'skill' }],
      },
    ],
    distinct: true,
    offset,
    limit,
    order: [['created_at', 'DESC']],
  });

  return { data: rows, total: count, page, pages: Math.ceil(count / limit) };
};

const findById = async (id) => {
  return Opportunity.findByPk(id, {
    include: [
      {
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name', 'description', 'website', 'location'],
      },
      { model: Category, as: 'category' },
      {
        model: OpportunitySkill,
        as: 'skills',
        include: [{ model: Skill, as: 'skill' }],
      },
    ],
  });
};

const create = async (data) => {
  return Opportunity.create(data);
};

const findRecommended = async (skillIds) => {
  return Opportunity.findAll({
    where: { status: 'open' },
    include: [
      {
        model: Organization,
        as: 'organization',
        attributes: ['org_id', 'name', 'logo'],
      },
      { model: Category, as: 'category' },
      {
        model: OpportunitySkill,
        as: 'skills',
        required: true,
        include: [{ model: Skill, as: 'skill', where: { skill_id: { [Op.in]: skillIds } } }],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: 10,
  });
};

const update = async (id, data) => {
  await Opportunity.update(data, { where: { opp_id: id } });
  return Opportunity.findByPk(id);
};

const remove = async (id) => {
  return Opportunity.destroy({ where: { opp_id: id } });
};

module.exports = { findAll, findById, create, update, remove, findRecommended };
