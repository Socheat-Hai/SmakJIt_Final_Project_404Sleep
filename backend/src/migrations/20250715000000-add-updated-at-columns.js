'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add updated_at column to tables that lack it
    const tables = ['users', 'Organization', 'Opportunity', 'Application'];
    for (const table of tables) {
      await queryInterface.addColumn(table, 'updated_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      });
    }
  },

  async down(queryInterface) {
    // Remove updated_at column if it exists
    const tables = ['users', 'Organization', 'Opportunity', 'Application'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "updated_at"`);
    }
  },
};
