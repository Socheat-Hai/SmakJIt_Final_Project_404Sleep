const db = require('../models');
const userService = require('../services/user.service');
const userRepository = require('../repositories/user.repository');
const orgRepository = require('../repositories/organization.repository');

/**
 * GET /admin/users
 * Returns filtered list of users for admin panel.
 * Query params: search, role, status
 */
const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const allowedRoles = ['volunteer', 'organization', 'admin'];
    if (role && role !== 'all' && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role filter' });
    }
    const users = await userRepository.findAllWithFilters({
      search,
      role,
      status,
      attributes: ['user_id', 'full_name', 'email', 'role', 'status', 'created_at'],
      include: [{ association: 'organization', attributes: ['status', 'org_id'] }],
      order: [['created_at', 'DESC']],
    });

    // Sanitize each user to keep response shape consistent across the app.
    const sanitized = users.map((u) => userService.sanitizeUser(u));
    res.status(200).json(sanitized);
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * PATCH /admin/users/:id/status
 * Updates a user's status (active, suspended, banned).
 */
const updateUserStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const allowed = ['active', 'inactive', 'banned'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    await userService.update(id, { status });
    const updated = await userService.findById(id);
    res.status(200).json(userService.sanitizeUser(updated));
  } catch (error) {
    console.error('UPDATE USER STATUS ERROR:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
+ * PATCH /admin/users/:id/verification
+ * Updates an organization's verification status (approved, rejected, pending).
+ * The organization is linked via owner_id == user_id.
+ */
const updateOrgVerification = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const allowed = ['approved', 'rejected', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }
    const org = await orgRepository.findByOwnerId(id);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    await orgRepository.update(org.org_id, { status });
    // Return updated organization (optional)
    const refreshed = await orgRepository.findById(org.org_id);
    res.status(200).json({ message: 'Organization verification updated', organization: refreshed });
  } catch (error) {
    console.error('UPDATE ORG VERIFICATION ERROR:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
+ * DELETE /admin/users/:id
+ * Deletes a user and cascades related records.
+ */
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove related organization (if any)
    const org = await orgRepository.findByOwnerId(id);
    if (org) {
      await orgRepository.remove(org.org_id);
    }

    // Remove volunteer profile
    await db.VolunteerProfile.destroy({ where: { user_id: id } });

    // Remove applications
    await db.Application.destroy({ where: { user_id: id } });

    // Finally delete the user
    await userService.remove(id);

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    // If a foreign‑key error slips through, translate to 409
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'Cannot delete user due to existing related records' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { getUsers, updateUserStatus, updateOrgVerification, deleteUser };
