const db = require("../config/db");

const listWarehouseCoverage = (cdWarehouseGroupLabel = null, idGroup = null) => {
  const hasWarehouseParam = cdWarehouseGroupLabel !== null;
  const hasProductParam = idGroup !== null;

    const viewName = hasProductParam
    ? 'COL.VW_ANALYTICS_STOCK_ALL_NEW'
    : 'COL.VW_ANALYTICS_STOCK_ALL';


  let sql = `
    SELECT 
      SUBSTR(RE.COD_ESTAB_PK,6,4) AS CD_WAREHOUSE_GROUP_LABEL,
      RE.DS_ESTAB,
      ALM.QT_WAREHOUSE_STOCK,
      CASE 
        WHEN ${hasWarehouseParam ? 'SUBSTR(RE.COD_ESTAB_PK,6,4)=?' : '1=0'} THEN '#34495E'
        ELSE '#D4DCEB'
      END AS BGCOLOR,
      CASE 
        WHEN ${hasWarehouseParam ? 'SUBSTR(RE.COD_ESTAB_PK,6,4)=?' : '1=0'} THEN '#D4DCEB'
        ELSE '#34495E'
      END AS COLOR
    FROM COL.REG_ESTAB RE
    INNER JOIN ${viewName} ALM
      ON ALM.CD_WAREHOUSE_GROUP_LABEL = SUBSTR(RE.COD_ESTAB_PK,6,4)
    WHERE 1=1
  `;

  const queryParams = [];

  if (hasWarehouseParam) {
    queryParams.push(cdWarehouseGroupLabel, cdWarehouseGroupLabel);
  }

  if (hasProductParam) {
    sql += ' AND ALM.ID_GROUP = ?';
    queryParams.push(idGroup);
  }

  sql += ' ORDER BY SUBSTR(RE.COD_ESTAB_PK,6,4) ASC';

  return new Promise((resolve, reject) => {
    console.log("Consulta Final Almacen", sql);
    console.log("Parámetros:", queryParams);
    db.query(sql, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getCoverageCriterion = (cdWarehouseGroupLabel = null, idGroup = null) => {
  const hasWarehouseParam = cdWarehouseGroupLabel !== null;
  const hasProductParam = idGroup !== null;

  const stock = (!hasProductParam && !hasWarehouseParam) || (!hasWarehouseParam) ? 'sum(QT_FLAG_STOCK) as QT_FLAG_STOCK' : 'QT_FLAG_STOCK'

  const viewName = hasProductParam
    ? 'COL.VW_ANALYTICS_STOCK_ALL_CAB_NEW'
    : 'COL.VW_ANALYTICS_STOCK_ALL_CAB';

  const groupby = (hasProductParam && hasWarehouseParam) ? '' : 'GROUP BY  ID_FLAG, CD_COVERAGE, DS_COVERAGE, ID_COLOUR_1, ID_COLOUR_2';

  let sql = `
    SELECT 
        ID_FLAG, CD_COVERAGE, DS_COVERAGE, ${stock}, ID_COLOUR_1, ID_COLOUR_2 
    FROM ${viewName}
    WHERE 1=1
  `;

  const queryParams = [];

  if (hasWarehouseParam) {
    sql += ' AND CD_WAREHOUSE_GROUP_LABEL = ?'
    queryParams.push(cdWarehouseGroupLabel);
  } 

  if (hasProductParam) {
    sql += ' AND ID_GROUP = ?';
    queryParams.push(idGroup);
  }

  sql += ` ${groupby}`;


  return new Promise((resolve, reject) => {
     console.log("Consulta Final Criterion", sql);
     console.log("Parámetros:", queryParams);
    db.query(sql, queryParams, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getIPRESSStockData = (cdWarehouseGroupLabel, idGroup) => {
  const hasWarehouseParam = cdWarehouseGroupLabel !== null;
  const hasProductParam = idGroup !== null;

  const viewName = hasProductParam
    ? 'COL.VW_ANALYTICS_STOCK_ALL_NEW'
    : 'COL.VW_ANALYTICS_STOCK_ALL';

  // Consulta total general (solo cambia si hay ID_GROUP)
  let queryTotal = `
    SELECT
      SUM(ALM.QT_WAREHOUSE_STOCK) AS totalStock
    FROM ${viewName} ALM
    WHERE 1=1
  `;


  const totalParams = [];

  if (hasProductParam) {
    queryTotal += ' AND ID_GROUP = ?';
    totalParams.push(idGroup);
  }

  // Consulta detallada por IPRESS
  let queryIPRESSStock = `
    SELECT
      ALM.CD_WAREHOUSE_GROUP_LABEL,
      E.DS_ESTAB,
      ALM.QT_WAREHOUSE_STOCK
    FROM ${viewName} ALM
    INNER JOIN COL.REG_ESTAB E
      ON SUBSTR(E.COD_ESTAB_PK,6,4) = ALM.CD_WAREHOUSE_GROUP_LABEL
    WHERE 1=1
  `;

  const ipressParams = [];

  if (hasWarehouseParam) {
    queryIPRESSStock += ' AND CD_WAREHOUSE_GROUP_LABEL = ?';
    ipressParams.push(cdWarehouseGroupLabel);
  }

  if (hasProductParam) {
    queryIPRESSStock += ' AND ID_GROUP = ?';
    ipressParams.push(idGroup);
  }

  return new Promise((resolve, reject) => {
    const runTotal = hasProductParam || hasWarehouseParam; // Ejecutar total si hay producto
    const runIPRESS = hasWarehouseParam || hasProductParam;

    if (runTotal && runIPRESS) {
      // Ejecutar ambas
      db.query(queryIPRESSStock, ipressParams, (err, ipressResults) => {
        if (err) return reject(err);
        db.query(queryTotal, totalParams, (err2, totalResults) => {
          if (err2) return reject(err2);
          const totalStock = totalResults[0].totalStock;
          const combined = ipressResults.map(row => ({
            ...row,
            totalStock: totalStock
          }));
          resolve(combined);
        });
      });
    } else if (runIPRESS) {
      // Solo IPRESS
      db.query(queryIPRESSStock, ipressParams, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    } else {
      // Solo total
      db.query(queryTotal, totalParams, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    }
  });
};

const getIPRESSDetailsByCoverageandWarehouse = (idFlag, cdWarehouseGroupLabel) => {
      const sql = `
        SELECT 
          ALM.CD_WAREHOUSE, 
          ALM.DS_WAREHOUSE, 
          ALM.ID_FLAG, 
          ALM.QT_FLAG_STOCK AS  QT_FLAG_STOCK,  
          ALM.ID_COLOUR_1, 
          ALM.ID_COLOUR_2,
          CAB.QT_WAREHOUSE_STOCK
        FROM COL.VW_ANALYTICS_STOCK_ALL_ALM ALM
        INNER JOIN (
              SELECT 
              SUM(QT_FLAG_STOCK) AS QT_WAREHOUSE_STOCK,
              SAS.CD_WAREHOUSE
              FROM COL.SCM_ANALYTICS_STOCK SAS 
              WHERE SAS.TP_FLAG = 1
              GROUP BY 
              SAS.CD_WAREHOUSE
              ) CAB
        ON CAB.CD_WAREHOUSE = ALM.CD_WAREHOUSE 
        WHERE 1=1 AND ALM.ID_FLAG=? AND ALM.CD_WAREHOUSE_GROUP_LABEL=?
        order by ALM.CD_WAREHOUSE, CAB.QT_WAREHOUSE_STOCK ASC
      `;

    return new Promise((resolve, reject) => {
    db.query(sql, [idFlag, cdWarehouseGroupLabel], (err, results) => {
      if (err) {
        return reject(err);      
    }
      resolve(results);
    });
  });
}

const getIPRESSDetailsByCoverageandWarehouseandProduct = (idFlag, cdWarehouseGroupLabel, idGroup) => {
  const sql = `
    SELECT 
    ALM.CD_WAREHOUSE, 
    ALM.DS_WAREHOUSE, 
    ALM.ID_FLAG, 
    ALM.QT_FLAG_STOCK, 
    ALM.ID_COLOUR_1, 
    ALM.ID_COLOUR_2,
    CAB.QT_WAREHOUSE_STOCK
  FROM COL.VW_ANALYTICS_STOCK_ALL_ALM_NEW ALM
  INNER JOIN (
        SELECT 
        SUM(QT_FLAG_STOCK) AS QT_WAREHOUSE_STOCK,
        SAS.CD_WAREHOUSE
        FROM COL.SCM_ANALYTICS_STOCK SAS 
        WHERE SAS.TP_FLAG = 1
        AND SAS.COD_GROUP11_FK=?
        GROUP BY 
        SAS.CD_WAREHOUSE
        ) CAB
  ON CAB.CD_WAREHOUSE = ALM.CD_WAREHOUSE
  WHERE 1=1 AND ALM.ID_FLAG=? AND ALM.CD_WAREHOUSE_GROUP_LABEL=? AND ALM.ID_GROUP=?
  order by ALM.CD_WAREHOUSE, CAB.QT_WAREHOUSE_STOCK ASC
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [idGroup, idFlag, cdWarehouseGroupLabel, idGroup], (err, results) => {
      if (err) {
        return reject(err);      
      }
      resolve(results);
    });
  });
}

const geSKUsReportsByCoverage = (idFlag, cdWarehouse) => {
  const sql = `
  SELECT
    COD_ITEM_PK,
    DS_PRODUCT,
    CD_MU,
    ID_FLAG,
    CD_COVERAGE,
    CD_WAREHOUSE,
    DS_WAREHOUSE
  FROM COL.VW_ANALYTICS_STOCK_ALL_DET
  WHERE ID_FLAG=? 
  AND CD_WAREHOUSE=?
  ORDER BY COD_ITEM_PK
`;

return new Promise((resolve, reject) => {
  db.query(sql, [idFlag, cdWarehouse], (err, results) => {
    if(err) {
      return reject(err);
    }
      resolve(results);
    });
  });
}

module.exports = {
  listWarehouseCoverage,
  getCoverageCriterion,
  getIPRESSStockData,
  getIPRESSDetailsByCoverageandWarehouse,
  getIPRESSDetailsByCoverageandWarehouseandProduct,
  geSKUsReportsByCoverage
};
