const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const orgService = require('../services/org.service');
const db = require('../models');
const { Organization, VolunteerProfile, AdminProfile } = db;

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, date_of_birth, gender, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await userService.findByEmail(email.toLowerCase().trim());
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const allowedRoles = ['volunteer', 'organization'];
    const resolvedRole = allowedRoles.includes(role) ? role : 'volunteer';

    const user = await userService.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: resolvedRole,
    });

    if (resolvedRole === 'organization') {
      await orgService.create({
        user_id: user.user_id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        contact_phone: phone || null,
        location: location || null,
        description: description || null,
      });
    }

    if (resolvedRole === 'volunteer') {
      const volunteerProfileRepository = require('../repositories/volunteerProfile.repository');
      const profileData = { user_id: user.user_id };
      if (phone) profileData.phone_num = phone;
      if (location) profileData.location = location;
      if (date_of_birth) profileData.date_of_birth = new Date(date_of_birth);
      if (gender) profileData.gender = gender;
      await volunteerProfileRepository.create(profileData);
    }

    const fullUser = await userService.findById(user.user_id);
    const token = generateToken(fullUser);
    const safe = userService.sanitizeUser(fullUser);

    res.status(201).json({ token, user: safe });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userService.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Account has been banned' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isMatch = await userService.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const safe = userService.sanitizeUser(user);
    res.status(200).json({ token, user: safe });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Google OAuth login/signup
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  if (!tokenId) return res.status(400).json({ message: 'Google tokenId required' });
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email;
    let user = await userService.findByEmail(email);
    if (!user) {
      // create a random password for the account
      const randomPass = require('crypto').randomBytes(12).toString('hex');
      user = await userService.create({ name, email, password: randomPass, role: 'volunteer' });
      const volunteerProfileRepository = require('../repositories/volunteerProfile.repository');
      await volunteerProfileRepository.create({ user_id: user.user_id });
      user = await userService.findById(user.user_id);
    }
    const token = generateToken(user);
    const safe = userService.sanitizeUser(user);
    return res.status(200).json({ token, user: safe });
  } catch (error) {
    console.error('GOOGLE LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userService.sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userFields = ['name', 'full_name', 'email'];
    const userUpdates = {};
    for (const field of userFields) {
      if (req.body[field] !== undefined) {
        userUpdates[field] = req.body[field];
      }
    }

    if (req.body.email) {
      const existing = await userService.findByEmail(req.body.email);
      if (existing && existing.user_id !== req.user.user_id) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await userService.update(req.user.user_id, userUpdates);

    if (user.role === 'organization') {
      const orgUpdates = {};
      if (req.body.org_name !== undefined) orgUpdates.name = req.body.org_name;
      if (req.body.org_website !== undefined) orgUpdates.website = req.body.org_website;
      if (req.body.description !== undefined) orgUpdates.description = req.body.description;
      if (req.body.contact_email !== undefined) orgUpdates.contact_email = req.body.contact_email;
      if (req.body.contact_phone !== undefined) orgUpdates.contact_phone = req.body.contact_phone;
      if (req.body.location !== undefined) orgUpdates.location = req.body.location;

      if (Object.keys(orgUpdates).length > 0) {
        // FIX: Use imported Organization model instead of undefined variable
        await Organization.update(orgUpdates, { where: { owner_id: req.user.user_id } });
      }
    }

    if (user.role === 'volunteer') {
      const volUpdates = {};
      if (req.body.phone_num !== undefined) volUpdates.phone_num = req.body.phone_num;
      if (req.body.location !== undefined) volUpdates.location = req.body.location;
      if (req.body.bio !== undefined) volUpdates.bio = req.body.bio;
      if (req.body.date_of_birth !== undefined) volUpdates.date_of_birth = new Date(req.body.date_of_birth);
      if (req.body.gender !== undefined) volUpdates.gender = req.body.gender;
      if (req.body.interests !== undefined) {
        const interests = req.body.interests;
        if (Array.isArray(interests)) {
          volUpdates.interests = interests;
        }
      }
      if (req.body.skills !== undefined) {
        const skills = req.body.skills;
        if (Array.isArray(skills)) {
          volUpdates.skills = skills;
        }
      }

      if (Object.keys(volUpdates).length > 0) {
        const [affectedCount] = await VolunteerProfile.update(volUpdates, {
          where: { user_id: req.user.user_id },
        });
        if (affectedCount === 0) {
          await VolunteerProfile.create({
            user_id: req.user.user_id,
            ...volUpdates,
          });
        }
      }
    }

    if (user.role === 'admin') {
      const adminUpdates = {};
      if (req.body.phone_num !== undefined) adminUpdates.phone_num = req.body.phone_num;
      if (req.body.location !== undefined) adminUpdates.location = req.body.location;
      if (req.body.bio !== undefined) adminUpdates.bio = req.body.bio;
      if (req.body.date_of_birth !== undefined) adminUpdates.date_of_birth = new Date(req.body.date_of_birth);
      if (req.body.gender !== undefined) adminUpdates.gender = req.body.gender;

      if (Object.keys(adminUpdates).length > 0) {
        const [affectedCount] = await AdminProfile.update(adminUpdates, {
          where: { user_id: req.user.user_id },
        });
        if (affectedCount === 0) {
          await AdminProfile.create({
            user_id: req.user.user_id,
            ...adminUpdates,
          });
        }
      }
    }
    
    const updated = await userService.findById(req.user.user_id);
    res.status(200).json(userService.sanitizeUser(updated));
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await userService.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await userService.comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await require('bcryptjs').genSalt(12);
    const hashedPassword = await require('bcryptjs').hash(newPassword, salt);
    await userService.update(req.user.user_id, { password_hash: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { register, login, googleLogin, getProfile, updateProfile, changePassword };
