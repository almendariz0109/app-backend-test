const crypto = require('crypto');
const userRepository = require('../repositories/auth.repository');

const login = async (username, password) => {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const user = await userRepository.findByCredentials(username, hashedPassword);

  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  return { id: user.LOGIN };
};

const getUserDetails = async (login) => {
  if (!login) {
    const err = new Error('Falta el parámetro login');
    err.status = 400;
    throw err;
  }

  const user = await userRepository.findByLogin(login);

  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  return {
    id: user.LOGIN,
    name: user.NAME,
    cd_stall: user.CD_STALL,
    ds_stall: user.DS_STALL,
    email: user.EMAIL,
    // PHOTO: user.PHOTO ? Buffer.from(user.PHOTO).toString('base64') : '',
  };
};

module.exports = { login, getUserDetails };
