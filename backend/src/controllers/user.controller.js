const userService = require('../services/user.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users.map(userService.sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.findById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userService.sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(userService.sanitizeUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.body.email) {
      const existing = await userService.findByEmail(req.body.email);
      if (existing && existing.user_id !== parseInt(req.params.id)) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }
    const user = await userService.update(parseInt(req.params.id), req.body);
    res.status(200).json(userService.sanitizeUser(user));
  } catch (error) {
    if (error.name === 'SequelizeEmptyResultError') return res.status(404).json({ message: 'User not found' });
    if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Email already in use' });
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.remove(parseInt(req.params.id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.name === 'SequelizeEmptyResultError') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
