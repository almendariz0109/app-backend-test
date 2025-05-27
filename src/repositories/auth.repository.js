const db = require('../config/db');

const findByCredentials = (username, hashedPassword) => {
  const sql = `
    SELECT * FROM COL.SEC_USERS WHERE LOGIN = ? AND PSWD = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [username, hashedPassword], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const findByLogin = (login) => {
  const sql = `
    SELECT s.LOGIN, s.NAME, s.CD_STALL, r.DS_STALL, s.EMAIL FROM COL.SEC_USERS s INNER JOIN COL.REG_STALL r ON s.CD_STALL = r.CD_STALL WHERE s.LOGIN = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [login], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = { findByCredentials, findByLogin };
