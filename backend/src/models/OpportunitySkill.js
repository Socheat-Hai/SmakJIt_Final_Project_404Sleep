const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OpportunitySkill extends Model {
    static associate(models) {
      OpportunitySkill.belongsTo(models.Opportunity, { foreignKey: 'opp_id', as: 'opportunity' });
      OpportunitySkill.belongsTo(models.Skill, { foreignKey: 'skill_id', as: 'skill' });
    }
  }

  OpportunitySkill.init(
    {
      opp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OpportunitySkill',
      tableName: 'OpportunitySkill',
      timestamps: false,
    }
  );

  return OpportunitySkill;
};
