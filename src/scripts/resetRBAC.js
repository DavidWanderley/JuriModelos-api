const { sequelize } = require('../models');

const resetRBACTables = async () => {
  try {
    console.log('🔄 Iniciando reset das tabelas RBAC...');

    await sequelize.query('DROP TABLE IF EXISTS "RolePermissions" CASCADE;');
    console.log('✅ Tabela RolePermissions dropada');

    await sequelize.query('DROP TABLE IF EXISTS "permissions" CASCADE;');
    console.log('✅ Tabela permissions dropada');

    await sequelize.query('DROP TABLE IF EXISTS "roles" CASCADE;');
    console.log('✅ Tabela roles dropada');

    await sequelize.query('ALTER TABLE "Users" DROP COLUMN IF EXISTS "perfil";');
    console.log('✅ Coluna perfil removida de Users');

    await sequelize.query('ALTER TABLE "Users" DROP COLUMN IF EXISTS "RoleId";');
    console.log('✅ Coluna RoleId removida de Users (se existia)');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas recriadas com sucesso!');

    console.log('\n📋 Próximos passos:');
    console.log('1. npm run seed    - Criar roles e permissions');
    console.log('2. npm run migrate - Atualizar usuários existentes');
    console.log('3. npm start       - Iniciar servidor\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro no reset:', error);
    process.exit(1);
  }
};

resetRBACTables();
