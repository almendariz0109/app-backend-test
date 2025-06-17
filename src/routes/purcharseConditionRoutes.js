const express = require('express');
const router = express.Router();

const { getAllConditionOrders, getReportPurcharseOrdersSKUs } = require('../controllers/purcharseConditionController');

router.get('/purcharseCondition', getAllConditionOrders);
router.get('/purcharseCondition/purcharseSKUsReport', getReportPurcharseOrdersSKUs)

module.exports = router;