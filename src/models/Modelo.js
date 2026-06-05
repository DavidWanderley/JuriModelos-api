const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Modelo = sequelize.define("Modelo", {
  titulo: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING, allowNull: true },
  conteudo: { type: DataTypes.TEXT, allowNull: false },

  jurisdicao: { type: DataTypes.STRING, allowNull: true },
  complexidade: { type: DataTypes.STRING, allowNull: true },
  tipo_cliente: { type: DataTypes.STRING, allowNull: true },
  base_legal: { type: DataTypes.STRING, allowNull: true },
  tags: { type: DataTypes.STRING, allowNull: true },
  numero_processo: { type: DataTypes.STRING, allowNull: true },
  data_audiencia: { type: DataTypes.STRING, allowNull: true },
  hora_audiencia: { type: DataTypes.STRING, allowNull: true },
  pdf_url: { type: DataTypes.STRING, allowNull: true },
  ClienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'clientes', key: 'id' }
  },
  EscritorioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'escritorios', key: 'id' }
  },
}, { paranoid: true });

module.exports = Modelo;
