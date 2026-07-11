'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ApplicationAnswer', {
      answer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Application', key: 'application_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('ApplicationAnswer', ['application_id'], {
      name: 'application_answer_app_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ApplicationAnswer');
  },
};
