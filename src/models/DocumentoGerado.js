const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentoGerado = sequelize.define('DocumentoGerado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_cliente: {
    type: DataTypes.STRING,
    allowLength: false,
    defaultValue: "Cliente não identificado"
  },
  conteudo_final: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  modelo_titulo: {
    type: DataTypes.STRING, 
  }
}, {
  timestamps: true, 
});

module.exports = DocumentoGerado;