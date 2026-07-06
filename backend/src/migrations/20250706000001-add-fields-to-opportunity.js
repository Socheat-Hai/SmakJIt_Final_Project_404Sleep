'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Opportunity');
    if (!tableInfo.max_volunteers) {
      await queryInterface.addColumn('Opportunity', 'max_volunteers', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (!tableInfo.external_link) {
      await queryInterface.addColumn('Opportunity', 'external_link', {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Opportunity', 'max_volunteers');
    await queryInterface.removeColumn('Opportunity', 'external_link');
  },
};
