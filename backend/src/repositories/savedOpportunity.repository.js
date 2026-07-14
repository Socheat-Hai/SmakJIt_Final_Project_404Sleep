const db = require('../models');
const { SavedOpportunity, Opportunity, Organization } = db;

const create = async (data) => {
  return SavedOpportunity.create(data);
};

const remove = async (userId, oppId) => {
  return SavedOpportunity.destroy({ where: { user_id: userId, opp_id: oppId } });
};

const findByUser = async (userId) => {
return SavedOpportunity.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Opportunity,
          as: 'opportunity',
        },
      ],
      order: [['saved_at', 'DESC']],
    });
};

module.exports = { create, remove, findByUser };
