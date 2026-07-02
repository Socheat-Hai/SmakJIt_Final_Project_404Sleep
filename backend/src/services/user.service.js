const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const findAll = async () => {
  return prisma.user.findMany({ orderBy: { created_at: 'desc' } });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { user_id: id },
    include: {
      organization: {
        select: {
          name: true,
          website: true,
          contact_email: true,
          contact_phone: true,
          location: true,
          description: true,
          logo: true,
          status: true,
        },
      },
      profile: {
        select: {
          profile_id: true,
          phone_num: true,
          profile_picture: true,
          date_of_birth: true,
          location: true,
          gender: true,
          bio: true,
        },
      },
    },
  });
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
      role: userData.role,
    },
  });
};

const update = async (id, data) => {
  const updateData = {};
  if (data.full_name !== undefined) updateData.full_name = data.full_name;
  if (data.name !== undefined) updateData.full_name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
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
  const { password_hash, organization, profile, ...safe } = user;
  return {
    ...safe,
    id: safe.user_id,
    name: safe.full_name,
    role: safe.role,
    org_name: organization?.name || null,
    org_website: organization?.website || null,
    org_logo: organization?.logo || null,
    org_description: organization?.description || null,
    org_contact_email: organization?.contact_email || null,
    org_contact_phone: organization?.contact_phone || null,
    org_location: organization?.location || null,
    org_status: organization?.status || null,
    profile_photo: profile?.profile_picture || null,
    phone_num: profile?.phone_num || null,
    volunteer_bio: profile?.bio || null,
    volunteer_location: profile?.location || null,
    volunteer_dob: profile?.date_of_birth || null,
    volunteer_gender: profile?.gender || null,
  };
};

module.exports = { findAll, findById, findByEmail, create, update, remove, comparePassword, sanitizeUser };
