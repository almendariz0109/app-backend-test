const express = require('express');
const router = express.Router();
const { loginUser, userDetails } = require('../controllers/authController');

router.post('/login', loginUser);
router.get('/user-details', userDetails)

module.exports = router;



