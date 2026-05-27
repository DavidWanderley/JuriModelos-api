const express = require('express');
const router = express.Router();
const escritorioController = require('../controllers/escritorioController');
const acessoController = require('../controllers/acessoController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/permissionMiddleware');

router.use(authMiddleware);

router.post('/', escritorioController.criar);
router.get('/meu', escritorioController.buscar);
router.put('/meu', checkRole(['admin_escritorio']), escritorioController.atualizar);
router.post('/meu/convidar', checkRole(['admin_escritorio']), authController.convidarMembro);
router.get('/meu/painel', checkRole(['admin_escritorio']), escritorioController.painel);
router.put('/meu/membros/:membroId/role', checkRole(['admin_escritorio']), escritorioController.atualizarMembroRole);
router.patch('/meu/membros/:membroId/toggle', checkRole(['admin_escritorio']), escritorioController.toggleMembroStatus);
router.delete('/meu/membros/:membroId', checkRole(['admin_escritorio']), escritorioController.removerMembro);

router.get('/meu/complexidades', checkRole(['admin_escritorio']), acessoController.listarComplexidadesPorRole);
router.get('/meu/acessos/:membroId', checkRole(['admin_escritorio']), acessoController.listarAcessos);
router.put('/meu/acessos/:membroId', checkRole(['admin_escritorio']), acessoController.salvarAcessos);

// admin_site apenas
router.get('/', checkRole(['admin_site']), escritorioController.listarTodos);
router.get('/:id', checkRole(['admin_site']), escritorioController.detalharEscritorio);
router.patch('/:id/toggle', checkRole(['admin_site']), escritorioController.toggleAtivo);

module.exports = router;
