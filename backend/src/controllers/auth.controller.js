const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const prisma = require('../lib/prisma');

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
      await prisma.organization.create({
        data: {
          owner_id: user.user_id,
          name: name.trim(),
          contact_email: email.toLowerCase().trim(),
        },
      });
    }

    if (resolvedRole === 'volunteer') {
      await prisma.volunteerProfile.create({
        data: {
          user_id: user.user_id,
        },
      });
    }

    const token = generateToken(user);
    const safe = userService.sanitizeUser(user);

    res.status(201).json({ token, user: safe });
  } catch (error) {
    if (error.code === 'P2002') {
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
    const userFields = ['name', 'email'];
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
        await prisma.organization.update({
          where: { owner_id: req.user.user_id },
          data: orgUpdates,
        });
      }
    }

    if (user.role === 'volunteer') {
      const volUpdates = {};
      if (req.body.phone_num !== undefined) volUpdates.phone_num = req.body.phone_num;
      if (req.body.location !== undefined) volUpdates.location = req.body.location;
      if (req.body.bio !== undefined) volUpdates.bio = req.body.bio;
      if (req.body.date_of_birth !== undefined) volUpdates.date_of_birth = new Date(req.body.date_of_birth);
      if (req.body.gender !== undefined) volUpdates.gender = req.body.gender;
      if (Object.keys(volUpdates).length > 0) {
        await prisma.volunteerProfile.update({
          where: { user_id: req.user.user_id },
          data: volUpdates,
        });
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

module.exports = { register, login, getProfile, updateProfile, changePassword };
