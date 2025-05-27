const authService = require('../services/auth.service');

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const userDetails = async (req, res) => {
  try {
    const { login } = req.query;
    const user = await authService.getUserDetails(login);
    res.status(200).json({
      success: true,
      message: 'Datos del usuario',
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { loginUser, userDetails };
