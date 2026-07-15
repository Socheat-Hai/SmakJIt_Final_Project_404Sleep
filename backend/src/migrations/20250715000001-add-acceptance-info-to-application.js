'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Application');
    if (!table.acceptance_info) {
      await queryInterface.addColumn('Application', 'acceptance_info', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Application', 'acceptance_info');
  },
};
