const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/salvar', authMiddleware, documentoController.salvarHistorico);
router.get('/meus-documentos', authMiddleware, documentoController.listarHistorico);

module.exports = router;