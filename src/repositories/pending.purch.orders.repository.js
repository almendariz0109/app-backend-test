const db = require('../config/db');

const queryPendingOrders = () => {
  let sql = `SELECT
   	CD_WAREHOUSE_GROUP_LABEL,
    COD_ITEM_PK,
    DS_PRODUCT, 
    CD_MU, 
    QT_PURCHASE_PRODUCT, 
    QT_PURCHASE_ORDERS, 
    ID_FLAG, 
    CD_COVERAGE, 
    CURVE_XYZ, 
    DESC_CURVE_XYZC
    FROM COL.VW_ANALYTICS_OC_PENDING`;


  return new Promise((resolve, reject) => {
    db.query(sql,(err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports= { queryPendingOrders}