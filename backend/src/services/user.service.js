const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const findAll = async () => {
  return prisma.user.findMany({ orderBy: { created_at: 'desc' } });
};

const findById = async (id) => {
  return prisma.user.findUnique({ where: { user_id: id } });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const create = async (userData) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  return prisma.user.create({
    data: {
      full_name: userData.full_name || userData.name,
      email: userData.email,
      password_hash: hashedPassword,
      user_type: userData.user_type || userData.role,
    },
  });
};

const update = async (id, data) => {
  const updateData = {};
  if (data.full_name !== undefined) updateData.full_name = data.full_name;
  if (data.name !== undefined) updateData.full_name = data.name;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.password_hash !== undefined) updateData.password_hash = data.password_hash;
  if (data.password !== undefined) {
    const salt = await bcrypt.genSalt(12);
    updateData.password_hash = await bcrypt.hash(data.password, salt);
  }
  return prisma.user.update({ where: { user_id: id }, data: updateData });
};

const remove = async (id) => {
  return prisma.user.delete({ where: { user_id: id } });
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return {
    ...safe,
    id: safe.user_id,
    name: safe.full_name,
    role: safe.user_type,
    user_type: safe.user_type,
  };
};

module.exports = { findAll, findById, findByEmail, create, update, remove, comparePassword, sanitizeUser };
