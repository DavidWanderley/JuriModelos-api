const sequelize = require('../config/database');

const Evento = require('./Evento');
const User = require('./User');
const Cliente = require('./Cliente');
const Modelo = require('./Modelo');
const Template = require('./Template');
const DocumentoGerado = require('./DocumentoGerado');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Escritorio = require('./Escritorio');

// Escritorio associations
Escritorio.hasMany(User, { foreignKey: 'EscritorioId', onDelete: 'SET NULL' });
User.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

Escritorio.hasMany(Cliente, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Cliente.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

Escritorio.hasMany(Modelo, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Modelo.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

Escritorio.hasMany(Evento, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Evento.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

Escritorio.hasMany(DocumentoGerado, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
DocumentoGerado.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

Escritorio.hasMany(Template, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Template.belongsTo(Escritorio, { foreignKey: 'EscritorioId', as: 'escritorio' });

// User associations
User.hasMany(DocumentoGerado, { foreignKey: 'UserId', onDelete: 'CASCADE' });
DocumentoGerado.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Cliente, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Cliente.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Evento, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Evento.belongsTo(User, { foreignKey: 'UserId' });

// Cliente associations
DocumentoGerado.belongsTo(Cliente, { foreignKey: 'ClienteId', as: 'cliente' });
Cliente.hasMany(DocumentoGerado, { foreignKey: 'ClienteId' });

// Role/Permission associations
User.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'RoleId' });

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
  Evento,
  Escritorio,
};
