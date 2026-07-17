const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Application.belongsTo(models.Opportunity, { foreignKey: 'opp_id', as: 'opportunity' });
      Application.hasMany(models.ApplicationAnswer, { foreignKey: 'application_id', as: 'answers' });
    }
  }

  Application.init(
    {
      application_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'submitted',
      },
      applied_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      acceptance_info: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      interview_info: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Application',
      tableName: 'Application',
      timestamps: true,
      createdAt: 'applied_at',
      updatedAt: false,
    }
  );

  return Application;
};
