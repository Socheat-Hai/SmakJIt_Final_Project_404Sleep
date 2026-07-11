const applicationService = require('../services/application.service');
const opportunityService = require('../services/opportunity.service');
const userService = require('../services/user.service');
const emailService = require('../services/email.service');

const submit = async (req, res) => {
  try {
    const { opp_id, answers } = req.body;
    if (!opp_id) {
      return res.status(400).json({ message: 'opp_id is required' });
    }

    const volunteer = await userService.findVolunteerProfile(req.user.user_id);
    if (!volunteer) {
      return res.status(400).json({ message: 'Only volunteers can apply' });
    }

    const opportunity = await opportunityService.findById(parseInt(opp_id));
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (answers && answers.length > 0 && opportunity.questions) {
      const requiredQuestions = opportunity.questions.filter((q) => q.required);
      const answeredIds = new Set(answers.map((a) => a.question_id));
      const missing = requiredQuestions.filter((q) => !answeredIds.has(q.question_id));
      if (missing.length > 0) {
        return res.status(400).json({
          message: 'Missing required answers',
          missing_questions: missing.map((q) => ({ question_id: q.question_id, text: q.text })),
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
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    if (!applicationService.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${applicationService.VALID_STATUSES.join(', ')}`,
      });
    }

    const app = await applicationService.updateStatus(parseInt(req.params.id), status);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status === 'accepted' || status === 'rejected') {
      if (app?.user?.email) {
        await emailService.sendApplicationStatus(
          app.user.email,
          app.user.full_name,
          app.opportunity.title,
          status,
        );
      }
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submit, myApplications, listByOpportunity, getAnswers, updateStage };
