const alertService = require('../services/alert.service')

const getSuggestions = async (req, res) => {
  try {
    const { curve, months, product } = req.query;
    const data = await alertService.getSuggestions({ curve, months, product });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const { codeItem }  = req.query;
    const data = await alertService.getDetails(codeItem);
    res.status(200).json({ success: true, data });   
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};


module.exports = { getSuggestions, getDetails };