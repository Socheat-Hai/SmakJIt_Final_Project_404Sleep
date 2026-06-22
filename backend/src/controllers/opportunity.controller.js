const opportunityService = require('../services/opportunity.service');
const prisma = require('../lib/prisma');

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
    const { title, description, requirements, benefits, location, org_id, work_time, start_date, end_date, format, max_volunteers, external_link, image } = req.body;
    if (!title || !org_id) {
      return res.status(400).json({ message: 'Title and org_id are required' });
    }
    const opp = await opportunityService.create({
      title,
      description: description || null,
      requirements: requirements || null,
      benefits: benefits || null,
      location: location || null,
      work_time: work_time || null,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      format: format || null,
      max_volunteers: max_volunteers ? parseInt(max_volunteers) : null,
      external_link: external_link || null,
      image: image || null,
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
    const volunteer = await prisma.volunteer.findUnique({
      where: { user_id: req.user.user_id },
      include: { volunteer_skills: true },
    });

    let skillIds = [];
    if (volunteer?.volunteer_skills?.length) {
      skillIds = volunteer.volunteer_skills.map((vs) => vs.skill_id);
    } else if (volunteer?.interests) {
      const interests = JSON.parse(volunteer.interests);
      const skillNames = interests.flatMap((id) => interestSkillMap[id] || []);
      if (skillNames.length) {
        const matchedSkills = await prisma.skill.findMany({
          where: { skill_name: { in: skillNames } },
        });
        skillIds = matchedSkills.map((s) => s.skill_id);
      }
    }

    if (!skillIds.length) {
      const all = await opportunityService.findAll({ page: 1, limit: 10 });
      return res.json(all.data);
    }

    const recommended = await opportunityService.findRecommended(skillIds);
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, getById, create, update, remove, getRecommended };
