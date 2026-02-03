const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modelo = sequelize.define('Modelo', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    categoria: { 
        type: DataTypes.ENUM(
            'Petições', 'Contratos', 'Recursos', 'Pareceres', 'Contestação', 'Outros'
        ), 
        allowNull: false 
    },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    variaveis: { type: DataTypes.JSONB, allowNull: true } 
});

module.exports = Modelo;