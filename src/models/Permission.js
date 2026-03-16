const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['resource', 'action']
    }
  ]
});

module.exports = Permission;
