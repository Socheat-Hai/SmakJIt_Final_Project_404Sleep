'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "Application" SET status = 'submitted' WHERE status = 'received'`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE "Application" SET status = 'received' WHERE status = 'submitted'`
    );
  },
};
