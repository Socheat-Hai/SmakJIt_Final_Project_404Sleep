'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Application');
    if (!table.interview_info) {
      await queryInterface.addColumn('Application', 'interview_info', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Application', 'interview_info');
  },
};
