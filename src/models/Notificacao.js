const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacao = sequelize.define('Notificacao', {
  mensagem: { type: DataTypes.STRING,  allowNull: false },
  lida:     { type: DataTypes.BOOLEAN, defaultValue: false },
  tipo:     { type: DataTypes.STRING,  defaultValue: 'prazo' },
  UserId:   { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users',  key: 'id' } },
  PrazoId:  { type: DataTypes.INTEGER, allowNull: true,  references: { model: 'Prazos', key: 'id' } },
}, { paranoid: true });

module.exports = Notificacao;
