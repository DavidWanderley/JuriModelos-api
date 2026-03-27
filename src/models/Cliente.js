const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome_completo: { type: DataTypes.STRING, allowNull: false },
  cpf_cnpj: { type: DataTypes.STRING, unique: true },
  rg: { type: DataTypes.STRING },
  estado_civil: { type: DataTypes.STRING },
  profissao: { type: DataTypes.STRING },
  nacionalidade: { type: DataTypes.STRING, defaultValue: "Brasileiro(a)" },
  email: { type: DataTypes.STRING },
  telefone: { type: DataTypes.STRING },
  whatsapp: { type: DataTypes.STRING },
  cep: { type: DataTypes.STRING },
  logradouro: { type: DataTypes.STRING },
  numero: { type: DataTypes.STRING },
  complemento: { type: DataTypes.STRING },
  bairro: { type: DataTypes.STRING },
  cidade: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING },
  endereco_completo: { type: DataTypes.TEXT },
}, {
  tableName: 'clientes',
  timestamps: true,
});

module.exports = Cliente;