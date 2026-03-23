const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/proximos", authMiddleware, eventoController.getProximos);
router.get("/", authMiddleware, eventoController.getAllEventos);
router.get("/:id", authMiddleware, eventoController.getEventoById);
router.post("/", authMiddleware, eventoController.createEvento);
router.put("/:id", authMiddleware, eventoController.updateEvento);
router.delete("/:id", authMiddleware, eventoController.deleteEvento);

module.exports = router;
