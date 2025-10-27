const express = require('express');
const statusController = require('../controllers/statusController');

const router = express.Router();

// GET /status - Get system status
router.get('/', statusController.getStatus);

module.exports = router;