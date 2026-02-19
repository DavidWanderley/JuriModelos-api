const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modeloController');

router.post('/', modeloController.create);
router.get('/', modeloController.findAll);
router.get('/:id', modeloController.findById);
router.put('/:id', modeloController.update);
router.delete('/:id', modeloController.delete);

module.exports = router;