'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminProfile extends Model {
    static associate(models) {
      AdminProfile.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  AdminProfile.init({
    admin_profile_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.INTEGER,
    phone_num: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AdminProfile',
    tableName: 'AdminProfile',
  });
  return AdminProfile;
};