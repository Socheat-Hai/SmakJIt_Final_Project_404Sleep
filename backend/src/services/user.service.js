const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const volunteerProfileRepository = require('../repositories/volunteerProfile.repository');

const findAll = async () => {
  return userRepository.findAll();
};

const findById = async (id) => {
  return userRepository.findById(id);
};

const findByEmail = async (email) => {
  return userRepository.findByEmail(email);
};

const create = async (userData) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  return userRepository.create({
    full_name: userData.full_name || userData.name,
    email: userData.email,
    password_hash: hashedPassword,
    role: userData.role,
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
  await userRepository.update(id, updateData);
  return userRepository.findById(id);
};

const remove = async (id) => {
  return userRepository.remove(id);
};

const findVolunteerProfile = async (userId) => {
  return volunteerProfileRepository.findByUserId(userId);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const userJson = user.get({ plain: true });
  const { password_hash, organization, profile, user_id, full_name, ...safe } = userJson;
  return {
    ...safe,
    id: user_id,
    name: full_name,
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
    volunteer_interests: profile?.interests || [],
  };
};

module.exports = { findAll, findById, findByEmail, create, update, remove, comparePassword, sanitizeUser, findVolunteerProfile };
