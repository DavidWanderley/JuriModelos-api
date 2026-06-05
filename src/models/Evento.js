const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Evento = sequelize.define("Evento", {
  titulo: { type: DataTypes.STRING, allowNull: false },
  tipo: {
    type: DataTypes.ENUM("Audiência", "Atendimento", "Reunião", "Prazo", "Protocolo", "Outros"),
    allowNull: false,
  },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  data: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: true },
  local: { type: DataTypes.STRING, allowNull: true },
  prioridade: {
    type: DataTypes.ENUM("baixa", "media", "alta"),
    defaultValue: "media",
  },
  status: {
    type: DataTypes.ENUM("pendente", "concluido", "cancelado"),
    defaultValue: "pendente",
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Users', key: 'id' }
  },
  EscritorioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'escritorios', key: 'id' }
  },
}, { paranoid: true });

module.exports = Evento;
