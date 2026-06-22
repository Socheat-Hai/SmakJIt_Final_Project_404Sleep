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
          social_link: true,
          contact_email: true,
          contact_phone: true,
          location: true,
          description: true,
          logo: true,
          status: true,
          completion_checklist: true,
        },
      },
      volunteer: {
        select: {
          profile_id: true,
          phone_num: true,
          profile_photo: true,
          dob: true,
          location: true,
          gender: true,
          bio: true,
          interests: true,
          volunteer_skills: { include: { skill: true } },
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
      user_type: userData.user_type || userData.role,
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
  const { password_hash, organization, volunteer, ...safe } = user;
  return {
    ...safe,
    id: safe.user_id,
    name: safe.full_name,
    role: safe.user_type,
    user_type: safe.user_type,
    org_name: organization?.name || null,
    org_website: organization?.website || null,
    social_link: organization?.social_link || null,
    org_logo: organization?.logo || null,
    org_description: organization?.description || null,
    org_contact_email: organization?.contact_email || null,
    org_contact_phone: organization?.contact_phone || null,
    org_location: organization?.location || null,
    org_status: organization?.status || null,
    org_completion_checklist: organization?.completion_checklist || null,
    profile_photo: volunteer?.profile_photo || null,
    phone_num: volunteer?.phone_num || null,
    volunteer_bio: volunteer?.bio || null,
    volunteer_location: volunteer?.location || null,
    volunteer_dob: volunteer?.dob || null,
    volunteer_gender: volunteer?.gender || null,
    volunteer_interests: volunteer?.interests ? JSON.parse(volunteer.interests) : [],
    volunteer_skills: volunteer?.volunteer_skills?.map((vs) => vs.skill) || [],
  };
};

module.exports = { findAll, findById, findByEmail, create, update, remove, comparePassword, sanitizeUser };
