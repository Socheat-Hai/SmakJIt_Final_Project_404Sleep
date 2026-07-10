const orgService = require('../services/org.service');

const register = async (req, res) => {
  try {
    const { name, email, phone, address, bio, website, social_link, description, contact_email, contact_phone, location } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const existing = await orgService.findByUserId(req.user.user_id);
    let org;
    if (existing) {
      org = await orgService.update(existing.org_id, { name, email, phone, address, bio, website, social_link, description, contact_email, contact_phone, location });
    } else {
      org = await orgService.create({
        user_id: req.user.user_id,
        name, email: email || contact_email, phone: phone || contact_phone, address, bio, website, social_link, description,
      });
    }
    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const orgs = await orgService.findAll(status);
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const org = await orgService.findById(parseInt(req.params.id));
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const org = await orgService.update(parseInt(req.params.id), req.body);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrg = async (req, res) => {
  try {
    const org = await orgService.findByUserId(req.user.user_id);
    if (!org) return res.status(404).json({ message: 'No organization found for this account' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, getAll, getById, update, getMyOrg };
