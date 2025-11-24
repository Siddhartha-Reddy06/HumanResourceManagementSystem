const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listLogs } = require('../controllers/logController');
const router = express.Router();

router.use(authMiddleware);
router.get('/', listLogs);

module.exports = router;
