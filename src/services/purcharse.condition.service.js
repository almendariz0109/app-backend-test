const purcharseConditionRepositorty = require('../repositories/purcharse.condition.repository');


const coverageCriterionService = async (idGroup) => {
    return await purcharseConditionRepositorty.getCoverageCriterion(idGroup);
};

const purcharsOrdersService = async (idGroup, idFlag) => {
    return await purcharseConditionRepositorty.getPurcharseOrders(idGroup, idFlag);
}

const supplyingWarehouseService = async (idGroup, idFlag) => {
    return await purcharseConditionRepositorty.getSupplyingWarehouse(idGroup, idFlag);
}

const fetchReportPurcharseOrdersService = async({stPurcharse, cdWarehouseGroupLabel, curve, idFlag, idGroup}) => {

  if (!stPurcharse || !cdWarehouseGroupLabel) {
    const err = new Error('Falta el parámetro stPurcharse y cdWarehouseGroupLabel');
    err.status = 400;
    throw err;
  }

  const data = await purcharseConditionRepositorty.geSKUsReportsByPurcharse(
    stPurcharse,
    cdWarehouseGroupLabel,
    curve,
    idFlag,
    idGroup
  );
  return data;
};

module.exports = { 
  coverageCriterionService, 
  purcharsOrdersService, 
  supplyingWarehouseService,
  fetchReportPurcharseOrdersService
};