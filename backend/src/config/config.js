require('dotenv').config();

const defaultConfig = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    freezeTableName: true,
  },
};

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    ...defaultConfig,
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    ...defaultConfig,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ...defaultConfig,
  },
};
