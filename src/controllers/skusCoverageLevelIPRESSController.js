const skusCoverageLevelIPRESSService = require('../services/skus.coverage.level.ipress.service');

const getSKUsCoverageDashboard = async (req, res) => {
  try {
    const { cdWarehouseGroupLabel = null, idGroup = null } = req.query;

    const [warehouseCoverage, coverageCriteria, ipressStock] = await Promise.all([
      skusCoverageLevelIPRESSService.warehouseCoverageListService(cdWarehouseGroupLabel, idGroup),
      skusCoverageLevelIPRESSService.coverageCriterionService(cdWarehouseGroupLabel, idGroup),
      skusCoverageLevelIPRESSService.fetchIPRESSStock(cdWarehouseGroupLabel, idGroup),
    ]);

    res.status(200).json({
      success: true,
      data: {
        warehouseCoverage,
        coverageCriteria,
        ipressStock
      }
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getIPRESSDetailsDashboard = async (req, res) => {
  try {
    const { idFlag, cdWarehouseGroupLabel, idGroup } = req.query;
    console.log('idFlag:', idFlag);
    console.log('cdWarehouseGroupLabel:', cdWarehouseGroupLabel);
    console.log('idGroup:', idGroup);

    let data;

    if(idGroup){
      console.log("Entra por 3 parametros");
      data = await skusCoverageLevelIPRESSService.fetchIPRESSDetailsByCoverageandWarehouseandProduct(idFlag, cdWarehouseGroupLabel, idGroup)
    } else {
      console.log("Entra por 2 parametros");
      data = await skusCoverageLevelIPRESSService.fetchIPRESSDetailsxCoveragexWarehouse(idFlag, cdWarehouseGroupLabel); 
    }

    res.status(200).json({ succes: true, data }); 
    console.log('Resultados:', data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message})
  }
}

const getSKUsReportsByCoverage = async(req,res) => {
    try {
        const { idFlag, cdWarehouse } = req.query;
        const data = await skusCoverageLevelIPRESSService.supplyingIPRESSReportsxCoverage({idFlag, cdWarehouse});
        res.status(200).json({ succes: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message})
    }
};


module.exports = {
  getSKUsCoverageDashboard,
  getIPRESSDetailsDashboard,
  getSKUsReportsByCoverage
};
