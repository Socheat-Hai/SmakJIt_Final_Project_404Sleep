const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VolunteerProfile extends Model {
    static associate(models) {
      VolunteerProfile.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  VolunteerProfile.init(
    {
      profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      phone_num: DataTypes.STRING(50),
      profile_picture: DataTypes.STRING(255),
      date_of_birth: DataTypes.DATEONLY,
      location: DataTypes.STRING(255),
      gender: DataTypes.STRING(50),
      bio: DataTypes.TEXT,
      interests: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
        comment: 'Array of interest category IDs selected by the volunteer (e.g. ["teaching", "environment"])',
      },
    },
    {
      sequelize,
      modelName: 'VolunteerProfile',
      tableName: 'VolunteerProfile',
      timestamps: false,
    }
  );

  return VolunteerProfile;
};
