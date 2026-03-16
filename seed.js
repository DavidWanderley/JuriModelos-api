require('dotenv').config();
const { sequelize } = require('./src/models');
const seedPermissionsAndRoles = require('./src/seeders/permissionsSeeder');

const runSeed = async () => {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco!');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados!');

    await seedPermissionsAndRoles();

    console.log('\n✨ Seed executado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

runSeed();
