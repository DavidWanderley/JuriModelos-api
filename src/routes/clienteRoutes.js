const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, clienteController.listarClientes);
router.get('/:id', authMiddleware, clienteController.buscarCliente);
router.post('/', authMiddleware, clienteController.criarCliente);
router.put('/:id', authMiddleware, clienteController.atualizarCliente);
router.delete('/:id', authMiddleware, clienteController.deletarCliente);

module.exports = router;