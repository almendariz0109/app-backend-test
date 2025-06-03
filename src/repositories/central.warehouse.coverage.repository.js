const db = require('../config/db');

const findCoverageCriterion = () => {
  const sql = `
  SELECT ID_FLAG, CD_COVERAGE, DS_COVERAGE, QT_FLAG_STOCK, ID_COLOUR_1, ID_COLOUR_2 FROM COL.VW_ANALYTICS_STOCK_CD_CAB
	WHERE 1=1
  `;

  return new Promise((resolve, reject) => {
    db.query(sql,(err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const findCoverageCriterionByTypeProduct = (idGroup) => {
    const sql = `
    SELECT ID_FLAG, CD_COVERAGE, DS_COVERAGE, QT_FLAG_STOCK, ID_COLOUR_1, ID_COLOUR_2 FROM COL.VW_ANALYTICS_STOCK_CD_CAB_NEW
    WHERE 1=1 AND ID_GROUP=?
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [idGroup], (err, results) => {
      if (err) {
        return reject(err);      
    }
      resolve(results);
    });
  });
}

const findCoverageCriterionByRotation = () => {
    const sql = `
    SELECT
      CD_WAREHOUSE_GROUP_LABEL,
      DS_WAREHOUSE,
      ID_FLAG,
      QT_FLAG_STOCK,
      ID_COLOUR_1,
      ID_COLOUR_2,
      CAB.QT_WAREHOUSE_STOCK
    FROM COL.VW_ANALYTICS_STOCK_CD_ALM_NEW ALM
    INNER JOIN COL.VW_ANALYTICS_STOCK_CD CAB
    ON CAB.CD_WAREHOUSE_GROUP_LABEL = CD_WAREHOUSE_GROUP_LABEL
    WHERE 1=1 AND ID_GROUP=1 AND ID_FLAG=14
    ORDER BY ALM.CD_WAREHOUSE_GROUP_LABEL ASC
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

const findSupplyingWarehouseByRotation = (idFlag) => {
    const sql = `
    SELECT 
        ALM.CD_WAREHOUSE_GROUP_LABEL, 
        ALM.DS_WAREHOUSE, 
        ALM.ID_FLAG, 
        ALM.QT_FLAG_STOCK,  
        ALM.ID_COLOUR_1, 
        ALM.ID_COLOUR_2,
        CAB.QT_WAREHOUSE_STOCK
    FROM COL.VW_ANALYTICS_STOCK_CD_ALM ALM
    INNER JOIN COL.VW_ANALYTICS_STOCK_CD CAB 
    ON CAB.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL 
    WHERE 1=1 AND ID_FLAG=?
    GROUP BY
        ALM.CD_WAREHOUSE_GROUP_LABEL, 
        ALM.DS_WAREHOUSE, 
        ALM.ID_FLAG,
        ALM.ID_COLOUR_1, 
        ALM.ID_COLOUR_2,
        CAB.QT_WAREHOUSE_STOCK
    ORDER BY ALM.CD_WAREHOUSE_GROUP_LABEL ASC
  `;

    return new Promise((resolve, reject) => {
    db.query(sql, [idFlag], (err, results) => {
      if (err) {
        return reject(err);      
    }
      resolve(results);
    });
  });
}

const findSupplyingWarehouseByRotationandTypeProduct = (idFlag, idGroup) => {
    const sql = `
    SELECT 
        ALM.CD_WAREHOUSE_GROUP_LABEL, 
        ALM.DS_WAREHOUSE, 
        ALM.ID_FLAG, 
        ALM.QT_FLAG_STOCK, 
        ALM.ID_COLOUR_1, 
        ALM.ID_COLOUR_2,
        CAB.QT_WAREHOUSE_STOCK
    FROM COL.VW_ANALYTICS_STOCK_CD_ALM_NEW ALM
    INNER JOIN COL.VW_ANALYTICS_STOCK_CD CAB 
    ON CAB.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL 
    WHERE 1=1 AND ID_FLAG=? AND ID_GROUP=?
    ORDER BY ALM.CD_WAREHOUSE_GROUP_LABEL ASC
  `;

    return new Promise((resolve, reject) => {
    db.query(sql, [idFlag, idGroup], (err, results) => {
      if (err) {
        return reject(err);      
    }
      resolve(results);
    });
  });
}

const geSKUsReportsByCoverage = (idFlag, cdWarehouseGroupLabel) => {
  const sql = `
  SELECT
      COD_ITEM_PK,
      DS_PRODUCT,
      CD_MU,
      ID_FLAG,
      CD_COVERAGE,
      CD_WAREHOUSE_GROUP_LABEL,
      DS_WAREHOUSE
  FROM COL.VW_ANALYTICS_STOCK_CD_DET
  WHERE ID_FLAG=? 
  AND CD_WAREHOUSE_GROUP_LABEL=?
  ORDER BY COD_ITEM_PK
`;

return new Promise((resolve, reject) => {
  db.query(sql, [idFlag, cdWarehouseGroupLabel], (err, results) => {
    if(err) {
      return reject(err);
    }
      resolve(results);
    });
  });
}

module.exports= { 
  findCoverageCriterion, 
  findCoverageCriterionByRotation, 
  findCoverageCriterionByTypeProduct, 
  findSupplyingWarehouseByRotation, 
  findSupplyingWarehouseByRotationandTypeProduct,
  geSKUsReportsByCoverage
 }

