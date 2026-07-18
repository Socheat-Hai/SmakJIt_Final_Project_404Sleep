'use strict';

/** @type {import('sequelize-cli').Migration} */
// in the generated migration file
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('ApplicationAnswer', 'question_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ApplicationAnswer', 'question_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};

