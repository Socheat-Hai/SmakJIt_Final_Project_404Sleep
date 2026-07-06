const db = require('../models');
const { Category } = db;
const { literal } = require('sequelize');

const findAll = async () => {
  return Category.findAll({ order: [['category_name', 'ASC']] });
};

const findAllWithCounts = async () => {
  return Category.findAll({
    attributes: {
      include: [
        [
          literal('(SELECT COUNT(*) FROM "Opportunity" WHERE "Opportunity"."category_id" = "Category"."category_id")'),
          'opportunityCount',
        ],
      ],
    },
    order: [['category_name', 'ASC']],
  });
};

const findById = async (id) => {
  return Category.findByPk(id);
};

module.exports = { findAll, findAllWithCounts, findById };
