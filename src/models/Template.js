const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Template = sequelize.define("Template", {
  titulo: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  conteudo: { type: DataTypes.TEXT, allowNull: false },
  variaveis: { type: DataTypes.JSON, allowNull: true },
  tags: { type: DataTypes.STRING, allowNull: true },
  isAtivo: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Template;
