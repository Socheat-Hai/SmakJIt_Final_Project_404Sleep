const db = require('../models');
const { Application, ApplicationAnswer, Opportunity, Organization, User } = db;

const create = async (data, answers = [], transaction) => {
  const app = await Application.create(data, { transaction });
  if (answers.length > 0) {
    const answerRows = answers.map((a) => ({
      application_id: app.application_id,
      question_id: a.question_id,
      question_text: a.question_text,
      answer: a.answer,
    }));
    await ApplicationAnswer.bulkCreate(answerRows, { transaction });
  }
  return app;
};

const findById = async (id) => {
  return Application.findByPk(id, {
    include: [
      { model: Opportunity, as: 'opportunity' },
      { model: User, as: 'user' },
      { model: ApplicationAnswer, as: 'answers' },
    ],
  });
};

const findByUser = async (userId) => {
  return Application.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Opportunity,
        as: 'opportunity',
        include: [{ model: Organization, as: 'organization', attributes: ['org_id', 'name'] }],
      },
      { model: ApplicationAnswer, as: 'answers' },
    ],
    order: [['applied_at', 'DESC']],
  });
};

const findByOpportunity = async (oppId) => {
  return Application.findAll({
    where: { opp_id: oppId },
    include: [
      { model: User, as: 'user', attributes: ['user_id', 'full_name', 'email'] },
      { model: ApplicationAnswer, as: 'answers' },
    ],
    order: [['applied_at', 'DESC']],
  });
};

const updateStatus = async (id, status) => {
  return Application.update({ status }, { where: { application_id: id } });
};

const count = async (where = {}) => {
  return Application.count({ where });
};

const findAllWithIncludes = async ({ status, include, order } = {}) => {
  const where = {};
  if (status && status !== 'all') where.status = status;
  return Application.findAll({ where, include, order });
};

module.exports = { create, findById, findByUser, findByOpportunity, updateStatus, count, findAllWithIncludes };
