const prisma = require('../lib/prisma');

const create = async (data) => {
  return prisma.application.create({ data });
};

const findByProfile = async (profileId) => {
  return prisma.application.findMany({
    where: { profile_id: profileId },
    include: {
      opportunity: {
        include: { organization: { select: { org_id: true, name: true } } },
      },
    },
    orderBy: { applied_at: 'desc' },
  });
};

const findByOpportunity = async (oppId) => {
  return prisma.application.findMany({
    where: { opp_id: oppId },
    include: {
      volunteer: {
        select: {
          profile_id: true,
          user: { select: { user_id: true, full_name: true, email: true } },
        },
      },
    },
    orderBy: { applied_at: 'desc' },
  });
};

const findById = async (id) => {
  return prisma.application.findUnique({
    where: { application_id: id },
    include: { opportunity: true, volunteer: true },
  });
};

const updateStatus = async (id, status) => {
  return prisma.application.update({ where: { application_id: id }, data: { status } });
};

module.exports = { create, findByProfile, findByOpportunity, findById, updateStatus };
