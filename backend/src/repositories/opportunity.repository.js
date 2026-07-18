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

const findRecommended = async (skillIds, catNames = [], limit = 10) => {
  const safeSkillIds = (skillIds || []).map(Number).filter(n => !isNaN(n) && Number.isFinite(n));
  const hasSkills = safeSkillIds.length > 0;
  const hasCats = catNames && catNames.length > 0;

  if (!hasSkills && !hasCats) return [];

  const where = { status: 'open' };

  // Match by skills OR by category
  const orConditions = [];
  if (hasSkills) {
    const idList = safeSkillIds.join(',');
    orConditions.push(
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM "OpportunitySkill" WHERE "OpportunitySkill"."opp_id" = "Opportunity"."opp_id" AND "OpportunitySkill"."skill_id" IN (${idList})) > 0`
      )
    );
  }
  if (hasCats) {
    const catList = catNames.map(c => `'${c.replace(/'/g, "''")}'`).join(',');
    orConditions.push(
      db.sequelize.literal(
        `"Opportunity"."category_id" IN (SELECT "category_id" FROM "Category" WHERE "name" IN (${catList}))`
      )
    );
  }

  if (orConditions.length === 1) {
    where[db.Sequelize.Op.and] = [orConditions[0]];
  } else {
    where[db.Sequelize.Op.or] = orConditions;
  }

  // Build match score: skill matches + category bonus (10 per category match)
  const scoreParts = [];
  if (hasSkills) {
    const idList = safeSkillIds.join(',');
    scoreParts.push(
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM "OpportunitySkill" WHERE "OpportunitySkill"."opp_id" = "Opportunity"."opp_id" AND "OpportunitySkill"."skill_id" IN (${idList}))`
      )
    );
  }
  if (hasCats) {
    const catList = catNames.map(c => `'${c.replace(/'/g, "''")}'`).join(',');
    scoreParts.push(
      db.sequelize.literal(
        `CASE WHEN "Opportunity"."category_id" IN (SELECT "category_id" FROM "Category" WHERE "name" IN (${catList})) THEN 10 ELSE 0 END`
      )
    );
  }

  const scoreExpr = scoreParts.length === 1
    ? scoreParts[0]
    : db.sequelize.literal(scoreParts.map((part) => `(${part.val})`).join(' + '));

  return Opportunity.findAll({
    where,
    attributes: {
      include: [[scoreExpr, 'matchScore']],
    },
    include: [
      { model: Organization, as: 'organization', attributes: ['org_id', 'name', 'logo'] },
      { model: Category, as: 'category' },
      { model: OpportunitySkill, as: 'skills', separate: true, include: [{ model: Skill, as: 'skill' }] },
    ],
    order: [[db.sequelize.literal('"matchScore"'), 'DESC'], ['created_at', 'DESC']],
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
