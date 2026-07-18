const db = require('../models');
const applicationService = require('../services/application.service');
const opportunityService = require('../services/opportunity.service');
const userService = require('../services/user.service');


const submit = async (req, res) => {
  try {
    const { opp_id, answers } = req.body;
    if (!opp_id) {
      return res.status(400).json({ message: 'opp_id is required' });
    }

    let volunteer = await userService.findVolunteerProfile(req.user.user_id);
    if (!volunteer) {
      if (req.user.role === 'volunteer') {
        const { VolunteerProfile } = db;
        volunteer = await VolunteerProfile.create({ user_id: req.user.user_id });
      } else {
        return res.status(400).json({ message: 'Only volunteers can apply' });
      }
    }

    const opportunity = await opportunityService.findById(parseInt(opp_id));
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status === 'closed') {
      return res.status(400).json({ message: 'Applications are closed for this opportunity' });
    }

    if (opportunity.end_date && new Date(opportunity.end_date) < new Date()) {
      return res.status(400).json({ message: 'The application deadline has passed' });
    }

    const questions = opportunity.customQuestions || opportunity.questions || [];
    if (answers && answers.length > 0 && questions.length > 0) {
      const requiredQuestions = questions.filter((q) => q.required);
      const answeredTexts = new Set(answers.map((a) => a.question_text));
      const missing = requiredQuestions.filter((q) => !answeredTexts.has(q.text));
      if (missing.length > 0) {
        return res.status(400).json({
          message: 'Missing required answers',
          missing_questions: missing.map((q) => ({ text: q.text })),
        });
      }
    }

    const app = await applicationService.create({
      user_id: req.user.user_id,
      opp_id: parseInt(opp_id),
      answers: answers || [],
    });

    res.status(201).json(app);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(409)
        .json({ message: 'You have already applied to this opportunity' });
    }
    console.error('POST /api/applications error:', error);
    res.status(500).json({ message: error.message });
  }
};

const myApplications = async (req, res) => {
  try {
    const volunteer = await userService.findVolunteerProfile(req.user.user_id);
    if (!volunteer) {
      return res.json([]);
    }
    const apps = await applicationService.findByUser(req.user.user_id);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listByOpportunity = async (req, res) => {
  try {
    const apps = await applicationService.findByOpportunity(parseInt(req.params.oppId));
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnswers = async (req, res) => {
  try {
    const app = await applicationService.findById(parseInt(req.params.id));
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(app.answers || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStage = async (req, res) => {
  try {
    if (req.user.role !== 'organization') {
      return res.status(403).json({ message: 'Only organizations can update application status' });
    }

    const { status, acceptance_info, interview_info } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    if (!applicationService.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${applicationService.VALID_STATUSES.join(', ')}`,
      });
    }

    if (status === 'accepted' && !acceptance_info) {
      return res.status(400).json({ message: 'acceptance_info is required when accepting' });
    }

    if (status === 'interview' && !interview_info) {
      return res.status(400).json({ message: 'interview_info is required when scheduling an interview' });
    }

    const app = await applicationService.findById(parseInt(req.params.id));
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const org = await db.Organization.findOne({ where: { owner_id: req.user.user_id } });
    if (!org) {
      return res.status(403).json({ message: 'Organization profile not found' });
    }

    const opportunity = await opportunityService.findById(app.opp_id);
    if (!opportunity || opportunity.org_id !== org.org_id) {
      return res.status(403).json({ message: 'You can only update applications for your own opportunities' });
    }

    const updated = await applicationService.updateStatus(
      parseInt(req.params.id),
      status,
      acceptance_info || null,
      interview_info || null,
    );
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const orgApplications = async (req, res) => {
  try {
    const org = await db.Organization.findOne({ where: { owner_id: req.user.user_id } });
    if (!org) {
      return res.status(400).json({ message: 'Organization profile not found' });
    }
    const apps = await applicationService.findByOrganization(org.org_id);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submit, myApplications, listByOpportunity, getAnswers, updateStage, orgApplications };
