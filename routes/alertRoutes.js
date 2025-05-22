const express = require('express');
const router = express.Router();
const { getSuggestions } = require('../controllers/alertController');

router.get('/alerts', getSuggestions);

module.exports = router;
