const skusCoverageLevelIPRESSRepositorty = require('../repositories/skus.coverage.level.ipress.repository');

const warehouseCoverageListService = async (cdWarehouseGroupLabel, idGroup) => {

  return await skusCoverageLevelIPRESSRepositorty.listWarehouseCoverage(cdWarehouseGroupLabel, idGroup);
};

const coverageCriterionService = async (cdWarehouseGroupLabel, idGroup) => {
    return await skusCoverageLevelIPRESSRepositorty.getCoverageCriterion(cdWarehouseGroupLabel, idGroup);
}; 

const fetchIPRESSStock = async (cdWarehouseGroupLabel, idGroup) => {
  return await skusCoverageLevelIPRESSRepositorty.getIPRESSStockData(cdWarehouseGroupLabel, idGroup);
};

const fetchIPRESSDetailsxCoveragexWarehouse = async(idFlag, cdWarehouseGroupLabel) => {

  if (!idFlag || !cdWarehouseGroupLabel) {
    const err = new Error('Falta los parametros');
    err.status = 400;
    throw err;
  }

  const data = await skusCoverageLevelIPRESSRepositorty.getIPRESSDetailsByCoverageandWarehouse(idFlag, cdWarehouseGroupLabel);
  return data;
}

const fetchIPRESSDetailsByCoverageandWarehouseandProduct = async(idFlag, cdWarehouseGroupLabel, idGroup) => {

  if (!idFlag || !cdWarehouseGroupLabel || !idGroup) {
    const err = new Error('Falta los parametros');
    err.status = 400;
    throw err;
  }

  const data = await skusCoverageLevelIPRESSRepositorty.getIPRESSDetailsByCoverageandWarehouseandProduct(idFlag, cdWarehouseGroupLabel, idGroup);
  return data;
}

const supplyingIPRESSReportsxCoverage = async({idFlag, cdWarehouse}) => {

      if (!idFlag || !cdWarehouse) {
        const err = new Error('Falta el parámetro cdWarehouse o idFlag');
        err.status = 400;
        throw err;
      }
    
      return await skusCoverageLevelIPRESSRepositorty.geSKUsReportsByCoverage(idFlag, cdWarehouse);
}


module.exports = { 
  warehouseCoverageListService,
  coverageCriterionService, 
  fetchIPRESSStock, 
  fetchIPRESSDetailsxCoveragexWarehouse, 
  fetchIPRESSDetailsByCoverageandWarehouseandProduct,
  supplyingIPRESSReportsxCoverage 
};