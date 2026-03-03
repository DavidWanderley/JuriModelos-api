const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modeloController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(authMiddleware);

router.get('/', modeloController.findAll);
router.get('/:id', modeloController.findById);

router.post('/', upload.single("pdf_referencia"), modeloController.create);
router.put('/:id', upload.single("pdf_referencia"), adminMiddleware, modeloController.update);
router.delete('/:id', adminMiddleware, modeloController.delete);

router.post('/generate/:id', modeloController.generateDocument);

module.exports = router;