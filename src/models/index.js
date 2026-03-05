const sequelize = require('../config/database');

// Importar todos os modelos
const User = require('./User');
const Cliente = require('./Cliente');
const Modelo = require('./Modelo');
const DocumentoGerado = require('./DocumentoGerado');

// Definir relacionamentos
User.hasMany(DocumentoGerado, { foreignKey: 'UserId', onDelete: 'CASCADE' });
DocumentoGerado.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Cliente, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Cliente.belongsTo(User, { foreignKey: 'UserId' });

// Exportar modelos e sequelize
module.exports = {
  sequelize,
  User,
  Cliente,
  Modelo,
  DocumentoGerado
};
