const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      Skill.hasMany(models.OpportunitySkill, { foreignKey: 'skill_id', as: 'opportunitySkills' });
    }
  }

  Skill.init(
    {
      skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skill_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Skill',
      tableName: 'Skill',
      timestamps: false,
    }
  );

  return Skill;
};
