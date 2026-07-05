const applicationService = require("../services/application.service");
const emailService = require("../services/email.service");
const db = require("../models");
const { VolunteerProfile, Application, User, Opportunity } = db;

const submit = async (req, res) => {
  try {
    const { opp_id } = req.body;
    if (!opp_id) {
      return res.status(400).json({ message: "opp_id is required" });
    }

    const volunteer = await VolunteerProfile.findOne({
      where: { user_id: req.user.user_id },
    });
    if (!volunteer) {
      return res.status(400).json({ message: "Only volunteers can apply" });
    }

    const app = await applicationService.create({
      user_id: volunteer.user_id,
      opp_id: parseInt(opp_id),
    });

    res.status(201).json(app);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "You have already applied to this opportunity" });
    }
    res.status(500).json({ message: error.message });
  }
};

const myApplications = async (req, res) => {
  try {
    const volunteer = await VolunteerProfile.findOne({
      where: { user_id: req.user.user_id },
    });
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
    const apps = await applicationService.findByOpportunity(
      parseInt(req.params.oppId),
    );
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const review = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be accepted or rejected" });
    }
    const app = await applicationService.updateStatus(
      parseInt(req.params.id),
      status,
    );
    if (!app) return res.status(404).json({ message: "Application not found" });

    const fullApp = await Application.findByPk(parseInt(req.params.id), {
      include: [
        { model: Opportunity, as: 'opportunity', attributes: ['title'] },
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
      ],
    });

    if (fullApp?.user?.email) {
      await emailService.sendApplicationStatus(
        fullApp.user.email,
        fullApp.user.full_name,
        fullApp.opportunity.title,
        status,
      );
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submit, myApplications, listByOpportunity, review };
