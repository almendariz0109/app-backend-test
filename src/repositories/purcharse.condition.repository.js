const db = require("../config/db");

const getCoverageCriterion = (idGroup = null) => {
  const hasProductParam = idGroup !== null;

  const viewName = hasProductParam
    ? 'COL.VW_ANALYTICS_STOCK_CD_CAB_NEW'
    : 'COL.VW_ANALYTICS_STOCK_CD_CAB';

  let sql = `
    SELECT 
        ID_FLAG, CD_COVERAGE, DS_COVERAGE, QT_FLAG_STOCK, ID_COLOUR_1, ID_COLOUR_2 
    FROM ${viewName}
    WHERE 1=1
  `;

  const queryParams = [];

  if (hasProductParam) {
    sql += ' AND ID_GROUP = ?';
    queryParams.push(idGroup);
  }


  return new Promise((resolve, reject) => {
     console.log("Consulta Final Criterion", sql);
     console.log("Parámetros:", queryParams);
    db.query(sql, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getPurcharseOrders = (idGroup = null, idFlag = null) => {
  const hasProductParam = idGroup !== null;
  const hasFlagParam = idFlag !== null;

  const viewName = hasProductParam || (hasProductParam && hasFlagParam) ? 'COL.VW_ANALYTICS_OC_FLAG_NEW' : 'COL.VW_ANALYTICS_OC_FLAG';
  
  const groupby = (hasProductParam && !hasFlagParam) || (!hasProductParam && !hasFlagParam) ? 'GROUP BY ST_PURCHASE, ST_PURCHASE_DESC, ID_COLOR_1' : '';

  let sql = `
    SELECT 
      ST_PURCHASE, ST_PURCHASE_DESC, ${(hasProductParam && !hasFlagParam) || (!hasProductParam && !hasFlagParam) ? 'SUM(QT_FLAG_PURCHASE) QT_FLAG_PURCHASE' : 'QT_FLAG_PURCHASE'}, ID_COLOR_1
		FROM ${viewName} WHERE 1=1
  `;

   const queryParams = [];

  if (hasProductParam) {
    sql += ' AND COD_GROUP11_FK = ?';
    queryParams.push(idGroup);
  }

  if (hasFlagParam) {
    sql += ' AND ID_FLAG = ?'
    queryParams.push(idFlag);
  } 

  sql += ` ${groupby}`;

  return new Promise((resolve, reject) => {
     console.log("Consulta Ordenes de Compra", sql);
     console.log("Parámetros:", queryParams);
    db.query(sql, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });    
}

const getSupplyingWarehouse = (idGroup = null, idFlag = null) => {
  const hasProductParam = idGroup !== null;
  const hasFlagParam = idFlag !== null;

  let queryParams = [];

    let sqlDefault = `
    SELECT 
      ALM.CD_WAREHOUSE_GROUP_LABEL, 
      ALM.DS_WAREHOUSE, 
      NULL AS ID_FLAG,
      sum(ALM.QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE_0, 
      '#34495E' AS ID_COLOUR_1,
      '#9BB0C5' AS ID_COLOUR_2,
      TOT.QT_WAREHOUSE_STOCK,
      TOT.QT_WAREHOUSE_STOCK,
      TOT.QT_WAREHOUSE_STOCK - sum(ALM.QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE_1
    FROM COL.VW_ANALYTICS_OC_ALM_FLAG ALM
    INNER JOIN COL.VW_ANALYTICS_STOCK_CD TOT
    ON TOT.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
    WHERE 1=1 AND ALM.ST_PURCHASE =0
    group by 
      ALM.CD_WAREHOUSE_GROUP_LABEL, 
      ALM.DS_WAREHOUSE, 
      TOT.QT_WAREHOUSE_STOCK order by ALM.CD_WAREHOUSE_GROUP_LABEL asc
  `;

  let sqlFlag = `
  	SELECT 
    ALM.CD_WAREHOUSE_GROUP_LABEL, 
    ALM.DS_WAREHOUSE, 
    ALM.ID_FLAG, 
    CASE 
      WHEN SAP2.QT_FLAG_PURCHASE IS NULL THEN 0
      ELSE SAP2.QT_FLAG_PURCHASE
    END AS QT_FLAG_PURCHASE_0, 
    ALM.ID_COLOUR_1, 
    ALM.ID_COLOUR_2,
    TOT.QT_WAREHOUSE_STOCK,
    CAB.QT_FLAG_PURCHASE,
    CASE 
      WHEN SAP.QT_FLAG_PURCHASE IS NULL THEN 0
      ELSE SAP.QT_FLAG_PURCHASE
    END AS QT_FLAG_PURCHASE_1
  FROM COL.VW_ANALYTICS_OC_ALM_FLAG ALM
  INNER JOIN (
        SELECT CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, SUM(QT_FLAG_PURCHASE) QT_FLAG_PURCHASE 
        FROM COL.SCM_ANALYTICS_PURCHASE GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG
        ) CAB
  ON CAB.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL 
  AND CAB.ID_FLAG = ALM.ID_FLAG
  INNER JOIN COL.VW_ANALYTICS_STOCK_CD TOT
  ON TOT.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
  LEFT JOIN ( 
        SELECT SUM(QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE, CD_WAREHOUSE_GROUP_LABEL, ID_FLAG 
        FROM COL.SCM_ANALYTICS_PURCHASE WHERE ST_PURCHASE =1 
        GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG
        ) SAP 
  ON SAP.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
  AND ALM.ID_FLAG = SAP.ID_FLAG
  LEFT JOIN ( 
        SELECT SUM(QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE, CD_WAREHOUSE_GROUP_LABEL, ID_FLAG 
        FROM COL.SCM_ANALYTICS_PURCHASE WHERE ST_PURCHASE =0 
        GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG
        ) SAP2 
  ON SAP2.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL 					
  AND SAP2.ID_FLAG = ALM.ID_FLAG 
  WHERE 1=1 AND ALM.ID_FLAG=?
  GROUP BY 
    ALM.CD_WAREHOUSE_GROUP_LABEL, 
    ALM.DS_WAREHOUSE, 
    ALM.ID_FLAG,
    SAP2.QT_FLAG_PURCHASE,
    ALM.ID_COLOUR_1, 
    ALM.ID_COLOUR_2,
    TOT.QT_WAREHOUSE_STOCK,
    CAB.QT_FLAG_PURCHASE order by ALM.CD_WAREHOUSE_GROUP_LABEL asc
  `

  let sqlGroup = `
    SELECT 
        ALM.CD_WAREHOUSE_GROUP_LABEL, 
        ALM.DS_WAREHOUSE, 
        NULL AS ID_FLAG,
        sum(ALM.QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE_0, 
        '34495E' AS ID_COLOUR_1,
        '#9BB0C5' AS ID_COLOUR_2,
        TOT.QT_WAREHOUSE_STOCK,
        TOT.QT_WAREHOUSE_STOCK,
        TOT.QT_WAREHOUSE_STOCK - sum(ALM.QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE_1
    FROM COL.VW_ANALYTICS_OC_ALM_FLAG_NEW ALM
    INNER JOIN (select
            SAS.CD_WAREHOUSE_GROUP_LABEL AS CD_WAREHOUSE_GROUP_LABEL,
              sum(SAS.QT_FLAG_STOCK) AS QT_WAREHOUSE_STOCK,
              SAS.COD_GROUP11_FK  AS ID_GROUP 
      from
      (COL.SCM_ANALYTICS_STOCK SAS
      join COL.SCM_COVERAGE RC on
      (((RC.ID_COVERAGE = SAS.ID_FLAG)
          and (RC.TP_COVERAGE = SAS.TP_FLAG))))
      where
      ((1 = 1)
      and (SAS.TP_FLAG = 2)
      and (RC.ST_COVERAGE = 1))
      and SAS.COD_GROUP11_FK=?
      group by
      SAS.CD_WAREHOUSE_GROUP_LABEL, SAS.COD_GROUP11_FK,SAS.COD_GROUP11_FK) TOT
    ON TOT.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
    WHERE 1=1 AND ALM.ST_PURCHASE =0
    AND ALM.ID_GROUP=?
    group by 
      ALM.CD_WAREHOUSE_GROUP_LABEL, 
      ALM.DS_WAREHOUSE, 
      TOT.QT_WAREHOUSE_STOCK order by ALM.CD_WAREHOUSE_GROUP_LABEL asc
  `

  let sqlGroupandFlag = `
    SELECT 
      ALM.CD_WAREHOUSE_GROUP_LABEL, 
      ALM.DS_WAREHOUSE, 
      ALM.ID_FLAG, 
      CASE 
          WHEN SAP2.QT_FLAG_PURCHASE IS NULL THEN 0
          ELSE SAP2.QT_FLAG_PURCHASE
      END AS QT_FLAG_PURCHASE_0, 
      ALM.ID_COLOUR_1, 
      ALM.ID_COLOUR_2,
      TOT.QT_WAREHOUSE_STOCK,
      CAB.QT_FLAG_PURCHASE,
      CASE 
          WHEN SAP.QT_FLAG_PURCHASE IS NULL THEN 0
          ELSE SAP.QT_FLAG_PURCHASE
      END AS QT_FLAG_PURCHASE_1,
      ALM.ID_GROUP 
    FROM COL.VW_ANALYTICS_OC_ALM_FLAG_NEW ALM
    INNER JOIN (
      SELECT CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, SUM(QT_FLAG_PURCHASE) QT_FLAG_PURCHASE, COD_GROUP11_FK  
      FROM COL.SCM_ANALYTICS_PURCHASE 
      GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, COD_GROUP11_FK
    ) CAB
     ON CAB.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL 
     AND CAB.ID_FLAG = ALM.ID_FLAG
     AND CAB.COD_GROUP11_FK = ALM.ID_GROUP 
  INNER JOIN (
      SELECT
          SAS.CD_WAREHOUSE_GROUP_LABEL AS CD_WAREHOUSE_GROUP_LABEL,
          SUM(SAS.QT_FLAG_STOCK) AS QT_WAREHOUSE_STOCK,
          SAS.COD_GROUP11_FK AS ID_GROUP 
      FROM COL.SCM_ANALYTICS_STOCK SAS
      JOIN COL.SCM_COVERAGE RC 
          ON RC.ID_COVERAGE = SAS.ID_FLAG AND RC.TP_COVERAGE = SAS.TP_FLAG
      WHERE SAS.TP_FLAG = 2 
        AND RC.ST_COVERAGE = 1
        AND SAS.COD_GROUP11_FK = ?
      GROUP BY SAS.CD_WAREHOUSE_GROUP_LABEL, SAS.COD_GROUP11_FK
  ) TOT
    ON TOT.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL

  LEFT JOIN ( 
      SELECT SUM(QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE, CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, COD_GROUP11_FK 
      FROM COL.SCM_ANALYTICS_PURCHASE 
      WHERE ST_PURCHASE = 1 
      GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, COD_GROUP11_FK
  ) SAP 
    ON SAP.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
    AND ALM.ID_FLAG = SAP.ID_FLAG
    AND ALM.ID_GROUP = SAP.COD_GROUP11_FK 

  LEFT JOIN ( 
      SELECT SUM(QT_FLAG_PURCHASE) AS QT_FLAG_PURCHASE, CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, COD_GROUP11_FK 
      FROM COL.SCM_ANALYTICS_PURCHASE 
      WHERE ST_PURCHASE = 0 
      GROUP BY CD_WAREHOUSE_GROUP_LABEL, ID_FLAG, COD_GROUP11_FK
  ) SAP2 
    ON SAP2.CD_WAREHOUSE_GROUP_LABEL = ALM.CD_WAREHOUSE_GROUP_LABEL
    AND SAP2.ID_FLAG = ALM.ID_FLAG
    AND SAP2.COD_GROUP11_FK = ALM.ID_GROUP

  WHERE ALM.ID_FLAG = ?
    AND ALM.ID_GROUP = ?

  GROUP BY 
      ALM.CD_WAREHOUSE_GROUP_LABEL, 
      ALM.DS_WAREHOUSE, 
      ALM.ID_FLAG,
      SAP2.QT_FLAG_PURCHASE,
      ALM.ID_COLOUR_1, 
      ALM.ID_COLOUR_2,
      TOT.QT_WAREHOUSE_STOCK,
      CAB.QT_FLAG_PURCHASE,
      ALM.ID_GROUP 
  ORDER BY ALM.CD_WAREHOUSE_GROUP_LABEL ASC
  `

  if (hasProductParam && hasFlagParam) {
    sql = sqlGroupandFlag;
    queryParams = [idGroup, idFlag, idGroup];
  } else if (hasProductParam) {
    sql = sqlGroup;
    queryParams = [idGroup, idGroup];
  } else if (hasFlagParam) {
    sql = sqlFlag;
    queryParams = [idFlag];
  } else {
    console.log("Entra aqui todos los almacenes");
    sql = sqlDefault;
  }

  return new Promise((resolve, reject) => {
     console.log("Consulta Almacenes Distribuidores", sql);
    db.query(sql, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  }); 
}

const geSKUsReportsByPurcharse = (stPurcharse, cdWarehouseGroupLabel, curve = null, idFlag = null, idGroup = null) => {

  const hasProductParam = idGroup !== null;
  const hasFlagParam = idFlag !== null;
  const hasCurve = curve !== null;

  let sql = `
  SELECT 
    COD_ITEM_PK, 
    DS_PRODUCT,
    CD_PURCHASE_ORDER_ASC, 
    DT_END_ASC, 
    DESC_CD_GROUP, 
    CD_GROUP_ASC, 
    ID_FLAG, 
    CD_COVERAGE, 
    CD_WAREHOUSE_GROUP_LABEL, 
    ST_PURCHASE, 
    CURVE_XYZ, 
    DESC_CURVE_XYZC,
    DESC_ST_PURCHASE,
    CD_MU,
    QT_PURCHASE_PRODUCT,
    QT_SUGGESTION_END,
    QT_PURCHASE_ORDERS
  FROM COL.VW_ANALYTICS_OC_DET WHERE 1=1
    AND ST_PURCHASE=?
    AND CD_WAREHOUSE_GROUP_LABEL=?
`;

  const queryParams = [stPurcharse, cdWarehouseGroupLabel];

  if (hasCurve) {
    sql += ' AND (CASE WHEN ? = \'\' THEN 1=1 ELSE CURVE_XYZ = ? END)';
    queryParams.push(curve, curve);
  }

  if (hasFlagParam) {
    sql += ' AND (CASE WHEN ? = \'\' THEN 1=1 ELSE ID_FLAG = ? END)';
    queryParams.push(idFlag, idFlag);
  } 

  if (hasProductParam) {
    sql += ' AND ID_GROUP = ?';
    queryParams.push(idGroup);
  }

  sql += ' ORDER BY COD_ITEM_PK ASC';

return new Promise((resolve, reject) => {
  db.query(sql, queryParams, (err, results) => {
    if(err) {
      return reject(err);
    }
      resolve(results);
    });
  });
}

module.exports = {getCoverageCriterion, getPurcharseOrders, getSupplyingWarehouse, geSKUsReportsByPurcharse}