'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "Application" SET status = 'submitted' WHERE status = 'pending'`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "Application" SET status = 'pending' WHERE status = 'submitted'`
    );
  },
};
