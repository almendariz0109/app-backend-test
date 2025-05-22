const express = require('express');
const router = express.Router();
const { loginUser, userDetails } = require('../controllers/authController');

//alertDetails

router.post('/login', loginUser);
router.get('/user-details', userDetails)
//router.get('/alert-details')

module.exports = router;



