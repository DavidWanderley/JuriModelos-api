const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Processo = sequelize.define('Processo', {
  numero_processo: { type: DataTypes.STRING, allowNull: true },
  titulo:          { type: DataTypes.STRING, allowNull: false },
  descricao:       { type: DataTypes.TEXT,   allowNull: true },
  tipo_acao:       { type: DataTypes.STRING, allowNull: true },
  vara:            { type: DataTypes.STRING, allowNull: true },
  comarca:         { type: DataTypes.STRING, allowNull: true },
  valor_causa:     { type: DataTypes.DECIMAL(15, 2), allowNull: true },
  data_distribuicao: { type: DataTypes.DATEONLY, allowNull: true },
  status: {
    type: DataTypes.ENUM('Em andamento', 'Aguardando', 'Encerrado', 'Ganho', 'Perdido'),
    defaultValue: 'Em andamento',
  },
  pdf_url:      { type: DataTypes.STRING, allowNull: false },
  ClienteId:    { type: DataTypes.INTEGER, allowNull: true,  references: { model: 'clientes',   key: 'id' } },
  ModeloId:     { type: DataTypes.INTEGER, allowNull: true,  references: { model: 'Modelos',    key: 'id' } },
  UserId:       { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users',      key: 'id' } },
  EscritorioId: { type: DataTypes.INTEGER, allowNull: true,  references: { model: 'escritorios', key: 'id' } },
}, { paranoid: true });

module.exports = Processo;
