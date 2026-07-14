const {sequelize}=require('./src/models');
sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name', {type: sequelize.QueryTypes.SELECT})
  .then(r=>{console.log('Migrations:', r);})
  .catch(e=>{console.error('Error', e);});
