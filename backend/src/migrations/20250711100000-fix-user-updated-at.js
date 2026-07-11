'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Models use timestamps:true but updatedAt:false, so Sequelize never populates updated_at.
    // Fix all tables that have updated_at NOT NULL.
    const tables = ['User', 'Organization', 'Opportunity', 'Application'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}" ALTER COLUMN "updated_at" DROP NOT NULL
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}" ALTER COLUMN "updated_at" SET DEFAULT NOW()
      `);
    }
  },

  async down(queryInterface) {
    const tables = ['User', 'Organization', 'Opportunity', 'Application'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}" ALTER COLUMN "updated_at" SET NOT NULL
      `);
    }
  },
};
