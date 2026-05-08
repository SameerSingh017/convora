const express = require('express');
const router = express.Router();
const { getStatus } = require('../controllers/authController');

router.get('/status', getStatus);

module.exports = router;
