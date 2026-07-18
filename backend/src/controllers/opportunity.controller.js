const opportunityService = require('../services/opportunity.service');
const db = require('../models');

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
    const { title, description, requirement, requirements, benefits, location, org_id, work_time, start_date, end_date, format, category_id, max_volunteers, image, customQuestions } = req.body;
    if (!title || !org_id) {
      return res.status(400).json({ message: 'Title and org_id are required' });
    }

    const org = await db.Organization.findByPk(parseInt(org_id));
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    if (org.owner_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: you do not own this organization' });
    }
    if (org.status !== 'approved') {
      return res.status(403).json({ message: 'Organization must be approved to create opportunities' });
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
      max_volunteers: max_volunteers !== undefined ? parseInt(max_volunteers) : null,
      image: image || null,
      customQuestions: customQuestions || [],
      status: 'open',
    });
    res.status(201).json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    // Verify ownership: only the organization owner or admin can modify
    const existingOpp = await opportunityService.findById(parseInt(req.params.id));
    if (!existingOpp) return res.status(404).json({ message: 'Opportunity not found' });
    if (req.user.role !== 'admin') {
      const org = await db.Organization.findOne({ where: { owner_id: req.user.user_id } });
      if (!org || existingOpp.org_id !== org.org_id) {
        return res.status(403).json({ message: 'Forbidden: you do not own this opportunity' });
      }
    }

    const data = { ...req.body };
    if (data.requirements) {
      data.requirement = data.requirements;
      delete data.requirements;
    }
    
    if (data.max_volunteers !== undefined) data.max_volunteers = parseInt(data.max_volunteers);
    const opp = await opportunityService.update(parseInt(req.params.id), data);
    res.json(opp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    // Verify ownership before deletion
    const existingOpp = await opportunityService.findById(parseInt(req.params.id));
    if (!existingOpp) return res.status(404).json({ message: 'Opportunity not found' });
    if (req.user.role !== 'admin') {
      const org = await db.Organization.findOne({ where: { owner_id: req.user.user_id } });
      if (!org || existingOpp.org_id !== org.org_id) {
        return res.status(403).json({ message: 'Forbidden: you do not own this opportunity' });
      }
    }
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

// FIX: Actually use interestSkillMap for personalized recommendations
const getRecommended = async (req, res) => {
  try {
    const { interests } = req.query;

    // If user passes interests, try to match skills
    if (interests) {
      const interestList = interests.split(',').map(i => i.trim().toLowerCase());
      const skillNames = new Set();
      for (const interest of interestList) {
        const skills = interestSkillMap[interest];
        if (skills) skills.forEach(s => skillNames.add(s));
      }

      if (skillNames.size > 0) {
        const db = require('../models');
        const { Skill } = db;
        const skillRecords = await Skill.findAll({
          where: { skill_name: { [require('sequelize').Op.in]: [...skillNames] } },
        });
        const skillIds = skillRecords.map(s => s.skill_id);

        if (skillIds.length > 0) {
          const recommended = await opportunityService.findRecommended(skillIds);
          return res.json(recommended);
        }
      }
    }

    // Fallback: return latest 10 open opportunities
    const all = await opportunityService.findAll({ page: 1, limit: 10 });
    return res.json(all.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, getById, create, update, remove, getRecommended };
