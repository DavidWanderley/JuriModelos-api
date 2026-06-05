const express = require('express');
const router = express.Router();
const processoController = require('../controllers/processoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/',     processoController.listar);
router.post('/',    processoController.upload.single('pdf'), processoController.criar);
router.get('/:id',  processoController.buscar);
router.put('/:id',  processoController.upload.single('pdf'), processoController.atualizar);
router.delete('/:id', processoController.deletar);

module.exports = router;
