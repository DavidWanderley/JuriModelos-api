const express = require('express');
const router = express.Router();
const escritorioController = require('../controllers/escritorioController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

router.post('/', escritorioController.criar);
router.get('/meu', escritorioController.buscar);
router.put('/meu', checkRole(['admin_escritorio']), escritorioController.atualizar);

// admin_site apenas
router.get('/', checkRole(['admin_site']), escritorioController.listarTodos);
router.patch('/:id/toggle', checkRole(['admin_site']), escritorioController.toggleAtivo);

module.exports = router;
