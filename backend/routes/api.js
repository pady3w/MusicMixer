const express = require('express');
const router = express.Router();
const { handleLyricGeneration } = require('../controllers/lyricsController');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/generate-lyrics', rateLimiter, handleLyricGeneration);

module.exports = router;