const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    
    perfil: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'user' 
    },

    oab: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING, allowNull: false },
    sexo: { type: DataTypes.STRING },
    nacionalidade: { type: DataTypes.STRING, defaultValue: 'Brasileiro(a)' },

    cep: { type: DataTypes.STRING, allowNull: false },
    endereco: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.STRING, allowNull: false },
    complemento: { type: DataTypes.STRING },
    bairro: { type: DataTypes.STRING, allowNull: false },
    cidade: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.STRING(2), allowNull: false },
    
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

module.exports = User;