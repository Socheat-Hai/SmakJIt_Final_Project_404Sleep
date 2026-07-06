const orgRepository = require('../repositories/organization.repository');

const create = async (data) => {
  return orgRepository.create({
    owner_id: data.user_id,
    name: data.name,
    contact_email: data.email,
    contact_phone: data.phone || null,
    location: data.address || data.location || null,
    description: data.bio || data.description || null,
    website: data.website || null,
    status: 'pending',
  });
};

const findById = async (id) => {
  return orgRepository.findById(id);
};

const findByUserId = async (userId) => {
  return orgRepository.findByOwnerId(userId);
};

const findAll = async (status) => {
  const where = status ? { status } : {};
  return orgRepository.findAll(where);
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
  if (data.contact_email !== undefined) updateData.contact_email = data.contact_email;
  if (data.contact_phone !== undefined) updateData.contact_phone = data.contact_phone;
  await orgRepository.update(id, updateData);
  return orgRepository.findById(id);
};

module.exports = { create, findById, findByUserId, findAll, update };
