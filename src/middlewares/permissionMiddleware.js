const { User, Role, Permission } = require("../models");
const HTTP_STATUS = require("../util/httpStatus");

const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;

      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          as: "role",
          include: [{ model: Permission, as: "permissions" }],
        }],
      });

      if (!user || !user.role) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: "Acesso negado. Usuário sem perfil definido.",
        });
      }

      if (!user.role.isActive) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: "Acesso negado. Perfil desativado.",
        });
      }

      const hasPermission = user.role.permissions.some(
        (perm) => perm.resource === resource && perm.action === action,
      );

      if (!hasPermission) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: `Acesso negado. Permissão necessária: ${resource}.${action}`,
        });
      }

      req.userPermissions = user.role.permissions.map((p) => `${p.resource}.${p.action}`);
      req.userRole = user.role.name;

      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Erro ao verificar permissões",
      });
    }
  };
};

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "role" }],
      });

      if (!user || !user.role) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: "Acesso negado. Usuário sem perfil definido.",
        });
      }

      if (!allowedRoles.includes(user.role.name)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: `Acesso negado. Perfis permitidos: ${allowedRoles.join(", ")}`,
        });
      }

      req.userRole = user.role.name;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Erro ao verificar perfil",
      });
    }
  };
};

module.exports = { checkPermission, checkRole };
