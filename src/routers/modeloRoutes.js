const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modeloController');

router.post('/', modeloController.create);

router.get('/', modeloController.findAll);

module.exports = router;