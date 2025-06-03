const express = require('express');
const router = express.Router();

const { getwarehouseCoverage, getCoverageByProducto, getSupplyingWarehouse, getSupplyingWarehouseByProduct, getSKUsReportsByCoverage } = require('../controllers/warehouseCoverageController');

router.get('/warehouseCoverage', getwarehouseCoverage);
router.get('/warehouseCoverage/coverageByProduct', getCoverageByProducto);
router.get('/warehouseCoverage/supplyingWarehouse', getSupplyingWarehouse);
router.get('/warehouseCoverage/supplyingWarehouseByProduct', getSupplyingWarehouseByProduct);
router.get('/warehouseCoverage/SKUsReportsByCoverage', getSKUsReportsByCoverage);

module.exports = router;