const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modeloController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.use(authMiddleware); 

router.get('/', modeloController.findAll);
router.post('/', modeloController.create);
router.get('/:id', modeloController.findById);
router.put('/:id', modeloController.update);
router.delete('/:id', modeloController.delete);
router.post('/:id/generate', modeloController.generateDocument);

module.exports = router;