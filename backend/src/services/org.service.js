const prisma = require('../lib/prisma');

const create = async (data) => {
  return prisma.organization.create({
    data: {
      user_id: data.user_id,
      name: data.name,
      contact_email: data.email,
      contact_phone: data.phone || null,
      location: data.address || data.location || null,
      description: data.bio || data.description || null,
      website: data.website || null,
      status: 'pending',
    },
  });
};

const findById = async (id) => {
  return prisma.organization.findUnique({
    where: { org_id: id },
    include: { opportunities: true, user: { select: { user_id: true, full_name: true, email: true } } },
  });
};

const findByUserId = async (userId) => {
  return prisma.organization.findUnique({ where: { user_id: userId } });
};

const findAll = async (status) => {
  const where = status ? { status } : {};
  return prisma.organization.findMany({ where, orderBy: { created_at: 'desc' } });
};

const update = async (id, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.contact_email = data.email;
  if (data.phone !== undefined) updateData.contact_phone = data.phone;
  if (data.address !== undefined) updateData.location = data.address;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.bio !== undefined) updateData.description = data.bio;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.status !== undefined) updateData.status = data.status;
  return prisma.organization.update({ where: { org_id: id }, data: updateData });
};

module.exports = { create, findById, findByUserId, findAll, update };
