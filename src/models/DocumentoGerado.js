const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentoGerado = sequelize.define('DocumentoGerado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome_cliente: { type: DataTypes.STRING, allowNull: true, defaultValue: "Documento Avulso" },
  caminho_arquivo: { type: DataTypes.STRING, allowNull: false },
  modelo_titulo: { type: DataTypes.STRING },
  ClienteId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'clientes', key: 'id' } }
}, {
  tableName: 'documentos_gerados',
  timestamps: true,
});

module.exports = DocumentoGerado;