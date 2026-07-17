'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "Application"
      SET interview_info = acceptance_info,
          acceptance_info = NULL
      WHERE status = 'interview'
        AND acceptance_info IS NOT NULL
        AND interview_info IS NULL
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "Application"
      SET acceptance_info = interview_info,
          interview_info = NULL
      WHERE status = 'interview'
        AND interview_info IS NOT NULL
        AND acceptance_info IS NULL
    `);
  },
};
