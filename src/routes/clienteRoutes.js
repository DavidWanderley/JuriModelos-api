const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, clienteController.listarClientes);
router.post('/', authMiddleware, clienteController.criarCliente);

module.exports = router;