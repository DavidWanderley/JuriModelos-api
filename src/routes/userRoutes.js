const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { checkPermission } = require("../middlewares/permissionMiddleware");

router.get("/", authMiddleware, checkPermission('usuarios', 'list'), userController.getAllUsers);
router.get("/roles", authMiddleware, checkPermission('usuarios', 'read'), userController.getAllRoles);
router.get("/permissions", authMiddleware, checkPermission('usuarios', 'read'), userController.getAllPermissions);
router.get("/:id", authMiddleware, checkPermission('usuarios', 'read'), userController.getUserById);
router.put("/:id", authMiddleware, checkPermission('usuarios', 'update'), userController.updateUser);
router.put("/:id/role", authMiddleware, checkPermission('usuarios', 'update'), userController.updateUserRole);
router.put("/:id/toggle-status", authMiddleware, checkPermission('usuarios', 'update'), userController.toggleUserStatus);
router.delete("/:id", authMiddleware, checkPermission('usuarios', 'delete'), userController.deleteUser);
router.put("/roles/:roleId/permissions", authMiddleware, checkPermission('config', 'manage'), userController.updateRolePermissions);

module.exports = router;
