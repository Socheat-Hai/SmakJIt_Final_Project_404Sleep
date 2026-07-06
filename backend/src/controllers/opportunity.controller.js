const opportunityService = require('../services/opportunity.service');

const list = async (req, res) => {
  try {
    const { search, skill, location, orgId, categoryId, page, limit } = req.query;
    const result = await opportunityService.findAll({
      search, skill, location, categoryId,
      orgId: orgId ? parseInt(orgId) : undefined,
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
    const { title, description, requirement, requirements, benefits, location, org_id, work_time, start_date, end_date, format, category_id, max_volunteers, external_link } = req.body;
    if (!title || !org_id) {
      return res.status(400).json({ message: 'Title and org_id are required' });
    }
    const opp = await opportunityService.create({
      title,
      description: description || '',
      requirement: requirement || requirements || '',
      benefits: benefits || null,
      location: location || '',
      work_time: work_time || '',
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : new Date(),
      format: format || 'online',
      org_id: parseInt(org_id),
      posted_by: req.user.user_id,
      category_id: category_id ? parseInt(category_id) : 1,
      max_volunteers: max_volunteers ? parseInt(max_volunteers) : null,
      external_link: external_link || null,
      status: 'open',
    });
    res.status(201).json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.requirements) {
      data.requirement = data.requirements;
      delete data.requirements;
    }
    if (data.max_volunteers) data.max_volunteers = parseInt(data.max_volunteers);
    const opp = await opportunityService.update(parseInt(req.params.id), data);
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

const interestSkillMap = {
  teaching: ['Teaching', 'Mathematics', 'Communication', 'Coaching'],
  healthcare: ['Healthcare', 'First Aid', 'Empathy'],
  environment: ['Environment', 'Gardening', 'Logistics'],
  technology: ['Technology', 'Programming', 'JavaScript', 'Python', 'Attention to Detail'],
  arts: ['Photography', 'Communication', 'Attention to Detail'],
  elderly: ['Empathy', 'Communication', 'Patience'],
  animals: ['Animal Care', 'Patience', 'Teamwork'],
  sports: ['Sports', 'Coaching', 'Teamwork', 'First Aid'],
  food: ['Organization', 'Logistics', 'Teamwork'],
  community: ['Leadership', 'Organization', 'Teamwork', 'Communication'],
  disaster: ['First Aid', 'Logistics', 'Organization', 'Teamwork'],
  'mental-health': ['Healthcare', 'Empathy', 'Communication'],
  youth: ['Teaching', 'Coaching', 'Communication', 'Leadership'],
  legal: ['Communication', 'Organization', 'Attention to Detail'],
  international: ['Communication', 'Leadership', 'Teamwork'],
  disability: ['Empathy', 'Patience', 'Communication', 'Healthcare'],
  construction: ['Teamwork', 'Leadership', 'Logistics'],
  music: ['Communication', 'Teamwork', 'Teaching'],
  fundraising: ['Communication', 'Organization', 'Leadership'],
  marketing: ['Communication', 'Technology', 'Attention to Detail', 'Photography'],
  photography: ['Photography', 'Attention to Detail', 'Technology'],
};

const getRecommended = async (req, res) => {
  try {
    const all = await opportunityService.findAll({ page: 1, limit: 10 });
    return res.json(all.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, getById, create, update, remove, getRecommended };
