'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE "Opportunity" SET "external_link" = NULL WHERE "external_link" IS NOT NULL`
    );
    const tableInfo = await queryInterface.describeTable('Opportunity');
    if (tableInfo.external_link) {
      await queryInterface.removeColumn('Opportunity', 'external_link');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Opportunity', 'external_link', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },
};
