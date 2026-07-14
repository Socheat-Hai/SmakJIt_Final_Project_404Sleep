'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = ['organizations', 'opportunities', 'applications'];
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
    const tables = ['organizations', 'opportunities', 'applications'];
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        ALTER TABLE "${table}" ALTER COLUMN "updated_at" SET NOT NULL
      `);
    }
  },
};
