const db = require('../config/db');
const crypto = require('crypto');

const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Hashear el password plano como en la BD
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    console.log('Password plano:', password);
    console.log('Hash generado:', hashedPassword);

  db.query(
    'SELECT * FROM COL.SEC_USERS WHERE LOGIN = ? AND PSWD = ?',
    [username, hashedPassword],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error del servidor' });

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: results[0].LOGIN,
        },
      });
    }
  );
};

const userDetails = (req, res) => {
  const {login} = req.query

  if(!login) return res.status(400).json({ error: 'Falta el parámetro login'})

  db.query(
    'SELECT s.LOGIN, s.NAME, s.CD_STALL, r.DS_STALL, s.EMAIL FROM COL.SEC_USERS s INNER JOIN COL.REG_STALL r ON s.CD_STALL = r.CD_STALL WHERE s.LOGIN = ?',
    [login],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error del servidor' });

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const user = results[0];

      console.log('data usuario', user)

      // const photoBase64 = user.PHOTO ? Buffer.from(user.PHOTO).toString('base64') : '';

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        user: {
          id: results[0].LOGIN,
          NAME: user.NAME,
          CD_STALL: user.CD_STALL,
          DS_STALL: user.DS_STALL,
          EMAIL: user.EMAIL,
          // PHOTO: user.PHOTO,
        },
      });
    }
  );
}

module.exports = {
  loginUser,
  userDetails
};
