const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/',                   notificacaoController.listar);
router.patch('/:id/ler',          notificacaoController.marcarLida);
router.patch('/ler-todas',        notificacaoController.marcarTodasLidas);

module.exports = router;
