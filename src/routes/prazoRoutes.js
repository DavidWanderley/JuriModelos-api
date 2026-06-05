const express = require('express');
const router = express.Router();
const prazoController = require('../controllers/prazoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/',          prazoController.listar);
router.post('/',         prazoController.criar);
router.get('/:id',       prazoController.buscar);
router.put('/:id',       prazoController.atualizar);
router.delete('/:id',    prazoController.deletar);
router.patch('/:id/concluir', prazoController.concluir);

module.exports = router;
