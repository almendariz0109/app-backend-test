const db = require('../config/db');
const getSuggestions = (req, res) => {
  const { curve, months, product } = req.query;

  if (!months || !product) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  let sql = `
    SELECT
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
    AND ID_GROUP = ?
  `;

  const params = [months, product];

  if (curve && curve.trim() !== '') {
    sql += ' AND CURVE_XYZ = ?';
    params.push(curve);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la consulta' });
    res.status(200).json({ success: true, data: results });
  });
};

module.exports = { getSuggestions };
