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
    timestamps: false,
    freezeTableName: true,
  },
  benchmark: true,
  logging: (sql, timing) => console.log(`⏱️  ${timing}ms: ${sql}`),
  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 10000,
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
