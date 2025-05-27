const express = require('express');
const router = express.Router();

const { getPendingOrders } = require('../controllers/pendingOrdersController');

router.get('/pendingOrder', getPendingOrders);

module.exports = router;
