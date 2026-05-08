const express = require('express');
const router = express.Router();
const { submitReport } = require('../controllers/chatController');
const { reportLimiter } = require('../middleware/rateLimit');

router.post('/report', reportLimiter, submitReport);

module.exports = router;
