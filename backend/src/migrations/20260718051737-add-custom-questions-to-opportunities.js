'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Opportunity', 'custom_questions', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Opportunity', 'custom_questions');
  }
};