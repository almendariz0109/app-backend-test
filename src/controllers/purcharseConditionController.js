const purcharseConditionService = require('../services/purcharse.condition.service');

const getAllConditionOrders = async (req, res) => {
  try {
    const { idGroup = null, idFlag = null } = req.query;

    if((idGroup && !idFlag) || (!idGroup && !idFlag)) {
      
        const [coverageCriteria, purchaseOrder, supplyingWarehouse] = await Promise.all([
        purcharseConditionService.coverageCriterionService(idGroup),
        purcharseConditionService.purcharsOrdersService(idGroup),
        purcharseConditionService.supplyingWarehouseService(idGroup),
        ]);

        console.log('coverage', coverageCriteria);
        console.log('purcharse', purchaseOrder);
        console.log('supplying', supplyingWarehouse);

        res.status(200).json({
        success: true,
        data: {
            coverageCriteria,
            purchaseOrder,
            supplyingWarehouse
        }
        }); 
    } else {

        const [purchaseOrder, supplyingWarehouse] = await Promise.all([
            purcharseConditionService.purcharsOrdersService(idGroup, idFlag),
            purcharseConditionService.supplyingWarehouseService(idGroup, idFlag),
        ]);

        console.log('purchase', purchaseOrder);
        console.log('supplying', supplyingWarehouse);

        res.status(200).json({
        success: true,
            data: {
                purchaseOrder,
                supplyingWarehouse
            }
        });
    }
  } catch (err) {
    res.status(err.status || 500).json({ err: err.message });
  }
};

const getReportPurcharseOrdersSKUs = async (req, res) => {
    try {
        const { stPurcharse, cdWarehouseGroupLabel, curve, idFlag, idGroup } = req.query;
        const data = await purcharseConditionService.fetchReportPurcharseOrdersService({stPurcharse, cdWarehouseGroupLabel, curve, idFlag, idGroup});
        res.status(200).json({ succes: true, data });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message})
    }
}

module.exports = {
  getAllConditionOrders,
  getReportPurcharseOrdersSKUs,
};