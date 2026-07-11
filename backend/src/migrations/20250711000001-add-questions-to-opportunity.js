'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Opportunity');
    if (!table.questions) {
      await queryInterface.addColumn('Opportunity', 'questions', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Opportunity', 'questions');
  },
};
