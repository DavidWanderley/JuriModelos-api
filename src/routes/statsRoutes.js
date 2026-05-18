const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/permissionMiddleware');

router.get('/', authMiddleware, statsController.getStats);
router.get('/globais', authMiddleware, checkRole(['admin_site']), statsController.getStatsGlobais);

module.exports = router;
