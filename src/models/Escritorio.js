const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escritorio = sequelize.define('Escritorio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  cnpj: { type: DataTypes.STRING, allowNull: true, unique: true },
  email: { type: DataTypes.STRING, allowNull: true },
  telefone: { type: DataTypes.STRING, allowNull: true },
  plano: {
    type: DataTypes.ENUM('basico', 'profissional', 'enterprise'),
    defaultValue: 'basico',
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'escritorios',
  timestamps: true,
});

module.exports = Escritorio;
