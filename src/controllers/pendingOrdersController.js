const pendingOrdersService = require('../services/pendingOrders.service');

const getPendingOrders = async(req, res) => {
    try {
        const data = await pendingOrdersService.getPendingOrders();
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

module.exports = {getPendingOrders}