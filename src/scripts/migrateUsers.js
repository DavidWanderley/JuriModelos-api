require('dotenv').config();
const { sequelize, User, Role } = require('../models');

const migrateUsers = async () => {
  try {
    console.log('🔄 Iniciando migração de usuários...');

    await sequelize.sync({ alter: true });

    const advogadoRole = await Role.findOne({ where: { name: 'advogado' } });
    
    if (!advogadoRole) {
      console.log('⚠️ Execute o seed primeiro: npm run seed');
      return;
    }

    const usersWithoutRole = await User.findAll({
      where: { RoleId: null }
    });

    for (const user of usersWithoutRole) {
      await user.update({ RoleId: advogadoRole.id });
      console.log(`✅ Usuário ${user.email} atualizado com perfil advogado`);
    }

    console.log(`🎉 Migração concluída! ${usersWithoutRole.length} usuários atualizados`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateUsers();
