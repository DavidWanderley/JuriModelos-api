const { Role, Permission, RolePermission } = require('../models');

const seedPermissionsAndRoles = async () => {
  try {
    console.log('🌱 Iniciando seed de permissões e perfis...');

    const permissions = [
      // Clientes
      { name: 'clientes.create', description: 'Criar clientes', resource: 'clientes', action: 'create' },
      { name: 'clientes.read', description: 'Visualizar clientes', resource: 'clientes', action: 'read' },
      { name: 'clientes.update', description: 'Editar clientes', resource: 'clientes', action: 'update' },
      { name: 'clientes.delete', description: 'Deletar clientes', resource: 'clientes', action: 'delete' },
      { name: 'clientes.list', description: 'Listar clientes', resource: 'clientes', action: 'list' },
      
      // Modelos
      { name: 'modelos.create', description: 'Criar modelos', resource: 'modelos', action: 'create' },
      { name: 'modelos.read', description: 'Visualizar modelos', resource: 'modelos', action: 'read' },
      { name: 'modelos.update', description: 'Editar modelos', resource: 'modelos', action: 'update' },
      { name: 'modelos.delete', description: 'Deletar modelos', resource: 'modelos', action: 'delete' },
      { name: 'modelos.list', description: 'Listar modelos', resource: 'modelos', action: 'list' },
      
      // Templates
      { name: 'templates.create', description: 'Criar templates', resource: 'templates', action: 'create' },
      { name: 'templates.read', description: 'Visualizar templates', resource: 'templates', action: 'read' },
      { name: 'templates.update', description: 'Editar templates', resource: 'templates', action: 'update' },
      { name: 'templates.delete', description: 'Deletar templates', resource: 'templates', action: 'delete' },
      { name: 'templates.list', description: 'Listar templates', resource: 'templates', action: 'list' },
      
      // Documentos
      { name: 'documentos.create', description: 'Gerar documentos', resource: 'documentos', action: 'create' },
      { name: 'documentos.read', description: 'Visualizar documentos', resource: 'documentos', action: 'read' },
      { name: 'documentos.delete', description: 'Deletar documentos', resource: 'documentos', action: 'delete' },
      { name: 'documentos.list', description: 'Listar documentos', resource: 'documentos', action: 'list' },
      
      // Usuários
      { name: 'usuarios.create', description: 'Criar usuários', resource: 'usuarios', action: 'create' },
      { name: 'usuarios.read', description: 'Visualizar usuários', resource: 'usuarios', action: 'read' },
      { name: 'usuarios.update', description: 'Editar usuários', resource: 'usuarios', action: 'update' },
      { name: 'usuarios.delete', description: 'Deletar usuários', resource: 'usuarios', action: 'delete' },
      { name: 'usuarios.list', description: 'Listar usuários', resource: 'usuarios', action: 'list' },
      
      // Configurações
      { name: 'config.manage', description: 'Gerenciar configurações do sistema', resource: 'config', action: 'manage' },
    ];

    for (const perm of permissions) {
      await Permission.findOrCreate({
        where: { name: perm.name },
        defaults: perm
      });
    }

    console.log(`✅ ${permissions.length} permissões criadas/verificadas`);

    const roles = [
      { name: 'admin', description: 'Administrador - Acesso total ao sistema', level: 100 },
      { name: 'advogado', description: 'Advogado - Acesso completo aos recursos jurídicos', level: 50 },
      { name: 'estagiario', description: 'Estagiário - Acesso limitado para consulta', level: 10 },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
    }

    console.log(`✅ ${roles.length} perfis criados/verificados`);

    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const advogadoRole = await Role.findOne({ where: { name: 'advogado' } });
    const estagiarioRole = await Role.findOne({ where: { name: 'estagiario' } });

    const allPermissions = await Permission.findAll();

    await adminRole.setPermissions(allPermissions);

    const advogadoPermissions = allPermissions.filter(p => 
      !p.resource.includes('usuarios') && !p.resource.includes('config')
    );
    await advogadoRole.setPermissions(advogadoPermissions);

    const estagiarioPermissions = allPermissions.filter(p => 
      (p.action === 'read' || p.action === 'list') ||
      (p.resource === 'documentos' && p.action === 'create')
    );
    await estagiarioRole.setPermissions(estagiarioPermissions);

    console.log('✅ Permissões atribuídas aos perfis');
    console.log('🎉 Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
};

module.exports = seedPermissionsAndRoles;
