const express = require('express');
const router = express.Router();
const cepController = require('../controllers/cepController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota protegida - apenas usuários autenticados podem buscar CEP
router.get('/:cep', authMiddleware, cepController.buscarCep);

module.exports = router;
