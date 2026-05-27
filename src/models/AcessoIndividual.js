const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Exceções individuais que sobrescrevem a regra da role
// tipo: 'complexidade' | 'modelo'
// valor: 'Baixa' | 'Média' | 'Alta' | id do modelo (string)
// granted: true = libera acesso, false = bloqueia acesso
const AcessoIndividual = sequelize.define('AcessoIndividual', {
  UserId:    { type: DataTypes.INTEGER, allowNull: false },
  tipo:      { type: DataTypes.STRING,  allowNull: false },
  valor:     { type: DataTypes.STRING,  allowNull: false },
  granted:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  EscritorioId: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = AcessoIndividual;
