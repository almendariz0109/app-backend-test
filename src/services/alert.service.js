const alertRepository = require('../repositories/alert.repository');

const getSuggestions = async ({ curve, months, product }) => {
  if (!months || !product) {
    const error = new Error('Faltan parámetros requeridos');
    error.status = 400;
    throw error;
  }

  const data = await alertRepository.querySuggestions({ curve, months, product });
  return data;
};

const getDetails = async (codeItem) => {
  if (!codeItem) {
    const err = new Error('Falta el parámetro codeItem');
    err.status = 400;
    throw err;
  }

  return await alertRepository.queryDetails(codeItem);
};

module.exports = { getSuggestions, getDetails };