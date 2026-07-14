'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // No operation – `updated_at` columns are added by a later migration.
  },

  async down(queryInterface) {
    // No operation – column removal is handled in the add‑columns migration.
  },
};
