const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {
      Organization.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
      Organization.hasMany(models.Opportunity, { foreignKey: 'org_id', as: 'opportunities' });
    }
  }

  Organization.init(
    {
      org_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contact_email: DataTypes.STRING(255),
      contact_phone: DataTypes.STRING(50),
      location: DataTypes.TEXT,
      description: DataTypes.TEXT,
      website: DataTypes.STRING(255),
      logo: DataTypes.STRING(255),
      social_link: DataTypes.STRING(255),
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Organization',
      tableName: 'Organization',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Organization;
};
