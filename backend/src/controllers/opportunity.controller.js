const opportunityService = require('../services/opportunity.service');

const list = async (req, res) => {
  try {
    const { search, skill, location, orgId, page, limit } = req.query;
    const result = await opportunityService.findAll({
      search, skill, location, orgId: orgId ? parseInt(orgId) : undefined,
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 20, 100),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const opp = await opportunityService.findById(parseInt(req.params.id));
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, requirements, benefits, location, org_id } = req.body;
    if (!title || !org_id) {
      return res.status(400).json({ message: 'Title and org_id are required' });
    }
    const opp = await opportunityService.create({
      title,
      description: description || null,
      requirements: requirements || null,
      benefits: benefits || null,
      location: location || null,
      org_id: parseInt(org_id),
      status: 'open',
    });
    res.status(201).json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const opp = await opportunityService.update(parseInt(req.params.id), req.body);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await opportunityService.remove(parseInt(req.params.id));
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, getById, create, update, remove };
