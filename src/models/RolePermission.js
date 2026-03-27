const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  RoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  PermissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permissions',
      key: 'id'
    }
  }
}, {
  tableName: 'role_permissions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['RoleId', 'PermissionId']
    }
  ]
});

module.exports = RolePermission;
