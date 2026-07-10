const db = require('../models');
const { Opportunity, Organization, Category, OpportunitySkill, Skill, Application } = db;

const findAll = async (where, options = {}) => {
  const { offset, limit, order } = options;
  return Opportunity.findAndCountAll({
    where,
    include: [
      { model: Organization, as: 'organization', attributes: ['org_id', 'name', 'contact_email', 'logo'] },
      { model: Category, as: 'category' },
      { model: OpportunitySkill, as: 'skills', separate: true, include: [{ model: Skill, as: 'skill' }] },
    ],
    offset,
    limit,
    order: order || [['created_at', 'DESC']],
  });
};

const findById = async (id) => {
  return Opportunity.findByPk(id, {
    include: [
      { model: Organization, as: 'organization', attributes: ['org_id', 'name', 'description', 'website', 'location'] },
      { model: Category, as: 'category' },
      { model: OpportunitySkill, as: 'skills', separate: true, include: [{ model: Skill, as: 'skill' }] },
    ],
  });
};

const create = async (data) => {
  return Opportunity.create(data);
};

const update = async (id, data) => {
  return Opportunity.update(data, { where: { opp_id: id } });
};

const remove = async (id) => {
  return Opportunity.destroy({ where: { opp_id: id } });
};

const count = async (where = {}) => {
  return Opportunity.count({ where });
};

const findRecommended = async (skillIds, limit = 10) => {
  // FIX: Guard against empty or invalid skillIds to prevent SQL crash
  if (!skillIds || skillIds.length === 0) return [];
  const safeIds = skillIds.map(Number).filter(n => !isNaN(n) && Number.isFinite(n));
  if (safeIds.length === 0) return [];

  return Opportunity.findAll({
    where: {
      status: 'open',
      opp_id: {
        [db.Sequelize.Op.in]: db.sequelize.literal(
          `(SELECT opp_id FROM "OpportunitySkill" WHERE skill_id IN (${safeIds.join(',')}))`
        ),
      },
    },
    include: [
      { model: Organization, as: 'organization', attributes: ['org_id', 'name', 'logo'] },
      { model: Category, as: 'category' },
    ],
    order: [['created_at', 'DESC']],
    limit,
  });
};

const findAllWithCount = async ({ search, status, include, order } = {}) => {
  const where = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where[db.Sequelize.Op.or] = [
      { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
      { description: { [db.Sequelize.Op.iLike]: `%${search}%` } },
    ];
  }
  return Opportunity.findAll({
    where,
    attributes: {
      include: [
        [
          db.Sequelize.literal('(SELECT COUNT(*) FROM "Application" WHERE "Application"."opp_id" = "Opportunity"."opp_id")'),
          'applicationCount',
        ],
      ],
    },
    include,
    order,
  });
};

module.exports = { findAll, findById, create, update, remove, count, findRecommended, findAllWithCount };
