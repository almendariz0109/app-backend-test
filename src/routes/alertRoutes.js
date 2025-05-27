const express = require('express');
const router = express.Router();
const { getSuggestions, getDetails } = require('../controllers/alertController');

router.get('/alerts', getSuggestions);
router.get('/alerts/details', getDetails)

module.exports = router;
