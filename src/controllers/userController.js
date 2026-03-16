const { User, Role, Permission } = require("../models");
const ApiResponse = require("../util/ApiResponse");
const httpStatus = require("../util/httpStatus");
const messages = require("../util/messages");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      include: [{
        model: Role,
        as: 'role',
        include: ['permissions']
      }],
      order: [['createdAt', 'DESC']]
    });
    return ApiResponse.success(res, users);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      include: [{
        model: Role,
        as: 'role',
        include: ['permissions']
      }]
    });
    if (!user) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return ApiResponse.success(res, user);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    
    const { password, ...updateData } = req.body;
    await user.update(updateData);
    
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      include: [{
        model: Role,
        as: 'role',
        include: ['permissions']
      }]
    });
    
    return ApiResponse.success(res, updatedUser, messages.UPDATED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    
    await user.update({ RoleId: roleId });
    
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      include: [{
        model: Role,
        as: 'role',
        include: ['permissions']
      }]
    });
    
    return ApiResponse.success(res, updatedUser, "Perfil atualizado com sucesso");
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    
    await user.update({ isActive: !user.isActive });
    
    return ApiResponse.success(res, { isActive: user.isActive }, 
      user.isActive ? "Usuário ativado" : "Usuário desativado");
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    await user.destroy();
    return ApiResponse.success(res, null, messages.DELETED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: ['permissions'],
      order: [['level', 'DESC']]
    });
    return ApiResponse.success(res, roles);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['resource', 'ASC'], ['action', 'ASC']]
    });
    return ApiResponse.success(res, permissions);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const role = await Role.findByPk(req.params.roleId);
    
    if (!role) {
      return ApiResponse.error(res, "Perfil não encontrado", httpStatus.NOT_FOUND);
    }
    
    await role.setPermissions(permissionIds);
    
    const updatedRole = await Role.findByPk(role.id, {
      include: ['permissions']
    });
    
    return ApiResponse.success(res, updatedRole, "Permissões atualizadas com sucesso");
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
