'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Opportunity', 'questions');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Opportunity', 'questions', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },
};