'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SavedOpportunity', {
      saved_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      opp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Opportunity', key: 'opp_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      saved_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('SavedOpportunity', {
      fields: ['user_id', 'opp_id'],
      type: 'unique',
      name: 'uq_saved_opportunity_user_opp',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SavedOpportunity');
  },
};
