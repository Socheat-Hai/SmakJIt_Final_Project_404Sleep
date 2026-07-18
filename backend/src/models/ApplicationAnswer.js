const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApplicationAnswer extends Model {
    static associate(models) {
      ApplicationAnswer.belongsTo(models.Application, { foreignKey: 'application_id', as: 'application' });
    }
  }

  ApplicationAnswer.init(
    {
      answer_id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      application_id: { type: DataTypes.INTEGER, allowNull: false },
      question_text:  { type: DataTypes.TEXT, allowNull: false },
      answer:         { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ApplicationAnswer',
      tableName: 'ApplicationAnswer',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return ApplicationAnswer;
};
