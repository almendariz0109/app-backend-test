const warehouseCoverageRepositorty = require('../repositories/central.warehouse.coverage.repository');

const getwarehouseCoverage = async() => {
    const data = await warehouseCoverageRepositorty.findCoverageCriterion();
    return data;
};

const getCoverageByProducto = async(idGroup) => {
    if (!idGroup) {
    const err = new Error('Falta el parámetro idGroup');
    err.status = 400;
    throw err;
    }

    return await warehouseCoverageRepositorty.findCoverageCriterionByTypeProduct(idGroup);
}

const supplyingWarehouseService = async(idFlag) => {
    if (!idFlag) {
    const err = new Error('Falta el parámetro idFlag');
    err.status = 400;
    throw err;
    }
    return await warehouseCoverageRepositorty.findSupplyingWarehouseByRotation(idFlag);

}

const supplyingWarehousexProductTypeService = async(idFlag, idGroup) => {

    if (!idGroup || !idFlag) {
    const err = new Error('Falta el parámetro idGroup o idFlag');
    err.status = 400;
    throw err;
    }

    const data = await warehouseCoverageRepositorty.findSupplyingWarehouseByRotationandTypeProduct(idFlag, idGroup);
    return data;
}

const supplyingWarehouseReportsxCoverage = async({idFlag, cdWarehouseGroupLabel}) => {

      if (!idFlag || !cdWarehouseGroupLabel) {
        const err = new Error('Falta el parámetro cdWarehouseGroupLabel o idFlag');
        err.status = 400;
        throw err;
      }
    
      return await warehouseCoverageRepositorty.geSKUsReportsByCoverage(idFlag, cdWarehouseGroupLabel);
}

module.exports = {
    getwarehouseCoverage, 
    getCoverageByProducto, 
    supplyingWarehouseService, 
    supplyingWarehousexProductTypeService, 
    supplyingWarehouseReportsxCoverage
};