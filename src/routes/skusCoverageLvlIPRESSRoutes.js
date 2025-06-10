const express = require('express');
const router = express.Router();

const { getSKUsCoverageDashboard,getIPRESSDetailsDashboard,getSKUsReportsByCoverage } = require('../controllers/skusCoverageLevelIPRESSController');

router.get('/skusCoverageLvlIPRESS', getSKUsCoverageDashboard);
router.get('/skusCoverageLvlIPRESS/IPRESSDetails', getIPRESSDetailsDashboard);
router.get('/skusCoverageLvlIPRESS/SKUsReportsByCoverage', getSKUsReportsByCoverage);

module.exports = router;