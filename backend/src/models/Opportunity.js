const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Opportunity extends Model {
    static associate(models) {
      Opportunity.belongsTo(models.Organization, { foreignKey: 'org_id', as: 'organization' });
      Opportunity.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
      Opportunity.hasMany(models.Application, { foreignKey: 'opp_id', as: 'applications' });
      Opportunity.hasMany(models.OpportunitySkill, { foreignKey: 'opp_id', as: 'skills' });
    }
  }

  Opportunity.init(
    {
      opp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      requirement: DataTypes.TEXT,
      benefits: DataTypes.TEXT,
      location: DataTypes.STRING(255),
      work_time: DataTypes.STRING(50),
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      format: DataTypes.STRING(50),
      org_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      posted_by: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      image: DataTypes.STRING(255),
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'open',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Opportunity',
      tableName: 'Opportunity',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Opportunity;
};
