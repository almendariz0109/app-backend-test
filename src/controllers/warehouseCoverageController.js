const warehouseCoverageService = require('../services/central.warehouse.coverage.service');

const getwarehouseCoverage = async(req, res) => {
    try {
        const data = await warehouseCoverageService.getwarehouseCoverage();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const getCoverageByProducto = async(req, res) => {
    try {
        const { idGroup } = req.query;
        const data = await warehouseCoverageService.getCoverageByProducto(idGroup);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};


const getSupplyingWarehouse = async(req, res) => {
    try {
        const { idFlag } = req.query;
        const data = await warehouseCoverageService.supplyingWarehouseService(idFlag);
        res.status(200).json({ succes: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message})
    }
};

const getSupplyingWarehouseByProduct = async(req, res) => {
    try {
        const { idFlag, idGroup } = req.query;
        console.log('idFlag:', idFlag);
        console.log('idGroup:', idGroup);
        const data = await warehouseCoverageService.supplyingWarehousexProductTypeService(idFlag, idGroup);
        console.log('Resultados:', data);
        res.status(200).json({ succes: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message})
    }
};

const getSKUsReportsByCoverage = async(req,res) => {
    try {
        const { idFlag, cdWarehouseGroupLabel } = req.query;
        const data = await warehouseCoverageService.supplyingWarehouseReportsxCoverage({idFlag, cdWarehouseGroupLabel});
        res.status(200).json({ succes: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message})
    }
};

module.exports = {getwarehouseCoverage, getCoverageByProducto, getSupplyingWarehouse, getSupplyingWarehouseByProduct, getSKUsReportsByCoverage}