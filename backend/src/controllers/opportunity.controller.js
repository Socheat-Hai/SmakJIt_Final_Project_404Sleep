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

const interestCategoryMap = {
  teaching: 'Education',
  healthcare: 'Healthcare',
  environment: 'Environment',
  animals: 'Environment',
  arts: 'Arts & Culture',
  technology: 'Technology',
  construction: 'Community Development',
  food: 'Community Development',
  sports: 'Community Development',
  music: 'Arts & Culture',
  elderly: 'Healthcare',
  youth: 'Education',
  fundraising: 'Community Development',
  legal: 'Community Development',
  marketing: 'Community Development',
  photography: 'Arts & Culture',
  'mental-health': 'Healthcare',
  disability: 'Healthcare',
  international: 'Community Development',
  disaster: 'Community Development',
};

const getRecommended = async (req, res) => {
  try {
    const { Skill, Category } = db;
    const skillIdsSet = new Set();
    const categoryNames = new Set();
    let allInterests = [];

    // 1. Load volunteer profile if logged in
    let profile = null;
    if (req.user?.user_id) {
      profile = await db.VolunteerProfile.findOne({ where: { user_id: req.user.user_id } });

      // Direct volunteer skills
      if (profile?.skills && profile.skills.length > 0) {
        const skillNames = profile.skills.map(s => (typeof s === 'string' ? s : s.skill_name));
        const skillRecords = await Skill.findAll({
          where: { skill_name: { [require('sequelize').Op.in]: skillNames } },
        });
        skillRecords.forEach(s => skillIdsSet.add(s.skill_id));
      }

      // Collect interests from profile
      if (profile?.interests && profile.interests.length > 0) {
        allInterests = profile.interests.map(i => i.trim().toLowerCase());
      }
    }

    // 2. Also support explicit ?interests= query param (overrides profile interests)
    if (req.query.interests) {
      allInterests = req.query.interests.split(',').map(i => i.trim().toLowerCase());
    }

    // 3. Map interests → skill IDs (secondary signal)
    const interestSkillNames = new Set();
    for (const interest of allInterests) {
      const skills = interestSkillMap[interest];
      if (skills) skills.forEach(s => interestSkillNames.add(s));
    }
    if (interestSkillNames.size > 0) {
      const skillRecords = await Skill.findAll({
        where: { skill_name: { [require('sequelize').Op.in]: [...interestSkillNames] } },
      });
      skillRecords.forEach(s => skillIdsSet.add(s.skill_id));
    }

    // 4. Map interests → category names (primary signal — most direct match)
    for (const interest of allInterests) {
      const catName = interestCategoryMap[interest];
      if (catName) categoryNames.add(catName);
    }

    const skillIds = [...skillIdsSet];
    const catNames = [...categoryNames];

    if (skillIds.length > 0 || catNames.length > 0) {
      const recommended = await opportunityService.findRecommended(skillIds, catNames);
      return res.json(recommended);
    }

    // Fallback: return latest open opportunities
    const all = await opportunityService.findAll({ page: 1, limit: 10 });
    return res.json(all.data);
  } catch (error) {
    console.error('[Recommended] error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, getById, create, update, remove, getRecommended };
