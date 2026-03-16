const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, templateController.createTemplate);
router.get("/", authMiddleware, templateController.getAllTemplates);
router.get("/:id", authMiddleware, templateController.getTemplateById);
router.put("/:id", authMiddleware, templateController.updateTemplate);
router.delete("/:id", authMiddleware, templateController.deleteTemplate);

module.exports = router;
