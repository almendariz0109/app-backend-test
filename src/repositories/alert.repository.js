const db = require('../config/db');

const querySuggestions = ({ curve, months, product }) => {
  let sql = `SELECT
      COD_ITEM_PK,
      DS_PRODUCT,
      CD_MU,
      CURVE_XYZ,
      DESC_CURVE_XYZ,
      QT_SUGGESTION_END_0501,
      QT_SUGGESTION_END_0599,
      QT_SUGGESTION_END_0601,
      QT_SUGGESTION_END_0699,
      QT_SUGGESTION_END_0701,
      QT_SUGGESTION_END_0799,
      QT_SUGGESTION_END_9201,
      QT_SUGGESTION_END_9501,
      QT_SUGGESTION_END_9907,
      QT_SUGGESTION_END,
      QT_MONTH
    FROM VW_ANALYTICS_OC_SUGGESTIONS
    WHERE QT_MONTH = ?
      AND ID_GROUP = ?`;
  const params = [months, product];

  if (curve && curve.trim() !== '') {
    sql += ' AND CURVE_XYZ = ?';
    params.push(curve.trim());
  }

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const queryDetails = (codeItem) => {
  const sql = `
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
    CASE
            WHEN 2=2 THEN QT_SUGGESTION_END
            WHEN 3=3 THEN QT_SUGGESTION_END_3M
            WHEN 4=4 THEN QT_SUGGESTION_END_4M
            ELSE 'sin datos' 
        END AS QT_SUGGESTION_END,
    QT_PURCHASE_ORDERS
    FROM COL.VW_ANALYTICS_OC_DET_SUGG
    WHERE COD_ITEM_PK = ?
    AND ID_FLAG IN (9,10,11)
    ORDER BY 
    ST_PURCHASE DESC,
    QT_SUGGESTION_END DESC`;

  return new Promise((resolve, reject) => {
    db.query(sql, [codeItem], (err, results) => {
      if (err) {
        return reject(err);      
    }
      resolve(results);
    });
  });
};

module.exports = { querySuggestions,queryDetails };
