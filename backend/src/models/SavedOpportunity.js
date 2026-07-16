const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedOpportunity extends Model {
    static associate(models) {
      SavedOpportunity.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      SavedOpportunity.belongsTo(models.Opportunity, { foreignKey: 'opp_id', as: 'opportunity' });
    }
  }

  SavedOpportunity.init(
    {
      saved_id: {
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
      saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'SavedOpportunity',
      tableName: 'saved_opportunity',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'opp_id'],
        },
      ],
    }
  );

  return SavedOpportunity;
};
