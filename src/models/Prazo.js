const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prazo = sequelize.define('Prazo', {
  titulo:           { type: DataTypes.STRING,  allowNull: false },
  numero_processo:  { type: DataTypes.STRING,  allowNull: true },
  descricao:        { type: DataTypes.TEXT,    allowNull: true },
  data_prazo:       { type: DataTypes.DATEONLY, allowNull: false },
  hora:             { type: DataTypes.STRING,  allowNull: true },
  tipo: {
    type: DataTypes.ENUM('Audiência', 'Prazo Fatal', 'Protocolo', 'Reunião', 'Outros'),
    defaultValue: 'Prazo Fatal',
  },
  status: {
    type: DataTypes.ENUM('pendente', 'concluido', 'cancelado'),
    defaultValue: 'pendente',
  },
  ModeloId:    { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Modelos',    key: 'id' } },
  ClienteId:   { type: DataTypes.INTEGER, allowNull: true, references: { model: 'clientes',   key: 'id' } },
  UserId:      { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users',     key: 'id' } },
  EscritorioId:{ type: DataTypes.INTEGER, allowNull: true, references: { model: 'escritorios', key: 'id' } },
});

module.exports = Prazo;
