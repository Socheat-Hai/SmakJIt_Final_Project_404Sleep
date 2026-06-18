const prisma = require('../lib/prisma');

const findAll = async ({ search, skill, location, orgId, page = 1, limit = 20 }) => {
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (skill) {
    where.opportunity_skills = {
      some: { skill: { skill_name: { contains: skill } } },
    };
  }
  if (location) where.location = { contains: location };
  if (orgId) where.org_id = orgId;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      include: {
        organization: { select: { org_id: true, name: true, contact_email: true } },
        opportunity_skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.opportunity.count({ where }),
  ]);
  return { data, total, page, pages: Math.ceil(total / limit) };
};

const findById = async (id) => {
  return prisma.opportunity.findUnique({
    where: { opp_id: id },
    include: {
      organization: {
        select: { org_id: true, name: true, description: true, website: true, location: true },
      },
      opportunity_skills: { include: { skill: true } },
      _count: { select: { applications: true } },
    },
  });
};

const create = async (data) => {
  return prisma.opportunity.create({ data });
};

const update = async (id, data) => {
  return prisma.opportunity.update({ where: { opp_id: id }, data });
};

const remove = async (id) => {
  return prisma.opportunity.delete({ where: { opp_id: id } });
};

module.exports = { findAll, findById, create, update, remove };
