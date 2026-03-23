const sequelize = require('../config/database');

// Importar todos os modelos
const Evento = require('./Evento');
const User = require('./User');
const Cliente = require('./Cliente');
const Modelo = require('./Modelo');
const Template = require('./Template');
const DocumentoGerado = require('./DocumentoGerado');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');

// Definir relacionamentos User
User.hasMany(DocumentoGerado, { foreignKey: 'UserId', onDelete: 'CASCADE' });
DocumentoGerado.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Cliente, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Cliente.belongsTo(User, { foreignKey: 'UserId' });

User.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'RoleId' });

// Definir relacionamentos Role-Permission (Many-to-Many)
Role.belongsToMany(Permission, { 
  through: RolePermission, 
  foreignKey: 'RoleId',
  as: 'permissions'
});

Permission.belongsToMany(Role, { 
  through: RolePermission, 
  foreignKey: 'PermissionId',
  as: 'roles'
});

// Exportar modelos e sequelize
module.exports = {
  sequelize,
  User,
  Cliente,
  Modelo,
  Template,
  DocumentoGerado,
  Role,
  Permission,
  RolePermission,
  Evento
};
