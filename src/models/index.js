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
const AcessoIndividual = require('./AcessoIndividual');
const Prazo = require('./Prazo');
const Notificacao = require('./Notificacao');
const Processo = require('./Processo');

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

// AcessoIndividual associations
User.hasMany(AcessoIndividual, { foreignKey: 'UserId', onDelete: 'CASCADE' });
AcessoIndividual.belongsTo(User, { foreignKey: 'UserId' });

// Processo associations
Escritorio.hasMany(Processo, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Processo.belongsTo(Escritorio, { foreignKey: 'EscritorioId' });
User.hasMany(Processo, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Processo.belongsTo(User, { foreignKey: 'UserId' });
Cliente.hasMany(Processo, { foreignKey: 'ClienteId', onDelete: 'SET NULL' });
Processo.belongsTo(Cliente, { foreignKey: 'ClienteId', as: 'cliente' });
Modelo.hasMany(Processo, { foreignKey: 'ModeloId', onDelete: 'SET NULL' });
Processo.belongsTo(Modelo, { foreignKey: 'ModeloId', as: 'modelo' });
Processo.hasMany(Prazo, { foreignKey: 'ProcessoId', onDelete: 'CASCADE' });
Prazo.belongsTo(Processo, { foreignKey: 'ProcessoId', as: 'processo' });

// Prazo associations
User.hasMany(Prazo, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Prazo.belongsTo(User, { foreignKey: 'UserId' });
Escritorio.hasMany(Prazo, { foreignKey: 'EscritorioId', onDelete: 'CASCADE' });
Prazo.belongsTo(Escritorio, { foreignKey: 'EscritorioId' });
Cliente.hasMany(Prazo, { foreignKey: 'ClienteId', onDelete: 'SET NULL' });
Prazo.belongsTo(Cliente, { foreignKey: 'ClienteId', as: 'cliente' });
Modelo.hasMany(Prazo, { foreignKey: 'ModeloId', onDelete: 'SET NULL' });
Prazo.belongsTo(Modelo, { foreignKey: 'ModeloId', as: 'modelo' });

// Notificacao associations
User.hasMany(Notificacao, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Notificacao.belongsTo(User, { foreignKey: 'UserId' });
Prazo.hasMany(Notificacao, { foreignKey: 'PrazoId', onDelete: 'CASCADE' });
Notificacao.belongsTo(Prazo, { foreignKey: 'PrazoId', as: 'prazo' });

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
  AcessoIndividual,
  Prazo,
  Notificacao,
  Processo,
};
